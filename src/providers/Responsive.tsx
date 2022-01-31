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
const defaultDeviceConfig: DeviceConfig = {
  mobile: ['xs', 'sm'],
  tablet: ['md', 'lg'],
  desktop: ['lg', 'xl'],
};

export type ScreenConfig = {
  breakpoints: ResponsiveConfig;
  devices: DeviceConfig;
};

export type ScreenOrientation = 'landscape' | 'portrait';

const defaultScreenConfig: ScreenConfig = {
  breakpoints: defaultBreakpointsConfig,
  devices: defaultDeviceConfig,
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
      }}
    >
      {children}
    </ResponsiveContext.Provider>
  );
};
