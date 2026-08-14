#!/usr/bin/env node
// =======================================
// generate-tones.js
// Day 61 — Generates healing frequency tone MP3s
// Run once: node scripts/generate-tones.js
//
// Requirements:
//   npm install --save-dev audiobuffer-to-wav wav-encoder
//   OR simply use the online tone generator approach below
// =======================================

// ── OPTION 1: Run this script ──────────────────────────────────
// Generates sine wave WAV files, then you convert to MP3 with ffmpeg
//
// Requirements:
//   node >= 16
//   ffmpeg installed (brew install ffmpeg / apt install ffmpeg)
//
// Run:
//   node scripts/generate-tones.js
// ──────────────────────────────────────────────────────────────

const fs   = require('fs');
const path = require('path');

// Output directory
const OUT_DIR = path.join(__dirname, '..', 'assets', 'tones');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// Frequencies to generate — must match every hz in FREQUENCY_PRESETS
// (services/FrequencyEngine.ts). This previously only covered 24 of the
// 48 presets; kept in sync going forward since TONE_MAP / BILATERAL_TONE_MAP
// require an entry for every preset to actually play.
const FREQUENCIES = [
  1, 2, 3, 4, 6, 7, 7.83, 8, 10, 12, 14, 20, 30, 40, 100,
  111, 136.1, 160, 174, 222, 256, 285, 304, 396, 417, 432, 440, 444, 465,
  528, 555, 572, 639, 727, 741, 777, 787, 800, 852, 880, 963,
  994, 1000, 1111, 1150, 1550, 2720, 5000,
];

const SAMPLE_RATE  = 44100;
const DURATION_SEC = 10;     // 10s loop — short enough to be lightweight
const AMPLITUDE    = 0.3;    // Keep quiet — will be mixed with healing track

// Write a 16-bit PCM WAV file
function writeWav(filePath, hz) {
  const numSamples = SAMPLE_RATE * DURATION_SEC;
  const buffer     = Buffer.alloc(44 + numSamples * 2);

  // WAV header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);          // chunk size
  buffer.writeUInt16LE(1, 20);           // PCM format
  buffer.writeUInt16LE(1, 22);           // mono
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * 2, 28); // byte rate
  buffer.writeUInt16LE(2, 32);           // block align
  buffer.writeUInt16LE(16, 34);          // bits per sample
  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples * 2, 40);

  // Sine wave samples
  for (let i = 0; i < numSamples; i++) {
    const sample = Math.sin(2 * Math.PI * hz * i / SAMPLE_RATE) * AMPLITUDE;
    const int16  = Math.max(-32768, Math.min(32767, Math.round(sample * 32767)));
    buffer.writeInt16LE(int16, 44 + i * 2);
  }

  fs.writeFileSync(filePath, buffer);
}

// ── Bilateral (L/R panning) tones — Day 67 ──────────────────────
// expo-av has no usable cross-platform stereo pan API (see
// services/FrequencyEngine.ts SECTION F.1 for why), so bilateral mode
// instead uses stereo files with the pan oscillation baked directly
// into the waveform. Pan speed is a choice among these pre-rendered
// interval variants — keep this list in sync with
// BILATERAL_PAN_INTERVALS_SEC in services/FrequencyEngine.ts.
const BILATERAL_INTERVALS_SEC = [0.5, 1, 2, 4]; // seconds per side

