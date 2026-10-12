import { Customer } from '../types';
import { ALL_REGULAR_CUSTOMERS } from './characters';

/**
 * Danh sách mẫu khách hàng dùng cho hệ thống sinh đơn ngẫu nhiên (Customer Generator)
 * Được đồng bộ trực tiếp từ cơ sở dữ liệu khách quen (characters.ts)
 */
export const CUSTOMER_ROSTER: Customer[] = ALL_REGULAR_CUSTOMERS.map((char) => ({
  id: char.id,
  templateId: char.id,
  name: char.name,
  type: char.type,
  typeLabel: char.typeLabel,
  avatar: char.avatar,
  patienceSeconds: char.patienceSeconds,
  dialogueIntro: char.dialogueIntro,
  dialogueHappy: char.dialogueHappy,
  dialogueAngry: char.dialogueAngry,
  dialogueRainy: char.dialogueRainy,
  dialogueEvent: char.dialogueEvent,
  favoriteItemIds: char.favoriteItemIds,
  spendingPower: char.spendingPower,
  friendshipLevel: char.friendshipLevel,
}));
