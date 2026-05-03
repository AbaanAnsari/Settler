import { useColorScheme, type ColorSchemeName } from 'react-native';

export const DarkColors = {
  // Backgrounds
  background: '#0D0D14',
  surface: '#16161F',
  surfaceElevated: '#1E1E2C',
  surfaceBorder: '#2A2A3C',

  // Accent
  accent: '#7C6FF7',
  accentLight: '#A89DF9',
  accentDark: '#5A52D5',

  // Semantic
  positive: '#34D399',
  positiveLight: '#6EE7B7',
  positiveBg: 'rgba(52, 211, 153, 0.12)',
  negative: '#F87171',
  negativeLight: '#FCA5A5',
  negativeBg: 'rgba(248, 113, 113, 0.12)',
  warning: '#FBBF24',

  // Text
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textInverse: '#0D0D14',

  // UI
  border: '#1E2A38',
  separator: '#1A1A28',
  icon: '#94A3B8',
  iconActive: '#7C6FF7',
  overlay: 'rgba(0,0,0,0.6)',

  // Tab bar
  tabBar: '#111118',
  tabBarBorder: '#1E1E2C',
} as const;

export const LightColors = {
  // Backgrounds
  background: '#F7F8FC',
  surface: '#FFFFFF',
  surfaceElevated: '#F1F3F9',
  surfaceBorder: '#DDE3EE',

  // Accent
  accent: '#6D5DF6',
  accentLight: '#7C6FF7',
  accentDark: '#5146C8',

  // Semantic
  positive: '#059669',
  positiveLight: '#10B981',
  positiveBg: 'rgba(5, 150, 105, 0.12)',
  negative: '#DC2626',
  negativeLight: '#EF4444',
  negativeBg: 'rgba(220, 38, 38, 0.12)',
  warning: '#D97706',

  // Text
  text: '#111827',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',

  // UI
  border: '#DDE3EE',
  separator: '#E5EAF3',
  icon: '#64748B',
  iconActive: '#6D5DF6',
  overlay: 'rgba(15,23,42,0.36)',

  // Tab bar
  tabBar: '#FFFFFF',
  tabBarBorder: '#E5EAF3',
} as const;

export type ThemeColors = Record<keyof typeof DarkColors, string>;

export const Colors = DarkColors;

export function getThemeColors(colorScheme: ColorSchemeName): ThemeColors {
  return colorScheme === 'light' ? LightColors : DarkColors;
}

export function useThemeColors(): ThemeColors {
  return getThemeColors(useColorScheme());
}

export function useThemeName(): 'light' | 'dark' {
  return useColorScheme() === 'light' ? 'light' : 'dark';
}

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 26,
  xxxl: 34,
} as const;

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};
