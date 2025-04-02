export type ColorPalette = Record<string, Record<number, string>>;

export type ColorSingleton = Record<string, string>;

export const defaultLightPalette: ColorPalette = {
  whiteAlpha: {
    50: 'rgba(255, 255, 255, 0.04)',
    100: 'rgba(255, 255, 255, 0.06)',
    200: 'rgba(255, 255, 255, 0.08)',
    300: 'rgba(255, 255, 255, 0.16)',
    400: 'rgba(255, 255, 255, 0.24)',
    500: 'rgba(255, 255, 255, 0.36)',
    600: 'rgba(255, 255, 255, 0.48)',
    700: 'rgba(255, 255, 255, 0.64)',
    800: 'rgba(255, 255, 255, 0.80)',
    900: 'rgba(255, 255, 255, 0.92)',
  },

  blackAlpha: {
    50: 'rgba(0, 0, 0, 0.04)',
    100: 'rgba(0, 0, 0, 0.06)',
    200: 'rgba(0, 0, 0, 0.08)',
    300: 'rgba(0, 0, 0, 0.16)',
    400: 'rgba(0, 0, 0, 0.24)',
    500: 'rgba(0, 0, 0, 0.36)',
    600: 'rgba(0, 0, 0, 0.48)',
    700: 'rgba(0, 0, 0, 0.64)',
    800: 'rgba(0, 0, 0, 0.80)',
    900: 'rgba(0, 0, 0, 0.92)',
  },
  white: {
    50: 'rgba(255, 255, 255, 0.04)',
    100: 'rgba(255, 255, 255, 0.08)',
    200: 'rgba(255, 255, 255, 0.16)',
    300: 'rgba(255, 255, 255, 0.24)',
    400: 'rgba(255, 255, 255, 0.36)',
    500: 'rgba(255, 255, 255, 0.48)',
    600: 'rgba(255, 255, 255, 0.64)',
    700: 'rgba(255, 255, 255, 0.80)',
    800: 'rgba(255, 255, 255, 0.92)',
    900: 'rgba(255, 255, 255, 1)',
  },

  black: {
    50: 'rgba(0, 0, 0, 0.04)',
    100: 'rgba(0, 0, 0, 0.08)',
    200: 'rgba(0, 0, 0, 0.16)',
    300: 'rgba(0, 0, 0, 0.24)',
    400: 'rgba(0, 0, 0, 0.36)',
    500: 'rgba(0, 0, 0, 0.48)',
    600: 'rgba(0, 0, 0, 0.64)',
    700: 'rgba(0, 0, 0, 0.80)',
    800: 'rgba(0, 0, 0, 0.92)',
    900: 'rgba(0, 0, 0, 1)',
  },
  rose: {
    50: '#fff1f2',
    100: '#ffe4e6',
    200: '#fecdd3',
    300: '#fda4af',
    400: '#fb7185',
    500: '#f43f5e',
    600: '#e11d48',
    700: '#be123c',
    800: '#9f1239',
    900: '#881337',
  },
  pink: {
    50: '#fdf2f8',
    100: '#fce7f3',
    200: '#fbcfe8',
    300: '#f9a8d4',
    400: '#f472b6',
    500: '#ec4899',
    600: '#db2777',
    700: '#be185d',
    800: '#9d174d',
    900: '#831843',
  },
  fuchsia: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef',
    600: '#c026d3',
    700: '#a21caf',
    800: '#86198f',
    900: '#701a75',
  },
  purple: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
  },
  violet: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
  },
  indigo: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  lightBlue: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  cyan: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
  },
  teal: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
  },
  emerald: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },
  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  lime: {
    50: '#f7fee7',
    100: '#ecfccb',
    200: '#d9f99d',
    300: '#bef264',
    400: '#a3e635',
    500: '#84cc16',
    600: '#65a30d',
    700: '#4d7c0f',
    800: '#3f6212',
    900: '#365314',
  },
  yellow: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#eab308',
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
  },
  amber: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  orange: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  warmGray: {
    50: '#fafaf9',
    100: '#f5f5f4',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716c',
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917',
  },
  trueGray: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  gray: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
  },
  dark: {
    50: '#18181b',
    100: '#27272a',
    200: '#3f3f46',
    300: '#52525b',
    400: '#71717a',
    500: '#a1a1aa',
    600: '#d4d4d8',
    700: '#e4e4e7',
    800: '#f4f4f5',
    900: '#fafafa',
  },
  light: {
    50: '#f8f9fa',
    100: '#f1f3f5',
    200: '#e9ecef',
    300: '#dee2e6',
    400: '#ced4da',
    500: '#adb5bd',
    600: '#868e96',
    700: '#495057',
    800: '#343a40',
    900: '#212529',
  },
  coolGray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  blueGray: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
};

