import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useGameStore } from '@/stores/gameStore';
import { BUSINESS_MODELS } from '@/game/data/businessModels';
import { INGREDIENT_DATABASE } from '@/game/data/ingredients';
import { ALL_MENU_ITEMS } from '@/game/data/menuItems';
import { SHOP_UPGRADES } from '@/game/data/upgrades';
import { generateNewOrder } from '@/game/engine/orderGenerator';

describe('PROMPT 5: E2E Full Game Flow Verification (Luồng Chơi Toàn Diện)', () => {
  beforeEach(async () => {
    // Reset Zustand store trước mỗi test
    const store = useGameStore.getState();
    await store.deleteCurrentSave();
  });

  it('Thực hiện tuần tự 18 bước luồng chơi thực tế từ đầu đến cuối', async () => {
    const store = useGameStore.getState();

    // ==================== BƯỚC 1: Mở game lần đầu ====================
    expect(store.currentScreen).toBe('splash');
    store.setScreen('main_menu');
    expect(useGameStore.getState().currentScreen).toBe('main_menu');
    expect(useGameStore.getState().hasSavedGameAvailable).toBe(false);

    // ==================== BƯỚC 2 & 3: Chọn mô hình và đặt tên ====================
    store.setSelectedModelId('boba_tea');
    store.setShopNameDraft('Trà Sữa Tuổi Thơ');
    store.setPlayerNameDraft('Bé Na');

    // Khởi tạo game mới
    await store.startNewGame('boba_tea', 'Trà Sữa Tuổi Thơ', 'Bé Na');

    const s1 = useGameStore.getState();
    expect(s1.currentScreen).toBe('main_game');
    expect(s1.shop.name).toBe('Trà Sữa Tuổi Thơ');
    expect(s1.player.name).toBe('Bé Na');

    // ==================== BƯỚC 4: Nhận vốn khởi đầu đúng mô hình ====================
    const expectedInitialCash = BUSINESS_MODELS['boba_tea'].startingCash; // 2.000.000đ
    expect(s1.shop.cash).toBe(expectedInitialCash);
    expect(s1.shop.level).toBe(1);
    expect(s1.shop.cookingSlotsCount).toBe(1);
    expect(s1.inventory['tra_den']).toBeGreaterThan(0);

    // ==================== BƯỚC 5: Nhập nguyên liệu từ Chợ Đầu Mối ====================
    const initialTraDen = s1.inventory['tra_den'] || 0;
    const traDenCost = INGREDIENT_DATABASE['tra_den'].costPerUnit; // Giá 1 gói

    const buyRes = store.buyIngredient('tra_den', 2);
    expect(buyRes.success).toBe(true);

    const s2 = useGameStore.getState();
    expect(s2.inventory['tra_den']).toBe(initialTraDen + INGREDIENT_DATABASE['tra_den'].packageSize * 2);
    expect(s2.shop.cash).toBe(expectedInitialCash - traDenCost * 2);
    expect(s2.inventoryLogs.length).toBeGreaterThan(0);

    // Thử nhập hàng khi không đủ tiền (Edge Case)
    // Tạm chỉnh tiền về 0 và thử mua
    useGameStore.setState((prev) => ({ shop: { ...prev.shop, cash: 100 } }));
    const failBuyRes = store.buyIngredient('tra_den', 1);
    expect(failBuyRes.success).toBe(false);
    expect(failBuyRes.message).toContain('Không đủ tiền');

    // Khôi phục lại tiền hợp lệ
    const restoredCash = expectedInitialCash - traDenCost * 2;
    useGameStore.setState((prev) => ({ shop: { ...prev.shop, cash: restoredCash } }));

    // ==================== BƯỚC 6: Quản lý thực đơn & điều chỉnh giá ====================
    const firstDish = s2.menuItems.find((m) => m.unlocked)!;
    expect(firstDish).toBeDefined();

    // Thử tắt món
    store.toggleMenuItemEnabled(firstDish.id);
    expect(useGameStore.getState().menuItems.find((m) => m.id === firstDish.id)?.isEnabled).toBe(false);
    // Bật lại món
    store.toggleMenuItemEnabled(firstDish.id);
    expect(useGameStore.getState().menuItems.find((m) => m.id === firstDish.id)?.isEnabled).toBe(true);

    // Thử điều chỉnh giá (Clamping trong khoảng 70% - 140%)
    const originalPrice = firstDish.basePrice;
    store.updateMenuItemPrice(firstDish.id, originalPrice + 2000);
    const updatedDish = useGameStore.getState().menuItems.find((m) => m.id === firstDish.id)!;
    expect(updatedDish.customPrice).toBe(originalPrice + 2000);

    // ==================== BƯỚC 7: Kích hoạt đơn hàng thực tế ====================
    const s3 = useGameStore.getState();
    const newOrder = generateNewOrder(
      s3.shop.businessModelId,
      s3.menuItems,
      s3.shop,
      'recess_rush',
      [],
      s3.inventory,
      { regularCustomers: s3.regularCustomers }
    );
    expect(newOrder).not.toBeNull();
    useGameStore.setState({ activeOrders: [newOrder!] });

    // ==================== BƯỚC 8 & 9: Chế biến và giao đơn hàng ====================
    const orderToCook = newOrder!;
    const cookRes = store.startCooking(orderToCook.id);
    expect(cookRes.success).toBe(true);

    const s4 = useGameStore.getState();
    const preparingOrder = s4.activeOrders.find((o) => o.id === orderToCook.id)!;
    expect(preparingOrder.status).toBe('preparing');
    expect(s4.dayCogs).toBeGreaterThan(0); // Đã trừ COGS

    // Thử giao đơn khi chưa nấu xong (Edge Case: Phải thất bại)
    const earlyServe = store.serveOrder(orderToCook.id);
    expect(earlyServe.success).toBe(false);

    // Tua thời gian để món nấu xong
    useGameStore.setState((prev) => ({
      activeOrders: prev.activeOrders.map((o) =>
        o.id === orderToCook.id ? { ...o, status: 'ready_to_serve', prepTimeRemainingSec: 0 } : o
      ),
    }));

    // Giao đơn hoàn chỉnh
    const cashBeforeServe = useGameStore.getState().shop.cash;
    const serveRes = store.serveOrder(orderToCook.id);
    expect(serveRes.success).toBe(true);

    const s5 = useGameStore.getState();
    expect(s5.activeOrders.length).toBe(0); // Đơn đã giao biến mất khỏi hàng chờ
    expect(s5.shop.cash).toBeGreaterThan(cashBeforeServe);
    expect(s5.dayRevenue).toBeGreaterThan(0);
    expect(s5.player.totalOrdersServed).toBe(1);

    // Thử giao lại đơn đã hoàn thành (Edge case: Phải thất bại)
    const doubleServeRes = store.serveOrder(orderToCook.id);
    expect(doubleServeRes.success).toBe(false);
    expect(doubleServeRes.message).toContain('không tồn tại');

    // ==================== BƯỚC 10: Mua Nâng Cấp Cửa Hàng ====================
    // Cấp 1 có nâng cấp biển hiệu neon hoặc kệ gỗ
    const upgradeLevel1 = SHOP_UPGRADES.find((u) => u.requiredLevel === 1)!;
    expect(upgradeLevel1).toBeDefined();

    // Đảm bảo đủ tiền để mua nâng cấp
    useGameStore.setState((prev) => ({
      shop: { ...prev.shop, cash: Math.max(prev.shop.cash, upgradeLevel1.cost + 50000) },
    }));

    const upgradeRes = store.buyUpgrade(upgradeLevel1.id);
    expect(upgradeRes.success).toBe(true);

    const s6 = useGameStore.getState();
    expect(s6.shop.upgrades).toContain(upgradeLevel1.id);

    // Thử mua lại nâng cấp đã sở hữu (Edge Case: Phải thất bại)
    const duplicateUpgradeRes = store.buyUpgrade(upgradeLevel1.id);
    expect(duplicateUpgradeRes.success).toBe(false);
    expect(duplicateUpgradeRes.message).toContain('Đã sở hữu');

    // ==================== BƯỚC 11: Hoàn thành & nhận thưởng nhiệm vụ ====================
    // Đánh dấu 1 nhiệm vụ đã hoàn thành nhưng chưa nhận thưởng
    const targetQuest = s6.quests[0];
    useGameStore.setState((prev) => ({
      quests: prev.quests.map((q) =>
        q.id === targetQuest.id ? { ...q, completed: true, claimed: false } : q
      ),
    }));

    const cashBeforeReward = useGameStore.getState().shop.cash;
    store.claimQuestReward(targetQuest.id);

    const s7 = useGameStore.getState();
    const claimedQuest = s7.quests.find((q) => q.id === targetQuest.id)!;
    expect(claimedQuest.claimed).toBe(true);
    expect(s7.shop.cash).toBe(cashBeforeReward + targetQuest.rewardCash);

    // Thử nhận thưởng lần thứ hai (Edge Case: Không tăng tiền thêm)
    store.claimQuestReward(targetQuest.id);
    expect(useGameStore.getState().shop.cash).toBe(cashBeforeReward + targetQuest.rewardCash);

    // ==================== BƯỚC 12: Tăng thân thiết khách quen ====================
    const regularAn = s7.regularCustomers['student_an_grade6'];
    expect(regularAn).toBeDefined();
    expect(regularAn.friendshipLevel).toBeGreaterThanOrEqual(1);

    // ==================== BƯỚC 13: Kết thúc ngày & sang ngày tiếp theo ====================
    store.endCurrentDay();

    const s8 = useGameStore.getState();
    expect(s8.isDayReportModalOpen).toBe(true);
    expect(s8.latestDayReport).not.toBeNull();
    expect(s8.dailyLedgers.length).toBe(1);

    // Thử gọi endCurrentDay lần thứ hai trong ngày (Edge case: Không được nhân đôi ledger)
    store.endCurrentDay();
    expect(useGameStore.getState().dailyLedgers.length).toBe(1);

    // Bắt đầu ngày mới (Day 2)
    store.startNextDay();

    const s9 = useGameStore.getState();
    expect(s9.calendar.day).toBe(2);
    expect(s9.dayRevenue).toBe(0); // Reset doanh thu trong ngày
    expect(s9.dayOrdersServed).toBe(0);
    expect(s9.isDayReportModalOpen).toBe(false);

    // ==================== BƯỚC 14 & 15: Lưu và khôi phục tiến trình ====================
    const savedSuccess = await store.manualSaveGame();
    expect(savedSuccess).toBe(true);

    // Xóa tạm state trong memory để giả lập reload trình duyệt
    useGameStore.setState({ currentScreen: 'main_menu' });
    expect(useGameStore.getState().currentScreen).toBe('main_menu');

    // Khôi phục từ storage
    const loadSuccess = await store.loadGame();
    expect(loadSuccess).toBe(true);

    const restoredState = useGameStore.getState();
    expect(restoredState.currentScreen).toBe('main_game');
    expect(restoredState.calendar.day).toBe(2);
    expect(restoredState.shop.name).toBe('Trà Sữa Tuổi Thơ');
    expect(restoredState.shop.upgrades).toContain(upgradeLevel1.id);
    expect(restoredState.dailyLedgers.length).toBe(1);

    // ==================== BƯỚC 16: Xuất bản lưu JSON & Nhập lại ====================
    const exportedData = store.exportGameData();
    expect(exportedData).toBeDefined();
    expect(exportedData.shop.name).toBe('Trà Sữa Tuổi Thơ');

    // Xóa game
    await store.deleteCurrentSave();

    // Nhập lại file JSON
    const jsonStr = JSON.stringify(exportedData);
    const importRes = store.importGameData(jsonStr);
    expect(importRes.success).toBe(true);

    const reimportedState = useGameStore.getState();
    expect(reimportedState.shop.name).toBe('Trà Sữa Tuổi Thơ');
    expect(reimportedState.calendar.day).toBe(2);

    // ==================== BƯỚC 17: Kiểm tra dữ liệu JSON lỗi hoặc thiếu trường ====================
    const badJsonRes1 = store.importGameData('invalid json content');
    expect(badJsonRes1.success).toBe(false);

    const badJsonRes2 = store.importGameData(JSON.stringify({ someGarbage: 123 }));
    expect(badJsonRes2.success).toBe(false);

    // ==================== BƯỚC 18: Thử nghiệm cả 3 mô hình kinh doanh ====================
    // Mô hình Ăn vặt đường phố
    await store.startNewGame('street_snack', 'Gánh Ăn Vặt', 'Nam');
    expect(useGameStore.getState().shop.cash).toBe(BUSINESS_MODELS['street_snack'].startingCash);
    expect(useGameStore.getState().inventory['banh_trang']).toBeGreaterThan(0);

    // Mô hình Tiệm bánh mì ăn sáng
    await store.startNewGame('breakfast_stall', 'Bánh Mì Cổng Trường', 'Bác Tư');
    expect(useGameStore.getState().shop.cash).toBe(BUSINESS_MODELS['breakfast_stall'].startingCash);
    expect(useGameStore.getState().inventory['banh_mi_o']).toBeGreaterThan(0);
  });
});
