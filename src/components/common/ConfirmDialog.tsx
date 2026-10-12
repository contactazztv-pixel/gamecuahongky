import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { GameButton } from '../ui/GameButton';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Hủy bỏ',
  isDestructive = true,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      icon={<AlertTriangle className="w-5 h-5 text-rose-600" />}
      maxWidth="sm"
    >
      <div className="space-y-4">
        <p className="text-sm md:text-base text-amber-900/90 leading-relaxed font-medium">
          {message}
        </p>
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-amber-900/10">
          <GameButton variant="secondary" size="sm" onClick={onCancel}>
            {cancelLabel}
          </GameButton>
          <GameButton
            variant={isDestructive ? 'danger' : 'primary'}
            size="sm"
            onClick={onConfirm}
          >
            {confirmLabel}
          </GameButton>
        </div>
      </div>
    </Modal>
  );
};
