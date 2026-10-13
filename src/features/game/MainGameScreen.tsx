import React, { useEffect, useState, useCallback } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { TopStatusBar } from '@/components/layout/TopStatusBar';
import { BottomDock } from '@/components/layout/BottomDock';
import { SchoolGateScene } from '@/components/game/SchoolGateScene';
import { CustomerQueue } from '@/components/game/CustomerQueue';
import { DayReportModal } from '@/components/game/DayReportModal';
import { InteractiveCookingModal } from '@/components/game/InteractiveCookingModal';
import { RestockShopModal } from '@/components/game/RestockShopModal';
import { CustomerReviewsModal } from '@/components/game/CustomerReviewsModal';
import { PlayerFeedbackModal } from '@/components/game/PlayerFeedbackModal';
import { Toast } from '@/components/common/Toast';
import { SettingsModal } from '@/features/settings/SettingsModal';
import { FloatingFeedback, FloatingItem } from '@/components/common/FloatingFeedback';
import { MenuPanel } from './MenuPanel';
import { InventoryPanel } from './InventoryPanel';
import { UpgradePanel } from './UpgradePanel';
import { QuestPanel } from './QuestPanel';
import { LedgerPanel } from './LedgerPanel';
import { RegularsPanel } from './RegularsPanel';
import { CalendarPanel } from './CalendarPanel';
import { generateNewOrder } from '@/game/engine/orderGenerator';
import { soundManager } from '@/services/audio/soundEffects';
import { formatCurrency } from '@/utils/formatters';
import { ActiveOrder } from '@/game/types';

