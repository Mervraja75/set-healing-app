// =======================================
// FrequencyEngine.ts
// Day 61 — Low-frequency sine wave engine
// Day 62 — Lazy asset loading fix
// Day 63 — Logarithmic scale helpers
// Day 65 — Distortion & clipping guards
// Day 66 — Engine stabilization & auto-restart
// =======================================

import { Audio } from 'expo-av';
import { GOLD } from '@/constants/Colors';

/* ---------------------------------------
   SECTION A — Frequency Presets
---------------------------------------- */
export type FrequencyPreset = {
  hz:          number;
  label:       string;
  description: string;
  range: 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma' | 'solfeggio'
       | 'healing' | 'cosmic' | 'rife' | 'trauma' | 'earth';
};

export const FREQUENCY_PRESETS: FrequencyPreset[] = [
  // ── Delta (0.5–4 Hz) ──────────────────────────────────────────────────────
  { hz: 1,    label: '1 Hz — Deep delta',          range: 'delta',     description: 'Deepest delta state — profound sleep, cellular regeneration'                   },
  { hz: 2,    label: '2 Hz — Delta healing',       range: 'delta',     description: 'Delta healing — nerve regeneration, growth hormone release'                    },
  { hz: 3,    label: '3 Hz — Delta deep',          range: 'delta',     description: 'Deep delta — dreamless sleep, immune system restoration'                       },
  { hz: 4,    label: '4 Hz — Delta/theta',         range: 'delta',     description: 'Delta-theta border — deep meditation, subconscious programming'                },
  // ── Theta (4–8 Hz) ───────────────────────────────────────────────────────
  { hz: 6,    label: '6 Hz — Theta flow',          range: 'theta',     description: 'Theta flow — creative insight, REM sleep, memory consolidation'                },
  { hz: 7,    label: '7 Hz — Theta deep',          range: 'theta',     description: 'Deep theta — shamanic states, hypnagogic imagery, deep healing'                },
  { hz: 7.83, label: '7.83 Hz — Schumann',         range: 'earth',     description: "Earth's electromagnetic heartbeat — grounding, nervous system resonance"       },
  { hz: 8,    label: '8 Hz — Theta/alpha',         range: 'theta',     description: 'Theta-alpha border — relaxed awareness, light meditation'                      },
  // ── Alpha (8–14 Hz) ──────────────────────────────────────────────────────
  { hz: 10,   label: '10 Hz — Alpha calm',         range: 'alpha',     description: 'Pure alpha — calm alertness, serotonin release, anti-anxiety'                  },
  { hz: 12,   label: '12 Hz — Alpha focus',        range: 'alpha',     description: 'High alpha — focused relaxation, learning readiness'                           },
  { hz: 14,   label: '14 Hz — Alpha/beta',         range: 'alpha',     description: 'Alpha-beta border — sharp yet relaxed mind, clear thinking'                    },
  // ── Beta (14–30 Hz) ──────────────────────────────────────────────────────
  { hz: 20,   label: '20 Hz — Rife beta',          range: 'rife',      description: 'Rife beta baseline — alertness, motor function, neurological support'          },
  { hz: 30,   label: '30 Hz — Beta alert',         range: 'beta',      description: 'High beta — peak alertness, critical thinking, concentration'                  },
  // ── Gamma (30–100 Hz) ────────────────────────────────────────────────────
  { hz: 40,   label: '40 Hz — Gamma clarity',      range: 'gamma',     description: '40 Hz entrainment — Alzheimer\'s research, neural binding, lucid states'      },
  { hz: 100,  label: '100 Hz — Gamma peak',        range: 'gamma',     description: 'Peak gamma — hyper-focus, information processing, insight states'             },
  // ── Healing (100–174 Hz) ─────────────────────────────────────────────────
  { hz: 111,  label: '111 Hz — Cell regeneration', range: 'healing',   description: 'Beta endorphin release — cellular regeneration, pain relief, deep calm'       },
  { hz: 136.1,label: '136.1 Hz — OM',              range: 'cosmic',    description: 'Cosmic OM — meditative stillness, spiritual centering, inner peace'           },
  { hz: 160,  label: '160 Hz — Rife healing',      range: 'rife',      description: 'Rife protocol — general wellness, circulation support'                        },
  // ── Solfeggio (174–963 Hz) ───────────────────────────────────────────────
  { hz: 174,  label: '174 Hz — Foundation',        range: 'solfeggio', description: 'Foundation frequency — pain reduction, organ healing, sense of security'      },
  { hz: 222,  label: '222 Hz — Cellular harmony',  range: 'healing',   description: 'Harmonic cellular alignment — tissue coherence, body-mind balance'            },
  { hz: 256,  label: '256 Hz — Middle C',          range: 'healing',   description: 'Scientific pitch middle C — natural resonance, mathematical harmony'          },
  { hz: 285,  label: '285 Hz — Tissue heal',       range: 'solfeggio', description: 'Tissue regeneration — heals cuts, burns, and damaged tissue at cellular level'},
  { hz: 304,  label: '304 Hz — Trauma release',    range: 'trauma',    description: 'Somatic trauma release — dissolves held tension and fight/flight residue'      },
  { hz: 396,  label: '396 Hz — Liberation',        range: 'solfeggio', description: 'Liberation from fear and guilt — root chakra activation, grounding'           },
  { hz: 417,  label: '417 Hz — Transformation',    range: 'solfeggio', description: 'Undoing situations and facilitating change — sacral chakra, creativity'       },
  { hz: 432,  label: '432 Hz — Natural tuning',    range: 'solfeggio', description: "Verdi's A — mathematical universe, heart resonance, deeply calming"           },
  { hz: 440,  label: '440 Hz — Standard A',        range: 'solfeggio', description: 'Standard concert pitch — reference tone for tuning and calibration'           },
  { hz: 444,  label: '444 Hz — Cosmic A',          range: 'cosmic',    description: 'Cosmic tuning — opens C5 at 528 Hz, angelic frequency alignment'             },
  { hz: 465,  label: '465 Hz — Rife protocol',     range: 'rife',      description: 'Rife frequency — detoxification support, immune enhancement'                  },
  { hz: 528,  label: '528 Hz — DNA repair',        range: 'solfeggio', description: 'Miracle tone — DNA repair, solar plexus, transformation and love frequency'   },
  { hz: 555,  label: '555 Hz — Angelic',           range: 'cosmic',    description: 'Angelic frequency — divine guidance, spiritual lift, celestial alignment'     },
  { hz: 572,  label: '572 Hz — Somatic release',   range: 'trauma',    description: 'Somatic release — integrates shock and stored trauma in the nervous system'   },
  { hz: 639,  label: '639 Hz — Connection',        range: 'solfeggio', description: 'Harmonising relationships — heart chakra, love, forgiveness, compassion'      },
  { hz: 727,  label: '727 Hz — Rife antiviral',    range: 'rife',      description: 'Rife antiviral frequency — immune support, cellular defense'                  },
  { hz: 741,  label: '741 Hz — Expression',        range: 'solfeggio', description: 'Awakening intuition — throat chakra, expression, clarity, truth'              },
  { hz: 777,  label: '777 Hz — Sacred seven',      range: 'cosmic',    description: 'Triple sacred geometry — divine alignment, spiritual amplification'           },
  { hz: 787,  label: '787 Hz — Rife frequency',    range: 'rife',      description: 'Rife protocol — targeted cellular support, energetic clearing'                },
  { hz: 800,  label: '800 Hz — Rife healing',      range: 'rife',      description: 'Rife healing band — broad-spectrum cellular support'                          },
  { hz: 852,  label: '852 Hz — Intuition',         range: 'solfeggio', description: 'Spiritual order — third eye chakra, intuition, returning to spiritual order'  },
  { hz: 880,  label: '880 Hz — Rife antimicrobial',range: 'rife',      description: 'Rife antimicrobial — energetic cleansing, immune system activation'           },
  { hz: 963,  label: '963 Hz — Crown',             range: 'solfeggio', description: 'Crown chakra — divine consciousness, pineal activation, unity with source'    },
  // ── Cosmic / Rife / High-spectrum (963 Hz+) ─────────────────────────────
  { hz: 994,  label: '994 Hz — Rife extended',     range: 'rife',      description: 'Rife extended protocol — deep cellular penetration, energetic realignment'    },
  { hz: 1000, label: '1000 Hz — Whole healing',    range: 'healing',   description: 'Whole healing tone — harmonic completeness, energetic integration'            },
  { hz: 1111, label: '1111 Hz — Angel number',     range: 'cosmic',    description: 'Master frequency — angelic gateway, awakening portal, spiritual alignment'    },
  { hz: 1150, label: '1150 Hz — Rife extended',    range: 'rife',      description: 'Rife high-spectrum — advanced cellular support, deep tissue penetration'      },
  { hz: 1550, label: '1550 Hz — Rife high',        range: 'rife',      description: 'Rife high-spectrum — targeted pathogen disruption, immune activation'         },
  { hz: 2720, label: '2720 Hz — Rife deep',        range: 'rife',      description: 'Rife deep spectrum — advanced protocol frequency, energetic clearing'         },
  { hz: 5000, label: '5000 Hz — Rife ultra',       range: 'rife',      description: 'Rife ultra-high — maximum spectrum frequency, complete energetic reset'       },
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
  { id: 'delta',     label: 'Delta',     min: 0.5,  max: 4,    color: '#7B52C8', desc: 'Deep sleep · Healing · Restoration'        },
  { id: 'theta',     label: 'Theta',     min: 4,    max: 8,    color: '#5B8FD4', desc: 'Meditation · REM · Subconscious access'    },
  { id: 'alpha',     label: 'Alpha',     min: 8,    max: 14,   color: '#5BC4D4', desc: 'Relaxation · Flow state · Calm focus'      },
  { id: 'beta',      label: 'Beta',      min: 14,   max: 30,   color: '#7EFFD4', desc: 'Alertness · Active thinking · Clarity'     },
  { id: 'gamma',     label: 'Gamma',     min: 30,   max: 100,  color: GOLD, desc: 'High cognition · Peak performance'         },
  { id: 'healing',   label: 'Healing',   min: 100,  max: 174,  color: '#FF6B35', desc: 'Cellular resonance · Regeneration'         },
  { id: 'solfeggio', label: 'Solfeggio', min: 174,  max: 963,  color: '#FF9F7A', desc: 'Sacred healing · Cellular resonance'       },
  { id: 'cosmic',    label: 'Cosmic',    min: 963,  max: 1200, color: GOLD, desc: 'Universal harmony · Cosmic alignment'      },
  { id: 'rife',      label: 'Rife',      min: 1200, max: 5100, color: '#E74C3C', desc: 'Rife protocol · Targeted frequencies'      },
  { id: 'trauma',    label: 'Trauma',    min: 5100, max: 5500, color: '#9B59B6', desc: 'Somatic release · Trauma integration'      },
  { id: 'earth',     label: 'Earth',     min: 5500, max: 6000, color: '#16A085', desc: 'Schumann resonance · Earth harmony'        },
];

