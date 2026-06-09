import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  Colors,
  Theme,
  ThemeColorConfig,
  ThemeMode,
  deepMerge,
  defaultThemeColors,
  defaultThemeMain,
  normalizeHex,
  resolveThemeColor,
} from '../../shared/theme';
import { normalizeThemeColors } from '../../utils/colors';

interface ThemeContextProps {
  getColor: (name: string) => string;
  getColorHex: (name: string) => string;
  getColorRGBA: (name: string, alpha?: number) => string;
  getColorScheme: (name: string) => string | undefined;
  getContrastColor: (name: string) => 'black' | 'white';
  theme: Theme;
  colors: Colors;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

export interface ThemeProviderProps {
  colors?: Partial<Colors>;
  lightColors?: Partial<Colors>;
  darkColors?: Partial<Colors>;
  theme?: Theme;
  initialMode?: ThemeMode;
  children?: ReactNode;
}

const defaultContext: ThemeContextProps = {
  getColor: (name) => name,
  getColorHex: (name) => name,
  getColorRGBA: (name) => name,
  getColorScheme: () => undefined,
  getContrastColor: () => 'black',
  theme: defaultThemeMain,
  colors: defaultThemeColors.light,
  themeMode: 'light',
  setThemeMode: () => {},
};

export const ThemeContext = createContext<ThemeContextProps>(defaultContext);

export const useTheme = () => useContext(ThemeContext);

function toRgba(color: string, alpha?: number): string {
  if (typeof alpha !== 'number') return color;
  const normalized = Math.max(0, Math.min(1000, alpha)) / 1000;
  const hex = normalizeHex(color);
  if (!hex.startsWith('#') || hex.length < 7) return color;

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${normalized})`;
}

function contrastColor(hex: string): 'black' | 'white' {
  const normalized = normalizeHex(hex);
  if (!normalized.startsWith('#') || normalized.length < 7) return 'black';

  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.58 ? 'black' : 'white';
}

export const ThemeProvider = ({
  colors,
  lightColors,
  darkColors,
  theme,
  initialMode = 'light',
  children,
}: ThemeProviderProps) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(initialMode);

  const mergedColors = useMemo<ThemeColorConfig>(
    () => ({
      light: deepMerge(
        defaultThemeColors.light,
        deepMerge(colors || {}, lightColors || {}) as Partial<Colors>
      ),
      dark: deepMerge(
        defaultThemeColors.dark,
        deepMerge(colors || {}, darkColors || {}) as Partial<Colors>
      ),
    }),
    [colors, lightColors, darkColors]
  );

  // Snap any literal colors configured in the theme to the nearest palette
  // token so the theme keeps adapting to light/dark mode.
  const mergedTheme = useMemo(
    () =>
      normalizeThemeColors(
        deepMerge(defaultThemeMain, theme),
        mergedColors.light
      ),
    [theme, mergedColors.light]
  );

  const getColor = useCallback(
    (name: string) =>
      resolveThemeColor(name, {
        colors: mergedColors,
        theme: mergedTheme,
        themeMode,
      }),
    [mergedColors, mergedTheme, themeMode]
  );

  const getColorHex = useCallback(
    (name: string) => normalizeHex(getColor(name)),
    [getColor]
  );

  const getColorRGBA = useCallback(
    (name: string, alpha?: number) => toRgba(getColor(name), alpha),
    [getColor]
  );

  const getColorScheme = useCallback((name: string) => {
    if (name.startsWith('theme-')) return name.slice('theme-'.length);
    if (name.startsWith('color-')) return name.split('-')[1];
    return undefined;
  }, []);

  const getContrastColor = useCallback(
    (name: string) => contrastColor(getColorHex(name)),
    [getColorHex]
  );

  const value = useMemo<ThemeContextProps>(
    () => ({
      getColor,
      getColorHex,
      getColorRGBA,
      getColorScheme,
      getContrastColor,
      theme: mergedTheme,
      colors: mergedColors[themeMode],
      themeMode,
      setThemeMode,
    }),
    [
      getColor,
      getColorHex,
      getColorRGBA,
      getColorScheme,
      getContrastColor,
      mergedTheme,
      mergedColors,
      themeMode,
    ]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export type { Colors, Theme, ThemeMode };
