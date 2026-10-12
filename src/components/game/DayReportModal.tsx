import React from 'react';
import { DayReport } from '@/game/types';
import { formatCurrency } from '@/utils/formatters';
import { Modal } from '@/components/common/Modal';
import { GameButton } from '@/components/ui/GameButton';
import { Star, TrendingUp, TrendingDown, ArrowRight, Award, Lightbulb, Trophy, BookOpen, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DayReportModalProps {
  isOpen: boolean;
  report: DayReport | null;
  onStartNextDay: () => void;
}

export const DayReportModal: React.FC<DayReportModalProps> = ({
  isOpen,
  report,
  onStartNextDay,
}) => {
  React.useEffect(() => {
    if (isOpen && report && report.profit > 0) {
      try {
        confetti({
          particleCount: 80,
          spread: 85,
          origin: { y: 0.6 },
        });
      } catch {
        // Confetti non-fatal
      }
    }
  }, [isOpen, report]);

  if (!report) return null;

  const isProfitable = report.profit >= 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onStartNextDay}
      title={`Sổ Nhật Ký Bán Hàng • Ngày ${report.day}`}
      subtitle="Bản tổng kết kết quả kinh doanh và đánh giá của các bạn học sinh"
      icon={<BookOpen className="w-5 h-5 text-amber-700" />}
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* ================= 1. ĐÁNH GIÁ SAO HỌC ĐƯỜNG ================= */}
        <div className="bg-gradient-to-r from-amber-100 via-orange-100 to-amber-100 border-2 border-amber-300 rounded-3xl p-4 text-center shadow-inner relative overflow-hidden">
          <span className="text-xs font-black text-amber-900 uppercase tracking-wide flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-300" />
            Đánh Giá Hài Lòng Của Khách Hàng:
          </span>
          <div className="flex items-center justify-center gap-1.5 my-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-6 h-6 transition-all ${
                  i < Math.round(report.ratingScore)
                    ? 'fill-amber-400 text-amber-500 scale-110 drop-shadow-sm'
                    : 'text-amber-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-black text-amber-950 bg-white/80 px-3 py-1 rounded-full border border-amber-300 inline-block">
            {report.ratingScore.toFixed(1)} / 5.0 Sao Học Đường
          </span>
        </div>

        {/* ================= 2. BẢNG KÊ THU CHI TRANG SỔ TẬP ================= */}
        <div className="bg-[#FFFEFA] border-2 border-[#E9E1D5] rounded-3xl p-4 space-y-2.5 text-xs md:text-sm shadow-sm">
          <div className="flex justify-between items-center text-slate-700">
            <span>Doanh thu bán món:</span>
            <span className="font-extrabold text-[#58A879]">
              +{formatCurrency(report.revenue)}
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-700">
            <span>Tiền tip thêm từ khách quen:</span>
            <span className="font-extrabold text-[#58A879]">
              +{formatCurrency(report.tipsEarned || 0)}
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-700">
            <span>Giá vốn nguyên liệu tiêu thụ (COGS):</span>
            <span className="font-extrabold text-[#DF6B6B]">
              -{formatCurrency(report.ingredientCost)}
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-700">
            <span>Chi phí vận hành vỉa hè & điện nước:</span>
            <span className="font-extrabold text-[#DF6B6B]">
              -{formatCurrency(report.operatingCost || 0)}
            </span>
          </div>

          {/* Lợi nhuận ròng tổng kết */}
          <div className="pt-2.5 border-t-2 border-[#E9E1D5] flex justify-between items-center text-sm md:text-base">
            <span className="font-black text-[#354254] flex items-center gap-1.5">
              {isProfitable ? (
                <TrendingUp className="w-4 h-4 text-[#58A879]" />
              ) : (
                <TrendingDown className="w-4 h-4 text-[#DF6B6B]" />
              )}
              Lợi nhuận ròng:
            </span>
            <span
              className={`font-black text-base md:text-lg ${
                isProfitable ? 'text-[#58A879]' : 'text-[#DF6B6B]'
              }`}
            >
              {formatCurrency(report.profit)}
            </span>
          </div>
        </div>

        {/* ================= 3. THỐNG KÊ ĐƠN & MÓN BÁN CHẠY ================= */}
        <div className="grid grid-cols-2 gap-2.5 text-xs text-center">
          <div className="bg-[#B9E8C5]/30 border border-[#58A879]/40 rounded-2xl p-3 shadow-2xs">
            <span className="text-[#354254] font-bold block">Phục vụ thành công</span>
            <span className="text-base font-black text-[#58A879] mt-0.5 block">
              {report.ordersCompleted} đơn
            </span>
          </div>

          <div className="bg-[#FFBFD1]/30 border border-[#DF6B6B]/40 rounded-2xl p-3 shadow-2xs">
            <span className="text-[#354254] font-bold block">Khách chờ lâu bỏ về</span>
            <span className="text-base font-black text-[#DF6B6B] mt-0.5 block">
              {report.ordersFailed} bạn
            </span>
          </div>
        </div>

        {/* Món bán chạy nhất */}
        {report.topSellingDish && (
          <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl text-xs flex items-center gap-2.5 shadow-2xs">
            <Trophy className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span className="text-amber-950">
              Món bán chạy nhất hôm nay: <strong>{report.topSellingDish}</strong>
            </span>
          </div>
        )}

        {/* Gợi ý / Lời khuyên kinh doanh cho ngày mai */}
        {report.adviceText && (
          <div className="p-3 bg-[#BFE5FF]/30 border border-[#4A90E2]/40 rounded-2xl text-xs text-[#354254] flex items-start gap-2.5">
            <Lightbulb className="w-4 h-4 text-[#4A90E2] flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-sky-900">Lời khuyên ngày mai:</strong> {report.adviceText}
            </p>
          </div>
        )}

        {/* ================= 4. NÚT SANG NGÀY MỚI ================= */}
        <div className="pt-2">
          <GameButton
            variant="primary"
            size="lg"
            icon={<ArrowRight className="w-4 h-4 stroke-[3]" />}
            onClick={onStartNextDay}
            className="w-full text-base py-3.5 font-black shadow-lg"
          >
            Mở Cửa Ngày {report.day + 1}!
          </GameButton>
        </div>
      </div>
    </Modal>
  );
};
