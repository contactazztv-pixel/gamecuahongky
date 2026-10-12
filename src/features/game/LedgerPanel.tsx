import React from 'react';
import { FinancialLedger, ShopState, PlayerProfile, Inventory } from '@/game/types';
import { formatCurrency } from '@/utils/formatters';
import { calculateInventoryValuation } from '@/game/engine/inventorySystem';
import {
  LineChart,
  TrendingUp,
  TrendingDown,
  Coins,
  Package,
  Calendar,
  Receipt,
  AlertCircle,
} from 'lucide-react';

interface LedgerPanelProps {
  player: PlayerProfile;
  shop: ShopState;
  inventory: Inventory;
  dayRevenue: number;
  dayTips: number;
  dayCogs: number;
  dayPurchaseExpenses: number;
  dayUpgradeExpenses: number;
  dailyLedgers: FinancialLedger[];
  currentDay: number;
}

export const LedgerPanel: React.FC<LedgerPanelProps> = ({
  player,
  shop,
  inventory,
  dayRevenue,
  dayTips,
  dayCogs,
  dayPurchaseExpenses,
  dayUpgradeExpenses,
  dailyLedgers,
  currentDay,
}) => {
  const currentValuation = calculateInventoryValuation(inventory);
  // Lợi nhuận ngày tạm tính = (Doanh thu + Tips) - Giá vốn hàng bán (COGS) - Phí vận hành ngày
  const estimatedNetProfitToday = (dayRevenue + dayTips) - dayCogs - shop.dailyOperatingCost;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-base md:text-lg font-black text-amber-950 flex items-center gap-2">
          <LineChart className="w-5 h-5 text-amber-700" />
          Sổ Thu Chi & Báo Cáo Tài Chính
        </h3>
        <p className="text-xs text-amber-800/80">
          Minh bạch giữa Doanh thu và Lợi nhuận ròng. Giá vốn được tính theo đúng nguyên liệu thực tế đã tiêu thụ.
        </p>
      </div>

      {/* Thẻ tổng quan tài chính */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white/95 border border-amber-300 rounded-2xl p-3 shadow-sm">
          <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
            <Coins className="w-3.5 h-3.5 text-amber-600" /> Tiền Mặt Hiện Có
          </span>
          <span className="text-lg font-black text-emerald-800 block mt-1">
            {formatCurrency(shop.cash)}
          </span>
          <span className="text-[10px] text-amber-700/80">Khả dụng chi tiêu ngay</span>
        </div>

        <div className="bg-white/95 border border-amber-300 rounded-2xl p-3 shadow-sm">
          <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
            <Package className="w-3.5 h-3.5 text-amber-600" /> Giá Trị Tồn Kho
          </span>
          <span className="text-lg font-black text-blue-900 block mt-1">
            {formatCurrency(currentValuation)}
          </span>
          <span className="text-[10px] text-amber-700/80">Nguyên liệu đang trữ trong kho</span>
        </div>

        <div className="bg-white/95 border border-amber-300 rounded-2xl p-3 shadow-sm">
          <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
            <Receipt className="w-3.5 h-3.5 text-amber-600" /> Doanh Thu Tích Lũy
          </span>
          <span className="text-lg font-black text-amber-950 block mt-1">
            {formatCurrency(player.totalEarnings)}
          </span>
          <span className="text-[10px] text-amber-700/80">Tổng tiền bán được từ ngày 1</span>
        </div>
      </div>

      {/* Bảng tính tài chính Hôm Nay (Ngày hiện tại) */}
      <div className="bg-amber-100/60 border-2 border-amber-300 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-amber-300/80 pb-2">
          <h4 className="font-black text-sm text-amber-950 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-amber-800" />
            Tài Chính Hôm Nay (Ngày {currentDay} - Đang Hoạt Động)
          </h4>
          <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md">
            Tạm Tính Thời Gian Thực
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-xs">
          {/* Cột Thu */}
          <div className="space-y-1.5">
            <span className="font-extrabold text-emerald-800 uppercase text-[10px] block">
              1. Các Khoản Thu (+)
            </span>
            <div className="flex justify-between items-center py-1 border-b border-amber-200">
              <span className="text-amber-900">Doanh thu bán món:</span>
              <span className="font-bold text-emerald-700">+{formatCurrency(dayRevenue)}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-amber-200">
              <span className="text-amber-900">Tiền tip học sinh:</span>
              <span className="font-bold text-emerald-700">+{formatCurrency(dayTips)}</span>
            </div>
          </div>

          {/* Cột Chi & Giá Vốn */}
          <div className="space-y-1.5">
            <span className="font-extrabold text-rose-800 uppercase text-[10px] block">
              2. Chi Phí & Giá Vốn (-)
            </span>
            <div className="flex justify-between items-center py-1 border-b border-amber-200">
              <span className="text-amber-900">Giá vốn nguyên liệu đã bán (COGS):</span>
              <span className="font-bold text-rose-600">-{formatCurrency(dayCogs)}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-amber-200">
              <span className="text-amber-900">Chi phí vận hành cố định (Điện/Mặt bằng):</span>
              <span className="font-bold text-rose-600">-{formatCurrency(shop.dailyOperatingCost)}</span>
            </div>
          </div>
        </div>

        {/* Các khoản dòng tiền khác */}
        <div className="pt-2 border-t border-amber-200 flex flex-wrap justify-between text-[11px] text-amber-800">
          <span>Tiền mua nguyên liệu nhập kho hôm nay: <strong>{formatCurrency(dayPurchaseExpenses)}</strong></span>
          <span>Tiền đầu tư nâng cấp quầy hôm nay: <strong>{formatCurrency(dayUpgradeExpenses)}</strong></span>
        </div>

        {/* Dòng tổng kết lợi nhuận */}
        <div className="p-3 bg-white/90 rounded-xl border border-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {estimatedNetProfitToday >= 0 ? (
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            ) : (
              <TrendingDown className="w-5 h-5 text-rose-600" />
            )}
            <div>
              <span className="font-black text-sm text-amber-950 block">Lợi Nhuận Ròng Tạm Tính:</span>
              <span className="text-[10px] text-amber-700">(Doanh thu + Tip) - Giá vốn - Phí vận hành</span>
            </div>
          </div>
          <span
            className={`text-base md:text-lg font-black ${
              estimatedNetProfitToday >= 0 ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            {formatCurrency(estimatedNetProfitToday)}
          </span>
        </div>
      </div>

      {/* Lịch sử sổ thu chi các ngày trước */}
      <div className="space-y-2">
        <h4 className="font-black text-sm text-amber-950 flex items-center gap-1.5">
          <Receipt className="w-4 h-4 text-amber-800" />
          Lịch Sử Kết Toán Các Ngày Trước ({dailyLedgers.length} ngày)
        </h4>

        {dailyLedgers.length === 0 ? (
          <div className="bg-white/80 border border-amber-200 rounded-xl p-4 text-center text-xs text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 mx-auto mb-1" />
            Bạn đang ở Ngày {currentDay}. Sổ thu chi sẽ lưu lại bản kết toán sau khi bạn hoàn thành ngày buôn bán!
          </div>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {dailyLedgers.map((l) => (
              <div
                key={l.day}
                className="bg-white/95 border border-amber-200 rounded-xl p-3 flex flex-wrap items-center justify-between text-xs gap-2"
              >
                <div>
                  <span className="font-black text-amber-950 block">Ngày {l.day}</span>
                  <span className="text-[11px] text-amber-800/80">
                    Thu: +{formatCurrency(l.salesRevenue + l.tipsRevenue)} • Giá vốn: -{formatCurrency(l.cogs)} • Phí: -{formatCurrency(l.dailyOperationalCost)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-amber-700 block">Lợi nhuận ròng:</span>
                  <span
                    className={`font-black text-sm ${
                      l.netProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {formatCurrency(l.netProfit)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
