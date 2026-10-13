import React, { useState } from 'react';
import { getDishImageUrl } from '@/data/assetManifest';

interface DishIllustrationProps {
  itemId: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const DishIllustration: React.FC<DishIllustrationProps> = React.memo(({
  itemId,
  size = 'md',
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);
  const realImgUrl = getDishImageUrl(itemId);

  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const dim = sizeMap[size] || sizeMap.md;

  // Render SVG minh họa 2D vẽ tay dễ thương cho từng món ăn
  const renderSvgContent = () => {
    switch (itemId) {
      // ==================== ĐỒ UỐNG TRÀ SỮA & TRÀ TRÁI CÂY ====================
      case 'drink_tra_sua_truyen_thong':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            {/* Ly nhựa trà sữa */}
            <path d="M 18 16 L 22 54 C 22 58 42 58 42 54 L 46 16 Z" fill="#E8C39E" stroke="#78350F" strokeWidth="2.5" />
            {/* Nắp ly vòm cầu */}
            <path d="M 16 16 C 16 10 48 10 48 16 Z" fill="#FDF4E3" stroke="#78350F" strokeWidth="2.5" />
            {/* Trân châu đen đáy ly */}
            <circle cx="28" cy="50" r="3" fill="#3E2723" />
            <circle cx="36" cy="51" r="3" fill="#3E2723" />
            <circle cx="32" cy="46" r="3" fill="#3E2723" />
            <circle cx="26" cy="44" r="2.5" fill="#3E2723" />
            <circle cx="38" cy="45" r="2.5" fill="#3E2723" />
            {/* Ống hút đỏ chéo */}
            <line x1="32" y1="8" x2="32" y2="42" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
            {/* Màng bọc dập nắp */}
            <line x1="16" y1="16" x2="48" y2="16" stroke="#B45309" strokeWidth="3" />
          </svg>
        );

      case 'drink_tra_dao_cam_sa':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            {/* Ly nước cam vàng */}
            <path d="M 18 16 L 22 54 C 22 58 42 58 42 54 L 46 16 Z" fill="#F59E0B" stroke="#92400E" strokeWidth="2.5" />
            {/* Miếng đào cam lát */}
            <ellipse cx="32" cy="28" rx="8" ry="4" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5" />
            <circle cx="32" cy="28" r="3" fill="#F59E0B" />
            {/* Cọng sả xanh */}
            <line x1="38" y1="12" x2="26" y2="40" stroke="#84CC16" strokeWidth="3" strokeLinecap="round" />
            {/* Lá bạc hà */}
            <path d="M 24 16 Q 20 12 24 8 Q 28 12 24 16 Z" fill="#22C55E" />
            {/* Nắp ly & Ống hút */}
            <path d="M 16 16 C 16 11 48 11 48 16 Z" fill="#FEF3C7" stroke="#92400E" strokeWidth="2" />
            <line x1="34" y1="6" x2="34" y2="24" stroke="#F97316" strokeWidth="3.5" strokeLinecap="round" />
          </svg>
        );

      case 'drink_tra_tac_mat_ong_hat_chia':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <path d="M 18 16 L 22 54 C 22 58 42 58 42 54 L 46 16 Z" fill="#EAB308" stroke="#854D0E" strokeWidth="2.5" />
            {/* Lát tắc xanh vàng */}
            <circle cx="32" cy="30" r="7" fill="#84CC16" stroke="#65A30D" strokeWidth="1.5" />
            <circle cx="32" cy="30" r="5" fill="#FEF08A" />
            {/* Hạt chia lấm tấm */}
            <circle cx="26" cy="46" r="1.2" fill="#1C1917" />
            <circle cx="34" cy="48" r="1.2" fill="#1C1917" />
            <circle cx="38" cy="44" r="1.2" fill="#1C1917" />
            <circle cx="28" cy="40" r="1.2" fill="#1C1917" />
            <path d="M 16 16 C 16 11 48 11 48 16 Z" fill="#FEF9C3" stroke="#854D0E" strokeWidth="2" />
            <line x1="36" y1="6" x2="30" y2="38" stroke="#22C55E" strokeWidth="3.5" strokeLinecap="round" />
          </svg>
        );

      case 'drink_tra_chanh_gia_tay':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <path d="M 18 16 L 22 54 C 22 58 42 58 42 54 L 46 16 Z" fill="#FEF08A" stroke="#713F12" strokeWidth="2.5" />
            {/* Lát chanh giã nát dập dập */}
            <circle cx="30" cy="32" r="8" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
            <path d="M 30 24 L 30 40 M 22 32 L 38 32" stroke="#CA8A04" strokeWidth="1.5" />
            {/* Đá viên mát lạnh */}
            <rect x="25" y="42" width="7" height="7" rx="1.5" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1.5" opacity="0.8" />
            <rect x="33" y="38" width="6" height="6" rx="1.5" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1.5" opacity="0.8" />
            <line x1="33" y1="6" x2="33" y2="36" stroke="#EAB308" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 16 16 L 48 16" stroke="#713F12" strokeWidth="3" />
          </svg>
        );

