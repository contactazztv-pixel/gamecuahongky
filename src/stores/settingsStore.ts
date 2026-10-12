import { create } from 'zustand';
import { GameSettings } from '@/game/types';
import { soundManager } from '@/services/audio/soundEffects';

interface SettingsStore extends GameSettings {
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

export const useSettingsStore = create<SettingsStore>((set) => ({
  soundEnabled: true,
  sfxVolume: 0.7,
  bgmVolume: 0.5,
  reducedMotion: checkSystemReducedMotion(),
  autoSave: true,
  highContrast: false,

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
