/**
 * ĐỊNH NGHĨA HỆ THỐNG KIỂU DỮ LIỆU CỦA GAME (TypeScript Models)
 */

export type ScreenId =
  | 'splash'
  | 'main_menu'
  | 'intro_story'
  | 'business_selection'
  | 'shop_naming'
  | 'confirmation'
  | 'main_game';

export type BusinessModelId = 'boba_tea' | 'street_snack' | 'breakfast_stall';

export type TimePeriod =
  | 'before_school'   // Sáng sớm trước giờ học (06:00 - 07:15)
  | 'school_hours'    // Trong giờ học yên ắng (07:15 - 09:15) - lúc sơ chế, nhập hàng
  | 'recess_rush'     // Giờ ra chơi rộn rã (09:15 - 09:45) - bùng nổ đơn đồ uống, ăn vặt
  | 'noon_break'      // Giờ tan học trưa (11:30 - 12:30) - món no, cơm xào, mì trộn
  | 'dismissal_rush'  // Giờ tan trường chiều (16:30 - 17:45) - cao điểm nhất ngày!
  | 'evening_chill'   // Xế chiều vỉa hè (17:45 - 18:45) - khách lai rai
  | 'day_end'         // Đóng cửa dọn dẹp & Tổng kết sổ thu chi
  // Aliases tương thích bản cũ
  | 'morning_prep'
  | 'school_rush'
  | 'afternoon_bell';

export type WeatherType = 'sunny' | 'rainy' | 'cool_breeze' | 'exam_season';

export type OrderStatus =
  | 'waiting'        // Khách đang đợi nhận đơn / xếp hàng
  | 'preparing'      // Đang trên bếp / trạm pha chế
  | 'ready_to_serve' // Đã nấu xong, chờ người chơi bấm giao
  | 'completed'      // Đã hoàn tất và nhận tiền
  | 'expired';       // Hết kiên nhẫn, khách bỏ về

export interface PlayerProfile {
  name: string;
  avatar: string;
  title: string;
  daysPlayed: number;
  totalEarnings: number;
  totalOrdersServed: number;
}

export interface BusinessModel {
  id: BusinessModelId;
  name: string;
  tagline: string;
  description: string;
  startingCash: number;
  difficulty: 'Dễ' | 'Trung bình' | 'Thử thách';
  themeColor: string;
  badgeText: string;
  perks: string[];
  drawbacks: string[];
  unlockedMenuIds: string[];
  recommendedPlaystyle: string;
  iconName: string;
}

export interface IngredientItem {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  costPerUnit: number;
  packageSize: number;
  shelfLifeDays: number;
  category: 'beverage' | 'snack' | 'staple' | 'spice_sauce';
  description: string;
  minWarningThreshold: number;
}

export interface Inventory {
  [ingredientId: string]: number; // id -> số lượng hiện có
}

export interface InventoryLogEntry {
  id: string;
  timestamp: string;
  day: number;
  type: 'purchase' | 'consume' | 'spoilage';
  itemName: string;
  quantityChange: number;
  costChange: number;
  note: string;
}

export interface RecipeRequirement {
  ingredientId: string;
  amount: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'Đồ uống' | 'Ăn vặt' | 'Món no';
  businessModel: BusinessModelId | 'all';
  description: string;
  basePrice: number;
  customPrice: number; // Giá người chơi tùy chỉnh (0.8x -> 1.3x)
  baseCost: number;
  preparationTimeSec: number;
  unlocked: boolean;
  isEnabled: boolean; // Người chơi có thể bật/tắt bán món này trên menu
  requiredLevel: number;
  requiredEquipment?: string;
  ingredients: RecipeRequirement[];
  popularity: number; // 1 - 5 sao
  icon: string;
  tags: string[];
}

