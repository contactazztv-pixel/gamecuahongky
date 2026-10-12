import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '@/app/App';
import { GAME_CONFIG } from '@/game/config/gameMeta';
import { useGameStore } from '@/stores/gameStore';

describe('App End-to-End Onboarding Flow', () => {
  beforeEach(() => {
    useGameStore.setState({
      currentScreen: 'splash',
      hasSavedGameAvailable: false,
    });
  });

  it('renders splash screen with game title from GAME_CONFIG', () => {
    render(<App />);
    expect(screen.getByText(GAME_CONFIG.title)).toBeInTheDocument();
    expect(screen.getByText('Chạm Vào Để Bắt Đầu')).toBeInTheDocument();
  });

  it('navigates through onboarding: Splash -> Main Menu -> Story -> Business Selection', async () => {
    render(<App />);

    // 1. Chạm vào để bắt đầu từ Splash
    const startButton = screen.getByText('Chạm Vào Để Bắt Đầu');
    fireEvent.click(startButton);

    // 2. Chuyển sang Main Menu
    await waitFor(() => {
      expect(screen.getByText('Bắt Đầu Kinh Doanh')).toBeInTheDocument();
    });

    // 3. Bấm Bắt Đầu Kinh Doanh -> Vào Intro Story
    fireEvent.click(screen.getByText('Bắt Đầu Kinh Doanh'));

    await waitFor(() => {
      expect(screen.getByText('Trước Cổng Trường Bình Minh')).toBeInTheDocument();
    });

    // 4. Bỏ qua dẫn truyện hoặc bấm tiếp tục -> Vào Chọn Mô Hình
    const skipButton = screen.getByText('Bỏ qua dẫn truyện');
    fireEvent.click(skipButton);

    await waitFor(() => {
      expect(screen.getByText('Chọn Mô Hình Kinh Doanh Khởi Nghiệp')).toBeInTheDocument();
      expect(screen.getByText('Xe Đẩy Trà Sữa & Đồ Uống')).toBeInTheDocument();
      expect(screen.getByText('Quầy Mì Cay & Đồ Ăn Vặt')).toBeInTheDocument();
      expect(screen.getByText('Quầy Ăn Sáng Bánh Mì & Xôi')).toBeInTheDocument();
    });
  });
});
