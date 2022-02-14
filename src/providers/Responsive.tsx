import React, { ReactNode, createContext, useContext } from 'react';

export type ScreenSizeRange = {
  breakpoint: string;
  min: number;
  max?: number;
};
export type ResponsiveConfig = Record<string, number>;
const defaultBreakpointsConfig: ResponsiveConfig = {
  xs: 0,
  sm: 340,
  md: 560,
  lg: 1080,
  xl: 1300,
};

export type DeviceConfig = Record<string, string[]>;
export type QueryConfig = Record<string, string>;
const defaultDeviceConfig: DeviceConfig = {
  mobile: ['xs', 'sm'],
  tablet: ['md', 'lg'],
  desktop: ['lg', 'xl'],
};

export type ScreenConfig = {
  breakpoints: ResponsiveConfig;
  devices: DeviceConfig;
  mediaQueries: QueryConfig;
};

export type ScreenOrientation = 'landscape' | 'portrait';

const getMediaQueries = (b: ResponsiveConfig) => {
  const defaultKeys = Object.keys(b);

  const breakpointValue = defaultKeys
    .map((breakpoint) => {
      const value: ScreenSizeRange = {
        breakpoint: breakpoint as keyof typeof b,
        min: b[breakpoint],
        max: 0,
      };

      return value;
    })
    .sort((a, b) => a.min - b.min);

  breakpointValue.reduce((a, b) => {
    if (b) a.max = b.min;

    return b;
  });

  const query: Record<keyof typeof defaultBreakpointsConfig, string> = {};
  breakpointValue.map((sizeScreen) => {
    query[sizeScreen.breakpoint] = `only screen ${
      sizeScreen.min && sizeScreen.min >= 0
        ? 'and (min-width:' + sizeScreen.min + 'px)'
        : ''
    } ${
      sizeScreen.max && sizeScreen.max >= 0
        ? 'and (max-width:' + sizeScreen.max + 'px)'
        : ''
    }`;
  });

  return query;
};

const defaultScreenConfig: ScreenConfig = {
  breakpoints: defaultBreakpointsConfig,
  devices: defaultDeviceConfig,
  mediaQueries: getMediaQueries(defaultBreakpointsConfig),
};

export const ResponsiveContext =
  createContext<ScreenConfig>(defaultScreenConfig);

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
