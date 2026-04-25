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

// Frequencies to generate (must match FrequencyEngine.ts PRESETS)
const FREQUENCIES = [
  1, 2, 4, 6, 7, 8, 10, 12, 14, 20, 30, 40, 100,
  174, 285, 396, 417, 432, 440, 528, 639, 741, 852, 963,
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

// Generate all tones
console.log(`\n🎵 Generating ${FREQUENCIES.length} healing frequency tones...\n`);

for (const hz of FREQUENCIES) {
  const paddedHz  = String(hz).padStart(3, '0');
  const wavPath   = path.join(OUT_DIR, `tone_${paddedHz}hz.wav`);
  const mp3Path   = path.join(OUT_DIR, `tone_${paddedHz}hz.mp3`);

  // Write WAV
  writeWav(wavPath, hz);
  console.log(`  ✓ ${hz} Hz → tone_${paddedHz}hz.wav`);

  // Convert to MP3 via ffmpeg (must be installed)
  const { execSync } = require('child_process');
  try {
    execSync(
      `ffmpeg -y -i "${wavPath}" -codec:a libmp3lame -qscale:a 4 "${mp3Path}" 2>/dev/null`,
      { stdio: 'pipe' }
    );
    fs.unlinkSync(wavPath); // remove WAV after converting
    console.log(`  ✓ ${hz} Hz → tone_${paddedHz}hz.mp3 ✅`);
  } catch {
    console.warn(`  ⚠ ffmpeg not found — keeping WAV for ${hz} Hz`);
    console.warn(`    Install ffmpeg: brew install ffmpeg`);
  }
}

console.log('\n✅ Done! Tones saved to assets/tones/');
console.log('   Import FrequencyEngine and call frequencyEngine.start(hz, intensity)\n');