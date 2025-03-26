// ResponsiveContext.tsx
import React, {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';

// Define Types
export type ResponsiveConfig = Record<string, number>;

const defaultBreakpointsConfig: ResponsiveConfig = {
  xs: 0,
  sm: 340,
  md: 560,
  lg: 1080,
  xl: 1300,
};

export type ScreenOrientation = 'landscape' | 'portrait';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

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
  currentWidth: number;
  currentHeight: number;
  currentBreakpoint: keyof ResponsiveConfig;
  currentDevice: DeviceType;
  orientation: ScreenOrientation;
};

// Helper Function to Generate Media Queries
const getMediaQueries = (breakpoints: ResponsiveConfig): QueryConfig => {
  const sortedBreakpoints = Object.keys(breakpoints)
    .map((key) => ({
      breakpoint: key as keyof ResponsiveConfig,
      min: breakpoints[key],
      max: undefined as number | undefined,
    }))
    .sort((a, b) => a.min - b.min);

  for (let i = 0; i < sortedBreakpoints.length - 1; i++) {
    sortedBreakpoints[i].max = sortedBreakpoints[i + 1].min - 1;
  }

  const queries: Record<string, string> = {};

  sortedBreakpoints.forEach((bp) => {
    let mediaQuery = 'only screen';
    if (bp.min > 0) {
      mediaQuery += ` and (min-width: ${bp.min}px)`;
    }
    if (bp.max !== undefined) {
      mediaQuery += ` and (max-width: ${bp.max}px)`;
    }
    queries[bp.breakpoint] = mediaQuery.trim();
  });

  return queries;
};

// Utility Function to Determine Current Device Type
const determineCurrentDevice = (
  breakpoint: keyof ResponsiveConfig,
  devices: DeviceConfig
): DeviceType => {
  for (const device in devices) {
    if (devices[device as DeviceType].includes(breakpoint)) {
      return device as DeviceType;
    }
  }
  return 'desktop'; // Default to desktop if not found
};

// Debounce Function to Optimize Resize Handling
export const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Create the Context with default values
export const ResponsiveContext = createContext<ScreenConfig>({
  breakpoints: defaultBreakpointsConfig,
  devices: defaultDeviceConfig,
  mediaQueries: getMediaQueries(defaultBreakpointsConfig),
  currentWidth: 0,
  currentHeight: 0,
  currentBreakpoint: 'xs',
  currentDevice: 'mobile',
  orientation: 'portrait',
});

// Custom Hook to Access the Responsive Context
export const useResponsiveContext = (): ScreenConfig =>
  useContext(ResponsiveContext);
export const ResponsiveProvider = ({
  breakpoints = defaultBreakpointsConfig,
  devices = defaultDeviceConfig,
  children,
}: {
  breakpoints?: ResponsiveConfig;
  devices?: DeviceConfig;
  children: ReactNode;
}) => {
  const [screen, setScreen] = useState('xs');
  const [orientation, setOrientation] = useState(
    'portrait' as ScreenOrientation
  );
  const mediaQueries = useMemo(
    () => getMediaQueries(breakpoints),
    [breakpoints]
  );

  useEffect(() => {
    const listeners: Array<() => void> = [];
    for (const screenSize in mediaQueries) {
      const mql = window.matchMedia(mediaQueries[screenSize]);
      const onChange = () => mql.matches && setScreen(screenSize);
      mql.addListener(onChange);
      if (mql.matches) setScreen(screenSize);
      listeners.push(() => mql.removeListener(onChange));
    }
    const orientationMql = window.matchMedia('(orientation: landscape)');
    const onOrientationChange = () =>
      setOrientation(orientationMql.matches ? 'landscape' : 'portrait');
    orientationMql.addListener(onOrientationChange);
    onOrientationChange();
    listeners.push(() => orientationMql.removeListener(onOrientationChange));

    return () => listeners.forEach((cleanup) => cleanup());
  }, [breakpoints]);

  const value = useMemo(
    () => ({
      breakpoints,
      devices,
      mediaQueries,
      currentWidth: window.innerWidth,
      currentHeight: window.innerHeight,
      currentBreakpoint: screen,
      currentDevice: determineCurrentDevice(screen, devices),
      orientation,
    }),
    [breakpoints, devices, screen, orientation]
  );

  return (
    <ResponsiveContext.Provider value={value}>
      {children}
    </ResponsiveContext.Provider>
  );
};
