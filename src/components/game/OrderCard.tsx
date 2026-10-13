import React, { useState } from 'react';
import { ActiveOrder, Inventory, MenuItem } from '@/game/types';
import { INGREDIENT_DATABASE } from '@/game/data/ingredients';
import { checkDetailedOrderIngredients } from '@/game/data/recipes';
import { formatCurrency } from '@/utils/formatters';
import { GameButton } from '../ui/GameButton';
import {
  Clock,
  Check,
  AlertCircle,
  Flame,
  Sparkles,
  ChevronDown,
  ChevronUp,
  PackagePlus,
  ShoppingBag,
} from 'lucide-react';
import { CharacterAvatar } from '../common/CharacterAvatar';
import { DishIllustration } from '../common/DishIllustration';

interface OrderCardProps {
  order: ActiveOrder;
  menuItems: MenuItem[];
  inventory: Inventory;
  canAcceptCooking: boolean;
  onStartCooking: (orderId: string) => void;
  onServe: (orderId: string) => void;
  onOpenInventory: () => void;
  onQuickRestockIngredient?: (ingredientId: string, neededAmount: number) => void;
  onOpenInteractiveCooking?: (order: ActiveOrder) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  menuItems,
  inventory,
  canAcceptCooking,
  onStartCooking,
  onServe,
  onOpenInventory,
  onQuickRestockIngredient,
  onOpenInteractiveCooking,
}) => {
  const [showRecipeDetail, setShowRecipeDetail] = useState(false);

  // Kiểm tra chi tiết nguyên liệu của đơn
  const ingredientCheck = checkDetailedOrderIngredients(
    order.items,
    inventory,
    INGREDIENT_DATABASE
  );

  const canMake = ingredientCheck.canCook;
  const patiencePercent = Math.max(0, Math.min(100, (order.timeRemainingSec / order.totalTimeSec) * 100));

  const getPatienceBarColor = () => {
    if (patiencePercent > 50) return 'bg-emerald-500';
    if (patiencePercent > 20) return 'bg-amber-500';
    return 'bg-rose-500 animate-pulse';
  };

  const prepProgressPercent = order.prepTimeTotalSec > 0
    ? Math.max(0, Math.min(100, (1 - order.prepTimeRemainingSec / order.prepTimeTotalSec) * 100))
    : 100;

  // Xử lý khi bấm nút bắt đầu nấu
  const handleCookClick = () => {
    if (onOpenInteractiveCooking) {
      onOpenInteractiveCooking(order);
    } else {
      onStartCooking(order.id);
    }
  };

  return (
    <div
      className={`relative rounded-2xl p-3.5 shadow-md flex flex-col justify-between gap-2.5 transition-all ${
        order.status === 'ready_to_serve'
          ? 'bg-emerald-50/95 border-2 border-emerald-500 shadow-lg ring-2 ring-emerald-300 animate-pulse-subtle'
          : order.status === 'preparing'
          ? 'bg-amber-50/95 border-2 border-orange-400'
          : 'bg-white/95 border-2 border-amber-900/15'
      }`}
    >
      {/* 1. Thanh đo thời gian kiên nhẫn của khách */}
      <div className="w-full bg-amber-100 h-2 rounded-full overflow-hidden border border-amber-200">
        <div
          className={`h-full transition-all duration-300 rounded-full ${getPatienceBarColor()}`}
          style={{ width: `${patiencePercent}%` }}
        ></div>
      </div>

      {/* 2. Thông tin khách hàng & Lời thoại */}
      <div className="flex items-start gap-2.5">
        <CharacterAvatar
          characterId={order.customer.templateId || order.customer.id}
          size="md"
          mood={
            order.status === 'ready_to_serve'
              ? 'happy'
              : patiencePercent < 30
              ? 'impatient'
              : 'neutral'
          }
          fallbackEmoji={order.customer.avatar}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 truncate">
              <h4 className="text-xs md:text-sm font-black text-amber-950 truncate">
                {order.customer.name}
              </h4>
              {order.customer.friendshipLevel && order.customer.friendshipLevel > 1 && (
                <span className="text-[10px] font-black text-rose-600 bg-rose-100 px-1.5 py-0.2 rounded-md flex-shrink-0">
                  ❤️ C{order.customer.friendshipLevel}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-800 flex-shrink-0">
              <Clock className="w-3.5 h-3.5" />
              <span>{Math.ceil(order.timeRemainingSec)}s</span>
            </div>
          </div>
          <p className="text-[11px] text-amber-800/80 italic line-clamp-1 mt-0.5">
            "{patiencePercent < 25 ? (order.customer.dialogueAngry || 'Sắp muộn giờ rồi bạn ơi!') : order.customer.dialogueIntro}"
          </p>
        </div>
      </div>

      {/* 3. Danh sách món trong đơn với hình minh họa 2D */}
      <div className="bg-amber-50/80 rounded-xl p-2 border border-amber-200/80 space-y-1.5">
        {order.items.map((item, idx) => {
          const menuItem = menuItems.find((m) => m.id === item.menuItemId);
          return (
            <div key={idx} className="flex items-center justify-between text-xs gap-2">
              <div className="flex items-center gap-1.5 truncate">
                <DishIllustration itemId={item.menuItemId} size="sm" />
                <span className="font-bold text-amber-950 truncate">
                  {menuItem ? menuItem.name : item.menuItemId}
                </span>
              </div>
              <span className="font-extrabold text-amber-900 flex-shrink-0">
                x{item.quantity}
              </span>
            </div>
          );
        })}
      </div>

      {/* 4. KIỂM TRA NGUYÊN LIỆU KHO (ĐỦ / THIẾU CHI TIẾT) */}
      {order.status === 'waiting' && (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-amber-900 flex items-center gap-1">
              Nguyên liệu kho:
              {canMake ? (
                <span className="text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-md text-[10px]">
                  ✓ Đã đủ
                </span>
              ) : (
                <span className="text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded-md text-[10px]">
                  Thiếu {ingredientCheck.totalMissingCount} món
                </span>
              )}
            </span>
            <button
              onClick={() => setShowRecipeDetail(!showRecipeDetail)}
              className="text-[10px] text-amber-700 font-bold flex items-center gap-0.5 hover:text-amber-950"
            >
              {showRecipeDetail ? 'Thu gọn' : 'Xem chi tiết'}
              {showRecipeDetail ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {/* Chi tiết nguyên liệu khi mở rộng hoặc khi thiếu */}
          {(showRecipeDetail || !canMake) && (
            <div className="bg-white/90 rounded-xl p-2 border border-amber-200 space-y-1 text-xs">
              {ingredientCheck.ingredients.map((ing) => (
                <div
                  key={ing.ingredientId}
                  className={`flex items-center justify-between p-1 rounded-lg text-[11px] ${
                    ing.isSufficient ? 'bg-emerald-50/70 text-emerald-950' : 'bg-rose-50 text-rose-950 border border-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-1 truncate pr-1">
                    <span className="truncate">
                      {ing.name}: cần <strong>{ing.needed}</strong>, có <strong>{ing.available}</strong>
                    </span>
                  </div>

                  {ing.isSufficient ? (
                    <span className="text-emerald-700 font-extrabold text-[10px] flex-shrink-0">
                      ✓ Đủ
                    </span>
                  ) : (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="text-rose-700 font-black text-[10px]">
                        Thiếu {ing.missing}
                      </span>
                      {onQuickRestockIngredient && (
                        <button
                          onClick={() => onQuickRestockIngredient(ing.ingredientId, ing.missing)}
                          className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold px-1.5 py-0.5 rounded text-[10px] flex items-center gap-0.5 shadow-2xs active:scale-95 transition-all"
                          title={`Mở chợ nhập thêm ${ing.name}`}
                        >
                          <PackagePlus className="w-2.5 h-2.5" /> Nhập
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. Tiến độ nấu (Nếu đang chế biến) */}
      {order.status === 'preparing' && (
        <div className="bg-orange-100/80 rounded-xl p-2 border border-orange-300 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-black text-orange-950">
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-600 animate-bounce" />
              Đang chế biến...
            </span>
            <span>còn {Math.ceil(order.prepTimeRemainingSec)}s</span>
          </div>
          <div className="w-full bg-orange-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-orange-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${prepProgressPercent}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* 6. Thông báo sẵn sàng giao */}
      {order.status === 'ready_to_serve' && (
        <div className="bg-emerald-100 rounded-xl p-1.5 border border-emerald-300 text-center text-xs font-black text-emerald-900 flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Món đã làm xong nóng hổi! Bấm giao để nhận tiền!
        </div>
      )}

      {/* 7. Chân thẻ: Giá tiền & Nút Thao Tác Theo Trạng Thái */}
      <div className="flex items-center justify-between pt-1 border-t border-amber-100">
        <div>
          <span className="text-[10px] text-amber-800 uppercase font-bold block">Tổng tiền:</span>
          <span className="text-sm md:text-base font-black text-emerald-700">
            {formatCurrency(order.totalPrice)}
          </span>
        </div>

        {/* Nút thao tác tương ứng trạng thái */}
        {order.status === 'waiting' && (
          canMake ? (
            <GameButton
              variant="primary"
              size="sm"
              icon={<Flame className="w-4 h-4" />}
              disabled={!canAcceptCooking}
              onClick={handleCookClick}
            >
              {canAcceptCooking ? 'Bắt Đầu Chế Biến' : 'Bếp Đang Đầy'}
            </GameButton>
          ) : (
            <div className="flex flex-col items-end gap-1">
              <button
                onClick={onOpenInventory}
                className="text-[11px] font-extrabold text-rose-600 hover:text-rose-800 flex items-center gap-1 underline"
              >
                <ShoppingBag className="w-3 h-3" />
                Vào Chợ Nhập Hàng
              </button>
              <GameButton variant="secondary" size="sm" disabled title="Kho đang thiếu nguyên liệu">
                Thiếu nguyên liệu
              </GameButton>
            </div>
          )
        )}

        {order.status === 'preparing' && (
          <GameButton variant="secondary" size="sm" disabled icon={<Flame className="w-3.5 h-3.5 text-orange-500 animate-spin" />}>
            Đang nấu...
          </GameButton>
        )}

        {order.status === 'ready_to_serve' && (
          <GameButton
            variant="success"
            size="sm"
            icon={<Check className="w-4 h-4 stroke-[3]" />}
            onClick={() => onServe(order.id)}
            className="animate-bounce-gentle shadow-lg font-black"
          >
            Giao Món Ngay
          </GameButton>
        )}
      </div>
    </div>
  );
};
