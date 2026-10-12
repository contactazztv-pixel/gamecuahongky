import React, { useEffect, useState } from 'react';
import { CircleDollarSign, Heart, Sparkles } from 'lucide-react';

export interface FloatingItem {
  id: string;
  type: 'coin' | 'heart' | 'sparkle';
  text: string;
  x?: number;
  y?: number;
}

interface FloatingFeedbackProps {
  items: FloatingItem[];
  onRemoveItem: (id: string) => void;
}

export const FloatingFeedback: React.FC<FloatingFeedbackProps> = ({ items, onRemoveItem }) => {
  useEffect(() => {
    if (items.length === 0) return;
    const timers = items.map((item) => {
      return setTimeout(() => {
        onRemoveItem(item.id);
      }, 1200);
    });

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [items, onRemoveItem]);

  if (items.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden flex items-center justify-center">
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute animate-float-up flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-lg font-black text-sm select-none"
          style={{
            top: item.y ? `${item.y}px` : '45%',
            left: item.x ? `${item.x}px` : '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor:
              item.type === 'coin'
                ? '#FEF08A'
                : item.type === 'heart'
                ? '#FFE4E6'
                : '#E0F2FE',
            color:
              item.type === 'coin'
                ? '#854D0E'
                : item.type === 'heart'
                ? '#9F1239'
                : '#075985',
            border: `2px solid ${
              item.type === 'coin'
                ? '#EAB308'
                : item.type === 'heart'
                ? '#F43F5E'
                : '#0284C7'
            }`,
          }}
        >
          {item.type === 'coin' && <CircleDollarSign className="w-4 h-4 text-amber-600 fill-amber-300" />}
          {item.type === 'heart' && <Heart className="w-4 h-4 text-rose-600 fill-rose-400" />}
          {item.type === 'sparkle' && <Sparkles className="w-4 h-4 text-sky-600 fill-sky-300" />}
          <span>{item.text}</span>
        </div>
      ))}
    </div>
  );
};
