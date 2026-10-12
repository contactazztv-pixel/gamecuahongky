import React, { useState } from 'react';
import { Quest, Achievement, QuestCategory } from '@/game/types';
import { formatCurrency } from '@/utils/formatters';
import { GameButton } from '@/components/ui/GameButton';
import { Target, Trophy, CheckCircle2, Gift, Sparkles, Calendar, Heart, Flame } from 'lucide-react';

interface QuestPanelProps {
  quests: Quest[];
  achievements: Achievement[];
  onClaimQuest: (questId: string) => void;
}

export const QuestPanel: React.FC<QuestPanelProps> = ({
  quests,
  achievements,
  onClaimQuest,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'quests' | 'achievements'>('quests');
  const [selectedCategory, setSelectedCategory] = useState<QuestCategory | 'all'>('all');

  const pendingClaimsCount = quests.filter((q) => q.completed && !q.claimed).length;

  const categories: { id: QuestCategory | 'all'; label: string; icon?: React.ReactNode }[] = [
    { id: 'all', label: 'Tất Cả' },
    { id: 'daily', label: 'Hằng Ngày', icon: <Flame className="w-3 h-3 text-orange-500" /> },
    { id: 'weekly', label: 'Tuần Học', icon: <Calendar className="w-3 h-3 text-blue-500" /> },
    { id: 'regular', label: 'Khách Quen', icon: <Heart className="w-3 h-3 text-rose-500" /> },
    { id: 'event', label: 'Sự Kiện', icon: <Sparkles className="w-3 h-3 text-amber-500" /> },
    { id: 'business', label: 'Kinh Doanh' },
  ];

  const filteredQuests = quests.filter((q) => {
    if (selectedCategory === 'all') return true;
    return q.category === selectedCategory;
  });

  const getCategoryBadge = (category: QuestCategory) => {
    switch (category) {
      case 'daily':
        return <span className="text-[10px] font-black bg-orange-100 text-orange-800 px-2 py-0.5 rounded-md">Hằng Ngày</span>;
      case 'weekly':
        return <span className="text-[10px] font-black bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">Tuần Học</span>;
      case 'regular':
        return <span className="text-[10px] font-black bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md">Khách Quen</span>;
      case 'event':
        return <span className="text-[10px] font-black bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md">Sự Kiện</span>;
      case 'business':
        return <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">Kinh Doanh</span>;
      default:
        return <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">Hướng Dẫn</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Sub tabs: Nhiệm Vụ vs Thành Tựu */}
      <div className="flex items-center justify-between border-b-2 border-amber-200 pb-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSubTab('quests')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs md:text-sm font-black transition-all cursor-pointer ${
              activeSubTab === 'quests'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white/80 text-amber-900 hover:bg-amber-100'
            }`}
          >
            <Target className="w-4 h-4" />
            Nhiệm Vụ {pendingClaimsCount > 0 && `(${pendingClaimsCount})`}
          </button>

          <button
            onClick={() => setActiveSubTab('achievements')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs md:text-sm font-black transition-all cursor-pointer ${
              activeSubTab === 'achievements'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white/80 text-amber-900 hover:bg-amber-100'
            }`}
          >
            <Trophy className="w-4 h-4" />
            Thành Tựu ({achievements.filter((a) => a.unlocked).length}/{achievements.length})
          </button>
        </div>
      </div>

      {/* DANH SÁCH NHIỆM VỤ */}
      {activeSubTab === 'quests' && (
        <div className="space-y-3">
          {/* Bộ lọc nhóm nhiệm vụ */}
          <div className="flex flex-wrap gap-1.5 pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-amber-800 text-white shadow-xs'
                    : 'bg-white/90 text-amber-900 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          <div className="space-y-2.5">
            {filteredQuests.map((quest) => {
              const percent = Math.min(
                100,
                Math.round((quest.currentProgress / quest.targetValue) * 100)
              );

              return (
                <div
                  key={quest.id}
                  className={`bg-white/95 border-2 rounded-2xl p-3.5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all ${
                    quest.completed && !quest.claimed
                      ? 'border-emerald-500 bg-emerald-50/50'
                      : 'border-amber-900/15'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm md:text-base text-amber-950">
                        {quest.title}
                      </h4>
                      {getCategoryBadge(quest.category)}
                    </div>
                    <p className="text-xs text-amber-800/85 mt-0.5">{quest.description}</p>

                    {/* Thanh tiến độ */}
                    <div className="mt-2 flex items-center gap-2 max-w-md">
                      <div className="flex-1 bg-amber-100 h-2.5 rounded-full overflow-hidden border border-amber-200">
                        <div
                          className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-full rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      <span className="text-[11px] font-bold text-amber-900">
                        {quest.currentProgress}/{quest.targetValue} ({percent}%)
                      </span>
                    </div>
                  </div>

                  {/* Phần thưởng & Nút nhận */}
                  <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-amber-100">
                    <div className="text-right">
                      <span className="text-[10px] text-amber-700 block">Phần thưởng:</span>
                      <span className="font-black text-xs md:text-sm text-emerald-700">
                        +{formatCurrency(quest.rewardCash)} • +{quest.rewardReputation}⭐
                      </span>
                    </div>

                    {quest.claimed ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Đã nhận
                      </span>
                    ) : quest.completed ? (
                      <GameButton
                        variant="primary"
                        size="sm"
                        onClick={() => onClaimQuest(quest.id)}
                        icon={<Gift className="w-3.5 h-3.5" />}
                      >
                        Nhận Thưởng
                      </GameButton>
                    ) : (
                      <span className="text-xs font-bold text-amber-800/70 bg-amber-100/60 px-3 py-1.5 rounded-xl">
                        Đang làm...
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DANH SÁCH THÀNH TỰU */}
      {activeSubTab === 'achievements' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`border-2 rounded-2xl p-3.5 flex items-start gap-3 transition-all ${
                ach.unlocked
                  ? 'bg-amber-50/90 border-amber-400 shadow-sm'
                  : 'bg-white/60 border-dashed border-amber-200 opacity-60'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 shadow-inner ${
                  ach.unlocked
                    ? 'bg-gradient-to-br from-amber-300 to-amber-500 text-amber-950 border border-amber-500'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                {ach.unlocked ? '🏆' : '🔒'}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-sm text-amber-950">{ach.title}</h4>
                  {ach.unlocked && (
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md">
                      {ach.unlockedDate || 'Đã đạt'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-amber-900/80 mt-0.5 leading-relaxed">
                  {ach.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
