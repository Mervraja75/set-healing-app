import Slider from '@react-native-community/slider';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type CustomSliderProps = {
  label: string;
  value: number;
  onChange: (v: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  unit?: string;
};

export default function CustomSlider({
  label,
  value,
  onChange,
  minimumValue = 0,
  maximumValue = 1,
  step = 0.01,
  unit = '',
}: CustomSliderProps) {
  const displayValue =
    unit === '%'
      ? `${Math.round(value * 100)}%`
      : `${value}${unit}`;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{displayValue}</Text>
      </View>

      <Slider
        style={styles.slider}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor="#5A189A"
        maximumTrackTintColor="#DDD"
        thumbTintColor="#5A189A"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E6DCF7',
    marginBottom: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#5A189A',
    fontWeight: '600',
  },
  value: {
    fontSize: 13,
    color: '#777',
    fontWeight: '600',
  },
  slider: {
    width: '100%',
    height: 40,
  },
});