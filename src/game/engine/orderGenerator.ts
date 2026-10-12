import {
  ActiveOrder,
  BusinessModelId,
  Customer,
  CustomerRegular,
  Inventory,
  MenuItem,
  SeasonalEvent,
  ShopState,
  TimePeriod,
  WeatherType,
} from '@/game/types';
import { CUSTOMER_ROSTER } from '@/game/data/customers';
import { getContextualDialogue } from './dialogueSystem';

/**
 * Kiểm tra xem kho có đủ nguyên liệu để làm một món ăn cụ thể không
 */
export function canMakeMenuItem(item: MenuItem, inventory: Inventory): boolean {
  for (const req of item.ingredients) {
    if ((inventory[req.ingredientId] || 0) < req.amount) {
      return false;
    }
  }
  return true;
}

export interface OrderGeneratorContext {
  regularCustomers?: Record<string, CustomerRegular>;
  activeEvent?: SeasonalEvent | null;
  weather?: WeatherType;
  isSchoolDay?: boolean;
}

/**
 * Sinh một đơn hàng mới tuân thủ:
 * - Chỉ gọi món đã mở khóa và đang bật bán (isEnabled)
 * - Khách hàng ưu tiên gọi món mà tiệm ĐANG CÒN NGUYÊN LIỆU chế biến
 * - Phù hợp theo khung giờ (sáng thích ăn no, chiều thích ăn vặt, ra chơi thích trà sữa)
 * - Tác động của sự kiện học đường & thời tiết
 * - Khách quen có xu hướng gọi món khoái khẩu và có mức kiên nhẫn cao hơn khi thân thiết
 */
