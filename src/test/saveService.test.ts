import { describe, it, expect } from 'vitest';
import {
  validateSaveSchema,
  exportSaveToJsonString,
  importSaveFromJsonString,
} from '@/services/persistence/saveService';
import { GameSave } from '@/game/types';
import { GAME_CONFIG } from '@/game/config/gameMeta';

describe('Save Service & Schema Migration', () => {
  const validMockSaveV1: GameSave = {
    version: 1, // Bản lưu v1 cũ
    saveId: 'save_mock_v1',
    savedAt: new Date().toISOString(),
    player: {
      name: 'Chủ Quán Test',
      avatar: '👩‍🍳',
      title: 'Tập sự',
      daysPlayed: 1,
      totalEarnings: 50000,
      totalOrdersServed: 3,
    },
    shop: {
      name: 'Tiệm Trà Sữa Test',
      businessModelId: 'boba_tea',
      level: 1,
      exp: 20,
      expToNextLevel: 100,
      reputation: 30,
      cash: 3500000,
      cleanliness: 100,
      upgrades: [],
      maxInventoryCapacity: 150,
      cookingSlotsCount: 1,
      dailyOperatingCost: 50000,
    },
    calendar: {
      day: 1,
      dayOfWeek: 2,
      timePeriod: 'recess_rush',
      weather: 'sunny',
      inGameMinute: 555,
      timeSpeed: 1,
      isRushHour: true,
    },
    inventory: {
      tra_den: 15,
      sua_dac: 12,
    },
    menuItems: [],
    quests: [],
    achievements: [],
    recentDayReports: [],
    stats: {
      totalRevenue: 50000,
      totalExpenses: 15000,
      totalCustomersServed: 3,
      totalCustomersLost: 0,
      favoriteItemSold: {},
      daysWithoutDeficit: 1,
    },
  };

  it('tự động nâng cấp bản lưu cũ lên schema v3 mà không làm mất dữ liệu', () => {
    const res = validateSaveSchema(validMockSaveV1);
    expect(res.valid).toBe(true);
    expect(res.data).toBeDefined();
    expect(res.data?.version).toBe(GAME_CONFIG.saveSchemaVersion);
    expect(res.data?.shop.maxInventoryCapacity).toBe(150);
    expect(res.data?.shop.cookingSlotsCount).toBe(1);
    expect(res.data?.menuItems.length).toBeGreaterThanOrEqual(24);
    expect(res.data?.regularCustomers).toBeDefined();
    expect(res.data?.calendar.schoolWeek).toBe(1);
  });

  it('từ chối dữ liệu không phải object hoặc null', () => {
    expect(validateSaveSchema(null).valid).toBe(false);
    expect(validateSaveSchema('string').valid).toBe(false);
    expect(validateSaveSchema(123).valid).toBe(false);
  });

  it('từ chối khi thiếu các trường bắt buộc', () => {
    const missingPlayer = { ...validMockSaveV1, player: undefined };
    expect(validateSaveSchema(missingPlayer).valid).toBe(false);

    const missingShop = { ...validMockSaveV1, shop: undefined };
    expect(validateSaveSchema(missingShop).valid).toBe(false);

    const missingCalendar = { ...validMockSaveV1, calendar: undefined };
    expect(validateSaveSchema(missingCalendar).valid).toBe(false);
  });

  it('từ chối bản lưu có version tương lai lớn hơn schema game', () => {
    const futureSave = { ...validMockSaveV1, version: 999 };
    const res = validateSaveSchema(futureSave);
    expect(res.valid).toBe(false);
    expect(res.error).toContain('phiên bản');
  });

  it('xuất file JSON và nhập lại hoàn toàn toàn vẹn', () => {
    const jsonStr = exportSaveToJsonString(validMockSaveV1);
    expect(typeof jsonStr).toBe('string');

    const importRes = importSaveFromJsonString(jsonStr);
    expect(importRes.valid).toBe(true);
    expect(importRes.data?.shop.name).toBe('Tiệm Trà Sữa Test');
  });

  it('từ chối file JSON bị lỗi cú pháp', () => {
    const corrupted = '{ invalid json "broken"';
    const importRes = importSaveFromJsonString(corrupted);
    expect(importRes.valid).toBe(false);
    expect(importRes.error).toBeDefined();
  });
});
