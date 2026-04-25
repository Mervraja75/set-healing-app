// =======================================
// COMPONENT: BackButton
// Day 59 — UI polish, dark theme applied
// =======================================

import { Link, LinkProps, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const C = {
  goldBright:   '#D4A828',
  textMuted:    '#B09ACC',
  borderGold:   'rgba(212, 168, 40, 0.18)',
  bgCard:       'rgba(37, 13, 61, 0.8)',
};

type Props = {
  to?: LinkProps['href'];
  label?: string;
  compact?: boolean;
};

export default function BackButton({ to, label = 'Back', compact = false }: Props) {
  const router = useRouter();

  const buttonStyle = [styles.button, compact && styles.compact];

  const content = (
    <Text style={styles.text}>‹  {label}</Text>
  );

  if (to) {
    return (
      <Link href={to} asChild>
        <TouchableOpacity style={buttonStyle} activeOpacity={0.75}>
          {content}
        </TouchableOpacity>
      </Link>
    );
  }

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={() => router.back()}
      activeOpacity={0.75}
    >
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 99,
    backgroundColor: C.bgCard,
    borderWidth: 1,
    borderColor: C.borderGold,
  },
  compact: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  text: {
    color: C.goldBright,
    fontWeight: '500',
    fontSize: 14,
    letterSpacing: 0.5,
  },
});