export const defaultDarkPalette: ColorPalette = {
  whiteAlpha: {
    50: 'rgba(255, 255, 255, 0.04)',
    100: 'rgba(255, 255, 255, 0.06)',
    200: 'rgba(255, 255, 255, 0.08)',
    300: 'rgba(255, 255, 255, 0.16)',
    400: 'rgba(255, 255, 255, 0.24)',
    500: 'rgba(255, 255, 255, 0.36)',
    600: 'rgba(255, 255, 255, 0.48)',
    700: 'rgba(255, 255, 255, 0.64)',
    800: 'rgba(255, 255, 255, 0.80)',
    900: 'rgba(255, 255, 255, 0.92)',
  },

  blackAlpha: {
    50: 'rgba(0, 0, 0, 0.04)',
    100: 'rgba(0, 0, 0, 0.06)',
    200: 'rgba(0, 0, 0, 0.08)',
    300: 'rgba(0, 0, 0, 0.16)',
    400: 'rgba(0, 0, 0, 0.24)',
    500: 'rgba(0, 0, 0, 0.36)',
    600: 'rgba(0, 0, 0, 0.48)',
    700: 'rgba(0, 0, 0, 0.64)',
    800: 'rgba(0, 0, 0, 0.80)',
    900: 'rgba(0, 0, 0, 0.92)',
  },

  white: {
    50: 'rgba(255, 255, 255, 0.04)',
    100: 'rgba(255, 255, 255, 0.08)',
    200: 'rgba(255, 255, 255, 0.16)',
    300: 'rgba(255, 255, 255, 0.24)',
    400: 'rgba(255, 255, 255, 0.36)',
    500: 'rgba(255, 255, 255, 0.48)',
    600: 'rgba(255, 255, 255, 0.64)',
    700: 'rgba(255, 255, 255, 0.80)',
    800: 'rgba(255, 255, 255, 0.92)',
    900: 'rgba(255, 255, 255, 1)',
  },

  black: {
    50: 'rgba(0, 0, 0, 0.04)',
    100: 'rgba(0, 0, 0, 0.08)',
    200: 'rgba(0, 0, 0, 0.16)',
    300: 'rgba(0, 0, 0, 0.24)',
    400: 'rgba(0, 0, 0, 0.36)',
    500: 'rgba(0, 0, 0, 0.48)',
    600: 'rgba(0, 0, 0, 0.64)',
    700: 'rgba(0, 0, 0, 0.80)',
    800: 'rgba(0, 0, 0, 0.92)',
    900: 'rgba(0, 0, 0, 1)',
  },

  rose: {
    50: '#330517',
    100: '#4a031e',
    200: '#6b112f',
    300: '#9f1239',
    400: '#c81e5b',
    500: '#e11d48',
    600: '#be123c',
    700: '#9f1239',
    800: '#7f1235',
    900: '#581c87',
  },
  pink: {
    50: '#fce7f3',
    100: '#fbcfe8',
    200: '#f9a8d4',
    300: '#f472b6',
    400: '#ec4899',
    500: '#db2777',
    600: '#be185d',
    700: '#9d174d',
    800: '#831843',
    900: '#581c87',
  },
  fuchsia: {
    50: '#c026d3',
    100: '#a21caf',
    200: '#86198f',
    300: '#701a75',
    400: '#9333ea',
    500: '#d946ef',
    600: '#e879f9',
    700: '#f0abfc',
    800: '#f5d0fe',
    900: '#fae8ff',
  },
  purple: {
    50: '#6b21a8',
    100: '#7e22ce',
    200: '#9333ea',
    300: '#a855f7',
    400: '#c084fc',
    500: '#d8b4fe',
    600: '#e9d5ff',
    700: '#f3e8ff',
    800: '#faf5ff',
    900: '#fef4ff',
  },
  violet: {
    50: '#4c1d95',
    100: '#701a75',
    200: '#86198f',
    300: '#a21caf',
    400: '#c026d3',
    500: '#d946ef',
    600: '#e879f9',
    700: '#f0abfc',
    800: '#f5d0fe',
    900: '#fae8ff',
  },
  indigo: {
    50: '#312e81',
    100: '#3730a3',
    200: '#1e40af',
    300: '#1d4ed8',
    400: '#2563eb',
    500: '#3b82f6',
    600: '#60a5fa',
    700: '#93c5fd',
    800: '#bfdbfe',
    900: '#dbeafe',
  },
  blue: {
    50: '#1e3a8a',
    100: '#1e40af',
    200: '#1d4ed8',
    300: '#2563eb',
    400: '#3b82f6',
    500: '#60a5fa',
    600: '#93c5fd',
    700: '#bfdbfe',
    800: '#dbeafe',
    900: '#eff6ff',
  },
  lightBlue: {
    50: '#0c4a6e',
    100: '#075985',
    200: '#0369a1',
    300: '#0284c7',
    400: '#0ea5e9',
    500: '#38bdf8',
    600: '#7dd3fc',
    700: '#bae6fd',
    800: '#e0f2fe',
    900: '#f0f9ff',
  },
  cyan: {
    50: '#164e63',
    100: '#155e75',
    200: '#0e7490',
    300: '#0891b2',
    400: '#22d3ee',
    500: '#67e8f9',
    600: '#a5f3fc',
    700: '#cffafe',
    800: '#ecfeff',
    900: '#f0fefe',
  },
  teal: {
    50: '#134e4a',
    100: '#166534',
    200: '#15803d',
    300: '#16a34a',
    400: '#22c55e',
    500: '#4ade80',
    600: '#5eead4',
    700: '#99f6e4',
    800: '#ccfbf1',
    900: '#f0fdfa',
  },
  emerald: {
    50: '#064e3b',
    100: '#065f46',
    200: '#047857',
    300: '#059669',
    400: '#10b981',
    500: '#34d399',
    600: '#6ee7b7',
    700: '#a7f3d0',
    800: '#d1fae5',
    900: '#ecfdf5',
  },
  green: {
    50: '#14532d',
    100: '#166534',
    200: '#15803d',
    300: '#16a34a',
    400: '#22c55e',
    500: '#4ade80',
    600: '#86efac',
    700: '#bbf7d0',
    800: '#dcfce7',
    900: '#f0fdf4',
  },
  lime: {
    50: '#365314',
    100: '#3f6212',
    200: '#4d7c0f',
    300: '#65a30d',
    400: '#84cc16',
    500: '#a3e635',
    600: '#bef264',
    700: '#d9f99d',
    800: '#ecfccb',
    900: '#f7fee7',
  },
  yellow: {
    50: '#713f12',
    100: '#854d0e',
    200: '#a16207',
    300: '#ca8a04',
    400: '#eab308',
    500: '#facc15',
    600: '#fde047',
    700: '#fef08a',
    800: '#fef9c3',
    900: '#fefce8',
  },
  amber: {
    50: '#78350f',
    100: '#92400e',
    200: '#b45309',
    300: '#d97706',
    400: '#f59e0b',
    500: '#fbbf24',
    600: '#fcd34d',
    700: '#fde68a',
    800: '#fef3c7',
    900: '#fffbeb',
  },
  orange: {
    50: '#7c2d12',
    100: '#9a3412',
    200: '#c2410c',
    300: '#ea580c',
    400: '#f97316',
    500: '#fb923c',
    600: '#fdba74',
    700: '#fed7aa',
    800: '#ffedd5',
    900: '#fff7ed',
  },
  red: {
    50: '#7f1d1d',
    100: '#991b1b',
    200: '#b91c1c',
    300: '#dc2626',
    400: '#ef4444',
    500: '#f87171',
    600: '#fca5a5',
    700: '#fecaca',
    800: '#fee2e2',
    900: '#fef2f2',
  },
  warmGray: {
    50: '#1c1917',
    100: '#292524',
    200: '#44403c',
    300: '#57534e',
    400: '#78716c',
    500: '#a8a29e',
    600: '#d6d3d1',
    700: '#e7e5e4',
    800: '#f5f5f4',
    900: '#fafaf9',
  },
  trueGray: {
    50: '#171717',
    100: '#262626',
    200: '#404040',
    300: '#525252',
    400: '#737373',
    500: '#a3a3a3',
    600: '#d4d4d4',
    700: '#e5e5e5',
    800: '#f5f5f5',
    900: '#fafafa',
  },
  gray: {
    50: '#18181b',
    100: '#27272a',
    200: '#3f3f46',
    300: '#52525b',
    400: '#71717a',
    500: '#a1a1aa',
    600: '#d4d4d8',
    700: '#e4e4e7',
    800: '#f4f4f5',
    900: '#fafafa',
  },
  dark: {
    50: '#212529',
    100: '#343a40',
    200: '#495057',
    300: '#868e96',
    400: '#adb5bd',
    500: '#ced4da',
    600: '#dee2e6',
    700: '#f1f3f5',
    800: '#f8f9fa',
    900: '#ffffff',
  },
  light: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
  },
  coolGray: {
    50: '#111827',
    100: '#1f2937',
    200: '#374151',
    300: '#4b5563',
    400: '#6b7280',
    500: '#9ca3af',
    600: '#d1d5db',
    700: '#e5e7eb',
    800: '#f3f4f6',
    900: '#f9fafb',
  },
  blueGray: {
    50: '#0f172a',
    100: '#1e293b',
    200: '#334155',
    300: '#475569',
    400: '#64748b',
    500: '#94a3b8',
    600: '#cbd5e1',
    700: '#e2e8f0',
    800: '#f1f5f9',
    900: '#f8fafc',
  },
};

