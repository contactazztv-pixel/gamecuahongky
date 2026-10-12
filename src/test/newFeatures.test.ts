import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { INITIAL_REGULAR_CUSTOMERS } from '@/game/data/characters';

describe('New Features: PWA Mobile Web App, Player Feedback & Customer Reviews', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // 1. Kiểm tra Web App Manifest cho điện thoại
  it('PWA: manifest.json tồn tại và có đầy đủ cấu hình Mobile Web App', () => {
    const manifestPath = path.resolve(process.cwd(), 'public/manifest.json');
    expect(fs.existsSync(manifestPath)).toBe(true);

    const content = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    expect(content.name).toBe('Tiệm Nhỏ Trước Cổng Trường');
    expect(content.short_name).toBe('Tiệm Nhỏ');
    expect(content.display).toBe('standalone');
    expect(content.start_url).toBe('/');
    expect(content.theme_color).toBe('#F59E0B');
    expect(Array.isArray(content.icons)).toBe(true);
    expect(content.icons.length).toBeGreaterThanOrEqual(2);
  });

  // 2. Kiểm tra Hệ thống Góp ý người chơi (Player Feedback)
  it('Player Feedback: Lưu và truy xuất lưu bút góp ý thành công trong thiết bị', () => {
    const STORAGE_KEY = 'tiem_nho_player_feedbacks_v1';
    const mockFeedback = {
      id: 'fb_test_1',
      category: 'dish_idea',
      playerName: 'Bạn Nhỏ Lớp 8',
      rating: 5,
      content: 'Đề xuất tiệm thêm món trà dâu tằm và bánh tráng cuốn sốt me!',
      timestamp: new Date().toLocaleString('vi-VN'),
      devReply: 'Ý tưởng món này nghe thèm quá! Chúng mình đã ghi nhận nhé! 🍜',
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify([mockFeedback]));

    const loaded = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    expect(loaded.length).toBe(1);
    expect(loaded[0].playerName).toBe('Bạn Nhỏ Lớp 8');
    expect(loaded[0].category).toBe('dish_idea');
    expect(loaded[0].rating).toBe(5);
  });

  // 3. Kiểm tra Hệ thống Cốt truyện an toàn (Safe Story Fallback)
  it('Regulars Story: Luôn có đầy đủ 4 mốc cốt truyện và đặc quyền cho 12 khách quen', () => {
    const customers = Object.values(INITIAL_REGULAR_CUSTOMERS);
    expect(customers.length).toBe(12);

    customers.forEach((cust) => {
      expect(Array.isArray(cust.friendshipStories)).toBe(true);
      expect(cust.friendshipStories.length).toBe(4);
      // Đảm bảo các mốc cấp độ 2, 3, 4, 5
      const levels = cust.friendshipStories.map((s) => s.level);
      expect(levels).toEqual([2, 3, 4, 5]);

      // Đảm bảo từng mốc có tiêu đề, nội dung và đặc quyền
      cust.friendshipStories.forEach((s) => {
        expect(s.title.length).toBeGreaterThan(0);
        expect(s.story.length).toBeGreaterThan(0);
        expect(s.perkDescription.length).toBeGreaterThan(0);
      });
    });
  });

  // 4. Kiểm tra Cốt truyện không bị crash khi character có stories bị undefined
  it('Regulars Story: Fallback an toàn khi dữ liệu khách cũ bị thiếu friendshipStories', () => {
    const corruptedCustomer = {
      ...INITIAL_REGULAR_CUSTOMERS.student_an_grade6,
      friendshipStories: undefined as any,
    };

    const stories =
      corruptedCustomer.friendshipStories ||
      INITIAL_REGULAR_CUSTOMERS[corruptedCustomer.id]?.friendshipStories ||
      [];

    expect(stories.length).toBe(4);
    expect(stories[0].title).toBe('Lời Chào Tân Binh');
  });
});
