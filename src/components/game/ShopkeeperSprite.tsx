import React from 'react';

export type ShopkeeperSkin = 'bao_an' | 'quang_minh' | 'minh_thu';
export type ShopkeeperAction = 'idle' | 'cooking' | 'serving' | 'happy';

interface ShopkeeperSpriteProps {
  skin?: ShopkeeperSkin;
  action?: ShopkeeperAction;
  onClick?: () => void;
  className?: string;
}

export const SHOPKEEPER_SKINS: {
  id: ShopkeeperSkin;
  name: string;
  role: string;
  description: string;
  badge: string;
}[] = [
  {
    id: 'bao_an',
    name: 'Cô Chủ Bảo An',
    role: 'Nữ • Khởi Nghiệp Ấm Áp',
    description: 'Áo yếm hoa cúc vàng, búi tóc hai bên xinh xắn, nụ cười tỏa nắng luôn tươi chào khách.',
    badge: 'Khéo léo & Chu đáo',
  },
  {
    id: 'quang_minh',
    name: 'Anh Chủ Quang Minh',
    role: 'Nam • Tháo Vát Năng Động',
    description: 'Tạp dề xanh lá, áo sơ mi ngắn tay, bandana cá tính, tay nghề chế biến siêu tốc.',
    badge: 'Nhanh nhẹn & Chắc tay',
  },
  {
    id: 'minh_thu',
    name: 'Bạn Học Minh Thư',
    role: 'Học Sinh • Đam Mê Ẩm Thực',
    description: 'Đồng phục học sinh thắt nơ, đeo tạp dề cà phê và mũ beret dễ thương, học xong là ra phụ quán.',
    badge: 'Nhiệt huyết & Dễ mến',
  },
];

