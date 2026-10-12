import { create } from 'zustand';
import {
  ActiveOrder,
  BusinessModelId,
  CustomerRegular,
  DayReport,
  FinancialLedger,
  GameCalendar,
  GameSave,
  Inventory,
  InventoryLogEntry,
  MenuItem,
  PlayerProfile,
  Quest,
  Achievement,
  ScreenId,
  SeasonalEvent,
  ShopState,
} from '@/game/types';
import { BUSINESS_MODELS } from '@/game/data/businessModels';
import { ALL_MENU_ITEMS } from '@/game/data/menuItems';
import { INGREDIENT_DATABASE } from '@/game/data/ingredients';
import { INITIAL_QUESTS, INITIAL_ACHIEVEMENTS } from '@/game/data/quests';
import { INITIAL_REGULAR_CUSTOMERS } from '@/game/data/characters';
import { SHOP_UPGRADES } from '@/game/data/upgrades';
import {
  generateNewOrder,
} from '@/game/engine/orderGenerator';
import {
  canStartCooking,
  startCookingOrder,
  tickCookingOrders,
  deliverReadyOrder,
} from '@/game/engine/cookingSystem';
import {
  calculateUsedCapacity,
  executePurchaseStock,
} from '@/game/engine/inventorySystem';
import {
  calculateFinancialLedger,
  generateDayReport,
  getExpNeededForLevel,
} from '@/game/engine/economy';
import {
  advanceGameClock,
  DAY_START_MINUTE,
} from '@/game/engine/gameClock';
import {
  buildGameCalendarForDay,
  calculateCalendarDayEffects,
  getActiveSeasonalEvent,
} from '@/game/engine/schoolCalendar';
import {
  recordRegularCustomerVisit,
  calculateRegularCustomerTipBonus,
} from '@/game/engine/customerRelationship';
import {
  processQuestProgress,
  claimQuestReward as claimQuestRewardEngine,
  refreshDailyQuests,
  refreshWeeklyQuests,
  checkAchievementsUnlock,
} from '@/game/engine/questSystem';
import {
  saveGameToStorage,
  loadGameFromStorage,
  deleteGameSave,
  hasExistingSave,
  importSaveFromJsonString,
} from '@/services/persistence/saveService';
import { soundManager } from '@/services/audio/soundEffects';

export type DockTab =
  | 'service'
  | 'menu'
  | 'inventory'
  | 'upgrade'
  | 'quests'
  | 'ledger'
  | 'regulars'
  | 'calendar';

export interface GameStoreState {
  currentScreen: ScreenId;
  hasSavedGameAvailable: boolean;

  // Cấu hình khởi tạo ban đầu
  selectedModelId: BusinessModelId;
  shopNameDraft: string;
  playerNameDraft: string;

  // Dữ liệu trò chơi chính
  player: PlayerProfile;
  shop: ShopState;
  calendar: GameCalendar;
  inventory: Inventory;
  inventoryLogs: InventoryLogEntry[];
  menuItems: MenuItem[];
  quests: Quest[];
  achievements: Achievement[];
  activeOrders: ActiveOrder[];
  regularCustomers: Record<string, CustomerRegular>;
  activeSeasonalEvent: SeasonalEvent | null;

  // Thống kê ngày hiện tại
  dayRevenue: number;
  dayTips: number;
  dayCogs: number;
  dayPurchaseExpenses: number;
  dayUpgradeExpenses: number;
  dayOrdersServed: number;
  dayOrdersLost: number;
  dishSalesCountToday: Record<string, number>;
  latestDayReport: DayReport | null;
  dailyLedgers: FinancialLedger[];
  isDayReportModalOpen: boolean;

  // Trạng thái giao diện & thời gian
  activeDockTab: DockTab;
  isPaused: boolean;
  isSettingsOpen: boolean;
  isSaveNotificationVisible: boolean;
  saveNotificationText: string;

  // Actions
  checkExistingSave: () => Promise<void>;
  setScreen: (screen: ScreenId) => void;
  setSelectedModelId: (id: BusinessModelId) => void;
  setShopNameDraft: (name: string) => void;
  setPlayerNameDraft: (name: string) => void;
  setActiveDockTab: (tab: DockTab) => void;
  setPaused: (paused: boolean) => void;
  setTimeSpeed: (speed: 1 | 2) => void;
  setSettingsOpen: (open: boolean) => void;
  closeDayReportModal: () => void;

  startNewGame: (modelId: BusinessModelId, shopName: string, playerName: string) => Promise<void>;
  loadGame: () => Promise<boolean>;
  manualSaveGame: () => Promise<boolean>;
  deleteCurrentSave: () => Promise<boolean>;
  importGameData: (jsonStr: string) => { success: boolean; error?: string };
  exportGameData: () => GameSave;

  // Game clock & loop actions
  tickSeconds: (deltaSec: number) => void;
  startCooking: (orderId: string) => { success: boolean; message: string };
  finishInteractiveCooking: (orderId: string) => { success: boolean; message: string };
  serveOrder: (orderId: string) => { success: boolean; message: string };
  buyIngredient: (ingredientId: string, packagesCount: number) => { success: boolean; message: string };
  buyIngredientsBatch: (items: { ingredientId: string; quantity: number }[]) => { success: boolean; message: string };
  toggleMenuItemEnabled: (itemId: string) => void;
  updateMenuItemPrice: (itemId: string, newPrice: number) => void;
  buyUpgrade: (upgradeId: string) => { success: boolean; message: string };
  claimQuestReward: (questId: string) => void;
  advanceToNextPeriod: () => void;
  endCurrentDay: () => void;
  startNextDay: () => void;
}

