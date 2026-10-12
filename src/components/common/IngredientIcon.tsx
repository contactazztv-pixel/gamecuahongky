import React from 'react';

interface IngredientIconProps {
  ingredientId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const IngredientIcon: React.FC<IngredientIconProps> = ({
  ingredientId,
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };
  const dim = sizeMap[size] || sizeMap.md;

  const renderIcon = () => {
    switch (ingredientId) {
      // Nhóm trà & đồ uống
      case 'tra_den':
      case 'tra_lai':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            {/* Túi trà kraft */}
            <path d="M 6 10 L 10 28 L 22 28 L 26 10 Z" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />
            <path d="M 8 10 L 24 10 L 22 6 L 10 6 Z" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
            {/* Chiếc lá trà xanh */}
            <path d="M 16 14 Q 21 16 20 22 Q 13 21 16 14 Z" fill="#16A34A" />
          </svg>
        );

      case 'sua_dac':
      case 'sua_tuoi':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            {/* Lon sữa đặc nhãn xanh đỏ */}
            <rect x="8" y="8" width="16" height="18" rx="3" fill="#E2E8F0" stroke="#475569" strokeWidth="1.5" />
            <rect x="8" y="13" width="16" height="8" fill="#3B82F6" />
            <circle cx="16" cy="17" r="2.5" fill="#EF4444" />
          </svg>
        );

      case 'tran_chau_den':
      case 'tran_chau_trang':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            {/* Túi trân châu đen tròn */}
            <rect x="6" y="8" width="20" height="18" rx="4" fill="#3E2723" stroke="#1C1917" strokeWidth="1.5" />
            <circle cx="12" cy="14" r="2.5" fill="#1C1917" />
            <circle cx="18" cy="15" r="2.5" fill="#1C1917" />
            <circle cx="14" cy="20" r="2.5" fill="#1C1917" />
            <circle cx="20" cy="21" r="2.5" fill="#1C1917" />
          </svg>
        );

      case 'dao_ngam':
      case 'vai_ngam':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect x="8" y="8" width="16" height="18" rx="2" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
            <circle cx="16" cy="17" r="5" fill="#F59E0B" />
          </svg>
        );

      case 'chanh_tuoi':
      case 'tac_tuoi':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <circle cx="16" cy="16" r="10" fill="#84CC16" stroke="#4D7C0F" strokeWidth="1.5" />
            <circle cx="16" cy="16" r="7" fill="#FEF08A" />
          </svg>
        );

      // Nhóm ăn vặt & bánh tráng
      case 'banh_trang':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            {/* Tệp bánh tráng tròn trắng trong */}
            <circle cx="16" cy="16" r="11" fill="#FEF9C3" stroke="#CA8A04" strokeWidth="1.5" />
            <line x1="8" y1="16" x2="24" y2="16" stroke="#FDE047" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="16" y1="8" x2="16" y2="24" stroke="#FDE047" strokeWidth="1" strokeDasharray="2 2" />
          </svg>
        );

      case 'ca_vien':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <circle cx="12" cy="13" r="5" fill="#FBBF24" stroke="#B45309" strokeWidth="1.5" />
            <circle cx="20" cy="14" r="5" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
            <circle cx="16" cy="22" r="5" fill="#D97706" stroke="#B45309" strokeWidth="1.5" />
          </svg>
        );

      case 'xuc_xich':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect x="6" y="11" width="20" height="10" rx="5" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />
            <line x1="12" y1="13" x2="14" y2="19" stroke="#7F1D1D" strokeWidth="1" />
            <line x1="18" y1="13" x2="20" y2="19" stroke="#7F1D1D" strokeWidth="1" />
          </svg>
        );

      case 'mi_goi':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect x="6" y="8" width="20" height="16" rx="2" fill="#F59E0B" stroke="#92400E" strokeWidth="1.5" />
            <path d="M 10 16 Q 16 12 22 16" stroke="#FEF08A" strokeWidth="2" fill="none" />
          </svg>
        );

      // Nhóm bánh mì & xôi
      case 'banh_mi_vo':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <ellipse cx="16" cy="16" rx="12" ry="6" fill="#F59E0B" stroke="#78350F" strokeWidth="1.5" />
            <line x1="11" y1="14" x2="13" y2="18" stroke="#B45309" strokeWidth="1.5" />
            <line x1="16" y1="14" x2="18" y2="18" stroke="#B45309" strokeWidth="1.5" />
          </svg>
        );

      case 'trung_ga':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <ellipse cx="16" cy="16" rx="7" ry="10" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5" />
          </svg>
        );

      case 'pate_gan':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect x="7" y="10" width="18" height="14" rx="2" fill="#78350F" stroke="#451A03" strokeWidth="1.5" />
          </svg>
        );

      case 'cha_lua':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            {/* Cây chả lụa bọc lá chuối */}
            <rect x="6" y="10" width="20" height="12" rx="3" fill="#15803D" stroke="#14532D" strokeWidth="1.5" />
            <ellipse cx="26" cy="16" rx="2" ry="6" fill="#FCE7F3" stroke="#DB2777" strokeWidth="1" />
          </svg>
        );

      case 'gao_nep':
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <path d="M 6 12 L 10 26 L 22 26 L 26 12 Z" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1.5" />
            <circle cx="14" cy="17" r="1.5" fill="#CBD5E1" />
            <circle cx="18" cy="19" r="1.5" fill="#CBD5E1" />
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <rect x="7" y="7" width="18" height="18" rx="4" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
            <circle cx="16" cy="16" r="3" fill="#D97706" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`inline-flex items-center justify-center p-1 bg-white/90 rounded-xl border border-amber-900/15 shadow-xs flex-shrink-0 ${dim} ${className}`}
      title={ingredientId}
    >
      {renderIcon()}
    </div>
  );
};
