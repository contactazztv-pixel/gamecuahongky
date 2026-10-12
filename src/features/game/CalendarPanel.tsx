import React from 'react';
import { GameCalendar } from '@/game/types';
import { getWeatherInfo, getDayOfWeekLabel } from '@/utils/formatters';
import { SCHOOL_SEASONAL_EVENTS } from '@/game/data/events';
import { useGameStore } from '@/stores/gameStore';
import {
  CalendarDays,
  Sun,
  Umbrella,
  PartyPopper,
  GraduationCap,
  Sparkles,
  TrendingUp,
  School,
} from 'lucide-react';

interface CalendarPanelProps {
  calendar: GameCalendar;
}

export const CalendarPanel: React.FC<CalendarPanelProps> = ({ calendar }) => {
  const activeSeasonalEvent = useGameStore((s) => s.activeSeasonalEvent);
  const weather = getWeatherInfo(calendar.weather);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base md:text-lg font-black text-amber-950 flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-amber-700" />
          Lịch Học Đường & Sự Kiện Theo Mùa
        </h3>
        <p className="text-xs text-amber-800/80">
          Nắm bắt thời tiết, tuần học và sự kiện để dự trữ nguyên liệu và điều chỉnh thực đơn đón sóng khách hàng.
        </p>
      </div>

      {/* THẺ TỔNG QUAN LỊCH HỌC VÀ THỜI TIẾT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Thẻ tuần học & Ngày học */}
        <div className="bg-white/95 border-2 border-amber-300 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider">
              Học Kỳ 1 • Tuần {calendar.schoolWeek || 1}
            </span>
            <h4 className="text-base md:text-lg font-black text-amber-950 mt-0.5 flex items-center gap-1.5">
              <School className="w-4 h-4 text-amber-700" />
              {getDayOfWeekLabel(calendar.dayOfWeek)} (Ngày {calendar.day})
            </h4>
            <div className="mt-1">
              {calendar.isSchoolDay ? (
                <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                  ✓ Ngày học sinh đến trường (Đông đúc)
                </span>
              ) : (
                <span className="text-[11px] font-extrabold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-md">
                  🏖️ Ngày nghỉ cuối tuần (Thư thả)
                </span>
              )}
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-800 text-center">
            <span className="text-xs font-black block">TUẦN</span>
            <span className="text-2xl font-black text-amber-950">{calendar.schoolWeek || 1}</span>
          </div>
        </div>

        {/* Thẻ Thời tiết hôm nay */}
        <div className="bg-gradient-to-br from-amber-100 to-sky-100 border-2 border-amber-300 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider">
              Dự Báo Thời Tiết
            </span>
            <h4 className="text-base md:text-lg font-black text-amber-950 flex items-center gap-2 mt-0.5">
              <span>{weather.iconText}</span>
              <span>{weather.label}</span>
            </h4>
            <p className="text-xs text-amber-900/80 mt-1">{weather.note}</p>
          </div>

          <div className="p-3 bg-white/80 rounded-2xl shadow-inner text-amber-800 flex-shrink-0">
            {calendar.weather === 'rainy' ? (
              <Umbrella className="w-8 h-8 text-sky-600" />
            ) : (
              <Sun className="w-8 h-8 text-amber-500 fill-amber-400" />
            )}
          </div>
        </div>
      </div>

      {/* SỰ KIỆN THEO MÙA ĐANG DIỄN RA (NẾU CÓ) */}
      {activeSeasonalEvent && (
        <div className="bg-gradient-to-r from-purple-50 via-amber-50 to-orange-50 border-3 border-purple-400 rounded-3xl p-4 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
              <h4 className="text-sm md:text-base font-black text-purple-950">
                Sự Kiện Đang Diễn Ra: {activeSeasonalEvent.name}
              </h4>
            </div>
            <span className="text-xs font-black bg-purple-600 text-white px-2.5 py-0.5 rounded-full shadow-xs">
              {activeSeasonalEvent.badge}
            </span>
          </div>

          <p className="text-xs text-purple-900/90 leading-relaxed">
            {activeSeasonalEvent.description}
          </p>

          {/* Các buff kinh tế của sự kiện */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-xs">
            <div className="p-2 bg-white/90 rounded-xl border border-purple-200">
              <span className="text-[10px] text-purple-800 block font-bold">Lượng khách ghé:</span>
              <span className="text-emerald-700 font-black flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                +{Math.round((activeSeasonalEvent.effects.trafficMultiplier - 1) * 100)}%
              </span>
            </div>

            <div className="p-2 bg-white/90 rounded-xl border border-purple-200">
              <span className="text-[10px] text-purple-800 block font-bold">Tiền tip thưởng:</span>
              <span className="text-emerald-700 font-black">
                +{Math.round((activeSeasonalEvent.effects.tipMultiplier - 1) * 100)}%
              </span>
            </div>

            <div className="p-2 bg-white/90 rounded-xl border border-purple-200 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-purple-800 block font-bold">Món ưa chuộng:</span>
              <span className="text-amber-950 font-black">
                {activeSeasonalEvent.effects.boostCategories?.join(', ') || 'Tất cả'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* DÒNG LỊCH CÁC SỰ KIỆN TRONG TOÀN KHÓA HỌC */}
      <div className="space-y-2.5">
        <h4 className="font-extrabold text-sm text-amber-950 flex items-center gap-1.5">
          <PartyPopper className="w-4 h-4 text-rose-600" />
          Niên Lịch Học Đường Năm Học
        </h4>

        <div className="space-y-2">
          {SCHOOL_SEASONAL_EVENTS.map((evt) => {
            const isToday =
              activeSeasonalEvent?.id === evt.id ||
              (calendar.day >= evt.startDay && calendar.day <= evt.endDay);
            const isPassed = calendar.day > evt.endDay && !evt.repeatIntervalDays;

            return (
              <div
                key={evt.id}
                className={`border-2 rounded-2xl p-3.5 transition-all ${
                  isToday
                    ? 'bg-amber-50 border-amber-500 shadow-sm'
                    : isPassed
                    ? 'bg-slate-50 border-slate-200 opacity-60'
                    : 'bg-white/90 border-amber-200/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-700" />
                    {evt.repeatIntervalDays
                      ? `Định kỳ mỗi 2 tuần (Ngày ${evt.startDay} - ${evt.endDay})`
                      : `Ngày ${evt.startDay} đến Ngày ${evt.endDay}`}
                  </span>

                  {isToday ? (
                    <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                      Đang diễn ra hôm nay
                    </span>
                  ) : isPassed ? (
                    <span className="text-[10px] font-bold text-slate-500">Đã qua</span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                      Sắp tới
                    </span>
                  )}
                </div>

                <h5 className="font-bold text-sm text-amber-950 mt-1">{evt.name}</h5>
                <p className="text-xs text-amber-800/85 mt-0.5 leading-relaxed">{evt.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
