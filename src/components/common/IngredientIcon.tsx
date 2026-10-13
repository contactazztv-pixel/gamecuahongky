import React, { useState } from 'react';

interface IngredientIconProps {
  ingredientId: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  alt?: string;
}

/**
 * Bản đồ ánh xạ nguyên liệu tới ảnh minh họa 2D phong cách cartoon ấm cúng
 * Đặt chính giữa ô vuông bo tròn màu be nhạt theo đúng ảnh tham khảo.
 */
export const INGREDIENT_IMAGE_MAP: Record<string, string> = {
  // Mì & ăn liền
  mi_goi_chua_cay: '/assets/ingredients/ingredient_noodles.jpg',
  mi_soi: '/assets/ingredients/ingredient_noodles.jpg',
  mi_goi: '/assets/ingredients/ingredient_noodles.jpg',

  // Trứng
  trung_ga: '/assets/ingredients/ingredient_egg.jpg',
  trung_cut: '/assets/ingredients/ingredient_egg.jpg',

  // Thịt bò & thịt lát & pate
  thit_xa_xiu: '/assets/ingredients/ingredient_beef.jpg',
  thit_bo: '/assets/ingredients/ingredient_beef.jpg',
  cha_lua_heo: '/assets/ingredients/ingredient_beef.jpg',
  cha_lua: '/assets/ingredients/ingredient_beef.jpg',
  pate_gan: '/assets/ingredients/ingredient_beef.jpg',
  ga_xoi_mo: '/assets/ingredients/ingredient_beef.jpg',
  xiu_mai_sot_ca: '/assets/ingredients/ingredient_beef.jpg',

  // Rau củ quả
  dua_leo_do_chua: '/assets/ingredients/ingredient_vegetable.jpg',
  rau_cai: '/assets/ingredients/ingredient_vegetable.jpg',

  // Xúc xích & đồ chiên
  xuc_xich_loc_xoay: '/assets/ingredients/ingredient_sausage.jpg',
  xuc_xich: '/assets/ingredients/ingredient_sausage.jpg',
  ca_vien_tom_vien: '/assets/ingredients/ingredient_sausage.jpg',
  ca_vien: '/assets/ingredients/ingredient_sausage.jpg',
  khoai_tay: '/assets/ingredients/ingredient_sausage.jpg',

  // Kim chi & sa tế
  kim_chi: '/assets/ingredients/ingredient_kimchi.jpg',
  muoi_tom_sate: '/assets/ingredients/ingredient_kimchi.jpg',
  top_mo_hanh_phi: '/assets/ingredients/ingredient_kimchi.jpg',
  bot_pho_mai: '/assets/ingredients/ingredient_kimchi.jpg',

  // Sữa
  sua_dac: '/assets/ingredients/ingredient_milk.jpg',
  sua_tuoi: '/assets/ingredients/ingredient_milk.jpg',

  // Trân châu
  tran_chau_den: '/assets/ingredients/ingredient_boba.jpg',
  tran_chau_hoang_kim: '/assets/ingredients/ingredient_boba.jpg',
  tran_chau_trang: '/assets/ingredients/ingredient_boba.jpg',

  // Trà & bột
  tra_den: '/assets/ingredients/ingredient_tea.jpg',
  tra_lai: '/assets/ingredients/ingredient_tea.jpg',
  bot_matcha: '/assets/ingredients/ingredient_tea.jpg',
  bot_milo: '/assets/ingredients/ingredient_tea.jpg',

  // Đường, siro & topping
  duong_mat: '/assets/ingredients/ingredient_sugar.jpg',
  thach_cu_nang: '/assets/ingredients/ingredient_sugar.jpg',
  dao_ngam: '/assets/ingredients/ingredient_sugar.jpg',
  nep_bap_dua: '/assets/ingredients/ingredient_sugar.jpg',
  gao_tam_thom: '/assets/ingredients/ingredient_sugar.jpg',
  gao_nep: '/assets/ingredients/ingredient_sugar.jpg',
  dau_an: '/assets/ingredients/ingredient_sugar.jpg',

  // Ly & bao bì & bánh
  ly_ong_hut: '/assets/ingredients/ingredient_cup.jpg',
  banh_trang: '/assets/foods/dish_banh_trang.jpg',
  banh_mi_o: '/assets/foods/dish_banh_mi.jpg',
  banh_mi_vo: '/assets/foods/dish_banh_mi.jpg',
};

