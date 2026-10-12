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
    soundManager.playClick();
    setIsAnimating(true);

    if (activeStep.visualEffect === 'boil' || activeStep.visualEffect === 'fry') {
      soundManager.playCookingSizzle();
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
    }, 450);
  };

  // Bỏ qua nhanh toàn bộ bước và hoàn thành ngay
  const handleQuickComplete = () => {
    soundManager.playCookComplete();
    onFinishCooking(order.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs select-none animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl border-4 border-amber-900/30 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* ================= HEADER MODAL ================= */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-yellow-200" />
            </div>
            <div>
              <h3 className="font-black text-base md:text-lg leading-tight">
                Khu Vực Chế Biến Món Ngon
              </h3>
              <p className="text-[11px] text-amber-100 font-medium">
                Đơn #{order.id.slice(-4)} • Khách: {order.customer.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all active:scale-95"
            title="Đóng trạm nấu (không mất nguyên liệu)"
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
        <div className="p-5 flex-1 flex flex-col justify-between items-center text-center space-y-4 overflow-y-auto">
          {/* Thanh tiến trình bước */}
          <div className="w-full space-y-1.5">
            <div className="flex items-center justify-between text-xs font-black text-amber-900">
              <span>
                Bước {currentStepIdx + 1} / {totalSteps}: {activeStep.title}
              </span>
              <span className="text-amber-600">{progressPercent}%</span>
            </div>
            <div className="w-full bg-amber-100 h-3 rounded-full overflow-hidden border border-amber-300">
              <div
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Sân khấu nấu ăn sinh động */}
          <div
            className={`w-full h-44 md:h-52 rounded-3xl bg-gradient-to-b from-amber-100/70 via-orange-50 to-amber-100/50 border-3 border-amber-300 p-4 flex flex-col items-center justify-center relative overflow-hidden transition-all shadow-inner ${
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

            {/* Icon minh họa nguyên liệu / thao tác của bước hiện tại */}
            <div className="relative mb-2">
              <div
                className={`w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-white border-3 border-amber-400 shadow-md flex items-center justify-center transition-transform ${
                  isAnimating ? 'animate-bounce' : 'animate-bounce-gentle'
                }`}
              >
                {activeStep.ingredientId ? (
                  <IngredientIcon ingredientId={activeStep.ingredientId} size="lg" />
                ) : (
                  <Flame className="w-10 h-10 text-orange-500" />
                )}
              </div>

              {isAnimating && (
                <span className="absolute -top-2 -right-2 text-2xl animate-spin">
                  ✨
                </span>
              )}
            </div>

            {/* Hướng dẫn thao tác bước */}
            <p className="text-sm md:text-base font-black text-amber-950 mt-1 max-w-sm">
              {activeStep.instruction}
            </p>
            <span className="text-xs text-amber-800/80 font-medium">
              Chỉ cần 1 chạm để hoàn tất bước này
            </span>
          </div>

          {/* Chỉ báo các bước tròn */}
          <div className="flex items-center justify-center gap-2">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                  idx < currentStepIdx
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : idx === currentStepIdx
                    ? 'bg-amber-600 text-white ring-2 ring-amber-300 scale-110 shadow-sm'
                    : 'bg-amber-200 text-amber-700'
                }`}
              >
                {idx < currentStepIdx ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
              </div>
            ))}
          </div>

          {/* ================= NÚT THAO TÁC TO BỰ ================= */}
          <div className="w-full pt-2">
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
              className="w-full text-base py-3.5 shadow-xl font-black uppercase tracking-wide transform hover:scale-[1.02] active:scale-95 transition-all"
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
