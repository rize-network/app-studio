import React, { ReactNode } from 'react';

import { createContext, useContext } from 'react';
import { palette as defaultPalette } from '../utils/colors';

type ColorConfig = Record<string, string>;

type VariantColorConfig = Record<string, Record<string, string>>;

const defaultColors: ColorConfig = {
  white: '#FFFFFF',
  black: '#000000',
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
