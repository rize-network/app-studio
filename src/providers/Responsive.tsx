// ResponsiveContext.tsx
import React, {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useRef,
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

// Split context types for optimized re-renders
// BreakpointConfig changes rarely (only when crossing breakpoint thresholds)
export type BreakpointConfig = {
  breakpoints: ResponsiveConfig;
  devices: DeviceConfig;
  mediaQueries: QueryConfig;
  currentBreakpoint: keyof ResponsiveConfig;
  currentDevice: DeviceType;
  orientation: ScreenOrientation;
};

// WindowDimensions changes often (on every resize)
export type WindowDimensions = {
  width: number;
  height: number;
};

// Combined ScreenConfig for backward compatibility
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
  const sortedBreakpoints = Object.entries(breakpoints).sort(
    ([, a], [, b]) => b - a
  ); // Sort descending by min value

  for (const [name, minWidth] of sortedBreakpoints) {
    if (width >= minWidth) {
      return name;
    }
  }
  const fallback = sortedBreakpoints[sortedBreakpoints.length - 1]?.[0] || 'xs';
  return fallback;
};

// ============================================================================
// SPLIT CONTEXTS FOR OPTIMIZED RE-RENDERS
// ============================================================================

// BreakpointContext - changes rarely (only on breakpoint threshold crossing)
const defaultBreakpointConfig: BreakpointConfig = {
  breakpoints: defaultBreakpointsConfig,
  devices: defaultDeviceConfig,
  mediaQueries: getMediaQueries(defaultBreakpointsConfig),
  currentBreakpoint: 'xs',
  currentDevice: 'mobile',
  orientation: 'portrait',
};

export const BreakpointContext = createContext<BreakpointConfig>(
  defaultBreakpointConfig
);

// WindowDimensionsContext - changes often (on every resize)
const defaultWindowDimensions: WindowDimensions = {
  width: 0,
  height: 0,
};

export const WindowDimensionsContext = createContext<WindowDimensions>(
  defaultWindowDimensions
);

// ============================================================================
// HOOKS FOR SPLIT CONTEXTS
// ============================================================================

/**
 * Hook to access breakpoint information only.
 * Components using this hook will NOT re-render on every resize,
 * only when the breakpoint actually changes.
 */
export const useBreakpointContext = (): BreakpointConfig =>
  useContext(BreakpointContext);

/**
 * Hook to access window dimensions.
 * Components using this hook WILL re-render on every resize.
 * Use sparingly - prefer useBreakpointContext when possible.
 */
export const useWindowDimensionsContext = (): WindowDimensions =>
  useContext(WindowDimensionsContext);

// ============================================================================
// LEGACY CONTEXT FOR BACKWARD COMPATIBILITY
// ============================================================================

// Create the combined Context with default values (for backward compatibility)
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

/**
 * Legacy hook for backward compatibility.
 * Prefer useBreakpointContext for better performance.
 * @deprecated Use useBreakpointContext instead for better performance
 */
export const useResponsiveContext = (): ScreenConfig =>
  useContext(ResponsiveContext);

// ============================================================================
// PROVIDER
// ============================================================================

export interface ResponsiveProviderProps {
  breakpoints?: ResponsiveConfig;
  devices?: DeviceConfig;
  children: ReactNode;
  /** Optional target window to track (for iframe support). Defaults to global window. */
  targetWindow?: Window;
}

export const ResponsiveProvider = ({
  breakpoints = defaultBreakpointsConfig,
  devices = defaultDeviceConfig,
  children,
  targetWindow,
}: ResponsiveProviderProps) => {
  const win = targetWindow || (typeof window !== 'undefined' ? window : null);

  // Track current breakpoint - only updates when crossing thresholds
  const [screen, setScreen] = useState(() => {
    if (win) {
      return getBreakpointFromWidth(win.innerWidth, breakpoints);
    }
    return 'xs';
  });

  // Track orientation - rarely changes
  const [orientation, setOrientation] = useState<ScreenOrientation>('portrait');

  // Track window dimensions - changes often
  const [dimensions, setDimensions] = useState<WindowDimensions>({
    width: win?.innerWidth || 0,
    height: win?.innerHeight || 0,
  });

  // Use ref to track previous breakpoint to avoid unnecessary state updates
  const prevBreakpointRef = useRef(screen);

  const mediaQueries = useMemo(
    () => getMediaQueries(breakpoints),
    [breakpoints]
  );

  useEffect(() => {
    if (!win) return;

    // Set initial screen size immediately based on window width
    const initialScreen = getBreakpointFromWidth(win.innerWidth, breakpoints);
    setScreen(initialScreen);
    prevBreakpointRef.current = initialScreen;

    const handleResize = () => {
      const newWidth = win.innerWidth;
      const newHeight = win.innerHeight;

      // Always update dimensions (WindowDimensionsContext will re-render)
      setDimensions({ width: newWidth, height: newHeight });

      // Only update breakpoint if it actually changed
      // This prevents BreakpointContext from causing unnecessary re-renders
      const newScreen = getBreakpointFromWidth(newWidth, breakpoints);
      if (newScreen !== prevBreakpointRef.current) {
        prevBreakpointRef.current = newScreen;
        setScreen(newScreen);
      }
    };

    const debouncedResize = debounce(handleResize, 100);
    win.addEventListener('resize', debouncedResize);

    // Set up orientation listener
    const orientationMql = win.matchMedia('(orientation: landscape)');
    const onOrientationChange = () =>
      setOrientation(orientationMql.matches ? 'landscape' : 'portrait');

    if (orientationMql.addEventListener) {
      orientationMql.addEventListener('change', onOrientationChange);
    } else {
      orientationMql.addListener(onOrientationChange);
    }

    onOrientationChange();

    return () => {
      win.removeEventListener('resize', debouncedResize);
      if (orientationMql.removeEventListener) {
        orientationMql.removeEventListener('change', onOrientationChange);
      } else {
        orientationMql.removeListener(onOrientationChange);
      }
    };
  }, [breakpoints, win]);

  // Breakpoint context value - only updates when breakpoint/orientation changes
  const breakpointValue = useMemo<BreakpointConfig>(
    () => ({
      breakpoints,
      devices,
      mediaQueries,
      currentBreakpoint: screen,
      currentDevice: determineCurrentDevice(screen, devices),
      orientation,
    }),
    [breakpoints, devices, mediaQueries, screen, orientation]
  );

  // Window dimensions context value - updates on every resize
  const dimensionsValue = useMemo<WindowDimensions>(
    () => ({
      width: dimensions.width,
      height: dimensions.height,
    }),
    [dimensions.width, dimensions.height]
  );

  // Combined legacy context value for backward compatibility
  const legacyValue = useMemo<ScreenConfig>(
    () => ({
      breakpoints,
      devices,
      mediaQueries,
      currentWidth: dimensions.width,
      currentHeight: dimensions.height,
      currentBreakpoint: screen,
      currentDevice: determineCurrentDevice(screen, devices),
      orientation,
    }),
    [breakpoints, devices, mediaQueries, dimensions, screen, orientation]
  );

  return (
    <BreakpointContext.Provider value={breakpointValue}>
      <WindowDimensionsContext.Provider value={dimensionsValue}>
        <ResponsiveContext.Provider value={legacyValue}>
          {children}
        </ResponsiveContext.Provider>
      </WindowDimensionsContext.Provider>
    </BreakpointContext.Provider>
  );
};
