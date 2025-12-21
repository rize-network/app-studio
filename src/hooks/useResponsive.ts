import {
  useResponsiveContext,
  useBreakpointContext,
  useWindowDimensionsContext,
  BreakpointConfig,
  WindowDimensions,
} from '../providers/Responsive';

/**
 * Optimized hook for components that only need breakpoint information.
 * This hook will NOT cause re-renders on every window resize,
 * only when the breakpoint actually changes.
 *
 * Use this hook instead of useResponsive for better performance
 * when you only need to check breakpoints or device type.
 *
 * @example
 * const { screen, on, is, orientation } = useBreakpoint();
 * if (on('mobile')) { ... }
 * if (is('xs')) { ... }
 */
export const useBreakpoint = () => {
  const context = useBreakpointContext();
  const { currentBreakpoint: screen, orientation, devices } = context;

  // Helper to check if current screen matches a breakpoint or device
  const on = (s: string) =>
    devices[s] ? devices[s].includes(screen) : s === screen;

  return {
    ...context,
    screen,
    orientation,
    on,
    is: on,
  };
};

/**
 * Hook for components that need exact window dimensions.
 * This hook WILL cause re-renders on every window resize.
 * Use sparingly - prefer useBreakpoint when possible.
 *
 * @example
 * const { width, height } = useWindowDimensions();
 */
export const useWindowDimensions = (): WindowDimensions => {
  return useWindowDimensionsContext();
};

/**
 * Combined hook that provides both breakpoint info and window dimensions.
 * This hook WILL cause re-renders on every window resize.
 *
 * For better performance, use:
 * - useBreakpoint() when you only need breakpoint/device info
 * - useWindowDimensions() when you only need exact dimensions
 *
 * @example
 * const { screen, on, currentWidth, currentHeight } = useResponsive();
 */
export const useResponsive = () => {
  const context = useResponsiveContext();
  const { currentBreakpoint: screen, orientation, devices } = context;
  const on = (s: string) =>
    devices[s] ? devices[s].includes(screen) : s === screen;
  const result = { ...context, screen, orientation, on, is: on };
  return result;
};

// Re-export types for convenience
export type { BreakpointConfig, WindowDimensions };
