import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from 'react';
import {
  ColorConfig,
  ColorPalette,
  ColorSingleton,
  defaultDarkColors,
  defaultDarkPalette,
  defaultLightColors,
  defaultLightPalette,
} from '../utils/colors';

// Extend Colors to include the palette
export interface Colors {
  main: ColorSingleton;
  palette: ColorPalette;
}

// Theme Interfaces
export interface Theme {
  primary?: string;
  secondary?: string;
  success?: string;
  error?: string;
  warning?: string;
  disabled?: string;
  loading?: string;
}

interface ThemeContextProps {
  getColor: (
    color: string,
    themeMode?: 'light' | 'dark',
    colors?: Colors
  ) => string;
  theme?: Theme;
  colors?: Colors;
  themeMode: 'light' | 'dark';
  setThemeMode: (mode: 'light' | 'dark') => void;
}

// Default Theme Configuration
export const defaultThemeMain: ColorConfig = {
  primary: 'color.black',
  secondary: 'color.blue',
  success: 'color.green.500',
  error: 'color.red.500',
  warning: 'color.orange.500',
  disabled: 'color.gray.500',
  loading: 'color.dark.500',
};

// Create Theme Context with Default Values
export const ThemeContext = createContext<ThemeContextProps>({
  getColor: (name) => name, // Removed the extra parameter
  theme: defaultThemeMain,
  themeMode: 'light',
  setThemeMode: () => {},
});

// Custom Hook to Use Theme
export const useTheme = () => useContext(ThemeContext);

// Deep Merge Function
const deepMerge = (target: any, source: any): any => {
  if (typeof source !== 'object' || source === null) {
    return target;
  }
  const merged = { ...target };
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const targetValue = target[key];
      if (Array.isArray(sourceValue)) {
        merged[key] = sourceValue;
      } else if (
        typeof sourceValue === 'object' &&
        sourceValue !== null &&
        !Array.isArray(sourceValue)
      ) {
        merged[key] = deepMerge(targetValue || {}, sourceValue);
      } else {
        merged[key] = sourceValue;
      }
    }
  }
  return merged;
};

// ThemeProvider Component
export const ThemeProvider = ({
  theme = defaultThemeMain,
  mode = 'light',
  dark = {
    main: defaultDarkColors,
    palette: defaultDarkPalette,
  },
  light = {
    main: defaultLightColors,
    palette: defaultLightPalette,
  },
  children,
}: {
  theme?: Theme;
  dark?: Colors;
  light?: Colors;
  mode?: 'light' | 'dark';
  children: ReactNode;
}): React.ReactElement => {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(mode);
  const colorCache = useRef(new Map<string, string>()).current;

  useEffect(() => {
    setThemeMode(mode);
  }, [mode]);

  const mergedTheme = deepMerge(defaultThemeMain, theme);

  // Corrected the merging logic: light should use defaultLightColors and defaultLightPalette
  // dark should use defaultDarkColors and defaultDarkPalette
  const themeColors: { light: Colors; dark: Colors } = {
    light: deepMerge(
      { main: defaultLightColors, palette: defaultLightPalette },
      light
    ),
    dark: deepMerge(
      { main: defaultDarkColors, palette: defaultDarkPalette },
      dark
    ),
  };

  const getColor = (
    name: string,
    themeMode: 'light' | 'dark' = 'light',
    optionalColors?: Colors
  ): string => {
    if (name === 'transparent') return name;
    const cacheKey = `${name}-${themeMode}`;
    if (colorCache.has(cacheKey)) return colorCache.get(cacheKey)!;

    try {
      if (name.startsWith('theme.')) {
        const keys = name.split('.');
        let value: any = mergedTheme;
        for (let i = 1; i < keys.length; i++) {
          value = value[keys[i]];
          if (value === undefined) return name;
        }
        if (typeof value === 'string') {
          const resolved = getColor(value, themeMode, optionalColors);
          colorCache.set(cacheKey, resolved);
          return resolved;
        }
      } else if (name.startsWith('color.')) {
        const keys = name.split('.');
        if (keys.length === 2) {
          // Example: "color.white"
          const colorName = keys[1];
          const colors =
            optionalColors && optionalColors.palette[colorName]
              ? optionalColors
              : themeColors[themeMode];
          const color = colors.main[colorName];
          if (typeof color === 'string') {
            colorCache.set(cacheKey, color);
            return color;
          }
          console.warn(`Color "${colorName}" is not a singleton color.`);
          return name;
        } else if (keys.length === 3) {
          // Example: "color.blue.500"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const [colorName, variant] = keys.splice(1);
          const colors =
            optionalColors && optionalColors.palette[colorName]
              ? optionalColors
              : themeColors[themeMode];
          if (colors.palette[colorName][Number(variant)]) {
            return colors.palette[colorName][Number(variant)];
          } else {
            console.warn(
              `Color "${colorName}" with shade "${variant}" not found.`
            );
          }
        }
      }
    } catch (e) {
      console.error('Error fetching color:', e);
    }
    colorCache.set(cacheKey, name);
    return name; // Return the original name if not found
  };

  // useEffect(() => {
  //   const colors = themeMode === 'light' ? light : dark;
  //   let cssString = '';

  //   Object.entries(colors.main).forEach(([name, value]) => {
  //     cssString += `--color-${name}: ${value};`;
  //   });

  //   Object.entries(colors.palette).forEach(([color, shades]) => {
  //     if (typeof shades === 'object' && shades !== null) {
  //       Object.entries(shades).forEach(([shade, value]) => {
  //         cssString += `--color-${color}-${shade}: ${String(value || '')};`;
  //       });
  //     }
  //   });

  //   const root = document.documentElement;
  //   root.setAttribute('style', cssString);
  // }, [themeMode, light, dark]);

  return (
    <ThemeContext.Provider
      value={{
        getColor,
        theme: mergedTheme,
        themeMode,
        setThemeMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
