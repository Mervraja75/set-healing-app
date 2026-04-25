// =======================================
// FrequencyEngine.ts
// Day 61 — Low-frequency sine wave engine
// Day 62 — Lazy asset loading fix
// Day 63 — Logarithmic scale helpers
// Day 65 — Distortion & clipping guards
// Day 66 — Engine stabilization & auto-restart
// =======================================

import { Audio } from 'expo-av';

/* ---------------------------------------
   SECTION A — Frequency Presets
---------------------------------------- */
export type FrequencyPreset = {
  hz:    number;
  label: string;
  range: 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma' | 'solfeggio';
};

export const FREQUENCY_PRESETS: FrequencyPreset[] = [
  // Delta
  { hz: 1,   label: '1 Hz — Deep delta',       range: 'delta'     },
  { hz: 2,   label: '2 Hz — Delta healing',    range: 'delta'     },
  { hz: 4,   label: '4 Hz — Delta/theta',      range: 'delta'     },
  // Theta
  { hz: 6,   label: '6 Hz — Theta flow',       range: 'theta'     },
  { hz: 7,   label: '7 Hz — Theta deep',       range: 'theta'     },
  { hz: 8,   label: '8 Hz — Theta/alpha',      range: 'theta'     },
  // Alpha
  { hz: 10,  label: '10 Hz — Alpha calm',      range: 'alpha'     },
  { hz: 12,  label: '12 Hz — Alpha focus',     range: 'alpha'     },
  { hz: 14,  label: '14 Hz — Alpha/beta',      range: 'alpha'     },
  // Beta
  { hz: 20,  label: '20 Hz — Beta active',     range: 'beta'      },
  { hz: 30,  label: '30 Hz — Beta alert',      range: 'beta'      },
  // Gamma
  { hz: 40,  label: '40 Hz — Gamma clarity',   range: 'gamma'     },
  { hz: 100, label: '100 Hz — Gamma peak',     range: 'gamma'     },
  // Solfeggio
  { hz: 174, label: '174 Hz — Foundation',     range: 'solfeggio' },
  { hz: 285, label: '285 Hz — Tissue heal',    range: 'solfeggio' },
  { hz: 396, label: '396 Hz — Liberation',     range: 'solfeggio' },
  { hz: 417, label: '417 Hz — Transformation', range: 'solfeggio' },
  { hz: 432, label: '432 Hz — Natural tuning', range: 'solfeggio' },
  { hz: 440, label: '440 Hz — Standard A',     range: 'solfeggio' },
  { hz: 528, label: '528 Hz — DNA repair',     range: 'solfeggio' },
  { hz: 639, label: '639 Hz — Connection',     range: 'solfeggio' },
  { hz: 741, label: '741 Hz — Expression',     range: 'solfeggio' },
  { hz: 852, label: '852 Hz — Intuition',      range: 'solfeggio' },
  { hz: 963, label: '963 Hz — Crown',          range: 'solfeggio' },
];

/* ---------------------------------------
   SECTION B — Brainwave range metadata
---------------------------------------- */
export type FrequencyRange = {
  id:    FrequencyPreset['range'];
  label: string;
  min:   number;
  max:   number;
  color: string;
  desc:  string;
};

export const FREQUENCY_RANGES: FrequencyRange[] = [
  { id: 'delta',     label: 'Delta',     min: 0.5, max: 4,   color: '#7B52C8', desc: 'Deep sleep · Healing · Restoration'     },
  { id: 'theta',     label: 'Theta',     min: 4,   max: 8,   color: '#5B8FD4', desc: 'Meditation · REM · Subconscious access' },
  { id: 'alpha',     label: 'Alpha',     min: 8,   max: 14,  color: '#5BC4D4', desc: 'Relaxation · Flow state · Calm focus'   },
  { id: 'beta',      label: 'Beta',      min: 14,  max: 30,  color: '#7EFFD4', desc: 'Alertness · Active thinking · Clarity'  },
  { id: 'gamma',     label: 'Gamma',     min: 30,  max: 100, color: '#D4A828', desc: 'High cognition · Peak performance'      },
  { id: 'solfeggio', label: 'Solfeggio', min: 174, max: 963, color: '#FF9F7A', desc: 'Sacred healing · Cellular resonance'    },
];

/* ---------------------------------------
   SECTION C — Logarithmic scale (Day 63)
   Slider 0–60  → Hz 1–100  (brainwave)
   Slider 60–100 → Hz 100–963 (solfeggio)
---------------------------------------- */
const LOG_BREAKPOINT_SLIDER = 60;
const LOG_BREAKPOINT_HZ     = 100;
const LOG_MIN_HZ            = 1;
const LOG_MAX_HZ            = 963;