export function generateNewOrder(
  _modelId: BusinessModelId,
  menuItems: MenuItem[],
  shop: ShopState,
  timePeriod: TimePeriod,
  existingOrders: ActiveOrder[],
  inventory?: Inventory,
  context?: OrderGeneratorContext
): ActiveOrder | null {
  // Giới hạn số lượng khách hàng chờ tối đa theo cấp độ tiệm
  const maxQueue = Math.min(6, 2 + shop.level);
  const waitingOrdersCount = existingOrders.filter((o) => o.status === 'waiting').length;
  if (waitingOrdersCount >= maxQueue) {
    return null;
  }

  // 1. Lọc các món đã mở khóa VÀ đang được bật bán
  const activeItems = menuItems.filter((item) => item.unlocked && item.isEnabled !== false);
  if (activeItems.length === 0) return null;

  // 2. Ưu tiên chọn món còn nguyên liệu trong kho nếu có truyền inventory
  let candidateItems = activeItems;
  if (inventory) {
    const inStockItems = activeItems.filter((item) => canMakeMenuItem(item, inventory));
    if (inStockItems.length > 0) {
      candidateItems = inStockItems;
    }
  }

  // 3. Chọn khách hàng (có liên kết với hệ thống khách quen)
  const customerTemplate = CUSTOMER_ROSTER[Math.floor(Math.random() * CUSTOMER_ROSTER.length)];
  const regularData = context?.regularCustomers?.[customerTemplate.id];

  const friendshipLevel = regularData?.friendshipLevel || customerTemplate.friendshipLevel || 1;
  const eventMood = context?.activeEvent?.effects.dialogueMood;

  // Lời thoại ngữ cảnh thông minh
  const introLine = getContextualDialogue(
    customerTemplate,
    'intro',
    context?.weather,
    eventMood
  );

  const customer: Customer = {
    ...customerTemplate,
    templateId: customerTemplate.id,
    friendshipLevel,
    dialogueIntro: introLine,
    id: `${customerTemplate.id}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
  };

  // 4. Lọc món theo khung giờ & sự kiện theo mùa
  let preferredCategory: 'Đồ uống' | 'Ăn vặt' | 'Món no' | 'all' = 'all';
  if (timePeriod === 'before_school' || timePeriod === 'morning_prep' || timePeriod === 'school_rush') {
    preferredCategory = 'Món no';
  } else if (timePeriod === 'recess_rush') {
    preferredCategory = 'Đồ uống';
  } else if (timePeriod === 'dismissal_rush' || timePeriod === 'afternoon_bell') {
    preferredCategory = 'Ăn vặt';
  }

  // Ưu tiên danh mục được buff bởi sự kiện theo mùa nếu có
  if (context?.activeEvent?.effects.boostCategories && context.activeEvent.effects.boostCategories.length > 0) {
    const boosted = context.activeEvent.effects.boostCategories[0];
    if (Math.random() < 0.5) {
      preferredCategory = boosted;
    }
  }

  let pool = candidateItems;
  const categoryMatches = candidateItems.filter((i) => i.category === preferredCategory);
  if (categoryMatches.length > 0 && Math.random() < 0.65) {
    pool = categoryMatches;
  }

  // 5. Khách quen có 45% xác suất gọi món khoái khẩu của họ
  const favoriteMatches = candidateItems.filter((i) =>
    customerTemplate.favoriteItemIds.includes(i.id)
  );

  const chosenItems: { menuItemId: string; quantity: number; unitPrice: number }[] = [];
  const numberOfItems = Math.random() < 0.35 ? 2 : 1;

  for (let i = 0; i < numberOfItems; i++) {
    let selectedItem: MenuItem;

    if (favoriteMatches.length > 0 && Math.random() < 0.45) {
      selectedItem = favoriteMatches[Math.floor(Math.random() * favoriteMatches.length)];
    } else {
      selectedItem = pool[Math.floor(Math.random() * pool.length)];
    }

    // Tác động của giá bán tùy chỉnh (elasticity)
    const priceRatio = (selectedItem.customPrice || selectedItem.basePrice) / selectedItem.basePrice;
    if (priceRatio > 1.15 && Math.random() < 0.3) {
      continue;
    }

    const qty = Math.random() < 0.2 ? 2 : 1;
    const finalUnitPrice = selectedItem.customPrice || selectedItem.basePrice;

    const existingIndex = chosenItems.findIndex((ci) => ci.menuItemId === selectedItem.id);
    if (existingIndex >= 0) {
      chosenItems[existingIndex].quantity += 1;
    } else {
      chosenItems.push({
        menuItemId: selectedItem.id,
        quantity: qty,
        unitPrice: finalUnitPrice,
      });
    }
  }

  if (chosenItems.length === 0) {
    const fallback = pool[0];
    chosenItems.push({
      menuItemId: fallback.id,
      quantity: 1,
      unitPrice: fallback.customPrice || fallback.basePrice,
    });
  }

  // 6. Tính tổng tiền & giá vốn
  let totalPrice = 0;
  let totalBaseCost = 0;
  chosenItems.forEach((ci) => {
    const item = menuItems.find((m) => m.id === ci.menuItemId);
    totalPrice += ci.unitPrice * ci.quantity;
    if (item) {
      totalBaseCost += item.baseCost * ci.quantity;
    }
  });

  // 7. Tính thời gian kiên nhẫn
  let patienceBonus = 0;
  if (shop.upgrades.includes('upgrade_plastic_stools')) patienceBonus += 8;
  if (shop.upgrades.includes('upgrade_umbrella_awning')) patienceBonus += 5;

  // Thân thiết cao giúp khách kiên nhẫn chờ hơn
  if (friendshipLevel >= 3) patienceBonus += 4;
  if (friendshipLevel >= 5) patienceBonus += 6;

  // Mức hài lòng cao gần đây tạo ấn tượng tốt
  if ((shop.customerSatisfaction ?? 85) >= 85) patienceBonus += 3;

  const isRushHour =
    timePeriod === 'recess_rush' || timePeriod === 'dismissal_rush' || timePeriod === 'before_school';
  let rushFactor = isRushHour ? 0.9 : 1.0;

  // Hiệu ứng sự kiện theo mùa lên thời gian chờ
  if (context?.activeEvent?.effects.patienceMultiplier) {
    rushFactor *= context.activeEvent.effects.patienceMultiplier;
  }

  const totalTimeSec = Math.max(
    15,
    Math.round((customer.patienceSeconds + patienceBonus) * rushFactor)
  );

  const newOrder: ActiveOrder = {
    id: `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    customer,
    items: chosenItems,
    totalPrice,
    baseCost: totalBaseCost,
    timeRemainingSec: totalTimeSec,
    totalTimeSec,
    prepTimeRemainingSec: 0,
    prepTimeTotalSec: 0,
    status: 'waiting',
    orderedAtTimestamp: Date.now(),
  };

  return newOrder;
}

/**
 * Kiểm tra xem kho có đủ nguyên liệu để làm đơn hàng không
 */
export function checkIngredientsAvailable(
  order: ActiveOrder,
  menuItems: MenuItem[],
  inventory: Inventory
): { canMake: boolean; missingIngredientNames: string[] } {
  const missingNames: string[] = [];
  const requiredTotals: Record<string, number> = {};

  order.items.forEach((item) => {
    const menuItem = menuItems.find((m) => m.id === item.menuItemId);
    if (!menuItem) return;

    menuItem.ingredients.forEach((req) => {
      requiredTotals[req.ingredientId] =
        (requiredTotals[req.ingredientId] || 0) + req.amount * item.quantity;
    });
  });

  for (const [ingredientId, requiredAmount] of Object.entries(requiredTotals)) {
    const currentStock = inventory[ingredientId] || 0;
    if (currentStock < requiredAmount) {
      missingNames.push(ingredientId);
    }
  }

  return {
    canMake: missingNames.length === 0,
    missingIngredientNames: missingNames,
  };
}
