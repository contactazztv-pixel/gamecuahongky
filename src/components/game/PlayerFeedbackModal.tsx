import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { GameButton } from '@/components/ui/GameButton';
import { soundManager } from '@/services/audio/soundEffects';
import {
  MessageSquareHeart,
  Send,
  Star,
  CheckCircle2,
  Sparkles,
  History,
  Lightbulb,
  UtensilsCrossed,
  Bug,
  HeartHandshake,
} from 'lucide-react';

export interface PlayerFeedbackItem {
  id: string;
  category: 'dish_idea' | 'feature_idea' | 'bug_report' | 'general_review';
  playerName: string;
  rating: number;
  content: string;
  timestamp: string;
  devReply?: string;
}

const STORAGE_KEY = 'tiem_nho_player_feedbacks_v1';

const DEFAULT_DEV_REPLIES: Record<string, string> = {
  dish_idea: 'Ý tưởng món này nghe thèm quá! Chúng mình đã ghi vào sổ công thức và sẽ thử nghiệm trong các bản cập nhật tới nhé! 🍜',
  feature_idea: 'Góp ý tuyệt vời! Tiệm Nhỏ luôn muốn mang lại trải nghiệm thư giãn và phong phú nhất cho bạn. Cảm ơn bạn rất nhiều! ✨',
  bug_report: 'Cảm ơn bạn đã báo lỗi giúp tiệm! Chúng mình sẽ kiểm tra và khắc phục ngay để game mượt mà hơn. 🛠️',
  general_review: 'Nhận được tình cảm ấm áp từ bạn là động lực lớn nhất của nhóm phát triển. Chúc bạn buôn may bán đắt mỗi ngày! ❤️',
};

interface PlayerFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlayerName?: string;
}

