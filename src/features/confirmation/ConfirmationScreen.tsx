import React from 'react';
import { BusinessModelId } from '@/game/types';
import { BUSINESS_MODELS } from '@/game/data/businessModels';
import { ALL_MENU_ITEMS } from '@/game/data/menuItems';
import { formatCurrency } from '@/utils/formatters';
import { GameButton } from '@/components/ui/GameButton';
import { ArrowLeft, Sparkles, Coins, Package, BookOpen, PartyPopper } from 'lucide-react';

interface ConfirmationScreenProps {
  modelId: BusinessModelId;
  shopName: string;
  playerName: string;
  onBack: () => void;
  onStartDayOne: () => void;
}

export const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({
  modelId,
  shopName,
  playerName,
  onBack,
  onStartDayOne,
}) => {
  const model = BUSINESS_MODELS[modelId] || BUSINESS_MODELS.boba_tea;
  const starterItems = ALL_MENU_ITEMS.filter((item) =>
    model.unlockedMenuIds.includes(item.id)
  );

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 md:p-6 bg-gradient-to-b from-amber-100 via-orange-50 to-amber-200 select-none">
      {/* Header */}
      <div className="max-w-xl mx-auto w-full text-center pt-2">
        <span className="bg-emerald-200 text-emerald-900 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-emerald-300">
          Bước 3 / 3: Sẵn Sàng Khai Trương
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-amber-950 mt-2">
          Xác Nhận Vốn & Bắt Đầu Ngày 1
        </h2>
        <p className="text-xs md:text-sm text-amber-800 font-medium mt-1">
          Mọi sự chuẩn bị đã hoàn tất, tiếng chuông trường sắp sửa reo lên rồi!
        </p>
      </div>

      {/* Thẻ tóm tắt khai trương */}
      <div className="max-w-lg mx-auto w-full my-auto py-5 bg-white/95 border-4 border-amber-900/20 rounded-3xl p-5 md:p-7 shadow-2xl space-y-4">
        {/* Banner tên quán */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-4 text-white text-center shadow-md">
          <span className="text-[11px] font-bold text-amber-100 uppercase tracking-widest block">
            {model.name}
          </span>
          <h3 className="text-xl md:text-2xl font-black drop-shadow-sm mt-0.5">
            {shopName}
          </h3>
          <p className="text-xs text-amber-100 font-medium mt-0.5">
            Chủ tiệm: <strong>{playerName}</strong> • Địa điểm: Cổng Trường Bình Minh
          </p>
        </div>

        {/* Các chỉ số khởi nghiệp */}
        <div className="space-y-2.5">
          {/* Tiền mặt khởi đầu */}
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-emerald-600" />
              Tiền Vốn Khởi Đầu Cấp Sẵn:
            </span>
            <span className="text-base font-black text-emerald-700">
              {formatCurrency(model.startingCash)}
            </span>
          </div>

          {/* Kho nguyên liệu ban đầu */}
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-amber-700" />
              Nguyên Liệu Trong Kho:
            </span>
            <span className="text-xs font-black text-amber-950">
              Đã Nhập Sẵn Cho ~50 Đơn Đầu Tiên
            </span>
          </div>

          {/* Thực đơn khởi đầu */}
          <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200">
            <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5 mb-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              3 Công Thức Mở Khóa Ngày Đầu:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {starterItems.map((item) => (
                <span
                  key={item.id}
                  className="bg-white text-blue-950 text-xs font-black px-2.5 py-1 rounded-xl border border-blue-300 shadow-sm"
                >
                  ✓ {item.name} ({formatCurrency(item.basePrice)})
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Lời chúc khai trương */}
        <div className="p-3 bg-orange-50 rounded-2xl border border-orange-200 text-center text-xs text-orange-950 italic flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-orange-600 flex-shrink-0" />
          <span>"Chúc tiệm nhỏ của bạn buôn may bán đắt, rộn rã tiếng cười tuổi học trò!"</span>
        </div>
      </div>

      {/* Điều hướng */}
      <div className="max-w-xl mx-auto w-full flex items-center justify-between pt-2 pb-2">
        <GameButton
          variant="secondary"
          size="md"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={onBack}
        >
          Quay Lại
        </GameButton>

        <GameButton
          variant="success"
          size="lg"
          icon={<PartyPopper className="w-5 h-5" />}
          onClick={onStartDayOne}
          className="text-base px-6 py-3 shadow-xl animate-bounce-gentle"
        >
          Khai Trương Ngày 1!
        </GameButton>
      </div>
    </div>
  );
};