export type CustomerType =
  | 'grade_6'       // Học sinh lớp 6 mới vào trường
  | 'grade_9'       // Học sinh cấp 2 chuẩn bị thi
  | 'highschool'    // Học sinh cấp 3 sành điệu
  | 'teacher'       // Thầy cô giáo trường
  | 'parent'        // Phụ huynh đón con
  | 'neighbor'      // Bác hàng xóm tốt bụng
  | 'athlete'       // Học sinh thể thao năng động
  | 'artist'        // Học sinh chuyên văn / nghệ thuật
  | 'shipper'       // Tài xế giao hàng ghé ăn vội
  | 'geek';         // Học sinh mê công nghệ / đọc sách

export interface FriendshipStoryMilestone {
  level: number;
  title: string;
  story: string;
  perkDescription: string;
}

export interface CustomerRegular {
  id: string;
  name: string;
  type: CustomerType;
  typeLabel: string;
  avatar: string;
  description: string;
  personality: string;
  favoriteItemIds: string[];
  preferredTimeSlots: TimePeriod[];
  spendingTier: 'budget' | 'standard' | 'wealthy' | 'treat_all';
  spendingPower: number;
  patienceSeconds: number;
  friendshipLevel: number; // 1 - 5 trái tim
  friendshipExp: number; // 0 - 100
  totalOrdersServed: number;
  totalSpent: number;
  lastVisitDay?: number;
  dialogueIntro: string;
  dialogueHappy: string;
  dialogueAngry: string;
  dialogueRainy?: string;
  dialogueEvent?: string;
  friendshipStories: FriendshipStoryMilestone[];
  unlockedPerk?: string;
}

export interface Customer {
  id: string;
  templateId?: string; // Khóa tham chiếu khách quen (ví dụ: student_an_grade6)
  name: string;
  type: CustomerType;
  typeLabel: string;
  avatar: string;
  patienceSeconds: number;
  dialogueIntro: string;
  dialogueHappy: string;
  dialogueAngry: string;
  dialogueRainy?: string;
  dialogueEvent?: string;
  favoriteItemIds: string[];
  spendingPower: number; // Hệ số chi tiêu
  friendshipLevel?: number;
}

export interface OrderItem {
  menuItemId: string;
  quantity: number;
  unitPrice: number; // Giá bán tại thời điểm đặt đơn
  note?: string;
}

export interface CookingSlot {
  slotIndex: number;
  orderId: string | null;
  dishName: string;
  timeRemainingSec: number;
  timeTotalSec: number;
  isReady: boolean;
}

export interface OrderReview {
  stars: number; // 1 - 5 sao
  tip: number;
  comment: string;
}

export interface ActiveOrder {
  id: string;
  customer: Customer;
  items: OrderItem[];
  totalPrice: number;
  baseCost: number; // Tổng giá vốn nguyên liệu của đơn
  timeRemainingSec: number; // Thời gian kiên nhẫn còn lại
  totalTimeSec: number;
  prepTimeRemainingSec: number; // Thời gian chế biến còn lại
  prepTimeTotalSec: number;
  status: OrderStatus;
  assignedSlotIndex?: number;
  orderedAtTimestamp: number;
  review?: OrderReview;
}

export interface ShopState {
  name: string;
  businessModelId: BusinessModelId;
  level: number;
  exp: number;
  expToNextLevel: number;
  reputation: number; // 0 -> 100 sao uy tín
  customerSatisfaction: number; // 0 -> 100% mức độ hài lòng gần đây
  cash: number;
  cleanliness: number; // 0 - 100
  upgrades: string[]; // danh sách upgradeId đã mua
  maxInventoryCapacity: number; // Sức chứa kho tối đa
  cookingSlotsCount: number; // Số trạm nấu đồng thời (1, 2, 3)
  dailyOperatingCost: number; // Phí mặt bằng & điện nước mỗi ngày
}

export interface SeasonalEvent {
  id: string;
  name: string;
  badge: string;
  description: string;
  icon: string;
  startDay: number;
  endDay: number;
  repeatIntervalDays?: number;
  effects: {
    trafficMultiplier: number; // Hệ số lượng khách (1.35x = tăng 35%)
    tipMultiplier: number;     // Hệ số tiền tip (1.2x = tăng 20%)
    patienceMultiplier: number; // Hệ số thời gian chờ
    boostCategories?: ('Đồ uống' | 'Ăn vặt' | 'Món no')[];
    boostMultiplier?: number;
    weather?: WeatherType;
    dialogueMood?: string;
  };
  associatedQuestId?: string;
}