/* ---------------------------------------
   SECTION C — Logarithmic scale (Day 63)
   Slider 0–60  → Hz 1–100  (brainwave)
   Slider 60–100 → Hz 100–963 (solfeggio)
---------------------------------------- */
const LOG_BREAKPOINT_SLIDER = 60;
const LOG_BREAKPOINT_HZ     = 100;
const LOG_MIN_HZ            = 1;
const LOG_MAX_HZ            = 5000;

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
const TONE_MAP: Record<string, any> = {
  // Delta
  tone_001hz: require('../assets/tones/tone_001hz.mp3'), tone_002hz: require('../assets/tones/tone_002hz.mp3'), tone_003hz: require('../assets/tones/tone_003hz.mp3'),
  tone_004hz: require('../assets/tones/tone_004hz.mp3'),
  // Theta / Earth
  tone_006hz: require('../assets/tones/tone_006hz.mp3'), tone_007hz: require('../assets/tones/tone_007hz.mp3'), 'tone_7.83hz': require('../assets/tones/tone_7.83hz.mp3'),
  tone_008hz: require('../assets/tones/tone_008hz.mp3'),
  // Alpha
  tone_010hz: require('../assets/tones/tone_010hz.mp3'), tone_012hz: require('../assets/tones/tone_012hz.mp3'), tone_014hz: require('../assets/tones/tone_014hz.mp3'),
  // Beta / Gamma
  tone_020hz: require('../assets/tones/tone_020hz.mp3'), tone_030hz: require('../assets/tones/tone_030hz.mp3'), tone_040hz: require('../assets/tones/tone_040hz.mp3'),
  tone_100hz: require('../assets/tones/tone_100hz.mp3'),
  // Healing band
  tone_111hz: require('../assets/tones/tone_111hz.mp3'), 'tone_136.1hz': require('../assets/tones/tone_136.1hz.mp3'), tone_160hz: require('../assets/tones/tone_160hz.mp3'),
  // Solfeggio
  tone_174hz: require('../assets/tones/tone_174hz.mp3'), tone_222hz: require('../assets/tones/tone_222hz.mp3'), tone_256hz: require('../assets/tones/tone_256hz.mp3'),
  tone_285hz: require('../assets/tones/tone_285hz.mp3'), tone_304hz: require('../assets/tones/tone_304hz.mp3'), tone_396hz: require('../assets/tones/tone_396hz.mp3'),
  tone_417hz: require('../assets/tones/tone_417hz.mp3'), tone_432hz: require('../assets/tones/tone_432hz.mp3'), tone_440hz: require('../assets/tones/tone_440hz.mp3'),
  tone_444hz: require('../assets/tones/tone_444hz.mp3'), tone_465hz: require('../assets/tones/tone_465hz.mp3'), tone_528hz: require('../assets/tones/tone_528hz.mp3'),
  tone_555hz: require('../assets/tones/tone_555hz.mp3'), tone_572hz: require('../assets/tones/tone_572hz.mp3'), tone_639hz: require('../assets/tones/tone_639hz.mp3'),
  tone_727hz: require('../assets/tones/tone_727hz.mp3'), tone_741hz: require('../assets/tones/tone_741hz.mp3'), tone_777hz: require('../assets/tones/tone_777hz.mp3'),
  tone_787hz: require('../assets/tones/tone_787hz.mp3'), tone_800hz: require('../assets/tones/tone_800hz.mp3'), tone_852hz: require('../assets/tones/tone_852hz.mp3'),
  tone_880hz: require('../assets/tones/tone_880hz.mp3'), tone_963hz: require('../assets/tones/tone_963hz.mp3'),
  // Cosmic / Rife high-spectrum
  tone_994hz: require('../assets/tones/tone_994hz.mp3'), tone_1000hz: require('../assets/tones/tone_1000hz.mp3'), tone_1111hz: require('../assets/tones/tone_1111hz.mp3'),
  tone_1150hz: require('../assets/tones/tone_1150hz.mp3'), tone_1550hz: require('../assets/tones/tone_1550hz.mp3'), tone_2720hz: require('../assets/tones/tone_2720hz.mp3'),
  tone_5000hz: require('../assets/tones/tone_5000hz.mp3'),
};

