import React from 'react';
import { BusinessModelId } from '@/game/types';
import { BUSINESS_MODELS } from '@/game/data/businessModels';
import { GameButton } from '@/components/ui/GameButton';
import { ArrowLeft, ArrowRight, Dices, Store, User } from 'lucide-react';
import { soundManager } from '@/services/audio/soundEffects';

interface ShopNamingScreenProps {
  modelId: BusinessModelId;
  shopName: string;
  playerName: string;
  onShopNameChange: (name: string) => void;
  onPlayerNameChange: (name: string) => void;
  onBack: () => void;
  onConfirm: () => void;
}

export const ShopNamingScreen: React.FC<ShopNamingScreenProps> = ({
  modelId,
  shopName,
  playerName,
  onShopNameChange,
  onPlayerNameChange,
  onBack,
  onConfirm,
}) => {
  const model = BUSINESS_MODELS[modelId] || BUSINESS_MODELS.boba_tea;

  const shopSuggestions = {
    boba_tea: [
      'Tiệm Trà Sữa Góc Cây Phượng',
      'Trà Sữa Bé Vy 10 Điểm',
      'Góc Giải Khát Tan Trường',
      'Trà Sữa Sân Trường Tuổi Thơ',
      'Tiệm Trà Thơm Bình Minh',
    ],
    street_snack: [
      'Quầy Ăn Vặt Cô Ba Vỉa Hè',
      'Xiên Que Giòn Rụm Lớp 12',
      'Bánh Tráng Trộn Tan Học',
      'Mì Cay Cay Xé Góc Cổng Trường',
      'Góc Ăn Vặt Thân Thương',
    ],
    breakfast_stall: [
      'Bánh Mì Pate Cô Năm Sài Gòn',
      'Quầy Điểm Tâm Bình Minh',
      'Xôi Bắp & Bánh Mì Giòn Rụm',
      'Bếp Nhỏ Sáng Sớm Cổng Trường',
      'Tiệm Bánh Mì Ốp La Tuổi Thơ',
    ],
  }[modelId];

  const playerSuggestions = ['Bé Vy', 'Hoàng An', 'Chú Bảy', 'Cô Mai', 'Minh Quân', 'Khánh Linh'];

  const handleRandomizeShopName = () => {
    soundManager.playClick();
    const random = shopSuggestions[Math.floor(Math.random() * shopSuggestions.length)];
    onShopNameChange(random);
  };

  const handleRandomizePlayerName = () => {
    soundManager.playClick();
    const random = playerSuggestions[Math.floor(Math.random() * playerSuggestions.length)];
    onPlayerNameChange(random);
  };

  return (
    <div className="min-h-[100dvh] overflow-y-auto flex flex-col justify-between p-3 sm:p-5 md:p-6 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] bg-gradient-to-b from-amber-100 via-orange-50 to-amber-200 select-none">
      {/* Header */}
      <div className="max-w-xl mx-auto w-full text-center pt-2">
        <span className="bg-amber-200 text-amber-900 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-amber-300">
          Bước 2 / 3: Danh Xưng
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-amber-950 mt-2">
          Đặt Tên Cho Tiệm Nhỏ Của Bạn
        </h2>
        <p className="text-xs md:text-sm text-amber-800 font-medium mt-1">
          Một cái tên đáng yêu và dễ nhớ sẽ khiến các bạn học sinh truyền tai nhau mỗi ngày.
        </p>
      </div>

      {/* Form & Biển hiệu xem trước */}
      <div className="max-w-lg mx-auto w-full my-auto py-4 sm:py-6 space-y-4 sm:space-y-5">
        {/* Biển hiệu xem trước */}
        <div className="bg-amber-900 text-amber-100 p-4 sm:p-5 rounded-3xl border-4 border-amber-400 shadow-xl text-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-amber-300"></div>
          <span className="text-[10px] font-black text-amber-300 tracking-widest uppercase">
            {model.name}
          </span>
          <h3 className="text-xl md:text-2xl font-black text-white mt-1 drop-shadow-md">
            {shopName.trim() || 'Tiệm Nhỏ Của Bạn'}
          </h3>
          <p className="text-xs text-amber-200/90 italic mt-0.5">
            Chủ tiệm: <strong>{playerName.trim() || 'Chủ Quán'}</strong> • Khai trương tại Cổng Trường Bình Minh
          </p>
        </div>

        {/* Input Tên Cửa Hàng */}
        <div className="bg-white/95 border-2 border-amber-900/15 rounded-3xl p-4 sm:p-5 shadow-md space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-extrabold text-amber-950 flex items-center gap-1.5">
                <Store className="w-4 h-4 text-amber-700" />
                Tên Cửa Hàng / Quầy Hàng:
              </label>
              <button
                type="button"
                onClick={handleRandomizeShopName}
                className="text-[11px] font-extrabold text-amber-800 hover:text-amber-950 flex items-center gap-1 bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded-lg transition-colors min-h-[32px]"
              >
                <Dices className="w-3.5 h-3.5" /> Gợi ý tên hay
              </button>
            </div>
            <input
              type="text"
              value={shopName}
              onChange={(e) => onShopNameChange(e.target.value)}
              maxLength={40}
              placeholder="Nhập tên quán của bạn..."
              className="w-full px-4 py-2.5 rounded-2xl border-2 border-amber-300 focus:border-amber-600 focus:outline-none font-bold text-amber-950 text-base bg-amber-50/50"
            />
          </div>

          {/* Input Tên Chủ Quán */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-extrabold text-amber-950 flex items-center gap-1.5">
                <User className="w-4 h-4 text-amber-700" />
                Tên Chủ Quán (Người Chơi):
              </label>
              <button
                type="button"
                onClick={handleRandomizePlayerName}
                className="text-[11px] font-extrabold text-amber-800 hover:text-amber-950 flex items-center gap-1 bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded-lg transition-colors min-h-[32px]"
              >
                <Dices className="w-3.5 h-3.5" /> Ngẫu nhiên
              </button>
            </div>
            <input
              type="text"
              value={playerName}
              onChange={(e) => onPlayerNameChange(e.target.value)}
              maxLength={20}
              placeholder="Nhập tên của bạn..."
              className="w-full px-4 py-2.5 rounded-2xl border-2 border-amber-300 focus:border-amber-600 focus:outline-none font-bold text-amber-950 text-base bg-amber-50/50"
            />
          </div>
        </div>
      </div>

      {/* Điều hướng */}
      <div className="max-w-xl mx-auto w-full flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-3 pb-2">
        <GameButton
          variant="secondary"
          size="md"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={onBack}
          className="w-full sm:w-auto min-h-[44px] justify-center"
        >
          Quay Lại
        </GameButton>

        <GameButton
          variant="primary"
          size="md"
          icon={<ArrowRight className="w-4 h-4" />}
          onClick={onConfirm}
          disabled={!shopName.trim()}
          className="w-full sm:w-auto min-h-[46px] justify-center shadow-md font-bold"
        >
          Xác Nhận Vốn & Bắt Đầu
        </GameButton>
      </div>
    </div>
  );
};
