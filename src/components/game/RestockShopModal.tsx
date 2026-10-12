import React, { useState, useEffect } from 'react';
import { Inventory, ActiveOrder } from '@/game/types';
import { INGREDIENT_DATABASE } from '@/game/data/ingredients';
import { DISH_RECIPES } from '@/game/data/recipes';
import { formatCurrency } from '@/utils/formatters';
import { GameButton } from '@/components/ui/GameButton';
import { IngredientIcon } from '@/components/common/IngredientIcon';
import { soundManager } from '@/services/audio/soundEffects';
import {
  X,
  ShoppingCart,
  Plus,
  Minus,
  Check,
  AlertTriangle,
  Store,
  Boxes,
  Zap,
  Trash2,
} from 'lucide-react';

interface RestockShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: Inventory;
  cash: number;
  maxCapacity: number;
  activeOrders: ActiveOrder[];
  initialIngredientId?: string | null;
  initialNeededAmount?: number;
  onConfirmPurchase: (cart: { ingredientId: string; quantity: number }[]) => {
    success: boolean;
    message: string;
  };
}

export const RestockShopModal: React.FC<RestockShopModalProps> = ({
  isOpen,
  onClose,
  inventory,
  cash,
  maxCapacity,
  activeOrders,
  initialIngredientId,
  initialNeededAmount = 1,
  onConfirmPurchase,
}) => {
  if (!isOpen) return null;

  // Giỏ hàng lưu: ingredientId -> số gói/phần muốn mua
  const [cart, setCart] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackNotice, setFeedbackNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Nếu mở từ một đơn hàng thiếu cụ thể
  useEffect(() => {
    if (initialIngredientId && INGREDIENT_DATABASE[initialIngredientId]) {
      const ing = INGREDIENT_DATABASE[initialIngredientId];
      // Tính số gói tối thiểu cần mua để bù số lượng thiếu
      const packagesNeeded = Math.max(1, Math.ceil(initialNeededAmount / (ing.packageSize || 1)));
      setCart({ [initialIngredientId]: packagesNeeded });
    }
  }, [initialIngredientId, initialNeededAmount]);

  const categories = [
    { id: 'all', label: 'Tất Cả' },
    { id: 'beverage', label: 'Đồ Uống' },
    { id: 'snack', label: 'Ăn Vặt & Mì' },
    { id: 'staple', label: 'Bánh Mì & Món No' },
    { id: 'spice_sauce', label: 'Gia Vị & Phụ Liệu' },
  ];

  // Tính tổng dung lượng hiện dùng
  const usedCapacity = Object.values(inventory).reduce((sum, qty) => sum + qty, 0);

  // Danh sách nguyên liệu hiển thị
  const ingredientsList = Object.values(INGREDIENT_DATABASE).filter((ing) => {
    const matchCat = activeCategory === 'all' || ing.category === activeCategory;
    const matchQuery = ing.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
    return matchCat && matchQuery;
  });

  // Tăng / giảm số lượng trong giỏ
  const handleUpdateCart = (ingredientId: string, delta: number) => {
    soundManager.playClick();
    setCart((prev) => {
      const cur = prev[ingredientId] || 0;
      const next = Math.max(0, cur + delta);
      if (next === 0) {
        const { [ingredientId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [ingredientId]: next };
    });
  };

  const handleClearCart = () => {
    soundManager.playClick();
    setCart({});
  };

  // Tính toán tổng tiền hóa đơn giỏ hàng
  let totalBill = 0;
  let totalIncomingCapacity = 0;

  Object.entries(cart).forEach(([ingId, count]) => {
    const ing = INGREDIENT_DATABASE[ingId];
    if (ing) {
      totalBill += ing.costPerUnit * count;
      totalIncomingCapacity += ing.packageSize * count;
    }
  });

  // Tính năng "Nhập nhanh nguyên liệu thiếu": Tự động tính số lượng thiếu trong tất cả đơn chờ
  const handleAutoFillMissing = () => {
    soundManager.playClick();
    const neededMap: Record<string, number> = {};

    activeOrders
      .filter((o) => o.status === 'waiting')
      .forEach((order) => {
        order.items.forEach((item) => {
          const recipe = DISH_RECIPES[item.menuItemId];
          if (recipe) {
            recipe.ingredients.forEach((req) => {
              neededMap[req.ingredientId] = (neededMap[req.ingredientId] || 0) + req.amount * item.quantity;
            });
          }
        });
      });

    const newCart: Record<string, number> = {};
    let missingFoundCount = 0;

    Object.entries(neededMap).forEach(([ingId, needed]) => {
      const inStock = inventory[ingId] || 0;
      if (inStock < needed) {
        const missing = needed - inStock;
        const ing = INGREDIENT_DATABASE[ingId];
        const packageSize = ing?.packageSize || 1;
        const packagesToBuy = Math.ceil(missing / packageSize);
        newCart[ingId] = Math.max(1, packagesToBuy);
        missingFoundCount++;
      }
    });

    if (missingFoundCount > 0) {
      setCart(newCart);
      setFeedbackNotice({
        type: 'success',
        message: `Đã tự động thêm ${missingFoundCount} nguyên liệu còn thiếu vào giỏ hàng!`,
      });
      setTimeout(() => setFeedbackNotice(null), 3000);
    } else {
      setFeedbackNotice({
        type: 'success',
        message: 'Tất cả các đơn chờ hiện tại đều đã đủ nguyên liệu, không cần nhập thêm!',
      });
      setTimeout(() => setFeedbackNotice(null), 3000);
    }
  };

  // Xác nhận nhập hàng
  const handleConfirm = () => {
    const itemsToBuy = Object.entries(cart).map(([ingredientId, quantity]) => ({
      ingredientId,
      quantity,
    }));

    if (itemsToBuy.length === 0) {
      setFeedbackNotice({ type: 'error', message: 'Giỏ hàng của bạn đang trống!' });
      setTimeout(() => setFeedbackNotice(null), 2500);
      return;
    }

    // Kiểm tra tiền trước
    if (cash < totalBill) {
      const shortage = totalBill - cash;
      soundManager.playWarningBuzz();
      setFeedbackNotice({
        type: 'error',
        message: `Bạn chưa đủ tiền để nhập hàng. Bạn còn thiếu ${formatCurrency(shortage)}!`,
      });
      return;
    }

    // Kiểm tra sức chứa kho
    if (usedCapacity + totalIncomingCapacity > maxCapacity) {
      soundManager.playWarningBuzz();
      setFeedbackNotice({
        type: 'error',
        message: `Sức chứa kho không đủ! Vượt quá ${(usedCapacity + totalIncomingCapacity) - maxCapacity} phần. Hãy nâng cấp kệ kho!`,
      });
      return;
    }

    const result = onConfirmPurchase(itemsToBuy);
    if (result.success) {
      soundManager.playSuccessFanfare();
      setFeedbackNotice({ type: 'success', message: result.message });
      setCart({});
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      soundManager.playWarningBuzz();
      setFeedbackNotice({ type: 'error', message: result.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/70 backdrop-blur-xs select-none animate-in fade-in">
      <div className="w-full max-w-4xl bg-white rounded-3xl border-4 border-amber-900/30 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* ================= HEADER ================= */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shadow-inner">
              <Store className="w-5 h-5 text-yellow-200" />
            </div>
            <div>
              <h3 className="font-black text-base md:text-lg leading-tight">
                Chợ Đầu Mối • Cửa Hàng Nhập Nguyên Liệu
              </h3>
              <p className="text-[11px] text-amber-100 font-medium">
                Giá gốc từ nhà phân phối • Giao ngay lập tức vào kho
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ================= THANH TỔNG QUAN VỐN & SỨC CHỨA ================= */}
        <div className="px-4 py-2.5 bg-amber-50 border-b border-amber-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-amber-900">
              Tiền mặt khả dụng:{' '}
              <span className="font-black text-emerald-700 text-sm">{formatCurrency(cash)}</span>
            </span>
            <span className="text-amber-300">|</span>
            <span className="font-bold text-amber-900 flex items-center gap-1">
              <Boxes className="w-3.5 h-3.5 text-amber-700" /> Kho: {usedCapacity} / {maxCapacity} phần
            </span>
          </div>

          <button
            onClick={handleAutoFillMissing}
            className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold px-3 py-1 rounded-xl text-[11px] shadow-sm flex items-center gap-1 transition-all active:scale-95"
            title="Tự động tính toán các nguyên liệu thiếu của đơn hàng và điền vào giỏ"
          >
            <Zap className="w-3.5 h-3.5 text-yellow-200 fill-yellow-200" />
            Nhập Nhanh Nguyên Liệu Thiếu
          </button>
        </div>

        {/* Thông báo thông điệp */}
        {feedbackNotice && (
          <div
            className={`px-4 py-2 text-xs font-black flex items-center gap-2 ${
              feedbackNotice.type === 'success'
                ? 'bg-emerald-100 text-emerald-900 border-b border-emerald-300'
                : 'bg-rose-100 text-rose-900 border-b border-rose-300'
            }`}
          >
            {feedbackNotice.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-700" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-700" />
            )}
            <span>{feedbackNotice.message}</span>
          </div>
        )}

        {/* ================= THÂN MODAL: DANH SÁCH HÀNG & GIỎ HÀNG ================= */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 overflow-hidden">
          {/* CỘT TRÁI (2 PHẦN): DANH SÁCH MẶT HÀNG NHÀ CUNG CẤP */}
          <div className="md:col-span-2 p-4 flex flex-col overflow-y-auto border-r border-amber-200 space-y-3">
            {/* Bộ lọc danh mục & Tìm kiếm */}
            <div className="flex flex-col sm:flex-row gap-2 justify-between">
              <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveCategory(c.id)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                      activeCategory === c.id
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-amber-100/70 text-amber-900 hover:bg-amber-200'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Tìm nguyên liệu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs px-3 py-1 bg-amber-50 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Lưới mặt hàng */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 flex-1 overflow-y-auto pr-1">
              {ingredientsList.map((ing) => {
                const countInCart = cart[ing.id] || 0;
                const inStock = inventory[ing.id] || 0;
                const isShortage = inStock <= ing.minWarningThreshold;

                return (
                  <div
                    key={ing.id}
                    className={`bg-white border-2 rounded-2xl p-2.5 flex items-center justify-between gap-2 shadow-xs transition-all ${
                      countInCart > 0
                        ? 'border-orange-500 bg-orange-50/20 ring-1 ring-orange-300'
                        : isShortage
                        ? 'border-rose-300 bg-rose-50/10'
                        : 'border-amber-900/15'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 p-1 flex items-center justify-center flex-shrink-0">
                        <IngredientIcon ingredientId={ing.id} size="sm" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-black text-xs text-amber-950 truncate leading-tight">
                          {ing.name}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-amber-800/80 mt-0.5">
                          <span>Kho: <strong>{inStock}</strong></span>
                          <span>•</span>
                          <span>+{ing.packageSize} {ing.unit}</span>
                        </div>
                        <span className="font-extrabold text-xs text-emerald-700 block mt-0.5">
                          {formatCurrency(ing.costPerUnit)}/gói
                        </span>
                      </div>
                    </div>

                    {/* Bộ nút chọn số lượng */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleUpdateCart(ing.id, -1)}
                        disabled={countInCart === 0}
                        className="w-6 h-6 rounded-lg bg-amber-100 hover:bg-amber-200 disabled:opacity-30 font-black text-amber-900 flex items-center justify-center transition-all"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center font-black text-xs text-amber-950">
                        {countInCart}
                      </span>
                      <button
                        onClick={() => handleUpdateCart(ing.id, 1)}
                        className="w-6 h-6 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-black flex items-center justify-center shadow-xs transition-all active:scale-95"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CỘT PHẢI (1 PHẦN): GIỎ HÀNG NHẬP HÀNG & XÁC NHẬN */}
          <div className="p-4 bg-amber-50/60 flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center justify-between border-b border-amber-200 pb-2 mb-2">
                <span className="font-black text-xs text-amber-950 flex items-center gap-1.5 uppercase">
                  <ShoppingCart className="w-4 h-4 text-amber-700" /> Giỏ Hàng Nhập
                </span>
                {Object.keys(cart).length > 0 && (
                  <button
                    onClick={handleClearCart}
                    className="text-[10px] text-rose-600 hover:text-rose-800 font-extrabold flex items-center gap-0.5"
                  >
                    <Trash2 className="w-3 h-3" /> Xóa giỏ
                  </button>
                )}
              </div>

              {/* Danh sách trong giỏ */}
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {Object.keys(cart).length === 0 ? (
                  <div className="text-center py-8 text-amber-800/60 text-xs italic">
                    Chưa có mặt hàng nào trong giỏ.<br />
                    Bấm dấu (+) để chọn nguyên liệu.
                  </div>
                ) : (
                  Object.entries(cart).map(([ingId, count]) => {
                    const ing = INGREDIENT_DATABASE[ingId];
                    if (!ing) return null;
                    const itemTotal = ing.costPerUnit * count;

                    return (
                      <div
                        key={ingId}
                        className="bg-white rounded-xl p-2 border border-amber-200 text-xs flex items-center justify-between shadow-2xs"
                      >
                        <div className="truncate pr-1">
                          <span className="font-extrabold text-amber-950 block truncate">
                            {ing.name}
                          </span>
                          <span className="text-[10px] text-amber-700">
                            {count} gói (+{count * ing.packageSize} {ing.unit})
                          </span>
                        </div>
                        <span className="font-black text-emerald-800 flex-shrink-0">
                          {formatCurrency(itemTotal)}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Tổng kết và nút xác nhận mua */}
            <div className="pt-3 border-t border-amber-200 space-y-2.5">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-amber-900 font-bold">
                  <span>Tổng tiền hàng:</span>
                  <span className="font-black text-sm text-emerald-800">
                    {formatCurrency(totalBill)}
                  </span>
                </div>
                <div className="flex justify-between text-amber-800 text-[11px]">
                  <span>Dung lượng tăng thêm:</span>
                  <span>+{totalIncomingCapacity} chỗ</span>
                </div>
              </div>

              <GameButton
                variant="primary"
                size="md"
                onClick={handleConfirm}
                disabled={Object.keys(cart).length === 0 || cash < totalBill}
                icon={<Check className="w-4 h-4 stroke-[3]" />}
                className="w-full text-sm font-black shadow-lg"
              >
                {cash < totalBill
                  ? `Thiếu ${formatCurrency(totalBill - cash)}`
                  : 'Xác Nhận Nhập Hàng'}
              </GameButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