function loadToneAsset(hz: number): any | null {
  const padded   = String(hz).padStart(3, '0');
  const filename = `tone_${padded}hz`;
  return TONE_MAP[filename] ?? null;
}

/* ---------------------------------------
   SECTION F.1 — Bilateral (L/R panning) assets
   Day 67

   expo-av's Audio.Sound.setVolumeAsync(volume, audioPan) cannot be used
   for this: iOS has no native audioPan implementation at all (silent
   no-op), and Android only wires audioPan through the legacy MediaPlayer
   backend, not the default ExoPlayer backend it actually loads sounds
   with. Neither expo-av nor expo-audio expose real stereo panning.

   Instead, bilateral tones are pre-rendered stereo files where the pan
   oscillation is baked into the waveform itself (see
   scripts/generate-tones.js --bilateral). "Pan speed" is therefore a
   choice among pre-rendered interval variants rather than a free-form
   runtime value.
---------------------------------------- */
export const BILATERAL_PAN_INTERVALS_SEC = [0.5, 1, 2, 4] as const;
export type BilateralPanInterval = typeof BILATERAL_PAN_INTERVALS_SEC[number];
const DEFAULT_BILATERAL_INTERVAL_SEC: BilateralPanInterval = 1;

export function nearestBilateralInterval(intervalSec: number): BilateralPanInterval {
  return BILATERAL_PAN_INTERVALS_SEC.reduce((closest, opt) =>
    Math.abs(opt - intervalSec) < Math.abs(closest - intervalSec) ? opt : closest
  );
}