      case 'drink_tra_sua_tran_chau_duong_den':
      case 'drink_sua_tuoi_tran_chau_duong_den':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <path d="M 18 16 L 22 54 C 22 58 42 58 42 54 L 46 16 Z" fill="#FFFBEB" stroke="#451A03" strokeWidth="2.5" />
            {/* Vệt đường đen chảy dọc thành ly */}
            <path d="M 23 24 Q 26 36 24 50" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
            <path d="M 41 22 Q 38 34 40 48" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
            <path d="M 32 20 Q 34 32 32 46" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
            {/* Trân châu hoàng kim đường đen */}
            <circle cx="27" cy="50" r="3" fill="#1C1917" />
            <circle cx="35" cy="51" r="3" fill="#1C1917" />
            <circle cx="31" cy="46" r="3" fill="#1C1917" />
            <circle cx="38" cy="45" r="2.5" fill="#1C1917" />
            <path d="M 16 16 C 16 11 48 11 48 16 Z" fill="#FEF3C7" stroke="#451A03" strokeWidth="2" />
            <line x1="32" y1="6" x2="32" y2="44" stroke="#451A03" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );

      case 'drink_milo_dam_tran_chau':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <path d="M 18 16 L 22 54 C 22 58 42 58 42 54 L 46 16 Z" fill="#59381E" stroke="#2B1810" strokeWidth="2.5" />
            {/* Bột Milo rắc bên trên */}
            <ellipse cx="32" cy="18" rx="12" ry="3" fill="#3D2314" />
            {/* Sữa đặc chảy ngọt ngào */}
            <path d="M 25 18 C 25 24 28 26 28 32" stroke="#FFFBEB" strokeWidth="2" strokeLinecap="round" />
            {/* Trân châu dẻo */}
            <circle cx="28" cy="48" r="3.2" fill="#111827" />
            <circle cx="36" cy="49" r="3.2" fill="#111827" />
            <circle cx="32" cy="44" r="3" fill="#111827" />
            <line x1="32" y1="8" x2="32" y2="40" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="16" y1="16" x2="48" y2="16" stroke="#2B1810" strokeWidth="3" />
          </svg>
        );

      case 'drink_tra_vai_lai_tuyet_dinh':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <path d="M 18 16 L 22 54 C 22 58 42 58 42 54 L 46 16 Z" fill="#FEF2F2" stroke="#991B1B" strokeWidth="2.5" />
            {/* Trái vải mọng nước */}
            <circle cx="32" cy="34" r="7" fill="#FEE2E2" stroke="#F87171" strokeWidth="2" />
            <circle cx="32" cy="34" r="3" fill="#EF4444" />
            {/* Hoa lài trắng thanh tao */}
            <circle cx="26" cy="22" r="2.5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
            <circle cx="38" cy="20" r="2.5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
            <path d="M 16 16 C 16 11 48 11 48 16 Z" fill="#FFF1F2" stroke="#991B1B" strokeWidth="2" />
            <line x1="33" y1="6" x2="33" y2="40" stroke="#EC4899" strokeWidth="3.5" strokeLinecap="round" />
          </svg>
        );

      // ==================== ĐỒ ĂN VẶT & MÌ ====================
      case 'snack_banh_trang_tron_dac_biet':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            {/* Bịch / Đĩa bánh tráng */}
            <path d="M 12 40 C 12 56 52 56 52 40 Z" fill="#FEF3C7" stroke="#92400E" strokeWidth="2.5" />
            {/* Sợi bánh tráng đan xen */}
            <path d="M 16 36 Q 32 30 48 38" stroke="#FDE68A" strokeWidth="3" strokeLinecap="round" />
            <path d="M 18 42 Q 32 48 46 42" stroke="#FDE68A" strokeWidth="3" strokeLinecap="round" />
            {/* Khô bò đỏ rực */}
            <path d="M 22 34 L 30 38" stroke="#B91C1C" strokeWidth="3" strokeLinecap="round" />
            <path d="M 34 33 L 42 36" stroke="#B91C1C" strokeWidth="3" strokeLinecap="round" />
            {/* Trứng cút luộc bổ đôi */}
            <circle cx="28" cy="40" r="4.5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
            <circle cx="28" cy="40" r="2.5" fill="#F59E0B" />
            {/* Xoài sợi xanh & rau răm */}
            <line x1="36" y1="38" x2="44" y2="42" stroke="#84CC16" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="38" cy="44" r="2" fill="#15803D" />
          </svg>
        );

      case 'snack_ca_vien_chien_nuoc_mam':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            {/* Que xiên tre */}
            <line x1="10" y1="54" x2="54" y2="10" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
            {/* 3 Viên cá viên vàng ươm */}
            <circle cx="22" cy="42" r="8" fill="#FBBF24" stroke="#92400E" strokeWidth="2.5" />
            <circle cx="32" cy="32" r="8.5" fill="#F59E0B" stroke="#92400E" strokeWidth="2.5" />
            <circle cx="42" cy="22" r="8" fill="#D97706" stroke="#92400E" strokeWidth="2.5" />
            {/* Chấm tiêu đen & tương ớt */}
            <circle cx="32" cy="30" r="1.5" fill="#1C1917" />
            <circle cx="43" cy="20" r="1.5" fill="#1C1917" />
            <path d="M 29 33 Q 32 36 35 33" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      case 'snack_xuc_xich_nuong_da_gion':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <line x1="8" y1="56" x2="56" y2="8" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
            {/* Cây xúc xích đỏ nâu */}
            <rect x="20" y="24" width="28" height="14" rx="7" transform="rotate(-45 34 31)" fill="#DC2626" stroke="#7F1D1D" strokeWidth="2.5" />
            {/* Các khía nướng xém cạnh */}
            <line x1="26" y1="28" x2="30" y2="24" stroke="#450A0A" strokeWidth="2" strokeLinecap="round" />
            <line x1="33" y1="35" x2="37" y2="31" stroke="#450A0A" strokeWidth="2" strokeLinecap="round" />
            <line x1="40" y1="42" x2="44" y2="38" stroke="#450A0A" strokeWidth="2" strokeLinecap="round" />
            {/* Vệt sốt mù tạt / tương cà */}
            <path d="M 24 38 Q 34 26 44 26" stroke="#FDE047" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
        );

      case 'snack_khoai_tay_lac_pho_mai':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            {/* Hộp giấy đựng khoai */}
            <path d="M 18 32 L 22 56 L 42 56 L 46 32 Z" fill="#EF4444" stroke="#991B1B" strokeWidth="2.5" />
            <circle cx="32" cy="44" r="5" fill="#FBBF24" />
            {/* Những thanh khoai tây chiên nhô lên */}
            <rect x="22" y="14" width="4" height="22" rx="1.5" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />
            <rect x="27" y="10" width="4" height="26" rx="1.5" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />
            <rect x="33" y="12" width="4.5" height="24" rx="1.5" fill="#FBBF24" stroke="#CA8A04" strokeWidth="1.5" />
            <rect x="38" y="16" width="4" height="20" rx="1.5" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />
            {/* Bột phô mai cam rực */}
            <circle cx="28" cy="18" r="1" fill="#EA580C" />
            <circle cx="35" cy="20" r="1" fill="#EA580C" />
            <circle cx="34" cy="14" r="1" fill="#EA580C" />
          </svg>
        );

      case 'snack_mi_cay_mini_cap_2':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            {/* Thau đất đen viền bạc */}
            <path d="M 12 30 C 12 54 52 54 52 30 Z" fill="#27272A" stroke="#09090B" strokeWidth="2.5" />
            <ellipse cx="32" cy="30" rx="20" ry="6" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
            {/* Sợi mì vàng uốn lượn */}
            <path d="M 20 28 Q 26 24 32 28 Q 38 24 44 28" stroke="#FDE047" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Tôm / Mực đỏ */}
            <circle cx="26" cy="30" r="3.5" fill="#F87171" stroke="#B91C1C" strokeWidth="1.5" />
            {/* Ớt cay xé lưỡi */}
            <path d="M 36 26 Q 42 22 40 32" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Khói nghi ngút */}
            <path d="M 28 18 Q 30 12 28 8" stroke="#E4E4E7" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
            <path d="M 36 16 Q 38 10 36 6" stroke="#E4E4E7" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
          </svg>
        );

      case 'snack_mi_tron_tuong_den_han_quoc':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <path d="M 12 32 C 12 54 52 54 52 32 Z" fill="#F8FAFC" stroke="#334155" strokeWidth="2.5" />
            {/* Sốt tương đen bóng bẩy */}
            <ellipse cx="32" cy="32" rx="20" ry="6" fill="#1E293B" />
            <path d="M 22 30 Q 32 26 42 30" stroke="#334155" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Dưa leo thái sợi xanh */}
            <line x1="24" y1="28" x2="32" y2="32" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" />
            {/* Trứng luộc bổ đôi */}
            <circle cx="38" cy="30" r="5" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
            <circle cx="38" cy="30" r="3" fill="#F59E0B" />
          </svg>
        );

      case 'snack_nem_chua_ran_pho_co':
      case 'snack_cha_gio_re_chien_gion':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            {/* Đĩa tròn lót giấy thấm dầu */}
            <ellipse cx="32" cy="42" rx="22" ry="12" fill="#F8FAFC" stroke="#64748B" strokeWidth="2.5" />
            {/* 3 Cuốn nem / chả giò vàng rụm */}
            <rect x="18" y="32" width="22" height="7" rx="3.5" transform="rotate(-15 29 35)" fill="#D97706" stroke="#78350F" strokeWidth="2" />
            <rect x="24" y="36" width="22" height="7" rx="3.5" transform="rotate(10 35 39)" fill="#F59E0B" stroke="#78350F" strokeWidth="2" />
            <rect x="22" y="42" width="22" height="7" rx="3.5" transform="rotate(-5 33 45)" fill="#B45309" stroke="#78350F" strokeWidth="2" />
            {/* Chén tương ớt đỏ tươi */}
            <circle cx="44" cy="36" r="5" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
          </svg>
        );

      // ==================== BỮA SÁNG & MÓN NO ====================
      case 'breakfast_banh_mi_trung_op_la':
      case 'breakfast_banh_mi_pate_cha_lua':
      case 'breakfast_banh_mi_que_hai_phong':
      case 'breakfast_banh_mi_xiu_mai_da_lat':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            {/* Ổ bánh mì baguette vàng óng giòn rụm */}
            <path
              d="M 12 36 C 8 28 20 18 36 20 C 52 22 58 32 52 40 C 46 48 20 46 12 36 Z"
              fill="#F59E0B"
              stroke="#78350F"
              strokeWidth="2.5"
            />
            {/* Vết cứa bánh mì phồng giòn */}
            <path d="M 22 24 Q 26 32 24 38" stroke="#B45309" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 33 24 Q 37 33 35 39" stroke="#B45309" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 44 26 Q 47 34 45 40" stroke="#B45309" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Nhân lòi ra: Trứng / Chả / Rau dưa */}
            <path d="M 18 34 Q 28 32 38 34" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" />
            <path d="M 28 35 Q 38 34 48 36" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="28" cy="33" rx="4" ry="2.5" fill="#FDE047" />
          </svg>
        );

      case 'breakfast_xoi_bap_dau_phong':
      case 'breakfast_xoi_ga_xe_nam_huong':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            {/* Gói lá chuối xanh thắt dây rơm */}
            <path d="M 14 44 C 10 32 20 22 32 22 C 44 22 54 32 50 44 C 46 54 18 54 14 44 Z" fill="#15803D" stroke="#14532D" strokeWidth="2.5" />
            {/* Nếp xôi trắng ngà / vàng bắp */}
            <ellipse cx="32" cy="34" rx="14" ry="8" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
            {/* Hành phi thơm phức */}
            <path d="M 26 32 L 32 34" stroke="#92400E" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 34 31 L 40 33" stroke="#92400E" strokeWidth="2.5" strokeLinecap="round" />
            {/* Ruốc / Gà xé bông sợi */}
            <circle cx="28" cy="35" r="2.5" fill="#D97706" />
            <circle cx="36" cy="35" r="2.5" fill="#D97706" />
            <circle cx="32" cy="36" r="2" fill="#B45309" />
          </svg>
        );

      case 'breakfast_com_tam_suon_bi_cha':
      case 'breakfast_com_chien_duong_chau':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            {/* Đĩa cơm sứ trắng */}
            <ellipse cx="32" cy="40" rx="24" ry="14" fill="#FFFFFF" stroke="#64748B" strokeWidth="2.5" />
            {/* Cơm tấm trắng dẻo */}
            <ellipse cx="26" cy="38" rx="12" ry="7" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            {/* Miếng sườn nướng mật ong vàng sẫm */}
            <path d="M 30 30 Q 44 28 44 38 Q 40 44 30 42 Z" fill="#9A3412" stroke="#431407" strokeWidth="2" />
            <path d="M 32 33 L 40 35" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
            {/* Trứng ốp la lòng đào */}
            <circle cx="26" cy="36" r="5.5" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
            <circle cx="26" cy="36" r="3.5" fill="#F59E0B" />
            {/* Cà chua / dưa leo lát */}
            <circle cx="44" cy="42" r="3.5" fill="#EF4444" />
            <circle cx="38" cy="44" r="3" fill="#22C55E" />
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <circle cx="32" cy="32" r="24" fill="#FEF3C7" stroke="#D97706" strokeWidth="2.5" />
            <circle cx="32" cy="32" r="14" fill="#FDE68A" />
            <path d="M 28 26 L 36 32 L 28 38 Z" fill="#D97706" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`inline-flex items-center justify-center bg-[#F7F2E7] border border-[#EBE4D5] rounded-2xl shadow-xs flex-shrink-0 overflow-hidden ${dim} ${className}`}
      title={itemId}
    >
      {realImgUrl && !imgError ? (
        <img
          src={realImgUrl}
          alt={itemId}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover rounded-[inherit] select-none transition-transform hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full p-1.5 flex items-center justify-center">
          {renderSvgContent()}
        </div>
      )}
    </div>
  );
});
