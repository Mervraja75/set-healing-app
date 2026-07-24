// =======================================
// SET Healing — Shared brand color tokens
// =======================================

/** Brand gold ("Rich Gold") — single source of truth for gold across the app. */
export const GOLD = '#D7882A';

/** Brand gold at a given opacity, e.g. for borders/glows. */
export function goldAlpha(opacity: number): string {
  return `rgba(215, 136, 42, ${opacity})`;
}
