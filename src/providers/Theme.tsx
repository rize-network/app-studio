import React, { ReactNode } from 'react';

import { createContext, useContext } from 'react';
import { palette as defaultPalette } from '../utils/colors';

type ColorConfig = Record<string, string>;

type VariantColorConfig = Record<string, Record<string, string>>;

const defaultColors: ColorConfig = {
  white: '#FFFFFF',
  black: '#000000',
  lightGrey: 'rgba(224, 224, 224, 1)',
  midGrey: 'rgba(158, 158, 158, 1)',
  darkBlueGrey: 'rgba(47, 72, 88, 1)',
  subGrey: 'rgba(66, 66, 66, 1)',
  fieldColor: 'rgba(250, 250, 250, 1)',
  textDisabled: 'rgba(115, 115, 115, 1)',
  primary: 'rgba(249, 115, 22, 1)',
  secondary: 'rgba(8, 145, 178, 1)',
  success: 'rgba(34, 197, 94, 1)',
  error: 'rgba(239, 68, 68, 1)',
  warning: ' rgba(233, 176, 19, 1)',
  disabled: 'rgba(158, 158, 158, 0.38)',
  loading: 'rgba(158, 158, 158, 1)',
};

export const ThemeContext = createContext<{
  getColor: (color: string) => string;
  colors: ColorConfig;
  palette: VariantColorConfig;
}>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  getColor: (name: string) => {
    return name;
  },
  colors: defaultColors,
  palette: defaultPalette,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({
  palette = defaultPalette,
  colors = defaultColors,
  children,
}: {
  colors?: ColorConfig;
  palette?: VariantColorConfig;
  children?: ReactNode;
}): React.ReactElement => {
  const getColor = (name: string) => {
    // console.log('getColor', name);
    if (name === 'transparent') return name;
    try {
      if (name.indexOf('.') !== -1) {
        const keys = name.split('.');

        if (palette && palette[keys[0]][keys[1]] !== undefined) {
          return palette[keys[0]][keys[1]];
        }
        if (palette[keys[0]][parseInt(keys[1])] !== undefined) {
          return palette[keys[0]][parseInt(keys[1])];
        }
      } else if (colors && colors[name] !== undefined) {
        return colors[name];
      }
    } catch (e) {
      console.log('Color ' + name + ' not found');
    }

    return name;
  };

  return (
    <ThemeContext.Provider
      value={{
        getColor,
        colors,
        palette,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
