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
const THEME_PREFIX = 'theme.';
const COLOR_PREFIX = 'color.';

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
  const processTheme = (obj: any, prefix: string) => {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      const variableName = `${prefix}-${key}`.replace(/\./g, '-');
      if (typeof value === 'object' && value !== null) {
        processTheme(value, variableName);
      } else if (typeof value === 'string') {
        if (value.startsWith(COLOR_PREFIX)) {
          // Convert 'color.blue.500' -> 'var(--color-blue-500)'
          // The underlying --color-blue-500 will change based on scope!
          const refVar = value.replace(/\./g, '-');
          themeVariables.push(`--${variableName}: var(--${refVar});`);
        } else if (value.startsWith(THEME_PREFIX)) {
          const refVar = value.replace(/\./g, '-');
          themeVariables.push(`--${variableName}: var(--${refVar});`);
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
export const defaultThemeMain: Theme = {
  primary: `${COLOR_PREFIX}black`,
  secondary: `${COLOR_PREFIX}blue`,
  success: `${COLOR_PREFIX}green.500`,
  error: `${COLOR_PREFIX}red.500`,
  warning: `${COLOR_PREFIX}orange.500`,
  disabled: `${COLOR_PREFIX}gray.500`,
  loading: `${COLOR_PREFIX}dark.500`,
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
    const match = color.match(/rgba?\(([^)]+)\)/);
    if (match) {
      const values = match[1].split(',').map((v) => v.trim());
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
}

export const ThemeProvider = ({
  theme: themeOverride = {},
  mode: initialMode = 'light',
  dark: darkOverride = {},
  light: lightOverride = {},
  children,
  strict = false,
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

      // Resolve theme.* tokens recursively
      if (token.startsWith(THEME_PREFIX)) {
        const themeKey = token.substring(THEME_PREFIX.length) as keyof Theme;
        const themeValue = effectiveTheme[themeKey];
        if (typeof themeValue === 'string') {
          return resolveColorTokenForMode(
            themeValue,
            mode,
            override,
            depth + 1
          );
        }
        return token;
      }

      // Resolve explicit mode paths like "light.blue.500" / "dark.blue.500"
      if (token.startsWith('light.') || token.startsWith('dark.')) {
        const explicitMode = token.startsWith('light.') ? 'light' : 'dark';
        const prefixLength = token.startsWith('light.') ? 6 : 5;
        const modifiedName = `${COLOR_PREFIX}${token.substring(prefixLength)}`;
        return resolveColorTokenForMode(
          modifiedName,
          explicitMode,
          override,
          depth + 1
        );
      }

      // Resolve color.* tokens
      if (token.startsWith(COLOR_PREFIX)) {
        const keys = token.substring(COLOR_PREFIX.length).split('.');

        const colorsToUse = themeColors[mode];
        const palette = deepMerge(
          colorsToUse.palette,
          override?.colors?.palette || {}
        );
        const main = deepMerge(colorsToUse.main, override?.colors?.main || {});

        if (keys.length === 3) {
          // e.g. color.blue.500.200 (alpha)
          const [colorName, variant, alphaStr] = keys;
          const base = palette?.[colorName]?.[variant];
          const alpha = parseInt(alphaStr, 10);
          if (typeof base === 'string' && !isNaN(alpha)) {
            return convertToRgba(base, alpha);
          }
          return token;
        }

        if (keys.length === 2) {
          const [colorName, variant] = keys;
          const value = palette?.[colorName]?.[variant];
          return typeof value === 'string' ? value : token;
        }

        if (keys.length === 1) {
          const [colorName] = keys;
          const value = main?.[colorName];
          return typeof value === 'string' ? value : token;
        }

        return token;
      }

      return token;
    },
    [mergedTheme, themeColors]
  );

  // --- Helper function to resolve color tokens to actual values ---
  const resolveColorToken = useCallback(
    (token: string): string => {
      if (!token || typeof token !== 'string') return String(token);
      if (token === TRANSPARENT) return token;

      const colors = currentColors;

      // Resolve color.* tokens
      if (token.startsWith(COLOR_PREFIX)) {
        const keys = token.substring(COLOR_PREFIX.length).split('.');

        if (keys.length === 1) {
          // e.g., "color.blue" -> main color
          const colorValue = colors.main[keys[0]];
          return typeof colorValue === 'string' ? colorValue : token;
        } else if (keys.length === 2) {
          // e.g., "color.blue.500" -> palette color
          const [colorName, shade] = keys;
          const shadeValue = colors.palette[colorName]?.[Number(shade)];
          return typeof shadeValue === 'string' ? shadeValue : token;
        } else if (keys.length === 3) {
          // e.g., "color.blue.500.200" -> palette color with alpha
          // Use color-mix() to apply alpha via CSS variables
          const [colorName, shade, alphaStr] = keys;
          const alpha = parseInt(alphaStr, 10);
          if (!isNaN(alpha)) {
            const percentage = Math.round((alpha / 1000) * 100);
            return `color-mix(in srgb, var(--color-${colorName}-${shade}) ${percentage}%, transparent)`;
          }
        }
      }

      // Resolve theme.* tokens (recursive resolution)
      if (token.startsWith(THEME_PREFIX)) {
        const themeKey = token.substring(THEME_PREFIX.length) as keyof Theme;
        const themeValue = mergedTheme[themeKey];
        if (typeof themeValue === 'string') {
          return resolveColorToken(themeValue);
        }
      }

      return token;
    },
    [currentColors, mergedTheme]
  );

  // The mode is now handled by the data-attribute on the container

  // --- Memoized getColor function - Revised for Robustness ---
  const getColor = useCallback(
    (name: string, override?: Override): string => {
      if (!name || typeof name !== 'string') return String(name); // Handle invalid input
      if (name === TRANSPARENT) return name;

      // 1. Check for optimization (CSS vars) if no overrides
      // This allows instant theme switching via CSS variables without re-render
      if (!override || Object.keys(override).length === 0) {
        if (name.startsWith(THEME_PREFIX)) {
          return `var(--${name.replace(/\./g, '-')})`;
        }
        if (name.startsWith(COLOR_PREFIX)) {
          const parts = name.split('.');
          // Simple lookup (e.g. color.blue or color.blue.500)
          if (parts.length < 4) {
            return `var(--${name.replace(/\./g, '-')})`;
          }
        }
      }

      // 2. Manual Resolution (Fallback for overrides or complex keys)
      const effectiveMode = override?.themeMode ?? themeMode;
      const needCache = override && Object.keys(override).length === 0;
      const cacheKey = `${name}-${effectiveMode}`;

      if (needCache && colorCache.has(cacheKey)) {
        return colorCache.get(cacheKey)!;
      }

      // Strict Mode Check
      if (
        strict &&
        !name.startsWith(COLOR_PREFIX) &&
        !name.startsWith(THEME_PREFIX) &&
        !name.startsWith('light.') &&
        !name.startsWith('dark.')
      ) {
        console.warn(
          `[Theme] Strict mode enabled: '${name}' is not a valid color token.`
        );
      }

      // 3. Select the correct color set (light/dark) based on the effective mode
      const colorsToUse = themeColors[effectiveMode];
      if (!colorsToUse) {
        console.warn(`Color set for mode "${effectiveMode}" not found.`);
        return name;
      }

      let resolvedColor = name;

      try {
        // Resolve "light.*" or "dark.*" paths directly
        if (name.startsWith('light.') || name.startsWith('dark.')) {
          const prefixLength = name.startsWith('light.') ? 6 : 5;
          const modifiedName = `${COLOR_PREFIX}${name.substring(prefixLength)}`;
          return `var(--${modifiedName.replace(/\./g, '-')})`;
        }

        // Resolve "color.*" paths
        if (name.startsWith(COLOR_PREFIX)) {
          const keys = name.substring(COLOR_PREFIX.length).split('.');

          if (keys.length === 3) {
            // e.g. "color.black.900.200" (alpha)
            const [colorName, variant, alphaStr] = keys;
            const palette = deepMerge(
              colorsToUse.palette,
              override?.colors?.palette || {}
            );
            const shadeValue = palette?.[colorName]?.[variant];
            const alpha = parseInt(alphaStr, 10);

            if (typeof shadeValue === 'string' && !isNaN(alpha)) {
              resolvedColor = convertToRgba(shadeValue, alpha);
            }
          } else if (keys.length === 2) {
            // e.g. "color.blue.500"
            const [colorName, variant] = keys;
            const palette = deepMerge(
              colorsToUse.palette,
              override?.colors?.palette || {}
            );
            const shadeValue = palette?.[colorName]?.[variant];

            if (typeof shadeValue === 'string') {
              resolvedColor = shadeValue;
            }
          } else if (keys.length === 1) {
            // e.g. "color.blue"
            const [colorName] = keys;
            const main = deepMerge(
              colorsToUse.main,
              override?.colors?.main || {}
            );
            const colorValue = main?.[colorName];

            if (typeof colorValue === 'string') {
              resolvedColor = colorValue;
            }
          }
        }
      } catch (e) {
        console.error(`Error resolving color "${name}"`, e);
        resolvedColor = name;
      }

      if (needCache) colorCache.set(cacheKey, resolvedColor);
      return resolvedColor;
    },
    [mergedTheme, themeColors, themeMode, colorCache, strict]
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

      // Resolve theme.* tokens to get the underlying color token
      let colorToken = name;
      if (name.startsWith(THEME_PREFIX)) {
        const themeKey = name.substring(THEME_PREFIX.length) as keyof Theme;
        const themeValue = effectiveTheme[themeKey];
        if (typeof themeValue === 'string') {
          colorToken = themeValue;
        }
      }

      // Handle light.* or dark.* prefixes
      if (colorToken.startsWith('light.') || colorToken.startsWith('dark.')) {
        const prefixLength = colorToken.startsWith('light.') ? 6 : 5;
        colorToken = `${COLOR_PREFIX}${colorToken.substring(prefixLength)}`;
      }

      // Extract color scheme from color.* tokens (e.g., color.blue.500 -> 'blue')
      if (colorToken.startsWith(COLOR_PREFIX)) {
        const keys = colorToken.substring(COLOR_PREFIX.length).split('.');
        if (keys.length >= 1) {
          return keys[0]; // Return the color scheme name (e.g., 'blue', 'pink')
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

  return (
    <ThemeContext.Provider value={contextValue}>
      <style>
        {generateCSSVariables(mergedTheme, themeColors.light, themeColors.dark)}
      </style>
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
