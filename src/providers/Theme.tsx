import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import {
  ColorPalette,
  ColorSingleton,
  defaultDarkColors,
  defaultDarkPalette,
  defaultLightColors,
  defaultLightPalette,
} from '../utils/colors'; // Assuming this path is correct

// --- Constants ---
// Public API prefixes (dash notation: theme-primary, color-blue-500)
const THEME_PREFIX = 'theme-';
const COLOR_PREFIX = 'color-';
const LIGHT_PREFIX = 'light-';
const DARK_PREFIX = 'dark-';

const TRANSPARENT = 'transparent';

// --- Interfaces ---
export interface Colors {
  main: ColorSingleton;
  palette: ColorPalette;
}

export interface Theme {
  primary?: string;
  secondary?: string;
  success?: string;
  error?: string;
  warning?: string;
  disabled?: string;
  loading?: string;
}

interface Override {
  colors?: Colors;
  theme?: Theme;
  themeMode?: 'light' | 'dark';
}

// --- CSS Variable Injection Helper ---
const generateCSSVariables = (
  theme: Theme,
  lightColors: Colors,
  darkColors: Colors
) => {
  const variables: string[] = [];
  const lightVariables: string[] = [];
  const darkVariables: string[] = [];
  const themeVariables: string[] = [];
  // Helper to process object and generate variables
  const processObject = (obj: any, prefix: string, targetArray: string[]) => {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      const variableName = `${prefix}-${key}`.replace(/\./g, '-');
      if (typeof value === 'object' && value !== null) {
        processObject(value, variableName, targetArray);
      } else if (typeof value === 'string' || typeof value === 'number') {
        targetArray.push(`--${variableName}: ${value};`);
      }
    });
  };
  // 1. Generate ALL primitive variables (light and dark)
  // We prefix them with --light-color-... and --dark-color-...
  processObject(lightColors.main, 'color', variables);
  processObject(lightColors.palette, 'color', variables);

  processObject(lightColors.main, 'light-color', lightVariables);
  processObject(lightColors.palette, 'light-color', lightVariables);

  processObject(darkColors.main, 'dark-color', darkVariables);
  processObject(darkColors.palette, 'dark-color', darkVariables);

  // We collect the names that need mapping
  const genericColorVars: string[] = [];
  const collectGenericNames = (obj: any, prefix: string) => {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      const variableName = `${prefix}-${key}`.replace(/\./g, '-');
      if (typeof value === 'object' && value !== null) {
        collectGenericNames(value, variableName);
      } else {
        genericColorVars.push(variableName);
      }
    });
  };

  collectGenericNames(lightColors.main, 'color');
  collectGenericNames(lightColors.palette, 'color');
  // 3. Process Theme variables (references)
  // Theme config uses dash notation (color-blue-500, theme-primary)
  const processTheme = (obj: any, prefix: string) => {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      const variableName = `${prefix}-${key}`;
      if (typeof value === 'object' && value !== null) {
        processTheme(value, variableName);
      } else if (typeof value === 'string') {
        if (value.startsWith('color-') || value.startsWith('theme-')) {
          // Convert 'color-blue-500' -> 'var(--color-blue-500)'
          themeVariables.push(`--${variableName}: var(--${value});`);
        } else {
          themeVariables.push(`--${variableName}: ${value};`);
        }
      }
    });
  };

  processTheme(theme, 'theme');
  // 4. Construct CSS
  // :root has all primitives
  // [data-theme='light'] maps color vars to light primitives
  // [data-theme='dark'] maps color vars to dark primitives

  const lightMappings = genericColorVars
    .map((name) => `--${name}: var(--light-${name});`)
    .join('\n    ');
  const darkMappings = genericColorVars
    .map((name) => `--${name}: var(--dark-${name});`)
    .join('\n    ');
  const css = `
    :root {
      /* Primitives */
      ${variables.join('\n      ')}
      ${lightVariables.join('\n      ')}
      ${darkVariables.join('\n      ')}
      
      /* Theme Variables (Structural) */
      ${themeVariables.join('\n      ')}
    }
  
    [data-theme='light'] {
      ${lightMappings}
    }
    
    [data-theme='dark'] {
      ${darkMappings}
    }
  `;
  return css;
};

