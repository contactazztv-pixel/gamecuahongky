import { describe, it, expect } from 'vitest';
import {
  canStartCooking,
  startCookingOrder,
  tickCookingOrders,
  deliverReadyOrder,
} from '@/game/engine/cookingSystem';
import { ALL_MENU_ITEMS } from '@/game/data/menuItems';
import { ActiveOrder, Inventory } from '@/game/types';

describe('Cooking System & Multi-slot Workflow', () => {
  const sampleOrder: ActiveOrder = {
    id: 'test_order_1',
    customer: {
      id: 'c1',
      name: 'Bé An',
      type: 'grade_6',
      typeLabel: 'Lớp 6',
      avatar: '👦',
      patienceSeconds: 30,
      spendingPower: 1,
      favoriteItemIds: [],
      dialogueIntro: 'Cho con một phần!',
      dialogueHappy: 'Ngon quá!',
      dialogueAngry: 'Lâu quá!',
    },
    items: [{ menuItemId: 'drink_tra_sua_truyen_thong', quantity: 1, unitPrice: 15000 }],
    totalPrice: 15000,
    baseCost: 5500,
    timeRemainingSec: 30,
    totalTimeSec: 30,
    prepTimeRemainingSec: 0,
    prepTimeTotalSec: 0,
    status: 'waiting',
    orderedAtTimestamp: Date.now(),
  };

  const fullInventory: Inventory = {
    tra_den: 10,
    sua_dac: 10,
    tran_chau_den: 10,
    ly_ong_hut: 10,
  };

  it('không chế biến được khi thiếu nguyên liệu', () => {
    const emptyInventory: Inventory = {};
    const check = canStartCooking(sampleOrder, ALL_MENU_ITEMS, emptyInventory, [], 1);
    expect(check.ok).toBe(false);
    expect(check.reason).toContain('Thiếu nguyên liệu');
  });

  it('không chế biến được khi tất cả trạm bếp đang bận', () => {
    const busyOrder: ActiveOrder = { ...sampleOrder, id: 'busy_1', status: 'preparing' };
    const check = canStartCooking(sampleOrder, ALL_MENU_ITEMS, fullInventory, [busyOrder], 1);
    expect(check.ok).toBe(false);
    expect(check.reason).toContain('hết công suất');
  });

  it('chế biến thành công sẽ trừ đúng nguyên liệu ngay khi lên bếp', () => {
    const result = startCookingOrder(sampleOrder, ALL_MENU_ITEMS, fullInventory, [], 1, 1.0);
    expect(result.success).toBe(true);
    expect(result.updatedOrder?.status).toBe('preparing');
    expect(result.updatedOrder?.prepTimeRemainingSec).toBeGreaterThan(0);

    // Trà sữa truyền thống cần tra_den: 1, sua_dac: 1, tran_chau_den: 1, ly_ong_hut: 1
    expect(result.updatedInventory?.tra_den).toBe(9);
    expect(result.updatedInventory?.sua_dac).toBe(9);
    expect(result.updatedInventory?.tran_chau_den).toBe(9);
    expect(result.updatedInventory?.ly_ong_hut).toBe(9);
  });

  it('chuyển trạng thái sang ready_to_serve khi hết thời gian nấu', () => {
    const preparingOrder: ActiveOrder = {
      ...sampleOrder,
      status: 'preparing',
      prepTimeRemainingSec: 1,
      prepTimeTotalSec: 3,
    };

    const { updatedOrders, readyOrderIds } = tickCookingOrders([preparingOrder], 1);
    expect(updatedOrders[0].status).toBe('ready_to_serve');
    expect(readyOrderIds).toContain(preparingOrder.id);
  });

  it('giao đơn chỉ thực hiện thành công khi đơn ở trạng thái ready_to_serve (chống bấm trùng / exploit)', () => {
    // 1. Nếu đơn còn đang ở trạng thái 'preparing', không thể giao!
    const preparingOrder: ActiveOrder = { ...sampleOrder, status: 'preparing' };
    const invalidDeliver = deliverReadyOrder(preparingOrder);
    expect(invalidDeliver.success).toBe(false);
    expect(invalidDeliver.revenue).toBe(0);

    // 2. Khi đơn ở trạng thái 'ready_to_serve', giao thành công và nhận tiền
    const readyOrder: ActiveOrder = { ...sampleOrder, status: 'ready_to_serve' };
    const validDeliver = deliverReadyOrder(readyOrder);
    expect(validDeliver.success).toBe(true);
    expect(validDeliver.revenue).toBe(15000);
    expect(validDeliver.completedOrder.status).toBe('completed');

    // 3. Đơn đã 'completed' giao lần 2 sẽ thất bại (Idempotency)
    const secondDeliver = deliverReadyOrder(validDeliver.completedOrder);
    expect(secondDeliver.success).toBe(false);
  });
});
