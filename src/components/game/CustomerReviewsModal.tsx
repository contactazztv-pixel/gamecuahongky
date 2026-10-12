import React, { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { CharacterAvatar } from '@/components/common/CharacterAvatar';
import { GameButton } from '@/components/ui/GameButton';
import { formatCurrency } from '@/utils/formatters';
import {
  Star,
  Sparkles,
  ThumbsUp,
  Heart,
  Coins,
  Filter,
  Award,
  TrendingUp,
} from 'lucide-react';

export interface CustomerReviewRecord {
  id: string;
  customerName: string;
  customerId: string;
  customerTitle: string;
  avatar: string;
  dishName: string;
  stars: number;
  comment: string;
  tip: number;
  timeLabel: string;
}

const INITIAL_SAMPLE_REVIEWS: CustomerReviewRecord[] = [
  {
    id: 'rev_1',
    customerName: 'Bé An (Lớp 6A)',
    customerId: 'student_an_grade6',
    customerTitle: 'Tân binh lớp 6',
    avatar: '👦',
    dishName: 'Trà Sữa Truyền Thống',
    stars: 5,
    comment: 'Trà sữa ngọt béo thơm lừng, trân châu dai dai nhai đã miệng xỉu! Mai con lại rủ cả tổ ghé mua tiếp!',
    tip: 2000,
    timeLabel: 'Giờ ra chơi sáng nay',
  },
  {
    id: 'rev_2',
    customerName: 'Hoàng Nam (Lớp 12 Tin)',
    customerId: 'student_nam_senior',
    customerTitle: 'Học sinh cuối cấp',
    avatar: '🧑‍🎓',
    dishName: 'Bánh Mì Pa-tê Chả Lụa',
    stars: 5,
    comment: 'Bánh mì giòn rụm, pa-tê gan béo ngậy ngập tràn. Anh chủ làm siêu nhanh kịp giờ truy bài 15 phút, 10 điểm uy tín!',
    tip: 5000,
    timeLabel: 'Sáng sớm 06:30',
  },
  {
    id: 'rev_3',
    customerName: 'Hội Mai & Linh (Lớp 9B)',
    customerId: 'student_mai_linh_duo',
    customerTitle: 'Cặp bài trùng ăn vặt',
    avatar: '👧',
    dishName: 'Bánh Tráng Trộn Sài Gòn',
    stars: 5,
    comment: 'Bánh tráng trộn chua ngọt vừa miệng, nhiều bò khô với trứng cút bùi béo. Vừa ngồi ghế nhựa ăn vừa tám chuyện đúng bài!',
    tip: 3000,
    timeLabel: 'Giờ tan trường hôm qua',
  },
  {
    id: 'rev_4',
    customerName: 'Thầy Nghĩa (Giám Thị)',
    customerId: 'teacher_nghia',
    customerTitle: 'Thầy giáo giám thị',
    avatar: '👨‍🏫',
    dishName: 'Trà Đào Cam Sả',
    stars: 5,
    comment: 'Trà đào thanh mát, thơm nồng vị sả giúp thầy ấm cổ họng sau 4 tiết giảng bài. Quầy hàng sạch sẽ, thầy rất yên tâm.',
    tip: 5000,
    timeLabel: 'Nghỉ trưa hôm qua',
  },
  {
    id: 'rev_5',
    customerName: 'Minh Thể Thao (Lớp 11A1)',
    customerId: 'student_minh_sport',
    customerTitle: 'Cầu thủ bóng rổ',
    avatar: '🏀',
    dishName: 'Milo Dầm Khổng Lồ',
    stars: 5,
    comment: 'Đá tuyết mát lạnh ngập tràn bột milo đậm đà nạp năng lượng cực đỉnh sau trận bóng rổ toát mồ hôi!',
    tip: 2000,
    timeLabel: 'Xế chiều 17:15',
  },
  {
    id: 'rev_6',
    customerName: 'Bác Tư (Bảo Vệ)',
    customerId: 'neighbor_bac_tu',
    customerTitle: 'Bác bảo vệ hiền từ',
    avatar: '👴',
    dishName: 'Xôi Mặn Thập Cẩm Lá Chuối',
    stars: 5,
    comment: 'Xôi dẻo thơm phức mùi lá chuối, chả lụa với hành phi giòn rụm làm bác nhớ hương vị gánh xôi xưa.',
    tip: 3000,
    timeLabel: 'Sáng sớm hôm kia',
  },
];

interface CustomerReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopReputation?: number;
  totalOrdersServed?: number;
}

