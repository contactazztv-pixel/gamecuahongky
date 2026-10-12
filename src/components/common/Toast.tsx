import React from 'react';
import { CheckCircle2, AlertCircle, XCircle, Info } from 'lucide-react';

interface ToastProps {
  isVisible: boolean;
  message: string;
  type?: 'success' | 'warning' | 'info' | 'error';
}

export const Toast: React.FC<ToastProps> = ({ isVisible, message, type = 'success' }) => {
  if (!isVisible) return null;

  const bgStyles = {
    success: 'bg-emerald-900/90 text-white border-emerald-500 shadow-emerald-950/20',
    warning: 'bg-amber-900/90 text-white border-amber-500 shadow-amber-950/20',
    info: 'bg-sky-900/90 text-white border-sky-500 shadow-sky-950/20',
    error: 'bg-rose-900/90 text-white border-rose-500 shadow-rose-950/20',
  }[type];

  return (
    <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-3 duration-200 pointer-events-none">
      <div
        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border-2 shadow-xl backdrop-blur-md text-sm font-bold ${bgStyles}`}
      >
        {type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />}
        {type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-300 flex-shrink-0" />}
        {type === 'info' && <Info className="w-4 h-4 text-sky-300 flex-shrink-0" />}
        {type === 'error' && <XCircle className="w-4 h-4 text-rose-300 flex-shrink-0" />}
        <span>{message}</span>
      </div>
    </div>
  );
};
