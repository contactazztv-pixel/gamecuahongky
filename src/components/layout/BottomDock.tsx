import React from 'react';
import { DockTab } from '@/stores/gameStore';
import {
  Bell,
  BookOpen,
  PackageCheck,
  Hammer,
  Target,
  Users2,
  CalendarDays,
  LineChart,
} from 'lucide-react';

interface BottomDockProps {
  activeTab: DockTab;
  onSelectTab: (tab: DockTab) => void;
  unclaimedQuestsCount: number;
}

export const BottomDock: React.FC<BottomDockProps> = React.memo(({
  activeTab,
  onSelectTab,
  unclaimedQuestsCount,
}) => {
  const tabs = [
    { id: 'service' as DockTab, label: 'Bán Hàng', icon: Bell },
    { id: 'menu' as DockTab, label: 'Thực Đơn', icon: BookOpen },
    { id: 'inventory' as DockTab, label: 'Kho & Nhập Hàng', icon: PackageCheck },
    { id: 'upgrade' as DockTab, label: 'Nâng Cấp', icon: Hammer },
    { id: 'quests' as DockTab, label: 'Nhiệm Vụ', icon: Target, badge: unclaimedQuestsCount },
    { id: 'ledger' as DockTab, label: 'Sổ Thu Chi', icon: LineChart },
    { id: 'regulars' as DockTab, label: 'Khách Quen', icon: Users2 },
    { id: 'calendar' as DockTab, label: 'Lịch & Sự Kiện', icon: CalendarDays },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-amber-50/98 border-t-2 border-amber-900/20 shadow-2xl px-1.5 md:px-3 pt-1.5 pb-[max(0.4rem,env(safe-area-inset-bottom))]">
      <div className="max-w-4xl mx-auto flex items-center justify-between sm:justify-around gap-0.5 sm:gap-1 overflow-x-auto no-scrollbar py-0.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-1.5 sm:px-2.5 rounded-2xl transition-all flex-shrink-0 ${
                isActive
                  ? 'bg-amber-500 text-white shadow-game-sm -translate-y-0.5 font-black scale-105'
                  : 'text-amber-900/80 hover:bg-amber-200/60 font-bold active:scale-95'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon className={`w-4 h-4 md:w-5 md:h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 bg-rose-500 text-white rounded-full text-[9px] font-black flex items-center justify-center shadow-md border border-white">
                    {tab.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] md:text-xs tracking-tight mt-0.5 whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
});
