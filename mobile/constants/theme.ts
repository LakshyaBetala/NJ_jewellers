/**
 * NJ Jewellers — Dark Luxury Minimal Theme
 * Design tokens for the entire app
 */

export const Colors = {
  // Core backgrounds
  bgPrimary: '#0D0708',
  bgSecondary: '#110A0C',
  bgTertiary: '#0A0708',
  bgCard: 'rgba(255,255,255,0.025)',
  bgCardBorder: 'rgba(255,255,255,0.04)',

  // Brand
  maroon: '#7B1F1F',
  maroonLight: '#8B2525',
  maroonDark: '#6B1A1A',
  maroonSubtle: 'rgba(123,31,31,0.12)',

  // Gold accents
  gold: '#D4AF37',
  goldLight: '#E5C76B',
  goldMuted: '#C4956A',
  goldSubtle: 'rgba(212,175,55,0.08)',
  goldBorder: 'rgba(212,175,55,0.1)',
  goldGlow: 'rgba(212,175,55,0.15)',

  // Silver accents
  silver: '#C0C0C0',
  silverMuted: 'rgba(192,192,192,0.9)',

  // Text
  textPrimary: 'rgba(255,255,255,0.85)',
  textSecondary: 'rgba(255,255,255,0.45)',
  textTertiary: 'rgba(255,255,255,0.3)',
  textMuted: 'rgba(255,255,255,0.18)',

  // Status
  positive: '#5CB85C',
  positiveBg: 'rgba(92,184,92,0.08)',
  negative: '#E74C3C',
  negativeBg: 'rgba(231,76,60,0.08)',

  // UI
  divider: 'rgba(255,255,255,0.04)',
  cardShadow: 'rgba(0,0,0,0.3)',
  white: '#FFFFFF',
  black: '#000000',
} as const;

/** Font family names (from @expo-google-fonts packages) */
export const Fonts = {
  display: 'PlayfairDisplay_700Bold',
  displayRegular: 'PlayfairDisplay_400Regular',
  displaySemiBold: 'PlayfairDisplay_600SemiBold',
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodySemiBold: 'DMSans_600SemiBold',
  bodyBold: 'DMSans_700Bold',
} as const;

/** Font size scale */
export const FontSizes = {
  heroPrice: 38,
  sectionPrice: 18,
  cardTitle: 16,
  bodyLarge: 14,
  body: 13,
  bodySmall: 12,
  caption: 11,
  micro: 10,
  nano: 9,
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 14,
  xl: 18,
  xxl: 20,
  pill: 100,
} as const;
