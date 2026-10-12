import React from 'react';
import { ShopUpgrade } from '@/game/types';
import { SHOP_UPGRADES } from '@/game/data/upgrades';
import { formatCurrency } from '@/utils/formatters';
import { GameButton } from '@/components/ui/GameButton';
import { Hammer, CheckCircle2, Lock, Sparkles } from 'lucide-react';

interface UpgradePanelProps {
  ownedUpgrades: string[];
  currentLevel: number;
  cash: number;
  onBuyUpgrade: (upgradeId: string) => { success: boolean; message: string } | boolean | void;
}

export const UpgradePanel: React.FC<UpgradePanelProps> = ({
  ownedUpgrades,
  currentLevel,
  cash,
  onBuyUpgrade,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base md:text-lg font-black text-amber-950 flex items-center gap-2">
          <Hammer className="w-5 h-5 text-amber-700" />
          Nâng Cấp Quầy Hàng & Tiện Ích
        </h3>
        <p className="text-xs text-amber-800/80">
          Đầu tư trang thiết bị để nấu nhanh hơn, thu hút thêm học sinh và làm đẹp tiệm nhỏ.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {SHOP_UPGRADES.map((upgrade: ShopUpgrade) => {
          const isOwned = ownedUpgrades.includes(upgrade.id);
          const isLevelLocked = currentLevel < upgrade.requiredLevel;
          const canAfford = cash >= upgrade.cost;

          return (
            <div
              key={upgrade.id}
              className={`rounded-2xl border-2 p-4 flex flex-col justify-between shadow-sm transition-all ${
                isOwned
                  ? 'bg-emerald-50/70 border-emerald-500/60'
                  : isLevelLocked
                  ? 'bg-amber-100/40 border-dashed border-amber-300 opacity-60'
                  : 'bg-white/95 border-amber-900/15'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-2 rounded-xl text-lg ${
                        isOwned ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm md:text-base text-amber-950">
                        {upgrade.name}
                      </h4>
                      <span className="text-[11px] font-bold text-amber-700">
                        Yêu cầu: Cấp {upgrade.requiredLevel}
                      </span>
                    </div>
                  </div>

                  {isOwned && (
                    <span className="flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Đã sở hữu
                    </span>
                  )}
                </div>

                <p className="text-xs text-amber-800/85 mt-2 leading-relaxed">
                  {upgrade.description}
                </p>

                {/* Tác dụng gameplay */}
                <div className="mt-3 p-2 bg-amber-50/90 rounded-xl border border-amber-200 text-xs">
                  <span className="font-bold text-amber-900 block">Hiệu ứng:</span>
                  <span className="text-emerald-800 font-extrabold">{upgrade.perkDescription}</span>
                </div>
              </div>

              {/* Nút nâng cấp */}
              <div className="mt-3.5 pt-2.5 border-t border-amber-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-amber-700 block">Chi phí:</span>
                  <span className="font-black text-amber-950 text-sm md:text-base">
                    {formatCurrency(upgrade.cost)}
                  </span>
                </div>

                {isOwned ? (
                  <span className="text-xs font-extrabold text-emerald-600">Đang hoạt động</span>
                ) : isLevelLocked ? (
                  <GameButton variant="secondary" size="sm" disabled icon={<Lock className="w-3.5 h-3.5" />}>
                    Cần Cấp {upgrade.requiredLevel}
                  </GameButton>
                ) : (
                  <GameButton
                    variant="primary"
                    size="sm"
                    disabled={!canAfford}
                    onClick={() => onBuyUpgrade(upgrade.id)}
                  >
                    Nâng Cấp
                  </GameButton>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
