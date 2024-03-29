import React from 'react';

import { createContext, useContext } from 'react';
import { palette as defaultPalette } from '../utils/colors';

type ColorConfig = Record<string, string>;

type VariantColorConfig = Record<string, Record<string, string>>;

export const defaultThemeMain: ColorConfig = {
  primary: 'color.black',
  secondary: 'color.blue',
  success: 'color.green.500',
  error: 'color.red.500',
  warning: 'color.orange.500',
  disabled: 'color.gray.500',
  loading: 'color.dark.500',
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

export const ThemeContext = createContext<{
  getColor: (color: string) => string;
  theme?: {
    main: { [key: string]: string };
    components?: { [key: string]: { [key: string]: string } };
  };
  colors?: {
    main?: ColorConfig;
    palette?: VariantColorConfig;
  };
}>({
  getColor: (name: string): string => {
    return name;
  },
  colors: {
    main: defaultColors,
    palette: defaultPalette,
  },
  theme: { main: defaultThemeMain, components: {} },
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({
  theme = {
    main: defaultThemeMain,
    components: {},
  },
  colors = {
    main: defaultColors,
    palette: defaultPalette,
  },
  children,
}: {
  theme?: {
    main: { [key: string]: string };
    components: { [key: string]: { [key: string]: string } };
  };
  colors?: {
    main?: ColorConfig;
    palette?: VariantColorConfig;
  };
  children: any;
}): React.ReactElement => {
  const getColor = (name: string): string => {
    if (name === 'transparent') return name;

    try {
      // Si le nom commence par "theme.", nous recherchons dans les couleurs du thème
      if (name.startsWith('theme.')) {
        const keys = name.split('.');
        if (
          keys[1] !== undefined &&
          typeof theme.components[keys[1]] == 'object' &&
          theme.components[keys[1]][keys[2]] !== undefined
        ) {
          return getColor(theme.components[keys[1]][keys[2]]);
        } else if (theme.main[keys[1]] && theme.main[keys[1]] !== undefined) {
          return getColor(theme.main[keys[1]]);
        } else {
          console.log('Color ' + name + ' not found');
        }
      }
      // Si le nom commence par "color.", nous recherchons dans la palette
      else if (name.startsWith('color.')) {
        const keys = name.split('.'); // Retirer le préfixe "color."

        if (colors.palette && colors.palette[keys[1]][keys[2]] !== undefined) {
          return colors.palette[keys[1]][keys[2]];
        } else if (
          colors.palette &&
          colors.palette[keys[1]][parseInt(keys[2])] !== undefined
        ) {
          return colors.palette[keys[1]][parseInt(keys[2])];
        } else if (colors.main && colors.main[keys[1]] !== undefined) {
          return colors.main[keys[1]];
        } else {
          console.log('Color ' + name + ' not found');
        }
      }
    } catch (e) {}

    return name;
  };

  return (
    <ThemeContext.Provider
      value={{
        getColor,
        theme: {
          main: {
            ...defaultThemeMain,
            ...theme.main,
          },
          components: {
            ...theme.components,
          },
        },
        colors: {
          main: {
            ...defaultColors,
            ...colors.main,
          },
          palette: {
            ...defaultPalette,
            ...colors.palette,
          },
        },
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
