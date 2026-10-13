import React, { useState } from 'react';
import { ActiveOrder, MenuItem } from '@/game/types';
import { DISH_RECIPES } from '@/game/data/recipes';
import { formatCurrency } from '@/utils/formatters';
import { GameButton } from '@/components/ui/GameButton';
import { DishIllustration } from '@/components/common/DishIllustration';
import { IngredientIcon } from '@/components/common/IngredientIcon';
import { soundManager } from '@/services/audio/soundEffects';
import {
  X,
  Sparkles,
  Flame,
  CheckCircle2,
  Clock,
  FastForward,
  ChefHat,
  ArrowRight,
} from 'lucide-react';

interface InteractiveCookingModalProps {
  order: ActiveOrder | null;
  menuItems: MenuItem[];
  onClose: () => void;
  onFinishCooking: (orderId: string) => void;
}

export const InteractiveCookingModal: React.FC<InteractiveCookingModalProps> = ({
  order,
  menuItems,
  onClose,
  onFinishCooking,
}) => {
  if (!order) return null;

  // Lấy món ăn chính của đơn hàng
  const primaryItem = order.items[0];
  const menuItem = menuItems.find((m) => m.id === primaryItem?.menuItemId);
  const recipe = DISH_RECIPES[primaryItem?.menuItemId] || null;

  // Tạo các bước mặc định nếu món chưa có trong danh mục riêng
  const defaultSteps = [
    {
      stepIndex: 1,
      title: 'Chuẩn bị nguyên liệu tươi ngon',
      instruction: 'Đo lường và sơ chế nguyên liệu theo công thức',
      actionLabel: 'Sơ chế nguyên liệu',
      visualEffect: 'pour' as const,
    },
    {
      stepIndex: 2,
      title: 'Chế biến & hòa quyện hương vị',
      instruction: 'Tiến hành nấu, đảo đều và gia nhiệt vừa lửa',
      actionLabel: 'Nấu & hòa quyện vị',
      visualEffect: 'stir' as const,
    },
    {
      stepIndex: 3,
      title: 'Hoàn thiện & đóng gói trao khách',
      instruction: 'Đơm ra đĩa hoặc ly đóng nắp sạch sẽ thơm ngon',
      actionLabel: 'Hoàn thành món ăn',
      visualEffect: 'pack' as const,
    },
  ];

  const steps = recipe?.steps || defaultSteps;
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const totalSteps = steps.length;
  const activeStep = steps[currentStepIdx] || steps[0];
  const progressPercent = Math.round(((currentStepIdx + 1) / totalSteps) * 100);

  // Xử lý thực hiện bước hiện tại
  const handlePerformStep = () => {
    setIsAnimating(true);

    if (activeStep.visualEffect === 'boil' || activeStep.visualEffect === 'fry') {
      soundManager.playCookingSizzle();
    } else if (activeStep.visualEffect === 'pour') {
      soundManager.playPourLiquid();
    } else if (activeStep.visualEffect === 'stir') {
      soundManager.playShaker();
    } else if (activeStep.visualEffect === 'pack' || activeStep.visualEffect === 'garnish') {
      soundManager.playClick();
    } else {
      soundManager.playChop();
    }

    setTimeout(() => {
      setIsAnimating(false);
      if (currentStepIdx < totalSteps - 1) {
        setCurrentStepIdx((prev) => prev + 1);
      } else {
        // Đã hoàn thành bước cuối cùng!
        soundManager.playCookComplete();
        onFinishCooking(order.id);
        onClose();
      }
    }, 550);
  };

  // Bỏ qua nhanh toàn bộ bước và hoàn thành ngay
  const handleQuickComplete = () => {
    soundManager.playCookComplete();
    onFinishCooking(order.id);
    onClose();
  };

  // Hiển thị visual tương tác theo từng loại động tác nấu ăn
  const renderVisualStage = () => {
    const effect = activeStep.visualEffect;

    if (effect === 'pour') {
      return (
        <div className="relative flex items-center justify-center gap-3 md:gap-4 my-2">
          {/* Chai / bình / túi nguyên liệu rót */}
          <div className={`transition-all duration-300 ${isAnimating ? '-rotate-45 -translate-y-2' : ''}`}>
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-[#F7F2E7] border-3 border-amber-300 shadow-md flex items-center justify-center">
              {activeStep.ingredientId ? (
                <IngredientIcon ingredientId={activeStep.ingredientId} size="lg" />
              ) : (
                <Flame className="w-8 h-8 text-orange-500" />
              )}
            </div>
          </div>

          {/* Dòng nước rót lấp lánh khi đang thao tác */}
          {isAnimating ? (
            <div className="flex flex-col items-center gap-0.5 animate-pulse">
              <div className="w-2 h-8 bg-gradient-to-b from-amber-500 to-amber-700 rounded-full"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-800 animate-ping"></div>
            </div>
          ) : (
            <span className="text-xl text-amber-500 font-black animate-pulse">➔</span>
          )}

          {/* Cốc hoặc bát đón nhận */}
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-[#F7F2E7] border-3 border-amber-300 shadow-md flex items-center justify-center">
            <DishIllustration itemId={primaryItem.menuItemId} size="md" />
          </div>
        </div>
      );
    }

    if (effect === 'stir') {
      return (
        <div className="relative flex items-center justify-center my-2">
          <div className={`relative transition-transform ${isAnimating ? 'animate-spin' : 'animate-bounce-gentle'}`}>
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-[#F7F2E7] border-3 border-amber-400 shadow-md flex items-center justify-center">
              {activeStep.ingredientId ? (
                <IngredientIcon ingredientId={activeStep.ingredientId} size="lg" />
              ) : (
                <DishIllustration itemId={primaryItem.menuItemId} size="lg" />
              )}
            </div>
            {isAnimating && (
              <div className="absolute -inset-1.5 rounded-3xl border-3 border-dashed border-amber-500 animate-spin"></div>
            )}
          </div>
        </div>
      );
    }

    if (effect === 'boil' || effect === 'fry') {
      return (
        <div className="relative flex flex-col items-center justify-center my-2">
          <div className={`relative ${isAnimating ? 'animate-bounce' : ''}`}>
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-[#F7F2E7] border-3 border-orange-400 shadow-md flex items-center justify-center">
              {activeStep.ingredientId ? (
                <IngredientIcon ingredientId={activeStep.ingredientId} size="lg" />
              ) : (
                <DishIllustration itemId={primaryItem.menuItemId} size="lg" />
              )}
            </div>
            {/* Ngọn lửa xèo xèo ấm cúng */}
            <div className="flex justify-center gap-1 -mt-2">
              <span className="text-xl animate-bounce">🔥</span>
              <span className="text-2xl animate-pulse">🔥</span>
              <span className="text-xl animate-bounce" style={{ animationDelay: '0.15s' }}>🔥</span>
            </div>
          </div>
        </div>
      );
    }

    // Garnish / Pack / Default
    return (
      <div className="relative flex items-center justify-center my-2">
        <div
          className={`w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-[#F7F2E7] border-3 border-amber-400 shadow-md flex items-center justify-center transition-transform ${
            isAnimating ? 'scale-110 rotate-3' : 'animate-bounce-gentle'
          }`}
        >
          {currentStepIdx === totalSteps - 1 ? (
            <DishIllustration itemId={primaryItem.menuItemId} size="lg" />
          ) : activeStep.ingredientId ? (
            <IngredientIcon ingredientId={activeStep.ingredientId} size="lg" />
          ) : (
            <Flame className="w-10 h-10 text-orange-500" />
          )}
        </div>
        {isAnimating && (
          <span className="absolute -top-3 -right-3 text-2xl animate-ping">
            ✨
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/70 backdrop-blur-xs select-none animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl border-3 sm:border-4 border-amber-900/30 shadow-2xl overflow-hidden flex flex-col max-h-[calc(100dvh-16px)] sm:max-h-[90vh]">
        {/* ================= HEADER MODAL ================= */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 px-3.5 sm:px-4 py-3 sm:py-3.5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <ChefHat className="w-5 h-5 text-yellow-200" />
            </div>
            <div className="min-w-0">
              <h3 className="font-black text-sm sm:text-base md:text-lg leading-tight truncate">
                Khu Vực Chế Biến Món Ngon
              </h3>
              <p className="text-[10px] sm:text-[11px] text-amber-100 font-medium truncate">
                Đơn #{order.id.slice(-4)} • Khách: {order.customer.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all active:scale-95 flex-shrink-0"
            title="Đóng trạm nấu (không mất nguyên liệu)"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ================= THÔNG TIN MÓN ĐANG LÀM ================= */}
        <div className="p-4 bg-amber-50/80 border-b border-amber-200/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-white border-2 border-amber-300 p-1 flex items-center justify-center shadow-inner flex-shrink-0">
              <DishIllustration itemId={primaryItem.menuItemId} size="lg" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base text-amber-950">
                  {menuItem?.name || primaryItem.menuItemId}
                </span>
                <span className="bg-amber-200 text-amber-900 text-xs font-black px-2 py-0.5 rounded-md">
                  x{primaryItem.quantity}
                </span>
              </div>
              <p className="text-xs text-amber-800/80 line-clamp-1 mt-0.5">
                {menuItem?.description || 'Món quà vặt thơm lừng học đường'}
              </p>
              <span className="text-xs font-bold text-emerald-700">
                Giá thu: {formatCurrency(order.totalPrice)}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <div className="flex items-center gap-1 text-xs font-bold text-amber-900 bg-white px-2 py-1 rounded-lg border border-amber-200">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>{Math.ceil(order.timeRemainingSec)}s</span>
            </div>
            <button
              onClick={handleQuickComplete}
              className="text-[11px] font-extrabold text-amber-700 hover:text-amber-950 flex items-center gap-1 underline mt-0.5"
              title="Bỏ qua các bước để hoàn thành nhanh"
            >
              <FastForward className="w-3 h-3" /> Nấu nhanh
            </button>
          </div>
        </div>

        {/* ================= KHÔNG GIAN BẾP CHẾ BIẾN TRỰC QUAN 2D ================= */}
        <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between items-center text-center space-y-3 sm:space-y-4 overflow-y-auto">
          {/* Thanh tiến trình bước */}
          <div className="w-full space-y-1">
            <div className="flex items-center justify-between text-xs font-black text-amber-900">
              <span className="truncate pr-2">
                Bước {currentStepIdx + 1} / {totalSteps}: {activeStep.title}
              </span>
              <span className="text-amber-600 flex-shrink-0">{progressPercent}%</span>
            </div>
            <div className="w-full bg-amber-100 h-2.5 sm:h-3 rounded-full overflow-hidden border border-amber-300">
              <div
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Sân khấu nấu ăn sinh động */}
          <div
            className={`w-full h-36 xs:h-40 sm:h-44 md:h-52 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-amber-100/70 via-orange-50 to-amber-100/50 border-3 border-amber-300 p-2.5 sm:p-4 flex flex-col items-center justify-center relative overflow-hidden transition-all shadow-inner ${
              isAnimating ? 'scale-[1.02] ring-4 ring-amber-400' : ''
            }`}
          >
            {/* Hiệu ứng khói / hơi nước bốc lên */}
            {isAnimating && (
              <div className="absolute top-2 inset-x-0 flex justify-center gap-3 pointer-events-none">
                <span className="w-3 h-8 bg-white/70 rounded-full animate-steam"></span>
                <span className="w-2.5 h-6 bg-white/60 rounded-full animate-steam" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-3 h-7 bg-white/70 rounded-full animate-steam" style={{ animationDelay: '0.4s' }}></span>
              </div>
            )}

            {/* Khung visual minh họa động tác chế biến sinh động */}
            {renderVisualStage()}

            {/* Hướng dẫn thao tác bước */}
            <p className="text-xs sm:text-sm md:text-base font-black text-amber-950 mt-1 max-w-sm line-clamp-2">
              {activeStep.instruction}
            </p>
            <span className="text-[11px] sm:text-xs text-amber-800/80 font-medium hidden xs:inline">
              Chỉ cần 1 chạm để hoàn tất bước này
            </span>
          </div>

          {/* Chỉ báo các bước tròn */}
          <div className="flex items-center justify-center gap-2">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                  idx < currentStepIdx
                    ? 'bg-emerald-500 text-white shadow-2xs'
                    : idx === currentStepIdx
                    ? 'bg-amber-600 text-white ring-2 ring-amber-300 scale-110 shadow-xs'
                    : 'bg-amber-200 text-amber-700'
                }`}
              >
                {idx < currentStepIdx ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
              </div>
            ))}
          </div>

          {/* ================= NÚT THAO TÁC TO BỰ ================= */}
          <div className="w-full pt-1.5 pb-[max(0.2rem,env(safe-area-inset-bottom))]">
            <GameButton
              variant="primary"
              size="lg"
              onClick={handlePerformStep}
              disabled={isAnimating}
              icon={
                currentStepIdx === totalSteps - 1 ? (
                  <Sparkles className="w-5 h-5 text-yellow-200 animate-spin" />
                ) : (
                  <ArrowRight className="w-5 h-5" />
                )
              }
              className="w-full text-sm sm:text-base py-3 sm:py-3.5 min-h-[48px] shadow-xl font-black uppercase tracking-wide transform hover:scale-[1.02] active:scale-95 transition-all"
            >
              {isAnimating
                ? 'Đang thực hiện...'
                : currentStepIdx === totalSteps - 1
                ? '★ HOÀN THÀNH MÓN ĂN ★'
                : activeStep.actionLabel}
            </GameButton>
          </div>
        </div>
      </div>
    </div>
  );
};
