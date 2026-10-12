import { describe, it, expect } from 'vitest';
import {
  getDayOfWeekNumber,
  getSchoolWeekNumber,
  checkIsSchoolDay,
  getActiveSeasonalEvent,
  calculateCalendarDayEffects,
  buildGameCalendarForDay,
} from '@/game/engine/schoolCalendar';

describe('School Calendar Engine - Chu Kỳ Học Đường & Sự Kiện', () => {
  it('tính toán chính xác thứ trong tuần và tuần học', () => {
    // Ngày 1: Thứ Hai (2), Tuần 1
    expect(getDayOfWeekNumber(1)).toBe(2);
    expect(getSchoolWeekNumber(1)).toBe(1);

    // Ngày 6: Thứ Bảy (7), Tuần 1
    expect(getDayOfWeekNumber(6)).toBe(7);
    expect(getSchoolWeekNumber(6)).toBe(1);

    // Ngày 7: Chủ Nhật (8), Tuần 1
    expect(getDayOfWeekNumber(7)).toBe(8);
    expect(getSchoolWeekNumber(7)).toBe(1);

    // Ngày 8: Thứ Hai (2), Tuần 2
    expect(getDayOfWeekNumber(8)).toBe(2);
    expect(getSchoolWeekNumber(8)).toBe(2);

    // Ngày 15: Thứ Hai (2), Tuần 3
    expect(getDayOfWeekNumber(15)).toBe(2);
    expect(getSchoolWeekNumber(15)).toBe(3);
  });

  it('phân biệt chính xác ngày học sinh đi học và ngày nghỉ cuối tuần', () => {
    // Thứ 2 đến Thứ 7 là ngày học
    expect(checkIsSchoolDay(2)).toBe(true);
    expect(checkIsSchoolDay(6)).toBe(true);
    expect(checkIsSchoolDay(7)).toBe(true);

    // Chủ Nhật là ngày nghỉ
    expect(checkIsSchoolDay(8)).toBe(false);
  });

  it('nhận diện đúng sự kiện theo mùa học đường kích hoạt theo ngày', () => {
    // Ngày 1 đến 3: Mùa tựu trường & khai giảng
    const eventDay1 = getActiveSeasonalEvent(1);
    expect(eventDay1).not.toBeNull();
    expect(eventDay1?.id).toBe('event_back_to_school');

    const eventDay3 = getActiveSeasonalEvent(3);
    expect(eventDay3?.id).toBe('event_back_to_school');

    // Ngày 9: Mùa thi giữa kỳ căng thẳng (ngày 8 - 11)
    const eventDay9 = getActiveSeasonalEvent(9);
    expect(eventDay9).not.toBeNull();
    expect(eventDay9?.id).toBe('event_midterm_exam');
    expect(eventDay9?.effects.trafficMultiplier).toBeGreaterThan(1.0);
  });

  it('áp dụng đúng hiệu ứng kinh tế của lịch học và sự kiện', () => {
    // Ngày 1 có sự kiện Khai Giảng: lượng khách và tip được buff
    const effectsDay1 = calculateCalendarDayEffects(1);
    expect(effectsDay1.isSchoolDay).toBe(true);
    expect(effectsDay1.trafficMultiplier).toBeGreaterThan(1.2);
    expect(effectsDay1.tipMultiplier).toBeGreaterThan(1.1);

    // Ngày 7 (Chủ Nhật): Khách kiên nhẫn hơn
    const effectsDay7 = calculateCalendarDayEffects(7);
    expect(effectsDay7.isSchoolDay).toBe(false);
    expect(effectsDay7.patienceMultiplier).toBeGreaterThan(1.0);
  });

  it('khởi tạo đối tượng GameCalendar đầy đủ thuộc tính', () => {
    const cal = buildGameCalendarForDay(2);
    expect(cal.day).toBe(2);
    expect(cal.dayOfWeek).toBe(3); // Thứ Ba
    expect(cal.schoolWeek).toBe(1);
    expect(cal.isSchoolDay).toBe(true);
    expect(cal.timePeriod).toBe('before_school');
    expect(cal.activeEventId).toBe('event_back_to_school');
  });
});
