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
  ColorConfig,
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

interface ThemeContextProps {
  // Signature allows overriding the mode for a specific lookup
  getColor: (name: string, override?: Override) => string;
  theme: Theme;
  colors: Colors; // Current mode's colors
  themeMode: 'light' | 'dark';
  setThemeMode: (mode: 'light' | 'dark') => void;
}

// --- Default Configuration ---
export const defaultThemeMain: ColorConfig = {
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
export const ThemeContext = createContext<ThemeContextProps>(null!);

// --- Custom Hook ---
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
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

// --- ThemeProvider Component ---
interface ThemeProviderProps {
  theme?: Partial<Theme>;
  dark?: Partial<Colors>;
  light?: Partial<Colors>;
  mode?: 'light' | 'dark';
  children: ReactNode;
}

export const ThemeProvider = ({
  theme: themeOverride = {},
  mode: initialMode = 'light',
  dark: darkOverride = {},
  light: lightOverride = {},
  children,
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
  const mergedTheme = useMemo(
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

  // --- Memoized getColor function - Revised for Robustness ---
  const getColor = useCallback(
    (name: string, override: Override = {}): string => {
      if (!name || typeof name !== 'string') return String(name); // Handle invalid input
      if (name === TRANSPARENT) return name;

      // 1. Determine the effective mode for this specific lookup
      const effectiveMode = override.themeMode ?? themeMode;

      const needCache = Object.keys(override).length === 0;
      // 2. Create a cache key based on the name and the *effective* mode
      const cacheKey = `${name}-${effectiveMode}`;
      if (colorCache.has(cacheKey) && needCache) {
        return colorCache.get(cacheKey)!;
      }

      // 3. Select the correct color set (light/dark) based on the effective mode
      const colorsToUse = themeColors[effectiveMode];
      if (!colorsToUse) {
        console.warn(`Color set for mode "${effectiveMode}" not found.`);
        return name; // Fallback if colors for the mode don't exist
      }

      let resolvedColor = name; // Default fallback is the original name

      try {
        // --- Resolve "theme.*" paths ---
        if (name.startsWith(THEME_PREFIX)) {
          // console.log(
          //   `Resolving color "${name}" for mode "${effectiveMode}".`,
          //   override
          // );

          const keys = name.substring(THEME_PREFIX.length).split('.');
          let value: any = deepMerge(mergedTheme, override.theme || {});

          for (const key of keys) {
            if (value === undefined || value === null) break; // Stop if path breaks
            value = value[key];
          }

          if (typeof value === 'string' && value !== name) {
            // Recursively resolve if it points to another color string.
            // CRITICAL: Pass the *same* effectiveMode down.
            resolvedColor = getColor(value, override);
          } else if (value === undefined) {
            console.warn(`Theme path "${name}" not found.`);
            resolvedColor = name; // Fallback
          } else if (typeof value !== 'string') {
            console.warn(
              `Theme path "${name}" resolved to a non-string value.`
            );
            resolvedColor = name; // Fallback
          }
          // If value === name, it resolved to itself, keep fallback

          // --- Resolve "color.*" paths ---
        } else if (name.startsWith(COLOR_PREFIX)) {
          // console.log(
          //   `Resolving color "${name}" for mode "${effectiveMode}".`,
          //   override
          // );
          const keys = name.substring(COLOR_PREFIX.length).split('.');

          if (keys.length === 1) {
            // e.g., "color.white"
            const colorName = keys[0];
            const main = deepMerge(
              colorsToUse.main,
              override.colors?.main || {}
            );
            const colorValue = main?.[colorName]; // Use optional chaining
            if (typeof colorValue === 'string') {
              resolvedColor = colorValue;
            } else {
              console.warn(
                `Singleton color "${name}" not found in ${effectiveMode} mode.`
              );
            }
          } else if (keys.length === 2) {
            // e.g., "color.blue.500"
            const [colorName, variant] = keys;
            const palette = deepMerge(
              colorsToUse.palette,
              override.colors?.palette || {}
            );
            const shadeValue = palette?.[colorName]?.[variant as any];
            if (typeof shadeValue === 'string') {
              resolvedColor = shadeValue;
            } else {
              console.warn(
                `Palette color "${name}" not found in ${effectiveMode} mode.`
              );
            }
          } else {
            console.warn(
              `Invalid color format: "${name}". Expected 'color.name' or 'color.name.shade'.`
            );
          }
        }
        // --- Direct Color Value ---
        // If it's not theme.* or color.*, assume it's a direct value ('red', '#fff').
        // resolvedColor remains 'name', which is correct.
      } catch (e) {
        console.error(
          `Error resolving color "${name}" for mode "${effectiveMode}":`,
          e
        );
        resolvedColor = name; // Fallback on unexpected error
      }

      // Cache the result (the resolved color or the original name if failed)
      if (needCache) colorCache.set(cacheKey, resolvedColor);
      return resolvedColor;
    },
    // Dependencies: mergedTheme, themeColors, themeMode (for default), colorCache
    [mergedTheme, themeColors, themeMode, colorCache]
  );

  // --- Memoize Context Value ---
  const contextValue = useMemo(
    () => ({
      getColor, // Provide the robust getColor
      theme: mergedTheme,
      colors: currentColors, // Provide current mode's resolved colors
      themeMode,
      setThemeMode, // Stable function reference from useState
    }),
    [getColor, mergedTheme, currentColors, themeMode] // Exclude setThemeMode (stable)
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
