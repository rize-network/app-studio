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

// --- CSS Variables Type ---
type CSSVariables = Record<string, string>;

// --- Helper to generate CSS variables from colors ---
const generateColorVariables = (colors: Colors): CSSVariables => {
  const vars: CSSVariables = {};

  // Process main colors (e.g., --color-white, --color-black)
  Object.entries(colors.main).forEach(([key, value]) => {
    vars[`--color-${key}`] = value;
  });

  // Process palette colors (e.g., --color-blue-500)
  Object.entries(colors.palette).forEach(([colorName, shades]) => {
    Object.entries(shades).forEach(([shade, value]) => {
      vars[`--color-${colorName}-${shade}`] = value as string;
    });
  });

  return vars;
};

// --- Helper to generate theme variables ---
const generateThemeVariables = (
  theme: Theme,
  getColorValue: (token: string) => string
): CSSVariables => {
  const vars: CSSVariables = {};

  const processThemeObject = (obj: any, prefix: string) => {
    Object.entries(obj).forEach(([key, value]) => {
      const varName = `--${prefix}-${key}`;

      if (typeof value === 'object' && value !== null) {
        processThemeObject(value, `${prefix}-${key}`);
      } else if (typeof value === 'string') {
        // Resolve color.* and theme.* references to actual values
        if (value.startsWith(COLOR_PREFIX) || value.startsWith(THEME_PREFIX)) {
          vars[varName] = getColorValue(value);
        } else {
          vars[varName] = value;
        }
      }
    });
  };

  processThemeObject(theme, 'theme');
  return vars;
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
  const containerRef = useRef<HTMLDivElement>(null);

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

  // --- Generate CSS variables for current theme mode ---
  const cssVariables = useMemo<CSSVariables>(() => {
    const vars: CSSVariables = {};

    // Add color variables for current mode
    const colorVars = generateColorVariables(currentColors);
    Object.assign(vars, colorVars);

    // Add theme variables (resolved to actual color values)
    const themeVars = generateThemeVariables(mergedTheme, resolveColorToken);
    Object.assign(vars, themeVars);

    return vars;
  }, [currentColors, mergedTheme, resolveColorToken]);

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

  // Update getColor to use the context mode for alpha lookups if needed.

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
      <div
        ref={containerRef}
        className="app-studio-theme-root"
        data-theme={themeMode}
        style={cssVariables as React.CSSProperties}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
