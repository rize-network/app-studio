import React, { ReactNode, createContext, useContext, useMemo } from 'react';
import { useWindowDimensions as useRNWindowDimensions } from 'react-native';

export type ResponsiveConfig = Record<string, number>;
export type DeviceConfig = Record<string, string[]>;
export type QueryConfig = Record<string, string>;
export type ScreenOrientation = 'landscape' | 'portrait';
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export type BreakpointConfig = {
  breakpoints: ResponsiveConfig;
  devices: DeviceConfig;
  mediaQueries: QueryConfig;
  currentBreakpoint: keyof ResponsiveConfig;
  currentDevice: DeviceType;
  orientation: ScreenOrientation;
};

export type WindowDimensions = {
  width: number;
  height: number;
};

export type ScreenConfig = BreakpointConfig & {
  currentWidth: number;
  currentHeight: number;
};

const defaultBreakpointsConfig: ResponsiveConfig = {
  xs: 0,
  sm: 340,
  md: 560,
  lg: 1080,
  xl: 1300,
};

const defaultDeviceConfig: DeviceConfig = {
  mobile: ['xs', 'sm'],
  tablet: ['md', 'lg'],
  desktop: ['lg', 'xl'],
};

function getMediaQueries(breakpoints: ResponsiveConfig): QueryConfig {
  const sorted = Object.keys(breakpoints)
    .map((breakpoint) => ({
      breakpoint,
      min: breakpoints[breakpoint],
      max: undefined as number | undefined,
    }))
    .sort((a, b) => a.min - b.min);

  for (let i = 0; i < sorted.length - 1; i++) {
    sorted[i].max = sorted[i + 1].min - 1;
  }

  return sorted.reduce<QueryConfig>((queries, item) => {
    queries[item.breakpoint] = `only screen${
      item.min > 0 ? ` and (min-width: ${item.min}px)` : ''
    }${item.max !== undefined ? ` and (max-width: ${item.max}px)` : ''}`;
    return queries;
  }, {});
}

export function getBreakpointFromWidth(
  width: number,
  breakpoints: ResponsiveConfig
) {
  const sorted = Object.entries(breakpoints).sort(([, a], [, b]) => b - a);
  const match = sorted.find(([, min]) => width >= min);
  return (match?.[0] ||
    sorted[sorted.length - 1]?.[0] ||
    'xs') as keyof ResponsiveConfig;
}

export function getDeviceFromBreakpoint(
  breakpoint: string,
  devices: DeviceConfig
): DeviceType {
  const device = Object.keys(devices).find((key) =>
    devices[key].includes(breakpoint)
  );
  return (device || 'desktop') as DeviceType;
}

const defaultBreakpointConfig: BreakpointConfig = {
  breakpoints: defaultBreakpointsConfig,
  devices: defaultDeviceConfig,
  mediaQueries: getMediaQueries(defaultBreakpointsConfig),
  currentBreakpoint: 'xs',
  currentDevice: 'mobile',
  orientation: 'portrait',
};

const defaultWindowDimensions: WindowDimensions = {
  width: 0,
  height: 0,
};

export const BreakpointContext = createContext<BreakpointConfig>(
  defaultBreakpointConfig
);
export const WindowDimensionsContext = createContext<WindowDimensions>(
  defaultWindowDimensions
);
export const ResponsiveContext = createContext<ScreenConfig>({
  ...defaultBreakpointConfig,
  currentWidth: 0,
  currentHeight: 0,
});

export const useBreakpointContext = () => useContext(BreakpointContext);
export const useWindowDimensionsContext = () =>
  useContext(WindowDimensionsContext);
export const useResponsiveContext = () => useContext(ResponsiveContext);

export interface ResponsiveProviderProps {
  breakpoints?: ResponsiveConfig;
  devices?: DeviceConfig;
  children?: ReactNode;
  targetWindow?: Window;
}

export const ResponsiveProvider = ({
  breakpoints = defaultBreakpointsConfig,
  devices = defaultDeviceConfig,
  children,
}: ResponsiveProviderProps) => {
  const dimensions = useRNWindowDimensions();
  const width = dimensions.width || 0;
  const height = dimensions.height || 0;
  const currentBreakpoint = getBreakpointFromWidth(width, breakpoints);
  const currentDevice = getDeviceFromBreakpoint(currentBreakpoint, devices);
  const orientation: ScreenOrientation =
    width >= height ? 'landscape' : 'portrait';

  const breakpointValue = useMemo<BreakpointConfig>(
    () => ({
      breakpoints,
      devices,
      mediaQueries: getMediaQueries(breakpoints),
      currentBreakpoint,
      currentDevice,
      orientation,
    }),
    [breakpoints, devices, currentBreakpoint, currentDevice, orientation]
  );

  const windowValue = useMemo<WindowDimensions>(
    () => ({ width, height }),
    [width, height]
  );

  const responsiveValue = useMemo<ScreenConfig>(
    () => ({
      ...breakpointValue,
      currentWidth: width,
      currentHeight: height,
    }),
    [breakpointValue, width, height]
  );

  return (
    <BreakpointContext.Provider value={breakpointValue}>
      <WindowDimensionsContext.Provider value={windowValue}>
        <ResponsiveContext.Provider value={responsiveValue}>
          {children}
        </ResponsiveContext.Provider>
      </WindowDimensionsContext.Provider>
    </BreakpointContext.Provider>
  );
};