export function sliderToHz(sliderPos: number): number {
  const pos = Math.max(0, Math.min(100, sliderPos));
  if (pos <= LOG_BREAKPOINT_SLIDER) {
    const t = pos / LOG_BREAKPOINT_SLIDER;
    return Math.round(LOG_MIN_HZ * Math.pow(LOG_BREAKPOINT_HZ / LOG_MIN_HZ, t));
  } else {
    const t = (pos - LOG_BREAKPOINT_SLIDER) / (100 - LOG_BREAKPOINT_SLIDER);
    return Math.round(LOG_BREAKPOINT_HZ * Math.pow(LOG_MAX_HZ / LOG_BREAKPOINT_HZ, t));
  }
}

export function hzToSlider(hz: number): number {
  const h = Math.max(LOG_MIN_HZ, Math.min(LOG_MAX_HZ, hz));
  if (h <= LOG_BREAKPOINT_HZ) {
    const t = Math.log(h / LOG_MIN_HZ) / Math.log(LOG_BREAKPOINT_HZ / LOG_MIN_HZ);
    return Math.round(t * LOG_BREAKPOINT_SLIDER);
  } else {
    const t = Math.log(h / LOG_BREAKPOINT_HZ) / Math.log(LOG_MAX_HZ / LOG_BREAKPOINT_HZ);
    return Math.round(LOG_BREAKPOINT_SLIDER + t * (100 - LOG_BREAKPOINT_SLIDER));
  }
}

/* ---------------------------------------
   SECTION D — Helpers
---------------------------------------- */
export function getClosestPreset(hz: number): FrequencyPreset {
  return FREQUENCY_PRESETS.reduce((closest, preset) =>
    Math.abs(preset.hz - hz) < Math.abs(closest.hz - hz) ? preset : closest
  );
}

export function getRangeForHz(hz: number): FrequencyRange {
  return (
    FREQUENCY_RANGES.find((r) => hz >= r.min && hz <= r.max) ??
    FREQUENCY_RANGES[FREQUENCY_RANGES.length - 1]
  );
}

/* ---------------------------------------
   SECTION E — Volume helpers (Day 65)
   Distortion & clipping guards
---------------------------------------- */
const MAX_FREQ_SOLO = 0.65; // freq engine alone
const MAX_FREQ_MIX  = 0.45; // freq + bass active together
const MAX_BASS      = 0.70; // bass layer hard cap

export function intensityToVolume(
  intensity: number,
  bassIsActive = false
): number {
  const cap = bassIsActive ? MAX_FREQ_MIX : MAX_FREQ_SOLO;
  return Math.min((intensity / 100) * cap, cap);
}

export function bassLevelToVolume(level: number): number {
  return Math.min((level / 100) * 0.8, MAX_BASS);
}

/* ---------------------------------------
   SECTION F — Lazy asset loader
---------------------------------------- */
function loadToneAsset(hz: number): any | null {
  const padded   = String(hz).padStart(3, '0');
  const filename = `tone_${padded}hz`;

  // Replace nulls with require() after running generate-tones.js
  const TONE_MAP: Record<string, any> = {
    tone_001hz: null, tone_002hz: null, tone_004hz: null,
    tone_006hz: null, tone_007hz: null, tone_008hz: null,
    tone_010hz: null, tone_012hz: null, tone_014hz: null,
    tone_020hz: null, tone_030hz: null, tone_040hz: null,
    tone_100hz: null, tone_174hz: null, tone_285hz: null,
    tone_396hz: null, tone_417hz: null, tone_432hz: null,
    tone_440hz: null, tone_528hz: null, tone_639hz: null,
    tone_741hz: null, tone_852hz: null, tone_963hz: null,
  };

  return TONE_MAP[filename] ?? null;
}

/* ---------------------------------------
   SECTION G — FrequencyEngine class
   Day 66 additions:
   - Mutex guard (isStarting) prevents race conditions
   - Playback status monitor detects unexpected stops
   - Auto-restart: if tone stops while engine should be active,
     it restarts automatically after a short delay
   - Retry logic: failed start() retries once after 500ms
   - health() method: returns true if tone is actually playing
   - Stored params (hz, intensity, bassIsActive) allow clean
     auto-restart without needing params passed again
---------------------------------------- */
export class FrequencyEngine {
  private sound:        Audio.Sound | null = null;
  private currentHz:    number             = 0;
  private isStarting:   boolean            = false; // Day 66 — mutex
  private shouldRun:    boolean            = false; // Day 66 — intent flag
  private lastIntensity:number             = 30;    // Day 66 — stored for restart
  private lastBassActive: boolean          = false; // Day 66 — stored for restart
  private restartTimer: ReturnType<typeof setTimeout> | null = null;

