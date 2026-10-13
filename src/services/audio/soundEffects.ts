/**
 * HỆ THỐNG ÂM THANH & NHẠC NỀN TOÀN DIỆN (Web Audio API Synthesizer)
 * Tự động tạo hiệu ứng âm thanh chân thực (click, xu vàng, chuông reo, xèo xèo nấu nướng, rót nước, lắc đá, dao thớt)
 * và 3 bản nhạc nền Lo-fi học đường êm dịu không phụ thuộc file mp3 ngoài, bảo tồn quyền tác giả 100%.
 */

export type BgmTrackId = 'auto' | 'lofi_morning' | 'rush_hour' | 'sunset_chill';

export interface AudioSettings {
  isMuted: boolean;
  volume: number; // 0 to 1 (SFX)
  isBgmEnabled: boolean;
  bgmVolume: number; // 0 to 1 (BGM)
  currentTrackId: BgmTrackId;
}

const STORAGE_KEY = 'tiem_nho_audio_settings';

export const BGM_TRACKS: { id: BgmTrackId; name: string; desc: string; bpm: number }[] = [
  {
    id: 'auto',
    name: 'Tự Động Theo Giờ',
    desc: 'Tự động chuyển nhạc theo tiến trình sáng, trưa, chiều trong game',
    bpm: 85,
  },
  {
    id: 'lofi_morning',
    name: 'Sớm Mai Cổng Trường',
    desc: 'Giai điệu Lo-fi Acoustic trong trẻo, tiếng chim hót buổi sớm nhẹ nhàng',
    bpm: 76,
  },
  {
    id: 'rush_hour',
    name: 'Tan Học Rộn Rã',
    desc: 'Nhịp điệu Upbeat rộn ràng, vui tươi giờ ra chơi và tan trường náo nhiệt',
    bpm: 104,
  },
  {
    id: 'sunset_chill',
    name: 'Hoàng Hôn Yên Ả',
    desc: 'Giai điệu thư giãn sâu lắng, ấm áp hoài niệm bên vỉa hè xế chiều',
    bpm: 64,
  },
];

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.7;
  private isBgmEnabled: boolean = true;
  private bgmVolume: number = 0.35;
  private currentTrackId: BgmTrackId = 'auto';

  private bgmIntervalId: ReturnType<typeof setInterval> | null = null;
  private bgmGainNode: GainNode | null = null;
  private lastBgmStep: number = 0;

  constructor() {
    this.loadSettings();
    this.initAudioOnFirstInteraction();
  }

  /**
   * Tự động unlock AudioContext trên điện thoại di động (iOS Safari / Android Chrome)
   * ngay cú chạm / vuốt đầu tiên, loại bỏ 100% độ trễ SFX và lỗi chặn âm thanh autoplay
   */
  public initAudioOnFirstInteraction(): void {
    if (typeof window === 'undefined') return;
    const unlock = () => {
      const ctx = this.getContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('touchstart', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
  }

  private loadSettings(): void {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<AudioSettings>;
        if (typeof parsed.isMuted === 'boolean') this.isMuted = parsed.isMuted;
        if (typeof parsed.volume === 'number') this.volume = parsed.volume;
        if (typeof parsed.isBgmEnabled === 'boolean') this.isBgmEnabled = parsed.isBgmEnabled;
        if (typeof parsed.bgmVolume === 'number') this.bgmVolume = parsed.bgmVolume;
        if (parsed.currentTrackId) this.currentTrackId = parsed.currentTrackId;
      }
    } catch {
      // Fallback defaults
    }
  }

  private saveSettings(): void {
    if (typeof window === 'undefined') return;
    try {
      const data: AudioSettings = {
        isMuted: this.isMuted,
        volume: this.volume,
        isBgmEnabled: this.isBgmEnabled,
        bgmVolume: this.bgmVolume,
        currentTrackId: this.currentTrackId,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignore
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public getSettings(): AudioSettings {
    return {
      isMuted: this.isMuted,
      volume: this.volume,
      isBgmEnabled: this.isBgmEnabled,
      bgmVolume: this.bgmVolume,
      currentTrackId: this.currentTrackId,
    };
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    this.saveSettings();
    if (muted) {
      this.stopBgm();
    } else if (this.isBgmEnabled) {
      this.startBgm();
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    this.saveSettings();
  }

  public setBgmVolume(vol: number): void {
    this.bgmVolume = Math.max(0, Math.min(1, vol));
    this.saveSettings();
    if (this.bgmGainNode && this.ctx) {
      this.bgmGainNode.gain.setValueAtTime(this.bgmVolume * 0.15, this.ctx.currentTime);
    }
  }

  public setTrack(trackId: BgmTrackId): void {
    this.currentTrackId = trackId;
    this.saveSettings();
    if (this.isBgmEnabled && !this.isMuted) {
      this.startBgm();
    }
  }

  public toggleBgm(): boolean {
    this.isBgmEnabled = !this.isBgmEnabled;
    this.saveSettings();
    if (this.isBgmEnabled && !this.isMuted) {
      this.startBgm();
    } else {
      this.stopBgm();
    }
    return this.isBgmEnabled;
  }

  /**
   * Khởi động nhạc nền BGM Synthesizer đa bản nhạc
   */
  public startBgm(effectivePeriod?: string): void {
    if (this.isMuted) return;
    this.stopBgm();

    const ctx = this.getContext();
    if (!ctx) return;

    this.isBgmEnabled = true;
    this.saveSettings();

    // Xác định track thực tế phát dựa theo chế độ
    let activeTrack = this.currentTrackId;
    if (activeTrack === 'auto') {
      if (effectivePeriod === 'recess_rush' || effectivePeriod === 'school_rush' || effectivePeriod === 'dismissal_rush') {
        activeTrack = 'rush_hour';
      } else if (effectivePeriod === 'afternoon_bell' || effectivePeriod === 'evening_chill' || effectivePeriod === 'day_end') {
        activeTrack = 'sunset_chill';
      } else {
        activeTrack = 'lofi_morning';
      }
    }

    // Các chuỗi hợp âm pentatonic ấm áp tùy theo bài nhạc
    let chordProgression: number[][];
    let intervalMs: number;
    let baseGainFactor: number;

    switch (activeTrack) {
      case 'rush_hour':
        // Giai điệu vui tươi, nhịp nhanh hơn
        chordProgression = [
          [392.00, 493.88, 587.33], // G4, B4, D5
          [440.00, 523.25, 659.25], // A4, C5, E5
          [493.88, 587.33, 739.99], // B4, D5, F#5
          [523.25, 659.25, 783.99], // C5, E5, G5
        ];
        intervalMs = 1800;
        baseGainFactor = 0.07;
        break;

      case 'sunset_chill':
        // Giai điệu hoàng hôn sâu lắng, chậm rãi
        chordProgression = [
          [261.63, 329.63, 392.00], // C4, E4, G4
          [220.00, 261.63, 329.63], // A3, C4, E4
          [174.61, 220.00, 261.63], // F3, A3, C4
          [196.00, 246.94, 293.66], // G3, B3, D4
        ];
        intervalMs = 2800;
        baseGainFactor = 0.08;
        break;

      case 'lofi_morning':
      default:
        // Sớm mai tươi vui thanh khiết
        chordProgression = [
          [261.63, 329.63], // C4, E4
          [293.66, 349.23], // D4, F4
          [329.63, 392.00], // E4, G4
          [392.00, 440.00], // G4, A4
          [440.00, 523.25], // A4, C5
          [329.63, 392.00], // E4, G4
        ];
        intervalMs = 2200;
        baseGainFactor = 0.08;
        break;
    }

    let step = 0;

    const playBgmStep = () => {
      if (!this.isBgmEnabled || this.isMuted) return;
      try {
        const chord = chordProgression[step % chordProgression.length];
        step++;

        chord.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(activeTrack === 'rush_hour' ? 1200 : 850, ctx.currentTime);

          osc.type = i === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          const gainVal = this.bgmVolume * baseGainFactor;
          gain.gain.setValueAtTime(0.001, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(gainVal, ctx.currentTime + 0.25);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (intervalMs / 1000) * 0.95);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start();
          osc.stop(ctx.currentTime + intervalMs / 1000);
        });
      } catch {
        // Non-blocking
      }
    };

    playBgmStep();
    this.bgmIntervalId = setInterval(playBgmStep, intervalMs);
  }

  public stopBgm(): void {
    if (this.bgmIntervalId) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
  }

  // ==================== CÁC HIỆU ỨNG ÂM THANH (SFX) ====================

  /** Âm thanh bấm nút (Bop gỗ nhẹ) */
  public playClick(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(this.volume * 0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {}
  }

  /** Âm thanh thu tiền xu leng keng (Coin Chime) */
  public playCoin(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [987.77, 1318.51].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(this.volume * 0.45, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.25);
      });
    } catch {}
  }

  /** Âm thanh chuông khách đến (Ding Dong cửa quán) */
  public playCustomerBell(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880.00, now + 0.12); // A5
      gain.gain.setValueAtTime(this.volume * 0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch {}
  }

  /** Tiếng xèo xèo rán nướng bếp lửa (Cooking Sizzle) */
  public playCookingSizzle(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const bufferSize = ctx.sampleRate * 0.6;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1600, ctx.currentTime);
      filter.Q.setValueAtTime(3, ctx.currentTime);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(this.volume * 0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch {}
  }

  /** Tiếng rót nước róc rách hoặc đổ sữa (Pour Liquid) */
  public playPourLiquid(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.35);
      gain.gain.setValueAtTime(this.volume * 0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch {}
  }

  /** Tiếng lắc bình shaker hoặc trân châu lăn (Shaker / Boba rattle) */
  public playShaker(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [300, 450, 380, 520].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);
        gain.gain.setValueAtTime(this.volume * 0.2, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.1);
      });
    } catch {}
  }

  /** Tiếng dao thớt lách cách cắt chả, cắt xúc xích (Chop Knife) */
  public playChop(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [220, 280].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + i * 0.09);
        gain.gain.setValueAtTime(this.volume * 0.25, now + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.07);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 0.07);
      });
    } catch {}
  }

  /** Tiếng trống trường tùng... tùng... tùng... (School Bell) */
  public playSchoolBell(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [120, 115, 110].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.4);
        gain.gain.setValueAtTime(this.volume * 0.5, now + idx * 0.4);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.4 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.4);
        osc.stop(now + idx * 0.4 + 0.35);
      });
    } catch {}
  }

  /** Âm thanh làm xong món ăn (Ding!) */
  public playCookComplete(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(this.volume * 0.4, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.2);
      });
    } catch {}
  }

  /** Âm thanh nhận thưởng / Hoàn thành nhiệm vụ (Fanfare) */
  public playSuccessFanfare(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);
        gain.gain.setValueAtTime(this.volume * 0.45, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.35);
      });
    } catch {}
  }

  /** Âm thanh tim đập / Tăng cấp thân thiết */
  public playHeartBeat(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [440, 659.25].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        gain.gain.setValueAtTime(this.volume * 0.35, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.2);
      });
    } catch {}
  }

  /** Âm thanh từ chối / Hết nguyên liệu / Lỗi */
  public playWarningBuzz(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      gain.gain.setValueAtTime(this.volume * 0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {}
  }
}

export const soundManager = new SoundManager();