export const ShopkeeperSprite: React.FC<ShopkeeperSpriteProps> = ({
  skin = 'bao_an',
  action = 'idle',
  onClick,
  className = '',
}) => {
  // Hoạt ảnh tương ứng với trạng thái
  const getActionAnimation = () => {
    switch (action) {
      case 'cooking':
        return 'animate-bounce-gentle';
      case 'serving':
        return 'animate-pulse';
      case 'happy':
        return 'animate-bounce';
      default:
        return 'hover:scale-105 transition-transform';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex flex-col items-center select-none cursor-pointer group ${getActionAnimation()} ${className}`}
      title="Bấm để đổi trang phục nhân vật người bán hàng"
    >
      {/* Bong bóng biểu cảm trạng thái trên đầu người bán */}
      <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-30 pointer-events-none transition-all">
        {action === 'cooking' && (
          <span className="bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1 animate-pulse">
            🍳 <span>Đang làm món...</span>
          </span>
        )}
        {action === 'serving' && (
          <span className="bg-emerald-100 border border-emerald-400 text-emerald-900 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1 animate-bounce">
            ✨ <span>Món xong rồi nè!</span>
          </span>
        )}
        {action === 'happy' && (
          <span className="bg-rose-100 border border-rose-300 text-rose-900 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1 animate-bounce">
            💖 <span>Cảm ơn bạn nha!</span>
          </span>
        )}
        {action === 'idle' && (
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 border border-amber-300 text-amber-950 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs whitespace-nowrap">
            👋 Chào bạn, ghé tiệm nhé!
          </span>
        )}
      </div>

      {/* SVG CHIBI 2D VẼ TAY CHI TIẾT THEO TỪNG SKIN */}
      <div className="w-16 h-20 md:w-20 md:h-24 relative flex items-center justify-center">
        {/* ================= SKIN 1: BẢO AN (CÔ CHỦ NHỎ ÁO YẾM HOA CÚC) ================= */}
        {skin === 'bao_an' && (
          <svg viewBox="0 0 80 96" fill="none" className="w-full h-full drop-shadow-md">
            {/* Bóng đổ chân */}
            <ellipse cx="40" cy="92" rx="18" ry="4" fill="#000000" opacity="0.15" />

            {/* Búi tóc 2 bên thắt nơ vàng */}
            <circle cx="20" cy="30" r="9" fill="#2E1C14" />
            <circle cx="60" cy="30" r="9" fill="#2E1C14" />
            <circle cx="20" cy="34" r="3.5" fill="#F59E0B" />
            <circle cx="60" cy="34" r="3.5" fill="#F59E0B" />

            {/* Tóc sau */}
            <path d="M 22 36 C 22 18 58 18 58 36 Z" fill="#2E1C14" />

            {/* Thân & Áo yếm vàng hoa cúc */}
            <path d="M 26 56 C 26 50 54 50 54 56 L 57 88 C 57 91 23 91 23 88 Z" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />
            {/* Tạp dề trắng ren */}
            <path d="M 29 60 L 51 60 L 49 84 L 31 84 Z" fill="#FFFFFF" opacity="0.9" stroke="#E2E8F0" strokeWidth="1" />
            {/* Bông hoa cúc nhỏ trên tạp dề */}
            <circle cx="40" cy="70" r="3" fill="#F59E0B" />
            <circle cx="40" cy="70" r="1.5" fill="#FFFFFF" />

            {/* Cổ áo & Khăn quàng kem */}
            <path d="M 32 52 L 48 52 L 44 60 L 36 60 Z" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1" />

            {/* Cánh tay trái & phải theo trạng thái */}
            {action === 'cooking' ? (
              <>
                {/* Tay cầm vá đảo đều */}
                <path d="M 26 58 Q 20 68 34 72" stroke="#FCD34D" strokeWidth="5" strokeLinecap="round" />
                <path d="M 54 58 Q 60 68 46 72" stroke="#FCD34D" strokeWidth="5" strokeLinecap="round" />
                <line x1="38" y1="68" x2="48" y2="78" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
                <ellipse cx="49" cy="79" rx="3.5" ry="2" fill="#D97706" />
              </>
            ) : action === 'serving' ? (
              <>
                {/* Hai tay bưng khay món */}
                <path d="M 25 58 Q 28 72 38 72" stroke="#FCD34D" strokeWidth="5" strokeLinecap="round" />
                <path d="M 55 58 Q 52 72 42 72" stroke="#FCD34D" strokeWidth="5" strokeLinecap="round" />
                {/* Khay inox nhỏ */}
                <rect x="30" y="68" width="20" height="3" rx="1.5" fill="#E2E8F0" stroke="#64748B" strokeWidth="1" />
                <circle cx="40" cy="65" r="3.5" fill="#F59E0B" />
              </>
            ) : action === 'happy' ? (
              <>
                {/* Hai tay giơ lên trời ăn mừng */}
                <path d="M 25 56 Q 16 46 18 38" stroke="#FCD34D" strokeWidth="5" strokeLinecap="round" />
                <path d="M 55 56 Q 64 46 62 38" stroke="#FCD34D" strokeWidth="5" strokeLinecap="round" />
              </>
            ) : (
              <>
                {/* Tay chắp trước bụng nhẹ nhàng */}
                <path d="M 26 56 Q 24 68 36 70" stroke="#FCD34D" strokeWidth="5" strokeLinecap="round" />
                <path d="M 54 56 Q 56 68 44 70" stroke="#FCD34D" strokeWidth="5" strokeLinecap="round" />
              </>
            )}

            {/* Đầu & Khuôn mặt tròn trịa dễ thương */}
            <circle cx="40" cy="38" r="16" fill="#FDE68A" />

            {/* Tóc mái bằng búp bê */}
            <path d="M 24 34 C 24 22 56 22 56 34 C 48 28 32 28 24 34 Z" fill="#2E1C14" />

            {/* Má hồng hào tươi tắn */}
            <circle cx="31" cy="42" r="3" fill="#FDA4AF" opacity="0.8" />
            <circle cx="49" cy="42" r="3" fill="#FDA4AF" opacity="0.8" />

            {/* Mắt to tròn có đốm sáng lung linh */}
            {action === 'happy' ? (
              <>
                <path d="M 31 38 Q 34 34 37 38" stroke="#1E1B18" strokeWidth="2" strokeLinecap="round" />
                <path d="M 43 38 Q 46 34 49 38" stroke="#1E1B18" strokeWidth="2" strokeLinecap="round" />
              </>
            ) : (
              <>
                <circle cx="34" cy="37" r="2.8" fill="#1E1B18" />
                <circle cx="46" cy="37" r="2.8" fill="#1E1B18" />
                <circle cx="35" cy="36" r="1" fill="#FFFFFF" />
                <circle cx="47" cy="36" r="1" fill="#FFFFFF" />
              </>
            )}

            {/* Miệng cười xinh xắn */}
            <path d="M 37 43 Q 40 46 43 43" stroke="#9A3412" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        )}

        {/* ================= SKIN 2: QUANG MINH (ANH CHỦ QUÁN TẠP DÈ XANH) ================= */}
        {skin === 'quang_minh' && (
          <svg viewBox="0 0 80 96" fill="none" className="w-full h-full drop-shadow-md">
            <ellipse cx="40" cy="92" rx="18" ry="4" fill="#000000" opacity="0.15" />

            {/* Tóc nam ngắn rẽ ngôi */}
            <path d="M 22 36 C 22 18 58 18 58 36 Q 44 24 22 36 Z" fill="#18181B" />

            {/* Thân & Áo sơ mi cộc tay trắng + Tạp dề xanh lá */}
            <path d="M 25 54 C 25 48 55 48 55 54 L 58 88 C 58 91 22 91 22 88 Z" fill="#15803D" stroke="#14532D" strokeWidth="1.5" />
            <path d="M 30 54 L 50 54 L 48 85 L 32 85 Z" fill="#16A34A" />

            {/* Khăn bandana buộc trán thể thao */}
            <path d="M 24 28 C 30 25 50 25 56 28 L 56 32 C 50 29 30 29 24 32 Z" fill="#DC2626" />
            <circle cx="40" cy="30" r="1.5" fill="#FFFFFF" />

            {/* Tay thao tác */}
            {action === 'cooking' ? (
              <>
                <path d="M 24 56 Q 18 66 32 70" stroke="#FCD34D" strokeWidth="5.5" strokeLinecap="round" />
                <path d="M 56 56 Q 62 66 48 70" stroke="#FCD34D" strokeWidth="5.5" strokeLinecap="round" />
                <line x1="36" y1="66" x2="46" y2="76" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
              </>
            ) : action === 'serving' ? (
              <>
                <path d="M 24 56 Q 28 72 38 72" stroke="#FCD34D" strokeWidth="5.5" strokeLinecap="round" />
                <path d="M 56 56 Q 52 72 42 72" stroke="#FCD34D" strokeWidth="5.5" strokeLinecap="round" />
                <rect x="30" y="68" width="20" height="3" rx="1.5" fill="#CBD5E1" stroke="#475569" strokeWidth="1" />
              </>
            ) : action === 'happy' ? (
              <>
                <path d="M 24 54 Q 14 42 16 34" stroke="#FCD34D" strokeWidth="5.5" strokeLinecap="round" />
                <path d="M 56 54 Q 66 42 64 34" stroke="#FCD34D" strokeWidth="5.5" strokeLinecap="round" />
              </>
            ) : (
              <>
                <path d="M 24 56 Q 22 68 35 68" stroke="#FCD34D" strokeWidth="5.5" strokeLinecap="round" />
                <path d="M 56 56 Q 58 68 45 68" stroke="#FCD34D" strokeWidth="5.5" strokeLinecap="round" />
              </>
            )}

            {/* Đầu & Khuôn mặt tự tin */}
            <circle cx="40" cy="38" r="16" fill="#FCD34D" />

            {/* Má ửng nhẹ */}
            <circle cx="30" cy="42" r="2.5" fill="#FB923C" opacity="0.6" />
            <circle cx="50" cy="42" r="2.5" fill="#FB923C" opacity="0.6" />

            {/* Mắt & Lông mày quyết đoán */}
            <line x1="31" y1="33" x2="36" y2="34" stroke="#18181B" strokeWidth="1.8" />
            <line x1="44" y1="34" x2="49" y2="33" stroke="#18181B" strokeWidth="1.8" />
            <circle cx="34" cy="38" r="2.8" fill="#18181B" />
            <circle cx="46" cy="38" r="2.8" fill="#18181B" />
            <circle cx="35" cy="37" r="1" fill="#FFFFFF" />
            <circle cx="47" cy="37" r="1" fill="#FFFFFF" />

            {/* Nụ cười tươi rạng rỡ */}
            <path d="M 36 43 Q 40 48 44 43" stroke="#713F12" strokeWidth="2" strokeLinecap="round" fill="#FFFFFF" />
          </svg>
        )}

        {/* ================= SKIN 3: MINH THƯ (BẠN HỌC SINH MŨ BERET CÀ PHÊ) ================= */}
        {skin === 'minh_thu' && (
          <svg viewBox="0 0 80 96" fill="none" className="w-full h-full drop-shadow-md">
            <ellipse cx="40" cy="92" rx="18" ry="4" fill="#000000" opacity="0.15" />

            {/* Tóc dài nâu hạt dẻ */}
            <path d="M 20 40 C 20 20 60 20 60 40 L 62 65 Q 40 68 18 65 Z" fill="#451A03" />

            {/* Mũ beret phong cách quán cà phê */}
            <path d="M 22 26 C 22 14 58 14 58 26 C 62 28 60 32 54 30 C 44 26 26 26 22 30 Z" fill="#78350F" />
            <circle cx="40" cy="16" r="2.5" fill="#92400E" />

            {/* Áo đồng phục trắng cổ bèo thắt nơ đỏ */}
            <path d="M 26 56 C 26 50 54 50 54 56 L 56 88 C 56 91 24 91 24 88 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            {/* Tạp dề nâu cà phê */}
            <path d="M 29 60 L 51 60 L 49 86 L 31 86 Z" fill="#78350F" />
            {/* Nơ bướm đỏ xinh */}
            <polygon points="37,56 43,56 40,59" fill="#DC2626" />

            {/* Tay tương tác */}
            {action === 'cooking' ? (
              <>
                <path d="M 26 58 Q 20 68 34 72" stroke="#FDE68A" strokeWidth="5" strokeLinecap="round" />
                <path d="M 54 58 Q 60 68 46 72" stroke="#FDE68A" strokeWidth="5" strokeLinecap="round" />
                <rect x="36" y="68" width="8" height="12" rx="2" fill="#E2E8F0" stroke="#475569" strokeWidth="1" />
              </>
            ) : action === 'serving' ? (
              <>
                <path d="M 25 58 Q 28 72 38 72" stroke="#FDE68A" strokeWidth="5" strokeLinecap="round" />
                <path d="M 55 58 Q 52 72 42 72" stroke="#FDE68A" strokeWidth="5" strokeLinecap="round" />
                <rect x="30" y="68" width="20" height="3" rx="1.5" fill="#FEF3C7" stroke="#D97706" strokeWidth="1" />
              </>
            ) : action === 'happy' ? (
              <>
                <path d="M 25 56 Q 16 46 18 38" stroke="#FDE68A" strokeWidth="5" strokeLinecap="round" />
                <path d="M 55 56 Q 64 46 62 38" stroke="#FDE68A" strokeWidth="5" strokeLinecap="round" />
              </>
            ) : (
              <>
                <path d="M 26 56 Q 24 68 36 70" stroke="#FDE68A" strokeWidth="5" strokeLinecap="round" />
                <path d="M 54 56 Q 56 68 44 70" stroke="#FDE68A" strokeWidth="5" strokeLinecap="round" />
              </>
            )}

            {/* Đầu & Khuôn mặt xinh xắn */}
            <circle cx="40" cy="38" r="16" fill="#FEF08A" />

            {/* Má hồng đào */}
            <circle cx="31" cy="42" r="3" fill="#F472B6" opacity="0.8" />
            <circle cx="49" cy="42" r="3" fill="#F472B6" opacity="0.8" />

            {/* Mắt to long lanh */}
            <circle cx="34" cy="37" r="2.8" fill="#1C1917" />
            <circle cx="46" cy="37" r="2.8" fill="#1C1917" />
            <circle cx="35" cy="36" r="1" fill="#FFFFFF" />
            <circle cx="47" cy="36" r="1" fill="#FFFFFF" />

            {/* Miệng mỉm cười dịu dàng */}
            <path d="M 37 43 Q 40 46 43 43" stroke="#831843" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        )}
      </div>

      {/* Tên nhân vật hiển thị nhẹ nhàng */}
      <div className="bg-amber-950/80 text-white text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-400/40 shadow-xs -mt-1 group-hover:bg-orange-600 transition-colors">
        {skin === 'bao_an' ? 'Bảo An' : skin === 'quang_minh' ? 'Quang Minh' : 'Minh Thư'}
      </div>
    </div>
  );
};
