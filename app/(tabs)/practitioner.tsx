// =======================================
// SCREEN: Practitioner Mode
// Day 54 — Shared context (bass, volume, frequency)
// Day 62 — Bass presets, correct freq range, FrequencyEngine wired
// Theme: SET Healing — Royal Purple & Sacred Gold
// =======================================

import { useState } from 'react';
import {
  ScrollView, StyleSheet, Text,
  TouchableOpacity, View, useWindowDimensions,
} from 'react-native';

import { usePlayer } from '@/context/PlayerContext';
import {
  FREQUENCY_PRESETS,
  frequencyEngine,
  getClosestPreset,
} from '@/services/FrequencyEngine';
import ControlCard from '../../components/ControlCard';

/* ---------------------------------------
   DESIGN TOKENS
---------------------------------------- */
const C = {
  bg:           '#120828',
  bgCard:       '#1E0A30',
  bgCardDeep:   '#250D3D',
  bgHero:       '#2D0F50',
  goldBright:   '#D4A828',
  goldMid:      '#C8920A',
  textBright:   '#FFFFFF',
  textMid:      '#DDD0FF',
  textMuted:    '#B09ACC',
  textDim:      '#7A60A0',
  borderGold:   'rgba(212, 168, 40, 0.18)',
  borderPurple: 'rgba(180, 140, 255, 0.10)',
  glowGold:     'rgba(212, 168, 40, 0.08)',
  glowPurple:   'rgba(100, 50, 180, 0.15)',
  aurora:       '#7EFFD4',
};

/* ---------------------------------------
   BASS PRESETS (Day 62)
---------------------------------------- */
type BassPreset = {
  id: string; label: string; level: number; rate: number; hint: string;
};

const BASS_PRESETS: BassPreset[] = [
  { id: 'off',     label: 'Off',     level: 0,  rate: 1.0,  hint: 'No bass layer' },
  { id: 'subtle',  label: 'Subtle',  level: 20, rate: 0.92, hint: 'Gentle warmth' },
  { id: 'natural', label: 'Natural', level: 40, rate: 0.88, hint: 'Balanced resonance' },
  { id: 'deep',    label: 'Deep',    level: 65, rate: 0.82, hint: 'Strong immersion' },
  { id: 'intense', label: 'Intense', level: 85, rate: 0.75, hint: 'Maximum depth' },
];

