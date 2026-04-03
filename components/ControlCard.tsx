// =======================================
// COMPONENT: ControlCard
// Purpose: Reusable slider control
// =======================================

import Slider from '@react-native-community/slider';
import { StyleSheet, Text, View } from 'react-native';


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
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>
        {value} {unit}
      </Text>

      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        step={1}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor="#5A189A"
        maximumTrackTintColor="#E6DCF7"
        thumbTintColor="#5A189A"
      />

      {description && <Text style={styles.helper}>{description}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E6DCF7',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#5A189A',
    marginBottom: 6,
    fontWeight: '600',
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3A0CA3',
    marginBottom: 12,
  },
  helper: {
    fontSize: 13,
    color: '#666',
    marginTop: 6,
  },
  slider: {
    width: '100%',
    height: 40,
  },
});