export const MainGameScreen: React.FC = () => {
  const {
    player,
    shop,
    calendar,
    inventory,
    inventoryLogs,
    menuItems,
    quests,
    achievements,
    activeOrders,
    activeDockTab,
    isPaused,
    isSettingsOpen,
    isDayReportModalOpen,
    latestDayReport,
    dailyLedgers,
    dayRevenue,
    dayTips,
    dayCogs,
    dayPurchaseExpenses,
    dayUpgradeExpenses,
    isSaveNotificationVisible,
    saveNotificationText,
    tickSeconds,
    startCooking,
    finishInteractiveCooking,
    serveOrder,
    buyIngredient,
    buyIngredientsBatch,
    buyUpgrade,
    toggleMenuItemEnabled,
    updateMenuItemPrice,
    claimQuestReward,
    advanceToNextPeriod,
    startNextDay,
    manualSaveGame,
    setActiveDockTab,
    setPaused,
    setTimeSpeed,
    setSettingsOpen,
  } = useGameStore();

  const { shopkeeperSkin } = useSettingsStore();

  const [floatingItems, setFloatingItems] = useState<FloatingItem[]>([]);
  const [cookingOrder, setCookingOrder] = useState<ActiveOrder | null>(null);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [restockInitialIngId, setRestockInitialIngId] = useState<string | null>(null);
  const [restockInitialNeededAmount, setRestockInitialNeededAmount] = useState(1);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // Thêm hiệu ứng bay hình ảnh (Coin / Heart / Sparkle)
  const addFloatingItem = useCallback((type: 'coin' | 'heart' | 'sparkle', text: string) => {
    const newItem: FloatingItem = {
      id: `${Date.now()}_${Math.random()}`,
      type,
      text,
      // Vị trí hơi ngẫu nhiên quanh giữa màn hình
      x: window.innerWidth ? window.innerWidth / 2 + (Math.random() * 80 - 40) : 50,
      y: window.innerHeight ? window.innerHeight / 2 - 40 + (Math.random() * 40 - 20) : 45,
    };
    setFloatingItems((prev) => [...prev, newItem]);
  }, []);

  const handleRemoveFloatingItem = useCallback((id: string) => {
    setFloatingItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Vòng lặp thời gian trong game (1 giây thực = 1 giây nhịp game)
  useEffect(() => {
    const timer = setInterval(() => {
      tickSeconds(1);
    }, 1000);

    return () => clearInterval(timer);
  }, [tickSeconds]);

  // Hỗ trợ phím tắt bàn phím (Keyboard Shortcuts): Space tạm dừng, Esc đóng modal, 1-8 đổi tab dock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Bỏ qua nếu người dùng đang nhập văn bản vào input hoặc textarea
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        soundManager.playClick();
        setPaused(!isPaused);
      } else if (e.key === 'Escape') {
        if (isSettingsOpen) {
          soundManager.playClick();
          setSettingsOpen(false);
        }
      } else if (['1', '2', '3', '4', '5', '6', '7', '8'].includes(e.key)) {
        soundManager.playClick();
        const tabMap: Record<string, typeof activeDockTab> = {
          '1': 'service',
          '2': 'menu',
          '3': 'inventory',
          '4': 'upgrade',
          '5': 'quests',
          '6': 'ledger',
          '7': 'regulars',
          '8': 'calendar',
        };
        const selectedTab = tabMap[e.key];
        if (selectedTab) {
          setActiveDockTab(selectedTab);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, isSettingsOpen, setActiveDockTab, setPaused, setSettingsOpen]);

  // Hành động gọi thêm khách hàng thủ công bằng nút Rao vỉa hè
  const handleCallCustomer = () => {
    const newOrder = generateNewOrder(
      shop.businessModelId,
      menuItems,
      shop,
      calendar.timePeriod,
      activeOrders,
      inventory
    );
    if (newOrder) {
      soundManager.playCustomerBell();
      useGameStore.setState((state) => ({
        activeOrders: [...state.activeOrders, newOrder],
      }));
    }
  };

  // Hành động nấu ăn kèm hiệu ứng âm thanh xèo xèo
  const handleStartCooking = (orderId: string) => {
    soundManager.playCookingSizzle();
    startCooking(orderId);
  };

  // Mở modal nhập hàng từ đơn hoặc từ kho
  const handleOpenRestockModal = (ingredientId?: string, neededAmount: number = 1) => {
    setRestockInitialIngId(ingredientId || null);
    setRestockInitialNeededAmount(neededAmount);
    setIsRestockModalOpen(true);
  };

  // Mở modal nấu ăn tương tác
  const handleOpenInteractiveCooking = (order: ActiveOrder) => {
    setCookingOrder(order);
  };

  // Hoàn tất nấu ăn tương tác
  const handleFinishInteractiveCooking = (orderId: string) => {
    finishInteractiveCooking(orderId);
    setCookingOrder(null);
    soundManager.playSuccessFanfare();
    addFloatingItem('sparkle', 'Món ăn đã sẵn sàng! 🍲');
  };

  // Mua hàng nhiều món theo lô từ chợ
  const handleBatchPurchase = (cart: { ingredientId: string; quantity: number }[]) => {
    return buyIngredientsBatch(cart);
  };

  // Hành động giao món ăn kèm hiệu ứng bay tiền xu leng keng
  const handleServeOrder = (orderId: string) => {
    const order = activeOrders.find((o) => o.id === orderId);
    if (order) {
      soundManager.playCoin();
      addFloatingItem('coin', `+${formatCurrency(order.totalPrice)}`);

      if (order.customer.friendshipLevel) {
        addFloatingItem('heart', `❤️ Thân thiết +15!`);
      }
    }
    serveOrder(orderId);
  };

  // Hành động nhận thưởng nhiệm vụ kèm hiệu ứng pháo hoa Fanfare
  const handleClaimQuestReward = (questId: string) => {
    soundManager.playSuccessFanfare();
    addFloatingItem('sparkle', 'Nhiệm vụ hoàn thành! ⭐');
    claimQuestReward(questId);
  };

  const unclaimedQuestsCount = quests.filter((q) => q.completed && !q.claimed).length;

  return (
    <div className="min-h-screen flex flex-col bg-amber-50 text-amber-950 pb-20 select-none">
      {/* Toast thông báo lưu tiến trình */}
      <Toast isVisible={isSaveNotificationVisible} message={saveNotificationText} />

      {/* Hiệu ứng trực quan tiền xu và tim bay lên */}
      <FloatingFeedback items={floatingItems} onRemoveItem={handleRemoveFloatingItem} />

      {/* Thanh trạng thái đỉnh màn hình */}
      <TopStatusBar
        player={player}
        shop={shop}
        calendar={calendar}
        isPaused={isPaused}
        timeSpeed={calendar.timeSpeed}
        onTogglePause={() => setPaused(!isPaused)}
        onChangeSpeed={setTimeSpeed}
        onSaveGame={manualSaveGame}
        onOpenSettings={() => setSettingsOpen(true)}
        onAdvancePeriod={advanceToNextPeriod}
        onOpenReviews={() => setIsReviewsModalOpen(true)}
        onOpenFeedback={() => setIsFeedbackModalOpen(true)}
      />

      {/* Khu vực nội dung game chính */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 md:px-5 py-3 md:py-4 space-y-4">
        {/* 1. KHU VỰC CẢNH QUAN 2D CỔNG TRƯỜNG & QUẦY HÀNG */}
        <section aria-label="Cảnh quan trường học 2D">
          <SchoolGateScene
            modelId={shop.businessModelId}
            shopName={shop.name}
            level={shop.level}
            upgrades={shop.upgrades}
            timePeriod={calendar.timePeriod}
            weather={calendar.weather}
            shopkeeperSkin={shopkeeperSkin}
            orders={activeOrders}
            onServeOrder={handleServeOrder}
            onOpenCooking={handleOpenInteractiveCooking}
            onCallCustomer={handleCallCustomer}
          />
        </section>

        {/* 2. KHU VỰC NỘI DUNG TƯƠNG ỨNG VỚI TAB QUẢN LÝ ĐANG CHỌN */}
        <section className="bg-white/80 border-2 border-amber-900/15 rounded-3xl p-4 md:p-5 shadow-sm backdrop-blur-sm min-h-[300px]">
          {activeDockTab === 'service' && (
            <CustomerQueue
              orders={activeOrders}
              menuItems={menuItems}
              inventory={inventory}
              cookingSlotsCount={shop.cookingSlotsCount}
              onStartCooking={handleStartCooking}
              onServe={handleServeOrder}
              onOpenInventory={() => setActiveDockTab('inventory')}
              onCallCustomer={handleCallCustomer}
              onQuickRestockIngredient={handleOpenRestockModal}
              onOpenInteractiveCooking={handleOpenInteractiveCooking}
            />
          )}

          {activeDockTab === 'menu' && (
            <MenuPanel
              menuItems={menuItems}
              onToggleEnabled={toggleMenuItemEnabled}
              onUpdatePrice={updateMenuItemPrice}
            />
          )}

          {activeDockTab === 'inventory' && (
            <InventoryPanel
              inventory={inventory}
              inventoryLogs={inventoryLogs}
              cash={shop.cash}
              maxCapacity={shop.maxInventoryCapacity}
              activeOrders={activeOrders}
              onBuyIngredient={buyIngredient}
              onOpenRestockModal={(ingId) => handleOpenRestockModal(ingId, 1)}
            />
          )}

          {activeDockTab === 'upgrade' && (
            <UpgradePanel
              ownedUpgrades={shop.upgrades}
              currentLevel={shop.level}
              cash={shop.cash}
              onBuyUpgrade={buyUpgrade}
            />
          )}

          {activeDockTab === 'quests' && (
            <QuestPanel
              quests={quests}
              achievements={achievements}
              onClaimQuest={handleClaimQuestReward}
            />
          )}

          {activeDockTab === 'ledger' && (
            <LedgerPanel
              player={player}
              shop={shop}
              inventory={inventory}
              dayRevenue={dayRevenue}
              dayTips={dayTips}
              dayCogs={dayCogs}
              dayPurchaseExpenses={dayPurchaseExpenses}
              dayUpgradeExpenses={dayUpgradeExpenses}
              dailyLedgers={dailyLedgers}
              currentDay={calendar.day}
            />
          )}

          {activeDockTab === 'regulars' && <RegularsPanel />}

          {activeDockTab === 'calendar' && <CalendarPanel calendar={calendar} />}
        </section>
      </main>

      {/* Thanh điều hướng dock dưới chân màn hình */}
      <BottomDock
        activeTab={activeDockTab}
        onSelectTab={setActiveDockTab}
        unclaimedQuestsCount={unclaimedQuestsCount}
      />

      {/* Modal Báo Cáo Cuối Ngày */}
      <DayReportModal
        isOpen={isDayReportModalOpen}
        report={latestDayReport}
        onStartNextDay={startNextDay}
      />

      {/* Modal Cài Đặt & Sao Lưu */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} />

      {/* Modal Nấu Ăn & Pha Chế Tương Tác 2D */}
      <InteractiveCookingModal
        order={cookingOrder}
        menuItems={menuItems}
        onClose={() => setCookingOrder(null)}
        onFinishCooking={handleFinishInteractiveCooking}
      />

      {/* Modal Cửa Hàng Nhập Hàng Chợ Đầu Mối */}
      <RestockShopModal
        isOpen={isRestockModalOpen}
        onClose={() => setIsRestockModalOpen(false)}
        inventory={inventory}
        cash={shop.cash}
        maxCapacity={shop.maxInventoryCapacity}
        activeOrders={activeOrders}
        initialIngredientId={restockInitialIngId}
        initialNeededAmount={restockInitialNeededAmount}
        onConfirmPurchase={handleBatchPurchase}
      />

      {/* Modal Sổ Đánh Giá Khách Hàng */}
      <CustomerReviewsModal
        isOpen={isReviewsModalOpen}
        onClose={() => setIsReviewsModalOpen(false)}
        shopReputation={shop.reputation}
        totalOrdersServed={player.totalOrdersServed}
      />

      {/* Modal Hòm Thư Góp Ý & Báo Lỗi */}
      <PlayerFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        defaultPlayerName={player.name}
      />
    </div>
  );
};
