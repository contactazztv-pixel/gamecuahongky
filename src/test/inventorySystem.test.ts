import { describe, it, expect } from 'vitest';
import {
  calculateUsedCapacity,
  calculateInventoryValuation,
  canPurchaseStock,
  executePurchaseStock,
} from '@/game/engine/inventorySystem';
import { INGREDIENT_DATABASE } from '@/game/data/ingredients';

describe('Inventory & Supplier Purchasing System', () => {
  it('tính chính xác sức chứa kho đã sử dụng', () => {
    const inventory = {
      tra_den: 10,
      sua_dac: 15,
      tran_chau_den: 20,
    };
    expect(calculateUsedCapacity(inventory)).toBe(45);
  });

  it('tính chính xác giá trị tồn kho theo giá vốn', () => {
    const inventory = {
      tra_den: 20, // 1 gói 20 phần = 60.000đ
    };
    const val = calculateInventoryValuation(inventory);
    expect(val).toBe(60000);
  });

  it('mua nguyên liệu thành công và trừ tiền chính xác', () => {
    const initialCash = 1000000;
    const inventory = { tra_den: 5 };
    const traDenCost = INGREDIENT_DATABASE['tra_den'].costPerUnit; // 60.000đ
    const packageUnits = INGREDIENT_DATABASE['tra_den'].packageSize; // 20

    const result = executePurchaseStock('tra_den', 1, initialCash, inventory, 150, 1);
    expect(result.success).toBe(true);
    expect(result.updatedCash).toBe(initialCash - traDenCost);
    expect(result.updatedInventory['tra_den']).toBe(5 + packageUnits);
    expect(result.logEntry).toBeDefined();
    expect(result.logEntry?.type).toBe('purchase');
  });

  it('không mua được khi thiếu tiền', () => {
    const cash = 10000; // chỉ có 10k
    const check = canPurchaseStock('tra_den', 1, cash, {}, 150);
    expect(check.ok).toBe(false);
    expect(check.reason).toContain('Không đủ tiền');
  });

  it('không nhập được khi kho đã đầy sức chứa', () => {
    const cash = 5000000;
    const inventory = { tra_den: 140 }; // Kho 150, đã chiếm 140
    // Mua 1 gói tra_den (thêm 20 phần) -> 140 + 20 = 160 > 150
    const check = canPurchaseStock('tra_den', 1, cash, inventory, 150);
    expect(check.ok).toBe(false);
    expect(check.reason).toContain('Kho đã đầy sức chứa');
  });
});
