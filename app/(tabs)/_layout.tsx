// =======================================
// LAYOUT: Tabs (_layout.tsx)
// Purpose: Bottom tab navigation
// Tabs: Profile | Home | Healing
// =======================================

/* ---------------------------------------
   SECTION A — Imports
---------------------------------------- */
import { Tabs } from 'expo-router';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/* ---------------------------------------
   SECTION B — Tab Layout Component
---------------------------------------- */
export default function TabLayout() {

  /* -------------------------------------
     SECTION B1 — Hooks
     ---------------------------------- */
  const colorScheme = useColorScheme();

  /* -------------------------------------
     SECTION B2 — Tabs container
     ---------------------------------- */
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      }}
    >

      {/* ---------------------------------
         SECTION C — Profile Tab
         --------------------------------- */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <IconSymbol name="person.fill" size={24} color={color} />
          ),
        }}
      />

      {/* ---------------------------------
         SECTION D — Home Tab
         --------------------------------- */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <IconSymbol name="house.fill" size={28} color={color} />
          ),
        }}
      />

      {/* ---------------------------------
         SECTION E — Healing Tab
         --------------------------------- */}
      <Tabs.Screen
        name="healing"
        options={{
          title: 'Healing',
          tabBarIcon: ({ color }) => (
            <IconSymbol name="waveform.path.ecg" size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}