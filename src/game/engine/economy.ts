import { DayReport, FinancialLedger, Inventory, MenuItem, OrderItem } from '@/game/types';
import { calculateInventoryValuation } from './inventorySystem';

/**
 * Trừ nguyên liệu từ kho khi đơn hàng được thực hiện
 */
export function deductIngredientsForItems(
  items: OrderItem[],
  menuItems: MenuItem[],
  currentInventory: Inventory
): { updatedInventory: Inventory; totalCost: number } {
  const updated = { ...currentInventory };
  let totalCost = 0;

  items.forEach((item) => {
    const menuItem = menuItems.find((m) => m.id === item.menuItemId);
    if (!menuItem) return;

    totalCost += menuItem.baseCost * item.quantity;

    menuItem.ingredients.forEach((req) => {
      const needed = req.amount * item.quantity;
      updated[req.ingredientId] = Math.max(0, (updated[req.ingredientId] || 0) - needed);
    });
  });

  return { updatedInventory: updated, totalCost };
}

/**
 * Tạo sổ thu chi tài chính của ngày (Financial Ledger)
 */
export function calculateFinancialLedger(
  day: number,
  salesRevenue: number,
  tipsRevenue: number,
  cogs: number,
  inventoryPurchaseExpense: number,
  upgradeExpense: number,
  dailyOperationalCost: number,
  endingCash: number,
  inventory: Inventory
): FinancialLedger {
  // Lợi nhuận ròng = Doanh thu bán hàng + Tiền tip - Giá vốn nguyên liệu (COGS) - Chi phí vận hành cố định
  const netProfit = (salesRevenue + tipsRevenue) - cogs - dailyOperationalCost;
  const inventoryValuation = calculateInventoryValuation(inventory);

  return {
    day,
    salesRevenue,
    tipsRevenue,
    cogs,
    inventoryPurchaseExpense,
    upgradeExpense,
    dailyOperationalCost,
    netProfit,
    endingCash,
    inventoryValuation,
  };
}

/**
 * Tính toán kết quả và báo cáo cuối ngày với lời khuyên cải thiện
 */
export function generateDayReport(
  day: number,
  revenue: number,
  tipsEarned: number,
  ingredientCost: number, // COGS
  operatingCost: number,
  ordersCompleted: number,
  ordersFailed: number,
  topSellingDish?: string
): DayReport {
  const profit = (revenue + tipsEarned) - ingredientCost - operatingCost;
  const totalOrders = ordersCompleted + ordersFailed;
  const completionRate = totalOrders > 0 ? ordersCompleted / totalOrders : 1.0;

  // Tính điểm đánh giá sao (1.0 -> 5.0)
  let ratingScore = 3.0;
  if (completionRate >= 0.95) ratingScore = 5.0;
  else if (completionRate >= 0.8) ratingScore = 4.5;
  else if (completionRate >= 0.65) ratingScore = 4.0;
  else if (completionRate >= 0.5) ratingScore = 3.5;
  else ratingScore = 2.5;

  // Điểm uy tín cộng/trừ dồn
  const reputationDelta = Math.round(ordersCompleted * 2 - ordersFailed * 3);

  // Lời khuyên cho ngày hôm sau
  let adviceText = 'Tiệm nhỏ kinh doanh rất tuyệt vời! Hãy tiếp tục duy trì đà này nhé.';
  if (ordersFailed > 2) {
    adviceText = 'Có khá nhiều bạn học sinh phải bỏ về do chờ lâu. Hãy cân nhắc nâng cấp trạm bếp thứ 2 hoặc máy dập nắp siêu tốc!';
  } else if (profit <= 0) {
    adviceText = 'Lợi nhuận ngày còn thấp hoặc bị thâm hụt do chi phí nhập hàng. Hãy điều chỉnh nhẹ giá bán hoặc tập trung vào các món có biên lợi nhuận cao!';
  } else if (ordersCompleted >= 8) {
    adviceText = 'Khách đông và ủng hộ nhiệt tình! Bạn đã sẵn sàng mở rộng sức chứa kho và mở khóa thêm các công thức mới!';
  }

  return {
    day,
    revenue,
    tipsEarned,
    ingredientCost,
    operatingCost,
    profit,
    ordersCompleted,
    ordersFailed,
    reputationDelta,
    ratingScore,
    topSellingDish: topSellingDish || 'Món ăn vặt học đường',
    adviceText,
  };
}

/**
 * Tính EXP cần cho cấp độ tiếp theo
 */
export function getExpNeededForLevel(level: number): number {
  return Math.round(100 * Math.pow(1.5, level - 1));
}
