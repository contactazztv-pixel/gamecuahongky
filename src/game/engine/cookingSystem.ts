import { ActiveOrder, Inventory, MenuItem, OrderReview } from '../types';
import { checkIngredientsAvailable } from './orderGenerator';

export interface StartCookingResult {
  success: boolean;
  reason?: string;
  updatedOrder?: ActiveOrder;
  updatedInventory?: Inventory;
  consumedCost?: number;
}

/**
 * Kiểm tra xem có thể bắt đầu nấu đơn hàng này hay không
 */
export function canStartCooking(
  order: ActiveOrder,
  menuItems: MenuItem[],
  inventory: Inventory,
  activeOrders: ActiveOrder[],
  cookingSlotsCount: number
): { ok: boolean; reason?: string } {
  if (order.status !== 'waiting') {
    return { ok: false, reason: 'Đơn hàng này không ở trạng thái chờ chế biến.' };
  }

  // Đếm số đơn đang chiếm trạm bếp
  const busySlotsCount = activeOrders.filter(
    (o) => o.status === 'preparing' || o.status === 'ready_to_serve'
  ).length;

  if (busySlotsCount >= cookingSlotsCount) {
    return {
      ok: false,
      reason: `Các trạm bếp đang hoạt động hết công suất (${busySlotsCount}/${cookingSlotsCount}). Hãy nâng cấp thêm trạm bếp trong mục Nâng Cấp!`,
    };
  }

  // Kiểm tra nguyên liệu trong kho
  const { canMake, missingIngredientNames } = checkIngredientsAvailable(order, menuItems, inventory);
  if (!canMake) {
    return {
      ok: false,
      reason: `Thiếu nguyên liệu: ${missingIngredientNames.join(', ')}. Hãy vào mục Kho & Nhập Hàng để mua thêm!`,
    };
  }

  return { ok: true };
}

/**
 * Bắt đầu chế biến đơn hàng: Trừ nguyên liệu nguyên tử ngay khi lên bếp
 */
export function startCookingOrder(
  order: ActiveOrder,
  menuItems: MenuItem[],
  inventory: Inventory,
  activeOrders: ActiveOrder[],
  cookingSlotsCount: number,
  prepSpeedMultiplier: number = 1.0 // 0.75 nếu có máy dập / bếp thần tốc
): StartCookingResult {
  const check = canStartCooking(order, menuItems, inventory, activeOrders, cookingSlotsCount);
  if (!check.ok) {
    return { success: false, reason: check.reason };
  }

  // 1. Trừ nguyên liệu thực tế khỏi kho
  const updatedInv = { ...inventory };
  let consumedCost = 0;

  order.items.forEach((item) => {
    const menuItem = menuItems.find((m) => m.id === item.menuItemId);
    if (!menuItem) return;

    consumedCost += menuItem.baseCost * item.quantity;
    menuItem.ingredients.forEach((req) => {
      const needed = req.amount * item.quantity;
      updatedInv[req.ingredientId] = Math.max(0, (updatedInv[req.ingredientId] || 0) - needed);
    });
  });

  // 2. Tính thời gian chế biến đơn hàng
  const maxItemPrepTime = Math.max(
    ...order.items.map((item) => {
      const mi = menuItems.find((m) => m.id === item.menuItemId);
      return mi ? mi.preparationTimeSec : 4;
    })
  );
  const totalPrepTime = Math.max(2, Math.round(maxItemPrepTime * prepSpeedMultiplier));

  // 3. Cập nhật trạng thái đơn sang 'preparing'
  const updatedOrder: ActiveOrder = {
    ...order,
    status: 'preparing',
    prepTimeRemainingSec: totalPrepTime,
    prepTimeTotalSec: totalPrepTime,
    baseCost: consumedCost,
  };

  return {
    success: true,
    updatedOrder,
    updatedInventory: updatedInv,
    consumedCost,
  };
}

/**
 * Cập nhật tiến độ nấu và thời gian kiên nhẫn của toàn bộ đơn hàng
 */