// Write a 16-bit PCM stereo WAV whose L/R balance sweeps smoothly
// left → right → left using equal-power panning, so pan changes never
// dip the perceived volume at center and never click at the extremes.
// One full left-right-left cycle takes 2 * intervalSec, and the file's
// duration is snapped to a whole number of cycles so the loop is seamless.
function writeBilateralWav(filePath, hz, intervalSec) {
  const cycleSec    = 2 * intervalSec;
  const cycles      = Math.max(1, Math.round(DURATION_SEC / cycleSec));
  const durationSec = cycles * cycleSec;
  const numSamples  = Math.round(SAMPLE_RATE * durationSec);
  const buffer      = Buffer.alloc(44 + numSamples * 4); // stereo = 4 bytes/sample

  // WAV header (stereo)
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples * 4, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);              // chunk size
  buffer.writeUInt16LE(1, 20);               // PCM format
  buffer.writeUInt16LE(2, 22);               // stereo
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * 4, 28); // byte rate
  buffer.writeUInt16LE(4, 32);               // block align
  buffer.writeUInt16LE(16, 34);              // bits per sample
  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples * 4, 40);

  for (let i = 0; i < numSamples; i++) {
    const t     = i / SAMPLE_RATE;
    const tone  = Math.sin(2 * Math.PI * hz * i / SAMPLE_RATE) * AMPLITUDE;

    // pan sweeps smoothly between -1 (left) and 1 (right), spending
    // `intervalSec` seconds moving fully from one side to the other
    const pan       = Math.sin(Math.PI * t / intervalSec);
    const leftGain  = Math.cos((pan + 1) * Math.PI / 4); // equal-power law
    const rightGain = Math.sin((pan + 1) * Math.PI / 4);

    const leftInt16  = Math.max(-32768, Math.min(32767, Math.round(tone * leftGain  * 32767)));
    const rightInt16 = Math.max(-32768, Math.min(32767, Math.round(tone * rightGain * 32767)));

    buffer.writeInt16LE(leftInt16,  44 + i * 4);
    buffer.writeInt16LE(rightInt16, 44 + i * 4 + 2);
  }

  fs.writeFileSync(filePath, buffer);
}

const { execSync } = require('child_process');

function convertToMp3(wavPath, mp3Path, hz, label) {
  try {
    execSync(
      `ffmpeg -y -i "${wavPath}" -codec:a libmp3lame -qscale:a 4 "${mp3Path}" 2>/dev/null`,
      { stdio: 'pipe' }
    );
    fs.unlinkSync(wavPath); // remove WAV after converting
    console.log(`  ✓ ${hz} Hz ${label} → ${path.basename(mp3Path)} ✅`);
  } catch {
    console.warn(`  ⚠ ffmpeg not found — keeping WAV for ${hz} Hz ${label}`);
    console.warn(`    Install ffmpeg: brew install ffmpeg`);
  }
}

const generateBilateral = process.argv.includes('--bilateral');

if (!generateBilateral) {
  // Generate all standard (mono) tones
  console.log(`\n🎵 Generating ${FREQUENCIES.length} healing frequency tones...\n`);

  for (const hz of FREQUENCIES) {
    const paddedHz  = String(hz).padStart(3, '0');
    const wavPath   = path.join(OUT_DIR, `tone_${paddedHz}hz.wav`);
    const mp3Path   = path.join(OUT_DIR, `tone_${paddedHz}hz.mp3`);

    writeWav(wavPath, hz);
    console.log(`  ✓ ${hz} Hz → tone_${paddedHz}hz.wav`);
    convertToMp3(wavPath, mp3Path, hz, '');
  }

  console.log('\n✅ Done! Tones saved to assets/tones/');
  console.log('   Import FrequencyEngine and call frequencyEngine.start(hz, intensity)\n');
  console.log('   Run again with --bilateral to also generate stereo panning tones for bilateral mode.\n');
} else {
  // Generate bilateral (stereo, panning) tone variants
  console.log(
    `\n🎧 Generating ${FREQUENCIES.length} × ${BILATERAL_INTERVALS_SEC.length} bilateral (stereo panning) tones...\n`
  );

  for (const hz of FREQUENCIES) {
    const paddedHz = String(hz).padStart(3, '0');

    for (const intervalSec of BILATERAL_INTERVALS_SEC) {
      const intervalTag = String(intervalSec).replace('.', '_');
      const wavPath = path.join(OUT_DIR, `tone_${paddedHz}hz_bilateral_${intervalTag}s.wav`);
      const mp3Path = path.join(OUT_DIR, `tone_${paddedHz}hz_bilateral_${intervalTag}s.mp3`);
      const label   = `(bilateral, ${intervalSec}s/side)`;

      writeBilateralWav(wavPath, hz, intervalSec);
      console.log(`  ✓ ${hz} Hz ${label} → ${path.basename(wavPath)}`);
      convertToMp3(wavPath, mp3Path, hz, label);
    }
  }

  console.log('\n✅ Done! Bilateral tones saved to assets/tones/');
  console.log('   Wire them into BILATERAL_TONE_MAP in services/FrequencyEngine.ts,');
  console.log('   then call frequencyEngine.setBilateralMode(true, intervalSec).\n');
}