  /* ── Day 66 — Internal start with retry ── */
  private async _startOnce(
    hz: number,
    intensity: number,
    bassIsActive: boolean
  ): Promise<boolean> {
    const preset = getClosestPreset(hz);
    const asset  = loadToneAsset(preset.hz);

    if (!asset) {
      console.info(
        `[FrequencyEngine] Tone for ${hz} Hz not ready. ` +
        `Run: node scripts/generate-tones.js`
      );
      return false;
    }

    try {
      const { sound } = await Audio.Sound.createAsync(asset, {
        shouldPlay: true,
        isLooping:  true,
        volume:     intensityToVolume(intensity, bassIsActive),
      });

      // Day 66 — Monitor playback status for unexpected stops
      sound.setOnPlaybackStatusUpdate((status) => {
        if (!this.shouldRun) return;
        if (!status.isLoaded) {
          // Sound became unloaded unexpectedly — schedule restart
          this._scheduleRestart();
        }
      });

      this.sound     = sound;
      this.currentHz = preset.hz;
      return true;
    } catch (err) {
      console.error('[FrequencyEngine] Start failed:', err);
      return false;
    }
  }

  /* ── Day 66 — Schedule auto-restart after interruption ── */
  private _scheduleRestart(): void {
    if (this.restartTimer) return; // already scheduled
    this.restartTimer = setTimeout(async () => {
      this.restartTimer = null;
      if (!this.shouldRun) return;
      console.info('[FrequencyEngine] Auto-restarting after interruption…');
      this.sound = null;
      await this._startOnce(
        this.currentHz || 440,
        this.lastIntensity,
        this.lastBassActive
      );
    }, 800); // wait 800ms before restarting to avoid thrashing
  }

  /* ── Public: start ── */
  async start(
    hz: number,
    intensity: number,
    bassIsActive = false
  ): Promise<void> {
    // Day 66 — mutex: ignore if already starting
    if (this.isStarting) return;
    this.isStarting    = true;
    this.shouldRun     = true;
    this.lastIntensity = intensity;
    this.lastBassActive= bassIsActive;

    await this.stop();

    const success = await this._startOnce(hz, intensity, bassIsActive);

    // Day 66 — retry once on failure
    if (!success && this.shouldRun) {
      await new Promise((r) => setTimeout(r, 500));
      if (this.shouldRun) {
        await this._startOnce(hz, intensity, bassIsActive);
      }
    }

    this.isStarting = false;
  }

  /* ── Public: setIntensity ── */
  async setIntensity(intensity: number, bassIsActive = false): Promise<void> {
    this.lastIntensity  = intensity;
    this.lastBassActive = bassIsActive;
    if (!this.sound) return;
    try {
      const status = await this.sound.getStatusAsync();
      if (status.isLoaded) {
        await this.sound.setVolumeAsync(intensityToVolume(intensity, bassIsActive));
      }
    } catch {}
  }

  /* ── Public: setFrequency ── */
  async setFrequency(
    hz: number,
    intensity: number,
    bassIsActive = false
  ): Promise<void> {
    const newPreset     = getClosestPreset(hz);
    const currentPreset = getClosestPreset(this.currentHz);
    if (newPreset.hz !== currentPreset.hz) {
      await this.start(hz, intensity, bassIsActive);
    }
  }

  /* ── Public: stop ── */
  async stop(): Promise<void> {
    // Day 66 — cancel any pending auto-restart
    this.shouldRun = false;
    if (this.restartTimer) {
      clearTimeout(this.restartTimer);
      this.restartTimer = null;
    }

    if (!this.sound) return;
    try {
      this.sound.setOnPlaybackStatusUpdate(null);
      await this.sound.stopAsync();
      await this.sound.unloadAsync();
    } catch {}
    this.sound     = null;
    this.currentHz = 0;
  }

  /* ── Day 66 — Health check ── */
  async health(): Promise<boolean> {
    if (!this.sound) return false;
    try {
      const status = await this.sound.getStatusAsync();
      return status.isLoaded && status.isPlaying;
    } catch {
      return false;
    }
  }

  get isActive(): boolean {
    return this.sound !== null && this.shouldRun;
  }
}

// Singleton shared between Player + Practitioner
export const frequencyEngine = new FrequencyEngine();