/**
 * Procedural Web Audio Engine for Sreekar Raju's Portfolio
 * Synthesizes photorealistic camera mechanic and ocean sounds entirely on the client side.
 */

class CinematicAudioEngine {
  private ctx: AudioContext | null = null;

  private initContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  /**
   * Generates a photorealistic dual-curtain manual SLR camera shutter click.
   */
  public playShutterClick() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // 1. First Curtain Metallic Click
      this.triggerBladeNoise(now, 1.0);

      // 2. Mirror Slap & Mechanical Spring
      this.triggerMirrorSlap(now);

      // 3. Second Curtain Closing Click (80ms later)
      this.triggerBladeNoise(now + 0.08, 0.82);

      // 4. Subtle motor whir winding (140ms later, very short)
      this.triggerMotorWhir(now + 0.15);
    } catch (e) {
      console.warn("Audio Context blocked or failed to initialize", e);
    }
  }

  /**
   * Generates a soft, satisfying mechanic/dial tick when hovering buttons.
   */
  public playLensTick() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(3200, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.015);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.02);
    } catch (e) {
      // Ignored
    }
  }

  private triggerBladeNoise(time: number, volume: number) {
    if (!this.ctx) return;

    // Create custom noise buffer for metallic texture
    const bufferSize = this.ctx.sampleRate * 0.05; // 50ms pulse
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    // Highpass filter for thin mechanical snap
    const filter = this.ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(1500, time);
    filter.Q.setValueAtTime(4, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.18 * volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.035);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(time);
    noise.stop(time + 0.05);
  }

  private triggerMirrorSlap(time: number) {
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(180, time);
    osc.frequency.exponentialRampToValueAtTime(45, time + 0.06);

    gain.gain.setValueAtTime(0.15, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.07);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + 0.08);
  }

  private triggerMotorWhir(time: number) {
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(650, time);
    osc.frequency.linearRampToValueAtTime(800, time + 0.12);

    // Filter to damp the high-end saw buzz
    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.setValueAtTime(1800, time);

    gain.gain.setValueAtTime(0.012, time);
    gain.gain.linearRampToValueAtTime(0.015, time + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.12);

    osc.connect(lowpass);
    lowpass.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + 0.13);
  }
}

export const audio = new CinematicAudioEngine();
export default audio;
