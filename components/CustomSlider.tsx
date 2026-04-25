// =======================================
// COMPONENT: CustomSlider
// Day 59 — UI polish, dark theme applied
// =======================================

import Slider from '@react-native-community/slider';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const C = {
  bgCard:      '#250D3D',
  goldBright:  '#D4A828',
  textBright:  '#FFFFFF',
  textMuted:   '#B09ACC',
  textDim:     '#7A60A0',
  borderGold:  'rgba(212, 168, 40, 0.18)',
  trackFill:   '#D4A828',
  trackEmpty:  'rgba(180, 140, 255, 0.15)',
};

type CustomSliderProps = {
  label: string;
  value: number;
  onChange: (v: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  unit?: string;
  onSlidingStart?: () => void;
  onSlidingComplete?: (v: number) => void;
};

export default function CustomSlider({
  label,
  value,
  onChange,
  minimumValue = 0,
  maximumValue = 1,
  step = 0.01,
  unit = '',
  onSlidingStart,
  onSlidingComplete,
}: CustomSliderProps) {

  // Display value — handles % scale and raw values
  const displayValue =
    unit === '%'
      ? `${Math.round(value * 100)}%`
      : unit
      ? `${value}${unit}`
      : `${Math.round(value * 100)}`;

  return (
    <View style={styles.container}>
      {/* Label + value row — only shown when label is provided */}
      {label ? (
        <View style={styles.header}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>{displayValue}</Text>
        </View>
      ) : null}

      <Slider
        style={styles.slider}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        value={value}
        onValueChange={onChange}
        onSlidingStart={onSlidingStart}
        onSlidingComplete={onSlidingComplete}
        minimumTrackTintColor={C.trackFill}
        maximumTrackTintColor={C.trackEmpty}
        thumbTintColor={C.goldBright}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 10,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: C.textMuted,
    fontWeight: '400',
  },
  value: {
    fontSize: 12,
    color: C.goldBright,
    fontWeight: '600',
    letterSpacing: 1,
  },
  slider: {
    width: '100%',
    height: 40,
  },
});