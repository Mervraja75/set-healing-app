// =======================================
// LAYOUT: Tabs (app/(tabs)/_layout.tsx)
// Purpose: Bottom tab navigation
// Theme: SET Healing — Royal Purple & Sacred Gold
// =======================================

/* ---------------------------------------
   SECTION A — Imports
---------------------------------------- */
import { Tabs } from 'expo-router';
import { GOLD, goldAlpha } from '@/constants/Colors';
import { Platform } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';

/* ---------------------------------------
   DESIGN TOKENS — match all screens
---------------------------------------- */
const C = {
  bg:        '#0A0616',
  tabBar:    '#1A0A2E',
  tabBorder: goldAlpha(0.15),
  active:    GOLD,   // gold — active tab
  inactive:  '#4A2A6A',   // dim purple — inactive tab
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

      {/* ── Home ── */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <IconSymbol name="house.fill" size={24} color={color} />
          ),
        }}
      />

      {/* ── Explore ── */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => (
            <IconSymbol name="square.grid.2x2.fill" size={22} color={color} />
          ),
        }}
      />

      {/* ── Profile ── */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <IconSymbol name="person.fill" size={22} color={color} />
          ),
        }}
      />

      {/* ── Hidden screens — navigable but not in tab bar ── */}
      <Tabs.Screen name="healing"       options={{ href: null }} />
      <Tabs.Screen name="practitioner"  options={{ href: null }} />
      <Tabs.Screen name="meditations"   options={{ href: null }} />
      <Tabs.Screen name="breathwork"    options={{ href: null }} />
      <Tabs.Screen name="chakras"       options={{ href: null }} />
      <Tabs.Screen name="affirmations"  options={{ href: null }} />
      <Tabs.Screen name="healing-music" options={{ href: null }} />
      <Tabs.Screen name="elements"      options={{ href: null }} />

    </Tabs>
  );
}
