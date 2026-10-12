import React, { useState, useMemo } from 'react';
import { Inventory, InventoryLogEntry, ActiveOrder } from '@/game/types';
import { INGREDIENT_DATABASE } from '@/game/data/ingredients';
import { DISH_RECIPES } from '@/game/data/recipes';
import { formatCurrency } from '@/utils/formatters';
import { calculateUsedCapacity, calculateInventoryValuation } from '@/game/engine/inventorySystem';
import { IngredientIcon } from '@/components/common/IngredientIcon';
import {
  Package,
  AlertTriangle,
  History,
  Store,
  Boxes,
  CircleDollarSign,
  Search,
  ArrowUpDown,
  AlertCircle,
  Plus,
  Flame,
} from 'lucide-react';

interface InventoryPanelProps {
  inventory: Inventory;
  inventoryLogs: InventoryLogEntry[];
  cash: number;
  maxCapacity: number;
  activeOrders?: ActiveOrder[];
  onBuyIngredient: (ingredientId: string, packagesCount: number) => { success: boolean; message: string };
  onOpenRestockModal?: (ingredientId?: string) => void;
}

export const InventoryPanel: React.FC<InventoryPanelProps> = ({
  inventory,
  inventoryLogs,
  cash,
  maxCapacity,
  activeOrders = [],
  onBuyIngredient,
  onOpenRestockModal,
}) => {
  const [activeTab, setActiveTab] = useState<'market' | 'logs'>('market');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'low_stock' | 'name' | 'highest'>('low_stock');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const usedCapacity = calculateUsedCapacity(inventory);
  const totalValuation = calculateInventoryValuation(inventory);
  const capacityPercent = Math.min(100, Math.round((usedCapacity / maxCapacity) * 100));

  // Tính số lượng nguyên liệu cần thiết cho các đơn hàng đang chờ
  const neededForPendingOrders = useMemo(() => {
    const map: Record<string, number> = {};
    activeOrders
      .filter((o) => o.status === 'waiting')
      .forEach((order) => {
        order.items.forEach((item) => {
          const recipe = DISH_RECIPES[item.menuItemId];
          if (recipe) {
            recipe.ingredients.forEach((req) => {
              map[req.ingredientId] = (map[req.ingredientId] || 0) + req.amount * item.quantity;
            });
          }
        });
      });
    return map;
  }, [activeOrders]);

  const categories = [
    { id: 'all', label: 'Tất Cả' },
    { id: 'beverage', label: 'Đồ Uống' },
    { id: 'snack', label: 'Ăn Vặt & Mì' },
    { id: 'staple', label: 'Bánh Mì & Món No' },
    { id: 'spice_sauce', label: 'Gia Vị & Phụ Liệu' },
  ];

  // Thống kê tổng quan kho hàng
  const allIngredients = Object.values(INGREDIENT_DATABASE);
  const totalIngredientTypes = allIngredients.length;
  const outOfStockCount = allIngredients.filter((ing) => (inventory[ing.id] || 0) === 0).length;
  const lowStockCount = allIngredients.filter((ing) => {
    const qty = inventory[ing.id] || 0;
    return qty > 0 && qty <= ing.minWarningThreshold;
  }).length;

  // Lọc và sắp xếp nguyên liệu
  const filteredAndSortedList = useMemo(() => {
    return allIngredients
      .filter((ing) => {
        const matchCat = activeCategory === 'all' || ing.category === activeCategory;
        const matchQuery = ing.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
        return matchCat && matchQuery;
      })
      .sort((a, b) => {
        const qtyA = inventory[a.id] || 0;
        const qtyB = inventory[b.id] || 0;

        if (sortBy === 'low_stock') {
          // Ưu tiên: hết hàng (0) -> sắp hết (<= min) -> còn nhiều
          const isCritA = qtyA === 0 ? -2 : qtyA <= a.minWarningThreshold ? -1 : 0;
          const isCritB = qtyB === 0 ? -2 : qtyB <= b.minWarningThreshold ? -1 : 0;
          if (isCritA !== isCritB) return isCritA - isCritB;
          return qtyA - qtyB;
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'highest') {
          return qtyB - qtyA;
        }
        return 0;
      });
  }, [allIngredients, activeCategory, searchQuery, sortBy, inventory]);

  const handleQuickBuy = (ingredientId: string, count: number = 1) => {
    if (onOpenRestockModal) {
      onOpenRestockModal(ingredientId);
    } else {
      const res = onBuyIngredient(ingredientId, count);
      if (res.success) {
        setSuccessNotice(res.message);
        setErrorNotice(null);
        setTimeout(() => setSuccessNotice(null), 2500);
      } else {
        setErrorNotice(res.message);
        setSuccessNotice(null);
        setTimeout(() => setErrorNotice(null), 3500);
      }
    }
  };

  return (
    <div className="space-y-4 select-none">
      {/* ================= 1. BẢNG TỔNG QUAN KHO HÀNG (OVERVIEW TIÊU CHUẨN) ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Tổng số loại nguyên liệu */}
        <div className="bg-white/95 border-2 border-amber-900/15 rounded-2xl p-3 shadow-xs">
          <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
            <Boxes className="w-3.5 h-3.5 text-amber-600" /> Tổng Loại Hàng
          </span>
          <span className="text-lg font-black text-amber-950 block mt-0.5">
            {totalIngredientTypes} loại
          </span>
          <span className="text-[10px] text-amber-700">Đầy đủ thực đơn</span>
        </div>

        {/* Nguyên liệu đã hết */}
        <div className="bg-rose-50/90 border-2 border-rose-300 rounded-2xl p-3 shadow-xs">
          <span className="text-[11px] font-bold text-rose-800 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> Đã Hết Kho
          </span>
          <span className="text-lg font-black text-rose-950 block mt-0.5">
            {outOfStockCount} món
          </span>
          <span className="text-[10px] text-rose-700 font-medium">Cần nhập ngay lập tức</span>
        </div>

        {/* Nguyên liệu sắp hết */}
        <div className="bg-amber-50/90 border-2 border-amber-300 rounded-2xl p-3 shadow-xs">
          <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Sắp Hết Hàng
          </span>
          <span className="text-lg font-black text-amber-950 block mt-0.5">
            {lowStockCount} món
          </span>
          <span className="text-[10px] text-amber-700 font-medium">Dưới ngưỡng tối thiểu</span>
        </div>

        {/* Tổng giá trị kho hàng */}
        <div className="bg-emerald-50/90 border-2 border-emerald-300 rounded-2xl p-3 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
            <CircleDollarSign className="w-3.5 h-3.5 text-emerald-600" /> Giá Trị Tồn Kho
          </span>
          <span className="text-base md:text-lg font-black text-emerald-950 block mt-0.5 truncate">
            {formatCurrency(totalValuation)}
          </span>
          <span className="text-[10px] text-emerald-700">Tính theo giá vốn</span>
        </div>
      </div>

      {/* Sức chứa kho & Thông báo */}
      <div className="bg-amber-100/70 border border-amber-300 rounded-2xl p-3 shadow-xs space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold text-amber-900">
          <span className="flex items-center gap-1.5">
            <Package className="w-4 h-4 text-amber-700" /> Sức Chứa Kho Hàng
          </span>
          <span className="font-black text-amber-950">
            {usedCapacity} / {maxCapacity} phần ({capacityPercent}%)
          </span>
        </div>
        <div className="w-full bg-white/80 h-2.5 rounded-full overflow-hidden border border-amber-300">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              capacityPercent >= 90
                ? 'bg-rose-500'
                : capacityPercent >= 70
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${capacityPercent}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center text-[10px] text-amber-800">
          <span>{capacityPercent >= 90 ? '⚠️ Kho gần đầy!' : `Còn trống ${maxCapacity - usedCapacity} chỗ`}</span>
          <span>Tiền mặt sẵn sàng: <strong className="text-emerald-700">{formatCurrency(cash)}</strong></span>
        </div>
      </div>

      {/* Thông báo thao tác */}
      {successNotice && (
        <div className="bg-emerald-100 border border-emerald-400 text-emerald-900 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5">
          {successNotice}
        </div>
      )}
      {errorNotice && (
        <div className="bg-rose-100 border border-rose-400 text-rose-900 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5">
          {errorNotice}
        </div>
      )}

      {/* ================= 2. TAB ĐIỀU HƯỚNG: QUẢN LÝ KHO VS NHẬT KÝ ================= */}
      <div className="flex items-center justify-between border-b border-amber-200 pb-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('market')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs md:text-sm font-black transition-all ${
              activeTab === 'market'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white/80 text-amber-900 hover:bg-amber-100'
            }`}
          >
            <Boxes className="w-4 h-4" />
            Thẻ Nguyên Liệu Trong Kho ({filteredAndSortedList.length})
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs md:text-sm font-black transition-all ${
              activeTab === 'logs'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white/80 text-amber-900 hover:bg-amber-100'
            }`}
          >
            <History className="w-4 h-4" />
            Nhật Ký Nhập & Tiêu Thụ ({inventoryLogs.length})
          </button>
        </div>

        {onOpenRestockModal && (
          <button
            onClick={() => onOpenRestockModal()}
            className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1 transition-all active:scale-95"
          >
            <Store className="w-3.5 h-3.5" /> Chợ Đầu Mối
          </button>
        )}
      </div>

      {/* ================= TAB 1: DANH SÁCH THẺ NGUYÊN LIỆU KHO ================= */}
      {activeTab === 'market' && (
        <div className="space-y-3">
          {/* Thanh tìm kiếm, phân nhóm và sắp xếp */}
          <div className="flex flex-col sm:flex-row gap-2 justify-between items-stretch sm:items-center">
            {/* Lọc danh mục */}
            <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeCategory === cat.id
                      ? 'bg-amber-600 text-white shadow-xs font-black'
                      : 'bg-white/90 hover:bg-amber-100 text-amber-900 border border-amber-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Tìm kiếm & Sắp xếp */}
            <div className="flex items-center gap-1.5">
              <div className="relative flex-1 sm:w-44">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-amber-700" />
                <input
                  type="text"
                  placeholder="Tìm nguyên liệu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-8 pr-2.5 py-1.5 bg-white rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center gap-1 text-xs bg-white px-2 py-1.5 rounded-xl border border-amber-300 flex-shrink-0">
                <ArrowUpDown className="w-3.5 h-3.5 text-amber-700" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs font-bold text-amber-950 focus:outline-none cursor-pointer"
                >
                  <option value="low_stock">Sắp hết lên đầu</option>
                  <option value="name">Tên A-Z</option>
                  <option value="highest">Nhiều nhất</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lưới thẻ nguyên liệu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredAndSortedList.map((ing) => {
              const currentQty = inventory[ing.id] || 0;
              const isOutOfStock = currentQty === 0;
              const isLowStock = currentQty > 0 && currentQty <= ing.minWarningThreshold;
              const neededAmount = neededForPendingOrders[ing.id] || 0;
              const isShortageForOrders = neededAmount > currentQty;

              return (
                <div
                  key={ing.id}
                  className={`bg-white/95 border-2 rounded-2xl p-3 flex flex-col justify-between shadow-xs transition-all ${
                    isOutOfStock
                      ? 'border-rose-500 bg-rose-50/30'
                      : isShortageForOrders
                      ? 'border-orange-500 bg-orange-50/20'
                      : isLowStock
                      ? 'border-amber-400 bg-amber-50/20'
                      : 'border-amber-900/15'
                  }`}
                >
                  <div>
                    {/* Header thẻ: Icon & Tên */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-11 h-11 flex-shrink-0 bg-amber-50 rounded-xl p-1 border border-amber-200/80 shadow-inner flex items-center justify-center">
                          <IngredientIcon ingredientId={ing.id} size="sm" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-black text-sm text-amber-950 leading-tight truncate">
                            {ing.name}
                          </h4>
                          <span className="text-[10px] text-amber-700 font-medium block">
                            Đơn vị: {ing.unit}
                          </span>
                        </div>
                      </div>

                      {/* Badge cảnh báo */}
                      {isOutOfStock ? (
                        <span className="bg-rose-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md flex-shrink-0 animate-pulse">
                          HẾT HÀNG
                        </span>
                      ) : isShortageForOrders ? (
                        <span className="bg-orange-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md flex-shrink-0">
                          THIẾU ĐƠN
                        </span>
                      ) : isLowStock ? (
                        <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-1.5 py-0.5 rounded-md flex-shrink-0">
                          SẮP HẾT
                        </span>
                      ) : null}
                    </div>

                    {/* Chỉ số tồn kho & nhu cầu đơn */}
                    <div className="mt-2.5 p-2 bg-amber-50/70 rounded-xl border border-amber-200/60 space-y-1 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-amber-800 font-bold">Tồn kho hiện có:</span>
                        <span className={`font-black ${isOutOfStock ? 'text-rose-600 text-sm' : 'text-amber-950'}`}>
                          {currentQty} {ing.unit}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-amber-700">Mức tối thiểu:</span>
                        <span className="font-extrabold text-amber-900">{ing.minWarningThreshold} {ing.unit}</span>
                      </div>

                      {neededAmount > 0 && (
                        <div className="flex justify-between items-center pt-0.5 border-t border-amber-200/50 text-[11px]">
                          <span className="text-orange-900 font-bold flex items-center gap-0.5">
                            <Flame className="w-3 h-3 text-orange-600" /> Cần cho đơn chờ:
                          </span>
                          <span className={`font-black ${isShortageForOrders ? 'text-rose-600 font-black' : 'text-emerald-700'}`}>
                            {neededAmount} {ing.unit} {isShortageForOrders ? `(Thiếu ${neededAmount - currentQty})` : '(Đủ)'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Chân thẻ: Giá nhập & Nút Nhập Hàng */}
                  <div className="mt-3 pt-2 border-t border-amber-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-amber-700 block">Giá nhập đại lý:</span>
                      <span className="font-black text-xs text-emerald-800">
                        {formatCurrency(ing.costPerUnit)}/gói
                      </span>
                    </div>

                    <button
                      onClick={() => handleQuickBuy(ing.id, 1)}
                      className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-black text-xs px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" /> Nhập Hàng
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 2: NHẬT KÝ NHẬP & TIÊU THỤ NGUYÊN LIỆU ================= */}
      {activeTab === 'logs' && (
        <div className="bg-white/95 rounded-2xl border-2 border-amber-900/15 p-3.5 shadow-xs space-y-2">
          <h4 className="font-black text-sm text-amber-950 flex items-center gap-1.5">
            <History className="w-4 h-4 text-amber-700" /> Lịch Sử Xuất Nhập Kho Gần Đây
          </h4>

          {inventoryLogs.length === 0 ? (
            <div className="text-center py-8 text-amber-800/60 text-xs italic">
              Chưa có lịch sử xuất nhập nguyên liệu nào.
            </div>
          ) : (
            <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
              {inventoryLogs.map((log) => {
                const isPurchase = log.type === 'purchase';
                return (
                  <div
                    key={log.id}
                    className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                      isPurchase
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        : 'bg-amber-50/70 border-amber-200 text-amber-950'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-black text-[10px] px-1.5 py-0.2 rounded uppercase ${
                          isPurchase ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
                        }`}>
                          {isPurchase ? 'Nhập Kho' : 'Chế Biến'}
                        </span>
                        <span className="font-extrabold">{log.itemName}</span>
                      </div>
                      <span className="text-[10px] text-amber-800/80 block mt-0.5">
                        Ngày {log.day} • {log.note}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className={`font-black block ${log.quantityChange > 0 ? 'text-emerald-700' : 'text-amber-800'}`}>
                        {log.quantityChange > 0 ? `+${log.quantityChange}` : log.quantityChange}
                      </span>
                      {log.costChange !== 0 && (
                        <span className="text-[10px] text-amber-700">
                          {formatCurrency(log.costChange)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
