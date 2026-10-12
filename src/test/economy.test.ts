import { describe, it, expect } from 'vitest';
import {
  deductIngredientsForItems,
  calculateFinancialLedger,
  generateDayReport,
  getExpNeededForLevel,
} from '@/game/engine/economy';
import { ALL_MENU_ITEMS } from '@/game/data/menuItems';

describe('Economy, Financial Ledger & Profit Calculations', () => {
  it('trừ nguyên liệu từ kho chính xác theo công thức món', () => {
    const initialInv = {
      tra_den: 10,
      sua_dac: 10,
      tran_chau_den: 10,
      ly_ong_hut: 10,
    };

    const itemsToMake = [{ menuItemId: 'drink_tra_sua_truyen_thong', quantity: 2, unitPrice: 15000 }];
    const { updatedInventory, totalCost } = deductIngredientsForItems(
      itemsToMake,
      ALL_MENU_ITEMS,
      initialInv
    );

    // Trà sữa truyền thống: 1 tra_den, 1 sua_dac, 1 tran_chau_den, 1 ly_ong_hut mỗi phần
    expect(updatedInventory.tra_den).toBe(8);
    expect(updatedInventory.sua_dac).toBe(8);
    expect(updatedInventory.tran_chau_den).toBe(8);
    expect(updatedInventory.ly_ong_hut).toBe(8);
    expect(totalCost).toBe(5500 * 2);
  });

  it('lập sổ thu chi phân biệt rõ ràng giữa doanh thu và lợi nhuận ròng', () => {
    const day = 1;
    const salesRevenue = 300000;
    const tipsRevenue = 15000;
    const cogs = 110000; // Giá vốn hàng bán (nguyên liệu đã tiêu thụ)
    const purchaseExpense = 150000; // Chi tiền mua thêm nguyên liệu trữ kho
    const upgradeExpense = 0;
    const dailyOperatingCost = 50000; // Phí mặt bằng vỉa hè
    const endingCash = 3655000;
    const inventory = { tra_den: 20 };

    const ledger = calculateFinancialLedger(
      day,
      salesRevenue,
      tipsRevenue,
      cogs,
      purchaseExpense,
      upgradeExpense,
      dailyOperatingCost,
      endingCash,
      inventory
    );

    // Lợi nhuận ròng = (300.000 + 15.000) - 110.000 - 50.000 = 155.000đ
    expect(ledger.netProfit).toBe(155000);
    expect(ledger.salesRevenue).toBe(300000);
    expect(ledger.cogs).toBe(110000);
    expect(ledger.dailyOperationalCost).toBe(50000);
    expect(ledger.inventoryValuation).toBeGreaterThan(0);
  });

  it('tạo báo cáo cuối ngày với đánh giá sao và lời khuyên cải thiện', () => {
    const report = generateDayReport(1, 200000, 10000, 70000, 50000, 8, 0, 'Trà Sữa Truyền Thống');
    expect(report.day).toBe(1);
    expect(report.revenue).toBe(200000);
    expect(report.profit).toBe((200000 + 10000) - 70000 - 50000); // 90.000đ
    expect(report.ratingScore).toBe(5.0);
    expect(report.topSellingDish).toBe('Trà Sữa Truyền Thống');
    expect(report.adviceText).toBeTruthy();
  });

  it('thang điểm kinh nghiệm tăng dần theo cấp độ', () => {
    const lv1 = getExpNeededForLevel(1);
    const lv2 = getExpNeededForLevel(2);
    const lv3 = getExpNeededForLevel(3);

    expect(lv2).toBeGreaterThan(lv1);
    expect(lv3).toBeGreaterThan(lv2);
  });
});
