import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '@/stores/gameStore';
import { generateNewOrder } from '@/game/engine/orderGenerator';
import { calculateFinancialLedger } from '@/game/engine/economy';

describe('PROMPT 5: Game Economy Verification & Multi-Day Simulation (Mô Phỏng Kinh Tế Đa Ngày)', () => {
  beforeEach(async () => {
    const store = useGameStore.getState();
    await store.deleteCurrentSave();
  });

  it('Xác minh tính nhất quán tài chính: Doanh thu - COGS - Chi phí = Lợi nhuận', () => {
    const ledger = calculateFinancialLedger(
      1,
      120000, // Doanh thu món (salesRevenue)
      15000,  // Tiền tip (tipsRevenue)
      45000,  // Giá vốn nguyên liệu tiêu thụ (cogs)
      60000,  // Chi phí nhập hàng trong ngày
      0,      // Chi phí nâng cấp
      50000,  // Chi phí vận hành cố định
      1000000,// Tiền mặt cuối ngày
      {}
    );

    // Doanh thu món
    expect(ledger.salesRevenue).toBe(120000);
    expect(ledger.tipsRevenue).toBe(15000);
    // Tổng thu
    expect(ledger.salesRevenue + ledger.tipsRevenue).toBe(135000);
    // Giá vốn
    expect(ledger.cogs).toBe(45000);
    // Lợi nhuận ròng = 135.000 - 45.000 - 50.000 = 40.000đ
    expect(ledger.netProfit).toBe(40000);
  });

  it('Thay đổi giá bán hiện tại KHÔNG làm sửa sai lịch sử sổ sách ngày hôm trước', async () => {
    const store = useGameStore.getState();
    await store.startNewGame('boba_tea', 'Tiệm Trà Sữa', 'Hà');

    // Giả lập ngày 1: có doanh thu 100.000đ, tip 10.000đ
    useGameStore.setState({
      dayRevenue: 100000,
      dayTips: 10000,
      dayCogs: 40000,
    });
    store.endCurrentDay();

    const day1Ledger = useGameStore.getState().dailyLedgers[0];
    expect(day1Ledger.salesRevenue + day1Ledger.tipsRevenue).toBe(110000);

    store.startNextDay();
    expect(useGameStore.getState().calendar.day).toBe(2);

    // Sang Ngày 2: Người chơi tăng giá món đầu tiên lên thêm 10.000đ
    const firstDish = useGameStore.getState().menuItems[0];
    store.updateMenuItemPrice(firstDish.id, firstDish.basePrice + 10000);

    // Kiểm tra sổ sách Ngày 1 vẫn giữ nguyên 110.000đ, không bị ảnh hưởng
    const restoredDay1Ledger = useGameStore.getState().dailyLedgers.find((l) => l.day === 1)!;
    expect(restoredDay1Ledger.salesRevenue + restoredDay1Ledger.tipsRevenue).toBe(110000);
  });

  it('Mô phỏng 14 ngày kinh doanh liên tiếp (Multi-day Economic Health Check)', async () => {
    const store = useGameStore.getState();
    await store.startNewGame('boba_tea', 'Tiệm Trà Sữa Học Đường', 'Linh');

    const startingCash = useGameStore.getState().shop.cash;

    for (let day = 1; day <= 14; day++) {
      const state = useGameStore.getState();
      expect(state.calendar.day).toBe(day);

      // 1. Nhập hàng định kỳ nếu kho còn ít
      const currentTra = state.inventory['tra_den'] || 0;
      if (currentTra < 10 && state.shop.cash >= 40000) {
        store.buyIngredient('tra_den', 1);
        store.buyIngredient('sua_dac', 1);
      }

      // 2. Phục vụ 3-5 đơn hàng mỗi ngày
      const ordersToSimulate = 3;
      for (let i = 0; i < ordersToSimulate; i++) {
        const curState = useGameStore.getState();
        const order = generateNewOrder(
          curState.shop.businessModelId,
          curState.menuItems,
          curState.shop,
          'recess_rush',
          [],
          curState.inventory,
          { regularCustomers: curState.regularCustomers }
        );

        if (order) {
          useGameStore.setState({ activeOrders: [order] });
          const cookRes = store.startCooking(order.id);
          if (cookRes.success) {
            // Đánh dấu hoàn thành nấu
            useGameStore.setState((prev) => ({
              activeOrders: prev.activeOrders.map((o) =>
                o.id === order.id ? { ...o, status: 'ready_to_serve', prepTimeRemainingSec: 0 } : o
              ),
            }));
            store.serveOrder(order.id);
          }
        }
      }

      // 3. Kết thúc ngày và kiểm tra tài chính
      store.endCurrentDay();
      const endDayState = useGameStore.getState();
      expect(endDayState.isDayReportModalOpen).toBe(true);

      // Tiền mặt không bao giờ âm
      expect(endDayState.shop.cash).toBeGreaterThanOrEqual(0);

      // Lịch sử sổ sách được ghi nhận đúng
      expect(endDayState.dailyLedgers.length).toBe(day);

      // Sang ngày kế tiếp
      store.startNextDay();
    }

    const finalState = useGameStore.getState();
    expect(finalState.calendar.day).toBe(15);
    // Kiểm tra không xảy ra lạm phát tiền phi lý (không tự nhiên có hàng trăm triệu)
    expect(finalState.shop.cash).toBeLessThan(50000000);
    // Kiểm tra tiệm đã có tăng trưởng điểm uy tín và kinh nghiệm
    expect(finalState.player.totalOrdersServed).toBeGreaterThan(0);
  });
});
