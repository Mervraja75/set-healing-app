// =======================================
// SCREEN: Practitioner Mode
// Purpose: Advanced healing controls
// Day 51 structure
// =======================================

import { useState } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import ControlCard from '../../components/ControlCard';

export default function PractitionerScreen() {
  const [intensity, setIntensity] = useState(50);
  const [frequency, setFrequency] = useState(440);
  const [bass, setBass] = useState(30);

  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <View style={styles.screen}>
      <View style={[styles.content, isTablet && styles.contentTablet]}>
        <Text style={styles.title}>Practitioner Mode</Text>
        <Text style={styles.subtitle}>Advanced healing controls</Text>

        <View style={[styles.grid, isTablet && styles.gridTablet]}>
          <View style={[styles.cardWrap, isTablet && styles.cardWrapTablet]}>
            <ControlCard
              label="Vibration Intensity"
              value={intensity}
              unit="%"
              onChange={setIntensity}
              description="Controls overall vibration strength."
            />
          </View>

          <View style={[styles.cardWrap, isTablet && styles.cardWrapTablet]}>
            <ControlCard
              label="Frequency"
              value={frequency}
              unit="Hz"
              min={100}
              max={1000}
              onChange={setFrequency}
              description="Adjusts the tone frequency."
            />
          </View>

          <View style={[styles.cardWrap, isTablet && styles.cardWrapTablet]}>
            <ControlCard
              label="Bass Level"
              value={bass}
              unit="%"
              onChange={setBass}
              description="Controls deep low-frequency output."
            />
          </View>

          <View style={[styles.infoCard, isTablet && styles.cardWrapTablet]}>
            <Text style={styles.label}>Mode</Text>
            <Text style={styles.value}>Practitioner</Text>
            <Text style={styles.helper}>
              Designed for advanced frequency and vibration control.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8F6FF',
  },
  content: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 24,
  },
  contentTablet: {
    maxWidth: 960,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3A0CA3',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'column',
  },
  gridTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrap: {
    width: '100%',
    marginBottom: 16,
  },
  cardWrapTablet: {
    width: '48%',
  },
  infoCard: {
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
    lineHeight: 18,
  },
});