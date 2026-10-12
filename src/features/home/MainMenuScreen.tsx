import React, { useState } from 'react';
import { GAME_CONFIG } from '@/game/config/gameMeta';
import { GameButton } from '@/components/ui/GameButton';
import { Modal } from '@/components/common/Modal';
import { PlayerFeedbackModal } from '@/components/game/PlayerFeedbackModal';
import { PwaInstallModal } from '@/components/game/PwaInstallModal';
import {
  Play,
  RotateCcw,
  Settings,
  Info,
  Heart,
  Coffee,
  Sparkles,
  Smartphone,
  MessageSquareHeart,
} from 'lucide-react';
import { soundManager } from '@/services/audio/soundEffects';

interface MainMenuScreenProps {
  hasSavedGame: boolean;
  onNewGame: () => void;
  onContinueGame: () => void;
  onOpenSettings: () => void;
}

export const MainMenuScreen: React.FC<MainMenuScreenProps> = ({
  hasSavedGame,
  onNewGame,
  onContinueGame,
  onOpenSettings,
}) => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isPwaInstallOpen, setIsPwaInstallOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-4 md:p-6 bg-gradient-to-b from-amber-100 via-orange-50 to-amber-200 select-none relative overflow-hidden">
      {/* ================= BACKGROUND CẢNH QUAN HOẠT HÌNH 2D ================= */}
      {/* 0. Hình nền cảnh cổng trường THPT 2D ấm áp */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-25 pointer-events-none"
        style={{ backgroundImage: `url('/assets/backgrounds/school_gate_morning.jpg')` }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-amber-100/85 via-orange-50/70 to-amber-200/90 pointer-events-none" />

      {/* 1. Mây trắng bồng bềnh */}
      <div className="absolute top-4 inset-x-0 flex justify-between px-8 pointer-events-none opacity-80 z-0">
        <div className="w-24 h-8 bg-white/70 rounded-full blur-[1px] animate-float-slow"></div>
        <div className="w-16 h-6 bg-white/60 rounded-full blur-[1px] animate-float-slow" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* 2. Tán hoa phượng vĩ nở rộ góc trên */}
      <div className="absolute -top-4 -left-6 z-0 pointer-events-none opacity-85">
        <svg width="200" height="150" viewBox="0 0 200 150" fill="none">
          <path d="M 0 150 Q 40 80 60 0" stroke="#5D4037" strokeWidth="18" />
          <circle cx="70" cy="40" r="45" fill="#2E7D32" opacity="0.9" />
          <circle cx="120" cy="50" r="40" fill="#388E3C" opacity="0.85" />
          <circle cx="95" cy="25" r="35" fill="#4CAF50" opacity="0.9" />
          {/* Hoa phượng đỏ */}
          <circle cx="65" cy="35" r="12" fill="#D32F2F" />
          <circle cx="105" cy="45" r="14" fill="#E53935" />
          <circle cx="130" cy="40" r="10" fill="#C62828" />
          <circle cx="85" cy="20" r="9" fill="#F44336" />
        </svg>
      </div>

      {/* ================= HEADER & LOGO GAME ================= */}
      <div className="w-full max-w-2xl flex flex-col items-center text-center pt-6 md:pt-10 z-10 gap-2.5">
        {/* 1. Tag định danh game (Badge riêng biệt ở trên cùng) */}
        <div className="flex justify-center w-full">
          <div className="inline-flex items-center gap-1.5 bg-white/95 border-2 border-amber-300 rounded-full px-4 py-1.5 text-xs font-black text-amber-900 shadow-sm animate-bounce-gentle">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-300" />
            <span>Web Game 2D Mô Phỏng Ẩm Thực Học Đường</span>
          </div>
        </div>

        {/* 2. Tiêu đề chính của Game (Hàng riêng, căn giữa 100%) */}
        <div className="w-full flex flex-col items-center justify-center py-1">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-amber-950 tracking-tight drop-shadow-sm font-game text-center">
            {GAME_CONFIG.title}
          </h1>
          <div className="w-32 h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 rounded-full mt-2 shadow-sm"></div>
        </div>

        {/* 3. Slogan mô tả học đường */}
        <p className="text-xs sm:text-sm md:text-base text-amber-900 font-bold max-w-md mx-auto px-4 text-center drop-shadow-sm">
          {GAME_CONFIG.tagline}
        </p>
      </div>

      {/* ================= BẢNG NÚT BẤM CHÍNH (TACTILE BUTTONS) ================= */}
      <div className="w-full max-w-xs flex flex-col gap-3.5 z-10 my-auto">
        {/* Nút Tiếp tục nếu có bản lưu */}
        {hasSavedGame && (
          <GameButton
            variant="success"
            size="lg"
            icon={<RotateCcw className="w-5 h-5" />}
            onClick={() => {
              soundManager.playClick();
              onContinueGame();
            }}
            className="w-full text-base py-3.5 animate-bounce-gentle font-black shadow-lg"
          >
            Tiếp Tục Quán
          </GameButton>
        )}

        {/* Nút Bắt đầu chơi */}
        <GameButton
          variant={hasSavedGame ? 'secondary' : 'primary'}
          size="lg"
          icon={<Play className="w-5 h-5 fill-current" />}
          onClick={() => {
            soundManager.playClick();
            onNewGame();
          }}
          className="w-full text-base py-3.5 font-black shadow-md"
        >
          {hasSavedGame ? 'Bắt Đầu Lại Từ Đầu' : 'Bắt Đầu Kinh Doanh'}
        </GameButton>

        {/* Cài đặt & Dữ liệu */}
        <GameButton
          variant="secondary"
          size="md"
          icon={<Settings className="w-4 h-4" />}
          onClick={() => {
            soundManager.playClick();
            onOpenSettings();
          }}
          className="w-full font-extrabold"
        >
          Cài Đặt & Nhạc Nền
        </GameButton>

        {/* Góp ý & Báo lỗi */}
        <GameButton
          variant="secondary"
          size="md"
          icon={<MessageSquareHeart className="w-4 h-4 text-amber-700" />}
          onClick={() => {
            soundManager.playClick();
            setIsFeedbackOpen(true);
          }}
          className="w-full font-extrabold text-amber-900"
        >
          Hòm Thư Góp Ý & Đóng Góp 💌
        </GameButton>

        {/* Cài đặt App Điện Thoại */}
        <GameButton
          variant="secondary"
          size="md"
          icon={<Smartphone className="w-4 h-4 text-emerald-700" />}
          onClick={() => {
            soundManager.playClick();
            setIsPwaInstallOpen(true);
          }}
          className="w-full font-extrabold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border-emerald-300"
        >
          Cài App Vào Điện Thoại 📲
        </GameButton>

        {/* Giới thiệu game */}
        <GameButton
          variant="ghost"
          size="sm"
          icon={<Info className="w-4 h-4" />}
          onClick={() => {
            soundManager.playClick();
            setIsAboutOpen(true);
          }}
          className="w-full text-amber-900 font-bold"
        >
          Sổ Tay Giới Thiệu
        </GameButton>
      </div>

      {/* ================= FOOTER & PHIÊN BẢN ================= */}
      <div className="text-center text-[11px] text-amber-900/70 font-semibold z-10 space-y-0.5">
        <p>{GAME_CONFIG.title} • v{GAME_CONFIG.version}</p>
        <p>Phát triển bởi {GAME_CONFIG.developer} • 100% Offline trên trình duyệt</p>
      </div>

      {/* ================= MODAL THÔNG TIN GAME ================= */}
      <Modal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        title="Tiệm Nhỏ Trước Cổng Trường"
        icon={<Info className="w-5 h-5 text-amber-700" />}
        maxWidth="md"
      >
        <div className="space-y-3.5 text-xs md:text-sm text-amber-950 leading-relaxed font-medium">
          <p>
            <strong>{GAME_CONFIG.title}</strong> là tựa game mô phỏng quản lý 2D indie dễ thương, ấm cúng,
            được lấy cảm hứng từ những góc quán thân thương trước cổng trường học Việt Nam: từ ly trà sữa
            trân châu ngọt mát giờ giải lao, chiếc bánh tráng trộn cay nồng giờ tan trường, đến ổ
            bánh mì pate nóng hổi thơm lừng sáng sớm.
          </p>

          <div className="bg-amber-100/70 p-3 rounded-2xl border border-amber-300 space-y-1.5">
            <h5 className="font-extrabold text-amber-950 flex items-center gap-1.5">
              <Coffee className="w-4 h-4 text-amber-800" /> Đặc Sắc Game:
            </h5>
            <ul className="list-disc pl-5 space-y-1 text-amber-900 text-xs">
              <li>Hoàn toàn chạy offline trên thiết bị với IndexedDB an toàn tuyệt đối.</li>
              <li>3 mô hình kinh doanh khởi nghiệp riêng biệt với đặc quyền độc đáo.</li>
              <li>24 món ăn vector 2D vẽ tay, 12 nhân vật khách quen có cốt truyện riêng.</li>
              <li>Nhạc nền Lo-fi synthesizer du dương, tiếng chảo chiên xèo xèo ấm cúng.</li>
            </ul>
          </div>

          <div className="text-center pt-2 text-xs text-amber-800/80 flex items-center justify-center gap-1">
            <span>Được tạo nên bằng</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>dành cho tuổi học trò Việt Nam.</span>
          </div>
        </div>
      </Modal>

      {/* Modal Hòm Thư Góp Ý Người Chơi */}
      <PlayerFeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      {/* Modal Cài Đặt App Điện Thoại */}
      <PwaInstallModal
        isOpen={isPwaInstallOpen}
        onClose={() => setIsPwaInstallOpen(false)}
      />
    </div>
  );
};
