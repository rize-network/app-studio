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

// Helper to compute breakpoint from width
const getBreakpointFromWidth = (
  width: number,
  breakpoints: ResponsiveConfig
): string => {
  // console.log('[ResponsiveProvider] Computing breakpoint for width:', width);
  // console.log('[ResponsiveProvider] Breakpoints config:', breakpoints);

  const sortedBreakpoints = Object.entries(breakpoints).sort(
    ([, a], [, b]) => b - a
  ); // Sort descending by min value

  // console.log('[ResponsiveProvider] Sorted breakpoints:', sortedBreakpoints);

  for (const [name, minWidth] of sortedBreakpoints) {
    if (width >= minWidth) {
      // console.log(
      //   '[ResponsiveProvider] ✓ Match found:',
      //   name,
      //   'for width',
      //   width,
      //   '>= minWidth',
      //   minWidth
      // );
      return name;
    }
  }
  const fallback = sortedBreakpoints[sortedBreakpoints.length - 1]?.[0] || 'xs';
  // console.log('[ResponsiveProvider] No match, using fallback:', fallback);
  return fallback;
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
  const [screen, setScreen] = useState(() => {
    // Initialize with correct breakpoint instead of hardcoded 'xs'
    if (typeof window !== 'undefined') {
      return getBreakpointFromWidth(window.innerWidth, breakpoints);
    }
    return 'xs';
  });
  const [orientation, setOrientation] = useState(
    'portrait' as ScreenOrientation
  );
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  const mediaQueries = useMemo(
    () => getMediaQueries(breakpoints),
    [breakpoints]
  );

  useEffect(() => {
    // console.log('[ResponsiveProvider] useEffect running - initial setup');
    // Set initial screen size immediately based on window width
    const initialScreen = getBreakpointFromWidth(
      window.innerWidth,
      breakpoints
    );
    // console.log(
    //   '[ResponsiveProvider] Setting initial screen to:',
    //   initialScreen
    // );
    setScreen(initialScreen);

    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      // console.log('[ResponsiveProvider] Resize event - new dimensions:', {
      //   width: newWidth,
      //   height: newHeight,
      // });
      setSize({ width: newWidth, height: newHeight });

      // Update screen on resize
      const newScreen = getBreakpointFromWidth(newWidth, breakpoints);
      // console.log('[ResponsiveProvider] Setting screen to:', newScreen);
      setScreen(newScreen);
    };

    const debouncedResize = debounce(handleResize, 100);
    window.addEventListener('resize', debouncedResize);

    // Set up orientation listener
    const orientationMql = window.matchMedia('(orientation: landscape)');
    const onOrientationChange = () =>
      setOrientation(orientationMql.matches ? 'landscape' : 'portrait');

    if (orientationMql.addEventListener) {
      orientationMql.addEventListener('change', onOrientationChange);
    } else {
      orientationMql.addListener(onOrientationChange);
    }

    onOrientationChange();

    return () => {
      window.removeEventListener('resize', debouncedResize);
      if (orientationMql.removeEventListener) {
        orientationMql.removeEventListener('change', onOrientationChange);
      } else {
        orientationMql.removeListener(onOrientationChange);
      }
    };
  }, [breakpoints]); // Removed mediaQueries dep since we now use direct width comparison

  const value = useMemo(() => {
    const contextValue = {
      breakpoints,
      devices,
      mediaQueries,
      currentWidth: size.width,
      currentHeight: size.height,
      currentBreakpoint: screen,
      currentDevice: determineCurrentDevice(screen, devices),
      orientation,
    };

    return contextValue;
  }, [breakpoints, devices, mediaQueries, size, screen, orientation]);

  return (
    <ResponsiveContext.Provider value={value}>
      {children}
    </ResponsiveContext.Provider>
  );
};
