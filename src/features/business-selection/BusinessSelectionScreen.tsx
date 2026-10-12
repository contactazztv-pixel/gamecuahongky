import React from 'react';
import { BusinessModelId } from '@/game/types';
import { BUSINESS_MODELS } from '@/game/data/businessModels';
import { ALL_MENU_ITEMS } from '@/game/data/menuItems';
import { formatCurrency } from '@/utils/formatters';
import { GameButton } from '@/components/ui/GameButton';
import { Check, ArrowRight, ArrowLeft, ThumbsUp, AlertCircle, Coins, Award } from 'lucide-react';
import { DishIllustration } from '@/components/common/DishIllustration';

import { getShopImageUrl } from '@/data/assetManifest';

interface BusinessSelectionScreenProps {
  selectedModelId: BusinessModelId;
  onSelectModel: (id: BusinessModelId) => void;
  onBack: () => void;
  onConfirm: () => void;
}

export const BusinessSelectionScreen: React.FC<BusinessSelectionScreenProps> = ({
  selectedModelId,
  onSelectModel,
  onBack,
  onConfirm,
}) => {
  const modelKeys = Object.keys(BUSINESS_MODELS) as BusinessModelId[];

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 md:p-6 bg-gradient-to-b from-amber-100 via-orange-50 to-amber-200 select-none">
      {/* Header */}
      <div className="max-w-4xl mx-auto w-full text-center pt-2">
        <span className="bg-amber-200 text-amber-900 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-amber-300">
          Bước 1 / 3: Chọn Hướng Đi
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-amber-950 mt-2">
          Chọn Mô Hình Kinh Doanh Khởi Nghiệp
        </h2>
        <p className="text-xs md:text-sm text-amber-800 font-medium mt-1">
          Mỗi mô hình có số vốn ban đầu, ưu điểm và thực đơn khởi nghiệp hoàn toàn khác nhau!
        </p>
      </div>

      {/* Grid 3 mô hình */}
      <div className="max-w-5xl mx-auto w-full my-auto py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {modelKeys.map((key) => {
          const model = BUSINESS_MODELS[key];
          const isSelected = selectedModelId === key;
          const starterItems = ALL_MENU_ITEMS.filter((item) =>
            model.unlockedMenuIds.includes(item.id)
          );
          const shopImg = getShopImageUrl(key);

          const getModelIllustration = () => {
            if (shopImg) {
              return (
                <img
                  src={shopImg}
                  alt={model.name}
                  className="w-full h-full object-cover rounded-xl shadow-xs"
                />
              );
            }
            if (key === 'boba_tea') return <DishIllustration itemId="drink_tra_sua_truyen_thong" size="lg" />;
            if (key === 'street_snack') return <DishIllustration itemId="snack_banh_trang_tron" size="lg" />;
            return <DishIllustration itemId="staple_banh_mi_thap_cam" size="lg" />;
          };

          return (
            <div
              key={key}
              onClick={() => onSelectModel(key)}
              className={`relative rounded-3xl border-4 p-4 md:p-5 flex flex-col justify-between cursor-pointer transition-all ${
                isSelected
                  ? 'bg-white border-amber-500 shadow-2xl scale-[1.02]'
                  : 'bg-white/80 border-amber-900/15 hover:border-amber-300 shadow-md opacity-90'
              }`}
            >
              {/* Badge chọn */}
              {isSelected && (
                <div className="absolute -top-3.5 right-4 bg-emerald-600 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 stroke-[3]" /> Đang Chọn
                </div>
              )}

              <div>
                {/* Header thẻ */}
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 border-2 border-amber-300 flex items-center justify-center p-1 shadow-inner flex-shrink-0">
                    {getModelIllustration()}
                  </div>
                  <div>
                    <h3 className="font-black text-base md:text-lg text-amber-950 leading-tight">
                      {model.name}
                    </h3>
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-md mt-1 inline-block">
                      {model.badgeText}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-amber-900/80 mt-2.5 leading-relaxed font-medium">
                  {model.description}
                </p>

                {/* Vốn khởi đầu */}
                <div className="mt-3 p-2.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                    <Coins className="w-4 h-4 text-emerald-600" /> Vốn ban đầu:
                  </span>
                  <span className="text-sm font-black text-emerald-700">
                    {formatCurrency(model.startingCash)}
                  </span>
                </div>

                {/* Ưu điểm */}
                <div className="mt-3 space-y-1">
                  <span className="text-[11px] font-black text-emerald-800 flex items-center gap-1 uppercase">
                    <ThumbsUp className="w-3.5 h-3.5" /> Điểm mạnh:
                  </span>
                  <ul className="text-xs text-amber-900/90 space-y-1 pl-1">
                    {model.perks.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Hạn chế */}
                <div className="mt-2.5 space-y-1">
                  <span className="text-[11px] font-black text-rose-800 flex items-center gap-1 uppercase">
                    <AlertCircle className="w-3.5 h-3.5" /> Thách thức:
                  </span>
                  <ul className="text-xs text-amber-900/90 space-y-1 pl-1">
                    {model.drawbacks.map((d, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span className="text-rose-500 font-bold">•</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Món mở khóa sẵn */}
                <div className="mt-3 pt-2.5 border-t border-amber-100">
                  <span className="text-[11px] font-black text-amber-900 block mb-1">
                    Món mở khóa ban đầu:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {starterItems.map((item) => (
                      <span
                        key={item.id}
                        className="bg-amber-100/90 text-amber-950 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-amber-200/80 flex items-center gap-1"
                      >
                        <DishIllustration itemId={item.id} size="sm" />
                        <span>{item.name}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chân thẻ */}
              <div className="mt-4 pt-2 border-t border-amber-100 flex items-center justify-between text-xs">
                <span className="text-amber-800 font-semibold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> Độ khó: <strong>{model.difficulty}</strong>
                </span>

                <button
                  type="button"
                  className={`text-xs font-black px-3 py-1.5 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                  }`}
                >
                  {isSelected ? 'Đã Chọn' : 'Chọn Mô Hình'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Điều hướng dưới cùng */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between pt-2 pb-2">
        <GameButton
          variant="secondary"
          size="md"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={onBack}
        >
          Quay Lại
        </GameButton>

        <GameButton
          variant="primary"
          size="md"
          icon={<ArrowRight className="w-4 h-4" />}
          onClick={onConfirm}
        >
          Tiếp Tục: Đặt Tên Quán
        </GameButton>
      </div>
    </div>
  );
};
