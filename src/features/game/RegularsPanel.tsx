import React, { useState } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { ALL_MENU_ITEMS } from '@/game/data/menuItems';
import { INITIAL_REGULAR_CUSTOMERS } from '@/game/data/characters';
import { CustomerRegular, FriendshipStoryMilestone } from '@/game/types';
import { formatCurrency } from '@/utils/formatters';
import {
  Users2,
  Heart,
  Sparkles,
  BookOpen,
  Clock,
  X,
  Award,
  MessageCircle,
  Film,
  Smile,
  Volume2,
} from 'lucide-react';
import { GameButton } from '@/components/ui/GameButton';
import { CharacterAvatar } from '@/components/common/CharacterAvatar';
import { IntroStoryScreen } from '@/features/intro/IntroStoryScreen';
import { soundManager } from '@/services/audio/soundEffects';

export const RegularsPanel: React.FC = () => {
  const regularCustomers = useGameStore((s) => s.regularCustomers);
  const customerList: CustomerRegular[] = Object.values(regularCustomers || {});

  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRegular | null>(null);
  const [activeStoryTab, setActiveStoryTab] = useState<'stories' | 'dialogues'>('stories');
  const [isReplayingIntro, setIsReplayingIntro] = useState(false);
  const [activeDialogueQuote, setActiveDialogueQuote] = useState<string | null>(null);

  const formatSlotLabel = (slot: string) => {
    switch (slot) {
      case 'before_school':
        return 'Sáng sớm 06:00';
      case 'recess_rush':
        return 'Giờ ra chơi 09:15';
      case 'noon_break':
        return 'Nghỉ trưa 11:30';
      case 'dismissal_rush':
        return 'Tan trường 16:30';
      case 'evening_chill':
        return 'Xế chiều 17:45';
      default:
        return 'Cả ngày';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-amber-200/80">
        <div>
          <h3 className="text-base md:text-lg font-black text-amber-950 flex items-center gap-2">
            <Users2 className="w-5 h-5 text-amber-700" />
            Sổ Tay Khách Quen Cổng Trường ({customerList.length} Người Bạn)
          </h3>
          <p className="text-xs text-amber-800/80">
            Phục vụ đúng món khoái khẩu để tăng tim thân thiết, mở khóa câu chuyện và nhận tiền tip hào phóng.
          </p>
        </div>

        <button
          onClick={() => {
            soundManager.playClick();
            setIsReplayingIntro(true);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-300 bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold transition-all shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Film className="w-3.5 h-3.5 text-amber-800" />
          <span>Xem Lại Cốt Truyện Quán</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {customerList.map((customer) => {
          const favoriteItems = ALL_MENU_ITEMS.filter((item) =>
            customer.favoriteItemIds.includes(item.id)
          );

          return (
            <div
              key={customer.id}
              className="bg-white/95 border-2 border-amber-900/15 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:border-amber-400 transition-all"
            >
              <div>
                {/* Header card: Avatar + Tên + Cấp tim */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <CharacterAvatar characterId={customer.id} size="md" fallbackEmoji={customer.avatar} />
                    <div>
                      <h4 className="font-black text-sm md:text-base text-amber-950">
                        {customer.name}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                          {customer.typeLabel}
                        </span>
                        {customer.unlockedPerk && (
                          <span className="text-[9px] font-black text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5 text-emerald-600" /> Đặc quyền
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 5 Trái tim thân thiết */}
                  <div className="flex items-center gap-0.5 bg-rose-50 px-2 py-1 rounded-xl border border-rose-200">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <Heart
                        key={level}
                        className={`w-3.5 h-3.5 ${
                          level <= customer.friendshipLevel
                            ? 'text-rose-500 fill-rose-500'
                            : 'text-rose-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Thanh tiến độ thân thiết (EXP) */}
                <div className="mt-2.5 p-2 bg-amber-50/80 rounded-xl border border-amber-200/70">
                  <div className="flex items-center justify-between text-[11px] font-bold text-amber-900 mb-1">
                    <span>Thân thiết Cấp {customer.friendshipLevel}/5</span>
                    <span>
                      {customer.friendshipLevel >= 5
                        ? 'Đạt tối đa ⭐'
                        : `${customer.friendshipExp}/100 EXP`}
                    </span>
                  </div>
                  <div className="w-full bg-amber-200/70 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-rose-400 to-rose-500 h-full rounded-full transition-all"
                      style={{
                        width: `${customer.friendshipLevel >= 5 ? 100 : customer.friendshipExp}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Mô tả tính cách */}
                <p className="text-xs text-amber-900/85 mt-2.5 leading-relaxed line-clamp-2">
                  {customer.description}
                </p>

                {/* Câu thoại đặc trưng */}
                <div className="mt-2 p-2 bg-amber-100/40 rounded-xl border border-amber-200/50 text-[11px] italic text-amber-900 leading-snug">
                  "{customer.dialogueIntro}"
                </div>

                {/* Món ăn khoái khẩu */}
                <div className="mt-3">
                  <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1 mb-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-400" />
                    Món khoái khẩu:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {favoriteItems.map((fav) => (
                      <span
                        key={fav.id}
                        className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-lg"
                      >
                        {fav.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Khung giờ thường ghé */}
                <div className="mt-2 text-[11px] text-amber-800/90 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  <span>
                    Khung giờ ghé: <strong>{customer.preferredTimeSlots.map(formatSlotLabel).join(', ')}</strong>
                  </span>
                </div>
              </div>

              {/* Footer card: Thống kê & Nút xem cốt truyện */}
              <div className="mt-3 pt-2.5 border-t border-amber-100 flex items-center justify-between text-xs text-amber-800">
                <div>
                  <span className="text-[10px] text-amber-700 block">
                    Đã phục vụ: <strong>{customer.totalOrdersServed} đơn</strong>
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700">
                    Chi tiêu: {formatCurrency(customer.totalSpent)}
                  </span>
                </div>

                <GameButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedCustomer(customer)}
                  icon={<BookOpen className="w-3.5 h-3.5" />}
                >
                  Cốt Truyện
                </GameButton>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL CHI TIẾT CÂU CHUYỆN VÀ ĐẶC QUYỀN KHÁCH QUEN */}
      {selectedCustomer && (() => {
        const stories =
          selectedCustomer.friendshipStories ||
          INITIAL_REGULAR_CUSTOMERS[selectedCustomer.id]?.friendshipStories ||
          [];

        const dialogues = [
          {
            label: 'Lời chào khi ghé quán',
            mood: '👋 Chào quán',
            text: selectedCustomer.dialogueIntro || 'Dạ chào cô chú, cho con một phần như mọi khi với ạ!',
          },
          {
            label: 'Cảm nhận khi nhận món',
            mood: '😋 Khen ngon',
            text: selectedCustomer.dialogueHappy || 'Dạ con cảm ơn ạ, ngon tuyệt vời luôn ạ!',
          },
          {
            label: 'Tâm sự ngày mưa',
            mood: '🌧️ Ngày mưa',
            text: selectedCustomer.dialogueRainy || 'Mưa rào rồi, con đứng nép dưới mái hiên quán trú mưa một chút nha chú.',
          },
          {
            label: 'Kỷ niệm mùa khai trường',
            mood: '🎒 Ngày tựu trường',
            text: selectedCustomer.dialogueEvent || 'Hôm nay trường đông vui rộn ràng lắm, quán buôn may bán đắt nhen chú!',
          },
        ];

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl border-4 border-amber-400 p-5 md:p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-4">
              {/* Header Modal */}
              <div className="flex items-center justify-between pb-3 border-b-2 border-amber-200">
                <div className="flex items-center gap-3">
                  <CharacterAvatar characterId={selectedCustomer.id} size="lg" fallbackEmoji={selectedCustomer.avatar} />
                  <div>
                    <h3 className="text-base md:text-lg font-black text-amber-950">
                      {selectedCustomer.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                        {selectedCustomer.typeLabel}
                      </span>
                      <span className="text-xs font-extrabold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                        ❤️ Thân Thiết Cấp {selectedCustomer.friendshipLevel}/5
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedCustomer(null);
                  }}
                  className="p-1.5 rounded-xl hover:bg-amber-100 text-amber-800 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs chuyển đổi trong Modal: Cốt Truyện vs Lời Thoại */}
              <div className="flex bg-amber-100/70 p-1 rounded-2xl border border-amber-300">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setActiveStoryTab('stories');
                  }}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                    activeStoryTab === 'stories'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-amber-900/80 hover:bg-amber-200/60'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Hành Trình Gắn Bó ({stories.length})</span>
                </button>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setActiveStoryTab('dialogues');
                  }}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                    activeStoryTab === 'dialogues'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-amber-900/80 hover:bg-amber-200/60'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Tâm Sự & Lời Thoại</span>
                </button>
              </div>

              {/* Tính cách & thói quen */}
              <div>
                <h4 className="text-xs font-bold text-amber-900 uppercase mb-1">Tính cách & Thói quen:</h4>
                <p className="text-xs text-amber-800/90 leading-relaxed bg-amber-50 p-2.5 rounded-xl border border-amber-200 font-medium">
                  {selectedCustomer.personality || 'Một người bạn thân thiện, gắn bó cùng góc quán nhỏ trước cổng trường.'}
                </p>
              </div>

              {/* TAB 1: DANH SÁCH 4 MỐC CỐT TRUYỆN */}
              {activeStoryTab === 'stories' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-amber-950 uppercase flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-amber-600" />
                    Các Chương Câu Chuyện Đã Mở Khóa:
                  </h4>

                  {stories.map((milestone: FriendshipStoryMilestone) => {
                    const isUnlocked = selectedCustomer.friendshipLevel >= milestone.level;

                    return (
                      <div
                        key={milestone.level}
                        className={`p-3.5 rounded-2xl border-2 transition-all ${
                          isUnlocked
                            ? 'bg-amber-50/90 border-amber-400 shadow-sm'
                            : 'bg-slate-50 border-slate-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-amber-950">
                            {isUnlocked ? '✨' : '🔒'} Cấp {milestone.level}: {milestone.title}
                          </span>
                          {isUnlocked ? (
                            <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                              Đã mở khóa
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-slate-500">
                              Cần Thân Thiết Cấp {milestone.level}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-amber-900 mt-2 leading-relaxed font-medium">
                          {isUnlocked ? milestone.story : 'Tiếp tục phục vụ bạn ấy để mở khóa chương truyện tuổi học trò này nhé!'}
                        </p>

                        <div className="mt-2 pt-2 border-t border-amber-200/60 text-[11px]">
                          <span className="font-bold text-amber-900">Đặc quyền mang lại: </span>
                          <span className="text-emerald-800 font-black">{milestone.perkDescription}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 2: LỜI THOẠI & TÂM SỰ TƯƠNG TÁC */}
              {activeStoryTab === 'dialogues' && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-black text-amber-950 uppercase flex items-center gap-1.5">
                    <Smile className="w-4 h-4 text-amber-600" />
                    Chạm Vào Lời Thoại Để Nghe Tâm Sự:
                  </h4>

                  {dialogues.map((d, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        soundManager.playCustomerBell();
                        setActiveDialogueQuote(d.text);
                      }}
                      className="w-full text-left p-3 rounded-2xl border-2 border-amber-200 bg-amber-50/60 hover:bg-amber-100/80 transition-all flex items-start gap-2.5 cursor-pointer hover:border-amber-400 group"
                    >
                      <Volume2 className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <div className="space-y-0.5 flex-1">
                        <span className="text-[10px] font-black text-amber-800 uppercase tracking-wide block">
                          {d.mood} • {d.label}
                        </span>
                        <p className="text-xs text-amber-950 font-bold leading-relaxed">
                          "{d.text}"
                        </p>
                      </div>
                    </button>
                  ))}

                  {activeDialogueQuote && (
                    <div className="p-3 bg-amber-100 border-2 border-amber-300 rounded-2xl text-xs text-amber-950 font-black animate-bounce-gentle flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span>{selectedCustomer.name}: "{activeDialogueQuote}"</span>
                    </div>
                  )}
                </div>
              )}

              <div className="text-center pt-2">
                <GameButton
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedCustomer(null);
                  }}
                  className="px-6"
                >
                  Đóng Sổ Tay
                </GameButton>
              </div>
            </div>
          </div>
        );
      })()}

      {/* MODAL XEM LẠI CỐT TRUYỆN MỞ ĐẦU GAME */}
      {isReplayingIntro && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-2">
          <div className="w-full max-w-2xl max-h-[96vh] overflow-y-auto">
            <IntroStoryScreen
              onContinue={() => setIsReplayingIntro(false)}
              onSkip={() => setIsReplayingIntro(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
