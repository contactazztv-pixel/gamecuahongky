import { GameCalendar, SeasonalEvent, WeatherType } from '../types';
import { SCHOOL_SEASONAL_EVENTS } from '../data/events';

export interface CalendarDayEffect {
  trafficMultiplier: number;
  tipMultiplier: number;
  patienceMultiplier: number;
  activeEvent: SeasonalEvent | null;
  dayDescription: string;
  isSchoolDay: boolean;
}

/**
 * Tính toán thứ trong tuần (2: Thứ Hai -> 8: Chủ Nhật)
 */
export function getDayOfWeekNumber(day: number): number {
  return ((day - 1) % 7) + 2;
}

/**
 * Tính toán tuần học (Tuần 1, Tuần 2, Tuần 3...)
 */
export function getSchoolWeekNumber(day: number): number {
  return Math.floor((day - 1) / 7) + 1;
}

/**
 * Kiểm tra xem ngày hiện tại có phải là ngày học sinh đến trường không
 * Thứ 2 đến Thứ 6 (2 - 6): Đi học chính khóa
 * Thứ 7 (7): Học phụ đạo / ngoại khóa buổi sáng
 * Chủ Nhật (8): Ngày nghỉ cuối tuần hoàn toàn
 */
export function checkIsSchoolDay(dayOfWeek: number): boolean {
  return dayOfWeek >= 2 && dayOfWeek <= 7;
}

/**
 * Tìm sự kiện mùa giải / sự kiện học đường đang diễn ra trong ngày
 */
export function getActiveSeasonalEvent(day: number): SeasonalEvent | null {
  for (const evt of SCHOOL_SEASONAL_EVENTS) {
    if (evt.repeatIntervalDays) {
      // Sự kiện lặp lại (ví dụ Hội chợ cuối tuần mỗi 14 ngày)
      const cycleOffset = (day - 1) % evt.repeatIntervalDays;
      if (cycleOffset >= evt.startDay - 1 && cycleOffset <= evt.endDay - 1) {
        return evt;
      }
    } else {
      // Sự kiện theo ngày cố định (ví dụ Khai giảng ngày 1-3, Mùa thi ngày 8-11)
      if (day >= evt.startDay && day <= evt.endDay) {
        return evt;
      }
    }
  }
  return null;
}

/**
 * Xác định thời tiết cho ngày
 */
export function determineWeatherForDay(day: number, activeEvent: SeasonalEvent | null): WeatherType {
  if (activeEvent?.effects.weather) {
    return activeEvent.effects.weather;
  }
  // Chu kỳ thời tiết ngẫu nhiên nhưng ổn định theo ngày
  const weatherPattern = day % 7;
  if (weatherPattern === 4) return 'rainy'; // Ngày thứ 4 trong chu kỳ là ngày mưa
  if (weatherPattern === 0) return 'cool_breeze'; // Gió heo may mát rượi
  return 'sunny';
}

/**
 * Mô tả vắn tắt không khí học đường của ngày
 */
export function getSchoolDayVibe(dayOfWeek: number, activeEvent: SeasonalEvent | null): string {
  if (activeEvent) {
    return activeEvent.badge + ': ' + activeEvent.name;
  }
  switch (dayOfWeek) {
    case 2:
      return 'Thứ Hai - Lễ chào cờ đầu tuần trang nghiêm. Học sinh cần nhiều năng lượng sáng.';
    case 3:
      return 'Thứ Ba - Ngày học tập trung, các lớp học đều đặn, khách đông giờ ra chơi.';
    case 4:
      return 'Thứ Tư - Giữa tuần nhộn nhịp, học sinh thích tụ tập ăn vặt xả stress.';
    case 5:
      return 'Thứ Năm - Các câu lạc bộ bóng rổ, nhảy hiện đại sinh hoạt sau giờ học.';
    case 6:
      return 'Thứ Sáu - Buổi chiều tan trường rộn rã, học sinh háo hức đón cuối tuần.';
    case 7:
      return 'Thứ Bảy - Buổi sáng học phụ đạo; buổi chiều vỉa hè thong thả đón khách gia đình.';
    case 8:
      return 'Chủ Nhật - Ngày nghỉ cuối tuần! Khách ghé lai rai cả ngày, gọi nhiều món cỡ lớn.';
    default:
      return 'Ngày thường nhật vui tươi trước cổng trường.';
  }
}

/**
 * Tổng hợp toàn bộ hiệu ứng lịch học & sự kiện ảnh hưởng lên gameplay
 */
export function calculateCalendarDayEffects(day: number): CalendarDayEffect {
  const dayOfWeek = getDayOfWeekNumber(day);
  const isSchoolDay = checkIsSchoolDay(dayOfWeek);
  const activeEvent = getActiveSeasonalEvent(day);

  let trafficMult = isSchoolDay ? 1.0 : 0.85; // Cuối tuần ít khách học sinh hơn một chút nhưng bù lại gọi nhiều hơn
  let tipMult = 1.0;
  let patienceMult = isSchoolDay ? 1.0 : 1.25; // Cuối tuần khách thư thả, kiên nhẫn hơn 25%

  if (activeEvent) {
    trafficMult *= activeEvent.effects.trafficMultiplier;
    tipMult *= activeEvent.effects.tipMultiplier;
    patienceMult *= activeEvent.effects.patienceMultiplier;
  }

  // Thứ Sáu chiều học sinh vui vẻ tip thêm
  if (dayOfWeek === 6) {
    tipMult *= 1.15;
  }

  return {
    trafficMultiplier: Number(trafficMult.toFixed(2)),
    tipMultiplier: Number(tipMult.toFixed(2)),
    patienceMultiplier: Number(patienceMult.toFixed(2)),
    activeEvent,
    dayDescription: getSchoolDayVibe(dayOfWeek, activeEvent),
    isSchoolDay,
  };
}

/**
 * Tạo mới hoặc cập nhật đối tượng GameCalendar cho một ngày
 */
export function buildGameCalendarForDay(
  day: number,
  currentMinute: number = 360,
  timeSpeed: 1 | 2 = 1
): GameCalendar {
  const dayOfWeek = getDayOfWeekNumber(day);
  const schoolWeek = getSchoolWeekNumber(day);
  const isSchoolDay = checkIsSchoolDay(dayOfWeek);
  const activeEvent = getActiveSeasonalEvent(day);
  const weather = determineWeatherForDay(day, activeEvent);

  return {
    day,
    dayOfWeek,
    schoolWeek,
    isSchoolDay,
    timePeriod: 'before_school',
    weather,
    inGameMinute: currentMinute,
    timeSpeed,
    specialEvent: activeEvent ? activeEvent.name : undefined,
    activeEventId: activeEvent ? activeEvent.id : null,
    isRushHour: false,
  };
}
