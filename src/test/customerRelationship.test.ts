import { describe, it, expect } from 'vitest';
import { INITIAL_REGULAR_CUSTOMERS } from '@/game/data/characters';
import {
  recordRegularCustomerVisit,
  calculateRegularCustomerTipBonus,
} from '@/game/engine/customerRelationship';

describe('Customer Relationship Engine - Khách Quen & Thân Thiết', () => {
  it('tăng EXP thân thiết chính xác khi phục vụ món khoái khẩu và nhanh chóng', () => {
    const an = INITIAL_REGULAR_CUSTOMERS.student_an_grade6;
    expect(an.friendshipLevel).toBe(1);
    expect(an.friendshipExp).toBe(0);

    // Phục vụ đúng món và giao nhanh: 20 (base) + 15 (fav) + 10 (prompt) = 45 EXP
    const res = recordRegularCustomerVisit(an, 25000, true, true, 1);
    expect(res.expGained).toBe(45);
    expect(res.updatedCustomer.friendshipExp).toBe(45);
    expect(res.updatedCustomer.totalOrdersServed).toBe(1);
    expect(res.updatedCustomer.totalSpent).toBe(25000);
    expect(res.leveledUp).toBe(false);
  });

  it('thăng cấp thân thiết và mở khóa câu chuyện khi đạt đủ 100 EXP', () => {
    const nam = INITIAL_REGULAR_CUSTOMERS.student_nam_senior;
    const nearLevelUpCustomer = {
      ...nam,
      friendshipExp: 80,
      friendshipLevel: 1,
    };

    // Phục vụ thường: +20 EXP => tổng 100 EXP => lên Cấp 2
    const res = recordRegularCustomerVisit(nearLevelUpCustomer, 30000, false, false, 2);
    expect(res.leveledUp).toBe(true);
    expect(res.updatedCustomer.friendshipLevel).toBe(2);
    expect(res.updatedCustomer.friendshipExp).toBe(0);
    expect(res.newMilestone).not.toBeNull();
    expect(res.newMilestone?.level).toBe(2);
    expect(res.updatedCustomer.unlockedPerk).toBeDefined();
  });

  it('thưởng tiền tip tương ứng với cấp độ thân thiết', () => {
    const charLv1 = { ...INITIAL_REGULAR_CUSTOMERS.student_an_grade6, friendshipLevel: 1 };
    const charLv2 = { ...INITIAL_REGULAR_CUSTOMERS.student_an_grade6, friendshipLevel: 2 };
    const charLv3 = { ...INITIAL_REGULAR_CUSTOMERS.student_an_grade6, friendshipLevel: 3 };
    const charLv4 = { ...INITIAL_REGULAR_CUSTOMERS.student_an_grade6, friendshipLevel: 4 };
    const charLv5 = { ...INITIAL_REGULAR_CUSTOMERS.student_an_grade6, friendshipLevel: 5 };

    expect(calculateRegularCustomerTipBonus(charLv1)).toBe(0);
    expect(calculateRegularCustomerTipBonus(charLv2)).toBe(1500);
    expect(calculateRegularCustomerTipBonus(charLv3)).toBe(3500);
    expect(calculateRegularCustomerTipBonus(charLv4)).toBe(6000);
    expect(calculateRegularCustomerTipBonus(charLv5)).toBe(10000);
  });
});
