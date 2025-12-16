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

      width: 100%;
      height: 100%;
      transition: background-color 0.2s, color 0.2s;
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

  // --- Memoize Context Value ---
  const contextValue = useMemo(
    () => ({
      getColor,
      theme: mergedTheme,
      colors: currentColors,
      themeMode,
      setThemeMode,
    }),
    [getColor, mergedTheme, currentColors, themeMode]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <style data-theme={themeMode}>
        {generateCSSVariables(mergedTheme, themeColors.light, themeColors.dark)}
      </style>
      {children}
    </ThemeContext.Provider>
  );
};
