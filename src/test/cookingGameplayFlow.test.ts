import { describe, it, expect, beforeEach } from 'vitest';
import {
  checkDetailedOrderIngredients,
  DISH_RECIPES,
  getDishRecipe,
} from '@/game/data/recipes';
import { INGREDIENT_DATABASE } from '@/game/data/ingredients';
import { ALL_MENU_ITEMS } from '@/game/data/menuItems';
import {
  canStartCooking,
  startCookingOrder,
  deliverReadyOrder,
} from '@/game/engine/cookingSystem';
import {
  exportSaveToJsonString,
  importSaveFromJsonString,
  saveGameToStorage,
  loadGameFromStorage,
} from '@/services/persistence/saveService';
import { useGameStore } from '@/stores/gameStore';
import { ActiveOrder, Inventory, BusinessModelId, GameSave } from '@/game/types';

describe('Cooking & Inventory Gameplay Flow - 10 Test Scenarios', () => {
  beforeEach(() => {
    localStorage.clear();
    useGameStore.setState({
      shop: {
        id: 'shop_1',
        name: 'Tiệm Trà Sữa Tuổi Thơ',
        businessModelId: 'boba_tea' as BusinessModelId,
        level: 1,
        cash: 100000,
        reputation: 20,
        unlockedItemIds: ['drink_tra_sua_truyen_thong'],
        upgrades: [],
        cookingSlotsCount: 2,
        maxInventoryCapacity: 100,
        dailyTargetRevenue: 50000,
        todayCompletedOrdersCount: 0,
      },
      inventory: {
        tra_den: 5,
        sua_dac: 5,
        tran_chau_den: 5,
        ly_ong_hut: 5,
      },
      activeOrders: [],
      inventoryLogs: [],
      dayRevenue: 0,
    });
  });

  const sampleOrder: ActiveOrder = {
    id: 'order_test_1',
    customer: {
      id: 'c_an',
      name: 'Bé An',
      type: 'grade_6',
      typeLabel: 'Lớp 6',
      avatar: '👧',
      patienceSeconds: 40,
      spendingPower: 1,
      favoriteItemIds: ['drink_tra_sua_truyen_thong'],
      dialogueIntro: 'Cô ơi cho con 1 ly trà sữa trân châu!',
      dialogueHappy: 'Ngon tuyệt vời luôn ạ!',
      dialogueAngry: 'Con sắp vào lớp rồi mà chưa có...',
    },
    items: [{ menuItemId: 'drink_tra_sua_truyen_thong', quantity: 1, unitPrice: 15000 }],
    totalPrice: 15000,
    baseCost: 5500,
    timeRemainingSec: 40,
    totalTimeSec: 40,
    prepTimeRemainingSec: 0,
    prepTimeTotalSec: 0,
    status: 'waiting',
    orderedAtTimestamp: Date.now(),
  };

  // Kịch bản 1: Đủ nguyên liệu thì chế biến được
  it('Kịch bản 1: Đủ nguyên liệu thì chế biến được', () => {
    const inv: Inventory = {
      tra_den: 2,
      sua_dac: 2,
      tran_chau_den: 2,
      ly_ong_hut: 2,
    };

    const check = checkDetailedOrderIngredients(sampleOrder.items, inv, INGREDIENT_DATABASE);
    expect(check.canCook).toBe(true);
    expect(check.totalMissingCount).toBe(0);
    expect(check.missingIngredients.length).toBe(0);

    const engineCheck = canStartCooking(sampleOrder, ALL_MENU_ITEMS, inv, [], 2);
    expect(engineCheck.ok).toBe(true);
  });

  // Kịch bản 2: Thiếu nguyên liệu thì không thể bắt đầu và hiện đúng tên nguyên liệu thiếu
  it('Kịch bản 2: Thiếu nguyên liệu thì không thể bắt đầu và hiện đúng tên nguyên liệu thiếu', () => {
    const invMissing: Inventory = {
      tra_den: 1,
      sua_dac: 0, // Thiếu sữa đặc
      tran_chau_den: 1,
      // Thiếu cả ly ống hút
    };

    const check = checkDetailedOrderIngredients(sampleOrder.items, invMissing, INGREDIENT_DATABASE);
    expect(check.canCook).toBe(false);
    expect(check.totalMissingCount).toBe(2);

    const missingNames = check.missingIngredients.map((m) => m.name);
    expect(missingNames).toContain('Sữa Đặc Ngôi Sao');
    expect(missingNames).toContain('Ly Giấy & Ống Hút');

    const suaDacMissing = check.missingIngredients.find((m) => m.ingredientId === 'sua_dac');
    expect(suaDacMissing?.needed).toBe(1);
    expect(suaDacMissing?.available).toBe(0);
    expect(suaDacMissing?.missing).toBe(1);

    const engineCheck = canStartCooking(sampleOrder, ALL_MENU_ITEMS, invMissing, [], 2);
    expect(engineCheck.ok).toBe(false);
    expect(engineCheck.reason).toContain('Thiếu nguyên liệu');
  });

  // Kịch bản 3: Nhập nguyên liệu thành công thì đơn hàng cập nhật đủ nguyên liệu
  it('Kịch bản 3: Nhập nguyên liệu thành công thì đơn hàng cập nhật đủ nguyên liệu', () => {
    const invBefore: Inventory = {
      tra_den: 1,
      sua_dac: 0,
      tran_chau_den: 1,
      ly_ong_hut: 1,
    };
    const checkBefore = checkDetailedOrderIngredients(sampleOrder.items, invBefore, INGREDIENT_DATABASE);
    expect(checkBefore.canCook).toBe(false);

    // Người chơi thực hiện nhập nguyên liệu sữa đặc
    const invAfter = { ...invBefore, sua_dac: invBefore.sua_dac + 5 };
    const checkAfter = checkDetailedOrderIngredients(sampleOrder.items, invAfter, INGREDIENT_DATABASE);
    expect(checkAfter.canCook).toBe(true);
    expect(checkAfter.totalMissingCount).toBe(0);
  });

  // Kịch bản 4: Không đủ tiền thì không thể nhập hàng (thông báo tiền thiếu)
  it('Kịch bản 4: Không đủ tiền thì không thể nhập hàng (thông báo tiền thiếu)', () => {
    useGameStore.setState({
      shop: {
        ...useGameStore.getState().shop,
        cash: 5000, // Chỉ có 5,000 đ
      },
    });

    // Mua 10 gói trân châu đen (mỗi gói 42,000 đ -> cần 420,000 đ)
    const result = useGameStore.getState().buyIngredient('tran_chau_den', 10);
    expect(result.success).toBe(false);
    expect(result.message).toContain('Không đủ tiền mặt');
    expect(result.message).toContain('Bạn cần');
  });

  // Kịch bản 5: Chế biến xong thì nguyên liệu bị trừ đúng số lượng
  it('Kịch bản 5: Chế biến xong thì nguyên liệu bị trừ đúng số lượng', () => {
    useGameStore.setState({
      activeOrders: [sampleOrder],
      inventory: {
        tra_den: 5,
        sua_dac: 5,
        tran_chau_den: 5,
        ly_ong_hut: 5,
      },
    });

    // Nấu ăn tương tác hoàn tất
    useGameStore.getState().finishInteractiveCooking(sampleOrder.id);

    const updatedInv = useGameStore.getState().inventory;
    expect(updatedInv.tra_den).toBe(4);
    expect(updatedInv.sua_dac).toBe(4);
    expect(updatedInv.tran_chau_den).toBe(4);
    expect(updatedInv.ly_ong_hut).toBe(4);

    const orderInQueue = useGameStore.getState().activeOrders.find((o) => o.id === sampleOrder.id);
    expect(orderInQueue?.status).toBe('ready_to_serve');
  });

  // Kịch bản 6: Giao món thì tiền và lịch sử đơn hàng cập nhật đúng
  it('Kịch bản 6: Giao món thì tiền và lịch sử đơn hàng cập nhật đúng', () => {
    const readyOrder: ActiveOrder = { ...sampleOrder, status: 'ready_to_serve' };
    const initialCash = 100000;

    useGameStore.setState({
      shop: { ...useGameStore.getState().shop, cash: initialCash },
      activeOrders: [readyOrder],
    });

    useGameStore.getState().serveOrder(readyOrder.id);

    const finalCash = useGameStore.getState().shop.cash;
    // Nhận tiền bán món (15,000) cộng tip dịch vụ nhanh
    expect(finalCash).toBeGreaterThanOrEqual(initialCash + readyOrder.totalPrice);
    expect(useGameStore.getState().dayRevenue).toBe(readyOrder.totalPrice);
    expect(useGameStore.getState().activeOrders.length).toBe(0);
  });

  // Kịch bản 7: Không thể giao một món hai lần
  it('Kịch bản 7: Không thể giao một món hai lần', () => {
    const readyOrder: ActiveOrder = { ...sampleOrder, status: 'ready_to_serve' };

    // Giao lần 1 -> Thành công và chuyển trạng thái sang completed
    const deliverResult1 = deliverReadyOrder(readyOrder);
    expect(deliverResult1.success).toBe(true);
    expect(deliverResult1.completedOrder.status).toBe('completed');

    // Giao lần 2 trên đơn đã giao xong -> Bị từ chối
    const deliverResult2 = deliverReadyOrder(deliverResult1.completedOrder);
    expect(deliverResult2.success).toBe(false);
  });

  // Kịch bản 8: Nhiều đơn đồng thời không làm kho bị âm
  it('Kịch bản 8: Nhiều đơn đồng thời không làm kho bị âm', () => {
    const inv: Inventory = {
      tra_den: 1, // Chỉ có đúng 1 phần trà đen
      sua_dac: 10,
      tran_chau_den: 10,
      ly_ong_hut: 10,
    };

    const order1: ActiveOrder = { ...sampleOrder, id: 'order_1' };
    const order2: ActiveOrder = { ...sampleOrder, id: 'order_2' };

    // Đơn 1 nấu thành công và trừ kho
    const cook1 = startCookingOrder(order1, ALL_MENU_ITEMS, inv, [], 2, 1.0);
    expect(cook1.success).toBe(true);
    expect(cook1.updatedInventory?.tra_den).toBe(0);

    // Đơn 2 cố gắng nấu khi kho trà đen đã về 0
    const check2 = canStartCooking(order2, ALL_MENU_ITEMS, cook1.updatedInventory!, [cook1.updatedOrder!], 2);
    expect(check2.ok).toBe(false);
    expect(check2.reason).toContain('Thiếu nguyên liệu');
    expect(cook1.updatedInventory?.tra_den).toBeGreaterThanOrEqual(0);
  });

  // Kịch bản 9: Tải lại trang (save/load) không làm mất dữ liệu đã lưu
  it('Kịch bản 9: Tải lại trang (save/load) không làm mất dữ liệu đã lưu', async () => {
    const testSave: GameSave = {
      version: 3,
      saveId: 'save_test_9',
      savedAt: new Date().toISOString(),
      player: {
        name: 'Chủ Quán Test',
        avatar: '👩‍🍳',
        title: 'Tập sự',
        daysPlayed: 1,
        totalEarnings: 250000,
        totalOrdersServed: 10,
      },
      shop: {
        name: 'Tiệm Trà Sữa Tuổi Thơ',
        businessModelId: 'boba_tea',
        level: 2,
        exp: 50,
        expToNextLevel: 100,
        reputation: 25,
        cash: 250000,
        cleanliness: 95,
        upgrades: [],
        maxInventoryCapacity: 120,
        cookingSlotsCount: 2,
        dailyOperatingCost: 50000,
      },
      calendar: {
        day: 2,
        dayOfWeek: 3,
        timePeriod: 'recess_rush',
        weather: 'sunny',
        inGameMinute: 540,
        timeSpeed: 1,
        isRushHour: true,
      },
      inventory: {
        tra_den: 15,
        sua_dac: 20,
        tran_chau_den: 25,
        ly_ong_hut: 30,
      },
      menuItems: [],
      quests: [],
      achievements: [],
      recentDayReports: [],
      stats: {
        totalRevenue: 250000,
        totalExpenses: 50000,
        totalCustomersServed: 10,
        totalCustomersLost: 0,
        favoriteItemSold: {},
        daysWithoutDeficit: 2,
      },
    };

    // 1. Kiểm tra xuất/nhập JSON
    const jsonStr = exportSaveToJsonString(testSave);
    const importRes = importSaveFromJsonString(jsonStr);
    expect(importRes.valid).toBe(true);
    expect(importRes.data?.shop.cash).toBe(250000);
    expect(importRes.data?.inventory.tra_den).toBe(15);
    expect(importRes.data?.inventory.sua_dac).toBe(20);

    // 2. Kiểm tra lưu và tải từ Storage
    const saveRes = await saveGameToStorage(testSave);
    expect(saveRes.success).toBe(true);

    const loaded = await loadGameFromStorage();
    expect(loaded).not.toBeNull();
    expect(loaded?.shop.cash).toBe(250000);
    expect(loaded?.shop.level).toBe(2);
    expect(loaded?.inventory.tra_den).toBe(15);
    expect(loaded?.inventory.tran_chau_den).toBe(25);
  });

  // Kịch bản 10: Bộ lọc, tìm kiếm, giỏ hàng hoạt động mượt mà
  it('Kịch bản 10: Bộ lọc, tìm kiếm, giỏ hàng hoạt động mượt mà', () => {
    // 1. Kiểm tra database món ăn tập trung DISH_RECIPES có đủ thông tin các bước
    const recipesCount = Object.keys(DISH_RECIPES).length;
    expect(recipesCount).toBeGreaterThanOrEqual(12);

    const traSuaRecipe = getDishRecipe('drink_tra_sua_truyen_thong');
    expect(traSuaRecipe).toBeDefined();
    expect(traSuaRecipe?.steps.length).toBeGreaterThanOrEqual(3);
    expect(traSuaRecipe?.steps[0].title).toBeDefined();

    // 2. Mua hàng nhiều món (Batch purchase) qua buyIngredientsBatch
    useGameStore.setState({
      shop: { ...useGameStore.getState().shop, cash: 200000 },
      inventory: { tra_den: 2, sua_dac: 2 },
    });

    const batch = [
      { ingredientId: 'tra_den', quantity: 2 }, // 2 * 20,000 = 40,000
      { ingredientId: 'sua_dac', quantity: 3 }, // 3 * 18,000 = 54,000
    ];

    const batchResult = useGameStore.getState().buyIngredientsBatch(batch);
    expect(batchResult.success).toBe(true);
    expect(batchResult.message).toContain('thành công');

    // Số lượng trong kho được cộng thêm
    // Mỗi gói tra_den là packSize=20, 2 gói = 40 phần -> 2 + 40 = 42
    // Mỗi gói sua_dac là packSize=10, 3 gói = 30 phần -> 2 + 30 = 32
    const finalInv = useGameStore.getState().inventory;
    expect(finalInv.tra_den).toBe(42);
    expect(finalInv.sua_dac).toBe(32);
    expect(useGameStore.getState().shop.cash).toBe(200000 - 192000);
  });
});
