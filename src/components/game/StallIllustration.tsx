import React from 'react';
import { BusinessModelId } from '@/game/types';
import { getShopImageUrl } from '@/data/assetManifest';

interface StallIllustrationProps {
  modelId: BusinessModelId;
  shopName: string;
  level: number;
  hasUpgrades: string[];
}

export const StallIllustration: React.FC<StallIllustrationProps> = ({
  modelId,
  shopName,
  level,
  hasUpgrades,
}) => {
  const hasUmbrella = hasUpgrades.includes('upgrade_umbrella_awning');
  const hasNeon = hasUpgrades.includes('upgrade_neon_signboard');
  const hasStools = hasUpgrades.includes('upgrade_plastic_stools');
  const hasGlass = hasUpgrades.includes('upgrade_glass_display');
  const hasSpeedCooker = hasUpgrades.includes('upgrade_speed_cooker');

  const shopImg = getShopImageUrl(modelId);

  return (
    <div className="relative w-full max-w-[440px] mx-auto select-none transition-all">
      {/* 1. DÙ CHE NẮNG MƯA LỚN (Nâng cấp dù bạt) */}
      {hasUmbrella && (
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-20 pointer-events-none drop-shadow-md animate-bounce-gentle">
          <svg width="220" height="70" viewBox="0 0 220 70" fill="none">
            {/* Vòm dù sọc màu pastel học đường */}
            <path d="M 15 55 Q 110 5 205 55 Z" fill="#FFB4B4" stroke="#4A3B32" strokeWidth="2.5" />
            <path d="M 55 52 Q 110 5 165 52 Z" fill="#FFE79A" stroke="#4A3B32" strokeWidth="2" />
            <path d="M 85 48 Q 110 5 135 48 Z" fill="#B9E8C5" stroke="#4A3B32" strokeWidth="2" />
            {/* Đỉnh chóp dù */}
            <circle cx="110" cy="8" r="4" fill="#FFD369" stroke="#4A3B32" strokeWidth="2" />
            {/* Cán dù thép */}
            <line x1="110" y1="8" x2="110" y2="68" stroke="#6B7280" strokeWidth="3.5" />
          </svg>
        </div>
      )}

      {/* 2. DÃY GHẾ NHỰA VỈA HÈ HỌC SINH (Nâng cấp ghế nhựa) */}
      {hasStools && (
        <div className="absolute -left-7 bottom-0 flex gap-1.5 z-30 pointer-events-none">
          {/* Ghế xanh dương */}
          <div className="w-5 h-6 bg-sky-500 rounded-t-md border-2 border-sky-800 shadow-sm flex flex-col justify-between p-0.5">
            <div className="w-full h-1 bg-sky-300 rounded-xs"></div>
            <div className="w-1.5 h-1.5 mx-auto bg-sky-700 rounded-xs"></div>
          </div>
          {/* Ghế đỏ */}
          <div className="w-5 h-6 bg-rose-500 rounded-t-md border-2 border-rose-800 shadow-sm flex flex-col justify-between p-0.5 -mt-1">
            <div className="w-full h-1 bg-rose-300 rounded-xs"></div>
            <div className="w-1.5 h-1.5 mx-auto bg-rose-700 rounded-xs"></div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MÔ HÌNH 1: XE ĐẨY TRÀ SỮA & ĐỒ UỐNG (BOBA TEA)                */}
      {/* ============================================================== */}
      {modelId === 'boba_tea' && (
        <div className="relative bg-white/95 rounded-3xl border-3 border-amber-900/40 p-3.5 shadow-xl">
          {/* Bảng hiệu xe trà sữa */}
          <div
            className={`rounded-2xl py-2 px-3 text-center border-b-4 transition-all ${
              hasNeon
                ? 'bg-gradient-to-r from-purple-800 via-pink-700 to-purple-800 text-yellow-200 border-purple-950 shadow-[0_0_15px_rgba(236,72,153,0.5)]'
                : 'bg-gradient-to-r from-teal-600 via-emerald-500 to-teal-600 text-white border-teal-800 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              {shopImg && (
                <img
                  src={shopImg}
                  alt="Logo xe đẩy"
                  className="w-5 h-5 md:w-6 md:h-6 rounded-full object-cover border border-white/80 shadow-xs flex-shrink-0"
                />
              )}
              <span className="font-black text-sm md:text-base tracking-wide uppercase drop-shadow-sm truncate">
                {shopName}
              </span>
              <span className="text-[10px] font-black bg-white/30 px-1.5 py-0.2 rounded-md">
                Cấp {level}
              </span>
            </div>
            {hasNeon && (
              <span className="text-[10px] text-pink-200 font-extrabold block animate-pulse mt-0.5">
                ★ TRÀ ĐẬM VỊ • TRÂN CHÂU DẺO THƠM ★
              </span>
            )}
          </div>

          {/* Quầy pha chế & thiết bị xe đẩy */}
          <div className="mt-2.5 bg-amber-50/80 rounded-2xl border-2 border-amber-200/90 p-2.5 flex items-end justify-between gap-2">
            {/* Bình ủ trà inox 1 */}
            <div className="flex flex-col items-center">
              <svg width="34" height="46" viewBox="0 0 34 46" fill="none">
                <rect x="4" y="8" width="26" height="34" rx="4" fill="#E2E8F0" stroke="#475569" strokeWidth="2" />
                <path d="M 8 16 L 26 16" stroke="#94A3B8" strokeWidth="2" />
                <path d="M 8 26 L 26 26" stroke="#94A3B8" strokeWidth="2" />
                {/* Nắp & Quai xách */}
                <rect x="10" y="3" width="14" height="5" rx="2" fill="#64748B" stroke="#334155" strokeWidth="1.5" />
                {/* Vòi xả trà */}
                <rect x="14" y="36" width="6" height="5" rx="1" fill="#D97706" />
                <circle cx="17" cy="22" r="4" fill="#B45309" />
              </svg>
              <span className="text-[9px] font-extrabold text-amber-900 mt-0.5">Trà Đen</span>
            </div>

            {/* Hộp thau trân châu đường đen & Topping */}
            <div className="flex flex-col items-center">
              <svg width="48" height="42" viewBox="0 0 48 42" fill="none">
                {/* Hộp thủy tinh */}
                <rect x="4" y="10" width="40" height="28" rx="5" fill="#FEF3C7" stroke="#92400E" strokeWidth="2" />
                {/* Lớp trân châu đen bóng */}
                <rect x="6" y="20" width="36" height="16" rx="3" fill="#291811" />
                <circle cx="14" cy="28" r="3" fill="#451A03" />
                <circle cx="24" cy="27" r="3.5" fill="#451A03" />
                <circle cx="34" cy="29" r="3" fill="#451A03" />
                <circle cx="19" cy="33" r="2.5" fill="#78350F" />
                <circle cx="29" cy="32" r="2.5" fill="#78350F" />
                {/* Thìa múc topping */}
                <line x1="28" y1="4" x2="36" y2="22" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <span className="text-[9px] font-extrabold text-amber-900 mt-0.5">Trân Châu</span>
            </div>

            {/* Chai siro trái cây & Máy dập nắp */}
            <div className="flex flex-col items-center">
              {hasSpeedCooker ? (
                <svg width="36" height="46" viewBox="0 0 36 46" fill="none">
                  {/* Máy dập nắp hiện đại */}
                  <rect x="4" y="6" width="28" height="36" rx="4" fill="#DC2626" stroke="#7F1D1D" strokeWidth="2" />
                  <rect x="8" y="12" width="20" height="12" rx="2" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
                  <circle cx="18" cy="18" r="3" fill="#E11D48" />
                  <line x1="18" y1="2" x2="18" y2="6" stroke="#475569" strokeWidth="3" />
                  <circle cx="18" cy="2" r="3" fill="#0284C7" />
                </svg>
              ) : (
                <svg width="36" height="46" viewBox="0 0 36 46" fill="none">
                  {/* 2 Chai siro */}
                  <rect x="6" y="14" width="10" height="26" rx="2" fill="#F43F5E" stroke="#9F1239" strokeWidth="1.5" />
                  <rect x="8" y="8" width="6" height="6" fill="#FB7185" stroke="#9F1239" strokeWidth="1" />
                  <rect x="20" y="14" width="10" height="26" rx="2" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
                  <rect x="22" y="8" width="6" height="6" fill="#FBBF24" stroke="#B45309" strokeWidth="1" />
                </svg>
              )}
              <span className="text-[9px] font-extrabold text-amber-900 mt-0.5">
                {hasSpeedCooker ? 'Máy Ép Ly' : 'Siro Vị'}
              </span>
            </div>
          </div>

          {/* Bánh xe đẩy lưu động */}
          <div className="mt-2 flex justify-between px-6">
            <div className="w-8 h-8 rounded-full border-3 border-amber-900 bg-slate-300 flex items-center justify-center shadow-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-950"></div>
            </div>
            <div className="w-8 h-8 rounded-full border-3 border-amber-900 bg-slate-300 flex items-center justify-center shadow-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-950"></div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MÔ HÌNH 2: GÁNH HÀNG ĂN VẶT & MÌ CAY (STREET SNACK)           */}
      {/* ============================================================== */}
      {modelId === 'street_snack' && (
        <div className="relative bg-white/95 rounded-3xl border-3 border-amber-900/40 p-3.5 shadow-xl">
          {/* Bảng hiệu gánh ăn vặt */}
          <div
            className={`rounded-2xl py-2 px-3 text-center border-b-4 transition-all ${
              hasNeon
                ? 'bg-gradient-to-r from-red-800 via-amber-700 to-red-800 text-yellow-200 border-red-950 shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                : 'bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 text-white border-amber-800 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              {shopImg && (
                <img
                  src={shopImg}
                  alt="Logo gánh ăn vặt"
                  className="w-5 h-5 md:w-6 md:h-6 rounded-full object-cover border border-white/80 shadow-xs flex-shrink-0"
                />
              )}
              <span className="font-black text-sm md:text-base tracking-wide uppercase drop-shadow-sm truncate">
                {shopName}
              </span>
              <span className="text-[10px] font-black bg-white/30 px-1.5 py-0.2 rounded-md">
                Cấp {level}
              </span>
            </div>
            {hasNeon && (
              <span className="text-[10px] text-yellow-200 font-extrabold block animate-pulse mt-0.5">
                ★ CÁ VIÊN CHIÊN NƯỚC MẮM • BÁNH TRÁNG TRỘN ★
              </span>
            )}
          </div>

          {/* Quầy bếp chiên & thau trộn bánh tráng */}
          <div className="mt-2.5 bg-amber-50/80 rounded-2xl border-2 border-amber-200/90 p-2.5 flex items-end justify-between gap-2">
            {/* Chảo chiên cá viên bốc khói */}
            <div className="flex flex-col items-center relative">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-3 h-5 bg-slate-300/60 rounded-full animate-steam"></div>
              <svg width="42" height="44" viewBox="0 0 42 44" fill="none">
                {/* Chảo chiên sâu lòng */}
                <ellipse cx="21" cy="22" rx="18" ry="8" fill="#F59E0B" stroke="#78350F" strokeWidth="2" />
                <path d="M 3 22 C 3 36 39 36 39 22 Z" fill="#334155" stroke="#1E293B" strokeWidth="2" />
                {/* Viên chiên vàng ươm */}
                <circle cx="16" cy="22" r="3" fill="#D97706" />
                <circle cx="25" cy="21" r="3.5" fill="#EF4444" />
                <circle cx="21" cy="25" r="2.5" fill="#B45309" />
                {/* Tay cầm chảo */}
                <path d="M 39 22 L 41 24" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <span className="text-[9px] font-extrabold text-amber-900 mt-0.5">Chảo Chiên</span>
            </div>

            {/* Thau trộn bánh tráng Cô Ba */}
            <div className="flex flex-col items-center">
              <svg width="46" height="42" viewBox="0 0 46 42" fill="none">
                {/* Thau nhôm tròn */}
                <ellipse cx="23" cy="24" rx="19" ry="9" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />
                <path d="M 4 24 C 4 36 42 36 42 24 Z" fill="#CBD5E1" stroke="#64748B" strokeWidth="2" />
                {/* Bánh tráng sợi & rau răm, trứng cút */}
                <ellipse cx="23" cy="23" rx="13" ry="5" fill="#FDE68A" />
                <circle cx="18" cy="23" r="2.5" fill="#15803D" />
                <circle cx="27" cy="22" r="2.5" fill="#DC2626" />
                <circle cx="22" cy="24" r="2.5" fill="#FFFFFF" />
              </svg>
              <span className="text-[9px] font-extrabold text-amber-900 mt-0.5">Bánh Tráng</span>
            </div>

            {/* Mẹt xiên que đủ màu */}
            <div className="flex flex-col items-center">
              <svg width="36" height="44" viewBox="0 0 36 44" fill="none">
                {/* Giỏ mây cắm xiên que */}
                <rect x="6" y="16" width="24" height="22" rx="4" fill="#D97706" stroke="#78350F" strokeWidth="2" />
                {/* Que xiên cắm thẳng */}
                <line x1="12" y1="4" x2="12" y2="20" stroke="#B45309" strokeWidth="2" />
                <circle cx="12" cy="7" r="2.5" fill="#DC2626" />
                <line x1="18" y1="2" x2="18" y2="20" stroke="#B45309" strokeWidth="2" />
                <circle cx="18" cy="5" r="2.5" fill="#F59E0B" />
                <line x1="24" y1="6" x2="24" y2="20" stroke="#B45309" strokeWidth="2" />
                <circle cx="24" cy="9" r="2.5" fill="#84CC16" />
              </svg>
              <span className="text-[9px] font-extrabold text-amber-900 mt-0.5">Xiên Que</span>
            </div>
          </div>

          {/* Chân quầy inox & bánh xe đẩy */}
          <div className="mt-2 flex justify-between px-6">
            <div className="w-7 h-7 rounded-full border-3 border-amber-900 bg-slate-300 flex items-center justify-center shadow-sm">
              <div className="w-2 h-2 rounded-full bg-amber-950"></div>
            </div>
            <div className="w-7 h-7 rounded-full border-3 border-amber-900 bg-slate-300 flex items-center justify-center shadow-sm">
              <div className="w-2 h-2 rounded-full bg-amber-950"></div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MÔ HÌNH 3: QUẦY ĂN SÁNG BÁNH MÌ & XÔI (BREAKFAST STALL)        */}
      {/* ============================================================== */}
      {modelId === 'breakfast_stall' && (
        <div className="relative bg-white/95 rounded-3xl border-3 border-amber-900/40 p-3.5 shadow-xl">
          {/* Bảng hiệu quầy bánh mì */}
          <div
            className={`rounded-2xl py-2 px-3 text-center border-b-4 transition-all ${
              hasNeon
                ? 'bg-gradient-to-r from-amber-900 via-rose-800 to-amber-900 text-yellow-200 border-amber-950 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                : 'bg-gradient-to-r from-rose-600 via-amber-600 to-rose-600 text-white border-rose-800 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              {shopImg && (
                <img
                  src={shopImg}
                  alt="Logo quầy ăn sáng"
                  className="w-5 h-5 md:w-6 md:h-6 rounded-full object-cover border border-white/80 shadow-xs flex-shrink-0"
                />
              )}
              <span className="font-black text-sm md:text-base tracking-wide uppercase drop-shadow-sm truncate">
                {shopName}
              </span>
              <span className="text-[10px] font-black bg-white/30 px-1.5 py-0.2 rounded-md">
                Cấp {level}
              </span>
            </div>
            {hasNeon && (
              <span className="text-[10px] text-yellow-200 font-extrabold block animate-pulse mt-0.5">
                ★ BÁNH MÌ GIÒN RỤM • XÔI BẮP LÁ CHUỐI NÓNG HỔI ★
              </span>
            )}
          </div>

          {/* Tủ kính bánh mì & nồi xôi bốc khói */}
          <div className="mt-2.5 bg-amber-50/80 rounded-2xl border-2 border-amber-200/90 p-2.5 flex items-end justify-between gap-2">
            {/* Tủ kính đựng bánh mì ổ */}
            <div className="flex flex-col items-center">
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                {/* Khung kính trong suốt */}
                <rect x="3" y="6" width="38" height="34" rx="4" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" opacity="0.9" />
                {/* 2 Ổ bánh mì vàng ươm */}
                <ellipse cx="14" cy="22" rx="6" ry="11" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />
                <path d="M 12 15 Q 16 17 12 20" stroke="#FDE68A" strokeWidth="1" />
                <ellipse cx="28" cy="22" rx="6" ry="11" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />
                <path d="M 26 15 Q 30 17 26 20" stroke="#FDE68A" strokeWidth="1" />
              </svg>
              <span className="text-[9px] font-extrabold text-amber-900 mt-0.5">Bánh Mì Giòn</span>
            </div>

            {/* Xửng hấp xôi lá chuối bốc khói */}
            <div className="flex flex-col items-center relative">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-3 h-5 bg-slate-300/60 rounded-full animate-steam"></div>
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                {/* Nồi nhôm hấp xôi */}
                <rect x="6" y="16" width="32" height="22" rx="4" fill="#CBD5E1" stroke="#475569" strokeWidth="2" />
                <path d="M 4 16 L 40 16" stroke="#475569" strokeWidth="2.5" />
                {/* Lá chuối xanh bọc xôi */}
                <ellipse cx="22" cy="16" rx="14" ry="5" fill="#15803D" stroke="#166534" strokeWidth="1.5" />
                <ellipse cx="22" cy="15" rx="9" ry="3" fill="#FEF08A" />
              </svg>
              <span className="text-[9px] font-extrabold text-amber-900 mt-0.5">Xôi Nóng</span>
            </div>

            {/* Khay pate gan & chả lụa */}
            <div className="flex flex-col items-center">
              <svg width="36" height="44" viewBox="0 0 36 44" fill="none">
                <rect x="4" y="14" width="28" height="24" rx="4" fill="#FFF1F2" stroke="#E11D48" strokeWidth="2" />
                <rect x="8" y="18" width="20" height="9" rx="2" fill="#BE123C" />
                <circle cx="12" cy="32" r="3" fill="#FDA4AF" stroke="#E11D48" strokeWidth="1" />
                <circle cx="20" cy="32" r="3" fill="#FDA4AF" stroke="#E11D48" strokeWidth="1" />
              </svg>
              <span className="text-[9px] font-extrabold text-amber-900 mt-0.5">Pate Chả</span>
            </div>
          </div>

          {/* Chân quầy gỗ ấm cúng */}
          <div className="mt-2 flex justify-between px-8">
            <div className="w-4 h-6 bg-amber-800 rounded-b-md"></div>
            <div className="w-4 h-6 bg-amber-800 rounded-b-md"></div>
          </div>
        </div>
      )}
    </div>
  );
};
