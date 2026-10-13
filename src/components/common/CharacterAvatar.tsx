import React, { useState } from 'react';
import { getCharacterImageUrl } from '@/data/assetManifest';

interface CharacterAvatarProps {
  characterId: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  mood?: 'happy' | 'neutral' | 'impatient';
  className?: string;
  fallbackEmoji?: string;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = React.memo(({
  characterId,
  size = 'md',
  mood = 'neutral',
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  // Tìm template ID chuẩn xác kể cả khi truyền full unique ID (ví dụ: student_vy_art_17288829_abc)
  const resolveTemplateId = (id: string): string => {
    if (!id) return '';
    const knownIds = [
      'student_an_grade6',
      'student_nam_senior',
      'student_nam_grade11',
      'student_mai_linh_duo',
      'duo_mai_linh_grade12',
      'teacher_nghia_physics',
      'teacher_nghia',
      'parent_co_lan',
      'neighbor_bac_tu',
      'security_bac_tu',
      'student_minh_sport',
      'athlete_minh_basketball',
      'student_vy_art',
      'teacher_thao_english',
      'teacher_lan_literature',
      'student_khoa_nerd',
      'shipper_anh_ba',
      'student_nhom_nhay',
    ];
    for (const k of knownIds) {
      if (id === k || id.startsWith(k + '_')) {
        return k;
      }
    }
    return id;
  };

  const effectiveId = resolveTemplateId(characterId);
  const realImgUrl = getCharacterImageUrl(effectiveId);

  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const dim = sizeMap[size] || sizeMap.md;

  // Render Chân dung Chibi Anime 2D vẽ tay độc quyền với tone da tự nhiên, tóc nhiều tầng, mắt long lanh
  const renderAvatarContent = () => {
    switch (effectiveId) {
      // 1. Bé An (Lớp 6A) - Khăn quàng đỏ hồn nhiên
      case 'student_an_grade6':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <circle cx="32" cy="32" r="30" fill="#FEF9C3" />
            {/* Tóc sau */}
            <ellipse cx="32" cy="32" rx="19" ry="17" fill="#261A14" />
            {/* Cổ & Tai */}
            <path d="M 28 42 L 36 42 L 35 48 L 29 48 Z" fill="#F8C8BA" />
            <circle cx="15" cy="33" r="3.5" fill="#FFE5D9" />
            <circle cx="49" cy="33" r="3.5" fill="#FFE5D9" />
            {/* Gương mặt Chibi da tự nhiên */}
            <path d="M 17 28 C 17 44 23 48 32 48 C 41 48 47 44 47 28 C 47 18 41 18 32 18 C 23 18 17 18 17 28 Z" fill="#FFE5D9" />
            {/* Má hồng hào */}
            <circle cx="22" cy="38" r="3.5" fill="#FDA4AF" opacity="0.65" />
            <circle cx="42" cy="38" r="3.5" fill="#FDA4AF" opacity="0.65" />
            {/* Mái bằng búp bê tỉ mỉ */}
            <path d="M 16 26 C 20 18 44 18 48 26 C 45 23 37 25 32 25 C 27 25 19 23 16 26 Z" fill="#3D291E" />
            <path d="M 17 26 C 18 34 21 34 23 26" fill="#3D291E" />
            <path d="M 47 26 C 46 34 43 34 41 26" fill="#3D291E" />
            {/* Ánh sáng tóc */}
            <path d="M 23 20 Q 32 17 41 20" stroke="#8D6E63" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            {/* Mắt to tròn long lanh */}
            <path d="M 21 31 Q 25 28 28 31" stroke="#261A14" strokeWidth="2" strokeLinecap="round" />
            <path d="M 36 31 Q 39 28 43 31" stroke="#261A14" strokeWidth="2" strokeLinecap="round" />
            <ellipse cx="25" cy="34" rx="2.8" ry="3.5" fill="#3E2723" />
            <ellipse cx="39" cy="34" rx="2.8" ry="3.5" fill="#3E2723" />
            <circle cx="24" cy="32.5" r="1.3" fill="#FFFFFF" />
            <circle cx="38" cy="32.5" r="1.3" fill="#FFFFFF" />
            <circle cx="26.5" cy="35.5" r="0.7" fill="#FFFFFF" />
            <circle cx="40.5" cy="35.5" r="0.7" fill="#FFFFFF" />
            {/* Miệng cười chúm chím */}
            <path d="M 29 42 Q 32 45 35 42" stroke="#BE123C" strokeWidth="1.6" strokeLinecap="round" />
            {/* Cổ áo đồng phục & Khăn quàng đỏ */}
            <path d="M 18 58 C 18 47 46 47 46 58 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            <polygon points="26,48 38,48 32,58" fill="#DC2626" />
            <circle cx="32" cy="49" r="1.5" fill="#B91C1C" />
          </svg>
        );

      // 2. Hoàng Nam (Lớp 12 Tin) - Nam sinh kính cận rẽ ngôi
      case 'student_nam_senior':
      case 'student_nam_grade11':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <circle cx="32" cy="32" r="30" fill="#E0F2FE" />
            {/* Tóc sau */}
            <ellipse cx="32" cy="30" rx="19" ry="17" fill="#0F172A" />
            {/* Cổ & Tai */}
            <path d="M 28 42 L 36 42 L 35 48 L 29 48 Z" fill="#F8C8BA" />
            <circle cx="15" cy="33" r="3.5" fill="#FFE5D9" />
            <circle cx="49" cy="33" r="3.5" fill="#FFE5D9" />
            {/* Khuôn mặt thanh tú */}
            <path d="M 17 28 C 17 44 24 49 32 49 C 40 49 47 44 47 28 C 47 19 40 19 32 19 C 24 19 17 19 17 28 Z" fill="#FFE5D9" />
            {/* Má ửng nhẹ */}
            <circle cx="22" cy="39" r="3" fill="#FDA4AF" opacity="0.4" />
            <circle cx="42" cy="39" r="3" fill="#FDA4AF" opacity="0.4" />
            {/* Mái tóc rẽ ngôi 7/3 thời trang */}
            <path d="M 15 26 C 18 16 33 16 33 24 C 33 16 48 16 49 26 C 44 20 35 21 32 23 C 28 20 20 20 15 26 Z" fill="#1E293B" />
            <path d="M 18 25 C 22 17 32 18 34 26 L 31 27 Z" fill="#334155" />
            {/* Kính cận gọng xanh navy phản chiếu */}
            <rect x="18" y="29" width="11" height="8" rx="2.5" stroke="#0284C7" strokeWidth="1.8" fill="#FFFFFF" fillOpacity="0.2" />
            <rect x="35" y="29" width="11" height="8" rx="2.5" stroke="#0284C7" strokeWidth="1.8" fill="#FFFFFF" fillOpacity="0.2" />
            <line x1="29" y1="33" x2="35" y2="33" stroke="#0284C7" strokeWidth="1.8" />
            {/* Mắt thông minh đằng sau kính */}
            <circle cx="24" cy="33" r="2.2" fill="#0F172A" />
            <circle cx="40" cy="33" r="2.2" fill="#0F172A" />
            <circle cx="23.3" cy="32.2" r="0.9" fill="#FFFFFF" />
            <circle cx="39.3" cy="32.2" r="0.9" fill="#FFFFFF" />
            {/* Nụ cười mỉm tự tin */}
            <path d="M 29 42 Q 32 44 35 42" stroke="#9A3412" strokeWidth="1.5" strokeLinecap="round" />
            {/* Áo sơ mi & Cà vạt xanh */}
            <path d="M 17 58 C 17 48 47 48 47 58 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            <polygon points="30,47 34,47 33,58 31,58" fill="#0284C7" />
          </svg>
        );

      // 3. Hội Mai & Linh (Lớp 9B) - Twintails nơ hoa đào
      case 'student_mai_linh_duo':
      case 'duo_mai_linh_grade12':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <circle cx="32" cy="32" r="30" fill="#FCE7F3" />
            {/* Hai bím tóc buộc nơ hồng 2 bên */}
            <circle cx="12" cy="32" r="7" fill="#4A2810" />
            <circle cx="52" cy="32" r="7" fill="#4A2810" />
            <path d="M 12 34 Q 8 46 12 50" stroke="#4A2810" strokeWidth="5" strokeLinecap="round" />
            <path d="M 52 34 Q 56 46 52 50" stroke="#4A2810" strokeWidth="5" strokeLinecap="round" />
            <circle cx="14" cy="31" r="3" fill="#F472B6" />
            <circle cx="50" cy="31" r="3" fill="#F472B6" />
            {/* Gương mặt Chibi trắng hồng */}
            <path d="M 18 28 C 18 44 24 48 32 48 C 40 48 46 44 46 28 C 46 18 40 18 32 18 C 24 18 18 18 18 28 Z" fill="#FFF0E6" />
            {/* Má hồng đào cực xinh */}
            <circle cx="23" cy="38" r="3.5" fill="#FB7185" opacity="0.75" />
            <circle cx="41" cy="38" r="3.5" fill="#FB7185" opacity="0.75" />
            {/* Tóc mái thắt nơ & Kẹp hoa đào */}
            <path d="M 17 26 C 21 16 43 16 47 26 C 41 22 36 24 32 24 C 28 24 23 22 17 26 Z" fill="#5D3818" />
            <circle cx="21" cy="22" r="3" fill="#FDA4AF" />
            <circle cx="21" cy="22" r="1.2" fill="#FEF08A" />
            {/* Mắt cười tít đáng yêu */}
            <path d="M 22 32 Q 26 28 30 32" stroke="#261A14" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M 34 32 Q 38 28 42 32" stroke="#261A14" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            {/* Nụ cười vui tươi */}
            <path d="M 29 41 Q 32 45 35 41" stroke="#E11D48" strokeWidth="1.8" strokeLinecap="round" />
            {/* Áo cardigan học sinh hồng pastel */}
            <path d="M 18 58 C 18 48 46 48 46 58 Z" fill="#FDF2F8" stroke="#F472B6" strokeWidth="1.5" />
            <polygon points="32,48 29,58 35,58" fill="#F472B6" />
          </svg>
        );

      // 4. Thầy Nghĩa (Giám Thị) - Thầy giáo kính đồi mồi ấm áp
      case 'teacher_nghia':
      case 'teacher_nghia_physics':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <circle cx="32" cy="32" r="30" fill="#EDE9FE" />
            {/* Mái tóc hoa râm chải gọn */}
            <path d="M 16 26 C 18 14 46 14 48 26 C 44 19 35 18 32 19 C 28 18 20 20 16 26 Z" fill="#64748B" />
            <ellipse cx="32" cy="28" rx="17" ry="15" fill="#475569" />
            {/* Gương mặt đôn hậu */}
            <path d="M 18 28 C 18 44 24 49 32 49 C 40 49 46 44 46 28 C 46 19 40 19 32 19 C 24 19 18 19 18 28 Z" fill="#FFE5D9" />
            {/* Khóe mắt cười & Kính đồi mồi */}
            <rect x="18" y="29" width="11" height="8" rx="2" stroke="#854D0E" strokeWidth="1.8" fill="#FFFFFF" fillOpacity="0.2" />
            <rect x="35" y="29" width="11" height="8" rx="2" stroke="#854D0E" strokeWidth="1.8" fill="#FFFFFF" fillOpacity="0.2" />
            <line x1="29" y1="33" x2="35" y2="33" stroke="#854D0E" strokeWidth="1.8" />
            <circle cx="24" cy="33" r="1.8" fill="#1E293B" />
            <circle cx="40" cy="33" r="1.8" fill="#1E293B" />
            <path d="M 29 42 Q 32 44 35 42" stroke="#78350F" strokeWidth="1.6" strokeLinecap="round" />
            {/* Áo vest xám & cà vạt tím */}
            <path d="M 17 58 C 17 48 47 48 47 58 Z" fill="#F8FAFC" stroke="#64748B" strokeWidth="1.5" />
            <polygon points="30,48 34,48 33,58 31,58" fill="#7C3AED" />
          </svg>
        );

      // 5. Cô Lan (Phụ Huynh) - Người mẹ dịu hiền nón bảo hiểm pastel
      case 'parent_co_lan':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <circle cx="32" cy="32" r="30" fill="#FEF3C7" />
            {/* Tóc dài nâu buông nhẹ */}
            <path d="M 14 36 C 14 48 18 54 18 58 L 46 58 C 46 54 50 48 50 36 Z" fill="#5D3A1A" />
            {/* Gương mặt mẹ dịu hiền */}
            <path d="M 19 30 C 19 44 24 48 32 48 C 40 48 45 44 45 30 Z" fill="#FFF0E6" />
            <circle cx="23" cy="39" r="3.5" fill="#FDA4AF" opacity="0.65" />
            <circle cx="41" cy="39" r="3.5" fill="#FDA4AF" opacity="0.65" />
            {/* Mắt cười dịu dàng */}
            <path d="M 23 33 Q 26 30 29 33" stroke="#451A03" strokeWidth="2" strokeLinecap="round" />
            <path d="M 35 33 Q 38 30 41 33" stroke="#451A03" strokeWidth="2" strokeLinecap="round" />
            <path d="M 29 42 Q 32 45 35 42" stroke="#E11D48" strokeWidth="1.8" strokeLinecap="round" />
            {/* Nón bảo hiểm thời trang màu hồng san hô */}
            <path d="M 15 28 C 15 12 49 12 49 28 Z" fill="#FB7185" stroke="#E11D48" strokeWidth="1.8" />
            <ellipse cx="32" cy="19" rx="14" ry="4" fill="#FDA4AF" opacity="0.7" />
            <circle cx="32" cy="20" r="3" fill="#FFFFFF" opacity="0.8" />
            {/* Áo khoác hoa nhẹ */}
            <path d="M 17 58 C 17 49 47 49 47 58 Z" fill="#FFE4E6" stroke="#FB7185" strokeWidth="1.5" />
          </svg>
        );

