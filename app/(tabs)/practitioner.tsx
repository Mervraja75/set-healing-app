// =======================================
// SCREEN: Practitioner Mode
// Purpose: Advanced healing controls
// Day 45 → Day 50 COMPLETE
// =======================================

import Slider from '@react-native-community/slider';
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

export default function PractitionerScreen() {
  /* -------------------------------------
     SECTION A — State
  -------------------------------------- */
  const [intensity, setIntensity] = useState(50);
  const [frequency, setFrequency] = useState(440);
  const [bass, setBass] = useState(30);

  /* -------------------------------------
     SECTION B — Responsive layout
  -------------------------------------- */
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const isIPad = width >= 834;

  /* -------------------------------------
     SECTION C — UI
  -------------------------------------- */
  return (
    <View style={styles.screen}>
      <View
        style={[
          styles.content,
          isTablet && styles.contentTablet,
          isIPad && styles.contentIPad,
        ]}
      >
        <Text style={[styles.title, isIPad && styles.titleIPad]}>
          Practitioner Mode
        </Text>

        <Text style={[styles.subtitle, isIPad && styles.subtitleIPad]}>
          Advanced healing controls
        </Text>

        <View
          style={[
            styles.grid,
            isTablet && styles.gridTablet,
            isIPad && styles.gridIPad,
          ]}
        >
          {/* INTENSITY */}
          <View style={[styles.card, isTablet && styles.cardTablet, isIPad && styles.cardIPad]}>
            <Text style={styles.label}>Vibration Intensity</Text>
            <Text style={styles.value}>{intensity}%</Text>

            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              step={1}
              value={intensity}
              onValueChange={setIntensity}
              minimumTrackTintColor="#5A189A"
              maximumTrackTintColor="#E6DCF7"
              thumbTintColor="#5A189A"
            />

            <Text style={styles.helper}>
              Controls overall vibration strength.
            </Text>
          </View>

          {/* FREQUENCY */}
          <View style={[styles.card, isTablet && styles.cardTablet, isIPad && styles.cardIPad]}>
            <Text style={styles.label}>Frequency</Text>
            <Text style={styles.value}>{frequency} Hz</Text>

            <Slider
              style={styles.slider}
              minimumValue={100}
              maximumValue={1000}
              step={1}
              value={frequency}
              onValueChange={setFrequency}
              minimumTrackTintColor="#5A189A"
              maximumTrackTintColor="#E6DCF7"
              thumbTintColor="#5A189A"
            />

            <Text style={styles.helper}>
              Adjusts the tone frequency of the audio.
            </Text>
          </View>

          {/* BASS */}
          <View style={[styles.card, isTablet && styles.cardTablet, isIPad && styles.cardIPad]}>
            <Text style={styles.label}>Bass Level</Text>
            <Text style={styles.value}>{bass}%</Text>

            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              step={1}
              value={bass}
              onValueChange={setBass}
              minimumTrackTintColor="#5A189A"
              maximumTrackTintColor="#E6DCF7"
              thumbTintColor="#5A189A"
            />

            <Text style={styles.helper}>
              Controls deep low-frequency output.
            </Text>
          </View>

          {/* MODE INFO */}
          <View style={[styles.card, isTablet && styles.cardTablet, isIPad && styles.cardIPad]}>
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

/* ---------------------------------------
   SECTION D — Styles
---------------------------------------- */
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
    paddingHorizontal: 32,
  },

  contentIPad: {
    maxWidth: 1080,
    paddingTop: 88,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3A0CA3',
    marginBottom: 6,
    textAlign: 'center',
  },

  titleIPad: {
    fontSize: 32,
  },

  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },

  subtitleIPad: {
    fontSize: 15,
    marginBottom: 36,
  },

  grid: {
    flexDirection: 'column',
  },

  gridTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  gridIPad: {
    gap: 16,
  },

  card: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E6DCF7',
    marginBottom: 16,
    width: '100%',
  },

  cardTablet: {
    width: '48%',
    minHeight: 170,
  },

  cardIPad: {
    width: '47%',
    minHeight: 180,
    padding: 22,
    borderRadius: 16,
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
    marginTop: 4,
  },

  slider: {
    width: '100%',
    height: 40,
  },
});