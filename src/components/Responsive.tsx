import React, {
  CSSProperties,
  JSX,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  BreakpointConfig,
  BreakpointContext,
  DeviceConfig,
  DeviceType,
  ResponsiveConfig,
  ResponsiveContext,
  ScreenConfig,
  WindowDimensions,
  WindowDimensionsContext,
  determineCurrentDevice,
  getBreakpointFromWidth,
  getMediaQueries,
  useBreakpointContext,
  useWindowDimensionsContext,
} from '../providers/Responsive';

export interface ResponsiveProps {
  children?: ReactNode;
  /**
   * Drive responsiveness from this boundary's own measured width instead of the
   * window. Renders a wrapper element that establishes a CSS containment
   * context (`container-type: inline-size`), so the `media` prop inside compiles
   * to `@container` queries and hooks (`useResponsive`, `useBreakpoint`) report
   * the container's breakpoint. Use this for split views, side panels, half-width
   * chat, embedded previews, etc.
   */
  container?: boolean;
  /**
   * Pin the breakpoint for everything in this subtree (e.g. `"sm"`). Takes
   * precedence over `container` and the window. No measurement happens.
   */
  forceBreakpoint?: string;
  /**
   * Pin the device for everything in this subtree. Takes precedence over
   * `container` and the window. Only real device names are accepted.
   */
  responsiveMode?: DeviceType;
  /** Override the breakpoint thresholds for this scope (defaults to inherited). */
  breakpoints?: ResponsiveConfig;
  /** Override the device map for this scope (defaults to inherited). */
  devices?: DeviceConfig;
  /** Tag rendered for the wrapper element in `container` mode. Default `'div'`. */
  as?: keyof JSX.IntrinsicElements;
  /** Style applied to the wrapper element (container mode only). */
  style?: CSSProperties;
  /** className applied to the wrapper element (container mode only). */
  className?: string;
}

// useLayoutEffect warns during SSR; fall back to useEffect on the server so the
// initial container measurement stays warning-free.
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Scopes responsive behavior to a container or a forced value, instead of the
 * global window. Wrap a constrained region with it:
 *
 * @example Adapt to the container's width
 * <Responsive container style={{ width: '50%' }}>
 *   <Chat /> // useResponsive() + media prop now follow this box
 * </Responsive>
 *
 * @example Force a breakpoint / device
 * <Responsive forceBreakpoint="sm"><Panel /></Responsive>
 * <Responsive responsiveMode="mobile"><Panel /></Responsive>
 */
export const Responsive: React.FC<ResponsiveProps> = ({
  children,
  container = false,
  forceBreakpoint,
  responsiveMode,
  breakpoints: breakpointsProp,
  devices: devicesProp,
  as: As = 'div',
  style,
  className,
}) => {
  const parentBreakpoint = useBreakpointContext();
  const parentDimensions = useWindowDimensionsContext();

  const breakpoints = breakpointsProp || parentBreakpoint.breakpoints;
  const devices = devicesProp || parentBreakpoint.devices;
  const mediaQueries = useMemo(
    () =>
      breakpointsProp
        ? getMediaQueries(breakpointsProp)
        : parentBreakpoint.mediaQueries,
    [breakpointsProp, parentBreakpoint.mediaQueries]
  );

  const isForced = forceBreakpoint != null || responsiveMode != null;
  // Container measurement only happens when not forced.
  const isContainer = container && !isForced;

  const ref = useRef<HTMLElement | null>(null);
  const [measured, setMeasured] = useState<WindowDimensions | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (!isContainer) {
      setMeasured(null);
      return;
    }
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;

    const update = (width: number, height: number) =>
      setMeasured((prev) =>
        prev && prev.width === width && prev.height === height
          ? prev
          : { width, height }
      );

    // Synchronous first measurement avoids a frame of the wrong breakpoint.
    const rect = el.getBoundingClientRect();
    update(rect.width, rect.height);

    const observer = new ResizeObserver((entries) => {
      const entry = entries[entries.length - 1];
      if (entry) update(entry.contentRect.width, entry.contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [isContainer]);

  // Resolve the breakpoint / device for this scope.
  let currentBreakpoint: string;
  let currentDevice: DeviceType;
  if (forceBreakpoint != null) {
    currentBreakpoint = forceBreakpoint;
    currentDevice = determineCurrentDevice(forceBreakpoint, devices);
  } else if (responsiveMode != null) {
    currentDevice = responsiveMode;
    const list = devices[responsiveMode];
    currentBreakpoint =
      (list && list[0]) || (parentBreakpoint.currentBreakpoint as string);
  } else if (isContainer) {
    currentBreakpoint = getBreakpointFromWidth(
      measured?.width ?? 0,
      breakpoints
    );
    currentDevice = determineCurrentDevice(currentBreakpoint, devices);
  } else {
    currentBreakpoint = parentBreakpoint.currentBreakpoint as string;
    currentDevice = parentBreakpoint.currentDevice;
  }

  const width = isContainer ? (measured?.width ?? 0) : parentDimensions.width;
  const height = isContainer
    ? (measured?.height ?? 0)
    : parentDimensions.height;
  const orientation = isContainer
    ? width >= height
      ? 'landscape'
      : 'portrait'
    : parentBreakpoint.orientation;

  const breakpointValue = useMemo<BreakpointConfig>(
    () => ({
      breakpoints,
      devices,
      mediaQueries,
      currentBreakpoint,
      currentDevice,
      orientation,
      containerScoped: isContainer,
    }),
    [
      breakpoints,
      devices,
      mediaQueries,
      currentBreakpoint,
      currentDevice,
      orientation,
      isContainer,
    ]
  );

  const dimensionsValue = useMemo<WindowDimensions>(
    () => ({ width, height }),
    [width, height]
  );

  const legacyValue = useMemo<ScreenConfig>(
    () => ({
      breakpoints,
      devices,
      mediaQueries,
      currentWidth: width,
      currentHeight: height,
      currentBreakpoint,
      currentDevice,
      orientation,
      containerScoped: isContainer,
    }),
    [
      breakpoints,
      devices,
      mediaQueries,
      width,
      height,
      currentBreakpoint,
      currentDevice,
      orientation,
      isContainer,
    ]
  );

  const content = (
    <BreakpointContext.Provider value={breakpointValue}>
      <WindowDimensionsContext.Provider value={dimensionsValue}>
        <ResponsiveContext.Provider value={legacyValue}>
          {children}
        </ResponsiveContext.Provider>
      </WindowDimensionsContext.Provider>
    </BreakpointContext.Provider>
  );

  if (!isContainer) {
    return content;
  }

  const Tag = As as any;
  return (
    <Tag
      ref={ref}
      className={className}
      style={{ containerType: 'inline-size', ...style }}
    >
      {content}
    </Tag>
  );
};
