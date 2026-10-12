import { TimePeriod } from '../types';

/**
 * Các mốc thời gian trong ngày (tính theo phút từ 00:00)
 * 06:00 = 360
 * 07:15 = 435
 * 09:15 = 555
 * 09:45 = 585
 * 11:30 = 690
 * 12:30 = 750
 * 16:30 = 990
 * 17:45 = 1065
 * 18:45 = 1125
 */
export const DAY_START_MINUTE = 360; // 06:00 sáng
export const DAY_END_MINUTE = 1125;   // 18:45 tối đóng quán

/**
 * Định dạng phút trong ngày thành chuỗi HH:mm (Ví dụ: 360 -> "06:00")
 */
export function formatInGameTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.floor(minutes % 60);
  const hh = h < 10 ? `0${h}` : `${h}`;
  const mm = m < 10 ? `0${m}` : `${m}`;
  return `${hh}:${mm}`;
}

/**
 * Xác định giai đoạn trong ngày dựa vào phút hiện tại
 */
export function getPhaseFromMinute(minute: number): TimePeriod {
  if (minute >= DAY_END_MINUTE) return 'day_end';
  if (minute < 435) return 'before_school';   // 06:00 - 07:15
  if (minute < 555) return 'school_hours';    // 07:15 - 09:15
  if (minute < 585) return 'recess_rush';     // 09:15 - 09:45
  if (minute < 690) return 'school_hours';    // 09:45 - 11:30
  if (minute < 750) return 'noon_break';      // 11:30 - 12:30
  if (minute < 990) return 'school_hours';    // 12:30 - 16:30
  if (minute < 1065) return 'dismissal_rush'; // 16:30 - 17:45
  return 'evening_chill';                     // 17:45 - 18:45
}

/**
 * Cập nhật bước nhảy đồng hồ trong game
 * Tỷ lệ cân bằng: 1 giây thực = 1 phút trong game ở tốc độ 1x, 2 phút ở tốc độ 2x
 */
export function advanceGameClock(
  currentMinute: number,
  deltaSeconds: number,
  speed: 1 | 2
): { nextMinute: number; phase: TimePeriod; isDayEnd: boolean } {
  const minutesToAdd = deltaSeconds * speed;
  const nextMinute = Math.min(DAY_END_MINUTE, currentMinute + minutesToAdd);
  const isDayEnd = nextMinute >= DAY_END_MINUTE;
  const phase = getPhaseFromMinute(nextMinute);

  return {
    nextMinute,
    phase,
    isDayEnd,
  };
}