type BilateralAssetSlots = Record<BilateralPanInterval, any>;

const BILATERAL_TONE_MAP: Record<string, BilateralAssetSlots> = {
  // Delta
  tone_001hz: { 0.5: require('../assets/tones/tone_001hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_001hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_001hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_001hz_bilateral_4s.mp3') },
  tone_002hz: { 0.5: require('../assets/tones/tone_002hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_002hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_002hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_002hz_bilateral_4s.mp3') },
  tone_003hz: { 0.5: require('../assets/tones/tone_003hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_003hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_003hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_003hz_bilateral_4s.mp3') },
  tone_004hz: { 0.5: require('../assets/tones/tone_004hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_004hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_004hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_004hz_bilateral_4s.mp3') },
  // Theta / Earth
  tone_006hz: { 0.5: require('../assets/tones/tone_006hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_006hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_006hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_006hz_bilateral_4s.mp3') },
  tone_007hz: { 0.5: require('../assets/tones/tone_007hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_007hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_007hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_007hz_bilateral_4s.mp3') },
  'tone_7.83hz': { 0.5: require('../assets/tones/tone_7.83hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_7.83hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_7.83hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_7.83hz_bilateral_4s.mp3') },
  tone_008hz: { 0.5: require('../assets/tones/tone_008hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_008hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_008hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_008hz_bilateral_4s.mp3') },
  // Alpha
  tone_010hz: { 0.5: require('../assets/tones/tone_010hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_010hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_010hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_010hz_bilateral_4s.mp3') },
  tone_012hz: { 0.5: require('../assets/tones/tone_012hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_012hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_012hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_012hz_bilateral_4s.mp3') },
  tone_014hz: { 0.5: require('../assets/tones/tone_014hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_014hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_014hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_014hz_bilateral_4s.mp3') },
  // Beta / Gamma
  tone_020hz: { 0.5: require('../assets/tones/tone_020hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_020hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_020hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_020hz_bilateral_4s.mp3') },
  tone_030hz: { 0.5: require('../assets/tones/tone_030hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_030hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_030hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_030hz_bilateral_4s.mp3') },
  tone_040hz: { 0.5: require('../assets/tones/tone_040hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_040hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_040hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_040hz_bilateral_4s.mp3') },
  tone_100hz: { 0.5: require('../assets/tones/tone_100hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_100hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_100hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_100hz_bilateral_4s.mp3') },
  // Healing band
  tone_111hz: { 0.5: require('../assets/tones/tone_111hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_111hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_111hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_111hz_bilateral_4s.mp3') },
  'tone_136.1hz': { 0.5: require('../assets/tones/tone_136.1hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_136.1hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_136.1hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_136.1hz_bilateral_4s.mp3') },
  tone_160hz: { 0.5: require('../assets/tones/tone_160hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_160hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_160hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_160hz_bilateral_4s.mp3') },
  // Solfeggio
  tone_174hz: { 0.5: require('../assets/tones/tone_174hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_174hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_174hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_174hz_bilateral_4s.mp3') },
  tone_222hz: { 0.5: require('../assets/tones/tone_222hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_222hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_222hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_222hz_bilateral_4s.mp3') },
  tone_256hz: { 0.5: require('../assets/tones/tone_256hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_256hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_256hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_256hz_bilateral_4s.mp3') },
  tone_285hz: { 0.5: require('../assets/tones/tone_285hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_285hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_285hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_285hz_bilateral_4s.mp3') },
  tone_304hz: { 0.5: require('../assets/tones/tone_304hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_304hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_304hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_304hz_bilateral_4s.mp3') },
  tone_396hz: { 0.5: require('../assets/tones/tone_396hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_396hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_396hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_396hz_bilateral_4s.mp3') },
  tone_417hz: { 0.5: require('../assets/tones/tone_417hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_417hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_417hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_417hz_bilateral_4s.mp3') },
  tone_432hz: { 0.5: require('../assets/tones/tone_432hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_432hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_432hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_432hz_bilateral_4s.mp3') },
  tone_440hz: { 0.5: require('../assets/tones/tone_440hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_440hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_440hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_440hz_bilateral_4s.mp3') },
  tone_444hz: { 0.5: require('../assets/tones/tone_444hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_444hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_444hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_444hz_bilateral_4s.mp3') },
  tone_465hz: { 0.5: require('../assets/tones/tone_465hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_465hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_465hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_465hz_bilateral_4s.mp3') },
  tone_528hz: { 0.5: require('../assets/tones/tone_528hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_528hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_528hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_528hz_bilateral_4s.mp3') },
  tone_555hz: { 0.5: require('../assets/tones/tone_555hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_555hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_555hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_555hz_bilateral_4s.mp3') },
  tone_572hz: { 0.5: require('../assets/tones/tone_572hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_572hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_572hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_572hz_bilateral_4s.mp3') },
  tone_639hz: { 0.5: require('../assets/tones/tone_639hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_639hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_639hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_639hz_bilateral_4s.mp3') },
  tone_727hz: { 0.5: require('../assets/tones/tone_727hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_727hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_727hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_727hz_bilateral_4s.mp3') },
  tone_741hz: { 0.5: require('../assets/tones/tone_741hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_741hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_741hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_741hz_bilateral_4s.mp3') },
  tone_777hz: { 0.5: require('../assets/tones/tone_777hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_777hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_777hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_777hz_bilateral_4s.mp3') },
  tone_787hz: { 0.5: require('../assets/tones/tone_787hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_787hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_787hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_787hz_bilateral_4s.mp3') },
  tone_800hz: { 0.5: require('../assets/tones/tone_800hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_800hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_800hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_800hz_bilateral_4s.mp3') },
  tone_852hz: { 0.5: require('../assets/tones/tone_852hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_852hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_852hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_852hz_bilateral_4s.mp3') },
  tone_880hz: { 0.5: require('../assets/tones/tone_880hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_880hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_880hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_880hz_bilateral_4s.mp3') },
  tone_963hz: { 0.5: require('../assets/tones/tone_963hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_963hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_963hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_963hz_bilateral_4s.mp3') },
  // Cosmic / Rife high-spectrum
  tone_994hz: { 0.5: require('../assets/tones/tone_994hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_994hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_994hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_994hz_bilateral_4s.mp3') },
  tone_1000hz: { 0.5: require('../assets/tones/tone_1000hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_1000hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_1000hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_1000hz_bilateral_4s.mp3') },
  tone_1111hz: { 0.5: require('../assets/tones/tone_1111hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_1111hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_1111hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_1111hz_bilateral_4s.mp3') },
  tone_1150hz: { 0.5: require('../assets/tones/tone_1150hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_1150hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_1150hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_1150hz_bilateral_4s.mp3') },
  tone_1550hz: { 0.5: require('../assets/tones/tone_1550hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_1550hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_1550hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_1550hz_bilateral_4s.mp3') },
  tone_2720hz: { 0.5: require('../assets/tones/tone_2720hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_2720hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_2720hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_2720hz_bilateral_4s.mp3') },
  tone_5000hz: { 0.5: require('../assets/tones/tone_5000hz_bilateral_0_5s.mp3'), 1: require('../assets/tones/tone_5000hz_bilateral_1s.mp3'), 2: require('../assets/tones/tone_5000hz_bilateral_2s.mp3'), 4: require('../assets/tones/tone_5000hz_bilateral_4s.mp3') },
};

