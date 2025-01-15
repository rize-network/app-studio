// ResponsiveContext.tsx
import React, {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
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

// Utility Function to Determine Current Breakpoint
const determineCurrentBreakpoint = (
  width: number,
  breakpoints: ResponsiveConfig
): keyof ResponsiveConfig => {
  const sortedBreakpoints = Object.keys(breakpoints)
    .map((key) => ({
      breakpoint: key as keyof ResponsiveConfig,
      min: breakpoints[key],
    }))
    .sort((a, b) => a.min - b.min);

  let current = sortedBreakpoints[0].breakpoint;

  for (let i = 0; i < sortedBreakpoints.length; i++) {
    if (width >= sortedBreakpoints[i].min) {
      current = sortedBreakpoints[i].breakpoint;
    } else {
      break;
    }
  }

  return current;
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

// ResponsiveProvider Component
export const ResponsiveProvider = ({
  breakpoints = defaultBreakpointsConfig,
  devices = defaultDeviceConfig,
  children,
}: {
  breakpoints?: ResponsiveConfig;
  devices?: DeviceConfig;
  children?: ReactNode;
}): React.ReactElement => {
  // Initialize State with Window Dimensions or Default Values
  const getInitialDimensions = (): {
    width: number;
    height: number;
    orientation: ScreenOrientation;
  } => {
    if (typeof window !== 'undefined') {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
        orientation:
          window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
      };
    } else {
      // Default values for SSR
      return {
        width: breakpoints.xs,
        height: 800, // Arbitrary default height
        orientation: 'portrait',
      };
    }
  };

  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
    orientation: ScreenOrientation;
  }>(getInitialDimensions());

  // Update Window Dimensions on Resize
  const handleResize = useCallback(
    debounce(() => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
        orientation:
          window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
      });
    }, 150), // Debounce delay of 150ms
    []
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
    return undefined;
  }, [handleResize]);

  // Determine Current Breakpoint
  const currentBreakpoint = useMemo(
    () => determineCurrentBreakpoint(windowSize.width, breakpoints),
    [windowSize.width, breakpoints]
  );

  // Determine Current Device
  const currentDevice = useMemo(
    () => determineCurrentDevice(currentBreakpoint, devices),
    [currentBreakpoint, devices]
  );

  // Generate Media Queries
  const mediaQueries = useMemo(
    () => getMediaQueries(breakpoints),
    [breakpoints]
  );

  // Compile Context Value
  const value: ScreenConfig = useMemo(
    () => ({
      breakpoints,
      devices,
      mediaQueries,
      currentWidth: windowSize.width,
      currentHeight: windowSize.height,
      currentBreakpoint,
      currentDevice,
      orientation: windowSize.orientation,
    }),
    [
      breakpoints,
      devices,
      mediaQueries,
      windowSize.width,
      windowSize.height,
      currentBreakpoint,
      currentDevice,
      windowSize.orientation,
    ]
  );

  return (
    <ResponsiveContext.Provider value={value}>
      {children}
    </ResponsiveContext.Provider>
  );
};
