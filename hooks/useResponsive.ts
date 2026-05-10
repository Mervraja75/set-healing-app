// =======================================
// HOOK: useResponsive
// Day 72 — Shared responsive layout values
// =======================================

import { Platform, useWindowDimensions } from 'react-native';

export type ResponsiveSpacing = {
  horizontal:   number;
  cardMaxWidth: number;
};

export type ResponsiveValues = {
  isPhone:          boolean;
  isTablet:         boolean;
  isIPad:           boolean;
  isLandscape:      boolean;
  isTabletLandscape: boolean;
  isTabletPortrait:  boolean;
  columns:          number;
  spacing:          ResponsiveSpacing;
};

export function useResponsive(): ResponsiveValues {
  const { width, height } = useWindowDimensions();

  const isTablet          = width >= 768;
  const isPhone           = !isTablet;
  const isIPad            = Platform.OS === 'ios' && (Platform as any).isPad === true;
  const isLandscape       = width >= height;
  const isTabletLandscape = isTablet && isLandscape;
  const isTabletPortrait  = isTablet && height > width;

  // Grid column count for list/card layouts
  const columns = isTabletLandscape ? 3 : isTablet || isLandscape ? 2 : 1;

  // Common spacing values consumed by screen-level styles
  const spacing: ResponsiveSpacing = {
    horizontal:   isTabletLandscape ? 40 : isTabletPortrait ? 60 : 22,
    cardMaxWidth: isTabletLandscape ? 2000 : isTabletPortrait ? 520 : 340,
  };

  return {
    isPhone,
    isTablet,
    isIPad,
    isLandscape,
    isTabletLandscape,
    isTabletPortrait,
    columns,
    spacing,
  };
}
