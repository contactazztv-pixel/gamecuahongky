import { describe, it, expect } from 'vitest';
import {
  formatInGameTime,
  getPhaseFromMinute,
  advanceGameClock,
  DAY_START_MINUTE,
  DAY_END_MINUTE,
} from '@/game/engine/gameClock';

describe('Game Clock & Time Phases System', () => {
  it('định dạng chính xác phút thành chuỗi thời gian HH:mm', () => {
    expect(formatInGameTime(360)).toBe('06:00');
    expect(formatInGameTime(435)).toBe('07:15');
    expect(formatInGameTime(555)).toBe('09:15');
    expect(formatInGameTime(990)).toBe('16:30');
    expect(formatInGameTime(1125)).toBe('18:45');
  });

  it('xác định chính xác các giai đoạn trong ngày theo giờ game', () => {
    expect(getPhaseFromMinute(DAY_START_MINUTE)).toBe('before_school'); // 06:00
    expect(getPhaseFromMinute(560)).toBe('recess_rush');                // 09:20
    expect(getPhaseFromMinute(700)).toBe('noon_break');                 // 11:40
    expect(getPhaseFromMinute(1000)).toBe('dismissal_rush');            // 16:40
    expect(getPhaseFromMinute(1100)).toBe('evening_chill');             // 18:20
    expect(getPhaseFromMinute(DAY_END_MINUTE)).toBe('day_end');         // 18:45
  });

  it('bước nhảy đồng hồ phản ánh đúng tốc độ 1x và 2x', () => {
    // Tốc độ 1x: 10 giây -> +10 phút game
    const step1 = advanceGameClock(360, 10, 1);
    expect(step1.nextMinute).toBe(370);
    expect(step1.isDayEnd).toBe(false);

    // Tốc độ 2x: 10 giây -> +20 phút game
    const step2 = advanceGameClock(360, 10, 2);
    expect(step2.nextMinute).toBe(380);
    expect(step2.isDayEnd).toBe(false);

    // Chạm mốc kết thúc ngày
    const endStep = advanceGameClock(1120, 10, 1);
    expect(endStep.nextMinute).toBe(DAY_END_MINUTE);
    expect(endStep.isDayEnd).toBe(true);
    expect(endStep.phase).toBe('day_end');
  });
});
