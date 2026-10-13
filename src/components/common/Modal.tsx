import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { soundManager } from '@/services/audio/soundEffects';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  maxWidth = 'lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
  }[maxWidth];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-amber-950/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${maxWidthClass} max-h-[calc(100dvh-20px)] sm:max-h-[90vh] flex flex-col bg-amber-50 rounded-3xl border-3 sm:border-4 border-amber-900/30 shadow-2xl overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3.5 sm:px-5 py-3 sm:py-3.5 bg-amber-200/70 border-b-2 border-amber-900/15">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 pr-2">
            {icon && (
              <div className="p-1.5 sm:p-2 bg-white/80 rounded-xl shadow-xs text-amber-800 flex-shrink-0">
                {icon}
              </div>
            )}
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg md:text-xl font-black text-amber-950 leading-tight truncate">
                {title}
              </h3>
              {subtitle && (
                <p className="text-[11px] sm:text-xs text-amber-800/80 font-medium mt-0.5 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-xl bg-white/80 hover:bg-rose-100 text-amber-900 hover:text-rose-700 transition-colors shadow-xs flex items-center justify-center flex-shrink-0 active:scale-95"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 md:p-6 text-amber-950 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {children}
        </div>
      </div>
    </div>
  );
};