interface ThemeContextProps {
  // Signature allows overriding the mode for a specific lookup
  getColor: (name: string, override?: Override) => string;
  getColorHex: (name: string, override?: Override) => string;
  getColorRGBA: (
    name: string,
    alphaOrOverride?: number | Override,
    override?: Override
  ) => string;
  getColorScheme: (name: string, override?: Override) => string | undefined;
  getContrastColor: (name: string, override?: Override) => 'black' | 'white';
  theme: Theme;
  colors: Colors; // Current mode's colors
  themeMode: 'light' | 'dark';
  setThemeMode: (mode: 'light' | 'dark') => void;
}

// --- Default Configuration ---
// Theme values use dash notation (color-X or color-X-shade)
// which gets resolved to CSS variables (var(--color-X-shade))
export const defaultThemeMain: Theme = {
  primary: 'color-black',
  secondary: 'color-blue',
  success: 'color-green-500',
  error: 'color-red-500',
  warning: 'color-orange-500',
  disabled: 'color-gray-500',
  loading: 'color-dark-500',
};

const defaultLightColorConfig: Colors = {
  main: defaultLightColors,
  palette: defaultLightPalette,
};

const defaultDarkColorConfig: Colors = {
  main: defaultDarkColors,
  palette: defaultDarkPalette,
};

// --- Create Theme Context ---
export const ThemeContext = createContext<ThemeContextProps>({
  getColor: () => '',
  getColorHex: () => '',
  getColorRGBA: () => '',
  getColorScheme: () => undefined,
  getContrastColor: () => 'black',
  theme: {},
  colors: { main: defaultLightColors, palette: defaultLightPalette },
  themeMode: 'light',
  setThemeMode: () => {},
});

// --- Custom Hook ---
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// --- Helper Function to Convert Color to RGBA with Alpha ---
/**
 * Converts a color (hex, rgb, or rgba) to rgba format with specified alpha.
 * @param color - The base color in hex, rgb, or rgba format
 * @param alpha - Alpha value on a 0-1000 scale (e.g., 200 = 0.2 opacity)
 * @returns RGBA color string
 */
const convertToRgba = (color: string, alpha: number): string => {
  // Normalize alpha to 0-1 range
  const normalizedAlpha = Math.max(0, Math.min(1000, alpha)) / 1000;

  // Handle hex colors (#RGB or #RRGGBB)
  if (color.startsWith('#')) {
    let hex = color.slice(1);
    // Convert shorthand hex to full form
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map((char) => char + char)
        .join('');
    }
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${normalizedAlpha})`;
  }

  // Handle rgb/rgba colors
  if (color.startsWith('rgb')) {
    // Extract the values from rgb() or rgba()
    const rgbMatch = color.match(/rgba?\(([^)]+)\)/);
    if (rgbMatch) {
      const values = rgbMatch[1].split(',').map((v) => v.trim());
      const r = values[0];
      const g = values[1];
      const b = values[2];
      return `rgba(${r}, ${g}, ${b}, ${normalizedAlpha})`;
    }
  }

  // If color format is not recognized, return as-is
  console.warn(`Unable to convert color "${color}" to rgba format`);
  return color;
};

const clamp255 = (value: number) => Math.max(0, Math.min(255, value));

const toTwoHex = (value: number) =>
  clamp255(Math.round(value)).toString(16).padStart(2, '0');

const normalizeToHex = (color: string): string => {
  if (!color || typeof color !== 'string') return String(color);

  const trimmed = color.trim();
  if (trimmed === TRANSPARENT) return '#00000000';

  if (trimmed.startsWith('#')) {
    const hex = trimmed.slice(1);
    if (hex.length === 3) {
      const r = hex[0] + hex[0];
      const g = hex[1] + hex[1];
      const b = hex[2] + hex[2];
      return `#${r}${g}${b}`.toLowerCase();
    }
    if (hex.length === 4) {
      const r = hex[0] + hex[0];
      const g = hex[1] + hex[1];
      const b = hex[2] + hex[2];
      const a = hex[3] + hex[3];
      return `#${r}${g}${b}${a}`.toLowerCase();
    }
    if (hex.length === 6 || hex.length === 8) {
      return `#${hex}`.toLowerCase();
    }
    return trimmed;
  }

  if (trimmed.startsWith('rgb')) {
    const match = trimmed.match(/rgba?\(([^)]+)\)/i);
    if (!match) return trimmed;

    const parts = match[1]
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    const r = Number(parts[0]);
    const g = Number(parts[1]);
    const b = Number(parts[2]);
    const a = parts.length >= 4 ? Number(parts[3]) : 1;

    if ([r, g, b].some((v) => Number.isNaN(v)) || Number.isNaN(a))
      return trimmed;

    const rr = toTwoHex(r);
    const gg = toTwoHex(g);
    const bb = toTwoHex(b);

    const alpha = Math.max(0, Math.min(1, a));
    if (alpha >= 1) return `#${rr}${gg}${bb}`.toLowerCase();

    const aa = toTwoHex(alpha * 255);
    return `#${rr}${gg}${bb}${aa}`.toLowerCase();
  }

  return trimmed;
};

