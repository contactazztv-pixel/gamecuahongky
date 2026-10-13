import React, { useState } from 'react';
import { MenuItem } from '@/game/types';
import { INGREDIENT_DATABASE } from '@/game/data/ingredients';
import { formatCurrency } from '@/utils/formatters';
import { Lock, Star, Clock, ChefHat, Eye, EyeOff, Plus, Minus } from 'lucide-react';
import { soundManager } from '@/services/audio/soundEffects';
import { DishIllustration } from '@/components/common/DishIllustration';

interface MenuPanelProps {
  menuItems: MenuItem[];
  onToggleEnabled: (itemId: string) => void;
  onUpdatePrice: (itemId: string, newPrice: number) => void;
}

export const MenuPanel: React.FC<MenuPanelProps> = ({
  menuItems,
  onToggleEnabled,
  onUpdatePrice,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Tất Cả' },
    { id: 'Đồ uống', label: 'Đồ Uống' },
    { id: 'Ăn vặt', label: 'Ăn Vặt & Mì' },
    { id: 'Món no', label: 'Món No & Bữa Sáng' },
  ];

  const filteredItems = menuItems.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const handlePriceChange = (item: MenuItem, delta: number) => {
    soundManager.playClick();
    const curPrice = item.customPrice || item.basePrice;
    onUpdatePrice(item.id, curPrice + delta);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base md:text-lg font-black text-amber-950 flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-amber-700" />
            Quản Lý Thực Đơn & Điều Chỉnh Giá Bán
          </h3>
          <p className="text-xs text-amber-800/80">
            Bạn có thể bật/tắt món đang bán và tùy chỉnh giá để tối ưu hóa doanh thu và mức độ hài lòng của khách.
          </p>
        </div>
      </div>

      {/* Bộ lọc danh mục */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeCategory === cat.id
                ? 'bg-amber-600 text-white shadow-sm font-extrabold'
                : 'bg-white/80 hover:bg-amber-100 text-amber-900 border border-amber-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid danh sách 24+ món */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredItems.map((item) => {
          const curPrice = item.customPrice || item.basePrice;
          const margin = curPrice - item.baseCost;
          const marginPercent = Math.round((margin / curPrice) * 100);
          const priceRatio = curPrice / item.basePrice;

          return (
            <div
              key={item.id}
              className={`relative rounded-2xl border-2 p-3.5 flex flex-col justify-between transition-all ${
                !item.unlocked
                  ? 'bg-amber-100/40 border-dashed border-amber-300 opacity-60'
                  : item.isEnabled === false
                  ? 'bg-slate-50 border-slate-300 opacity-75'
                  : 'bg-white/95 border-amber-900/15 shadow-sm'
              }`}
            >
              <div>
                {/* Header món & nút Bật/Tắt */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <DishIllustration itemId={item.id} size="md" className="shrink-0" />
                    <div>
                      <h4 className="font-black text-sm md:text-base text-amber-950 leading-tight">{item.name}</h4>
                      <span className="text-[10px] text-amber-700 font-semibold">{item.category}</span>
                    </div>
                  </div>

                  {item.unlocked ? (
                    <button
                      onClick={() => onToggleEnabled(item.id)}
                      className={`flex items-center gap-1 text-[11px] font-black px-2.5 py-1 min-h-[34px] rounded-xl transition-all cursor-pointer ${
                        item.isEnabled !== false
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                          : 'bg-slate-200 text-slate-700 border border-slate-300 hover:bg-slate-300'
                      }`}
                      title={item.isEnabled !== false ? 'Bấm để tạm ngưng bán món này' : 'Bấm để mở bán lại'}
                    >
                      {item.isEnabled !== false ? (
                        <>
                          <Eye className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Đang Bán</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                          <span>Tạm Ngưng</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-extrabold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-lg">
                      <Lock className="w-3 h-3" /> Cần Cấp {item.requiredLevel}
                    </span>
                  )}
                </div>

                <p className="text-xs text-amber-800/85 mt-1.5 leading-relaxed">
                  {item.description}
                </p>

                {/* Công thức nguyên liệu */}
                <div className="mt-2.5 pt-2 border-t border-amber-100">
                  <span className="text-[10px] font-bold text-amber-900 uppercase block mb-1">
                    Công thức:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {item.ingredients.map((req, i) => {
                      const ing = INGREDIENT_DATABASE[req.ingredientId];
                      return (
                        <span
                          key={i}
                          className="bg-amber-100 text-amber-900 text-[10px] font-semibold px-2 py-0.5 rounded-md"
                        >
                          {ing ? ing.name : req.ingredientId} x{req.amount}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Điều chỉnh giá bán (Price adjustment) */}
              {item.unlocked && (
                <div className="mt-3 pt-2.5 border-t border-amber-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-amber-700 block">Giá bán hiện tại:</span>
                      <span className="font-black text-emerald-800 text-sm md:text-base">
                        {formatCurrency(curPrice)}
                      </span>
                    </div>

                    {/* Nút tăng giảm giá */}
                    <div className="flex items-center gap-1 bg-amber-50 p-1 rounded-xl border border-amber-200">
                      <button
                        onClick={() => handlePriceChange(item, -1000)}
                        className="w-8 h-8 sm:w-7 sm:h-7 rounded-lg bg-white hover:bg-rose-100 text-amber-900 font-black flex items-center justify-center border border-amber-200 active:scale-95 transition-all cursor-pointer min-w-[32px] min-h-[32px]"
                        title="Giảm 1.000đ"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handlePriceChange(item, 1000)}
                        className="w-8 h-8 sm:w-7 sm:h-7 rounded-lg bg-white hover:bg-emerald-100 text-amber-900 font-black flex items-center justify-center border border-amber-200 active:scale-95 transition-all cursor-pointer min-w-[32px] min-h-[32px]"
                        title="Tăng 1.000đ"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Nhãn phản hồi nhu cầu học sinh */}
                  <div className="flex items-center justify-between text-[11px] pt-0.5">
                    <span className="text-amber-700">Lợi nhuận: <strong className="text-blue-700">~{marginPercent}%</strong></span>
                    {priceRatio > 1.1 ? (
                      <span className="text-orange-700 font-extrabold">Giá cao (Khách kén hơn)</span>
                    ) : priceRatio < 0.95 ? (
                      <span className="text-emerald-700 font-extrabold">Giá rẻ (Đông khách hơn)</span>
                    ) : (
                      <span className="text-slate-600 font-medium">Giá tiêu chuẩn</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
