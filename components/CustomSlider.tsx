/* =======================================
   CustomSlider Component
   Reusable labeled slider card for UI
   ======================================= */

/* ---------------------------------------
   SECTION 1 — Imports
---------------------------------------- */
import Slider from '@react-native-community/slider';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

/* ---------------------------------------
   SECTION 2 — Types / Props
   ✅ Add new props here later:
   - disabled?: boolean
   - color overrides
   - onSlidingStart / onSlidingComplete
---------------------------------------- */
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

/* ---------------------------------------
   SECTION 3 — Component
---------------------------------------- */
export default function CustomSlider({
  label,
  value,
  onChange,
  minimumValue = 0,
  maximumValue = 1,
  step = 0.01,
  unit = '',
  onSlidingStart,
  onSlidingComplete
}: CustomSliderProps) {
  /* -------------------------------------
     SECTION 3A — Derived display value
     ✅ If you want different formats, edit here
     Example:
     - show decimals
     - show "Low/Med/High"
  -------------------------------------- */
  const displayValue =
    unit === '%'
      ? `${Math.round(value * 100)}%`
      : `${value}${unit}`;

  /* -------------------------------------
     SECTION 3B — UI Layout
     ✅ Add extra UI elements here later:
     - icon
     - helper text
     - "Reset" button
  -------------------------------------- */
  return (
    <View style={styles.container}>
      {/* Header row: label + value */}
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{displayValue}</Text>
      </View>

      {/* Slider control */}
      <Slider
        style={styles.slider}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        value={value}
        onValueChange={onChange}
        onSlidingStart={onSlidingStart}
        onSlidingComplete={onSlidingComplete}
        minimumTrackTintColor="#5A189A"
        maximumTrackTintColor="#E6DCF7"
        thumbTintColor="#5A189A"
      />
    </View>
  );
}

/* ---------------------------------------
   SECTION 4 — Styles
   ✅ Add new styles here when component grows
---------------------------------------- */
const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,

    // Softer card style
    borderWidth: 1,
    borderColor: '#E6DCF7',

    // Subtle elevation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  label: {
    fontSize: 14,
    color: '#3A0CA3',
    fontWeight: '600',
  },

  value: {
    fontSize: 13,
    color: '#6D5BD0',
    fontWeight: '600',
  },

  slider: {
    width: '100%',
    height: 40,
  },
});