export const PlayerFeedbackModal: React.FC<PlayerFeedbackModalProps> = ({
  isOpen,
  onClose,
  defaultPlayerName = 'Bạn Nhỏ Khách Quen',
}) => {
  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form');
  const [category, setCategory] = useState<'dish_idea' | 'feature_idea' | 'bug_report' | 'general_review'>('feature_idea');
  const [playerName, setPlayerName] = useState(defaultPlayerName);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [feedbacks, setFeedbacks] = useState<PlayerFeedbackItem[]>([]);
  const [isSuccessSent, setIsSuccessSent] = useState(false);

  // Tải danh sách góp ý đã lưu từ localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setFeedbacks(JSON.parse(raw));
      } else {
        // Mẫu phản hồi khởi đầu làm ví dụ
        const initialSamples: PlayerFeedbackItem[] = [
          {
            id: 'fb_welcome',
            category: 'general_review',
            playerName: 'Học Sinh Cổng Trường',
            rating: 5,
            content: 'Game hoài niệm và đáng yêu lắm! Nhạc nền nghe rất thư giãn sau giờ học căng thẳng.',
            timestamp: new Date(Date.now() - 86400000).toLocaleString('vi-VN'),
            devReply: 'Cảm ơn bạn thật nhiều! Hãy tiếp tục ghé quán mỗi ngày cùng bạn bè nhé! ❤️',
          },
        ];
        setFeedbacks(initialSamples);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSamples));
      }
    } catch {
      // Fallback
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    soundManager.playSuccessFanfare();

    const newFeedback: PlayerFeedbackItem = {
      id: `fb_${Date.now()}`,
      category,
      playerName: playerName.trim() || 'Người Chơi Ẩn Danh',
      rating,
      content: content.trim(),
      timestamp: new Date().toLocaleString('vi-VN'),
      devReply: DEFAULT_DEV_REPLIES[category] || 'Cảm ơn bạn đã đồng hành cùng Tiệm Nhỏ! 💖',
    };

    const updated = [newFeedback, ...feedbacks];
    setFeedbacks(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }

    setContent('');
    setIsSuccessSent(true);
    setTimeout(() => {
      setIsSuccessSent(false);
      setActiveTab('history');
    }, 1200);
  };

  const categories = [
    { id: 'feature_idea', label: 'Góp ý tính năng', icon: Lightbulb, color: 'text-amber-600 bg-amber-50 border-amber-300' },
    { id: 'dish_idea', label: 'Ý tưởng món mới', icon: UtensilsCrossed, color: 'text-orange-600 bg-orange-50 border-orange-300' },
    { id: 'bug_report', label: 'Báo lỗi hiển thị', icon: Bug, color: 'text-rose-600 bg-rose-50 border-rose-300' },
    { id: 'general_review', label: 'Lời khen & Góp ý', icon: HeartHandshake, color: 'text-emerald-600 bg-emerald-50 border-emerald-300' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Hòm Thư Góp Ý & Đóng Góp Ý Tưởng"
      icon={<MessageSquareHeart className="w-5 h-5 text-amber-700" />}
      maxWidth="lg"
    >
      <div className="space-y-4 text-amber-950 select-none">
        {/* Thanh chuyển đổi tab: Gửi góp ý / Lịch sử đóng góp */}
        <div className="flex bg-amber-100/70 p-1 rounded-2xl border border-amber-300/80">
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs md:text-sm font-black flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'form'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-amber-900/80 hover:bg-amber-200/60'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Gửi Góp Ý Mới</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs md:text-sm font-black flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'history'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-amber-900/80 hover:bg-amber-200/60'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Sổ Lưu Bút ({feedbacks.length})</span>
          </button>
        </div>

        {/* TAB 1: FORM GỬI GÓP Ý */}
        {activeTab === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Lời ngỏ */}
            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs text-amber-900 leading-relaxed">
              💌 <strong>Lời ngỏ từ nhóm phát triển:</strong> Tiệm Nhỏ Trước Cổng Trường luôn mong muốn lắng nghe mọi chia sẻ, cảm nhận và ý tưởng từ các bạn để game ngày càng ấm áp và trọn vẹn hơn.
            </div>

            {/* Chọn danh mục góp ý */}
            <div>
              <label className="block text-xs font-black text-amber-900 uppercase tracking-wider mb-1.5">
                Chủ đề góp ý:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((c) => {
                  const Icon = c.icon;
                  const isSelected = category === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCategory(c.id as any)}
                      className={`p-2.5 rounded-xl border-2 text-xs font-bold flex items-center gap-2 text-left transition-all ${
                        isSelected
                          ? `${c.color} border-current shadow-sm scale-[1.02] font-black`
                          : 'bg-white border-amber-200/80 text-amber-900/70 hover:bg-amber-50'
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span>{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tên người chơi */}
            <div>
              <label className="block text-xs font-black text-amber-900 uppercase tracking-wider mb-1">
                Tên của bạn / Biệt danh quán:
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={30}
                placeholder="Nhập tên của bạn..."
                className="w-full px-3.5 py-2 rounded-xl border-2 border-amber-300 bg-white text-base font-bold text-amber-950 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Đánh giá sao */}
            <div>
              <label className="block text-xs font-black text-amber-900 uppercase tracking-wider mb-1">
                Mức độ hài lòng với game:
              </label>
              <div className="flex items-center gap-1.5 bg-amber-50 p-2 rounded-xl border border-amber-200">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating
                          ? 'text-amber-500 fill-amber-400 drop-shadow-xs'
                          : 'text-amber-200 fill-amber-100'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-black text-amber-800 ml-2">
                  {rating === 5 && '🌟 Tuyệt vời!'}
                  {rating === 4 && '😊 Rất thích'}
                  {rating === 3 && '👍 Khá ổn'}
                  {rating === 2 && '😐 Chưa hài lòng'}
                  {rating === 1 && '😢 Cần sửa lỗi'}
                </span>
              </div>
            </div>

            {/* Nội dung chia sẻ */}
            <div>
              <label className="block text-xs font-black text-amber-900 uppercase tracking-wider mb-1">
                Nội dung chia sẻ hoặc đề xuất:
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={500}
                rows={3}
                required
                placeholder="Chia sẻ cảm nhận, món ăn muốn thêm, lỗi bạn gặp phải hoặc điều bạn muốn tiệm có thêm..."
                className="w-full px-3.5 py-2 rounded-xl border-2 border-amber-300 bg-white text-base text-amber-950 focus:outline-none focus:border-amber-500 font-medium leading-relaxed resize-none"
              ></textarea>
              <div className="flex justify-between items-center text-[10px] text-amber-800/70 mt-0.5">
                <span>Dữ liệu được lưu trữ an toàn trên thiết bị của bạn.</span>
                <span>{content.length}/500</span>
              </div>
            </div>

            {/* Thông báo gửi thành công */}
            {isSuccessSent && (
              <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-2xl flex items-center gap-2 text-emerald-900 text-xs font-bold animate-bounce-gentle">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>Góp ý đã được gửi thành công! Cảm ơn bạn rất nhiều! ⭐</span>
              </div>
            )}

            {/* Nút gửi */}
            <div className="flex justify-end gap-2 pt-1">
              <GameButton variant="ghost" size="sm" type="button" onClick={onClose}>
                Để Sau
              </GameButton>
              <GameButton
                variant="primary"
                size="md"
                type="submit"
                disabled={!content.trim()}
                icon={<Send className="w-4 h-4" />}
                className="px-6"
              >
                Gửi Góp Ý
              </GameButton>
            </div>
          </form>
        )}

        {/* TAB 2: LỊCH SỬ GÓP Ý & LỜI HỒI ĐÁP */}
        {activeTab === 'history' && (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {feedbacks.length === 0 ? (
              <div className="text-center py-8 text-amber-800/70 text-xs">
                Chưa có góp ý nào. Hãy là người đầu tiên gửi lưu bút nhé!
              </div>
            ) : (
              feedbacks.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/90 p-3.5 rounded-2xl border-2 border-amber-200/80 shadow-xs space-y-2 hover:border-amber-300 transition-all"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-amber-950">{item.playerName}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                        {item.category === 'dish_idea' && '🍜 Món mới'}
                        {item.category === 'feature_idea' && '💡 Tính năng'}
                        {item.category === 'bug_report' && '🐛 Báo lỗi'}
                        {item.category === 'general_review' && '⭐ Cảm nhận'}
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${
                            s <= item.rating
                              ? 'text-amber-500 fill-amber-400'
                              : 'text-amber-200 fill-amber-100'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-amber-900 leading-relaxed font-medium bg-amber-50/50 p-2 rounded-xl">
                    "{item.content}"
                  </p>

                  {item.devReply && (
                    <div className="p-2 bg-emerald-50/80 border border-emerald-200 rounded-xl text-[11px] text-emerald-950 flex items-start gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-emerald-800 block">Nhóm Phát Triển Tiệm Nhỏ:</strong>
                        <span>{item.devReply}</span>
                      </div>
                    </div>
                  )}

                  <div className="text-[10px] text-amber-700/60 text-right">
                    {item.timestamp}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
