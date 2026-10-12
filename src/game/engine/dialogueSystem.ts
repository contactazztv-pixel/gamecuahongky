import { Customer, WeatherType } from '../types';
import { GENERIC_DIALOGUES, WEATHER_EVENT_DIALOGUES } from '../data/dialogues';

export type DialogueContextState = 'intro' | 'happy' | 'warning' | 'angry';

/**
 * Lựa chọn câu thoại thông minh theo ngữ cảnh nhân vật, thời tiết và sự kiện học đường
 */
export function getContextualDialogue(
  customer: Customer,
  state: DialogueContextState,
  weather?: WeatherType,
  eventMood?: string
): string {
  // 1. Ưu tiên hội thoại sự kiện theo mùa khi khách xuất hiện
  if (state === 'intro' && eventMood && WEATHER_EVENT_DIALOGUES[eventMood]) {
    if (Math.random() < 0.4) {
      const eventLines = WEATHER_EVENT_DIALOGUES[eventMood];
      return eventLines[Math.floor(Math.random() * eventLines.length)];
    }
  }

  // 2. Ưu tiên hội thoại ngày mưa
  if (weather === 'rainy' && Math.random() < 0.45) {
    if (customer.dialogueRainy) {
      return customer.dialogueRainy;
    }
    const rainLines = WEATHER_EVENT_DIALOGUES.rainy;
    return rainLines[Math.floor(Math.random() * rainLines.length)];
  }

  // 3. Sử dụng câu thoại đặc trưng của chính nhân vật (tỉ lệ 75%)
  if (state === 'intro' && customer.dialogueIntro && Math.random() < 0.75) {
    return customer.dialogueIntro;
  }
  if (state === 'happy' && customer.dialogueHappy && Math.random() < 0.75) {
    return customer.dialogueHappy;
  }
  if (state === 'angry' && customer.dialogueAngry && Math.random() < 0.75) {
    return customer.dialogueAngry;
  }

  // 4. Chọn ngẫu nhiên từ kho thoại đa dạng chung để tránh nhàm chán
  const genericList = GENERIC_DIALOGUES[state];
  if (genericList && genericList.length > 0) {
    return genericList[Math.floor(Math.random() * genericList.length)];
  }

  return customer.dialogueIntro || 'Cảm ơn quán nhé!';
}
