import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { GameButton } from '@/components/ui/GameButton';
import {
  Smartphone,
  Download,
  Share,
  PlusSquare,
  Sparkles,
  CheckCircle,
  WifiOff,
  Zap,
} from 'lucide-react';
import { soundManager } from '@/services/audio/soundEffects';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('android');

  useEffect(() => {
    // Phát hiện thiết bị
    const userAgent = navigator.userAgent || '';
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      setPlatform('ios');
    } else if (/Android/.test(userAgent)) {
      setPlatform('android');
    } else {
      setPlatform('desktop');
    }

    // Bắt sự kiện beforeinstallprompt của Chrome / Android
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Kiểm tra xem đã chạy ở chế độ standalone (đã cài đặt) chưa
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    soundManager.playClick();
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        soundManager.playSuccessFanfare();
      }
      setDeferredPrompt(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cài Đặt Web App Lên Điện Thoại"
      icon={<Smartphone className="w-5 h-5 text-amber-700" />}
      maxWidth="md"
    >
      <div className="space-y-4 text-amber-950 select-none">
        {/* Banner giới thiệu */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-4 rounded-2xl text-amber-950 shadow-sm flex items-center gap-3.5">
          <div className="w-14 h-14 bg-white/90 rounded-2xl flex items-center justify-center text-3xl shadow-md flex-shrink-0">
            🧋
          </div>
          <div>
            <h3 className="font-black text-sm md:text-base leading-tight">
              Chơi Tiệm Nhỏ Như App Native!
            </h3>
            <p className="text-xs text-amber-900 font-bold mt-1">
              Trải nghiệm toàn màn hình cực mượt, không vướng thanh địa chỉ, mở 1 chạm từ màn hình chính.
            </p>
          </div>
        </div>

        {/* Lợi ích nổi bật */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span className="font-bold text-amber-900">Mở tức thì, siêu nhẹ</span>
          </div>
          <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-bold text-amber-900">100% Offline, không tốn 4G</span>
          </div>
        </div>

        {/* Trạng thái đã cài */}
        {isInstalled ? (
          <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-2xl flex items-center gap-2 text-emerald-900 text-xs font-bold">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>Bạn đã cài đặt Tiệm Nhỏ trên thiết bị này rồi! Chúc bạn chơi vui vẻ! ⭐</span>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Nút bấm cài đặt tự động nếu trình duyệt hỗ trợ */}
            {deferredPrompt && (
              <GameButton
                variant="primary"
                size="md"
                onClick={handleInstallClick}
                icon={<Download className="w-4 h-4" />}
                className="w-full text-sm font-black shadow-md py-3"
              >
                Cài Đặt Ứng Dụng Ngay (1 Chạm)
              </GameButton>
            )}

            {/* Hướng dẫn cài đặt thủ công theo từng hệ điều hành */}
            <div className="p-3.5 bg-white rounded-2xl border-2 border-amber-200 space-y-2.5">
              <h4 className="text-xs font-black text-amber-900 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Hướng Dẫn Cài Nhanh Vào Màn Hình Chính:
              </h4>

              {platform === 'ios' ? (
                <div className="space-y-2 text-xs text-amber-900 font-medium">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-black text-[11px] flex items-center justify-center flex-shrink-0">
                      1
                    </span>
                    <span>
                      Mở trang web bằng <strong>trình duyệt Safari</strong> trên iPhone/iPad.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-black text-[11px] flex items-center justify-center flex-shrink-0">
                      2
                    </span>
                    <span className="flex items-center gap-1">
                      Nhấn vào biểu tượng <strong>Chia sẻ (Share)</strong> <Share className="w-3.5 h-3.5 text-sky-600 inline" /> ở dưới cùng thanh công cụ.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-black text-[11px] flex items-center justify-center flex-shrink-0">
                      3
                    </span>
                    <span className="flex items-center gap-1">
                      Cuộn xuống chọn <strong>"Thêm vào MH chính"</strong> (Add to Home Screen) <PlusSquare className="w-3.5 h-3.5 text-amber-700 inline" /> rồi bấm <strong>Thêm</strong>.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-xs text-amber-900 font-medium">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-black text-[11px] flex items-center justify-center flex-shrink-0">
                      1
                    </span>
                    <span>
                      Mở bằng <strong>Chrome</strong> hoặc trình duyệt mặc định trên điện thoại.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-black text-[11px] flex items-center justify-center flex-shrink-0">
                      2
                    </span>
                    <span>
                      Nhấn vào biểu tượng <strong>menu 3 chấm (⋮)</strong> ở góc trên bên phải màn hình.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-black text-[11px] flex items-center justify-center flex-shrink-0">
                      3
                    </span>
                    <span>
                      Chọn <strong>"Cài đặt ứng dụng"</strong> (Install App) hoặc <strong>"Thêm vào Màn hình chính"</strong>.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Nút đóng */}
        <div className="text-center pt-1">
          <GameButton variant="ghost" size="sm" onClick={onClose} className="px-6">
            Đã Hiểu, Đóng Lại
          </GameButton>
        </div>
      </div>
    </Modal>
  );
};
