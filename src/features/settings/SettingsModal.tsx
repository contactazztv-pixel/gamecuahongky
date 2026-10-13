import React, { useRef, useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { GameButton } from '@/components/ui/GameButton';
import { useSettingsStore } from '@/stores/settingsStore';
import { useGameStore } from '@/stores/gameStore';
import { GAME_CONFIG } from '@/game/config/gameMeta';
import { triggerSaveFileDownload } from '@/services/persistence/saveService';
import {
  Settings,
  Volume2,
  VolumeX,
  Music,
  Download,
  Upload,
  Trash2,
  Eye,
  Info,
  Check,
  AlertCircle,
  MessageSquareHeart,
  Smartphone,
  Star,
  User,
} from 'lucide-react';
import { PlayerFeedbackModal } from '@/components/game/PlayerFeedbackModal';
import { PwaInstallModal } from '@/components/game/PwaInstallModal';
import { CustomerReviewsModal } from '@/components/game/CustomerReviewsModal';
import { soundManager, BGM_TRACKS, BgmTrackId } from '@/services/audio/soundEffects';
import { SHOPKEEPER_SKINS, ShopkeeperSkin, ShopkeeperSprite } from '@/components/game/ShopkeeperSprite';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    soundEnabled,
    sfxVolume,
    reducedMotion,
    shopkeeperSkin,
    setSoundEnabled,
    setSfxVolume,
    setReducedMotion,
    setShopkeeperSkin,
  } = useSettingsStore();

  const {
    exportGameData,
    importGameData,
    deleteCurrentSave,
    setScreen,
  } = useGameStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isPwaInstallOpen, setIsPwaInstallOpen] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  const showFeedback = (text: string, isError = false) => {
    setFeedbackMessage({ text, isError });
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const [currentTrackId, setCurrentTrackId] = useState<BgmTrackId>(
    soundManager.getSettings().currentTrackId
  );

  const handleSelectTrack = (trackId: BgmTrackId) => {
    soundManager.setTrack(trackId);
    setCurrentTrackId(trackId);
    soundManager.playClick();
  };

  const handleSelectSkin = (skin: ShopkeeperSkin) => {
    setShopkeeperSkin(skin);
    soundManager.playClick();
    showFeedback('Đã đổi ngoại hình người bán hàng!');
  };

  const handleExport = () => {
    try {
      const saveData = exportGameData();
      triggerSaveFileDownload(saveData);
      showFeedback('Đã tải xuống file sao lưu JSON thành công!');
    } catch {
      showFeedback('Lỗi khi xuất file sao lưu.', true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = importGameData(content);
        if (result.success) {
          showFeedback('Đã khôi phục tiến trình từ file JSON!');
          setTimeout(() => onClose(), 1200);
        } else {
          showFeedback(result.error || 'Dữ liệu file không hợp lệ.', true);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDeleteConfirm = async () => {
    await deleteCurrentSave();
    setIsConfirmDeleteOpen(false);
    onClose();
    setScreen('main_menu');
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Cài Đặt & Dữ Liệu"
        subtitle={`Quản lý âm thanh, giao diện và dữ liệu game (${GAME_CONFIG.title})`}
        icon={<Settings className="w-5 h-5 text-amber-700" />}
        maxWidth="md"
      >
        <div className="space-y-4">
          {/* Thông báo thao tác */}
          {feedbackMessage && (
            <div
              className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in ${
                feedbackMessage.isError
                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}
            >
              {feedbackMessage.isError ? (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              ) : (
                <Check className="w-4 h-4 flex-shrink-0" />
              )}
              <span>{feedbackMessage.text}</span>
            </div>
          )}

          {/* ÂM THANH */}
          <div className="bg-white/90 border border-amber-200 rounded-2xl p-3.5 space-y-3">
            <h4 className="font-extrabold text-sm text-amber-950 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-amber-700" /> Âm Thanh Trò Chơi
            </h4>

            {/* Hiệu ứng âm thanh (SFX) */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-amber-900 block">Hiệu ứng âm thanh (SFX):</span>
                <span className="text-[10px] text-amber-700/80">Tiếng click, leng keng tiền xu, nấu ăn</span>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  soundEnabled
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-slate-200 text-slate-500'
                }`}
                title={soundEnabled ? 'Tắt âm hiệu ứng' : 'Bật âm hiệu ứng'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>

            {soundEnabled && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-amber-800">
                  <span>Âm lượng hiệu ứng:</span>
                  <span className="font-bold">{Math.round(sfxVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={sfxVolume}
                  onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>
            )}

            {/* Nhạc nền Lo-fi BGM */}
            <div className="pt-2 border-t border-amber-100 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-amber-900 block">Nhạc nền Lo-fi Thư Giãn:</span>
                  <span className="text-[10px] text-amber-700/80">Giai điệu Pentatonic cổng trường nhẹ nhàng</span>
                </div>
                <button
                  onClick={() => {
                    soundManager.toggleBgm();
                    // Force update UI
                    setSoundEnabled(soundEnabled);
                  }}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    soundManager.getSettings().isBgmEnabled
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                  title="Bật/Tắt nhạc nền Lo-fi"
                >
                  <Music className="w-4 h-4" />
                </button>
              </div>

              {soundManager.getSettings().isBgmEnabled && (
                <>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-amber-800">
                      <span>Âm lượng nhạc nền:</span>
                      <span className="font-bold">
                        {Math.round(soundManager.getSettings().bgmVolume * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={soundManager.getSettings().bgmVolume}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        soundManager.setBgmVolume(v);
                        setSoundEnabled(soundEnabled);
                      }}
                      className="w-full accent-amber-600 cursor-pointer"
                    />
                  </div>

                  {/* Chọn bản nhạc nền đang phát */}
                  <div className="pt-1.5 space-y-1.5">
                    <span className="text-[11px] font-bold text-amber-800 block">
                      Bản nhạc nền đang phát:
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {BGM_TRACKS.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => handleSelectTrack(t.id)}
                          className={`p-2 rounded-xl text-left border text-xs transition-all flex flex-col justify-between ${
                            currentTrackId === t.id
                              ? 'bg-amber-600 text-white border-amber-700 shadow-sm ring-2 ring-amber-300'
                              : 'bg-white hover:bg-amber-50 text-amber-950 border-amber-200'
                          }`}
                        >
                          <span className="font-black truncate">{t.name}</span>
                          <span
                            className={`text-[10px] line-clamp-1 mt-0.5 ${
                              currentTrackId === t.id ? 'text-amber-100' : 'text-amber-700/80'
                            }`}
                          >
                            {t.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* NHÂN VẬT NGƯỜI BÁN HÀNG */}
          <div className="bg-white/90 border border-amber-200 rounded-2xl p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-sm text-amber-950 flex items-center gap-1.5">
                <User className="w-4 h-4 text-amber-700" /> Nhân Vật Người Bán Hàng
              </h4>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                3 Ngoại Hình
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SHOPKEEPER_SKINS.map((s) => {
                const isSelected = shopkeeperSkin === s.id;
                return (
                  <div
                    key={s.id}
                    onClick={() => handleSelectSkin(s.id)}
                    className={`cursor-pointer rounded-2xl border-2 p-2.5 flex flex-col items-center text-center transition-all ${
                      isSelected
                        ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-300 shadow-md scale-[1.02]'
                        : 'bg-white border-amber-200 hover:border-amber-400 hover:bg-amber-50/50'
                    }`}
                  >
                    {/* Avatar thu nhỏ của nhân vật */}
                    <div className="w-16 h-16 rounded-2xl bg-[#F7F2E7] border border-[#EBE4D5] flex items-center justify-center overflow-hidden mb-1.5 shadow-inner">
                      <div className="scale-75 transform">
                        <ShopkeeperSprite skin={s.id} action={isSelected ? 'happy' : 'idle'} />
                      </div>
                    </div>

                    <span className="font-black text-xs text-amber-950 leading-tight">
                      {s.name}
                    </span>
                    <span className="text-[10px] font-semibold text-amber-700/80 mt-0.5">
                      {s.role}
                    </span>
                    <span className="text-[9px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-md mt-1">
                      {s.badge}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* KHẢ NĂNG TRUY CẬP */}
          <div className="bg-white/90 border border-amber-200 rounded-2xl p-3.5 space-y-2.5">
            <h4 className="font-extrabold text-sm text-amber-950 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-amber-700" /> Trợ Năng & Hiển Thị
            </h4>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-amber-900 block">
                  Giảm chuyển động (Reduced Motion):
                </span>
                <span className="text-[11px] text-amber-700/80">
                  Tắt bớt các hiệu ứng bay nhảy nếu cảm thấy mỏi mắt
                </span>
              </div>
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                className="w-5 h-5 rounded text-amber-600 accent-amber-600 cursor-pointer"
              />
            </div>
          </div>

          {/* QUẢN LÝ DỮ LIỆU LƯU TRỮ */}
          <div className="bg-white/90 border border-amber-200 rounded-2xl p-3.5 space-y-2.5">
            <h4 className="font-extrabold text-sm text-amber-950 flex items-center gap-1.5">
              <Download className="w-4 h-4 text-amber-700" /> Sao Lưu & Dữ Liệu
            </h4>

            <p className="text-[11px] text-amber-800/80 leading-relaxed">
              Dữ liệu game được lưu tự động trên IndexedDB trình duyệt của bạn. Bạn có thể xuất file
              JSON để chuyển sang thiết bị khác hoặc lưu trữ an toàn.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <GameButton
                variant="secondary"
                size="sm"
                icon={<Download className="w-3.5 h-3.5" />}
                onClick={handleExport}
                className="flex-1 text-xs"
              >
                Xuất File JSON
              </GameButton>

              <GameButton
                variant="secondary"
                size="sm"
                icon={<Upload className="w-3.5 h-3.5" />}
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 text-xs"
              >
                Nhập File JSON
              </GameButton>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="pt-2 border-t border-amber-100 flex justify-end">
              <button
                onClick={() => setIsConfirmDeleteOpen(true)}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 hover:underline"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Xóa dữ liệu game trên máy này
              </button>
            </div>
          </div>

          {/* CỘNG ĐỒNG, ĐÁNH GIÁ & ỨNG DỤNG DI ĐỘNG */}
          <div className="bg-white/90 border border-amber-200 rounded-2xl p-3.5 space-y-2.5">
            <h4 className="font-extrabold text-sm text-amber-950 flex items-center gap-1.5">
              <MessageSquareHeart className="w-4 h-4 text-amber-700" /> Tương Tác & Cài Đặt Di Động
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setIsFeedbackOpen(true)}
                className="p-2.5 rounded-xl border border-amber-300 bg-amber-50/70 hover:bg-amber-100 text-amber-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <MessageSquareHeart className="w-4 h-4 text-amber-700" />
                <span>Góp Ý & Báo Lỗi</span>
              </button>

              <button
                type="button"
                onClick={() => setIsReviewsOpen(true)}
                className="p-2.5 rounded-xl border border-amber-300 bg-amber-50/70 hover:bg-amber-100 text-amber-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>Đánh Giá Khách Hàng</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPwaInstallOpen(true)}
                className="p-2.5 rounded-xl border border-emerald-300 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <Smartphone className="w-4 h-4 text-emerald-700" />
                <span>Cài App Điện Thoại</span>
              </button>
            </div>
          </div>

          {/* THÔNG TIN PHIÊN BẢN */}
          <div className="text-center text-[11px] text-amber-800/70 space-y-0.5 pt-1">
            <p className="font-black text-amber-900 flex items-center justify-center gap-1">
              <Info className="w-3 h-3" />
              {GAME_CONFIG.title} v{GAME_CONFIG.version}
            </p>
            <p>Phát triển bởi {GAME_CONFIG.developer} • {GAME_CONFIG.releaseYear}</p>
          </div>
        </div>
      </Modal>

      {/* Hộp thoại xác nhận xóa tiến trình */}
      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        title="Xác Nhận Xóa Dữ Liệu Game"
        message="Toàn bộ tiến trình cửa hàng, tiền mặt và thành tích đã lưu sẽ bị xóa vĩnh viễn trên thiết bị này. Bạn có chắc chắn muốn xóa không?"
        confirmLabel="Xóa Vĩnh Viễn"
        cancelLabel="Hủy"
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsConfirmDeleteOpen(false)}
      />

      {/* Modal Hòm Thư Góp Ý */}
      <PlayerFeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      {/* Modal Sổ Đánh Giá Khách Hàng */}
      <CustomerReviewsModal
        isOpen={isReviewsOpen}
        onClose={() => setIsReviewsOpen(false)}
      />

      {/* Modal Cài Đặt App Điện Thoại */}
      <PwaInstallModal
        isOpen={isPwaInstallOpen}
        onClose={() => setIsPwaInstallOpen(false)}
      />
    </>
  );
};
