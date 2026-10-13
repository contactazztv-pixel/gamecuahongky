import React from 'react';
import { ActiveOrder } from '@/game/types';
import { CharacterAvatar } from '../common/CharacterAvatar';
import { DishIllustration } from '../common/DishIllustration';
import { Check, Sparkles, Clock, AlertTriangle } from 'lucide-react';

interface SceneCustomerQueueProps {
  orders: ActiveOrder[];
  onServe: (orderId: string) => void;
  onOpenCooking?: (order: ActiveOrder) => void;
  onCallCustomer?: () => void;
}

export const SceneCustomerQueue: React.FC<SceneCustomerQueueProps> = ({
  orders,
  onServe,
  onOpenCooking,
  onCallCustomer,
}) => {
  if (orders.length === 0) {
    return (
      <div
        onClick={onCallCustomer}
        className="cursor-pointer group flex items-center gap-1.5 bg-white/90 hover:bg-amber-100 border border-amber-300 text-amber-900 px-3 py-1.5 rounded-2xl shadow-sm text-xs font-black transition-all active:scale-95 animate-bounce-gentle"
        title="Bấm để rao hàng thu hút khách"
      >
        <span>📣</span>
        <span>Rao hàng vỉa hè (+Khách)</span>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2.5 sm:gap-4 select-none">
      {orders.map((order, index) => {
        const isFirst = index === 0;
        const isReady = order.status === 'ready_to_serve';
        const isCooking = order.status === 'preparing';
        const patiencePercent = Math.max(0, Math.min(100, (order.timeRemainingSec / order.totalTimeSec) * 100));
        const isUrgent = patiencePercent < 25;
        const primaryItem = order.items[0];

        const handleCustomerClick = () => {
          if (isReady) {
            onServe(order.id);
          } else if (onOpenCooking) {
            onOpenCooking(order);
          }
        };

        return (
          <div
            key={order.id}
            onClick={handleCustomerClick}
            className={`relative flex flex-col items-center cursor-pointer group transition-transform ${
              isReady
                ? 'scale-105 animate-bounce-gentle'
                : isUrgent
                ? 'animate-wiggle'
                : 'hover:scale-105'
            }`}
            style={{
              zIndex: 30 - index,
              opacity: index > 2 ? 0.75 : 1,
            }}
            title={
              isReady
                ? `Món đã xong! Bấm để giao cho ${order.customer.name}`
                : `Bấm để mở chế biến món cho ${order.customer.name}`
            }
          >
            {/* ================= BONG BÓNG THOẠI GỌI MÓN TRÊN ĐẦU KHÁCH ================= */}
            <div className="relative mb-1">
              <div
                className={`px-2 py-1 rounded-2xl shadow-md border-2 flex items-center gap-1.5 transition-all ${
                  isReady
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-300 animate-pulse'
                    : isUrgent
                    ? 'bg-rose-50 border-rose-400 text-rose-950 animate-bounce'
                    : 'bg-white/95 border-amber-300 text-amber-950'
                }`}
              >
                {/* Icon món ăn khách đang chờ */}
                {primaryItem && (
                  <DishIllustration itemId={primaryItem.menuItemId} size="sm" className="w-6 h-6 shrink-0" />
                )}

                {/* Trạng thái đơn */}
                {isReady ? (
                  <div className="flex items-center gap-0.5 text-[10px] font-black text-emerald-700">
                    <Sparkles className="w-3 h-3 text-emerald-500 animate-spin" />
                    <span>Lấy món!</span>
                  </div>
                ) : isCooking ? (
                  <div className="flex items-center gap-0.5 text-[10px] font-bold text-orange-600">
                    <span>⏳</span>
                    <span>Đang nấu</span>
                  </div>
                ) : isUrgent ? (
                  <div className="flex items-center gap-0.5 text-[10px] font-black text-rose-600">
                    <span>💦</span>
                    <span>{Math.ceil(order.timeRemainingSec)}s</span>
                  </div>
                ) : (
                  <span className="text-[10px] font-extrabold text-amber-900">
                    x{primaryItem?.quantity || 1}
                  </span>
                )}
              </div>

              {/* Mũi nhọn tam giác chỉ vào đầu khách */}
              <div
                className={`w-2 h-2 rotate-45 mx-auto -mt-1 border-r-2 border-b-2 ${
                  isReady
                    ? 'bg-emerald-50 border-emerald-500'
                    : isUrgent
                    ? 'bg-rose-50 border-rose-400'
                    : 'bg-white border-amber-300'
                }`}
              ></div>
            </div>

            {/* ================= NHÂN VẬT KHÁCH HÀNG CHIBI ================= */}
            <div className="relative">
              {/* Avatar chibi biểu cảm */}
              <div className="relative">
                <CharacterAvatar
                  characterId={order.customer.templateId || order.customer.id.split('_')[0]}
                  size={isFirst ? 'md' : 'sm'}
                  mood={isReady ? 'happy' : isUrgent ? 'impatient' : 'neutral'}
                  fallbackEmoji={order.customer.avatar}
                  className="shadow-sm"
                />

                {/* Icon biểu cảm nhỏ góc trên */}
                {isReady && (
                  <span className="absolute -top-1 -right-1 text-xs animate-bounce">
                    💖
                  </span>
                )}
                {isUrgent && (
                  <span className="absolute -top-1 -right-1 text-xs animate-pulse">
                    💦
                  </span>
                )}
              </div>

              {/* Tên khách hàng */}
              <div className="bg-amber-950/80 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full text-center mt-0.5 truncate max-w-[60px] mx-auto border border-amber-400/30">
                {order.customer.name.split(' ')[0]}
              </div>

              {/* Thanh kiên nhẫn mini */}
              {!isReady && (
                <div className="w-10 h-1 bg-black/20 rounded-full mx-auto mt-0.5 overflow-hidden border border-white/60">
                  <div
                    className={`h-full transition-all ${
                      patiencePercent > 50
                        ? 'bg-emerald-400'
                        : patiencePercent > 25
                        ? 'bg-amber-400'
                        : 'bg-rose-500 animate-pulse'
                    }`}
                    style={{ width: `${patiencePercent}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
