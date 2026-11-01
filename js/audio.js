// Web Audio API Sound Synthesizer for World Conqueror 3 Game
// Synthesizes authentic WW2 military sounds: cannon blasts, gunfire, air sirens, marching, fanfare

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.volume = 0.5;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    // Tank Cannon Fire
    playCannon() {
        if (!this.enabled) return;
        this.init();
        const t = this.ctx.currentTime;

        // Low punch oscillator
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, t);
        osc.frequency.exponentialRampToValueAtTime(25, t + 0.4);

        gain.gain.setValueAtTime(0.8 * this.volume, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.5);

        // Explosion noise buffer
        const bufferSize = this.ctx.sampleRate * 0.6;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.15));
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, t);
        filter.frequency.exponentialRampToValueAtTime(120, t + 0.5);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.9 * this.volume, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.6);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);
        noise.start(t);
    }

    // Machine Gun / Rifle Fire Burst
    playGunfire(burstCount = 3) {
        if (!this.enabled) return;
        this.init();

        for (let b = 0; b < burstCount; b++) {
            const t = this.ctx.currentTime + b * 0.08;

            const bufferSize = Math.floor(this.ctx.sampleRate * 0.05);
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.015));
            }

            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(1500, t);
            filter.Q.setValueAtTime(2, t);

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.4 * this.volume, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.06);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);
            noise.start(t);
        }
    }

    // Air Raid Siren / Airplane engine pass
    playAirStrike() {
        if (!this.enabled) return;
        this.init();
        const t = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, t);
        osc.frequency.linearRampToValueAtTime(440, t + 0.4);
        osc.frequency.linearRampToValueAtTime(180, t + 0.9);

        gain.gain.setValueAtTime(0.01, t);
        gain.gain.linearRampToValueAtTime(0.35 * this.volume, t + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 1.0);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, t);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 1.0);

        // Followed by bomb impact
        setTimeout(() => this.playCannon(), 400);
    }

    // Click / Tactical select sound
    playSelect() {
        if (!this.enabled) return;
        this.init();
        const t = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(650, t);
        osc.frequency.exponentialRampToValueAtTime(400, t + 0.05);

        gain.gain.setValueAtTime(0.2 * this.volume, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.05);
    }

    // Territory Captured Fanfare
    playCapture() {
        if (!this.enabled) return;
        this.init();
        const notes = [392, 523.25, 659.25, 783.99]; // G4, C5, E5, G5
        notes.forEach((freq, idx) => {
            const t = this.ctx.currentTime + idx * 0.1;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t);

            gain.gain.setValueAtTime(0.3 * this.volume, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.25);
        });
    }

    // End Turn / March Cadence
    playEndTurn() {
        if (!this.enabled) return;
        this.init();
        const t = this.ctx.currentTime;

        // Low dramatic brass horn
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(110, t);
        osc.frequency.linearRampToValueAtTime(146.83, t + 0.2);

        gain.gain.setValueAtTime(0.3 * this.volume, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.45);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, t);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.45);
    }

    // Victory Fanfare
    playVictory() {
        if (!this.enabled) return;
        this.init();
        const fanfare = [
            { f: 523.25, d: 0.15 }, // C5
            { f: 523.25, d: 0.15 }, // C5
            { f: 523.25, d: 0.15 }, // C5
            { f: 659.25, d: 0.4 },  // E5
            { f: 587.33, d: 0.2 },  // D5
            { f: 659.25, d: 0.2 },  // E5
            { f: 783.99, d: 0.6 }   // G5
        ];

        let offset = 0;
        fanfare.forEach(note => {
            const t = this.ctx.currentTime + offset;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(note.f, t);

            gain.gain.setValueAtTime(0.35 * this.volume, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + note.d);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + note.d);
            offset += note.d * 0.9;
        });
    }
}

window.soundEngine = new SoundEngine();

