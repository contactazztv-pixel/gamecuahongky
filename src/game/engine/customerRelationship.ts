import { CustomerRegular, FriendshipStoryMilestone } from '../types';

export interface CustomerRelationshipUpdateResult {
  updatedCustomer: CustomerRegular;
  leveledUp: boolean;
  newMilestone: FriendshipStoryMilestone | null;
  expGained: number;
}

/**
 * Xử lý cập nhật tiến trình thân thiết khi phục vụ thành công một khách quen
 * @param customer Khách quen hiện tại
 * @param orderTotal Giá trị đơn hàng đã trả
 * @param isFavoriteMatch Có đúng món ăn yêu thích không
 * @param isServedPromptly Có phục vụ nhanh nhẹn không (nhận 5 sao)
 * @param currentDay Ngày trong game
 */
export function recordRegularCustomerVisit(
  customer: CustomerRegular,
  orderTotal: number,
  isFavoriteMatch: boolean,
  isServedPromptly: boolean,
  currentDay: number
): CustomerRelationshipUpdateResult {
  let expGain = 20; // EXP cơ bản mỗi lần phục vụ
  if (isFavoriteMatch) expGain += 15; // Món khoái khẩu
  if (isServedPromptly) expGain += 10; // Phục vụ nhanh 5 sao

  let newExp = customer.friendshipExp + expGain;
  let newLevel = customer.friendshipLevel;
  let leveledUp = false;
  let newMilestone: FriendshipStoryMilestone | null = null;

  // Kiểm tra thăng cấp thân thiết (Mỗi cấp cần 100 EXP, tối đa cấp 5)
  if (newLevel < 5 && newExp >= 100) {
    newLevel += 1;
    newExp -= 100;
    leveledUp = true;

    // Tìm cột mốc câu chuyện của cấp mới
    const milestone = customer.friendshipStories.find((m) => m.level === newLevel);
    if (milestone) {
      newMilestone = milestone;
    }
  } else if (newLevel >= 5) {
    newExp = Math.min(100, newExp); // Đạt mốc tối đa
  }

  const updatedCustomer: CustomerRegular = {
    ...customer,
    friendshipLevel: newLevel,
    friendshipExp: newExp,
    totalOrdersServed: customer.totalOrdersServed + 1,
    totalSpent: customer.totalSpent + orderTotal,
    lastVisitDay: currentDay,
    unlockedPerk: newMilestone?.perkDescription || customer.unlockedPerk,
  };

  return {
    updatedCustomer,
    leveledUp,
    newMilestone,
    expGained: expGain,
  };
}

/**
 * Tính toán tiền tip thưởng thêm dựa trên mức độ thân thiết của khách quen
 */
export function calculateRegularCustomerTipBonus(customer: CustomerRegular): number {
  switch (customer.friendshipLevel) {
    case 2:
      return 1500; // Cấp 2: Quen mặt
    case 3:
      return 3500; // Cấp 3: Bạn thân
    case 4:
      return 6000; // Cấp 4: Khách ruột
    case 5:
      return 10000; // Cấp 5: Tri kỷ
    default:
      return 0;
  }
}