/* ---------------------------------------
   SUB-COMPONENTS
---------------------------------------- */
function SectionLabel({ title }: { title: string }) {
  return (
    <View style={styles.sectionLabelRow}>
      <View style={styles.sectionLabelLine} />
      <Text style={styles.sectionLabelText}>{title}</Text>
      <View style={styles.sectionLabelLine} />
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

/* ---------------------------------------
   MAIN COMPONENT
---------------------------------------- */
export default function PractitionerScreen() {

  const {
    bassLevel,   setBassLevel,
    volume,      setVolume,
    frequency,   setFrequency,
    isPlaying,
  } = usePlayer();

  const [intensity,    setIntensity]    = useState(50);
  const [bassPresetId, setBassPresetId] = useState('natural');
  const [bassRate,     setBassRate]     = useState(0.88);

  // Day 62 — FrequencyEngine in Practitioner
  const [freqEnabled,   setFreqEnabled]   = useState(false);
  const [freqIntensity, setFreqIntensity] = useState(30);

  const { width }  = useWindowDimensions();
  const isTablet   = width >= 768;
  const volumePct  = Math.round(volume * 100);
  const currentPreset = getClosestPreset(frequency);

  const handleVolumeChange = (v: number) => setVolume(v / 100);

  /* ── Bass preset handler ── */
  const handleBassPreset = (preset: BassPreset) => {
    setBassPresetId(preset.id);
    setBassLevel(preset.level);
    setBassRate(preset.rate);
  };

  /* ── Frequency engine handlers ── */
  const handleFreqToggle = async () => {
    const next = !freqEnabled;
    setFreqEnabled(next);
    if (next && isPlaying) await frequencyEngine.start(frequency, freqIntensity);
    else await frequencyEngine.stop();
  };

  const handleFrequencyChange = async (hz: number) => {
    setFrequency(hz);
    if (freqEnabled && isPlaying) await frequencyEngine.setFrequency(hz, freqIntensity);
  };

  const handleFreqIntensityChange = async (v: number) => {
    setFreqIntensity(v);
    if (freqEnabled && isPlaying) await frequencyEngine.setIntensity(v);
  };

  return (
    <ScrollView
      style={{ backgroundColor: C.bg }}
      contentContainerStyle={[styles.container, isTablet && styles.containerTablet]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.proBadgeRow}>
          <View style={styles.proBadgeDot} />
          <Text style={styles.proBadgeText}>Pro Mode</Text>
        </View>
        <Text style={styles.title}>Practitioner</Text>
        <Text style={styles.titleAccent}>Mode</Text>
        <Text style={styles.subtitle}>Advanced frequency and vibration control</Text>
      </View>

      <View style={styles.goldRule} />

      {/* ── Live status card ── */}
      <View style={styles.statusCard}>
        <View style={styles.statusCardGlow} />
        <View style={styles.statusTopRow}>
          <View style={styles.statusActiveDot} />
          <Text style={styles.statusActiveText}>System Active</Text>
          {freqEnabled && (
            <>
              <View style={[styles.statusActiveDot, { backgroundColor: C.aurora, marginLeft: 12 }]} />
              <Text style={[styles.statusActiveText, { color: C.aurora }]}>Engine On</Text>
            </>
          )}
        </View>
        <View style={styles.statusGrid}>
          <InfoRow label="Mode"      value="Practitioner" />
          <View style={styles.statusDivider} />
          <InfoRow label="Intensity" value={`${intensity}%`} />
          <View style={styles.statusDivider} />
          <InfoRow label="Frequency" value={`${frequency} Hz`} />
          <View style={styles.statusDivider} />
          <InfoRow label="Preset"    value={currentPreset.range.toUpperCase()} />
          <View style={styles.statusDivider} />
          <InfoRow label="Bass"      value={`${Math.round(bassLevel)}% · ${bassRate.toFixed(2)}×`} />
          <View style={styles.statusDivider} />
          <InfoRow label="Volume"    value={`${volumePct}%`} />
        </View>
        <Text style={styles.statusHelper}>
          Changes sync instantly with the Player screen.
        </Text>
      </View>

      {/* ── Vibration + Volume controls ── */}
      <SectionLabel title="Output Controls" />
      <View style={[styles.grid, isTablet && styles.gridTablet]}>

        <View style={[styles.controlWrap, isTablet && styles.controlWrapTablet]}>
          <View style={styles.controlCard}>
            <View style={styles.controlCardBar} />
            <View style={styles.controlCardInner}>
              <View style={styles.controlHeaderRow}>
                <View style={styles.controlIconWrap}><Text style={styles.controlIcon}>◈</Text></View>
                <View style={styles.controlHeaderText}>
                  <Text style={styles.controlLabel}>Vibration Intensity</Text>
                  <Text style={styles.controlValueDisplay}>{intensity}%</Text>
                </View>
              </View>
              <Text style={styles.controlDesc}>Controls overall vibration strength.</Text>
              <ControlCard label="" value={intensity} unit="%" onChange={setIntensity} description="" />
            </View>
          </View>
        </View>

        <View style={[styles.controlWrap, isTablet && styles.controlWrapTablet]}>
          <View style={styles.controlCard}>
            <View style={styles.controlCardBar} />
            <View style={styles.controlCardInner}>
              <View style={styles.controlHeaderRow}>
                <View style={styles.controlIconWrap}><Text style={styles.controlIcon}>◆</Text></View>
                <View style={styles.controlHeaderText}>
                  <View style={styles.controlLabelRow}>
                    <Text style={styles.controlLabel}>Volume</Text>
                    <View style={styles.syncBadge}><Text style={styles.syncBadgeText}>Synced</Text></View>
                  </View>
                  <Text style={styles.controlValueDisplay}>{volumePct}%</Text>
                </View>
              </View>
              <Text style={styles.controlDesc}>Master volume. Synced with Player screen.</Text>
              <ControlCard label="" value={volumePct} unit="%" min={0} max={100} onChange={handleVolumeChange} description="" />
            </View>
          </View>
        </View>

      </View>

      {/* ── Day 62 — Bass section ── */}
      <SectionLabel title="Bass Controls" />

      <View style={styles.bassCard}>
        <View style={styles.bassCardBar} />
        <View style={styles.bassCardHeader}>
          <View style={styles.controlHeaderRow}>
            <View style={styles.controlIconWrap}><Text style={styles.controlIcon}>◐</Text></View>
            <View style={styles.controlHeaderText}>
              <View style={styles.controlLabelRow}>
                <Text style={styles.controlLabel}>Bass Level</Text>
                <View style={styles.syncBadge}><Text style={styles.syncBadgeText}>Synced</Text></View>
              </View>
              <Text style={styles.controlValueDisplay}>{Math.round(bassLevel)}%</Text>
            </View>
          </View>
        </View>

        {/* Bass preset chips */}
        <View style={styles.presetRow}>
          {BASS_PRESETS.map((preset) => {
            const active = bassPresetId === preset.id;
            return (
              <TouchableOpacity
                key={preset.id}
                style={[styles.presetChip, active && styles.presetChipActive]}
                onPress={() => handleBassPreset(preset)}
                activeOpacity={0.75}
              >
                <Text style={[styles.presetChipText, active && styles.presetChipTextActive]}>
                  {preset.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={styles.bassHint}>
          {BASS_PRESETS.find((p) => p.id === bassPresetId)?.hint ?? 'Fine-tuned'}
        </Text>

        {/* Fine-tune slider */}
        <View style={styles.sliderBlock}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sliderLabel}>Fine tune</Text>
            <Text style={styles.sliderValue}>{Math.round(bassLevel)}%</Text>
          </View>
          <ControlCard label="" value={Math.round(bassLevel)} unit="%" min={0} max={100} onChange={(v) => { setBassLevel(v); setBassPresetId('custom'); }} description="" />
        </View>

        <View style={styles.sliderDivider} />

        {/* Subharmonic rate */}
        <View style={styles.sliderBlock}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sliderLabel}>Subharmonic rate</Text>
            <Text style={styles.sliderValue}>{bassRate.toFixed(2)}×</Text>
          </View>
          <ControlCard
            label=""
            value={Math.round(bassRate * 100)}
            unit=""
            min={70}
            max={100}
            onChange={(v) => setBassRate(parseFloat((v / 100).toFixed(2)))}
            description=""
          />
          <Text style={styles.bassRateHint}>Lower = deeper pitch · Higher = subtle warmth</Text>
        </View>
      </View>

      {/* ── Day 62 — Frequency Engine in Practitioner ── */}
      <SectionLabel title="Frequency Engine" />

      <View style={styles.freqCard}>
        <View style={styles.freqCardBar} />
        <View style={styles.freqCardHeader}>
          <View>
            <Text style={styles.controlLabel}>Tone Generator</Text>
            <Text style={styles.freqPresetLabel}>{currentPreset.label}</Text>
          </View>
          <TouchableOpacity
            style={[styles.freqToggle, freqEnabled && styles.freqToggleActive]}
            onPress={handleFreqToggle}
            activeOpacity={0.8}
          >
            <Text style={[styles.freqToggleText, freqEnabled && styles.freqToggleTextActive]}>
              {freqEnabled ? 'On' : 'Off'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Frequency slider — Day 62: corrected range 1–963 Hz */}
        <View style={styles.sliderBlock}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sliderLabel}>Frequency</Text>
            <Text style={styles.sliderValue}>{frequency} Hz</Text>
          </View>
          <ControlCard label="" value={frequency} unit="Hz" min={1} max={963} onChange={handleFrequencyChange} description="" />
        </View>

        {/* Brainwave range chips */}
        <View style={styles.presetRow}>
          {['delta', 'theta', 'alpha', 'beta', 'solfeggio'].map((range) => {
            const preset = FREQUENCY_PRESETS.find((p) => p.range === range)!;
            const active = currentPreset.range === range;
            return (
              <TouchableOpacity
                key={range}
                style={[styles.freqChip, active && styles.freqChipActive]}
                onPress={() => handleFrequencyChange(preset.hz)}
                activeOpacity={0.75}
              >
                <Text style={[styles.freqChipText, active && styles.freqChipTextActive]}>
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.sliderDivider} />

        {/* Intensity */}
        <View style={styles.sliderBlock}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sliderLabel}>Tone intensity</Text>
            <Text style={styles.sliderValue}>{freqIntensity}%</Text>
          </View>
          <ControlCard label="" value={freqIntensity} unit="%" min={0} max={100} onChange={handleFreqIntensityChange} description="" />
          <Text style={styles.bassRateHint}>Blends tone with healing audio track</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerLine} />
        <Text style={styles.footerText}>Sound Energy Therapy · Pro</Text>
        <View style={styles.footerLine} />
      </View>

      <View style={{ height: 48 }} />
    </ScrollView>
  );
}

/* ── STYLES ── */
const styles = StyleSheet.create({
  container: { paddingTop: 68, paddingHorizontal: 22, backgroundColor: C.bg },
  containerTablet: { maxWidth: 960, alignSelf: 'center', width: '100%', paddingHorizontal: 32 },

  glowTop:    { position: 'absolute', top: -60, right: -80, width: 260, height: 260, borderRadius: 999, backgroundColor: C.glowGold },
  glowBottom: { position: 'absolute', top: 500, left: -80, width: 200, height: 200, borderRadius: 999, backgroundColor: C.glowPurple },

  header: { alignItems: 'center', marginBottom: 20 },
  proBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 14, backgroundColor: 'rgba(212,168,40,0.08)', borderWidth: 1, borderColor: C.borderGold, borderRadius: 99, paddingVertical: 6, paddingHorizontal: 16 },
  proBadgeDot: { width: 5, height: 5, borderRadius: 999, backgroundColor: C.goldBright },
  proBadgeText: { fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: C.goldBright, fontWeight: '600' },
  title:       { fontSize: 40, fontWeight: '800', color: C.textBright, letterSpacing: -1, lineHeight: 42 },
  titleAccent: { fontSize: 40, fontWeight: '300', color: C.goldBright, letterSpacing: 6, textTransform: 'uppercase', lineHeight: 44, marginBottom: 12 },
  subtitle:    { fontSize: 13, color: C.textMid, textAlign: 'center', fontWeight: '300', lineHeight: 20 },

  goldRule: { height: 1, backgroundColor: C.borderGold, marginVertical: 20, marginHorizontal: 20 },

  statusCard:     { backgroundColor: C.bgHero, borderRadius: 24, padding: 24, marginBottom: 28, borderWidth: 1, borderColor: C.borderGold, overflow: 'hidden' },
  statusCardGlow: { position: 'absolute', top: -50, right: -50, width: 160, height: 160, borderRadius: 999, backgroundColor: 'rgba(212,168,40,0.07)' },
  statusTopRow:   { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 18 },
  statusActiveDot:{ width: 7, height: 7, borderRadius: 999, backgroundColor: C.aurora },
  statusActiveText:{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: C.aurora, fontWeight: '500' },
  statusGrid:     { borderRadius: 14, borderWidth: 1, borderColor: C.borderGold, overflow: 'hidden', marginBottom: 16 },
  statusDivider:  { height: 1, backgroundColor: C.borderGold },
  infoRow:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, backgroundColor: C.bgCardDeep },
  infoLabel:      { fontSize: 11, color: C.textMuted, letterSpacing: 2, textTransform: 'uppercase', fontWeight: '400' },
  infoValue:      { fontSize: 14, color: C.goldBright, fontWeight: '700', letterSpacing: 0.5 },
  statusHelper:   { fontSize: 12, color: C.textMuted, lineHeight: 19, fontWeight: '300' },

  sectionLabelRow:  { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  sectionLabelLine: { flex: 1, height: 1, backgroundColor: C.borderPurple },
  sectionLabelText: { fontSize: 9, letterSpacing: 5, textTransform: 'uppercase', color: C.textMuted, fontWeight: '400' },

  grid:             { flexDirection: 'column', gap: 14, marginBottom: 28 },
  gridTablet:       { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  controlWrap:      { width: '100%' },
  controlWrapTablet:{ width: '48%', marginBottom: 16 },

  controlCard:       { backgroundColor: C.bgCardDeep, borderRadius: 20, borderWidth: 1, borderColor: C.borderGold, overflow: 'hidden' },
  controlCardBar:    { height: 2, backgroundColor: C.goldBright, opacity: 0.5 },
  controlCardInner:  { padding: 20 },
  controlHeaderRow:  { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 10 },
  controlIconWrap:   { width: 44, height: 44, borderRadius: 999, backgroundColor: C.bgHero, borderWidth: 1, borderColor: C.borderGold, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  controlIcon:       { fontSize: 18, color: C.goldBright },
  controlHeaderText: { flex: 1 },
  controlLabelRow:   { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  controlLabel:      { fontSize: 14, fontWeight: '700', color: C.textBright },
  controlValueDisplay:{ fontSize: 20, fontWeight: '700', color: C.goldBright, letterSpacing: 0.3 },
  controlDesc:       { fontSize: 12, color: C.textMid, fontWeight: '300', lineHeight: 18, marginBottom: 14 },
  syncBadge:         { backgroundColor: 'rgba(126,255,212,0.08)', borderWidth: 1, borderColor: 'rgba(126,255,212,0.2)', borderRadius: 99, paddingHorizontal: 7, paddingVertical: 2 },
  syncBadgeText:     { fontSize: 8, color: C.aurora, letterSpacing: 1, fontWeight: '600' },

  // Bass card
  bassCard:       { backgroundColor: C.bgCardDeep, borderRadius: 20, borderWidth: 1, borderColor: C.borderGold, overflow: 'hidden', marginBottom: 28 },
  bassCardBar:    { height: 2, backgroundColor: C.goldBright, opacity: 0.5 },
  bassCardHeader: { padding: 20, paddingBottom: 8 },
  bassHint:       { fontSize: 11, color: C.textDim, fontWeight: '300', paddingHorizontal: 20, marginBottom: 4, lineHeight: 16 },
  bassRateHint:   { fontSize: 11, color: C.textDim, fontWeight: '300', lineHeight: 16, marginTop: 6 },

  presetRow:            { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 20, paddingBottom: 8 },
  presetChip:           { backgroundColor: C.bgHero, borderWidth: 1, borderColor: C.borderPurple, borderRadius: 99, paddingVertical: 7, paddingHorizontal: 14 },
  presetChipActive:     { backgroundColor: 'rgba(212,168,40,0.10)', borderColor: C.borderGold },
  presetChipText:       { fontSize: 11, color: C.textDim, fontWeight: '500', letterSpacing: 0.5 },
  presetChipTextActive: { color: C.goldBright },

  sliderBlock:   { padding: 20, paddingTop: 12 },
  sliderDivider: { height: 1, backgroundColor: C.borderGold },
  sliderHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sliderLabel:   { fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.textMuted, fontWeight: '400' },
  sliderValue:   { fontSize: 13, color: C.goldBright, fontWeight: '600', letterSpacing: 1 },

  // Frequency engine card
  freqCard:             { backgroundColor: C.bgCardDeep, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(126,255,212,0.2)', overflow: 'hidden', marginBottom: 28 },
  freqCardBar:          { height: 2, backgroundColor: C.aurora, opacity: 0.5 },
  freqCardHeader:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingBottom: 8 },
  freqPresetLabel:      { fontSize: 11, color: C.aurora, fontWeight: '400', marginTop: 4 },
  freqToggle:           { backgroundColor: C.bgHero, borderWidth: 1, borderColor: C.borderPurple, borderRadius: 99, paddingVertical: 7, paddingHorizontal: 16 },
  freqToggleActive:     { backgroundColor: 'rgba(126,255,212,0.10)', borderColor: 'rgba(126,255,212,0.3)' },
  freqToggleText:       { fontSize: 11, color: C.textDim, fontWeight: '600', letterSpacing: 1 },
  freqToggleTextActive: { color: C.aurora },
  freqChip:             { backgroundColor: C.bgHero, borderWidth: 1, borderColor: C.borderPurple, borderRadius: 99, paddingVertical: 6, paddingHorizontal: 12 },
  freqChipActive:       { backgroundColor: 'rgba(126,255,212,0.08)', borderColor: 'rgba(126,255,212,0.3)' },
  freqChipText:         { fontSize: 10, color: C.textDim, fontWeight: '500', letterSpacing: 1 },
  freqChipTextActive:   { color: C.aurora },

  footer:     { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8, marginHorizontal: 20 },
  footerLine: { flex: 1, height: 1, backgroundColor: C.borderPurple },
  footerText: { fontSize: 9, color: C.textDim, letterSpacing: 3, textTransform: 'uppercase', fontWeight: '300' },
});