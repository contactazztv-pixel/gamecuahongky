import React, { useState } from 'react';
import { getCharacterImageUrl } from '@/data/assetManifest';

interface CharacterAvatarProps {
  characterId: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  mood?: 'happy' | 'neutral' | 'impatient';
  className?: string;
  fallbackEmoji?: string;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  characterId,
  size = 'md',
  mood = 'neutral',
  className = '',
  fallbackEmoji = '👦',
}) => {
  const [imgError, setImgError] = useState(false);
  const realImgUrl = getCharacterImageUrl(characterId);

  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const dim = sizeMap[size] || sizeMap.md;

  // Render SVG chân dung hoạt hình 2D độc quyền
  const renderAvatarContent = () => {
    switch (characterId) {
      // 1. Bé An - Khăn quàng đỏ lớp 6
      case 'student_an_grade6':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <circle cx="32" cy="32" r="30" fill="#FEF3C7" />
            {/* Tóc mái bằng đen */}
            <path d="M 18 24 C 18 12 46 12 46 24 C 40 20 24 20 18 24 Z" fill="#1E293B" />
            {/* Khuôn mặt tròn */}
            <circle cx="32" cy="30" r="14" fill="#FDE68A" />
            {/* Má hồng baby */}
            <circle cx="24" cy="34" r="3" fill="#FCA5A5" opacity="0.7" />
            <circle cx="40" cy="34" r="3" fill="#FCA5A5" opacity="0.7" />
            {/* Mắt to tròn long lanh */}
            <circle cx="27" cy="28" r="2.5" fill="#0F172A" />
            <circle cx="37" cy="28" r="2.5" fill="#0F172A" />
            <circle cx="28" cy="27" r="0.8" fill="#FFFFFF" />
            <circle cx="38" cy="27" r="0.8" fill="#FFFFFF" />
            {/* Miệng cười tươi */}
            <path d="M 29 35 Q 32 38 35 35" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
            {/* Áo trắng đồng phục */}
            <path d="M 16 58 C 16 46 48 46 48 58 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            {/* Khăn quàng đỏ phấp phới */}
            <polygon points="26,46 38,46 32,58" fill="#DC2626" />
          </svg>
        );

      // 2. Hoàng Nam - Học sinh cuối cấp
      case 'student_nam_senior':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <circle cx="32" cy="32" r="30" fill="#E0F2FE" />
            {/* Tóc rẽ ngôi hiện đại */}
            <path d="M 18 22 C 22 10 46 10 46 24 Q 34 16 18 22 Z" fill="#0F172A" />
            <circle cx="32" cy="30" r="14" fill="#FCD34D" />
            {/* Mắt & Lông mày quyết tâm */}
            <line x1="24" y1="24" x2="29" y2="25" stroke="#1E293B" strokeWidth="1.5" />
            <line x1="35" y1="25" x2="40" y2="24" stroke="#1E293B" strokeWidth="1.5" />
            {/* Kính cận thông thái */}
            <rect x="23" y="26" width="7" height="6" rx="2" stroke="#0284C7" strokeWidth="1.8" fill="none" />
            <rect x="34" y="26" width="7" height="6" rx="2" stroke="#0284C7" strokeWidth="1.8" fill="none" />
            <line x1="30" y1="29" x2="34" y2="29" stroke="#0284C7" strokeWidth="1.8" />
            {/* Miệng mỉm cười tự tin */}
            <path d="M 29 36 Q 32 38 35 36" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
            {/* Áo sơ mi & cà vạt xanh */}
            <path d="M 16 58 C 16 46 48 46 48 58 Z" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5" />
            <polygon points="30,46 34,46 33,56 31,56" fill="#0284C7" />
          </svg>
        );

      // 3. Mai & Linh - Cặp bạn thân mê quà vặt
      case 'student_mai_linh_duo':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <circle cx="32" cy="32" r="30" fill="#FCE7F3" />
            {/* Tóc 2 bên thắt nơ hồng */}
            <circle cx="16" cy="22" r="5" fill="#DB2777" />
            <circle cx="48" cy="22" r="5" fill="#DB2777" />
            <path d="M 16 26 C 16 10 48 10 48 26 Z" fill="#3B0764" />
            <circle cx="32" cy="31" r="14" fill="#FDE68A" />
            {/* Kẹp tóc hoa anh đào */}
            <circle cx="22" cy="20" r="3" fill="#F472B6" />
            <circle cx="22" cy="20" r="1" fill="#FEF08A" />
            {/* Mắt cười tít đáng yêu */}
            <path d="M 25 28 Q 28 25 31 28" stroke="#0F172A" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 33 28 Q 36 25 39 28" stroke="#0F172A" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* Má hồng đào */}
            <circle cx="24" cy="33" r="3" fill="#FB7185" opacity="0.8" />
            <circle cx="40" cy="33" r="3" fill="#FB7185" opacity="0.8" />
            <path d="M 29 35 Q 32 39 35 35" stroke="#BE185D" strokeWidth="2" strokeLinecap="round" />
            <path d="M 16 58 C 16 46 48 46 48 58 Z" fill="#FDF2F8" stroke="#F472B6" strokeWidth="1.5" />
          </svg>
        );

      // 4. Thầy Nghĩa - Thầy giáo giám thị
      case 'teacher_nghia':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <circle cx="32" cy="32" r="30" fill="#EDE9FE" />
            {/* Mái tóc hoa râm từng trải */}
            <path d="M 18 20 C 18 10 46 10 46 20 Z" fill="#64748B" />
            <circle cx="32" cy="32" r="14" fill="#FCD34D" />
            {/* Kính gọng đồi mồi */}
            <rect x="23" y="27" width="8" height="6" rx="1.5" stroke="#78350F" strokeWidth="1.8" fill="none" />
            <rect x="33" y="27" width="8" height="6" rx="1.5" stroke="#78350F" strokeWidth="1.8" fill="none" />
            <line x1="31" y1="30" x2="33" y2="30" stroke="#78350F" strokeWidth="1.8" />
            <circle cx="27" cy="30" r="1.5" fill="#1E293B" />
            <circle cx="37" cy="30" r="1.5" fill="#1E293B" />
            {/* Nụ cười hiền hậu của thầy */}
            <path d="M 29 38 Q 32 40 35 38" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
            {/* Áo sơ mi trắng chỉnh chu */}
            <path d="M 16 58 C 16 46 48 46 48 58 Z" fill="#FFFFFF" stroke="#64748B" strokeWidth="2" />
            <polygon points="31,46 33,46 32,56" fill="#7C3AED" />
          </svg>
        );

      // 5. Cô Lan - Phụ huynh học sinh
      case 'parent_co_lan':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <circle cx="32" cy="32" r="30" fill="#FEF3C7" />
            {/* Nón bảo hiểm xe máy hồng */}
            <path d="M 16 26 C 16 12 48 12 48 26 Z" fill="#F43F5E" stroke="#9F1239" strokeWidth="2" />
            <circle cx="32" cy="18" r="3" fill="#FFF1F2" />
            {/* Khuôn mặt người mẹ hiền từ */}
            <circle cx="32" cy="33" r="13" fill="#FDE68A" />
            {/* Mắt cười dịu dàng */}
            <path d="M 25 31 Q 28 29 31 31" stroke="#451A03" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M 33 31 Q 36 29 39 31" stroke="#451A03" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M 29 38 Q 32 41 35 38" stroke="#E11D48" strokeWidth="1.8" strokeLinecap="round" />
            {/* Quai nón bảo hiểm */}
            <path d="M 19 26 Q 20 38 27 42" stroke="#475569" strokeWidth="1.5" fill="none" />
            {/* Áo chống nắng hoa nhí */}
            <path d="M 16 58 C 16 46 48 46 48 58 Z" fill="#FCE7F3" stroke="#DB2777" strokeWidth="1.5" />
          </svg>
        );

      // 6. Bác Tư - Bác bảo vệ trường
      case 'neighbor_bac_tu':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <circle cx="32" cy="32" r="30" fill="#E2E8F0" />
            {/* Mũ Kê-pi bảo vệ xanh đậm */}
            <path d="M 16 22 C 16 14 48 14 48 22 Z" fill="#1E3A8A" stroke="#172554" strokeWidth="2" />
            <ellipse cx="32" cy="22" rx="18" ry="3" fill="#0F172A" />
            <circle cx="32" cy="18" r="2.5" fill="#EAB308" />
            {/* Mặt bác với ria mép hiền */}
            <circle cx="32" cy="34" r="13" fill="#FCD34D" />
            <circle cx="27" cy="31" r="1.5" fill="#0F172A" />
            <circle cx="37" cy="31" r="1.5" fill="#0F172A" />
            {/* Ria mép muối tiêu */}
            <path d="M 27 38 Q 32 36 37 38" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 30 41 Q 32 42 34 41" stroke="#78350F" strokeWidth="1.5" />
            {/* Áo bảo vệ xanh da trời & cầu vai */}
            <path d="M 16 58 C 16 46 48 46 48 58 Z" fill="#0284C7" stroke="#0369A1" strokeWidth="2" />
            <rect x="20" y="47" width="5" height="3" fill="#EAB308" />
            <rect x="39" y="47" width="5" height="3" fill="#EAB308" />
          </svg>
        );

      // 7. Minh "Bóng Rổ"
      case 'student_minh_sport':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <circle cx="32" cy="32" r="30" fill="#FFEDD5" />
            {/* Băng đô thể thao đỏ */}
            <path d="M 18 20 C 18 10 46 10 46 20 Z" fill="#1C1917" />
            <rect x="18" y="18" width="28" height="5" rx="1.5" fill="#EF4444" />
            <circle cx="32" cy="32" r="13.5" fill="#FDBA74" />
            <circle cx="26" cy="30" r="2" fill="#0F172A" />
            <circle cx="38" cy="30" r="2" fill="#0F172A" />
            {/* Miệng cười sảng khoái */}
            <path d="M 28 36 Q 32 41 36 36" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />
            {/* Áo thể thao ba lỗ */}
            <path d="M 18 58 C 18 46 46 46 46 58 Z" fill="#EA580C" stroke="#9A3412" strokeWidth="2" />
            <text x="29" y="55" fontSize="7" fontWeight="bold" fill="#FFFFFF">7</text>
          </svg>
        );

      // 8. Vy "Họa Sĩ"
      case 'student_vy_art':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <circle cx="32" cy="32" r="30" fill="#CCFBF1" />
            {/* Tóc bím 2 bên & cọ vẽ */}
            <path d="M 18 22 C 18 10 46 10 46 22 Z" fill="#451A03" />
            <line x1="42" y1="12" x2="48" y2="24" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
            <circle cx="43" cy="14" r="2" fill="#EF4444" />
            <circle cx="32" cy="32" r="13" fill="#FDE68A" />
            {/* Mắt to mộng mơ */}
            <ellipse cx="26" cy="30" rx="2" ry="3" fill="#1E293B" />
            <ellipse cx="38" cy="30" rx="2" ry="3" fill="#1E293B" />
            <circle cx="27" cy="29" r="0.8" fill="#FFFFFF" />
            <circle cx="39" cy="29" r="0.8" fill="#FFFFFF" />
            <path d="M 30 37 Q 32 39 34 37" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 16 58 C 16 46 48 46 48 58 Z" fill="#0D9488" stroke="#115E59" strokeWidth="1.5" />
          </svg>
        );

      // 9. Cô Thảo - Giáo viên tiếng Anh
      case 'teacher_thao_english':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <circle cx="32" cy="32" r="30" fill="#FEE2E2" />
            {/* Mái tóc dài xoăn bồng bềnh */}
            <path d="M 16 26 C 16 10 48 10 48 26 C 50 38 46 44 46 48 C 42 36 22 36 18 48 Z" fill="#713F12" />
            <circle cx="32" cy="30" r="13" fill="#FDE68A" />
            {/* Lông mày thanh tú & mắt biếc */}
            <path d="M 24 25 Q 28 23 30 25" stroke="#713F12" strokeWidth="1.5" fill="none" />
            <path d="M 34 25 Q 36 23 40 25" stroke="#713F12" strokeWidth="1.5" fill="none" />
            <circle cx="27" cy="29" r="2" fill="#0F172A" />
            <circle cx="37" cy="29" r="2" fill="#0F172A" />
            {/* Nụ cười tươi tắn son hồng */}
            <path d="M 29 36 Q 32 39 35 36" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" />
            {/* Áo dài hồng pastel hoa sen */}
            <path d="M 16 58 C 16 46 48 46 48 58 Z" fill="#F472B6" stroke="#DB2777" strokeWidth="1.5" />
          </svg>
        );

      // 10. Khoa - Đội tuyển Tin học
      case 'student_khoa_nerd':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <circle cx="32" cy="32" r="30" fill="#E0E7FF" />
            {/* Tóc xù công nghệ */}
            <path d="M 18 20 C 18 10 46 10 46 20 Z" fill="#1E293B" />
            <circle cx="32" cy="32" r="13" fill="#FCD34D" />
            {/* Kính cận dày cộp đặc trưng */}
            <circle cx="26" cy="30" r="5" stroke="#4338CA" strokeWidth="2.5" fill="none" />
            <circle cx="38" cy="30" r="5" stroke="#4338CA" strokeWidth="2.5" fill="none" />
            <line x1="31" y1="30" x2="33" y2="30" stroke="#4338CA" strokeWidth="2.5" />
            <circle cx="26" cy="30" r="1.5" fill="#0F172A" />
            <circle cx="38" cy="30" r="1.5" fill="#0F172A" />
            <line x1="30" y1="38" x2="34" y2="38" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" />
            {/* Áo hoodie xám */}
            <path d="M 16 58 C 16 46 48 46 48 58 Z" fill="#4F46E5" stroke="#3730A3" strokeWidth="2" />
          </svg>
        );

      // 11. Anh Ba - Shipper công nghệ
      case 'shipper_anh_ba':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <circle cx="32" cy="32" r="30" fill="#DCFCE7" />
            {/* Nón bảo hiểm xanh lá công nghệ */}
            <path d="M 16 26 C 16 12 48 12 48 26 Z" fill="#16A34A" stroke="#14532D" strokeWidth="2" />
            <ellipse cx="32" cy="26" rx="18" ry="3" fill="#15803D" />
            <circle cx="32" cy="34" r="13" fill="#FCD34D" />
            <circle cx="27" cy="31" r="2" fill="#0F172A" />
            <circle cx="37" cy="31" r="2" fill="#0F172A" />
            <path d="M 28 38 Q 32 41 36 38" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
            {/* Áo khoác xanh giao hàng */}
            <path d="M 16 58 C 16 46 48 46 48 58 Z" fill="#15803D" stroke="#166534" strokeWidth="2" />
            <line x1="24" y1="48" x2="40" y2="48" stroke="#FEF08A" strokeWidth="2" />
          </svg>
        );

      // 12. Nhóm nhảy K-Pop
      case 'student_nhom_nhay':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <circle cx="32" cy="32" r="30" fill="#FAF5FF" />
            {/* Tóc highlight tím cá tính */}
            <path d="M 18 20 C 18 10 46 10 46 20 Z" fill="#9333EA" />
            <path d="M 18 26 L 16 38" stroke="#C084FC" strokeWidth="3" strokeLinecap="round" />
            <circle cx="32" cy="31" r="13" fill="#FDE68A" />
            {/* Nháy mắt cá tính */}
            <path d="M 24 29 Q 27 27 30 29" stroke="#581C87" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="37" cy="29" r="2.5" fill="#581C87" />
            <circle cx="38" cy="28" r="0.8" fill="#FFFFFF" />
            <path d="M 29 36 Q 32 39 35 36" stroke="#9333EA" strokeWidth="2" strokeLinecap="round" />
            {/* Áo croptop tím sành điệu */}
            <path d="M 16 58 C 16 46 48 46 48 58 Z" fill="#7E22CE" stroke="#581C87" strokeWidth="2" />
          </svg>
        );

      default:
        return (
          <div className="w-full h-full flex items-center justify-center text-xl">
            {fallbackEmoji}
          </div>
        );
    }
  };

  const moodStyles = {
    happy: 'ring-2 ring-emerald-500 shadow-emerald-200',
    impatient: 'ring-2 ring-rose-500 animate-pulse',
    neutral: 'border-amber-900/20',
  }[mood];

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-2xl bg-white/95 border-2 shadow-inner overflow-hidden flex-shrink-0 ${dim} ${moodStyles} ${className}`}
      title={`${characterId} (${mood})`}
    >
      {realImgUrl && !imgError ? (
        <img
          src={realImgUrl}
          alt={characterId}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover select-none"
          loading="lazy"
        />
      ) : (
        renderAvatarContent()
      )}

      {/* Biểu cảm nổi góc avatar */}
      {mood === 'happy' && (
        <span className="absolute -top-1 -right-1 text-[11px] drop-shadow-sm pointer-events-none animate-bounce-gentle">
          ✨
        </span>
      )}
      {mood === 'impatient' && (
        <span className="absolute -top-1 -right-1 text-[11px] drop-shadow-sm pointer-events-none animate-pulse">
          💧
        </span>
      )}
    </div>
  );
};
