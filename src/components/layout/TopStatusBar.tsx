import React, { useState } from 'react';
import { GameCalendar, ShopState, PlayerProfile } from '@/game/types';
import { formatCurrency, getTimePeriodInfo, getDayOfWeekLabel } from '@/utils/formatters';
import { formatInGameTime } from '@/game/engine/gameClock';
import {
  Coins,
  Star,
  Award,
  Save,
  Settings,
  Pause,
  Play,
  FastForward,
  Clock,
  Flame,
  MessageSquareHeart,
} from 'lucide-react';

interface TopStatusBarProps {
  player: PlayerProfile;
  shop: ShopState;
  calendar: GameCalendar;
  isPaused: boolean;
  timeSpeed: 1 | 2;
  onTogglePause: () => void;
  onChangeSpeed: (speed: 1 | 2) => void;
  onSaveGame: () => void;
  onOpenSettings: () => void;
  onAdvancePeriod: () => void;
  onOpenReviews?: () => void;
  onOpenFeedback?: () => void;
}

export const TopStatusBar: React.FC<TopStatusBarProps> = ({
  player: _player,
  shop,
  calendar,
  isPaused,
  timeSpeed,
  onTogglePause,
  onChangeSpeed,
  onSaveGame,
  onOpenSettings,
  onAdvancePeriod,
  onOpenReviews,
  onOpenFeedback,
}) => {
  const [coinImgError, setCoinImgError] = useState(false);
  const periodInfo = getTimePeriodInfo(calendar.timePeriod);
  const expPercent = Math.min(100, (shop.exp / shop.expToNextLevel) * 100);
  const timeString = formatInGameTime(calendar.inGameMinute);

  return (
    <header className="sticky top-0 z-40 bg-amber-100/95 border-b-2 border-amber-900/20 shadow-sm backdrop-blur-md px-3 md:px-5 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        {/* ================= BÊN TRÁI: NGÀY, ĐỒNG HỒ & THỜI GIAN ================= */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Badge Ngày & Tuần */}
          <div className="bg-amber-900 text-amber-50 px-2.5 py-1 rounded-xl text-xs md:text-sm font-black shadow-sm flex items-center gap-1">
            <span>T{calendar.schoolWeek || 1} • Ngày {calendar.day}</span>
            <span className="text-amber-300 font-medium">({getDayOfWeekLabel(calendar.dayOfWeek)})</span>
          </div>

          {/* Đồng hồ số trong game */}
          <div className="bg-white/90 border border-amber-300 px-2.5 py-1 rounded-xl text-xs md:text-sm font-black text-amber-950 flex items-center gap-1.5 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span className="tracking-wide">{timeString}</span>
          </div>

          {/* Mốc thời gian & Nút Tua mốc */}
          <button
            onClick={onAdvancePeriod}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs md:text-sm font-extrabold shadow-sm transition-all hover:brightness-105 active:scale-95 ${periodInfo.badgeColor}`}
            title="Bấm để chuyển nhanh sang mốc thời gian tiếp theo"
          >
            <span>{periodInfo.label}</span>
            <FastForward className="w-3.5 h-3.5 text-amber-900 ml-0.5" />
          </button>
        </div>

        {/* ================= Ở GIỮA: KINH TẾ (TIỀN, SAO, HÀI LÒNG, CẤP, TRẠM BẾP) ================= */}
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          {/* Tiền mặt */}
          <div className="flex items-center gap-1.5 bg-white/90 border border-emerald-400/80 px-2.5 py-1 rounded-xl shadow-sm">
            {!coinImgError ? (
              <img
                src="/assets/icons/coin_gold.jpg"
                alt="Tiền"
                className="w-4 h-4 rounded-full object-cover shadow-2xs flex-shrink-0"
                onError={() => setCoinImgError(true)}
              />
            ) : (
              <Coins className="w-4 h-4 text-amber-500 fill-amber-400 flex-shrink-0" />
            )}
            <span className="text-xs md:text-sm font-black text-emerald-800">
              {formatCurrency(shop.cash)}
            </span>
          </div>

          {/* Danh tiếng sao & Đánh giá */}
          <button
            type="button"
            onClick={onOpenReviews}
            className="flex items-center gap-1.5 bg-white/90 hover:bg-amber-100 border border-amber-400/80 px-2.5 py-1 rounded-xl shadow-sm transition-all cursor-pointer hover:scale-105 active:scale-95"
            title="Bấm để xem sổ đánh giá của khách hàng"
          >
            <Star className="w-4 h-4 text-amber-500 fill-amber-400 flex-shrink-0" />
            <span className="text-xs md:text-sm font-black text-amber-950">
              {shop.reputation}
            </span>
            <span className="text-[10px] text-amber-700 font-bold hidden sm:inline">Uy tín ⭐</span>
          </button>

          {/* Mức độ hài lòng gần đây */}
          <button
            type="button"
            onClick={onOpenReviews}
            className="flex items-center gap-1 bg-white/90 hover:bg-rose-50 border border-rose-300 px-2.5 py-1 rounded-xl shadow-sm text-xs font-black text-rose-950 transition-all cursor-pointer hover:scale-105 active:scale-95"
            title="Bấm để xem mức độ hài lòng và đánh giá của khách hàng"
          >
            <span className="text-sm">
              {(shop.customerSatisfaction ?? 85) >= 80 ? '😍' : (shop.customerSatisfaction ?? 85) >= 50 ? '😊' : '😥'}
            </span>
            <span>{shop.customerSatisfaction ?? 85}%</span>
            <span className="text-[10px] text-rose-700 font-bold hidden md:inline">Hài lòng</span>
          </button>

          {/* Cấp độ tiệm */}
          <div className="flex items-center gap-1.5 bg-white/90 border border-blue-300 px-2.5 py-1 rounded-xl shadow-sm">
            <Award className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-[11px] font-black text-blue-950 leading-tight">
                Cấp {shop.level}
              </span>
              <div className="w-12 bg-blue-100 h-1.5 rounded-full overflow-hidden border border-blue-200">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all"
                  style={{ width: `${expPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Số trạm bếp */}
          <div className="hidden lg:flex items-center gap-1 bg-amber-50 border border-amber-300 px-2 py-1 rounded-xl text-xs font-bold text-amber-900 shadow-sm" title="Số đơn có thể nấu cùng lúc">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>Bếp: {shop.cookingSlotsCount} trạm</span>
          </div>
        </div>

        {/* ================= BÊN PHẢI: ĐIỀU KHIỂN TỐC ĐỘ, LƯU, CÀI ĐẶT ================= */}
        <div className="flex items-center gap-1.5">
          {/* Nút Tốc độ 1x / 2x */}
          <button
            onClick={() => onChangeSpeed(timeSpeed === 1 ? 2 : 1)}
            className={`px-2 py-1 rounded-xl text-xs font-black border transition-all ${
              timeSpeed === 2
                ? 'bg-amber-600 text-white border-amber-700 shadow-inner'
                : 'bg-white/80 text-amber-900 border-amber-300 hover:bg-amber-200'
            }`}
            title="Đổi tốc độ game clock"
          >
            {timeSpeed}x
          </button>

          {/* Tạm dừng */}
          <button
            onClick={onTogglePause}
            className={`p-1.5 rounded-xl border transition-all ${
              isPaused
                ? 'bg-rose-500 text-white border-rose-700 animate-pulse'
                : 'bg-white/80 hover:bg-amber-200 text-amber-900 border-amber-300'
            }`}
            title={isPaused ? 'Tiếp tục' : 'Tạm dừng'}
          >
            {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
          </button>

          {/* Lưu game */}
          <button
            onClick={onSaveGame}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/80 hover:bg-emerald-100 text-amber-950 border border-amber-300 hover:border-emerald-400 transition-all font-bold text-xs"
            title="Lưu tiến trình vào thiết bị"
          >
            <Save className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Lưu</span>
          </button>

          {/* Góp ý */}
          {onOpenFeedback && (
            <button
              onClick={onOpenFeedback}
              className="p-1.5 rounded-xl bg-white/80 hover:bg-amber-200 text-amber-900 border border-amber-300 transition-all cursor-pointer"
              title="Gửi góp ý & ý tưởng cho tiệm"
            >
              <MessageSquareHeart className="w-4 h-4 text-amber-700" />
            </button>
          )}

          {/* Cài đặt */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-xl bg-white/80 hover:bg-amber-200 text-amber-900 border border-amber-300 transition-all cursor-pointer"
            title="Cài đặt trò chơi"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
