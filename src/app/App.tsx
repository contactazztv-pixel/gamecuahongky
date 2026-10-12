import React, { useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { GAME_CONFIG } from '@/game/config/gameMeta';
import { SplashScreen } from '@/features/splash/SplashScreen';
import { MainMenuScreen } from '@/features/home/MainMenuScreen';
import { IntroStoryScreen } from '@/features/intro/IntroStoryScreen';
import { BusinessSelectionScreen } from '@/features/business-selection/BusinessSelectionScreen';
import { ShopNamingScreen } from '@/features/shop-naming/ShopNamingScreen';
import { ConfirmationScreen } from '@/features/confirmation/ConfirmationScreen';
import { MainGameScreen } from '@/features/game/MainGameScreen';
import { SettingsModal } from '@/features/settings/SettingsModal';
import { Toast } from '@/components/common/Toast';

export const App: React.FC = () => {
  const {
    currentScreen,
    hasSavedGameAvailable,
    selectedModelId,
    shopNameDraft,
    playerNameDraft,
    isSettingsOpen,
    isSaveNotificationVisible,
    saveNotificationText,
    checkExistingSave,
    setScreen,
    setSelectedModelId,
    setShopNameDraft,
    setPlayerNameDraft,
    setSettingsOpen,
    startNewGame,
    loadGame,
  } = useGameStore();

  useEffect(() => {
    // Đồng bộ tiêu đề trang web từ cấu hình tập trung
    document.title = `${GAME_CONFIG.title} - ${GAME_CONFIG.tagline}`;
    // Kiểm tra xem đã có bản lưu IndexedDB hay chưa
    checkExistingSave();
  }, [checkExistingSave]);

  const handleStartFromSplash = () => {
    setScreen('main_menu');
  };

  const handleNewGameFromMenu = () => {
    setScreen('intro_story');
  };

  const handleContinueFromMenu = async () => {
    const success = await loadGame();
    if (!success) {
      setScreen('business_selection');
    }
  };

  const handleFinishIntro = () => {
    setScreen('business_selection');
  };

  const handleFinishBusinessSelection = () => {
    setScreen('shop_naming');
  };

  const handleFinishShopNaming = () => {
    setScreen('confirmation');
  };

  const handleLaunchGame = async () => {
    await startNewGame(selectedModelId, shopNameDraft, playerNameDraft);
  };

  return (
    <div className="w-full min-h-screen font-game antialiased text-[#382D24] bg-[#FDF6EC]">
      <Toast isVisible={isSaveNotificationVisible} message={saveNotificationText} />

      {/* Điều phối màn hình */}
      {currentScreen === 'splash' && (
        <SplashScreen onStart={handleStartFromSplash} />
      )}

      {currentScreen === 'main_menu' && (
        <MainMenuScreen
          hasSavedGame={hasSavedGameAvailable}
          onNewGame={handleNewGameFromMenu}
          onContinueGame={handleContinueFromMenu}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      )}

      {currentScreen === 'intro_story' && (
        <IntroStoryScreen
          onContinue={handleFinishIntro}
          onSkip={handleFinishIntro}
        />
      )}

      {currentScreen === 'business_selection' && (
        <BusinessSelectionScreen
          selectedModelId={selectedModelId}
          onSelectModel={setSelectedModelId}
          onBack={() => setScreen('main_menu')}
          onConfirm={handleFinishBusinessSelection}
        />
      )}

      {currentScreen === 'shop_naming' && (
        <ShopNamingScreen
          modelId={selectedModelId}
          shopName={shopNameDraft}
          playerName={playerNameDraft}
          onShopNameChange={setShopNameDraft}
          onPlayerNameChange={setPlayerNameDraft}
          onBack={() => setScreen('business_selection')}
          onConfirm={handleFinishShopNaming}
        />
      )}

      {currentScreen === 'confirmation' && (
        <ConfirmationScreen
          modelId={selectedModelId}
          shopName={shopNameDraft}
          playerName={playerNameDraft}
          onBack={() => setScreen('shop_naming')}
          onStartDayOne={handleLaunchGame}
        />
      )}

      {currentScreen === 'main_game' && <MainGameScreen />}

      {/* Modal Cài đặt mở từ Main Menu */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
};

export default App;
