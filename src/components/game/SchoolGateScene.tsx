import React, { useState } from 'react';
import { TimePeriod, WeatherType, BusinessModelId, ActiveOrder } from '@/game/types';
import { StallIllustration } from './StallIllustration';
import { ShopkeeperSprite, ShopkeeperSkin, ShopkeeperAction } from './ShopkeeperSprite';
import { SceneCustomerQueue } from './SceneCustomerQueue';

interface SchoolGateSceneProps {
  modelId: BusinessModelId;
  shopName: string;
  level: number;
  upgrades: string[];
  timePeriod: TimePeriod;
  weather: WeatherType;
  shopkeeperSkin?: ShopkeeperSkin;
  orders?: ActiveOrder[];
  onServeOrder?: (orderId: string) => void;
  onOpenCooking?: (order: ActiveOrder) => void;
  onCallCustomer?: () => void;
}

export const SchoolGateScene: React.FC<SchoolGateSceneProps> = ({
  modelId,
  shopName,
  level,
  upgrades,
  timePeriod,
  weather,
  shopkeeperSkin = 'bao_an',
  orders = [],
  onServeOrder = () => {},
  onOpenCooking,
  onCallCustomer,
}) => {
  const [bgFailed, setBgFailed] = useState(false);

  // Xác định hoạt ảnh người bán hàng theo trạng thái đơn thực tế
  const getShopkeeperAction = (): ShopkeeperAction => {
    if (!orders || orders.length === 0) return 'idle';
    if (orders.some((o) => o.status === 'ready_to_serve')) return 'serving';
    if (orders.some((o) => o.status === 'preparing')) return 'cooking';
    return 'idle';
  };

  // Chọn ảnh nền theo thời gian thực của game
  const isAfternoonOrNight = ['afternoon_bell', 'evening_chill', 'day_end'].includes(timePeriod);
  const bgImageUrl = isAfternoonOrNight
    ? '/assets/backgrounds/school_gate_sunset.jpg'
    : '/assets/backgrounds/school_gate_morning.jpg';

  // Lớp phủ ánh sáng thời gian cho nền
  const getLightingOverlay = () => {
    switch (timePeriod) {
      case 'morning_prep':
        return 'bg-amber-500/10 mix-blend-color-burn';
      case 'school_rush':
      case 'recess_rush':
        return 'bg-transparent';
      case 'noon_break':
        return 'bg-yellow-400/10';
      case 'afternoon_bell':
        return 'bg-orange-600/15 mix-blend-multiply';
      case 'evening_chill':
        return 'bg-purple-900/25 mix-blend-multiply';
      case 'day_end':
        return 'bg-slate-950/65 mix-blend-multiply';
      default:
        return 'bg-transparent';
    }
  };

  // Bầu trời thay đổi theo mốc thời gian trong ngày (fallback gradient)
  const getSkyGradient = () => {
    switch (timePeriod) {
      case 'morning_prep':
        return 'from-amber-200 via-rose-100 to-sky-200';
      case 'school_rush':
      case 'recess_rush':
        return 'from-sky-300 via-sky-100 to-amber-50';
      case 'noon_break':
        return 'from-sky-400 via-amber-100 to-yellow-50';
      case 'afternoon_bell':
        return 'from-orange-300 via-rose-200 to-amber-100';
      case 'evening_chill':
        return 'from-indigo-400 via-purple-300 to-rose-200';
      case 'day_end':
        return 'from-slate-800 via-indigo-950 to-slate-900';
      default:
        return 'from-sky-200 to-amber-50';
    }
  };

  const isNight = timePeriod === 'day_end';

  return (
    <div
      className={`relative w-full h-[270px] md:h-[320px] rounded-3xl overflow-hidden border-4 border-amber-900/25 shadow-lg bg-gradient-to-b ${getSkyGradient()} select-none transition-all duration-700`}
    >
      {/* ẢNH MINH HỌA NỀN 2D CỔNG TRƯỜNG THỰC TẾ */}
      {!bgFailed && (
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={bgImageUrl}
            alt="Cổng trường học Việt Nam"
            onError={() => setBgFailed(true)}
            className="w-full h-full object-cover object-center filter saturate-[1.05] brightness-[1.02]"
          />
          {/* Lớp phủ hòa sắc theo mốc thời gian */}
          <div className={`absolute inset-0 pointer-events-none ${getLightingOverlay()}`}></div>
          {/* Lớp bóng vỉa hè phía dưới giúp quầy hàng nổi bật */}
          <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-black/40 via-black/15 to-transparent"></div>
        </div>
      )}

      {/* ================= CẢNH QUAN NỀN TRƯỜNG HỌC VECTOR (FALLBACK KHI CHƯA CÓ ẢNH HOẶC LỖI TẢI) ================= */}
      {bgFailed && (
        <>
          {/* Mây trời hoặc trăng sao */}
          {!isNight ? (
            <div className="absolute top-3 inset-x-0 flex justify-between px-8 pointer-events-none opacity-80">
              <div className="flex gap-2 items-center animate-float-slow">
                <div className="w-16 h-6 bg-white/70 rounded-full blur-[1px]"></div>
                <div className="w-10 h-5 bg-white/60 rounded-full -ml-4 -mt-2"></div>
              </div>
              <div className="flex gap-1 items-center animate-float-slow" style={{ animationDelay: '2s' }}>
                <div className="w-14 h-5 bg-white/60 rounded-full"></div>
              </div>
            </div>
          ) : (
            <div className="absolute top-4 right-8 w-8 h-8 rounded-full bg-yellow-200 shadow-[0_0_20px_#fef08a] pointer-events-none animate-pulse-subtle"></div>
          )}

      {/* Tán cây Phượng Vĩ đỏ rực rỡ góc trái */}
      <div className="absolute top-0 -left-6 z-10 pointer-events-none">
        <svg width="180" height="140" viewBox="0 0 180 140" fill="none">
          {/* Thân cây nâu */}
          <path d="M 0 140 Q 30 70 50 0" stroke="#5D4037" strokeWidth="16" />
          {/* Tán lá xanh */}
          <circle cx="60" cy="35" r="40" fill="#2E7D32" opacity="0.9" />
          <circle cx="100" cy="45" r="35" fill="#388E3C" opacity="0.85" />
          <circle cx="80" cy="20" r="30" fill="#4CAF50" opacity="0.9" />
          {/* Những chùm hoa phượng đỏ */}
          <circle cx="55" cy="30" r="10" fill="#D32F2F" />
          <circle cx="85" cy="40" r="12" fill="#E53935" />
          <circle cx="110" cy="35" r="9" fill="#C62828" />
          <circle cx="70" cy="15" r="8" fill="#F44336" />
        </svg>
      </div>

      {/* Cổng trường học Việt Nam (Tường vàng, trụ gạch đỏ, biển tên) */}
      <div className="absolute top-10 inset-x-0 flex justify-center pointer-events-none opacity-90">
        <div className="relative flex items-end">
          {/* Cột cổng trái */}
          <div className="w-7 h-28 bg-gradient-to-r from-red-700 to-red-600 rounded-t-md border-2 border-red-900 relative shadow-md">
            <div className="absolute -top-3 -left-1 -right-1 h-3 bg-amber-800 rounded-sm"></div>
          </div>

          {/* Biển hiệu vòm cổng trường */}
          <div className="w-56 md:w-72 h-16 bg-gradient-to-r from-red-800 via-red-700 to-red-800 border-y-2 border-amber-300 flex flex-col items-center justify-center shadow-lg relative -mb-4 z-0">
            <span className="text-[10px] md:text-xs font-bold text-amber-200 tracking-wider">
              BỘ GIÁO DỤC VÀ ĐÀO TẠO
            </span>
            <span className="text-xs md:text-sm font-black text-white tracking-wide text-center px-1">
              TRƯỜNG THPT BÌNH MINH
            </span>
            {/* Hàng rào sắt cổng trường */}
            <div className="absolute -bottom-8 inset-x-2 flex justify-around opacity-40">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="w-1 h-8 bg-slate-800"></div>
              ))}
            </div>
          </div>

          {/* Cột cổng phải */}
          <div className="w-7 h-28 bg-gradient-to-r from-red-600 to-red-700 rounded-t-md border-2 border-red-900 relative shadow-md">
            <div className="absolute -top-3 -left-1 -right-1 h-3 bg-amber-800 rounded-sm"></div>
          </div>
        </div>
      </div>

      {/* Chiếc xe đạp học sinh dựng chân chống bên tường */}
      <div className="absolute bottom-16 right-4 md:right-10 pointer-events-none z-10 opacity-80">
        <svg width="75" height="50" viewBox="0 0 75 50" fill="none">
          {/* 2 Bánh xe */}
          <circle cx="15" cy="35" r="12" stroke="#475569" strokeWidth="2.5" fill="none" />
          <circle cx="60" cy="35" r="12" stroke="#475569" strokeWidth="2.5" fill="none" />
          {/* Khung xe màu xanh */}
          <line x1="15" y1="35" x2="35" y2="35" stroke="#0284C7" strokeWidth="2.5" />
          <line x1="35" y1="35" x2="52" y2="20" stroke="#0284C7" strokeWidth="2.5" />
          <line x1="52" y1="20" x2="28" y2="20" stroke="#0284C7" strokeWidth="2.5" />
          <line x1="28" y1="20" x2="15" y2="35" stroke="#0284C7" strokeWidth="2.5" />
          <line x1="35" y1="35" x2="28" y2="15" stroke="#0284C7" strokeWidth="2.5" />
          {/* Ghi đông & Yên */}
          <line x1="52" y1="20" x2="55" y2="10" stroke="#334155" strokeWidth="2" />
          <line x1="50" y1="10" x2="60" y2="10" stroke="#334155" strokeWidth="3" />
          <ellipse cx="27" cy="14" rx="5" ry="2" fill="#1E293B" />
          {/* Giỏ mây */}
          <rect x="56" y="12" width="10" height="9" rx="2" fill="#D97706" />
        </svg>
      </div>

      {/* Học sinh đi ngang qua cổng trường (hoạt hình lướt qua bên trái) */}
      <div className="absolute bottom-16 left-10 flex items-end gap-1 pointer-events-none opacity-85 z-10 animate-bounce-gentle">
        <div className="flex flex-col items-center">
          <div className="w-5 h-5 rounded-full bg-amber-200 border border-amber-800"></div>
          <div className="w-6 h-7 bg-white rounded-t-md border border-slate-400 relative flex items-center justify-center">
            {/* Khăn quàng đỏ */}
            <div className="w-2 h-4 bg-red-600 -rotate-12"></div>
            {/* Cặp sách sau lưng */}
            <div className="absolute -left-1 top-1 w-2.5 h-4 bg-sky-600 rounded-sm"></div>
          </div>
          <div className="flex gap-1">
            <div className="w-1.5 h-4 bg-slate-800"></div>
            <div className="w-1.5 h-4 bg-slate-800"></div>
          </div>
        </div>
      </div>

      {/* Bé học sinh nữ đứng bên phải quầy hàng đang thưởng thức đồ uống */}
      <div className="absolute bottom-16 right-20 md:right-28 flex items-end gap-1 pointer-events-none opacity-85 z-10 animate-bounce-gentle" style={{ animationDelay: '1s' }}>
        <div className="flex flex-col items-center">
          {/* Tóc hai bím */}
          <div className="relative">
            <div className="w-5 h-5 rounded-full bg-amber-200 border border-amber-800"></div>
            <div className="absolute -left-1 top-1 w-1.5 h-3 bg-slate-800 rounded-full"></div>
            <div className="absolute -right-1 top-1 w-1.5 h-3 bg-slate-800 rounded-full"></div>
          </div>
          {/* Áo đồng phục xanh nhạt */}
          <div className="w-6 h-7 bg-sky-100 rounded-t-md border border-sky-300 relative flex items-center justify-center">
            {/* Ly nước mini trên tay */}
            <div className="w-2 h-3 bg-amber-300 rounded-xs border border-amber-600"></div>
          </div>
          <div className="flex gap-1">
            <div className="w-1.5 h-4 bg-blue-900"></div>
            <div className="w-1.5 h-4 bg-blue-900"></div>
          </div>
        </div>
      </div>

      {/* Chậu hoa cúc vàng trang trí vỉa hè bên trái */}
      <div className="absolute bottom-16 left-2 pointer-events-none z-10">
        <svg width="28" height="26" viewBox="0 0 28 26" fill="none">
          <polygon points="4,10 24,10 20,24 8,24" fill="#D97706" stroke="#92400E" strokeWidth="1.5" />
          <circle cx="10" cy="7" r="4" fill="#FACC15" />
          <circle cx="18" cy="7" r="4" fill="#FACC15" />
          <circle cx="14" cy="4" r="3.5" fill="#FDE047" />
          <circle cx="14" cy="8" r="2" fill="#EA580C" />
        </svg>
      </div>
        </>
      )}

      {/* ================= VỈA HÈ LÁT GẠCH HOA VÀNG ================= */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-amber-200 via-amber-100 to-amber-200/90 border-t-4 border-amber-300">
        {/* Đường vân gạch vỉa hè */}
        <div className="w-full h-full opacity-25 flex flex-wrap">
          {[...Array(40)].map((_, idx) => (
            <div key={idx} className="w-1/10 h-8 border border-amber-400"></div>
          ))}
        </div>
        {/* Gờ vỉa hè xi măng */}
        <div className="absolute bottom-0 inset-x-0 h-2 bg-slate-400 border-t border-slate-500"></div>
      </div>

      {/* ================= QUẦY HÀNG CỦA NGƯỜI CHƠI & NGƯỜI BÁN HÀNG ================= */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 w-full max-w-[340px] md:max-w-[400px]">
        {/* Người bán hàng đứng sau quầy chào đón khách */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-10 pointer-events-auto">
          <ShopkeeperSprite
            skin={shopkeeperSkin}
            action={getShopkeeperAction()}
          />
        </div>

        {/* Thân quầy hàng / Xe đẩy */}
        <div className="relative z-20">
          <StallIllustration
            modelId={modelId}
            shopName={shopName}
            level={level}
            hasUpgrades={upgrades}
          />
        </div>
      </div>

      {/* ================= HÀNG ĐỢI KHÁCH HÀNG THỰC TẾ TRÊN VỈA HÈ ================= */}
      <div className="absolute bottom-1 left-2 sm:left-4 md:left-6 z-30 pointer-events-auto max-w-[50%] sm:max-w-[55%] md:max-w-[42%] overflow-x-auto overflow-y-visible py-1 no-scrollbar">
        <SceneCustomerQueue
          orders={orders}
          onServe={onServeOrder}
          onOpenCooking={onOpenCooking}
          onCallCustomer={onCallCustomer}
        />
      </div>

      {/* Hiệu ứng thời tiết ngày mưa rơi */}
      {weather === 'rainy' && (
        <div className="absolute inset-0 pointer-events-none z-30 bg-sky-950/15 overflow-hidden">
          <div className="w-full h-full flex justify-around opacity-60">
            {[...Array(16)].map((_, i) => (
              <div
                key={i}
                className="w-0.5 h-12 bg-sky-200/80 animate-rain-fall"
                style={{
                  animationDuration: `${0.6 + (i % 4) * 0.15}s`,
                  animationDelay: `${(i * 0.12) % 0.8}s`,
                }}
              ></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
