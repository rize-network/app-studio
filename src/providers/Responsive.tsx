// ResponsiveContext.tsx
import React, { ReactNode, createContext, useContext } from 'react';

export type ResponsiveConfig = Record<string, number>;
const defaultBreakpointsConfig: ResponsiveConfig = {
  xs: 0,
  sm: 340,
  md: 560,
  lg: 1080,
  xl: 1300,
};

export type ScreenOrientation = 'landscape' | 'portrait';

// Inclure la fonction corrigée getMediaQueries ici
const getMediaQueries = (b: ResponsiveConfig) => {
  const sortedBreakpoints = Object.keys(b)
    .map((key) => ({
      breakpoint: key as keyof ResponsiveConfig,
      min: b[key],
      max: 0, // Initialisé à 0, sera mis à jour
    }))
    .sort((a, b) => a.min - b.min);

  // Définir les valeurs max pour chaque breakpoint sauf le dernier
  for (let i = 0; i < sortedBreakpoints.length - 1; i++) {
    sortedBreakpoints[i].max = sortedBreakpoints[i + 1].min - 1;
  }
  // Le dernier breakpoint n'a pas de max

  const query: Record<string, string> = {};
  sortedBreakpoints.forEach((sizeScreen) => {
    let mediaQuery = 'only screen';
    if (sizeScreen.min !== undefined && sizeScreen.min >= 0) {
      mediaQuery += ` and (min-width: ${sizeScreen.min}px)`;
    }
    if (sizeScreen.max !== undefined && sizeScreen.max > 0) {
      mediaQuery += ` and (max-width: ${sizeScreen.max}px)`;
    }
    query[sizeScreen.breakpoint] = mediaQuery.trim();
  });

  return query;
};

export type DeviceConfig = Record<string, string[]>;
const defaultDeviceConfig: DeviceConfig = {
  mobile: ['xs', 'sm'],
  tablet: ['md', 'lg'],
  desktop: ['lg', 'xl'],
};

export type QueryConfig = Record<string, string>;

export type ScreenConfig = {
  breakpoints: ResponsiveConfig;
  devices: DeviceConfig;
  mediaQueries: QueryConfig;
};

export const ResponsiveContext = createContext<ScreenConfig>({
  breakpoints: defaultBreakpointsConfig,
  devices: defaultDeviceConfig,
  mediaQueries: getMediaQueries(defaultBreakpointsConfig),
});

export const useResponsiveContext = () => useContext(ResponsiveContext);

export const ResponsiveProvider = ({
  breakpoints = defaultBreakpointsConfig,
  devices = defaultDeviceConfig,
  children,
}: {
  breakpoints?: ResponsiveConfig;
  devices?: DeviceConfig;
  children?: ReactNode;
}): React.ReactElement => {
  return (
    <ResponsiveContext.Provider
      value={{
        breakpoints,
        devices,
        mediaQueries: getMediaQueries(breakpoints),
      }}
    >
      {children}
    </ResponsiveContext.Provider>
  );
};