export const IngredientIcon: React.FC<IngredientIconProps> = ({
  ingredientId,
  size = 'md',
  className = '',
  alt,
}) => {
  const [imgError, setImgError] = useState(false);
  const imgUrl = INGREDIENT_IMAGE_MAP[ingredientId];

  const sizeMap = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-11 h-11 rounded-2xl',
    lg: 'w-14 h-14 rounded-2xl',
    xl: 'w-20 h-20 rounded-3xl',
  };
  const dim = sizeMap[size] || sizeMap.md;

  // Render SVG vector dự phòng khi chưa tải được ảnh
  const renderFallbackSvg = () => {
    switch (ingredientId) {
      case 'tra_den':
      case 'tra_lai':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full p-1">
            <path d="M 6 10 L 10 28 L 22 28 L 26 10 Z" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />
            <path d="M 8 10 L 24 10 L 22 6 L 10 6 Z" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
            <path d="M 16 14 Q 21 16 20 22 Q 13 21 16 14 Z" fill="#16A34A" />
          </svg>
        );

      case 'sua_dac':
      case 'sua_tuoi':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full p-1">
            <rect x="8" y="8" width="16" height="18" rx="3" fill="#E2E8F0" stroke="#475569" strokeWidth="1.5" />
            <rect x="8" y="13" width="16" height="8" fill="#3B82F6" />
            <circle cx="16" cy="17" r="2.5" fill="#EF4444" />
          </svg>
        );

      case 'tran_chau_den':
      case 'tran_chau_hoang_kim':
      case 'tran_chau_trang':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full p-1">
            <rect x="6" y="8" width="20" height="18" rx="4" fill="#3E2723" stroke="#1C1917" strokeWidth="1.5" />
            <circle cx="12" cy="14" r="2.5" fill="#1C1917" />
            <circle cx="18" cy="15" r="2.5" fill="#1C1917" />
            <circle cx="14" cy="20" r="2.5" fill="#1C1917" />
            <circle cx="20" cy="21" r="2.5" fill="#1C1917" />
          </svg>
        );

      case 'dao_ngam':
      case 'thach_cu_nang':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full p-1">
            <rect x="8" y="8" width="16" height="18" rx="2" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
            <circle cx="16" cy="17" r="5" fill="#F59E0B" />
          </svg>
        );

      case 'chanh_tuoi_tac':
      case 'dua_leo_do_chua':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full p-1">
            <circle cx="16" cy="16" r="10" fill="#84CC16" stroke="#4D7C0F" strokeWidth="1.5" />
            <circle cx="16" cy="16" r="7" fill="#FEF08A" />
          </svg>
        );

      case 'banh_trang':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full p-1">
            <circle cx="16" cy="16" r="11" fill="#FEF9C3" stroke="#CA8A04" strokeWidth="1.5" />
            <line x1="8" y1="16" x2="24" y2="16" stroke="#FDE047" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="16" y1="8" x2="16" y2="24" stroke="#FDE047" strokeWidth="1" strokeDasharray="2 2" />
          </svg>
        );

      case 'xuc_xich_loc_xoay':
      case 'xuc_xich':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full p-1">
            <rect x="6" y="11" width="20" height="10" rx="5" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />
            <line x1="12" y1="13" x2="14" y2="19" stroke="#7F1D1D" strokeWidth="1" />
            <line x1="18" y1="13" x2="20" y2="19" stroke="#7F1D1D" strokeWidth="1" />
          </svg>
        );

      case 'trung_ga':
      case 'trung_cut':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full p-1">
            <ellipse cx="16" cy="16" rx="7" ry="10" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5" />
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full p-1">
            <rect x="7" y="7" width="18" height="18" rx="4" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
            <circle cx="16" cy="16" r="3" fill="#D97706" />
          </svg>
        );
    }
  };

  // Nếu có ảnh minh họa thực tế và tải không lỗi
  if (imgUrl && !imgError) {
    return (
      <div
        className={`relative flex items-center justify-center bg-[#F7F2E7] border border-[#EBE4D5] shadow-xs overflow-hidden shrink-0 transition-transform hover:scale-105 ${dim} ${className}`}
        title={alt || ingredientId}
      >
        <img
          src={imgUrl}
          alt={alt || ingredientId}
          className="w-full h-full object-cover rounded-[inherit]"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      </div>
    );
  }

  // Fallback ô vuông be nhạt chứa icon SVG chuẩn form
  return (
    <div
      className={`relative inline-flex items-center justify-center bg-[#F7F2E7] border border-[#EBE4D5] shadow-xs shrink-0 ${dim} ${className}`}
      title={alt || ingredientId}
    >
      {renderFallbackSvg()}
    </div>
  );
};
