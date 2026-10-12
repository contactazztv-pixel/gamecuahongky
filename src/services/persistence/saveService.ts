import { db, StoredSaveRecord } from './db';
import { GameSave, MenuItem, Quest, CustomerRegular } from '@/game/types';
import { GAME_CONFIG } from '@/game/config/gameMeta';
import { ALL_MENU_ITEMS } from '@/game/data/menuItems';
import { INITIAL_REGULAR_CUSTOMERS } from '@/game/data/characters';
import { INITIAL_QUESTS } from '@/game/data/quests';
import {
  getSchoolWeekNumber,
  checkIsSchoolDay,
  getDayOfWeekNumber,
  getActiveSeasonalEvent,
} from '@/game/engine/schoolCalendar';

const SAVE_KEY = 'current_save';
const LOCAL_STORAGE_FALLBACK_KEY = 'school_gate_save_fallback_v1';

export interface SaveResult {
  success: boolean;
  message: string;
  timestamp?: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  data?: GameSave;
}

/**
 * Nâng cấp (migrate) dữ liệu từ version cũ lên version mới nhất (Schema v3)
 */
export function migrateSaveData(rawSave: Partial<GameSave>): GameSave {
  const shop = rawSave.shop || ({} as Partial<GameSave['shop']>);
  const calendar = rawSave.calendar || ({} as Partial<GameSave['calendar']>);
  const currentDay = calendar.day || 1;
  const dayOfWeek = calendar.dayOfWeek || getDayOfWeekNumber(currentDay);
  const schoolWeek = calendar.schoolWeek || getSchoolWeekNumber(currentDay);
  const isSchoolDay = calendar.isSchoolDay ?? checkIsSchoolDay(dayOfWeek);
  const activeEvent = getActiveSeasonalEvent(currentDay);

  // 1. Đồng bộ thực đơn với catalog mới (bảo đảm có đủ 24 món, giữ trạng thái mở khóa)
  const existingMenuMap = new Map<string, MenuItem>();
  if (Array.isArray(rawSave.menuItems)) {
    rawSave.menuItems.forEach((m) => existingMenuMap.set(m.id, m));
  }

  const mergedMenuItems = ALL_MENU_ITEMS.map((baseItem) => {
    const existing = existingMenuMap.get(baseItem.id);
    if (existing) {
      return {
        ...baseItem,
        unlocked: existing.unlocked ?? baseItem.unlocked,
        isEnabled: existing.isEnabled ?? true,
        customPrice: existing.customPrice ?? baseItem.basePrice,
      };
    }
    return {
      ...baseItem,
      isEnabled: true,
      customPrice: baseItem.basePrice,
    };
  });

  // 2. Đồng bộ danh sách khách quen (Characters / Regulars)
  const existingCustomers = rawSave.regularCustomers || {};
  const mergedCustomers: Record<string, CustomerRegular> = {};
  for (const [id, baseCustomer] of Object.entries(INITIAL_REGULAR_CUSTOMERS)) {
    const savedCustomer = existingCustomers[id];
    if (savedCustomer) {
      mergedCustomers[id] = {
        ...baseCustomer,
        friendshipLevel: savedCustomer.friendshipLevel ?? baseCustomer.friendshipLevel,
        friendshipExp: savedCustomer.friendshipExp ?? baseCustomer.friendshipExp,
        totalOrdersServed: savedCustomer.totalOrdersServed ?? 0,
        totalSpent: savedCustomer.totalSpent ?? 0,
        lastVisitDay: savedCustomer.lastVisitDay,
        unlockedPerk: savedCustomer.unlockedPerk || baseCustomer.unlockedPerk,
      };
    } else {
      mergedCustomers[id] = { ...baseCustomer };
    }
  }

  // 3. Đồng bộ danh sách nhiệm vụ (Quests)
  const existingQuestMap = new Map<string, Quest>();
  if (Array.isArray(rawSave.quests)) {
    rawSave.quests.forEach((q) => existingQuestMap.set(q.id, q));
  }
  const mergedQuests = INITIAL_QUESTS.map((baseQuest) => {
    const existing = existingQuestMap.get(baseQuest.id);
    if (existing) {
      return {
        ...baseQuest,
        currentProgress: existing.currentProgress ?? baseQuest.currentProgress,
        completed: existing.completed ?? baseQuest.completed,
        claimed: existing.claimed ?? baseQuest.claimed,
      };
    }
    return baseQuest;
  });

  const migrated: GameSave = {
    version: GAME_CONFIG.saveSchemaVersion,
    saveId: rawSave.saveId || `save_${Date.now()}`,
    savedAt: rawSave.savedAt || new Date().toISOString(),
    player: {
      name: rawSave.player?.name || 'Chủ Quán',
      avatar: rawSave.player?.avatar || '👩‍🍳',
      title: rawSave.player?.title || 'Chủ Quán Tập Sự',
      daysPlayed: rawSave.player?.daysPlayed || 1,
      totalEarnings: rawSave.player?.totalEarnings || 0,
      totalOrdersServed: rawSave.player?.totalOrdersServed || 0,
    },
    shop: {
      name: shop.name || 'Tiệm Nhỏ',
      businessModelId: shop.businessModelId || 'boba_tea',
      level: shop.level || 1,
      exp: shop.exp || 0,
      expToNextLevel: shop.expToNextLevel || 100,
      reputation: shop.reputation || 30,
      customerSatisfaction: shop.customerSatisfaction ?? 85,
      cash: shop.cash ?? 3500000,
      cleanliness: shop.cleanliness ?? 100,
      upgrades: shop.upgrades || [],
      maxInventoryCapacity: shop.maxInventoryCapacity || 200,
      cookingSlotsCount: shop.cookingSlotsCount || 1,
      dailyOperatingCost: shop.dailyOperatingCost || 50000,
    },
    calendar: {
      day: currentDay,
      dayOfWeek,
      schoolWeek,
      isSchoolDay,
      timePeriod: calendar.timePeriod || 'before_school',
      weather: calendar.weather || 'sunny',
      inGameMinute: calendar.inGameMinute || 360,
      timeSpeed: calendar.timeSpeed || 1,
      isRushHour: calendar.isRushHour || false,
      specialEvent: activeEvent ? activeEvent.name : calendar.specialEvent,
      activeEventId: activeEvent ? activeEvent.id : (calendar.activeEventId || null),
    },
    inventory: rawSave.inventory || {},
    inventoryLogs: rawSave.inventoryLogs || [],
    menuItems: mergedMenuItems,
    quests: mergedQuests,
    achievements: rawSave.achievements || [],
    recentDayReports: rawSave.recentDayReports || [],
    dailyLedgers: rawSave.dailyLedgers || [],
    regularCustomers: mergedCustomers,
    stats: rawSave.stats || {
      totalRevenue: rawSave.player?.totalEarnings || 0,
      totalExpenses: 0,
      totalCustomersServed: rawSave.player?.totalOrdersServed || 0,
      totalCustomersLost: 0,
      favoriteItemSold: {},
      daysWithoutDeficit: currentDay,
    },
  };

  return migrated;
}

