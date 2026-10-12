import React from 'react';
import { soundManager } from '@/services/audio/soundEffects';

interface GameButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const GameButton: React.FC<GameButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  onClick,
  className = '',
  disabled = false,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    soundManager.playClick();
    if (onClick) onClick(e);
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white border-b-4 border-amber-800 shadow-game active:border-b-0 active:translate-y-1',
    secondary:
      'bg-amber-100 hover:bg-amber-200 text-amber-950 border-b-4 border-amber-300 shadow-game active:border-b-0 active:translate-y-1',
    success:
      'bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white border-b-4 border-emerald-800 shadow-game active:border-b-0 active:translate-y-1',
    danger:
      'bg-gradient-to-b from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white border-b-4 border-rose-800 shadow-game active:border-b-0 active:translate-y-1',
    ghost:
      'bg-transparent hover:bg-amber-100/60 text-amber-900 border border-transparent hover:border-amber-200 active:translate-y-0.5',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-xl font-bold gap-1.5',
    md: 'px-4 py-2 text-sm md:text-base rounded-2xl font-extrabold gap-2',
    lg: 'px-6 py-3 text-base md:text-lg rounded-2xl font-black gap-2.5',
  };

  const disabledStyles = disabled
    ? 'opacity-50 grayscale cursor-not-allowed border-b-2 active:translate-y-0 shadow-none'
    : '';

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center transition-all select-none focus:outline-none ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
