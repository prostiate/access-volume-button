import {
  MD3DarkTheme,
  MD3LightTheme,
  configureFonts,
} from 'react-native-paper';

// Spacing system (4dp grid)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// Animation durations (ms)
export const animations = {
  fast: 200,
  normal: 300,
  slow: 500,
} as const;

// Border radius
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

// Elevation levels
export const elevation = {
  none: 0,
  low: 1,
  medium: 3,
  high: 6,
  highest: 12,
} as const;

const fontConfig = {
  fontFamily: 'System',
};

// Extended color palette for light theme
const lightColors = {
  ...MD3LightTheme.colors,
  // Primary brand colors
  primary: '#007AFF',
  primaryContainer: '#E5F2FF',
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#001D35',

  // Secondary colors
  secondary: '#5856D6',
  secondaryContainer: '#E8E7FF',
  onSecondary: '#FFFFFF',
  onSecondaryContainer: '#1A1458',

  // Accent colors for different sections
  accent1: '#FF3B30', // Red - Warnings/Important
  accent2: '#34C759', // Green - Success/Permissions
  accent3: '#FF9500', // Orange - Settings
  accent4: '#AF52DE', // Purple - Advanced

  // Surface colors
  surface: '#FFFFFF',
  surfaceVariant: '#F2F2F7',
  onSurface: '#000000',
  onSurfaceVariant: '#48484A',

  // Background
  background: '#F2F2F7',
  onBackground: '#000000',

  // Status colors
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#007AFF',

  // Borders and dividers
  outline: '#C6C6C8',
  outlineVariant: '#E5E5EA',
};

// Extended color palette for dark theme
const darkColors = {
  ...MD3DarkTheme.colors,
  // Primary brand colors
  primary: '#0A84FF',
  primaryContainer: '#003E7A',
  onPrimary: '#003258',
  onPrimaryContainer: '#A8C7FA',

  // Secondary colors
  secondary: '#5E5CE6',
  secondaryContainer: '#433F9E',
  onSecondary: '#2E2B75',
  onSecondaryContainer: '#E0DFFF',

  // Accent colors for different sections
  accent1: '#FF453A', // Red
  accent2: '#32D74B', // Green
  accent3: '#FF9F0A', // Orange
  accent4: '#BF5AF2', // Purple

  // Surface colors
  surface: '#1C1C1E',
  surfaceVariant: '#2C2C2E',
  onSurface: '#FFFFFF',
  onSurfaceVariant: '#AEAEB2',

  // Background
  background: '#000000',
  onBackground: '#FFFFFF',

  // Status colors
  success: '#32D74B',
  warning: '#FF9F0A',
  error: '#FF453A',
  info: '#0A84FF',

  // Borders and dividers
  outline: '#38383A',
  outlineVariant: '#2C2C2E',
};

// Gradient definitions
export const gradients = {
  primary: ['#007AFF', '#5AC8FA'],
  secondary: ['#5856D6', '#AF52DE'],
  success: ['#34C759', '#32D74B'],
  sunset: ['#FF9500', '#FF3B30'],
  ocean: ['#0A84FF', '#5E5CE6'],
  purple: ['#AF52DE', '#5856D6'],
};

export const LightTheme = {
  ...MD3LightTheme,
  fonts: configureFonts({ config: fontConfig }),
  colors: lightColors,
  spacing,
  animations,
  borderRadius,
  elevation,
  gradients,
};

export const DarkTheme = {
  ...MD3DarkTheme,
  fonts: configureFonts({ config: fontConfig }),
  colors: darkColors,
  spacing,
  animations,
  borderRadius,
  elevation,
  gradients,
};