/**
 * Kiểm tra tính hợp lệ của đối tượng dữ liệu lưu (Schema Validation)
 */
export function validateSaveSchema(data: unknown): ValidationResult {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Dữ liệu không phải là một đối tượng JSON hợp lệ.' };
  }

  const obj = data as Partial<GameSave>;

  if (typeof obj.version !== 'number') {
    return { valid: false, error: 'Thiếu thông tin phiên bản dữ liệu lưu (version).' };
  }

  if (obj.version > GAME_CONFIG.saveSchemaVersion) {
    return {
      valid: false,
      error: `Bản lưu thuộc phiên bản mới hơn (${obj.version}) so với trò chơi hiện tại (${GAME_CONFIG.saveSchemaVersion}). Vui lòng cập nhật game.`,
    };
  }

  if (!obj.player || typeof obj.player.name !== 'string') {
    return { valid: false, error: 'Thiếu thông tin hồ sơ người chơi (player).' };
  }

  if (!obj.shop || typeof obj.shop.name !== 'string' || typeof obj.shop.cash !== 'number') {
    return { valid: false, error: 'Thiếu thông tin trạng thái cửa hàng (shop).' };
  }

  if (!obj.calendar || typeof obj.calendar.day !== 'number') {
    return { valid: false, error: 'Thiếu thông tin lịch trình thời gian (calendar).' };
  }

  if (!obj.inventory || typeof obj.inventory !== 'object') {
    return { valid: false, error: 'Thiếu thông tin kho nguyên liệu (inventory).' };
  }

  if (!Array.isArray(obj.menuItems)) {
    return { valid: false, error: 'Thiếu danh sách thực đơn (menuItems).' };
  }

  const normalized = migrateSaveData(obj);
  return { valid: true, data: normalized };
}

