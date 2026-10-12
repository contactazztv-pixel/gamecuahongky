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
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-amber-950/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`relative w-full ${maxWidthClass} max-h-[92vh] flex flex-col bg-amber-50 rounded-3xl border-4 border-amber-900/30 shadow-2xl overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-amber-200/70 border-b-2 border-amber-900/15">
          <div className="flex items-center gap-2.5">
            {icon && <div className="p-2 bg-white/80 rounded-xl shadow-sm text-amber-800">{icon}</div>}
            <div>
              <h3 className="text-lg md:text-xl font-black text-amber-950 leading-tight">{title}</h3>
              {subtitle && <p className="text-xs text-amber-800/80 font-medium mt-0.5">{subtitle}</p>}
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-white/70 hover:bg-rose-100 text-amber-900 hover:text-rose-700 transition-colors shadow-sm"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 text-amber-950">{children}</div>
      </div>
    </div>
  );
};