export function tickCookingOrders(
  orders: ActiveOrder[],
  deltaSec: number
): {
  updatedOrders: ActiveOrder[];
  expiredOrders: ActiveOrder[];
  readyOrderIds: string[];
} {
  const updatedOrders: ActiveOrder[] = [];
  const expiredOrders: ActiveOrder[] = [];
  const readyOrderIds: string[] = [];

  orders.forEach((order) => {
    // 1. Nếu đơn đang nấu 'preparing'
    if (order.status === 'preparing') {
      const nextPrep = Math.max(0, order.prepTimeRemainingSec - deltaSec);
      // Khi đang nấu, kiên nhẫn khách tụt chậm hơn 50%
      const nextPatience = Math.max(0, order.timeRemainingSec - deltaSec * 0.5);

      if (nextPatience <= 0) {
        expiredOrders.push({ ...order, status: 'expired', timeRemainingSec: 0 });
        return;
      }

      if (nextPrep <= 0) {
        // Nấu xong! Sẵn sàng giao
        readyOrderIds.push(order.id);
        updatedOrders.push({
          ...order,
          status: 'ready_to_serve',
          prepTimeRemainingSec: 0,
          timeRemainingSec: nextPatience,
        });
      } else {
        updatedOrders.push({
          ...order,
          prepTimeRemainingSec: nextPrep,
          timeRemainingSec: nextPatience,
        });
      }
      return;
    }

    // 2. Nếu đơn đang sẵn sàng giao 'ready_to_serve'
    if (order.status === 'ready_to_serve') {
      // Khách đợi nhận món, kiên nhẫn tụt bình thường
      const nextPatience = Math.max(0, order.timeRemainingSec - deltaSec * 0.7);
      if (nextPatience <= 0) {
        expiredOrders.push({ ...order, status: 'expired', timeRemainingSec: 0 });
      } else {
        updatedOrders.push({
          ...order,
          timeRemainingSec: nextPatience,
        });
      }
      return;
    }

    // 3. Nếu đơn đang chờ bắt đầu 'waiting'
    if (order.status === 'waiting') {
      const nextPatience = Math.max(0, order.timeRemainingSec - deltaSec);
      if (nextPatience <= 0) {
        expiredOrders.push({ ...order, status: 'expired', timeRemainingSec: 0 });
      } else {
        updatedOrders.push({
          ...order,
          timeRemainingSec: nextPatience,
        });
      }
      return;
    }

    // Các trạng thái khác (completed/expired)
    updatedOrders.push(order);
  });

  return {
    updatedOrders,
    expiredOrders,
    readyOrderIds,
  };
}

/**
 * Giao đơn hoàn tất cho khách: nhận tiền và tính tiền tip / đánh giá sao
 */
export function deliverReadyOrder(
  order: ActiveOrder,
  hasGlassDisplay: boolean = false
): {
  success: boolean;
  revenue: number;
  tip: number;
  reputationDelta: number;
  review: OrderReview;
  completedOrder: ActiveOrder;
} {
  if (order.status !== 'ready_to_serve') {
    return {
      success: false,
      revenue: 0,
      tip: 0,
      reputationDelta: 0,
      review: { stars: 1, tip: 0, comment: 'Đơn hàng chưa nấu xong!' },
      completedOrder: order,
    };
  }

  // Tính mức độ hài lòng dựa vào thời gian còn lại
  const patienceRatio = order.timeRemainingSec / order.totalTimeSec;
  let stars = 4;
  let tip = 0;
  let comment = order.customer.dialogueHappy;

  if (patienceRatio >= 0.6) {
    stars = 5;
    // Tip 5% - 15% tổng tiền nếu phục vụ siêu tốc
    const tipPercent = hasGlassDisplay ? 0.15 : 0.1;
    tip = Math.round((order.totalPrice * tipPercent) / 1000) * 1000;
  } else if (patienceRatio >= 0.3) {
    stars = 4;
    tip = hasGlassDisplay ? 2000 : 0;
  } else {
    stars = 3;
    tip = 0;
    comment = 'Món ngon nhưng hơi lâu xíu nhen quán!';
  }

  const reputationDelta = stars >= 4 ? (hasGlassDisplay ? 2 : 1) : 0;

  const review: OrderReview = {
    stars,
    tip,
    comment,
  };

  const completedOrder: ActiveOrder = {
    ...order,
    status: 'completed',
    review,
  };

  return {
    success: true,
    revenue: order.totalPrice,
    tip,
    reputationDelta,
    review,
    completedOrder,
  };
}
