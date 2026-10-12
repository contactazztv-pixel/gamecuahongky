import React, { useState } from 'react';
import { GameButton } from '@/components/ui/GameButton';
import { ArrowRight, ChevronRight, SkipForward } from 'lucide-react';

interface IntroStoryScreenProps {
  onContinue: () => void;
  onSkip: () => void;
}

export const IntroStoryScreen: React.FC<IntroStoryScreenProps> = ({ onContinue, onSkip }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      badge: 'Chương 1: Góc Phố Tuổi Thơ',
      icon: '🏫',
      imageUrl: '/assets/backgrounds/school_gate_morning.jpg',
      title: 'Trước Cổng Trường Bình Minh',
      text: 'Mỗi buổi sáng khi tiếng chuông trường reo vang, dòng xe đạp trắng tinh khôi của học sinh lại tấp nập ùa về. Góc vỉa hè dưới tán phượng vĩ luôn là nơi rộn rã tiếng cười đùa nhất.',
      vibe: 'Cây phượng vĩ đỏ rực, tiếng cười giòn tan và những ánh mắt háo hức đón chào ngày mới.',
    },
    {
      badge: 'Chương 2: Ước Mơ Nhỏ Nơi Vỉa Hè',
      icon: '🧋',
      imageUrl: '/assets/shops/stall_boba_tea.jpg',
      title: 'Gói Trọn Yêu Thương Trong Món Ngon',
      text: 'Bạn quyết định gom góp số vốn nhỏ tích lũy được bấy lâu nay, thuê một góc nhỏ xinh xắn trước cổng trường để mở quầy ẩm thực phục vụ các em học sinh và thầy cô.',
      vibe: 'Không chỉ là buôn bán kiếm sống, đó còn là nơi lưu giữ những món ăn tuổi thơ thơm nức mũi.',
    },
    {
      badge: 'Chương 3: Khởi Đầu Hành Trình',
      icon: '✨',
      imageUrl: '/assets/shops/stall_breakfast.jpg',
      title: 'Lựa Chọn Con Đường Riêng',
      text: 'Một chiếc xe đẩy trà sữa mát lạnh? Quầy ăn vặt thơm lừng xiên que chiên? Hay quầy bánh mì xôi nóng sốt chắc bụng? Đã đến lúc bạn đưa ra quyết định kinh doanh đầu tiên!',
      vibe: 'Mỗi mô hình mang một hương vị, một nhịp điệu và một trải nghiệm thú vị rất riêng.',
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onContinue();
    }
  };

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 bg-gradient-to-b from-amber-100 via-orange-50 to-amber-200 select-none relative overflow-hidden">
      {/* Nút bỏ qua nhanh */}
      <div className="w-full max-w-lg flex justify-end z-10 pt-2">
        <button
          onClick={onSkip}
          className="text-xs font-bold text-amber-900/70 hover:text-amber-950 flex items-center gap-1 bg-white/60 hover:bg-white px-3 py-1.5 rounded-full border border-amber-300/80 transition-all shadow-sm"
        >
          <span>Bỏ qua dẫn truyện</span>
          <SkipForward className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Thẻ truyện dạng Storybook */}
      <div className="w-full max-w-lg bg-white/95 border-4 border-amber-900/20 rounded-3xl p-6 md:p-8 shadow-2xl z-10 my-auto text-center space-y-4">
        <span className="inline-block bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
          {slide.badge}
        </span>

        {/* Khung ảnh minh họa truyện 2D */}
        <div className="w-full max-w-[280px] h-36 mx-auto rounded-2xl overflow-hidden bg-amber-50 border-3 border-amber-300 shadow-md flex items-center justify-center relative">
          {slide.imageUrl ? (
            <img
              src={slide.imageUrl}
              alt={slide.title}
              className="w-full h-full object-cover select-none"
            />
          ) : (
            <span className="text-5xl">{slide.icon}</span>
          )}
        </div>

        <h2 className="text-xl md:text-2xl font-black text-amber-950">{slide.title}</h2>

        <p className="text-sm md:text-base text-amber-900 leading-relaxed font-medium">
          {slide.text}
        </p>

        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs italic text-amber-800">
          "{slide.vibe}"
        </div>

        {/* Chỉ báo chấm tròn slide */}
        <div className="flex justify-center gap-2 pt-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === currentSlide ? 'w-6 bg-amber-600' : 'w-2 bg-amber-300'
              }`}
            ></div>
          ))}
        </div>
      </div>

      {/* Nút tiếp tục */}
      <div className="w-full max-w-lg flex justify-end z-10 pb-4">
        <GameButton
          variant="primary"
          size="lg"
          icon={currentSlide === slides.length - 1 ? <ArrowRight className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          onClick={handleNext}
          className="w-full sm:w-auto"
        >
          {currentSlide === slides.length - 1 ? 'Chọn Mô Hình Kinh Doanh' : 'Trang Tiếp Theo'}
        </GameButton>
      </div>
    </div>
  );
};
