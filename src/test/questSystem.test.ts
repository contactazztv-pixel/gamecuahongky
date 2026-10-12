import { describe, it, expect } from 'vitest';
import { INITIAL_QUESTS, INITIAL_ACHIEVEMENTS } from '@/game/data/quests';
import {
  processQuestProgress,
  claimQuestReward,
  refreshDailyQuests,
  refreshWeeklyQuests,
  checkAchievementsUnlock,
} from '@/game/engine/questSystem';
import { ShopState } from '@/game/types';

describe('Quest & Achievement Engine - Nhiệm Vụ & Thành Tựu', () => {
  it('cập nhật tiến độ nhiệm vụ tự động và đánh dấu hoàn thành', () => {
    const testQuests = [...INITIAL_QUESTS];
    // Phục vụ 3 đơn hàng
    const { updatedQuests, newlyCompletedCount } = processQuestProgress(testQuests, {
      type: 'serve_orders',
      amount: 3,
    });

    const firstQuest = updatedQuests.find((q) => q.id === 'quest_first_customer');
    expect(firstQuest?.currentProgress).toBe(3);
    expect(firstQuest?.completed).toBe(true);
    expect(firstQuest?.claimed).toBe(false);
    expect(newlyCompletedCount).toBeGreaterThanOrEqual(1);
  });

  it('nhận thưởng thành công và chống nhận thưởng trùng lặp', () => {
    let quests = [...INITIAL_QUESTS];
    // Hoàn thành nhiệm vụ đầu tiên
    quests = processQuestProgress(quests, { type: 'serve_orders', amount: 3 }).updatedQuests;

    // Lần 1: Nhận thưởng thành công
    const res1 = claimQuestReward(quests, 'quest_first_customer');
    expect(res1.success).toBe(true);
    expect(res1.rewardCash).toBeGreaterThan(0);
    expect(res1.rewardReputation).toBeGreaterThan(0);

    const claimedQuest = res1.updatedQuests.find((q) => q.id === 'quest_first_customer');
    expect(claimedQuest?.claimed).toBe(true);

    // Lần 2: Bấm nhận lại bị từ chối
    const res2 = claimQuestReward(res1.updatedQuests, 'quest_first_customer');
    expect(res2.success).toBe(false);
    expect(res2.message).toContain('đã nhận phần thưởng');
  });

  it('làm mới danh sách nhiệm vụ hằng ngày khi sang ngày mới', () => {
    let quests = [...INITIAL_QUESTS];
    // Hoàn thành nhiệm vụ hằng ngày
    quests = processQuestProgress(quests, { type: 'serve_orders', amount: 6 }).updatedQuests;
    const dailyRush = quests.find((q) => q.id === 'quest_rush_hour_master');
    expect(dailyRush?.completed).toBe(true);

    // Sang ngày mới -> reset tiến độ các nhiệm vụ isDaily
    const refreshed = refreshDailyQuests(quests);
    const refreshedDaily = refreshed.find((q) => q.id === 'quest_rush_hour_master');
    expect(refreshedDaily?.currentProgress).toBe(0);
    expect(refreshedDaily?.completed).toBe(false);
    expect(refreshedDaily?.claimed).toBe(false);
  });

  it('làm mới nhiệm vụ tuần học khi bước sang đầu tuần', () => {
    let quests = [...INITIAL_QUESTS];
    quests = processQuestProgress(quests, { type: 'serve_orders', amount: 25 }).updatedQuests;
    const weeklyQuest = quests.find((q) => q.id === 'quest_weekly_school_crowd');
    expect(weeklyQuest?.completed).toBe(true);

    const refreshed = refreshWeeklyQuests(quests);
    const refreshedWeekly = refreshed.find((q) => q.id === 'quest_weekly_school_crowd');
    expect(refreshedWeekly?.currentProgress).toBe(0);
    expect(refreshedWeekly?.completed).toBe(false);
  });

  it('kiểm tra và mở khóa thành tựu dài hạn khi đạt mốc số lượng đơn', () => {
    const mockShop: ShopState = {
      name: 'Tiệm Nhỏ',
      businessModelId: 'boba_tea',
      level: 1,
      exp: 0,
      expToNextLevel: 100,
      reputation: 30,
      customerSatisfaction: 90,
      cash: 1000000,
      cleanliness: 100,
      upgrades: [],
      maxInventoryCapacity: 200,
      cookingSlotsCount: 1,
      dailyOperatingCost: 50000,
    };

    const mockStats = {
      totalRevenue: 250000,
      totalExpenses: 50000,
      totalCustomersServed: 25, // Đạt 25 đơn!
      totalCustomersLost: 0,
      favoriteItemSold: {},
      daysWithoutDeficit: 2,
    };

    const { updatedAchievements, newlyUnlockedCount } = checkAchievementsUnlock(
      INITIAL_ACHIEVEMENTS,
      mockStats,
      mockShop,
      1,
      2
    );

    const achieve25 = updatedAchievements.find((a) => a.id === 'achieve_served_25');
    expect(achieve25?.unlocked).toBe(true);
    expect(newlyUnlockedCount).toBeGreaterThanOrEqual(1);
  });
});
