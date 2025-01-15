import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import {
  ColorConfig,
  ColorPalette,
  ColorSingleton,
  defaultDarkColors,
  defaultLightColors,
  palette,
} from '../utils/colors';

// Extend Colors to include the palette
interface Colors {
  main: ColorSingleton;
  palette: ColorPalette;
}

// Theme Interfaces
interface Theme {
  main: ColorConfig;
  components?: Record<string, Record<string, any>>;
}

interface ThemeContextProps {
  getColor: (color: string, themeMode?: 'light' | 'dark') => string;
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
  colors: { main: defaultLightColors, palette: palette },
  theme: { main: defaultThemeMain, components: {} },
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

const defaultLightPalette: ColorPalette = {
  whiteAlpha: palette.whiteAlpha,
  white: palette.white,
  blackAlpha: palette.blackAlpha,
  black: palette.black,
  gray: palette.gray,
  dark: palette.dark,
  light: palette.light,
};

const defaultDarkPalette: ColorPalette = {
  whiteAlpha: palette.blackAlpha,
  white: palette.black,
  blackAlpha: palette.blackAlpha,
  black: palette.black,
  dark: palette.light,
  light: palette.dark,
};

// ThemeProvider Component
export const ThemeProvider = ({
  theme = { main: defaultThemeMain, components: {} },
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

  useEffect(() => {
    setThemeMode(mode);
  }, [mode]);

  const mergedTheme = deepMerge(defaultThemeMain, theme);

  // Corrected the merging logic: light should use defaultLightColors and defaultLightPalette
  // dark should use defaultDarkColors and defaultDarkPalette
  const colors: { light: Colors; dark: Colors } = {
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
    themeMode: 'light' | 'dark' = 'light'
  ): string => {
    if (name === 'transparent') return name;

    try {
      if (name.startsWith('theme.')) {
        const keys = name.split('.');
        let value: any = mergedTheme;
        for (let i = 1; i < keys.length; i++) {
          value = value[keys[i]];
          if (value === undefined) return name;
        }
        if (typeof value === 'string') return getColor(value, themeMode);
        return name;
      } else if (name.startsWith('color.')) {
        const keys = name.split('.');
        if (keys.length === 2) {
          // Example: "color.white"
          const colorName = keys[1];
          const color = colors[themeMode].main[colorName];
          if (typeof color === 'string') {
            return color;
          }
          console.warn(`Color "${colorName}" is not a singleton color.`);
          return name;
        } else if (keys.length === 3) {
          // Example: "color.blue.500"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const [colorName, variant] = keys.slice(1);
          if (colors[themeMode].palette[colorName][Number(variant)]) {
            return colors[themeMode].palette[colorName][Number(variant)];
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
    return name; // Return the original name if not found
  };

  // Optional: Apply a CSS class or data attribute to the body for global theming
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.setAttribute('data-theme', themeMode);
    }
  }, [themeMode]);

  return (
    <ThemeContext.Provider
      value={{
        getColor,
        theme: mergedTheme,
        colors: colors[themeMode],
        themeMode,
        setThemeMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
