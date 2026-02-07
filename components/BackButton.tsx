// =======================================
// COMPONENT: BackButton
// Purpose: Reusable back navigation button
// Supports typed routes via expo-router
// =======================================

/* ---------------------------------------
   SECTION A — Imports
---------------------------------------- */
import { Link, LinkProps, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

/* ---------------------------------------
   SECTION B — Props / Types
   ✅ Add new props here later:
   - iconOnly?: boolean
   - color override
   - disabled?: boolean
---------------------------------------- */
type Props = {
  to?: LinkProps['href']; // typed to match expo-router accepted href shapes
  label?: string;
  compact?: boolean;
};

/* ---------------------------------------
   SECTION C — Component
---------------------------------------- */
export default function BackButton({
  to,
  label = 'Back',
  compact = false,
}: Props) {

  /* -------------------------------------
     SECTION C1 — Navigation hooks
     ---------------------------------- */
  const router = useRouter();

  /* -------------------------------------
     SECTION C2 — Navigation behavior
     If `to` is provided → Link navigation
     Otherwise → router.back()
  -------------------------------------- */
  if (to) {
    return (
      <Link href={to} asChild>
        <TouchableOpacity
          style={[styles.button, compact && styles.compact]}
          activeOpacity={0.8}
        >
          <Text style={styles.text}>‹ {label}</Text>
        </TouchableOpacity>
      </Link>
    );
  }

  /* -------------------------------------
     SECTION C3 — Default back behavior
  -------------------------------------- */
  return (
    <TouchableOpacity
      style={[styles.button, compact && styles.compact]}
      onPress={() => router.back()}
      activeOpacity={0.8}
    >
      <Text style={styles.text}>‹ {label}</Text>
    </TouchableOpacity>
  );
}

/* ---------------------------------------
   SECTION D — Styles
   ✅ Adjust spacing, colors, fonts here
---------------------------------------- */
const styles = StyleSheet.create({
  button: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
  },

  compact: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },

  text: {
    color: '#5A189A',
    fontWeight: '600',
    fontSize: 16,
  },
});