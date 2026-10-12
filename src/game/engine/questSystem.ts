import { Quest, Achievement, GameStats, ShopState } from '../types';

export interface QuestUpdateAction {
  type: Quest['targetType'];
  amount?: number;
  category?: 'Đồ uống' | 'Ăn vặt' | 'Món no';
  recipeId?: string;
  isPositiveProfit?: boolean;
  isEventActive?: boolean;
}

export interface QuestClaimResult {
  success: boolean;
  message: string;
  rewardCash: number;
  rewardReputation: number;
  rewardExp: number;
  updatedQuests: Quest[];
}

/**
 * Cập nhật tiến độ nhiệm vụ tự động dựa trên hành động gameplay thực tế
 */
export function processQuestProgress(
  quests: Quest[],
  action: QuestUpdateAction
): { updatedQuests: Quest[]; newlyCompletedCount: number } {
  let newlyCompletedCount = 0;
  const inc = action.amount ?? 1;

  const updatedQuests = quests.map((quest) => {
    // Nếu nhiệm vụ đã hoàn thành rồi thì giữ nguyên
    if (quest.completed) return quest;

    let shouldUpdate = false;
    let nextProgress = quest.currentProgress;

    switch (quest.targetType) {
      case 'serve_orders':
        if (action.type === 'serve_orders') {
          nextProgress += inc;
          shouldUpdate = true;
        }
        break;

      case 'serve_category':
        if (action.type === 'serve_category') {
          nextProgress += inc;
          shouldUpdate = true;
        }
        break;

      case 'buy_stock':
        if (action.type === 'buy_stock') {
          nextProgress += inc;
          shouldUpdate = true;
        }
        break;

      case 'positive_profit_day':
        if (action.type === 'positive_profit_day' && action.isPositiveProfit) {
          nextProgress += 1;
          shouldUpdate = true;
        }
        break;

      case 'earn_cash':
        if (action.type === 'earn_cash') {
          nextProgress += inc;
          shouldUpdate = true;
        }
        break;

      case 'upgrade_shop':
        if (action.type === 'upgrade_shop') {
          nextProgress += inc;
          shouldUpdate = true;
        }
        break;

      case 'reputation':
        if (action.type === 'reputation') {
          nextProgress = inc; // Đạt mốc danh tiếng
          shouldUpdate = true;
        }
        break;

      case 'friendship_level':
        if (action.type === 'friendship_level') {
          nextProgress = Math.max(quest.currentProgress, inc);
          shouldUpdate = true;
        }
        break;

      case 'event_orders':
        if (action.type === 'event_orders' && action.isEventActive) {
          nextProgress += inc;
          shouldUpdate = true;
        }
        break;

      default:
        break;
    }

    if (shouldUpdate) {
      const isNowCompleted = nextProgress >= quest.targetValue;
      if (isNowCompleted && !quest.completed) {
        newlyCompletedCount += 1;
      }
      return {
        ...quest,
        currentProgress: nextProgress,
        completed: isNowCompleted,
      };
    }

    return quest;
  });

  return { updatedQuests, newlyCompletedCount };
}

/**
 * Nhận thưởng nhiệm vụ an toàn, chống duplicate claim
 */
export function claimQuestReward(quests: Quest[], questId: string): QuestClaimResult {
  const quest = quests.find((q) => q.id === questId);
  if (!quest) {
    return {
      success: false,
      message: 'Nhiệm vụ không tồn tại.',
      rewardCash: 0,
      rewardReputation: 0,
      rewardExp: 0,
      updatedQuests: quests,
    };
  }

  if (!quest.completed) {
    return {
      success: false,
      message: 'Chưa hoàn thành điều kiện nhiệm vụ.',
      rewardCash: 0,
      rewardReputation: 0,
      rewardExp: 0,
      updatedQuests: quests,
    };
  }

  if (quest.claimed) {
    return {
      success: false,
      message: 'Bạn đã nhận phần thưởng này rồi!',
      rewardCash: 0,
      rewardReputation: 0,
      rewardExp: 0,
      updatedQuests: quests,
    };
  }

  const updatedQuests = quests.map((q) => (q.id === questId ? { ...q, claimed: true } : q));

  return {
    success: true,
    message: `Nhận thưởng thành công nhiệm vụ "${quest.title}"!`,
    rewardCash: quest.rewardCash,
    rewardReputation: quest.rewardReputation,
    rewardExp: quest.rewardExp,
    updatedQuests,
  };
}

/**
 * Làm mới danh sách nhiệm vụ hằng ngày khi bước sang ngày mới
 */
export function refreshDailyQuests(quests: Quest[]): Quest[] {
  return quests.map((q) => {
    if (q.isDaily) {
      return {
        ...q,
        currentProgress: 0,
        completed: false,
        claimed: false,
      };
    }
    return q;
  });
}

/**
 * Làm mới nhiệm vụ theo tuần học khi sang Thứ Hai đầu tuần
 */
export function refreshWeeklyQuests(quests: Quest[]): Quest[] {
  return quests.map((q) => {
    if (q.isWeekly) {
      return {
        ...q,
        currentProgress: 0,
        completed: false,
        claimed: false,
      };
    }
    return q;
  });
}

/**
 * Kiểm tra và mở khóa các thành tựu dài hạn
 */
export function checkAchievementsUnlock(
  achievements: Achievement[],
  stats: GameStats,
  shop: ShopState,
  maxFriendshipLevel: number,
  currentDay: number
): { updatedAchievements: Achievement[]; newlyUnlockedCount: number } {
  let newlyUnlockedCount = 0;

  const updatedAchievements = achievements.map((ach) => {
    if (ach.unlocked) return ach;

    let shouldUnlock = false;

    switch (ach.id) {
      case 'achieve_served_25':
        if (stats.totalCustomersServed >= 25) shouldUnlock = true;
        break;
      case 'achieve_served_100':
        if (stats.totalCustomersServed >= 100) shouldUnlock = true;
        break;
      case 'achieve_millionaire':
        if (shop.cash >= 10000000) shouldUnlock = true;
        break;
      case 'achieve_level_3':
        if (shop.level >= 3) shouldUnlock = true;
        break;
      case 'achieve_friendship_master':
        if (maxFriendshipLevel >= 4) shouldUnlock = true;
        break;
      case 'achieve_reputation_100':
        if (shop.reputation >= 100) shouldUnlock = true;
        break;
      default:
        break;
    }

    if (shouldUnlock) {
      newlyUnlockedCount += 1;
      return {
        ...ach,
        unlocked: true,
        unlockedDate: `Ngày ${currentDay}`,
      };
    }

    return ach;
  });

  return { updatedAchievements, newlyUnlockedCount };
}