const normalizeToRgba = (color: string, alphaOverride?: number): string => {
  if (!color || typeof color !== 'string') return String(color);

  const trimmed = color.trim();
  const overrideAlpha =
    typeof alphaOverride === 'number'
      ? Math.max(0, Math.min(1000, alphaOverride)) / 1000
      : undefined;

  if (trimmed === TRANSPARENT) {
    const a = overrideAlpha ?? 0;
    return `rgba(0, 0, 0, ${a})`;
  }

  if (trimmed.startsWith('#')) {
    let hex = trimmed.slice(1);
    if (hex.length === 3 || hex.length === 4) {
      hex = hex
        .split('')
        .map((ch) => ch + ch)
        .join('');
    }

    if (hex.length !== 6 && hex.length !== 8) return trimmed;

    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const aFromHex = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
    const a = overrideAlpha ?? aFromHex;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  if (trimmed.startsWith('rgb')) {
    const match = trimmed.match(/rgba?\(([^)]+)\)/i);
    if (!match) return trimmed;

    const parts = match[1]
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    const r = Number(parts[0]);
    const g = Number(parts[1]);
    const b = Number(parts[2]);
    const aExisting = parts.length >= 4 ? Number(parts[3]) : 1;

    if ([r, g, b].some((v) => Number.isNaN(v)) || Number.isNaN(aExisting))
      return trimmed;

    const a = overrideAlpha ?? Math.max(0, Math.min(1, aExisting));
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  // If it's already something else (var(), color-mix(), named color), we can't reliably convert.
  return trimmed;
};

// --- Deep Merge Function (remains the same, assuming it works as intended) ---
// Consider using a library like `lodash.merge` or `deepmerge` if complexity grows
// or edge cases (like merging arrays) need different handling.
export const deepMerge = (target: any, source: any): any => {
  // (Implementation from original code)
  if (typeof source !== 'object' || source === null) {
    return target;
  }
  const merged = { ...target };
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const targetValue = target[key];
      if (Array.isArray(sourceValue)) {
        // Overwrite arrays, don't merge them (common for theme configs)
        merged[key] = sourceValue;
      } else if (
        typeof sourceValue === 'object' &&
        sourceValue !== null &&
        !Array.isArray(sourceValue)
      ) {
        merged[key] = deepMerge(targetValue || {}, sourceValue);
      } else if (sourceValue !== undefined) {
        // Ensure undefined doesn't overwrite
        merged[key] = sourceValue;
      }
    }
  }
  return merged;
};

// --- CSS Variable Injection Helper (Deprecated/Replaced) ---
// The new logic generates CSS variables within the component and applies them to the container style.

// --- ThemeProvider Component ---
interface ThemeProviderProps {
  theme?: Partial<Theme>;
  dark?: Partial<Colors>;
  light?: Partial<Colors>;
  mode?: 'light' | 'dark';
  children: ReactNode;
  strict?: boolean;
  targetWindow?: Window;
}

// Stable default references to prevent unnecessary re-renders and cache invalidation
const DEFAULT_THEME_OVERRIDE: Partial<Theme> = {};
const DEFAULT_COLORS_OVERRIDE: Partial<Colors> = {};

