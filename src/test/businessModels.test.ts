import { describe, it, expect } from 'vitest';
import { BUSINESS_MODELS } from '@/game/data/businessModels';
import { ALL_MENU_ITEMS } from '@/game/data/menuItems';

describe('Business Models & Menu Catalogue', () => {
  it('phải có ít nhất 24 món ăn được định nghĩa trong danh mục thực đơn', () => {
    expect(ALL_MENU_ITEMS.length).toBeGreaterThanOrEqual(24);
  });

  it('danh mục món ăn được phân bổ hợp lý giữa 3 nhóm chính: Đồ uống, Ăn vặt, Món no', () => {
    const drinks = ALL_MENU_ITEMS.filter((i) => i.category === 'Đồ uống');
    const snacks = ALL_MENU_ITEMS.filter((i) => i.category === 'Ăn vặt');
    const meals = ALL_MENU_ITEMS.filter((i) => i.category === 'Món no');

    expect(drinks.length).toBeGreaterThanOrEqual(7);
    expect(snacks.length).toBeGreaterThanOrEqual(7);
    expect(meals.length).toBeGreaterThanOrEqual(7);
  });

  it('mỗi món ăn phải có đầy đủ ID, tên, giá cơ sở, giá vốn, công thức và cấp độ mở khóa', () => {
    ALL_MENU_ITEMS.forEach((item) => {
      expect(item.id).toBeTruthy();
      expect(item.name).toBeTruthy();
      expect(item.basePrice).toBeGreaterThan(0);
      expect(item.baseCost).toBeGreaterThan(0);
      expect(item.basePrice).toBeGreaterThan(item.baseCost); // Giá bán phải cao hơn giá vốn
      expect(item.ingredients.length).toBeGreaterThan(0);
      expect(item.requiredLevel).toBeGreaterThanOrEqual(1);
    });
  });

  it('cả 3 mô hình kinh doanh đều có số vốn ban đầu và món mở khóa hợp lệ', () => {
    const keys = Object.keys(BUSINESS_MODELS);
    expect(keys.length).toBeGreaterThanOrEqual(3);

    Object.values(BUSINESS_MODELS).forEach((model) => {
      expect(model.startingCash).toBeGreaterThan(0);
      expect(model.unlockedMenuIds.length).toBeGreaterThanOrEqual(3);

      model.unlockedMenuIds.forEach((menuId) => {
        const found = ALL_MENU_ITEMS.find((item) => item.id === menuId);
        expect(found).toBeDefined();
      });
    });
  });
});
