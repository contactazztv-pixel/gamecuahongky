import { describe, it, expect } from 'vitest';
import { generateNewOrder, checkIngredientsAvailable } from '@/game/engine/orderGenerator';
import { ALL_MENU_ITEMS } from '@/game/data/menuItems';
import { ShopState, ActiveOrder } from '@/game/types';

describe('Order Generator & Inventory Checker', () => {
  const dummyShop: ShopState = {
    name: 'Quán Nhỏ Test',
    businessModelId: 'boba_tea',
    level: 1,
    exp: 0,
    expToNextLevel: 100,
    reputation: 25,
    cash: 3000000,
    cleanliness: 100,
    upgrades: [],
    maxInventoryCapacity: 150,
    cookingSlotsCount: 1,
    dailyOperatingCost: 50000,
  };

  it('sinh đơn hàng hợp lệ từ danh sách món đã mở khóa và đang bật bán', () => {
    const unlocked = ALL_MENU_ITEMS.filter((i) => i.unlocked && i.isEnabled !== false);
    const order = generateNewOrder('boba_tea', unlocked, dummyShop, 'recess_rush', []);

    expect(order).not.toBeNull();
    if (order) {
      expect(order.customer).toBeDefined();
      expect(order.items.length).toBeGreaterThan(0);
      expect(order.totalPrice).toBeGreaterThan(0);
      expect(order.status).toBe('waiting');
      expect(order.timeRemainingSec).toBeGreaterThan(0);
    }
  });

  it('không sinh đơn khi hàng đợi đã đầy', () => {
    const existing: ActiveOrder[] = Array(5).fill({ status: 'waiting' } as ActiveOrder);
    const order = generateNewOrder('boba_tea', ALL_MENU_ITEMS, dummyShop, 'recess_rush', existing);
    expect(order).toBeNull();
  });

  it('không sinh món đã bị tắt bán (isEnabled: false)', () => {
    // Chỉ có 1 món nhưng bị tắt bán
    const singleDisabledItem = [{ ...ALL_MENU_ITEMS[0], isEnabled: false }];
    const order = generateNewOrder('boba_tea', singleDisabledItem, dummyShop, 'recess_rush', []);
    expect(order).toBeNull();
  });

  it('kiểm tra chính xác đơn hàng có đủ nguyên liệu hay thiếu nguyên liệu', () => {
    const sampleOrder: ActiveOrder = {
      id: 'test_order',
      customer: {
        id: 'c1',
        name: 'Bé Na',
        type: 'grade_6',
        typeLabel: 'Lớp 6',
        avatar: '👧',
        patienceSeconds: 30,
        spendingPower: 1,
        favoriteItemIds: [],
        dialogueIntro: 'Chào quán!',
        dialogueHappy: 'Cảm ơn!',
        dialogueAngry: 'Quá lâu!',
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

    // Khi không có nguyên liệu
    const emptyCheck = checkIngredientsAvailable(sampleOrder, ALL_MENU_ITEMS, {});
    expect(emptyCheck.canMake).toBe(false);
    expect(emptyCheck.missingIngredientNames.length).toBeGreaterThan(0);

    // Khi có đủ nguyên liệu
    const fullInventory = {
      tra_den: 10,
      sua_dac: 10,
      tran_chau_den: 10,
      ly_ong_hut: 10,
    };
    const fullCheck = checkIngredientsAvailable(sampleOrder, ALL_MENU_ITEMS, fullInventory);
    expect(fullCheck.canMake).toBe(true);
    expect(fullCheck.missingIngredientNames.length).toBe(0);
  });
});
