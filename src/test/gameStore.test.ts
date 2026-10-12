import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '@/stores/gameStore';
import { BUSINESS_MODELS } from '@/game/data/businessModels';
import { ActiveOrder } from '@/game/types';

describe('Game Store - Gameplay & Economic Loop', () => {
  beforeEach(async () => {
    // Khởi tạo ván chơi mới
    await useGameStore.getState().startNewGame('boba_tea', 'Tiệm Trà Sữa Test', 'Chủ Quán');
  });

  it('khởi tạo ván chơi mới với đúng số vốn, sức chứa kho và công thức mở khóa', () => {
    const state = useGameStore.getState();
    expect(state.shop.cash).toBe(BUSINESS_MODELS.boba_tea.startingCash);
    expect(state.shop.maxInventoryCapacity).toBe(200);
    expect(state.shop.cookingSlotsCount).toBe(1);
    expect(state.calendar.inGameMinute).toBe(360); // 06:00 sáng
  });

  it('nhập nguyên liệu thành công, trừ tiền và tăng tồn kho chính xác', () => {
    const store = useGameStore.getState();
    const initialCash = store.shop.cash;
    const initialTra = store.inventory['tra_den'] || 0;

    const res = store.buyIngredient('tra_den', 1);
    expect(res.success).toBe(true);

    const updated = useGameStore.getState();
    expect(updated.shop.cash).toBeLessThan(initialCash);
    expect(updated.inventory['tra_den']).toBe(initialTra + 20);
    expect(updated.dayPurchaseExpenses).toBeGreaterThan(0);
  });

  it('từ chối nhập hàng khi không đủ tiền hoặc kho đầy', () => {
    const store = useGameStore.getState();
    // Giảm tiền mặt về 0
    useGameStore.setState((s) => ({ shop: { ...s.shop, cash: 0 } }));

    const resNoMoney = store.buyIngredient('tra_den', 1);
    expect(resNoMoney.success).toBe(false);
    expect(resNoMoney.message).toContain('Không đủ tiền');
  });

  it('chu trình chế biến và giao đơn hoàn chỉnh: bắt đầu nấu -> trừ nguyên liệu -> giao đơn -> nhận tiền', () => {
    const store = useGameStore.getState();

    // 1. Tạo đơn hàng mẫu
    const mockOrder: ActiveOrder = {
      id: 'order_test_cycle',
      customer: {
        id: 'cust_1',
        name: 'Hoàng Nam',
        type: 'highschool',
        typeLabel: 'Lớp 12',
        avatar: '🧑‍🎓',
        patienceSeconds: 30,
        spendingPower: 1,
        favoriteItemIds: [],
        dialogueIntro: 'Cho một ly!',
        dialogueHappy: 'Ngon quá!',
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

    useGameStore.setState({ activeOrders: [mockOrder] });

    // 2. Bắt đầu nấu
    const startRes = store.startCooking('order_test_cycle');
    expect(startRes.success).toBe(true);

    const preparingState = useGameStore.getState();
    expect(preparingState.activeOrders[0].status).toBe('preparing');

    // 3. Tua thời gian để nấu xong
    store.tickSeconds(10);
    const readyState = useGameStore.getState();
    expect(readyState.activeOrders[0].status).toBe('ready_to_serve');

    // 4. Giao đơn
    const initialCash = readyState.shop.cash;
    const initialServed = readyState.dayOrdersServed;

    const serveRes = store.serveOrder('order_test_cycle');
    expect(serveRes.success).toBe(true);

    const finalState = useGameStore.getState();
    expect(finalState.shop.cash).toBeGreaterThanOrEqual(initialCash + 15000);
    expect(finalState.dayOrdersServed).toBe(initialServed + 1);
    expect(finalState.activeOrders.some((o) => o.id === 'order_test_cycle')).toBe(false); // Đã giao xong
  });

  it('mua nâng cấp mở rộng trạm bếp và sức chứa kho áp dụng hiệu quả ngay lập tức', () => {
    const store = useGameStore.getState();
    // Cho thêm tiền để mua nâng cấp
    useGameStore.setState((s) => ({ shop: { ...s.shop, cash: 5000000, level: 2 } }));

    // Mua trạm bếp thứ 2
    const resSlot = store.buyUpgrade('upgrade_cooking_slot_2');
    expect(resSlot.success).toBe(true);
    expect(useGameStore.getState().shop.cookingSlotsCount).toBe(2);

    // Mua mở rộng kho
    const resStorage = store.buyUpgrade('upgrade_warehouse_1');
    expect(resStorage.success).toBe(true);
    expect(useGameStore.getState().shop.maxInventoryCapacity).toBe(300);
  });

  it('kết thúc ngày tính đúng sổ thu chi và không bị chạy lặp', () => {
    const store = useGameStore.getState();
    useGameStore.setState({
      dayRevenue: 150000,
      dayTips: 10000,
      dayCogs: 50000,
    });

    store.endCurrentDay();
    const stateReport = useGameStore.getState();

    expect(stateReport.isDayReportModalOpen).toBe(true);
    expect(stateReport.latestDayReport).not.toBeNull();
    // Lợi nhuận = (150k + 10k) - 50k - 50k (operating) = 60k
    expect(stateReport.latestDayReport?.profit).toBe(60000);
    expect(stateReport.dailyLedgers.length).toBe(1);

    // Bấm lặp lại không tạo thêm ledger trùng
    store.endCurrentDay();
    expect(useGameStore.getState().dailyLedgers.length).toBe(1);
  });
});
