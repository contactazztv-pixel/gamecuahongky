import React, { useState, useMemo } from 'react';
import { Inventory, InventoryLogEntry, ActiveOrder, IngredientItem } from '@/game/types';
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
  LayoutList,
  LayoutGrid,
  CheckCircle2,
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

/**
 * Định dạng chuỗi hiển thị tồn kho tự nhiên tiếng Việt
 * Ví dụ: "còn 5 phần", "còn 12 quả", "hết hàng"
 */
function getStockDisplayText(ing: IngredientItem, qty: number): string {
  if (qty <= 0) {
    return 'hết hàng';
  }
  let unitName = 'phần';
  if (ing.id.includes('trung')) unitName = 'quả';
  else if (ing.id.includes('banh_mi')) unitName = 'ổ';
  else if (ing.id.includes('xuc_xich')) unitName = 'cây';
  else if (ing.id.includes('ly')) unitName = 'cái';

  return `còn ${qty} ${unitName}`;
}

export const InventoryPanel: React.FC<InventoryPanelProps> = React.memo(({
  inventory,
  inventoryLogs,
  cash,
  maxCapacity,
  activeOrders = [],
  onBuyIngredient,
  onOpenRestockModal,
}) => {
  const [activeTab, setActiveTab] = useState<'market' | 'logs'>('market');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list'); // Mặc định là danh sách thoáng
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
    <div className="space-y-4 select-none font-sans">
      {/* ================= 1. BẢNG TỔNG QUAN KHO HÀNG (PASTEL WARM) ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Tổng số loại nguyên liệu */}
        <div className="bg-[#FAF7F2] border border-[#E8DEC8] rounded-2xl p-3 shadow-xs">
          <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
            <Boxes className="w-3.5 h-3.5 text-amber-600" /> Tổng Loại Hàng
          </span>
          <span className="text-lg font-black text-amber-950 block mt-0.5">
            {totalIngredientTypes} loại
          </span>
          <span className="text-[10px] text-amber-800/80">Đầy đủ thực đơn 2D</span>
        </div>

        {/* Nguyên liệu đã hết */}
        <div className="bg-rose-50/80 border border-rose-200 rounded-2xl p-3 shadow-xs">
          <span className="text-[11px] font-bold text-rose-800 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> Đã Hết Kho
          </span>
          <span className="text-lg font-black text-rose-950 block mt-0.5">
            {outOfStockCount} món
          </span>
          <span className="text-[10px] text-rose-700 font-medium">Cần nhập sớm</span>
        </div>

        {/* Nguyên liệu sắp hết */}
        <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-3 shadow-xs">
          <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Sắp Hết Hàng
          </span>
          <span className="text-lg font-black text-amber-950 block mt-0.5">
            {lowStockCount} món
          </span>
          <span className="text-[10px] text-amber-700 font-medium">Dưới ngưỡng tối thiểu</span>
        </div>

        {/* Tổng giá trị kho hàng */}
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
            <CircleDollarSign className="w-3.5 h-3.5 text-emerald-600" /> Giá Trị Tồn Kho
          </span>
          <span className="text-base md:text-lg font-black text-emerald-950 block mt-0.5 truncate">
            {formatCurrency(totalValuation)}
          </span>
          <span className="text-[10px] text-emerald-700">Theo giá vốn nhập</span>
        </div>
      </div>

      {/* Sức chứa kho & Thông báo */}
      <div className="bg-[#FAF7F2] border border-[#E8DEC8] rounded-2xl p-3.5 shadow-xs space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold text-amber-900">
          <span className="flex items-center gap-1.5">
            <Package className="w-4 h-4 text-amber-700" /> Sức Chứa Kho Hàng
          </span>
          <span className="font-black text-amber-950">
            {usedCapacity} / {maxCapacity} phần ({capacityPercent}%)
          </span>
        </div>
        <div className="w-full bg-[#EFE9DC] h-2.5 rounded-full overflow-hidden border border-[#E0D5C1]">
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
          <span>{capacityPercent >= 90 ? '⚠️ Kho sắp đầy!' : `Còn trống ${maxCapacity - usedCapacity} chỗ`}</span>
          <span>Tiền mặt hiện có: <strong className="text-emerald-700">{formatCurrency(cash)}</strong></span>
        </div>
      </div>

      {/* Thông báo thao tác */}
      {successNotice && (
        <div className="bg-emerald-100 border border-emerald-400 text-emerald-900 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" /> {successNotice}
        </div>
      )}
      {errorNotice && (
        <div className="bg-rose-100 border border-rose-400 text-rose-900 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-xs">
          <AlertCircle className="w-4 h-4 text-rose-700" /> {errorNotice}
        </div>
      )}

      {/* ================= 2. TAB ĐIỀU HƯỚNG: QUẢN LÝ KHO VS NHẬT KÝ ================= */}
      <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('market')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs md:text-sm font-black transition-all ${
              activeTab === 'market'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'bg-[#FAF7F2] text-amber-950 hover:bg-[#F3ECE0] border border-[#E8DEC8]'
            }`}
          >
            <Boxes className="w-4 h-4" />
            Nguyên Liệu Trong Kho ({filteredAndSortedList.length})
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs md:text-sm font-black transition-all ${
              activeTab === 'logs'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'bg-[#FAF7F2] text-amber-950 hover:bg-[#F3ECE0] border border-[#E8DEC8]'
            }`}
          >
            <History className="w-4 h-4" />
            Nhật Ký Nhập & Xuất ({inventoryLogs.length})
          </button>
        </div>

        {onOpenRestockModal && (
          <button
            onClick={() => onOpenRestockModal()}
            className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-black px-3.5 py-1.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Store className="w-3.5 h-3.5" /> Chợ Đầu Mối
          </button>
        )}
      </div>

      {/* ================= TAB 1: DANH SÁCH NGUYÊN LIỆU KHO ================= */}
      {activeTab === 'market' && (
        <div className="space-y-3">
          {/* Thanh tìm kiếm, phân nhóm, chế độ xem & sắp xếp */}
          <div className="flex flex-col sm:flex-row gap-2 justify-between items-stretch sm:items-center">
            {/* Lọc danh mục */}
            <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeCategory === cat.id
                      ? 'bg-amber-700 text-white shadow-xs font-black'
                      : 'bg-[#FAF7F2] hover:bg-[#F3ECE0] text-amber-950 border border-[#E8DEC8]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Tìm kiếm, chế độ xem & Sắp xếp */}
            <div className="flex items-center gap-1.5">
              {/* Nút chuyển chế độ xem List / Grid */}
              <div className="flex items-center bg-[#FAF7F2] border border-[#E8DEC8] rounded-xl p-0.5">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === 'list' ? 'bg-amber-700 text-white shadow-xs' : 'text-amber-800 hover:bg-amber-100/50'
                  }`}
                  title="Xem dạng danh sách thoáng"
                >
                  <LayoutList className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === 'grid' ? 'bg-amber-700 text-white shadow-xs' : 'text-amber-800 hover:bg-amber-100/50'
                  }`}
                  title="Xem dạng ô vuông"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Ô tìm kiếm */}
              <div className="relative flex-1 sm:w-40">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-amber-700" />
                <input
                  type="text"
                  placeholder="Tìm nguyên liệu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-8 pr-2.5 py-1.5 bg-[#FAF7F2] rounded-xl border border-[#E8DEC8] focus:outline-none focus:ring-2 focus:ring-amber-500 text-amber-950 placeholder-amber-800/50"
                />
              </div>

              {/* Sắp xếp */}
              <div className="flex items-center gap-1 text-xs bg-[#FAF7F2] px-2 py-1.5 rounded-xl border border-[#E8DEC8] flex-shrink-0">
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

          {/* ================= CHẾ ĐỘ XEM 1: DẠNG DANH SÁCH THOÁNG (LIST VIEW - CHUẨN THIẾT KẾ YÊU CẦU) ================= */}
          {viewMode === 'list' && (
            <div className="bg-[#FAF7F2] border border-[#E8DEC8] rounded-3xl p-3 sm:p-4 shadow-sm divide-y divide-[#EBE4D5]">
              {filteredAndSortedList.map((ing) => {
                const currentQty = inventory[ing.id] || 0;
                const isOutOfStock = currentQty === 0;
                const isLowStock = currentQty > 0 && currentQty <= ing.minWarningThreshold;
                const neededAmount = neededForPendingOrders[ing.id] || 0;
                const isShortageForOrders = neededAmount > currentQty;
                const stockText = getStockDisplayText(ing, currentQty);

                return (
                  <div
                    key={ing.id}
                    className="py-3 sm:py-3.5 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group transition-colors virtual-item"
                  >
                    {/* Cụm bên trái: Ảnh minh họa 2D trong ô vuông be nhạt + Tên in đậm + Tồn kho */}
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      {/* Ô vuông bo tròn màu be nhạt chứa minh họa chính giữa */}
                      <IngredientIcon
                        ingredientId={ing.id}
                        size="lg"
                        className="w-14 h-14 sm:w-16 sm:h-16 shrink-0"
                      />

                      {/* Thông tin tên và tồn kho */}
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-black text-sm sm:text-base text-[#3E2723] tracking-tight">
                            {ing.name}
                          </h4>
                          {isOutOfStock ? (
                            <span className="bg-rose-100 border border-rose-300 text-rose-700 text-[10px] font-black px-2 py-0.5 rounded-full">
                              Hết Hàng
                            </span>
                          ) : isShortageForOrders ? (
                            <span className="bg-orange-100 border border-orange-300 text-orange-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                              Thiếu Đơn
                            </span>
                          ) : isLowStock ? (
                            <span className="bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Sắp Hết
                            </span>
                          ) : null}
                        </div>

                        {/* Dòng tồn kho: "Mì sợi — còn 5 phần." hoặc "Trân châu — hết hàng." */}
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                          <span className="font-extrabold text-stone-700">
                            {ing.name.split(' ')[0]} —{' '}
                            <span
                              className={`font-black ${
                                isOutOfStock
                                  ? 'text-rose-600'
                                  : isShortageForOrders
                                  ? 'text-orange-600'
                                  : 'text-emerald-700'
                              }`}
                            >
                              {stockText}
                            </span>
                            .
                          </span>
                          <span className="text-[11px] text-stone-600 hidden md:inline">
                            (Mức chuẩn an toàn: {ing.minWarningThreshold} {ing.unit})
                          </span>
                        </div>

                        {/* Cảnh báo thiếu nguyên liệu cho đơn hàng thực tế */}
                        {neededAmount > 0 && (
                          <div className="flex items-center gap-1.5 text-[11px] text-orange-900 bg-orange-100/70 border border-orange-300 px-2.5 py-1 rounded-xl max-w-fit">
                            <Flame className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                            <span>
                              Cần cho đơn: <strong>{neededAmount} {ing.unit}</strong> • Hiện có:{' '}
                              <strong>{currentQty} {ing.unit}</strong>{' '}
                              {isShortageForOrders ? (
                                <span className="text-rose-700 font-black">
                                  (Thiếu {neededAmount - currentQty})
                                </span>
                              ) : (
                                <span className="text-emerald-700 font-bold">(Đủ giao)</span>
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Cụm bên phải: Giá đại lý & Nút nhập hàng */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-1 sm:pt-0">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-stone-600 block">Quy cách & Giá:</span>
                        <span className="font-black text-xs text-emerald-800 block">
                          {formatCurrency(ing.costPerUnit)} / {ing.packageSize} {ing.unit}
                        </span>
                      </div>

                      <button
                        onClick={() => handleQuickBuy(ing.id, 1)}
                        className={`px-3.5 py-2 rounded-2xl text-xs font-black shadow-xs flex items-center gap-1.5 transition-all active:scale-95 ${
                          isOutOfStock || isShortageForOrders
                            ? 'bg-orange-500 hover:bg-orange-600 text-white animate-bounce-gentle'
                            : 'bg-[#F2ECE1] hover:bg-[#E8DFC8] text-[#3E2723] border border-[#DCD0B6]'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{isOutOfStock ? 'Nhập Ngay' : 'Nhập Hàng'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ================= CHẾ ĐỘ XEM 2: DẠNG LƯỚI Ô VUÔNG KỆ HÀNG (GRID VIEW) ================= */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredAndSortedList.map((ing) => {
                const currentQty = inventory[ing.id] || 0;
                const isOutOfStock = currentQty === 0;
                const isLowStock = currentQty > 0 && currentQty <= ing.minWarningThreshold;
                const neededAmount = neededForPendingOrders[ing.id] || 0;
                const isShortageForOrders = neededAmount > currentQty;
                const stockText = getStockDisplayText(ing, currentQty);

                return (
                  <div
                    key={ing.id}
                    className={`bg-[#FAF7F2] border rounded-2xl p-3 flex flex-col justify-between shadow-xs transition-all virtual-item ${
                      isOutOfStock
                        ? 'border-rose-300 bg-rose-50/40'
                        : isShortageForOrders
                        ? 'border-orange-300 bg-orange-50/40'
                        : isLowStock
                        ? 'border-amber-300 bg-amber-50/30'
                        : 'border-[#E8DEC8]'
                    }`}
                  >
                    <div>
                      {/* Header ô */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <IngredientIcon ingredientId={ing.id} size="md" />
                          <div className="min-w-0">
                            <h4 className="font-black text-sm text-[#3E2723] leading-tight truncate">
                              {ing.name}
                            </h4>
                            <span className="text-[11px] font-bold text-stone-700 block mt-0.5">
                              {stockText}
                            </span>
                          </div>
                        </div>

                        {isOutOfStock ? (
                          <span className="bg-rose-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md flex-shrink-0">
                            HẾT
                          </span>
                        ) : isShortageForOrders ? (
                          <span className="bg-orange-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md flex-shrink-0">
                            THIẾU
                          </span>
                        ) : null}
                      </div>

                      {/* Cảnh báo đơn chờ */}
                      {neededAmount > 0 && (
                        <div className="mt-2 p-1.5 bg-orange-100/60 rounded-xl border border-orange-200 text-[11px] text-orange-950">
                          Cần {neededAmount} {ing.unit} • Có {currentQty} {ing.unit}{' '}
                          {isShortageForOrders && <strong className="text-rose-600">(Thiếu {neededAmount - currentQty})</strong>}
                        </div>
                      )}
                    </div>

                    {/* Chân thẻ */}
                    <div className="mt-3 pt-2 border-t border-[#E8DEC8] flex items-center justify-between">
                      <span className="font-black text-xs text-emerald-800">
                        {formatCurrency(ing.costPerUnit)}/gói
                      </span>

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
          )}
        </div>
      )}

      {/* ================= TAB 2: NHẬT KÝ NHẬP & TIÊU THỤ NGUYÊN LIỆU ================= */}
      {activeTab === 'logs' && (
        <div className="bg-[#FAF7F2] rounded-3xl border border-[#E8DEC8] p-4 shadow-xs space-y-2">
          <h4 className="font-black text-sm text-[#3E2723] flex items-center gap-1.5">
            <History className="w-4 h-4 text-amber-700" /> Lịch Sử Xuất Nhập Kho Gần Đây
          </h4>

          {inventoryLogs.length === 0 ? (
            <div className="text-center py-8 text-stone-600 text-xs italic">
              Chưa có lịch sử xuất nhập nguyên liệu nào.
            </div>
          ) : (
            <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
              {inventoryLogs.map((log) => {
                const isPurchase = log.type === 'purchase';
                return (
                  <div
                    key={log.id}
                    className={`p-2.5 rounded-2xl border text-xs flex items-center justify-between gap-2 ${
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
                      <span className="text-[10px] text-stone-600 block mt-0.5">
                        Ngày {log.day} • {log.note}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className={`font-black block ${log.quantityChange > 0 ? 'text-emerald-700' : 'text-amber-800'}`}>
                        {log.quantityChange > 0 ? `+${log.quantityChange}` : log.quantityChange}
                      </span>
                      {log.costChange !== 0 && (
                        <span className="text-[10px] text-stone-600">
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
});
