import { describe, it, expect } from 'vitest';
import { CUSTOMER_ROSTER } from '@/game/data/customers';
import { getContextualDialogue } from '@/game/engine/dialogueSystem';

describe('Dialogue Engine - Hệ Thống Hội Thoại Học Đường', () => {
  it('chọn câu thoại đặc trưng cho nhân vật', () => {
    const an = CUSTOMER_ROSTER.find((c) => c.id === 'student_an_grade6')!;
    const introLine = getContextualDialogue(an, 'intro');
    expect(typeof introLine).toBe('string');
    expect(introLine.length).toBeGreaterThan(0);
  });

  it('lấy câu thoại ngày mưa khi thời tiết là rainy', () => {
    const an = CUSTOMER_ROSTER.find((c) => c.id === 'student_an_grade6')!;
    const rainyLine = getContextualDialogue(an, 'intro', 'rainy');
    expect(typeof rainyLine).toBe('string');
    expect(rainyLine.length).toBeGreaterThan(0);
  });

  it('hỗ trợ các trạng thái tâm trạng khác nhau: happy, warning, angry', () => {
    const nam = CUSTOMER_ROSTER.find((c) => c.id === 'student_nam_senior')!;
    const happyLine = getContextualDialogue(nam, 'happy');
    const angryLine = getContextualDialogue(nam, 'angry');

    expect(typeof happyLine).toBe('string');
    expect(typeof angryLine).toBe('string');
    expect(happyLine).not.toBe(angryLine);
  });
});