export const CustomerReviewsModal: React.FC<CustomerReviewsModalProps> = ({
  isOpen,
  onClose,
  shopReputation = 48,
  totalOrdersServed = 18,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | '5_star' | 'has_tip'>('all');

  const filteredReviews = INITIAL_SAMPLE_REVIEWS.filter((item) => {
    if (filterMode === '5_star') return item.stars === 5;
    if (filterMode === 'has_tip') return item.tip > 0;
    return true;
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sổ Đánh Giá Khách Hàng (Foodie Reviews)"
      icon={<Star className="w-5 h-5 text-amber-500 fill-amber-400" />}
      maxWidth="lg"
    >
      <div className="space-y-4 text-amber-950 select-none">
        {/* ================= THẺ TỔNG QUAN XẾP HẠNG QUÁN ================= */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-2xl p-4 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-16 h-16 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-xs flex flex-col items-center justify-center">
              <span className="text-2xl font-black tracking-tight leading-none">4.9</span>
              <div className="flex items-center gap-0.5 mt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-2.5 h-2.5 text-amber-200 fill-amber-200" />
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black">Quán Ăn Yêu Thích Cổng Trường</h3>
                <span className="bg-amber-300 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                  Top 1 Uy Tín
                </span>
              </div>
              <p className="text-xs text-amber-100 mt-0.5">
                98% học sinh và thầy cô muốn quay lại ủng hộ tiệm mỗi ngày!
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col justify-around gap-2 bg-black/15 p-2.5 rounded-xl text-center text-xs">
            <div>
              <span className="text-amber-200 text-[10px] block">Đã Phục Vụ</span>
              <strong className="text-sm font-black text-white">{totalOrdersServed} Đơn Hàng</strong>
            </div>
            <div>
              <span className="text-amber-200 text-[10px] block">Điểm Danh Tiếng</span>
              <strong className="text-sm font-black text-amber-300">⭐ {shopReputation} Điểm</strong>
            </div>
          </div>
        </div>

        {/* ================= BỘ LỌC ĐÁNH GIÁ ================= */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <span className="text-xs font-black text-amber-900 uppercase flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-amber-700" />
            Nhận Xét Từ Học Sinh & Khách Quen ({filteredReviews.length})
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                filterMode === 'all'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
              }`}
            >
              Tất Cả
            </button>
            <button
              onClick={() => setFilterMode('5_star')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                filterMode === '5_star'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
              }`}
            >
              5 Sao ⭐
            </button>
            <button
              onClick={() => setFilterMode('has_tip')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                filterMode === 'has_tip'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
              }`}
            >
              Có Tiền Tip 💰
            </button>
          </div>
        </div>

        {/* ================= DANH SÁCH BÀI ĐÁNH GIÁ (REVIEW FEED) ================= */}
        <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-3.5 rounded-2xl border-2 border-amber-200/90 shadow-xs hover:border-amber-400 transition-all space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <CharacterAvatar characterId={rev.customerId} size="sm" fallbackEmoji={rev.avatar} />
                  <div>
                    <h4 className="text-xs md:text-sm font-black text-amber-950 flex items-center gap-1.5">
                      <span>{rev.customerName}</span>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded-md">
                        {rev.customerTitle}
                      </span>
                    </h4>
                    <span className="text-[10px] text-amber-700 font-medium">
                      Đã gọi: <strong className="text-amber-900">{rev.dishName}</strong> • {rev.timeLabel}
                    </span>
                  </div>
                </div>

                {/* Sao chấm điểm */}
                <div className="flex items-center gap-0.5 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 flex-shrink-0">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3 h-3 ${
                        s <= rev.stars
                          ? 'text-amber-500 fill-amber-400'
                          : 'text-amber-200 fill-amber-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Lời nhận xét */}
              <div className="bg-amber-50/70 p-2.5 rounded-xl text-xs text-amber-950 font-medium leading-relaxed border border-amber-200/60">
                "{rev.comment}"
              </div>

              {/* Tiền tip nếu có */}
              {rev.tip > 0 && (
                <div className="flex items-center justify-between text-[11px] pt-0.5">
                  <span className="inline-flex items-center gap-1 text-emerald-800 font-black bg-emerald-100/90 px-2 py-0.5 rounded-md">
                    <Coins className="w-3 h-3 text-emerald-600" />
                    Đã tip cho quán: +{formatCurrency(rev.tip)}
                  </span>
                  <span className="text-[10px] text-amber-700 flex items-center gap-1 font-bold">
                    <ThumbsUp className="w-3 h-3 text-amber-600" /> Hài lòng tuyệt đối
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Nút đóng */}
        <div className="text-center pt-1">
          <GameButton variant="primary" size="sm" onClick={onClose} className="px-6">
            Đóng Sổ Đánh Giá
          </GameButton>
        </div>
      </div>
    </Modal>
  );
};