export const defaultColors: ColorConfig = {
  white: '#FFFFFF',
  black: '#000000',
  red: '#FF0000',
  green: '#00FF00',
  blue: '#0000FF',
  yellow: '#FFFF00',
  cyan: '#00FFFF',
  magenta: '#FF00FF',
  grey: '#808080',
  orange: '#FFA500',
  brown: '#A52A2A',
  purple: '#800080',
  pink: '#FFC0CB',
  lime: '#00FF00',
  teal: '#008080',
  navy: '#000080',
  olive: '#808000',
  maroon: '#800000',
  gold: '#FFD700',
  silver: '#C0C0C0',
  indigo: '#4B0082',
  violet: '#EE82EE',
  beige: '#F5F5DC',
  turquoise: '#40E0D0',
  coral: '#FF7F50',
  chocolate: '#D2691E',
  skyBlue: '#87CEEB',
  plum: '#DDA0DD',
  darkGreen: '#006400',
  salmon: '#FA8072',
};

export type ColorConfig = Record<string, any>;

export const defaultLightColors: ColorConfig = {
  ...defaultColors,
  dark: '#a1a1aa',
  white: '#FFFFFF',
  black: '#000000',
};

export const defaultDarkColors: ColorConfig = {
  ...defaultColors,
  dark: '#adb5bd',
  white: '#000000',
  black: '#FFFFFF',
};
