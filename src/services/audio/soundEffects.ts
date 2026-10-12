/**
 * HỆ THỐNG ÂM THANH TỔNG HỢP (Web Audio API Synthesizer)
 * Tự động tạo hiệu ứng âm thanh sống động (click, xu vàng, chuông reo, xèo xèo nấu nướng)
 * và nhạc nền Lo-fi thư giãn không phụ thuộc file mp3 ngoài, bảo tồn quyền tác giả 100%.
 */

interface AudioSettings {
  isMuted: boolean;
  volume: number; // 0 to 1
  isBgmEnabled: boolean;
  bgmVolume: number; // 0 to 1
}

const STORAGE_KEY = 'tiem_nho_audio_settings';

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.6;
  private isBgmEnabled: boolean = false;
  private bgmVolume: number = 0.25;

  private bgmIntervalId: ReturnType<typeof setInterval> | null = null;
  private bgmGainNode: GainNode | null = null;

  constructor() {
    this.loadSettings();
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
   * BGM Synthesizer: Phát giai điệu Lo-fi Pentatonic học đường êm dịu
   */
  public startBgm(): void {
    if (this.isMuted) return;
    this.stopBgm();

    const ctx = this.getContext();
    if (!ctx) return;

    this.isBgmEnabled = true;
    this.saveSettings();

    // Chuỗi nốt pentatonic ấm áp (C, D, E, G, A): F4, G4, A4, C5, D5, E5
    const pentatonicNotes = [
      [261.63, 329.63], // C4, E4
      [293.66, 349.23], // D4, F4
      [329.63, 392.00], // E4, G4
      [392.00, 440.00], // G4, A4
      [440.00, 523.25], // A4, C5
      [329.63, 392.00], // E4, G4
    ];

    let step = 0;

    const playBgmStep = () => {
      if (!this.isBgmEnabled || this.isMuted) return;
      try {
        const chord = pentatonicNotes[step % pentatonicNotes.length];
        step++;

        chord.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          // Low-pass filter tạo chất âm ấm cúng lofi vinyl
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(800, ctx.currentTime);

          osc.type = i === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          const gainVal = this.bgmVolume * 0.08;
          gain.gain.setValueAtTime(0.001, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(gainVal, ctx.currentTime + 0.3);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.2);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start();
          osc.stop(ctx.currentTime + 2.3);
        });
      } catch {
        // Non-blocking
      }
    };

    // Chơi ngay nốt đầu tiên rồi lặp mỗi 2.4 giây
    playBgmStep();
    this.bgmIntervalId = setInterval(playBgmStep, 2400);
  }

  public stopBgm(): void {
    if (this.bgmIntervalId) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
  }

  /**
   * Âm thanh bấm nút (Gõ gỗ nhẹ / Bop)
   */
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

      gain.gain.setValueAtTime(this.volume * 0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio playback non-blocking
    }
  }

  /**
   * Âm thanh thu tiền xu leng keng (Coin Chime)
   */
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

        gain.gain.setValueAtTime(this.volume * 0.5, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.25);
      });
    } catch {
      // Ignore
    }
  }

  /**
   * Âm thanh chuông khách đến (Ding Dong học đường)
   */
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
    } catch {
      // Ignore
    }
  }

  /**
   * Tiếng xèo xèo rán nướng bếp lửa (Cooking Sizzle)
   */
  public playCookingSizzle(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      // Tạo noise buffer mô phỏng mỡ sôi xèo xèo
      const bufferSize = ctx.sampleRate * 0.6; // 0.6 giây
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
    } catch {
      // Non-blocking
    }
  }

  /**
   * Âm thanh làm xong món ăn (Xèo xèo & Ding!)
   */
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
    } catch {
      // Ignore
    }
  }

  /**
   * Âm thanh quà tặng / Nhận thưởng nhiệm vụ
   */
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
    } catch {
      // Ignore
    }
  }

  /**
   * Âm thanh tim đập / Tăng cấp thân thiết (Friendship heart)
   */
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
    } catch {
      // Ignore
    }
  }

  /**
   * Âm thanh từ chối / Hết nguyên liệu / Lỗi
   */
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
    } catch {
      // Ignore
    }
  }
}

export const soundManager = new SoundManager();
