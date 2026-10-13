import { create } from 'zustand';
import { GameSettings } from '@/game/types';
import { soundManager } from '@/services/audio/soundEffects';

import { ShopkeeperSkin } from '@/components/game/ShopkeeperSprite';

interface SettingsStore extends GameSettings {
  shopkeeperSkin: ShopkeeperSkin;
  setShopkeeperSkin: (skin: ShopkeeperSkin) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setSfxVolume: (vol: number) => void;
  setBgmVolume: (vol: number) => void;
  setReducedMotion: (enabled: boolean) => void;
  setAutoSave: (enabled: boolean) => void;
  setHighContrast: (enabled: boolean) => void;
}

const checkSystemReducedMotion = (): boolean => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
};

const getInitialSkin = (): ShopkeeperSkin => {
  if (typeof window === 'undefined') return 'bao_an';
  try {
    const saved = localStorage.getItem('tiem_nho_shopkeeper_skin');
    if (saved === 'bao_an' || saved === 'quang_minh' || saved === 'minh_thu') {
      return saved;
    }
  } catch {}
  return 'bao_an';
};

export const useSettingsStore = create<SettingsStore>((set) => ({
  shopkeeperSkin: getInitialSkin(),
  soundEnabled: true,
  sfxVolume: 0.7,
  bgmVolume: 0.5,
  reducedMotion: checkSystemReducedMotion(),
  autoSave: true,
  highContrast: false,

  setShopkeeperSkin: (skin) => {
    try {
      localStorage.setItem('tiem_nho_shopkeeper_skin', skin);
    } catch {}
    set({ shopkeeperSkin: skin });
  },

  setSoundEnabled: (enabled) => {
    soundManager.setMuted(!enabled);
    set({ soundEnabled: enabled });
  },

  setSfxVolume: (vol) => {
    soundManager.setVolume(vol);
    set({ sfxVolume: vol });
  },

  setBgmVolume: (vol) => {
    soundManager.setBgmVolume(vol);
    set({ bgmVolume: vol });
  },

  setReducedMotion: (enabled) => {
    set({ reducedMotion: enabled });
  },

  setAutoSave: (enabled) => {
    set({ autoSave: enabled });
  },

  setHighContrast: (enabled) => {
    set({ highContrast: enabled });
  },
}));
