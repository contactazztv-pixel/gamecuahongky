import React from 'react';
import { ActiveOrder, Inventory, MenuItem } from '@/game/types';
import { OrderCard } from './OrderCard';
import { GameButton } from '../ui/GameButton';
import { DishIllustration } from '../common/DishIllustration';
import { CharacterAvatar } from '../common/CharacterAvatar';
import { formatCurrency } from '@/utils/formatters';
import {
  Megaphone,
  Users,
  Flame,
  Sparkles,
  CheckCircle,
  BellRing,
} from 'lucide-react';
import { soundManager } from '@/services/audio/soundEffects';

interface CustomerQueueProps {
  orders: ActiveOrder[];
  menuItems: MenuItem[];
  inventory: Inventory;
  cookingSlotsCount: number;
  onStartCooking: (orderId: string) => void;
  onServe: (orderId: string) => void;
  onOpenInventory: () => void;
  onCallCustomer: () => void;
  onQuickRestockIngredient?: (ingredientId: string, neededAmount: number) => void;
  onOpenInteractiveCooking?: (order: ActiveOrder) => void;
}

export const CustomerQueue: React.FC<CustomerQueueProps> = ({
  orders,
  menuItems,
  inventory,
  cookingSlotsCount,
  onStartCooking,
  onServe,
  onOpenInventory,
  onCallCustomer,
  onQuickRestockIngredient,
  onOpenInteractiveCooking,
}) => {
  const busySlotsCount = orders.filter(
    (o) => o.status === 'preparing' || o.status === 'ready_to_serve'
  ).length;

  const canAcceptCooking = busySlotsCount < cookingSlotsCount;

  // Lọc các đơn đã nấu xong chờ phục vụ khách
  const readyOrders = orders.filter((o) => o.status === 'ready_to_serve');
  const pendingOrders = orders.filter((o) => o.status !== 'ready_to_serve');

  return (
    <div className="space-y-4 select-none">
      {/* ================= KHU VỰC 1: KHAY MÓN NÓNG HỔI CHỜ GIAO KHÁCH ================= */}
      {readyOrders.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-3 border-emerald-400 rounded-3xl p-3.5 shadow-md space-y-2.5 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-xs md:text-sm font-black text-emerald-950 flex items-center gap-1.5 uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
              Khay Món Chờ Giao ({readyOrders.length} Món Đã Xong)
            </h3>
            <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-full">
              Bấm để trao khách ngay
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {readyOrders.map((order) => {
              const primaryItem = order.items[0];
              const menuItem = menuItems.find((m) => m.id === primaryItem?.menuItemId);

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-3 border-2 border-emerald-400 shadow-sm flex items-center justify-between gap-2.5 hover:shadow-md transition-all ring-1 ring-emerald-300"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 p-1 flex items-center justify-center shadow-inner flex-shrink-0">
                      <DishIllustration itemId={primaryItem.menuItemId} size="md" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <CharacterAvatar
                          characterId={order.customer.templateId || order.customer.id}
                          size="sm"
                          mood="happy"
                          fallbackEmoji={order.customer.avatar}
                        />
                        <span className="font-extrabold text-xs text-amber-950 truncate">
                          {order.customer.name}
                        </span>
                      </div>
                      <span className="font-black text-xs text-emerald-900 block truncate mt-0.5">
                        {menuItem ? menuItem.name : primaryItem.menuItemId} (x{primaryItem.quantity})
                      </span>
                      <span className="text-[11px] font-black text-emerald-700 block">
                        Thu: {formatCurrency(order.totalPrice)}
                      </span>
                    </div>
                  </div>

                  <GameButton
                    variant="success"
                    size="sm"
                    icon={<CheckCircle className="w-4 h-4" />}
                    onClick={() => onServe(order.id)}
                    className="font-black shadow-md flex-shrink-0 animate-bounce-gentle"
                  >
                    Giao Món
                  </GameButton>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= KHU VỰC 2: HÀNG ĐỢI GỌI MÓN & TRẠM BẾP ================= */}
      <div className="space-y-3">
        {/* Header khu vực đơn hàng & trạng thái bếp */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-200 rounded-xl text-amber-900">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-black text-amber-950 flex items-center gap-2">
                <span>Khách Đang Đợi Món ({orders.length}/4)</span>
              </h3>
              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-800">
                <Flame className="w-3 h-3 text-orange-600" />
                <span>
                  Trạm bếp: {busySlotsCount}/{cookingSlotsCount} đang dùng
                </span>
              </div>
            </div>
          </div>

          {/* Nút rao hàng thu hút thêm khách */}
          <GameButton
            variant="secondary"
            size="sm"
            icon={<Megaphone className="w-3.5 h-3.5 text-amber-800" />}
            onClick={() => {
              soundManager.playCustomerBell();
              onCallCustomer();
            }}
            disabled={orders.length >= 4}
          >
            Rao vỉa hè (+Khách)
          </GameButton>
        </div>

        {/* Danh sách thẻ đơn hàng hoặc màn hình chờ */}
        {orders.length === 0 ? (
          <div className="bg-amber-100/50 border-2 border-dashed border-amber-300 rounded-2xl p-6 text-center">
            <div className="text-3xl mb-2 animate-bounce-gentle">🔔</div>
            <p className="text-sm font-bold text-amber-900">
              Cổng trường đang yên ắng, sắp có học sinh ùa ra rồi!
            </p>
            <p className="text-xs text-amber-700/80 mt-1">
              Bấm nút <strong>"Rao vỉa hè"</strong> hoặc chờ vài giây để đón lượt khách tiếp theo.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                menuItems={menuItems}
                inventory={inventory}
                canAcceptCooking={canAcceptCooking}
                onStartCooking={onStartCooking}
                onServe={onServe}
                onOpenInventory={onOpenInventory}
                onQuickRestockIngredient={onQuickRestockIngredient}
                onOpenInteractiveCooking={onOpenInteractiveCooking}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