export const ThemeProvider = ({
  theme: themeOverride = DEFAULT_THEME_OVERRIDE,
  mode: initialMode = 'light',
  dark: darkOverride = DEFAULT_COLORS_OVERRIDE,
  light: lightOverride = DEFAULT_COLORS_OVERRIDE,
  children,
  strict = false,
  targetWindow,
}: ThemeProviderProps): React.ReactElement => {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(initialMode);
  const colorCache = useRef(new Map<string, string>()).current;

  // Sync state with prop changes
  useEffect(() => {
    setThemeMode(initialMode);
  }, [initialMode]);

  // Clear cache when theme definitions change to avoid stale colors
  useEffect(() => {
    colorCache.clear();
  }, [lightOverride, darkOverride, themeOverride, colorCache]);

  // --- Memoize derived values ---
  const mergedTheme = useMemo<Theme>(
    () => deepMerge(defaultThemeMain, themeOverride),
    [themeOverride]
  );

  const themeColors = useMemo<{ light: Colors; dark: Colors }>(
    () => ({
      light: deepMerge(defaultLightColorConfig, lightOverride),
      dark: deepMerge(defaultDarkColorConfig, darkOverride),
    }),
    [lightOverride, darkOverride]
  );

  const currentColors = useMemo(
    () => themeColors[themeMode],
    [themeColors, themeMode]
  );

  const resolveColorTokenForMode = useCallback(
    (
      token: string,
      mode: 'light' | 'dark',
      override?: Override,
      depth: number = 0
    ): string => {
      if (!token || typeof token !== 'string') return String(token);
      if (token === TRANSPARENT) return token;
      if (depth > 25) return token;

      const effectiveTheme = override?.theme
        ? (deepMerge(mergedTheme, override.theme) as Theme)
        : mergedTheme;

      // Convert dash notation to internal format for resolution
      // theme-primary-100 -> parts for processing
      if (token.startsWith(THEME_PREFIX)) {
        const parts = token.substring(THEME_PREFIX.length).split('-');
        const lastPart = parts[parts.length - 1];
        const maybeAlpha = parseInt(lastPart, 10);

        // Check for alpha suffix: theme-primary-100 (2+ parts after prefix, last is 0-1000)
        if (
          parts.length >= 2 &&
          !isNaN(maybeAlpha) &&
          maybeAlpha >= 0 &&
          maybeAlpha <= 1000
        ) {
          const themeKey = parts.slice(0, -1).join('-') as keyof Theme;
          const baseToken = `${THEME_PREFIX}${themeKey}`;
          const resolvedBase = resolveColorTokenForMode(
            baseToken,
            mode,
            override,
            depth + 1
          );
          return convertToRgba(resolvedBase, maybeAlpha);
        }

        const themeKey = parts.join('-') as keyof Theme;
        const themeValue = effectiveTheme[themeKey as keyof Theme];
        if (typeof themeValue === 'string') {
          // Theme values use dash notation (color-blue-500)
          return resolveColorTokenForMode(
            themeValue,
            mode,
            override,
            depth + 1
          );
        }
        return token;
      }

      // Handle dash notation: color-blue-500, light-blue-500, dark-blue-500
      if (token.startsWith(COLOR_PREFIX)) {
        const parts = token.substring(COLOR_PREFIX.length).split('-');
        const colorsToUse = themeColors[mode];
        const palette = deepMerge(
          colorsToUse.palette,
          override?.colors?.palette || {}
        );
        const main = deepMerge(colorsToUse.main, override?.colors?.main || {});

        // color-blue-500-200 (alpha)
        if (parts.length >= 3) {
          const lastPart = parts[parts.length - 1];
          const maybeAlpha = parseInt(lastPart, 10);
          if (!isNaN(maybeAlpha) && maybeAlpha >= 0 && maybeAlpha <= 1000) {
            const colorName = parts[0];
            const variant = parts[1];
            const base = palette?.[colorName]?.[variant];
            if (typeof base === 'string') {
              return convertToRgba(base, maybeAlpha);
            }
          }
        }
        // color-blue-500
        if (parts.length === 2) {
          const [colorName, variant] = parts;
          const value = palette?.[colorName]?.[variant];
          return typeof value === 'string' ? value : token;
        }
        // color-blue
        if (parts.length === 1) {
          const value = main?.[parts[0]];
          return typeof value === 'string' ? value : token;
        }
        return token;
      }

      // Handle light-* and dark-* tokens
      if (token.startsWith(LIGHT_PREFIX) || token.startsWith(DARK_PREFIX)) {
        const explicitMode = token.startsWith(LIGHT_PREFIX) ? 'light' : 'dark';
        const prefix = token.startsWith(LIGHT_PREFIX)
          ? LIGHT_PREFIX
          : DARK_PREFIX;
        const colorPart = token.substring(prefix.length);
        return resolveColorTokenForMode(
          `${COLOR_PREFIX}${colorPart}`,
          explicitMode,
          override,
          depth + 1
        );
      }

      return token;
    },
    [mergedTheme, themeColors]
  );

  // --- Helper function to resolve color tokens to actual values ---
  // This is used internally and handles dash notation (public API)
  const resolveColorToken = useCallback(
    (token: string): string => {
      if (!token || typeof token !== 'string') return String(token);
      if (token === TRANSPARENT) return token;

      const colors = currentColors;

      // Handle dash notation: color-blue-500
      if (token.startsWith(COLOR_PREFIX)) {
        const parts = token.substring(COLOR_PREFIX.length).split('-');

        // color-blue-500-200 (alpha)
        if (parts.length >= 3) {
          const lastPart = parts[parts.length - 1];
          const maybeAlpha = parseInt(lastPart, 10);
          if (!isNaN(maybeAlpha) && maybeAlpha >= 0 && maybeAlpha <= 1000) {
            const percentage = Math.round((maybeAlpha / 1000) * 100);
            const baseVar = `color-${parts.slice(0, -1).join('-')}`;
            return `color-mix(in srgb, var(--${baseVar}) ${percentage}%, transparent)`;
          }
        }
        // color-blue-500
        if (parts.length === 2) {
          const [colorName, shade] = parts;
          const shadeValue = colors.palette[colorName]?.[Number(shade)];
          return typeof shadeValue === 'string' ? shadeValue : token;
        }
        // color-blue
        if (parts.length === 1) {
          const colorValue = colors.main[parts[0]];
          return typeof colorValue === 'string' ? colorValue : token;
        }
      }

      // Handle dash notation: theme-primary, theme-primary-100
      if (token.startsWith(THEME_PREFIX)) {
        const parts = token.substring(THEME_PREFIX.length).split('-');
        const lastPart = parts[parts.length - 1];
        const maybeAlpha = parseInt(lastPart, 10);

        // theme-primary-100 (alpha)
        if (
          parts.length >= 2 &&
          !isNaN(maybeAlpha) &&
          maybeAlpha >= 0 &&
          maybeAlpha <= 1000
        ) {
          const percentage = Math.round((maybeAlpha / 1000) * 100);
          const baseVar = `theme-${parts.slice(0, -1).join('-')}`;
          return `color-mix(in srgb, var(--${baseVar}) ${percentage}%, transparent)`;
        }

        const themeKey = parts.join('-') as keyof Theme;
        const themeValue = mergedTheme[themeKey as keyof Theme];
        if (typeof themeValue === 'string') {
          return resolveColorToken(themeValue);
        }
      }

      return token;
    },
    [currentColors, mergedTheme]
  );

  // The mode is now handled by the data-attribute on the container

  // --- Memoized getColor function - Dash notation only ---
  const getColor = useCallback(
    (name: string): string => {
      if (!name || typeof name !== 'string') return String(name);
      if (name === TRANSPARENT) return name;

      // Strict Mode Check - only dash notation is supported
      if (
        strict &&
        !name.startsWith(COLOR_PREFIX) &&
        !name.startsWith(THEME_PREFIX) &&
        !name.startsWith(LIGHT_PREFIX) &&
        !name.startsWith(DARK_PREFIX)
      ) {
        console.warn(
          `[Theme] Invalid color token: '${name}'. Use dash notation: theme-primary, color-blue-500`
        );
      }

      const parts = name.split('-');
      const lastPart = parts[parts.length - 1];
      const maybeAlpha = parseInt(lastPart, 10);

      // Handle theme-* tokens (e.g., theme-primary, theme-primary-100)
      if (name.startsWith(THEME_PREFIX)) {
        // Check for alpha suffix: theme-primary-100 (3+ parts, last is 0-1000)
        if (
          parts.length >= 3 &&
          !isNaN(maybeAlpha) &&
          maybeAlpha >= 0 &&
          maybeAlpha <= 1000
        ) {
          const baseVar = parts.slice(0, -1).join('-');
          const percentage = Math.round((maybeAlpha / 1000) * 100);
          return `color-mix(in srgb, var(--${baseVar}) ${percentage}%, transparent)`;
        }
        return `var(--${name})`;
      }

      // Handle color-* tokens (e.g., color-blue-500, color-blue-500-200)
      if (name.startsWith(COLOR_PREFIX)) {
        // Check for alpha suffix: color-blue-500-200 (4+ parts, last is 0-1000)
        if (
          parts.length >= 4 &&
          !isNaN(maybeAlpha) &&
          maybeAlpha >= 0 &&
          maybeAlpha <= 1000
        ) {
          const baseVar = parts.slice(0, -1).join('-');
          const percentage = Math.round((maybeAlpha / 1000) * 100);
          return `color-mix(in srgb, var(--${baseVar}) ${percentage}%, transparent)`;
        }
        return `var(--${name})`;
      }

      // Handle light-* and dark-* tokens (e.g., light-blue-500, dark-red-200)
      if (name.startsWith(LIGHT_PREFIX) || name.startsWith(DARK_PREFIX)) {
        const prefix = name.startsWith(LIGHT_PREFIX)
          ? LIGHT_PREFIX
          : DARK_PREFIX;
        const colorPart = name.substring(prefix.length);
        return `var(--${prefix}color-${colorPart})`;
      }

      // Return as-is for direct values (#hex, rgb(), etc.)
      return name;
    },
    [strict]
  );

  const getColorHex = useCallback(
    (name: string, override?: Override): string => {
      if (!name || typeof name !== 'string') return String(name);
      if (name === TRANSPARENT) return '#00000000';

      const effectiveMode = override?.themeMode ?? themeMode;
      const cacheKey = `${name}-${effectiveMode}-hex`;

      // Cache only when no override object is provided
      if (!override && colorCache.has(cacheKey)) {
        return colorCache.get(cacheKey)!;
      }

      const resolved = resolveColorTokenForMode(name, effectiveMode, override);
      const hex = normalizeToHex(resolved);

      if (!override) colorCache.set(cacheKey, hex);
      return hex;
    },
    [themeMode, colorCache, resolveColorTokenForMode]
  );

  const getColorRGBA = useCallback(
    (
      name: string,
      alphaOrOverride?: number | Override,
      overrideMaybe?: Override
    ): string => {
      if (!name || typeof name !== 'string') return String(name);

      const alpha =
        typeof alphaOrOverride === 'number' ? alphaOrOverride : undefined;
      const override = (
        typeof alphaOrOverride === 'object' ? alphaOrOverride : overrideMaybe
      ) as Override | undefined;

      const effectiveMode = override?.themeMode ?? themeMode;
      const alphaKey = typeof alpha === 'number' ? String(alpha) : 'auto';
      const cacheKey = `${name}-${effectiveMode}-rgba-${alphaKey}`;

      if (!override && colorCache.has(cacheKey)) {
        return colorCache.get(cacheKey)!;
      }

      const resolved = resolveColorTokenForMode(name, effectiveMode, override);
      const rgba = normalizeToRgba(resolved, alpha);

      if (!override) colorCache.set(cacheKey, rgba);
      return rgba;
    },
    [themeMode, colorCache, resolveColorTokenForMode]
  );

  const getColorScheme = useCallback(
    (name: string, override?: Override): string | undefined => {
      if (!name || typeof name !== 'string') return undefined;

      const effectiveMode = override?.themeMode ?? themeMode;
      const effectiveTheme = override?.theme
        ? (deepMerge(mergedTheme, override.theme) as Theme)
        : mergedTheme;

      // Resolve theme-* tokens to get the underlying color token
      let colorToken = name;
      if (name.startsWith(THEME_PREFIX)) {
        const themeKey = name.substring(THEME_PREFIX.length) as keyof Theme;
        const themeValue = effectiveTheme[themeKey];
        if (typeof themeValue === 'string') {
          colorToken = themeValue;
        }
      }

      // Handle light-* or dark-* prefixes
      if (
        colorToken.startsWith(LIGHT_PREFIX) ||
        colorToken.startsWith(DARK_PREFIX)
      ) {
        const prefix = colorToken.startsWith(LIGHT_PREFIX)
          ? LIGHT_PREFIX
          : DARK_PREFIX;
        colorToken = `${COLOR_PREFIX}${colorToken.substring(prefix.length)}`;
      }

      // Extract color scheme from color-* tokens (e.g., color-blue-500 -> 'blue')
      if (colorToken.startsWith(COLOR_PREFIX)) {
        const parts = colorToken.substring(COLOR_PREFIX.length).split('-');
        if (parts.length >= 1) {
          return parts[0]; // Return the color scheme name (e.g., 'blue', 'pink')
        }
      }

      // Handle hex or rgba colors by finding the closest match in the palette
      const normalizedInput = normalizeToHex(colorToken).toLowerCase();
      if (normalizedInput.startsWith('#')) {
        const colorsToUse = themeColors[effectiveMode];
        const palette = deepMerge(
          colorsToUse.palette,
          override?.colors?.palette || {}
        );
        const main = deepMerge(colorsToUse.main, override?.colors?.main || {});

        // First check main colors for exact match
        for (const [colorName, colorValue] of Object.entries(main)) {
          if (typeof colorValue === 'string') {
            const normalizedPalette = normalizeToHex(colorValue).toLowerCase();
            if (normalizedPalette === normalizedInput) {
              return colorName;
            }
          }
        }

        // Then check palette colors for exact match
        for (const [colorName, shades] of Object.entries(palette)) {
          if (typeof shades === 'object' && shades !== null) {
            for (const [, shadeValue] of Object.entries(shades)) {
              if (typeof shadeValue === 'string') {
                const normalizedPalette =
                  normalizeToHex(shadeValue).toLowerCase();
                if (normalizedPalette === normalizedInput) {
                  return colorName;
                }
              }
            }
          }
        }
      }

      return undefined;
    },
    [mergedTheme, themeMode, themeColors]
  );

  const getContrastColor = useCallback(
    (name: string, override?: Override): 'black' | 'white' => {
      if (!name || typeof name !== 'string') return 'black';

      const effectiveMode = override?.themeMode ?? themeMode;

      // First resolve the color to a hex value
      let hexColor: string;

      // Check if it's already a hex or rgb color
      if (name.startsWith('#') || name.startsWith('rgb')) {
        hexColor = normalizeToHex(name);
      } else {
        // Resolve the token to get the actual color value
        const resolved = resolveColorTokenForMode(
          name,
          effectiveMode,
          override
        );
        hexColor = normalizeToHex(resolved);
      }

      // If we couldn't get a valid hex, default to black
      if (!hexColor.startsWith('#') || hexColor.length < 7) {
        return 'black';
      }

      // Extract RGB values
      const hex = hexColor.slice(1);
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);

      // Calculate relative luminance using the sRGB formula
      // https://www.w3.org/TR/WCAG20/#relativeluminancedef
      const toLinear = (c: number) => {
        const sRGB = c / 255;
        return sRGB <= 0.03928
          ? sRGB / 12.92
          : Math.pow((sRGB + 0.055) / 1.055, 2.4);
      };

      const luminance =
        0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

      // Use threshold of 0.179 (WCAG recommendation)
      // Return white for dark colors, black for light colors
      return luminance > 0.179 ? 'black' : 'white';
    },
    [themeMode, resolveColorTokenForMode]
  );

  // --- Memoize Context Value ---
  const contextValue = useMemo(
    () => ({
      getColor,
      getColorHex,
      getColorRGBA,
      getColorScheme,
      getContrastColor,
      theme: mergedTheme,
      colors: currentColors,
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
      currentColors,
      themeMode,
    ]
  );

  // Generate CSS variables
  const cssVariables = useMemo(
    () =>
      generateCSSVariables(mergedTheme, themeColors.light, themeColors.dark),
    [mergedTheme, themeColors]
  );

  // Inject CSS variables into target document (for iframe support)
  useEffect(() => {
    if (!targetWindow) return;

    const targetDoc = targetWindow.document;
    const styleId = 'app-studio-theme-vars';

    // Remove existing style tag if any
    const existing = targetDoc.getElementById(styleId);
    if (existing) {
      existing.remove();
    }

    // Create and inject new style tag
    const styleTag = targetDoc.createElement('style');
    styleTag.id = styleId;
    styleTag.textContent = cssVariables;
    targetDoc.head.appendChild(styleTag);

    // Cleanup on unmount
    return () => {
      const styleToRemove = targetDoc.getElementById(styleId);
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, [targetWindow, cssVariables]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {!targetWindow && <style>{cssVariables}</style>}
      <div
        data-theme={themeMode}
        style={{
          backgroundColor: 'white',
          width: '100%',
          height: '100%',
          transition: 'background-color 0.2s, color 0.2s',
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