function loadBilateralToneAsset(hz: number, intervalSec: BilateralPanInterval): any | null {
  const padded   = String(hz).padStart(3, '0');
  const filename = `tone_${padded}hz`;
  return BILATERAL_TONE_MAP[filename]?.[intervalSec] ?? null;
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
  private bilateralEnabled:     boolean              = false;                        // Day 67
  private bilateralIntervalSec: BilateralPanInterval = DEFAULT_BILATERAL_INTERVAL_SEC; // Day 67

  /* ── Day 66 — Internal start with retry ── */
  private async _startOnce(
    hz: number,
    intensity: number,
    bassIsActive: boolean
  ): Promise<boolean> {
    const preset = getClosestPreset(hz);
    const asset  = this.bilateralEnabled
      ? loadBilateralToneAsset(preset.hz, this.bilateralIntervalSec)
      : loadToneAsset(preset.hz);

    if (!asset) {
      if (this.bilateralEnabled) {
        console.info(
          `[FrequencyEngine] Bilateral tone for ${hz} Hz @ ${this.bilateralIntervalSec}s/side not ready. ` +
          `Run: node scripts/generate-tones.js --bilateral`
        );
      } else {
        console.info(
          `[FrequencyEngine] Tone for ${hz} Hz not ready. ` +
          `Run: node scripts/generate-tones.js`
        );
      }
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

  /* ── Public: setBilateralMode (Day 67) ──
     Toggles bilateral (L/R alternating) panning. Optional and separate
     from normal playback — off by default, so existing start()/setFrequency()
     callers are unaffected unless this is explicitly turned on.
     If a tone is already playing, it restarts against the bilateral (or
     mono) asset so the change takes effect immediately. ── */
  async setBilateralMode(
    enabled: boolean,
    intervalSec: number = DEFAULT_BILATERAL_INTERVAL_SEC
  ): Promise<void> {
    this.bilateralEnabled     = enabled;
    this.bilateralIntervalSec = nearestBilateralInterval(intervalSec);

    if (this.shouldRun && this.sound) {
      await this.start(this.currentHz || 440, this.lastIntensity, this.lastBassActive);
    }
  }

  get isBilateralMode(): boolean {
    return this.bilateralEnabled;
  }

  get bilateralInterval(): BilateralPanInterval {
    return this.bilateralIntervalSec;
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