export interface GameCalendar {
  day: number;
  dayOfWeek: number; // 2 (Thứ 2) -> 8 (Chủ nhật)
  schoolWeek: number; // Tuần học: Tuần 1, Tuần 2, Tuần 3...
  isSchoolDay: boolean; // true: ngày học sinh đi học, false: cuối tuần nghỉ
  timePeriod: TimePeriod;
  weather: WeatherType;
  inGameMinute: number; // Phút trong ngày: 360 (06:00) -> 1140 (19:00)
  timeSpeed: 1 | 2; // Tốc độ game clock
  specialEvent?: string;
  activeEventId?: string | null;
  isRushHour: boolean;
}

export type QuestCategory = 'tutorial' | 'daily' | 'weekly' | 'business' | 'regular' | 'event';

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: QuestCategory;
  targetType:
    | 'serve_orders'
    | 'earn_cash'
    | 'upgrade_shop'
    | 'unlock_recipe'
    | 'reputation'
    | 'friendship_level'
    | 'positive_profit_day'
    | 'serve_category'
    | 'buy_stock'
    | 'event_orders';
  targetValue: number;
  currentProgress: number;
  rewardCash: number;
  rewardReputation: number;
  rewardExp: number;
  rewardRecipeId?: string;
  completed: boolean;
  claimed: boolean;
  isDaily: boolean;
  isWeekly?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
}

export interface ShopUpgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: 'equipment' | 'decor' | 'marketing' | 'service' | 'storage';
  perkDescription: string;
  requiredLevel: number;
  icon: string;
  effectType:
    | 'cooking_slot'
    | 'prep_speed'
    | 'storage_capacity'
    | 'patience_boost'
    | 'customer_traffic'
    | 'reputation_boost';
  effectValue: number;
}

export interface FinancialLedger {
  day: number;
  salesRevenue: number;
  tipsRevenue: number;
  cogs: number; // Giá vốn hàng bán (nguyên liệu đã tiêu thụ vào món)
  inventoryPurchaseExpense: number; // Chi tiền nhập kho
  upgradeExpense: number; // Chi tiền nâng cấp quầy
  dailyOperationalCost: number; // Phí vỉa hè, điện nước
  netProfit: number; // Lợi nhuận ròng = Doanh thu + tips - COGS - Phí vận hành
  endingCash: number;
  inventoryValuation: number; // Giá trị hàng tồn kho cuối ngày
}

export interface DayReport {
  day: number;
  revenue: number;
  tipsEarned: number;
  ingredientCost: number; // COGS
  operatingCost: number;
  profit: number; // Lợi nhuận ròng
  ordersCompleted: number;
  ordersFailed: number;
  reputationDelta: number;
  ratingScore: number; // 1 - 5 sao
  topSellingDish?: string;
  adviceText?: string;
}

export interface GameSettings {
  soundEnabled: boolean;
  sfxVolume: number;
  bgmVolume: number;
  reducedMotion: boolean;
  autoSave: boolean;
  highContrast: boolean;
}

export interface GameStats {
  totalRevenue: number;
  totalExpenses: number;
  totalCustomersServed: number;
  totalCustomersLost: number;
  favoriteItemSold: Record<string, number>;
  daysWithoutDeficit: number;
}

export interface GameSave {
  version: number;
  saveId: string;
  savedAt: string;
  player: PlayerProfile;
  shop: ShopState;
  calendar: GameCalendar;
  inventory: Inventory;
  inventoryLogs?: InventoryLogEntry[];
  menuItems: MenuItem[];
  quests: Quest[];
  achievements: Achievement[];
  recentDayReports: DayReport[];
  dailyLedgers?: FinancialLedger[];
  regularCustomers?: Record<string, CustomerRegular>;
  stats: GameStats;
}
