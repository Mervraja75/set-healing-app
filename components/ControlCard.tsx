// =======================================
// COMPONENT: ControlCard
// Day 59 — UI polish, dark theme applied
// =======================================

import Slider from '@react-native-community/slider';
import { StyleSheet, Text, View } from 'react-native';

const C = {
  bg:          '#120828',
  bgCardDeep:  '#250D3D',
  bgHero:      '#2D0F50',
  goldBright:  '#D4A828',
  textBright:  '#FFFFFF',
  textMid:     '#DDD0FF',
  textMuted:   '#B09ACC',
  textDim:     '#7A60A0',
  borderGold:  'rgba(212, 168, 40, 0.18)',
  trackFill:   '#D4A828',
  trackEmpty:  'rgba(180, 140, 255, 0.15)',
};

type Props = {
  label: string;
  value: number;
  unit?: string;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  description?: string;
};

export default function ControlCard({
  label,
  value,
  unit = '',
  onChange,
  min = 0,
  max = 100,
  description,
}: Props) {

  const displayValue = unit ? `${Math.round(value)} ${unit}` : `${Math.round(value)}`;

  return (
    <View style={styles.card}>
      {/* Label + live value */}
      {label ? (
        <View style={styles.header}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.valueDisplay}>{displayValue}</Text>
        </View>
      ) : null}

      {/* Slider */}
      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        step={1}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor={C.trackFill}
        maximumTrackTintColor={C.trackEmpty}
        thumbTintColor={C.goldBright}
      />

      {/* Optional helper text */}
      {description ? (
        <Text style={styles.helper}>{description}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
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
  valueDisplay: {
    fontSize: 13,
    color: C.goldBright,
    fontWeight: '600',
    letterSpacing: 1,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  helper: {
    fontSize: 11,
    color: C.textDim,
    fontWeight: '300',
    lineHeight: 16,
    marginTop: 4,
  },
});