const DEFAULT_PLAYER: PlayerProfile = {
  name: 'Bé Vy',
  avatar: '👩‍🍳',
  title: 'Chủ Quán Tập Sự',
  daysPlayed: 1,
  totalEarnings: 0,
  totalOrdersServed: 0,
};

const DEFAULT_SHOP: ShopState = {
  name: 'Tiệm Nhỏ Trước Cổng Trường',
  businessModelId: 'boba_tea',
  level: 1,
  exp: 0,
  expToNextLevel: 100,
  reputation: 30,
  customerSatisfaction: 85,
  cash: 3500000,
  cleanliness: 100,
  upgrades: [],
  maxInventoryCapacity: 200,
  cookingSlotsCount: 1,
  dailyOperatingCost: 50000,
};

const DEFAULT_CALENDAR: GameCalendar = {
  day: 1,
  dayOfWeek: 2,
  schoolWeek: 1,
  isSchoolDay: true,
  timePeriod: 'before_school',
  weather: 'sunny',
  inGameMinute: DAY_START_MINUTE,
  timeSpeed: 1,
  isRushHour: false,
  specialEvent: 'Mùa Tựu Trường & Khai Giảng',
  activeEventId: 'event_back_to_school',
};

export const useGameStore = create<GameStoreState>((set, get) => ({
  currentScreen: 'splash',
  hasSavedGameAvailable: false,

  selectedModelId: 'boba_tea',
  shopNameDraft: 'Tiệm Trà Sữa Góc Cây Phượng',
  playerNameDraft: 'Bé Vy',

  player: DEFAULT_PLAYER,
  shop: DEFAULT_SHOP,
  calendar: DEFAULT_CALENDAR,
  inventory: {},
  inventoryLogs: [],
  menuItems: ALL_MENU_ITEMS,
  quests: INITIAL_QUESTS,
  achievements: INITIAL_ACHIEVEMENTS,
  activeOrders: [],
  regularCustomers: INITIAL_REGULAR_CUSTOMERS,
  activeSeasonalEvent: getActiveSeasonalEvent(1),

  dayRevenue: 0,
  dayTips: 0,
  dayCogs: 0,
  dayPurchaseExpenses: 0,
  dayUpgradeExpenses: 0,
  dayOrdersServed: 0,
  dayOrdersLost: 0,
  dishSalesCountToday: {},
  latestDayReport: null,
  dailyLedgers: [],
  isDayReportModalOpen: false,

  activeDockTab: 'service',
  isPaused: false,
  isSettingsOpen: false,
  isSaveNotificationVisible: false,
  saveNotificationText: '',

  checkExistingSave: async () => {
    const exists = await hasExistingSave();
    set({ hasSavedGameAvailable: exists });
  },

  setScreen: (screen) => {
    soundManager.playClick();
    set({ currentScreen: screen });
    if (screen === 'main_game') {
      get().manualSaveGame();
    }
  },

  setSelectedModelId: (id) => {
    soundManager.playClick();
    set({ selectedModelId: id });
  },

  setShopNameDraft: (name) => set({ shopNameDraft: name }),
  setPlayerNameDraft: (name) => set({ playerNameDraft: name }),
  setActiveDockTab: (tab) => {
    soundManager.playClick();
    set({ activeDockTab: tab });
  },
  setPaused: (paused) => set({ isPaused: paused }),
  setTimeSpeed: (speed) => set((s) => ({ calendar: { ...s.calendar, timeSpeed: speed } })),
  setSettingsOpen: (open) => set({ isSettingsOpen: open }),
  closeDayReportModal: () => set({ isDayReportModalOpen: false }),

  startNewGame: async (modelId, shopName, playerName) => {
    const selectedModel = BUSINESS_MODELS[modelId] || BUSINESS_MODELS.boba_tea;

    // Kho ban đầu phù hợp từng mô hình (~85-95 đơn vị, sức chứa 200)
    const initialInventory: Inventory = {};
    if (modelId === 'boba_tea') {
      initialInventory['tra_den'] = 10;
      initialInventory['sua_dac'] = 10;
      initialInventory['tran_chau_den'] = 15;
      initialInventory['dao_ngam'] = 8;
      initialInventory['chanh_tuoi_tac'] = 10;
      initialInventory['bot_milo'] = 10;
      initialInventory['ly_ong_hut'] = 25;
    } else if (modelId === 'street_snack') {
      initialInventory['banh_trang'] = 15;
      initialInventory['muoi_tom_sate'] = 15;
      initialInventory['ca_vien_tom_vien'] = 15;
      initialInventory['xuc_xich_loc_xoay'] = 10;
      initialInventory['trung_cut'] = 20;
      initialInventory['dau_an'] = 10;
      initialInventory['mi_goi_chua_cay'] = 10;
    } else {
      // breakfast_stall
      initialInventory['banh_mi_o'] = 15;
      initialInventory['pate_gan'] = 12;
      initialInventory['cha_lua_heo'] = 12;
      initialInventory['trung_ga'] = 12;
      initialInventory['nep_bap_dua'] = 15;
      initialInventory['dua_leo_do_chua'] = 15;
      initialInventory['dau_an'] = 8;
    }

    // Mở khóa các món ban đầu của mô hình
    const initialMenuItems = ALL_MENU_ITEMS.map((item) => ({
      ...item,
      unlocked: selectedModel.unlockedMenuIds.includes(item.id),
      isEnabled: true,
      customPrice: item.basePrice,
    }));

    const newShopState: ShopState = {
      name: shopName.trim() || selectedModel.name,
      businessModelId: modelId,
      level: 1,
      exp: 0,
      expToNextLevel: 100,
      reputation: 30,
      customerSatisfaction: 85,
      cash: selectedModel.startingCash,
      cleanliness: 100,
      upgrades: [],
      maxInventoryCapacity: 200,
      cookingSlotsCount: 1,
      dailyOperatingCost: 50000,
    };

    const newPlayerState: PlayerProfile = {
      name: playerName.trim() || 'Chủ Quán',
      avatar: '👩‍🍳',
      title: 'Chủ Quán Mới Nhậm Chức',
      daysPlayed: 1,
      totalEarnings: 0,
      totalOrdersServed: 0,
    };

    const newCalendar = buildGameCalendarForDay(1);

    set({
      player: newPlayerState,
      shop: newShopState,
      calendar: newCalendar,
      inventory: initialInventory,
      inventoryLogs: [],
      menuItems: initialMenuItems,
      quests: INITIAL_QUESTS.map((q) => ({ ...q, currentProgress: 0, completed: false, claimed: false })),
      achievements: INITIAL_ACHIEVEMENTS,
      activeOrders: [],
      regularCustomers: { ...INITIAL_REGULAR_CUSTOMERS },
      activeSeasonalEvent: getActiveSeasonalEvent(1),
      dayRevenue: 0,
      dayTips: 0,
      dayCogs: 0,
      dayPurchaseExpenses: 0,
      dayUpgradeExpenses: 0,
      dayOrdersServed: 0,
      dayOrdersLost: 0,
      dishSalesCountToday: {},
      latestDayReport: null,
      dailyLedgers: [],
      isDayReportModalOpen: false,
      currentScreen: 'main_game',
      activeDockTab: 'service',
    });

    await get().manualSaveGame();
    await get().checkExistingSave();
  },

  loadGame: async () => {
    const saved = await loadGameFromStorage();
    if (!saved) return false;

    set({
      player: saved.player,
      shop: saved.shop,
      calendar: saved.calendar,
      inventory: saved.inventory,
      inventoryLogs: saved.inventoryLogs || [],
      menuItems: saved.menuItems,
      quests: saved.quests,
      achievements: saved.achievements,
      activeOrders: [],
      regularCustomers: saved.regularCustomers || { ...INITIAL_REGULAR_CUSTOMERS },
      activeSeasonalEvent: getActiveSeasonalEvent(saved.calendar.day),
      dayRevenue: 0,
      dayTips: 0,
      dayCogs: 0,
      dayPurchaseExpenses: 0,
      dayUpgradeExpenses: 0,
      dayOrdersServed: 0,
      dayOrdersLost: 0,
      dishSalesCountToday: {},
      latestDayReport: null,
      dailyLedgers: saved.dailyLedgers || [],
      isDayReportModalOpen: false,
      currentScreen: 'main_game',
      activeDockTab: 'service',
      hasSavedGameAvailable: true,
    });

    soundManager.playSuccessFanfare();
    return true;
  },

  manualSaveGame: async () => {
    const state = get();
    const gameSave: GameSave = {
      version: 3,
      saveId: 'save_current',
      savedAt: new Date().toISOString(),
      player: state.player,
      shop: state.shop,
      calendar: state.calendar,
      inventory: state.inventory,
      inventoryLogs: state.inventoryLogs,
      menuItems: state.menuItems,
      quests: state.quests,
      achievements: state.achievements,
      recentDayReports: state.latestDayReport ? [state.latestDayReport] : [],
      dailyLedgers: state.dailyLedgers,
      regularCustomers: state.regularCustomers,
      stats: {
        totalRevenue: state.player.totalEarnings,
        totalExpenses: state.dayPurchaseExpenses + state.dayUpgradeExpenses,
        totalCustomersServed: state.player.totalOrdersServed,
        totalCustomersLost: state.dayOrdersLost,
        favoriteItemSold: state.dishSalesCountToday,
        daysWithoutDeficit: state.calendar.day,
      },
    };

    const res = await saveGameToStorage(gameSave);
    set({
      isSaveNotificationVisible: true,
      saveNotificationText: res.message,
      hasSavedGameAvailable: true,
    });

    setTimeout(() => {
      set({ isSaveNotificationVisible: false });
    }, 2800);

    return res.success;
  },

  deleteCurrentSave: async () => {
    const success = await deleteGameSave();
    if (success) {
      set({
        hasSavedGameAvailable: false,
        isSaveNotificationVisible: true,
        saveNotificationText: 'Đã xóa bản lưu trên thiết bị.',
      });
      setTimeout(() => {
        set({ isSaveNotificationVisible: false });
      }, 2500);
    }
    return success;
  },

  exportGameData: () => {
    const state = get();
    return {
      version: 2,
      saveId: `save_export_${Date.now()}`,
      savedAt: new Date().toISOString(),
      player: state.player,
      shop: state.shop,
      calendar: state.calendar,
      inventory: state.inventory,
      inventoryLogs: state.inventoryLogs,
      menuItems: state.menuItems,
      quests: state.quests,
      achievements: state.achievements,
      recentDayReports: state.latestDayReport ? [state.latestDayReport] : [],
      dailyLedgers: state.dailyLedgers,
      stats: {
        totalRevenue: state.player.totalEarnings,
        totalExpenses: 0,
        totalCustomersServed: state.player.totalOrdersServed,
        totalCustomersLost: 0,
        favoriteItemSold: state.dishSalesCountToday,
        daysWithoutDeficit: state.calendar.day,
      },
    };
  },

  importGameData: (jsonStr) => {
    const res = importSaveFromJsonString(jsonStr);
    if (!res.valid || !res.data) {
      soundManager.playWarningBuzz();
      return { success: false, error: res.error || 'Dữ liệu file không hợp lệ.' };
    }

    const saved = res.data;
    set({
      player: saved.player,
      shop: saved.shop,
      calendar: saved.calendar,
      inventory: saved.inventory,
      inventoryLogs: saved.inventoryLogs || [],
      menuItems: saved.menuItems,
      quests: saved.quests,
      achievements: saved.achievements,
      activeOrders: [],
      dailyLedgers: saved.dailyLedgers || [],
      currentScreen: 'main_game',
      hasSavedGameAvailable: true,
    });

    soundManager.playSuccessFanfare();
    get().manualSaveGame();
    return { success: true };
  },

  // ==================== VÒNG LẶP THỜI GIAN CHÍNH (GAME LOOP) ====================
  tickSeconds: (deltaSec) => {
    const state = get();
    if (
      state.isPaused ||
      state.currentScreen !== 'main_game' ||
      state.calendar.timePeriod === 'day_end' ||
      state.isDayReportModalOpen
    ) {
      return;
    }

    // 1. Bước nhảy đồng hồ Game Clock
    const { nextMinute, phase, isDayEnd } = advanceGameClock(
      state.calendar.inGameMinute,
      deltaSec,
      state.calendar.timeSpeed
    );

    // 2. Cập nhật tiến độ nấu và kiên nhẫn của các đơn
    const { updatedOrders, expiredOrders, readyOrderIds } = tickCookingOrders(
      state.activeOrders,
      deltaSec
    );

    // Xử lý đơn nấu xong
    if (readyOrderIds.length > 0) {
      soundManager.playCookComplete();
    }

    // Xử lý đơn hết hạn khách bỏ về
    let updatedLostCount = state.dayOrdersLost;
    let updatedReputation = state.shop.reputation;
    let updatedSatisfaction = state.shop.customerSatisfaction ?? 85;
    if (expiredOrders.length > 0) {
      soundManager.playWarningBuzz();
      updatedLostCount += expiredOrders.length;
      updatedReputation = Math.max(0, updatedReputation - expiredOrders.length * 2);
      updatedSatisfaction = Math.max(20, updatedSatisfaction - expiredOrders.length * 4);
    }

    // 3. Tỷ lệ sinh khách mới theo khung giờ kết hợp sự kiện theo mùa & lịch học
    let spawnChancePerSec = 0.25;
    if (phase === 'dismissal_rush') spawnChancePerSec = 0.55; // Tan trường đông nhất!
    else if (phase === 'recess_rush') spawnChancePerSec = 0.45; // Ra chơi
    else if (phase === 'before_school') spawnChancePerSec = 0.35; // Sáng sớm
    else if (phase === 'noon_break') spawnChancePerSec = 0.3;
    else if (phase === 'school_hours') spawnChancePerSec = 0.1; // Trong giờ học yên ắng

    // Hiệu ứng lịch học & sự kiện theo mùa
    const calEffects = calculateCalendarDayEffects(state.calendar.day);
    spawnChancePerSec *= calEffects.trafficMultiplier;

    // Hiệu ứng biển hiệu neon tăng lượng khách +35%
    if (state.shop.upgrades.includes('upgrade_neon_signboard')) {
      spawnChancePerSec *= 1.35;
    }

    const waitingCount = updatedOrders.filter((o) => o.status === 'waiting').length;
    if (Math.random() < spawnChancePerSec * deltaSec && waitingCount < 4) {
      const newOrder = generateNewOrder(
        state.shop.businessModelId,
        state.menuItems,
        state.shop,
        phase,
        updatedOrders,
        state.inventory,
        {
          regularCustomers: state.regularCustomers,
          activeEvent: state.activeSeasonalEvent,
          weather: state.calendar.weather,
          isSchoolDay: state.calendar.isSchoolDay,
        }
      );
      if (newOrder) {
        soundManager.playCustomerBell();
        updatedOrders.push(newOrder);
      }
    }

    // 4. Nếu hết giờ mở quán trong ngày -> Tự động kết thúc ngày
    if (isDayEnd) {
      set({
        calendar: {
          ...state.calendar,
          inGameMinute: nextMinute,
          timePeriod: 'day_end',
        },
        activeOrders: updatedOrders,
        dayOrdersLost: updatedLostCount,
        shop: {
          ...state.shop,
          reputation: updatedReputation,
          customerSatisfaction: updatedSatisfaction,
        },
      });
      get().endCurrentDay();
      return;
    }

    set({
      calendar: {
        ...state.calendar,
        inGameMinute: nextMinute,
        timePeriod: phase,
        isRushHour: phase === 'recess_rush' || phase === 'dismissal_rush',
      },
      activeOrders: updatedOrders,
      dayOrdersLost: updatedLostCount,
      shop: {
        ...state.shop,
        reputation: updatedReputation,
        customerSatisfaction: updatedSatisfaction,
      },
    });
  },

  // ==================== BẮT ĐẦU CHẾ BIẾN ĐƠN ====================
  startCooking: (orderId) => {
    const state = get();
    const order = state.activeOrders.find((o) => o.id === orderId);
    if (!order) {
      return { success: false, message: 'Đơn hàng không tồn tại.' };
    }

    const prepSpeedMultiplier = state.shop.upgrades.includes('upgrade_speed_cooker') ? 0.75 : 1.0;
    const result = startCookingOrder(
      order,
      state.menuItems,
      state.inventory,
      state.activeOrders,
      state.shop.cookingSlotsCount,
      prepSpeedMultiplier
    );

    if (!result.success || !result.updatedOrder || !result.updatedInventory) {
      soundManager.playWarningBuzz();
      return { success: false, message: result.reason || 'Không thể bắt đầu chế biến.' };
    }

    soundManager.playClick();

    // Cập nhật danh sách đơn hàng
    const updatedOrders = state.activeOrders.map((o) =>
      o.id === orderId ? result.updatedOrder! : o
    );

    // Ghi nhật ký tiêu thụ nguyên liệu
    const logEntry: InventoryLogEntry = {
      id: `inv_log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      day: state.calendar.day,
      type: 'consume',
      itemName: order.items.map((i) => i.menuItemId).join(', '),
      quantityChange: -order.items.reduce((s, i) => s + i.quantity, 0),
      costChange: result.consumedCost || 0,
      note: `Chế biến đơn #${order.id.slice(-4)}`,
    };

    set({
      activeOrders: updatedOrders,
      inventory: result.updatedInventory,
      inventoryLogs: [logEntry, ...state.inventoryLogs.slice(0, 49)],
      dayCogs: state.dayCogs + (result.consumedCost || 0),
    });

    return { success: true, message: 'Đã lên bếp và trừ nguyên liệu thành công!' };
  },

  // ==================== HOÀN THÀNH CHẾ BIẾN TƯƠNG TÁC ====================
  finishInteractiveCooking: (orderId) => {
    const state = get();
    const order = state.activeOrders.find((o) => o.id === orderId);
    if (!order) {
      return { success: false, message: 'Đơn hàng không tồn tại.' };
    }

    if (order.status !== 'waiting' && order.status !== 'preparing') {
      return { success: false, message: 'Đơn hàng không ở trạng thái cần chế biến.' };
    }

    let updatedInv = { ...state.inventory };
    let consumedCost = 0;

    // Nếu đơn chưa trừ kho (đang ở waiting), tiến hành kiểm tra và trừ kho atomic
    if (order.status === 'waiting') {
      const check = canStartCooking(
        order,
        state.menuItems,
        state.inventory,
        state.activeOrders,
        state.shop.cookingSlotsCount
      );
      if (!check.ok) {
        soundManager.playWarningBuzz();
        return { success: false, message: check.reason || 'Thiếu nguyên liệu trong kho.' };
      }

      order.items.forEach((item) => {
        const menuItem = state.menuItems.find((m) => m.id === item.menuItemId);
        if (!menuItem) return;
        consumedCost += menuItem.baseCost * item.quantity;
        menuItem.ingredients.forEach((req) => {
          const needed = req.amount * item.quantity;
          updatedInv[req.ingredientId] = Math.max(0, (updatedInv[req.ingredientId] || 0) - needed);
        });
      });
    }

    // Chuyển thẳng đơn sang 'ready_to_serve'
    const updatedOrder: ActiveOrder = {
      ...order,
      status: 'ready_to_serve',
      prepTimeRemainingSec: 0,
      baseCost: order.baseCost || consumedCost,
    };

    const updatedOrders = state.activeOrders.map((o) =>
      o.id === orderId ? updatedOrder : o
    );

    const logEntry: InventoryLogEntry = {
      id: `inv_log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      day: state.calendar.day,
      type: 'consume',
      itemName: order.items.map((i) => i.menuItemId).join(', '),
      quantityChange: -order.items.reduce((s, i) => s + i.quantity, 0),
      costChange: consumedCost,
      note: `Hoàn tất chế biến đơn #${order.id.slice(-4)}`,
    };

    set({
      activeOrders: updatedOrders,
      inventory: updatedInv,
      inventoryLogs: consumedCost > 0 ? [logEntry, ...state.inventoryLogs.slice(0, 49)] : state.inventoryLogs,
      dayCogs: state.dayCogs + consumedCost,
    });

    return { success: true, message: 'Chế biến hoàn tất! Đơn sẵn sàng giao khách!' };
  },

  // ==================== GIAO MÓN & NHẬN TIỀN ====================
  serveOrder: (orderId) => {
    const state = get();
    const order = state.activeOrders.find((o) => o.id === orderId);
    if (!order) {
      return { success: false, message: 'Đơn hàng không tồn tại.' };
    }

    const hasGlassDisplay = state.shop.upgrades.includes('upgrade_glass_display');
    const result = deliverReadyOrder(order, hasGlassDisplay);

    if (!result.success) {
      soundManager.playWarningBuzz();
      return { success: false, message: result.review.comment };
    }

    // Xử lý khách quen & tiến trình thân thiết
    let regularTipBonus = 0;
    const updatedCustomers = { ...state.regularCustomers };
    const templateKey =
      order.customer.templateId ||
      Object.keys(state.regularCustomers).find((k) => order.customer.id.startsWith(k));
    let maxFriendshipFound = 1;

    if (templateKey && updatedCustomers[templateKey]) {
      const regChar = updatedCustomers[templateKey];
      const isFavoriteMatch = regChar.favoriteItemIds.some((favId) =>
        order.items.some((it) => it.menuItemId === favId)
      );
      const isServedPromptly = order.timeRemainingSec >= order.totalTimeSec * 0.4;
      const regResult = recordRegularCustomerVisit(
        regChar,
        result.revenue,
        isFavoriteMatch,
        isServedPromptly,
        state.calendar.day
      );
      updatedCustomers[templateKey] = regResult.updatedCustomer;
      regularTipBonus = calculateRegularCustomerTipBonus(regResult.updatedCustomer);
      if (regResult.leveledUp) {
        soundManager.playSuccessFanfare();
      }
    }

    for (const c of Object.values(updatedCustomers)) {
      if (c.friendshipLevel > maxFriendshipFound) {
        maxFriendshipFound = c.friendshipLevel;
      }
    }

    const totalCashEarned = result.revenue + result.tip + regularTipBonus;
    const gainedExp = 25 * order.items.length;

    // Cập nhật cấp độ nếu đủ EXP
    let newExp = state.shop.exp + gainedExp;
    let newLevel = state.shop.level;
    let newExpNeeded = state.shop.expToNextLevel;

    if (newExp >= newExpNeeded) {
      newLevel += 1;
      newExp -= newExpNeeded;
      newExpNeeded = getExpNeededForLevel(newLevel);
      soundManager.playSuccessFanfare();
    } else {
      soundManager.playCoin();
    }

    // Mở khóa công thức mới nếu đủ cấp độ
    const updatedMenuItems = state.menuItems.map((item) => {
      if (!item.unlocked && item.requiredLevel <= newLevel) {
        return { ...item, unlocked: true };
      }
      return item;
    });

    // Cập nhật tiến độ nhiệm vụ đa dạng
    let currentQuests = state.quests;
    // 1. Phục vụ đơn chung
    const q1 = processQuestProgress(currentQuests, { type: 'serve_orders', amount: 1 });
    currentQuests = q1.updatedQuests;

    // 2. Phục vụ danh mục món
    const firstDish = state.menuItems.find((m) => m.id === order.items[0]?.menuItemId);
    if (firstDish) {
      const qCat = processQuestProgress(currentQuests, {
        type: 'serve_category',
        amount: 1,
        category: firstDish.category,
      });
      currentQuests = qCat.updatedQuests;
    }

    // 3. Phục vụ trong sự kiện
    if (state.activeSeasonalEvent) {
      const qEvt = processQuestProgress(currentQuests, {
        type: 'event_orders',
        amount: 1,
        isEventActive: true,
      });
      currentQuests = qEvt.updatedQuests;
    }

    // 4. Mốc thân thiết
    const qFriend = processQuestProgress(currentQuests, {
      type: 'friendship_level',
      amount: maxFriendshipFound,
    });
    currentQuests = qFriend.updatedQuests;

    // Thống kê món bán chạy hôm nay
    const updatedDishSales = { ...state.dishSalesCountToday };
    order.items.forEach((it) => {
      updatedDishSales[it.menuItemId] = (updatedDishSales[it.menuItemId] || 0) + it.quantity;
    });

    // Mở khóa thành tựu nếu đạt điều kiện
    const { updatedAchievements } = checkAchievementsUnlock(
      state.achievements,
      {
        totalRevenue: state.player.totalEarnings + totalCashEarned,
        totalExpenses: state.dayPurchaseExpenses + state.dayUpgradeExpenses,
        totalCustomersServed: state.player.totalOrdersServed + 1,
        totalCustomersLost: state.dayOrdersLost,
        favoriteItemSold: updatedDishSales,
        daysWithoutDeficit: state.calendar.day,
      },
      state.shop,
      maxFriendshipFound,
      state.calendar.day
    );

    // Xóa đơn đã hoàn thành khỏi danh sách chờ
    const remainingOrders = state.activeOrders.filter((o) => o.id !== orderId);
    const updatedSatisfaction = Math.min(100, (state.shop.customerSatisfaction ?? 85) + 2);

    set({
      activeOrders: remainingOrders,
      dayRevenue: state.dayRevenue + result.revenue,
      dayTips: state.dayTips + result.tip + regularTipBonus,
      dayOrdersServed: state.dayOrdersServed + 1,
      dishSalesCountToday: updatedDishSales,
      menuItems: updatedMenuItems,
      quests: currentQuests,
      achievements: updatedAchievements,
      regularCustomers: updatedCustomers,
      shop: {
        ...state.shop,
        cash: state.shop.cash + totalCashEarned,
        exp: newExp,
        level: newLevel,
        expToNextLevel: newExpNeeded,
        reputation: Math.min(100, state.shop.reputation + result.reputationDelta),
        customerSatisfaction: updatedSatisfaction,
      },
      player: {
        ...state.player,
        totalEarnings: state.player.totalEarnings + totalCashEarned,
        totalOrdersServed: state.player.totalOrdersServed + 1,
      },
    });

    const tipSum = result.tip + regularTipBonus;
    const tipMsg = tipSum > 0 ? ` (Tip: +${tipSum.toLocaleString()}đ)` : '';
    return {
      success: true,
      message: `Đã giao xong! Thu về +${totalCashEarned.toLocaleString()}đ${tipMsg}`,
    };
  },

  // ==================== NHẬP HÀNG & QUẢN LÝ KHO ====================
  buyIngredient: (ingredientId, packagesCount) => {
    const state = get();
    const result = executePurchaseStock(
      ingredientId,
      packagesCount,
      state.shop.cash,
      state.inventory,
      state.shop.maxInventoryCapacity,
      state.calendar.day
    );

    if (!result.success) {
      soundManager.playWarningBuzz();
      return { success: false, message: result.reason || 'Không thể nhập hàng.' };
    }

    soundManager.playCoin();

    const newLogs = result.logEntry
      ? [result.logEntry, ...state.inventoryLogs.slice(0, 49)]
      : state.inventoryLogs;

    const ing = INGREDIENT_DATABASE[ingredientId];
    const totalCost = ing ? ing.costPerUnit * packagesCount : 0;

    const { updatedQuests } = processQuestProgress(state.quests, {
      type: 'buy_stock',
      amount: packagesCount,
    });

    set({
      shop: { ...state.shop, cash: result.updatedCash },
      inventory: result.updatedInventory,
      inventoryLogs: newLogs,
      quests: updatedQuests,
      dayPurchaseExpenses: state.dayPurchaseExpenses + totalCost,
    });

    get().manualSaveGame();
    return { success: true, message: 'Nhập hàng thành công vào kho!' };
  },

  // ==================== NHẬP HÀNG THEO GIỎ (BATCH PURCHASE) ====================
  buyIngredientsBatch: (items) => {
    const state = get();
    if (!items || items.length === 0) {
      return { success: false, message: 'Giỏ hàng của bạn đang trống.' };
    }

    let totalCost = 0;
    let totalAddedCapacity = 0;
    const newInventory = { ...state.inventory };
    const logs: InventoryLogEntry[] = [];

    for (const item of items) {
      const ing = INGREDIENT_DATABASE[item.ingredientId];
      if (!ing || item.quantity <= 0) continue;
      const cost = ing.costPerUnit * item.quantity;
      const addedUnits = ing.packageSize * item.quantity;

      totalCost += cost;
      totalAddedCapacity += addedUnits;
      newInventory[item.ingredientId] = (newInventory[item.ingredientId] || 0) + addedUnits;

      logs.push({
        id: `inv_buy_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toISOString(),
        day: state.calendar.day,
        type: 'purchase',
        itemName: ing.name,
        quantityChange: addedUnits,
        costChange: cost,
        note: `Nhập ${item.quantity} gói (${ing.packageSize} ${ing.unit}/gói)`,
      });
    }

    if (state.shop.cash < totalCost) {
      soundManager.playWarningBuzz();
      const shortage = totalCost - state.shop.cash;
      return {
        success: false,
        message: `Bạn chưa đủ tiền! Còn thiếu ${shortage.toLocaleString()}đ để hoàn tất đơn hàng.`,
      };
    }

    const currentUsed = calculateUsedCapacity(state.inventory);
    if (currentUsed + totalAddedCapacity > state.shop.maxInventoryCapacity) {
      soundManager.playWarningBuzz();
      return {
        success: false,
        message: 'Kho hàng không đủ chỗ chứa! Hãy nâng cấp thêm sức chứa kho.',
      };
    }

    soundManager.playCoin();

    const { updatedQuests } = processQuestProgress(state.quests, {
      type: 'buy_stock',
      amount: items.reduce((s, it) => s + it.quantity, 0),
    });

    set({
      shop: { ...state.shop, cash: state.shop.cash - totalCost },
      inventory: newInventory,
      inventoryLogs: [...logs, ...state.inventoryLogs].slice(0, 50),
      quests: updatedQuests,
      dayPurchaseExpenses: state.dayPurchaseExpenses + totalCost,
    });

    get().manualSaveGame();
    return { success: true, message: `Đã nhập ${items.length} mặt hàng thành công vào kho!` };
  },

  // ==================== TÙY CHỈNH THỰC ĐƠN & GIÁ BÁN ====================
  toggleMenuItemEnabled: (itemId) => {
    soundManager.playClick();
    set((state) => ({
      menuItems: state.menuItems.map((item) =>
        item.id === itemId ? { ...item, isEnabled: !item.isEnabled } : item
      ),
    }));
  },

  updateMenuItemPrice: (itemId, newPrice) => {
    set((state) => ({
      menuItems: state.menuItems.map((item) => {
        if (item.id === itemId) {
          // Giới hạn trong khoảng 70% đến 140% giá cơ sở
          const minP = Math.round(item.basePrice * 0.7);
          const maxP = Math.round(item.basePrice * 1.4);
          const clamped = Math.max(minP, Math.min(maxP, newPrice));
          return { ...item, customPrice: clamped };
        }
        return item;
      }),
    }));
  },

  // ==================== NÂNG CẤP QUẦY HÀNG ====================
  buyUpgrade: (upgradeId) => {
    const state = get();
    const upgrade = SHOP_UPGRADES.find((u) => u.id === upgradeId);
    if (!upgrade) return { success: false, message: 'Nâng cấp không tồn tại.' };

    if (state.shop.upgrades.includes(upgradeId)) {
      return { success: false, message: 'Đã sở hữu nâng cấp này rồi.' };
    }
    if (state.shop.cash < upgrade.cost) {
      soundManager.playWarningBuzz();
      return { success: false, message: 'Không đủ tiền mặt để nâng cấp.' };
    }
    if (state.shop.level < upgrade.requiredLevel) {
      soundManager.playWarningBuzz();
      return { success: false, message: `Yêu cầu tiệm đạt Cấp ${upgrade.requiredLevel}.` };
    }

    soundManager.playSuccessFanfare();

    // Áp dụng hiệu quả nâng cấp vào trạng thái
    let newCookingSlots = state.shop.cookingSlotsCount;
    let newStorageCapacity = state.shop.maxInventoryCapacity;

    if (upgrade.effectType === 'cooking_slot') {
      newCookingSlots = Math.max(newCookingSlots, upgrade.effectValue);
    } else if (upgrade.effectType === 'storage_capacity') {
      newStorageCapacity = Math.max(newStorageCapacity, upgrade.effectValue);
    }

    const { updatedQuests } = processQuestProgress(state.quests, {
      type: 'upgrade_shop',
      amount: 1,
    });

    set({
      shop: {
        ...state.shop,
        cash: state.shop.cash - upgrade.cost,
        upgrades: [...state.shop.upgrades, upgradeId],
        cookingSlotsCount: newCookingSlots,
        maxInventoryCapacity: newStorageCapacity,
      },
      quests: updatedQuests,
      dayUpgradeExpenses: state.dayUpgradeExpenses + upgrade.cost,
    });

    get().manualSaveGame();
    return { success: true, message: `Đã mua thành công: ${upgrade.name}!` };
  },

  // ==================== NHẬN THƯỞNG NHIỆM VỤ ====================
  claimQuestReward: (questId) => {
    const state = get();
    const res = claimQuestRewardEngine(state.quests, questId);
    if (!res.success) return;

    soundManager.playSuccessFanfare();

    set({
      quests: res.updatedQuests,
      shop: {
        ...state.shop,
        cash: state.shop.cash + res.rewardCash,
        reputation: Math.min(100, state.shop.reputation + res.rewardReputation),
      },
    });

    get().manualSaveGame();
  },

  // ==================== TUA SANG MỐC TIẾP ====================
  advanceToNextPeriod: () => {
    const state = get();
    const curMinute = state.calendar.inGameMinute;

    // Các mốc chuyển: 07:15 (435), 09:15 (555), 11:30 (690), 16:30 (990), 17:45 (1065), 18:45 (1125)
    const checkpoints = [435, 555, 690, 990, 1065, 1125];
    const nextCheck = checkpoints.find((m) => m > curMinute);

    if (nextCheck !== undefined) {
      soundManager.playClick();
      get().tickSeconds(nextCheck - curMinute);
    } else {
      get().endCurrentDay();
    }
  },

  // ==================== KẾT THÚC NGÀY (END DAY) ====================
  endCurrentDay: () => {
    const state = get();
    // Đảm bảo không kết thúc lặp 2 lần cùng 1 ngày
    if (state.isDayReportModalOpen) return;

    // Tìm món bán chạy nhất hôm nay
    let topDishName = 'Chưa có';
    let maxSold = 0;
    for (const [dishId, count] of Object.entries(state.dishSalesCountToday)) {
      if (count > maxSold) {
        maxSold = count;
        const found = state.menuItems.find((m) => m.id === dishId);
        if (found) topDishName = `${found.name} (${count} phần)`;
      }
    }

    // 1. Lập sổ thu chi tài chính
    const ledger = calculateFinancialLedger(
      state.calendar.day,
      state.dayRevenue,
      state.dayTips,
      state.dayCogs,
      state.dayPurchaseExpenses,
      state.dayUpgradeExpenses,
      state.shop.dailyOperatingCost,
      state.shop.cash,
      state.inventory
    );

    // 2. Tạo báo cáo ngày
    const report = generateDayReport(
      state.calendar.day,
      state.dayRevenue,
      state.dayTips,
      state.dayCogs,
      state.shop.dailyOperatingCost,
      state.dayOrdersServed,
      state.dayOrdersLost,
      topDishName
    );

    soundManager.playSuccessFanfare();

    // Trừ chi phí vận hành ngày vào tiền mặt
    const finalCash = Math.max(0, state.shop.cash - state.shop.dailyOperatingCost);

    // Cập nhật nhiệm vụ ngày có lợi nhuận dương
    const isPositive = state.dayRevenue + state.dayTips > state.dayCogs + state.shop.dailyOperatingCost;
    const { updatedQuests } = processQuestProgress(state.quests, {
      type: 'positive_profit_day',
      isPositiveProfit: isPositive,
    });

    set({
      latestDayReport: report,
      dailyLedgers: [ledger, ...state.dailyLedgers.slice(0, 14)],
      isDayReportModalOpen: true,
      quests: updatedQuests,
      calendar: {
        ...state.calendar,
        inGameMinute: 1125,
        timePeriod: 'day_end',
      },
      shop: {
        ...state.shop,
        cash: finalCash,
        reputation: Math.max(0, Math.min(100, state.shop.reputation + report.reputationDelta)),
      },
    });

    get().manualSaveGame();
  },

  // ==================== SANG NGÀY TIẾP THEO ====================
  startNextDay: () => {
    const state = get();
    const nextDay = state.calendar.day + 1;
    const nextCalendar = buildGameCalendarForDay(nextDay);
    const nextEvent = getActiveSeasonalEvent(nextDay);

    let refreshedQuests = refreshDailyQuests(state.quests);
    if (nextCalendar.dayOfWeek === 2) {
      refreshedQuests = refreshWeeklyQuests(refreshedQuests);
    }

    soundManager.playCustomerBell();

    set({
      calendar: nextCalendar,
      activeSeasonalEvent: nextEvent,
      quests: refreshedQuests,
      dayRevenue: 0,
      dayTips: 0,
      dayCogs: 0,
      dayPurchaseExpenses: 0,
      dayUpgradeExpenses: 0,
      dayOrdersServed: 0,
      dayOrdersLost: 0,
      dishSalesCountToday: {},
      activeOrders: [],
      latestDayReport: null,
      isDayReportModalOpen: false,
    });

    get().manualSaveGame();
  },
}));