/**
 * Lưu tiến trình game vào IndexedDB (với fallback localStorage)
 */
export async function saveGameToStorage(saveData: GameSave): Promise<SaveResult> {
  const timestamp = new Date().toISOString();
  const updatedData: GameSave = {
    ...saveData,
    version: GAME_CONFIG.saveSchemaVersion,
    savedAt: timestamp,
  };

  try {
    const record: StoredSaveRecord = {
      id: SAVE_KEY,
      savedAt: timestamp,
      version: GAME_CONFIG.saveSchemaVersion,
      data: updatedData,
    };

    await db.saves.put(record);

    try {
      localStorage.setItem(LOCAL_STORAGE_FALLBACK_KEY, JSON.stringify(updatedData));
    } catch {
      // LocalStorage quota may be reached, harmless
    }

    return {
      success: true,
      message: 'Đã lưu tiến trình thành công vào thiết bị.',
      timestamp,
    };
  } catch (idbError) {
    console.warn('IndexedDB write warning, attempting localStorage fallback:', idbError);
    try {
      localStorage.setItem(LOCAL_STORAGE_FALLBACK_KEY, JSON.stringify(updatedData));
      return {
        success: true,
        message: 'Đã lưu vào bộ nhớ trình duyệt dự phòng.',
        timestamp,
      };
    } catch (lsError) {
      console.error('All storage attempts failed:', lsError);
      return {
        success: false,
        message: 'Không thể lưu tiến trình: Trình duyệt từ chối cấp quyền lưu trữ.',
      };
    }
  }
}

/**
 * Đọc bản lưu mới nhất từ IndexedDB hoặc localStorage fallback
 */
export async function loadGameFromStorage(): Promise<GameSave | null> {
  try {
    const record = await db.saves.get(SAVE_KEY);
    if (record && record.data) {
      const validation = validateSaveSchema(record.data);
      if (validation.valid && validation.data) {
        return validation.data;
      }
    }
  } catch (err) {
    console.warn('Error reading from IndexedDB, checking fallback:', err);
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_FALLBACK_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const validation = validateSaveSchema(parsed);
      if (validation.valid && validation.data) {
        return validation.data;
      }
    }
  } catch (err) {
    console.error('Error reading localStorage fallback:', err);
  }

  return null;
}

/**
 * Kiểm tra xem có bản lưu game hợp lệ hay không
 */
export async function hasExistingSave(): Promise<boolean> {
  const save = await loadGameFromStorage();
  return save !== null;
}

/**
 * Xóa toàn bộ dữ liệu lưu game
 */
export async function deleteGameSave(): Promise<boolean> {
  try {
    await db.saves.delete(SAVE_KEY);
  } catch (e) {
    console.warn('Error deleting IndexedDB record:', e);
  }

  try {
    localStorage.removeItem(LOCAL_STORAGE_FALLBACK_KEY);
  } catch (e) {
    console.warn('Error deleting localStorage key:', e);
  }

  return true;
}

/**
 * Xuất dữ liệu lưu thành chuỗi JSON
 */
export function exportSaveToJsonString(saveData: GameSave): string {
  return JSON.stringify(saveData, null, 2);
}

/**
 * Kích hoạt tải về file lưu JSON trên trình duyệt
 */
export function triggerSaveFileDownload(saveData: GameSave): void {
  const jsonString = exportSaveToJsonString(saveData);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  const shopNameSlug = saveData.shop.name.replace(/\s+/g, '_').toLowerCase();
  const dateStr = new Date().toISOString().slice(0, 10);
  anchor.href = url;
  anchor.download = `tiem_nho_save_${shopNameSlug}_day${saveData.calendar.day}_${dateStr}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Nhập và kiểm tra dữ liệu lưu từ chuỗi JSON tải lên
 */
export function importSaveFromJsonString(jsonString: string): ValidationResult {
  try {
    const parsed = JSON.parse(jsonString);
    return validateSaveSchema(parsed);
  } catch {
    return {
      valid: false,
      error: 'File không đúng định dạng JSON hoặc bị lỗi cú pháp.',
    };
  }
}
