import React from 'react';
import { GAME_CONFIG } from '@/game/config/gameMeta';
import { GameButton } from '@/components/ui/GameButton';
import { Sparkles, Play } from 'lucide-react';

interface SplashScreenProps {
  onStart: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 bg-gradient-to-b from-amber-100 via-orange-50 to-amber-200 select-none relative overflow-hidden">
      {/* Nền ảnh Cổng trường 2D mờ ảo tạo chiều sâu */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <img
          src="/assets/backgrounds/school_gate_morning.jpg"
          alt="Cổng trường"
          className="w-full h-full object-cover filter blur-[2px]"
        />
      </div>

      {/* Nền hoạt hình mây và lá phượng bay */}
      <div className="absolute top-10 left-10 w-24 h-8 bg-white/70 rounded-full blur-sm animate-float-slow"></div>
      <div
        className="absolute top-24 right-12 w-32 h-10 bg-white/60 rounded-full blur-sm animate-float-slow"
        style={{ animationDelay: '2s' }}
      ></div>

      {/* Cành phượng vĩ trang trí */}
      <div className="absolute top-0 right-0 pointer-events-none opacity-80">
        <svg width="150" height="150" viewBox="0 0 150 150" fill="none">
          <circle cx="130" cy="20" r="30" fill="#E53935" />
          <circle cx="95" cy="40" r="25" fill="#D32F2F" />
          <circle cx="110" cy="65" r="20" fill="#C62828" />
          <circle cx="140" cy="70" r="15" fill="#4CAF50" />
        </svg>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-lg z-10 my-auto">
        {/* Logo / Huy hiệu Tiệm nhỏ */}
        <div className="relative mb-6">
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-amber-800 shadow-2xl overflow-hidden animate-bounce-gentle bg-white p-1">
            <img
              src="/assets/foods/dish_boba_tea.jpg"
              alt="Logo Tiệm Nhỏ"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="absolute -bottom-2 inset-x-0 flex justify-center">
            <span className="bg-red-600 text-white font-black text-xs px-3 py-1 rounded-full border-2 border-white shadow-md uppercase tracking-wider">
              Phiên Bản 2D Cozy
            </span>
          </div>
        </div>

        {/* Tên trò chơi (Đọc từ GAME_CONFIG để dễ dàng đổi tên) */}
        <h1 className="text-3xl md:text-5xl font-black text-amber-950 tracking-tight drop-shadow-sm leading-tight">
          {GAME_CONFIG.title}
        </h1>

        {/* Khẩu hiệu */}
        <p className="text-base md:text-lg text-amber-800 font-bold mt-2.5 max-w-md">
          {GAME_CONFIG.tagline}
        </p>

        <p className="text-xs md:text-sm text-amber-900/70 mt-2 font-medium max-w-sm">
          Mô phỏng kinh doanh trà sữa, đồ ăn vặt & điểm tâm sáng trước cổng trường học Việt Nam
        </p>

        {/* Nút bấm bắt đầu */}
        <div className="mt-8">
          <GameButton
            variant="primary"
            size="lg"
            icon={<Play className="w-5 h-5 fill-current" />}
            onClick={onStart}
            className="text-lg px-8 py-3.5 shadow-xl animate-pulse-subtle"
          >
            Chạm Vào Để Bắt Đầu
          </GameButton>
        </div>
      </div>

      {/* Chân trang thông tin phiên bản */}
      <div className="text-center text-xs text-amber-900/60 font-semibold z-10 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
        <span>v{GAME_CONFIG.version} • {GAME_CONFIG.developer}</span>
      </div>
    </div>
  );
};