      // 6. Bác Tư (Bảo Vệ) - Bác bảo vệ mũ Kê-pi phúc hậu
      case 'neighbor_bac_tu':
      case 'security_bac_tu':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <circle cx="32" cy="32" r="30" fill="#F1F5F9" />
            {/* Gương mặt đôn hậu */}
            <path d="M 18 32 C 18 46 24 50 32 50 C 40 50 46 46 46 32 Z" fill="#FFE5D9" />
            {/* Mắt cười & nếp nhăn hiền từ */}
            <circle cx="25" cy="35" r="2" fill="#1E293B" />
            <circle cx="39" cy="35" r="2" fill="#1E293B" />
            <path d="M 21 34 L 23 35" stroke="#94A3B8" strokeWidth="1.2" />
            <path d="M 43 34 L 41 35" stroke="#94A3B8" strokeWidth="1.2" />
            {/* Ria mép muối tiêu phúc hậu */}
            <path d="M 25 41 Q 32 38 39 41" stroke="#64748B" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M 30 45 Q 32 46 34 45" stroke="#78350F" strokeWidth="1.5" />
            {/* Mũ Kê-pi bảo vệ xanh navy có huy hiệu vàng */}
            <path d="M 14 26 C 14 14 50 14 50 26 Z" fill="#1E3A8A" stroke="#172554" strokeWidth="1.8" />
            <ellipse cx="32" cy="26" rx="18" ry="3.5" fill="#0F172A" />
            <circle cx="32" cy="20" r="3" fill="#F59E0B" />
            <circle cx="32" cy="20" r="1.5" fill="#FEF08A" />
            {/* Áo đồng phục xanh da trời & cầu vai */}
            <path d="M 16 58 C 16 48 48 48 48 58 Z" fill="#0284C7" stroke="#0369A1" strokeWidth="1.8" />
            <rect x="19" y="49" width="6" height="3" rx="0.5" fill="#F59E0B" />
            <rect x="39" y="49" width="6" height="3" rx="0.5" fill="#F59E0B" />
          </svg>
        );

      // 7. Minh "Bóng Rổ" (Lớp 11A3) - Băng đô thể thao đỏ năng động
      case 'student_minh_sport':
      case 'athlete_minh_basketball':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <circle cx="32" cy="32" r="30" fill="#FFEDD5" />
            {/* Tóc vuốt thể thao */}
            <path d="M 16 24 C 18 10 46 10 48 24 Z" fill="#1C1917" />
            <path d="M 20 12 L 23 18 L 27 13 L 31 17 L 35 12 L 39 17 L 43 13 L 45 19" stroke="#1C1917" strokeWidth="3" />
            {/* Băng đô thể thao đỏ rực rỡ */}
            <rect x="16" y="20" width="32" height="6" rx="1.5" fill="#EF4444" stroke="#B91C1C" strokeWidth="1" />
            {/* Làn da khỏe khoắn */}
            <path d="M 18 28 C 18 44 24 49 32 49 C 40 49 46 44 46 28 Z" fill="#FDBA74" />
            {/* Má hồng hào khỏe */}
            <circle cx="23" cy="39" r="3" fill="#FB923C" opacity="0.6" />
            <circle cx="41" cy="39" r="3" fill="#FB923C" opacity="0.6" />
            {/* Đôi mắt sáng tự tin & nụ cười tươi */}
            <circle cx="25" cy="34" r="2.5" fill="#0F172A" />
            <circle cx="39" cy="34" r="2.5" fill="#0F172A" />
            <circle cx="24.2" cy="33.2" r="1" fill="#FFFFFF" />
            <circle cx="38.2" cy="33.2" r="1" fill="#FFFFFF" />
            <path d="M 28 42 Q 32 47 36 42" stroke="#9A3412" strokeWidth="2.2" strokeLinecap="round" />
            {/* Áo bóng rổ ba lỗ cam số 7 */}
            <path d="M 18 58 C 18 48 46 48 46 58 Z" fill="#EA580C" stroke="#C2410C" strokeWidth="1.8" />
            <text x="29.5" y="56" fontSize="7.5" fontWeight="900" fill="#FFFFFF">7</text>
          </svg>
        );

      // 8. Vy "Họa Sĩ" (Lớp 10 Văn) - Búi tóc cọ vẽ nghệ thuật, má phết màu xinh xắn (NÂNG CẤP ĐẶC BIỆT)
      case 'student_vy_art':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            {/* Nền xanh bạc hà pastel */}
            <circle cx="32" cy="32" r="30" fill="#CCFBF1" />

            {/* Búi tóc củ tỏi rối nghệ thuật phía trên */}
            <circle cx="42" cy="18" r="7.5" fill="#451A03" />
            <ellipse cx="44" cy="16" rx="5" ry="3.5" fill="#602B0F" opacity="0.6" />

            {/* CÂY CỌ VẼ XUYÊN QUA BÚI TÓC CHI TIẾT */}
            {/* Cán cọ gỗ vân sáng */}
            <line x1="33" y1="11" x2="52" y2="28" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
            {/* Cổ cọ kim loại sáng bóng */}
            <line x1="33" y1="11" x2="36" y2="14" stroke="#E2E8F0" strokeWidth="3.2" strokeLinecap="round" />
            {/* Đầu lông cọ mềm mại chấm vệt sơn hồng san hô */}
            <polygon points="30,8 34,12 31,13 29,10" fill="#EF4444" />
            <circle cx="28" cy="7" r="1.5" fill="#F43F5E" />

            {/* Tóc sau ôm lấy đầu */}
            <ellipse cx="32" cy="31" rx="19" ry="17" fill="#451A03" />

            {/* Cổ & Khuôn mặt chibi da tự nhiên mềm mại */}
            <path d="M 28 42 L 36 42 L 35 48 L 29 48 Z" fill="#F8C8BA" />
            <circle cx="15" cy="34" r="3.2" fill="#FFE5D9" />
            <circle cx="49" cy="34" r="3.2" fill="#FFE5D9" />
            <path d="M 17 28 C 17 44 24 49 32 49 C 40 49 47 44 47 28 C 47 18 41 18 32 18 C 23 18 17 18 17 28 Z" fill="#FFE5D9" />

            {/* Vệt màu nước pastel xinh xắn trên má phải của bé họa sĩ */}
            <ellipse cx="43" cy="37" rx="3.5" ry="2" fill="#38BDF8" opacity="0.75" />
            <circle cx="40" cy="39" r="1.2" fill="#F43F5E" opacity="0.8" />
            {/* Má hồng đào má trái */}
            <circle cx="22" cy="39" r="3.5" fill="#FDA4AF" opacity="0.7" />

            {/* Mái tóc uốn lọn dịu dàng che nhẹ trán */}
            <path d="M 16 26 C 20 18 42 18 48 26 C 44 22 36 24 32 24 C 27 24 21 21 16 26 Z" fill="#5A2807" />
            <path d="M 17 26 C 18 35 22 36 24 27" fill="#5A2807" />
            <path d="M 47 26 C 46 34 43 35 41 27" fill="#5A2807" />

            {/* Đôi mắt to tròn mộng mơ của người nghệ sĩ */}
            <path d="M 21 31 Q 25 28 29 31" stroke="#2B1810" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M 35 31 Q 39 28 43 31" stroke="#2B1810" strokeWidth="2.2" strokeLinecap="round" />
            <ellipse cx="25" cy="34.5" rx="3" ry="3.8" fill="#3D2416" />
            <ellipse cx="39" cy="34.5" rx="3" ry="3.8" fill="#3D2416" />
            <circle cx="24" cy="33" r="1.4" fill="#FFFFFF" />
            <circle cx="38" cy="33" r="1.4" fill="#FFFFFF" />
            <circle cx="26.8" cy="36.2" r="0.8" fill="#FFFFFF" />
            <circle cx="40.8" cy="36.2" r="0.8" fill="#FFFFFF" />

            {/* Miệng cười chúm chím dịu dàng */}
            <path d="M 29 43 Q 32 46 35 43" stroke="#BE123C" strokeWidth="1.6" strokeLinecap="round" />

            {/* Áo thun cổ lọ & Yếm vẽ mint-teal có vệt sơn */}
            <path d="M 17 58 C 17 48 47 48 47 58 Z" fill="#0D9488" stroke="#115E59" strokeWidth="1.5" />
            {/* Cổ áo len trắng kem bên trong */}
            <rect x="27" y="46" width="10" height="4" rx="2" fill="#FEF3C7" />
            {/* Dây yếm & Chiếc khuy áo tròn */}
            <line x1="24" y1="50" x2="24" y2="58" stroke="#115E59" strokeWidth="2.2" />
            <line x1="40" y1="50" x2="40" y2="58" stroke="#115E59" strokeWidth="2.2" />
            <circle cx="24" cy="51" r="1.2" fill="#FDE047" />
            <circle cx="40" cy="51" r="1.2" fill="#FDE047" />
          </svg>
        );

      // 9. Cô Thảo (Giáo Viên Anh) - Cô giáo trẻ thanh lịch, Áo Dài hồng hoa sen
      case 'teacher_thao_english':
      case 'teacher_lan_literature':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <circle cx="32" cy="32" r="30" fill="#FEE2E2" />
            {/* Mái tóc dài xoăn bồng bềnh uốn lọn */}
            <path d="M 14 28 C 14 12 50 12 50 28 C 53 44 48 56 46 58 L 18 58 C 16 56 11 44 14 28 Z" fill="#582910" />
            {/* Trâm kẹp ngọc trai cài tóc */}
            <circle cx="44" cy="24" r="2.5" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
            <circle cx="47" cy="26" r="2" fill="#FED7AA" />
            {/* Gương mặt thanh tú xinh đẹp */}
            <path d="M 19 28 C 19 44 24 48 32 48 C 40 48 45 44 45 28 Z" fill="#FFF0E6" />
            <circle cx="23" cy="38" r="3.5" fill="#FDA4AF" opacity="0.65" />
            <circle cx="41" cy="38" r="3.5" fill="#FDA4AF" opacity="0.65" />
            {/* Mi cong & Đôi mắt dịu dàng thanh lịch */}
            <path d="M 22 31 Q 26 27 30 31" stroke="#261A14" strokeWidth="2" strokeLinecap="round" />
            <path d="M 34 31 Q 38 27 42 31" stroke="#261A14" strokeWidth="2" strokeLinecap="round" />
            <ellipse cx="26" cy="34" rx="2.5" ry="3.2" fill="#3E2723" />
            <ellipse cx="38" cy="34" rx="2.5" ry="3.2" fill="#3E2723" />
            <circle cx="25.2" cy="32.8" r="1.1" fill="#FFFFFF" />
            <circle cx="37.2" cy="32.8" r="1.1" fill="#FFFFFF" />
            {/* Nụ cười tươi son hồng thanh nhã */}
            <path d="M 29 42 Q 32 45 35 42" stroke="#E11D48" strokeWidth="1.8" strokeLinecap="round" />
            {/* Cổ Áo Dài truyền thống hồng pastel */}
            <path d="M 18 58 C 18 48 46 48 46 58 Z" fill="#F472B6" stroke="#DB2777" strokeWidth="1.5" />
            <path d="M 29 47 L 35 47 L 33 51 L 31 51 Z" fill="#FBCFE8" stroke="#DB2777" strokeWidth="1" />
          </svg>
        );

      // 10. Khoa "Đội Tuyển Tin" (Lớp 8) - Tóc xù kính tròn công nghệ
      case 'student_khoa_nerd':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <circle cx="32" cy="32" r="30" fill="#EEF2FF" />
            {/* Tóc xù cá tính */}
            <ellipse cx="32" cy="27" rx="19" ry="17" fill="#1E293B" />
            <path d="M 16 22 L 18 14 L 23 19 L 28 12 L 32 17 L 37 11 L 41 18 L 47 13 L 48 22" stroke="#1E293B" strokeWidth="2.5" />
            {/* Gương mặt lém lỉnh */}
            <path d="M 18 28 C 18 44 24 49 32 49 C 40 49 46 44 46 28 Z" fill="#FFE5D9" />
            <circle cx="22" cy="39" r="3" fill="#FDA4AF" opacity="0.4" />
            <circle cx="42" cy="39" r="3" fill="#FDA4AF" opacity="0.4" />
            {/* Kính cận tròn to phong cách Harry Potter */}
            <circle cx="24" cy="33" r="6" stroke="#4338CA" strokeWidth="2.2" fill="#FFFFFF" fillOpacity="0.25" />
            <circle cx="40" cy="33" r="6" stroke="#4338CA" strokeWidth="2.2" fill="#FFFFFF" fillOpacity="0.25" />
            <line x1="30" y1="33" x2="34" y2="33" stroke="#4338CA" strokeWidth="2.2" />
            {/* Mắt thông minh & Vệt sáng phản chiếu kính */}
            <circle cx="24" cy="33" r="2.2" fill="#0F172A" />
            <circle cx="40" cy="33" r="2.2" fill="#0F172A" />
            <circle cx="23" cy="32" r="1" fill="#FFFFFF" />
            <circle cx="39" cy="32" r="1" fill="#FFFFFF" />
            {/* Nụ cười tinh nghịch */}
            <path d="M 29 43 Q 32 46 35 43" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" />
            {/* Áo hoodie tím than có mũ & dây rút */}
            <path d="M 17 58 C 17 48 47 48 47 58 Z" fill="#4338CA" stroke="#312E81" strokeWidth="1.8" />
            <line x1="30" y1="49" x2="28" y2="56" stroke="#C7D2FE" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="34" y1="49" x2="36" y2="56" stroke="#C7D2FE" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );

      // 11. Anh Ba (Tài Xế Giao Hàng) - Nón bảo hiểm công nghệ xanh lá
      case 'shipper_anh_ba':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <circle cx="32" cy="32" r="30" fill="#DCFCE7" />
            {/* Gương mặt khỏe khoắn thân thiện */}
            <path d="M 18 30 C 18 44 24 49 32 49 C 40 49 46 44 46 30 Z" fill="#FDBA74" />
            <circle cx="23" cy="39" r="3" fill="#FB923C" opacity="0.5" />
            <circle cx="41" cy="39" r="3" fill="#FB923C" opacity="0.5" />
            {/* Mắt cười rạng rỡ & Chân mày rậm */}
            <circle cx="25" cy="34" r="2.5" fill="#0F172A" />
            <circle cx="39" cy="34" r="2.5" fill="#0F172A" />
            <circle cx="24.2" cy="33.2" r="1" fill="#FFFFFF" />
            <circle cx="38.2" cy="33.2" r="1" fill="#FFFFFF" />
            <path d="M 28 42 Q 32 46 36 42" stroke="#78350F" strokeWidth="2.2" strokeLinecap="round" />
            {/* Nón bảo hiểm xanh lá công nghệ có kính chắn gió */}
            <path d="M 15 28 C 15 13 49 13 49 28 Z" fill="#16A34A" stroke="#14532D" strokeWidth="1.8" />
            <ellipse cx="32" cy="27" rx="18" ry="3.5" fill="#15803D" />
            <line x1="20" y1="21" x2="44" y2="21" stroke="#FEF08A" strokeWidth="2.5" />
            {/* Áo khoác xanh công nghệ có sọc phản quang */}
            <path d="M 16 58 C 16 48 48 48 48 58 Z" fill="#15803D" stroke="#166534" strokeWidth="1.8" />
            <line x1="24" y1="51" x2="40" y2="51" stroke="#FEF08A" strokeWidth="2" />
          </svg>
        );

      // 12. Nhóm Nhảy K-Pop (Lớp 11) - Highlight tím, nháy mắt đáng yêu
      case 'student_nhom_nhay':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <circle cx="32" cy="32" r="30" fill="#FAF5FF" />
            {/* Tóc tím pastel bồng bềnh */}
            <path d="M 14 26 C 14 12 50 12 50 26 C 52 42 48 52 46 58 L 18 58 C 16 52 12 42 14 26 Z" fill="#7E22CE" />
            <circle cx="44" cy="22" r="3" fill="#E9D5FF" />
            {/* Gương mặt idol xinh xắn */}
            <path d="M 18 28 C 18 44 24 48 32 48 C 40 48 46 44 46 28 Z" fill="#FFF0E6" />
            <circle cx="23" cy="38" r="3.5" fill="#FDA4AF" opacity="0.75" />
            <circle cx="41" cy="38" r="3.5" fill="#FDA4AF" opacity="0.75" />
            {/* Hình dán trái tim nhỏ trên gò má phải */}
            <path d="M 41 36 C 40 35 39 36 39 37 C 39 38 41 39 41 39 C 41 39 43 38 43 37 C 43 36 42 35 41 36 Z" fill="#EC4899" />
            {/* Nháy mắt cá tính (wink) */}
            <path d="M 22 33 Q 26 29 30 33" stroke="#3B0764" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <ellipse cx="38" cy="33.5" rx="3" ry="3.5" fill="#581C87" />
            <circle cx="37" cy="32" r="1.3" fill="#FFFFFF" />
            <circle cx="39.5" cy="35" r="0.8" fill="#FFFFFF" />
            {/* Nụ cười thần tượng rạng ngời */}
            <path d="M 29 42 Q 32 45 35 42" stroke="#9333EA" strokeWidth="2" strokeLinecap="round" />
            {/* Áo croptop tím thời trang */}
            <path d="M 17 58 C 17 48 47 48 47 58 Z" fill="#9333EA" stroke="#6B21A8" strokeWidth="1.8" />
          </svg>
        );

      // Default: Học sinh chibi dễ thương (TUYỆT ĐỐI KHÔNG DÙNG EMOJI!)
      default:
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <circle cx="32" cy="32" r="30" fill="#FEF3C7" />
            <ellipse cx="32" cy="30" rx="19" ry="17" fill="#3D291E" />
            <path d="M 17 28 C 17 44 23 48 32 48 C 41 48 47 44 47 28 Z" fill="#FFE5D9" />
            <circle cx="22" cy="38" r="3.5" fill="#FDA4AF" opacity="0.65" />
            <circle cx="42" cy="38" r="3.5" fill="#FDA4AF" opacity="0.65" />
            <circle cx="25" cy="34" r="2.5" fill="#261A14" />
            <circle cx="39" cy="34" r="2.5" fill="#261A14" />
            <circle cx="24" cy="32.5" r="1" fill="#FFFFFF" />
            <circle cx="38" cy="32.5" r="1" fill="#FFFFFF" />
            <path d="M 29 42 Q 32 45 35 42" stroke="#9A3412" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M 18 58 C 18 48 46 48 46 58 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            <polygon points="27,48 37,48 32,58" fill="#DC2626" />
          </svg>
        );
    }
  };

  const moodStyles = {
    happy: 'ring-2 ring-emerald-500 shadow-emerald-200',
    impatient: 'ring-2 ring-rose-500 animate-pulse',
    neutral: 'border-[#EBE4D5]',
  }[mood];

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-2xl bg-[#F7F2E7] border-2 shadow-xs overflow-hidden flex-shrink-0 ${dim} ${moodStyles} ${className}`}
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
});
