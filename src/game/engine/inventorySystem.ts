import { Inventory, InventoryLogEntry } from '../types';
import { INGREDIENT_DATABASE } from '../data/ingredients';

/**
 * Tính tổng số đơn vị nguyên liệu đang chiếm chỗ trong kho
 */
export function calculateUsedCapacity(inventory: Inventory): number {
  return Object.values(inventory).reduce((sum, qty) => sum + (qty > 0 ? qty : 0), 0);
}

/**
 * Tính tổng giá trị tồn kho hiện tại theo giá vốn nhập
 */
export function calculateInventoryValuation(inventory: Inventory): number {
  let totalValuation = 0;
  for (const [id, qty] of Object.entries(inventory)) {
    const ing = INGREDIENT_DATABASE[id];
    if (ing && qty > 0) {
      // Giá vốn trên mỗi phần
      const costPerPortion = ing.costPerUnit / ing.packageSize;
      totalValuation += Math.round(costPerPortion * qty);
    }
  }
  return totalValuation;
}

/**
 * Kiểm tra xem người chơi có thể mua số lượng gói nguyên liệu này hay không
 */
export function canPurchaseStock(
  ingredientId: string,
  packagesCount: number,
  cash: number,
  inventory: Inventory,
  maxCapacity: number
): { ok: boolean; reason?: string; totalCost: number; unitsToAdd: number } {
  const ingredient = INGREDIENT_DATABASE[ingredientId];
  if (!ingredient || packagesCount <= 0) {
    return { ok: false, reason: 'Nguyên liệu không hợp lệ hoặc số lượng mua không đúng.', totalCost: 0, unitsToAdd: 0 };
  }

  const totalCost = ingredient.costPerUnit * packagesCount;
  if (cash < totalCost) {
    return {
      ok: false,
      reason: `Không đủ tiền mặt! Bạn cần ${totalCost.toLocaleString()}đ nhưng chỉ có ${cash.toLocaleString()}đ.`,
      totalCost,
      unitsToAdd: 0,
    };
  }

  const unitsToAdd = ingredient.packageSize * packagesCount;
  const currentUsed = calculateUsedCapacity(inventory);
  if (currentUsed + unitsToAdd > maxCapacity) {
    return {
      ok: false,
      reason: `Kho đã đầy sức chứa! Hiện tại: ${currentUsed}/${maxCapacity} đơn vị. Hãy nâng cấp sức chứa kho trong mục Nâng Cấp.`,
      totalCost,
      unitsToAdd,
    };
  }

  return { ok: true, totalCost, unitsToAdd };
}

/**
 * Thực hiện giao dịch mua nguyên liệu nguyên tử
 */
export function executePurchaseStock(
  ingredientId: string,
  packagesCount: number,
  cash: number,
  inventory: Inventory,
  maxCapacity: number,
  day: number
): {
  success: boolean;
  reason?: string;
  updatedCash: number;
  updatedInventory: Inventory;
  logEntry?: InventoryLogEntry;
} {
  const check = canPurchaseStock(ingredientId, packagesCount, cash, inventory, maxCapacity);
  if (!check.ok) {
    return {
      success: false,
      reason: check.reason,
      updatedCash: cash,
      updatedInventory: inventory,
    };
  }

  const ingredient = INGREDIENT_DATABASE[ingredientId];
  const updatedCash = cash - check.totalCost;
  const currentUnits = inventory[ingredientId] || 0;
  const updatedInventory: Inventory = {
    ...inventory,
    [ingredientId]: currentUnits + check.unitsToAdd,
  };

  const logEntry: InventoryLogEntry = {
    id: `inv_log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    day,
    type: 'purchase',
    itemName: ingredient.name,
    quantityChange: check.unitsToAdd,
    costChange: -check.totalCost,
    note: `Nhập ${packagesCount} gói (${check.unitsToAdd} phần)`,
  };

  return {
    success: true,
    updatedCash,
    updatedInventory,
    logEntry,
  };
}
