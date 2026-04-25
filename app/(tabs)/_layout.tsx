// =======================================
// LAYOUT: Tabs (app/(tabs)/_layout.tsx)
// Purpose: Bottom tab navigation
// Theme: SET Healing — Royal Purple & Sacred Gold
// =======================================

/* ---------------------------------------
   SECTION A — Imports
---------------------------------------- */
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';

/* ---------------------------------------
   DESIGN TOKENS — match all screens
---------------------------------------- */
const C = {
  bg:          '#120828',
  tabBar:      '#1A0A2E',
  tabBorder:   'rgba(212, 168, 40, 0.15)',
  active:      '#D4A828',   // gold — active tab
  inactive:    '#4A2A6A',   // dim purple — inactive tab
};

/* ---------------------------------------
   SECTION B — Tab Layout Component
---------------------------------------- */
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        // ── Tab bar container ──
        tabBarStyle: {
          backgroundColor: C.tabBar,
          borderTopWidth: 1,
          borderTopColor: C.tabBorder,
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingBottom: Platform.OS === 'ios' ? 24 : 10,
          paddingTop: 10,
          elevation: 0,
          shadowOpacity: 0,
        },

        // ── Label styling ──
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          letterSpacing: 0.5,
          marginTop: 2,
        },

        // ── Colors ──
        tabBarActiveTintColor:   C.active,
        tabBarInactiveTintColor: C.inactive,

        // ── Active indicator (hide default background pill) ──
        tabBarActiveBackgroundColor:   'transparent',
        tabBarInactiveBackgroundColor: 'transparent',
      }}
    >

      {/* ── Profile ── */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="person.fill" size={22} color={color} />
          ),
        }}
      />

      {/* ── Home ── */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="house.fill" size={24} color={color} />
          ),
        }}
      />

      {/* ── Healing ── */}
      <Tabs.Screen
        name="healing"
        options={{
          title: 'Healing',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="waveform.path.ecg" size={24} color={color} />
          ),
        }}
      />

      {/* ── Practitioner / Pro Mode ── */}
      <Tabs.Screen
        name="practitioner"
        options={{
          title: 'Pro Mode',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="waveform.path.ecg" size={24} color={color} />
          ),
        }}
      />

    </Tabs>
  );
}