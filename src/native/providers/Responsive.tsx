import React, {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  LayoutChangeEvent,
  View as RNView,
  StyleProp,
  ViewStyle,
  useWindowDimensions as useRNWindowDimensions,
} from 'react-native';

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
  /**
   * True when the responsive values come from a measured container
   * (`<Responsive container>`) rather than the screen. Mirrors the web flag so
   * the cross-platform contract stays identical.
   */
  containerScoped?: boolean;
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

export interface ResponsiveProps {
  children?: ReactNode;
  /**
   * Drive responsiveness from this boundary's own measured width (via
   * `onLayout`) instead of the screen. The `media` prop and hooks
   * (`useResponsive`, `useBreakpoint`) inside then follow this box.
   */
  container?: boolean;
  /** Pin the breakpoint for this subtree. Takes precedence over `container`. */
  forceBreakpoint?: string;
  /** Pin the device for this subtree. Takes precedence over `container`. */
  responsiveMode?: DeviceType;
  /** Override the breakpoint thresholds for this scope (defaults to inherited). */
  breakpoints?: ResponsiveConfig;
  /** Override the device map for this scope (defaults to inherited). */
  devices?: DeviceConfig;
  /** Style applied to the wrapper view (container mode only). */
  style?: StyleProp<ViewStyle>;
}

/**
 * Native counterpart of the web `<Responsive>` boundary. Scopes responsive
 * behavior to a measured container (`onLayout`) or a forced value, instead of
 * the screen. The native `media` prop is JS-resolved (see `useNativeStyle`), so
 * overriding the context here is enough for both styles and hooks to adapt.
 */
export const Responsive = ({
  children,
  container = false,
  forceBreakpoint,
  responsiveMode,
  breakpoints: breakpointsProp,
  devices: devicesProp,
  style,
}: ResponsiveProps) => {
  const parent = useContext(BreakpointContext);
  const parentDimensions = useContext(WindowDimensionsContext);

  const breakpoints = breakpointsProp || parent.breakpoints;
  const devices = devicesProp || parent.devices;
  const mediaQueries = breakpointsProp
    ? getMediaQueries(breakpointsProp)
    : parent.mediaQueries;

  const isForced = forceBreakpoint != null || responsiveMode != null;
  const isContainer = container && !isForced;

  const [measured, setMeasured] = useState<WindowDimensions | null>(null);

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setMeasured((prev) =>
      prev && prev.width === width && prev.height === height
        ? prev
        : { width, height }
    );
  };

  let currentBreakpoint: string;
  let currentDevice: DeviceType;
  if (forceBreakpoint != null) {
    currentBreakpoint = forceBreakpoint;
    currentDevice = getDeviceFromBreakpoint(forceBreakpoint, devices);
  } else if (responsiveMode != null) {
    currentDevice = responsiveMode;
    const list = devices[responsiveMode];
    currentBreakpoint =
      (list && list[0]) || (parent.currentBreakpoint as string);
  } else if (isContainer) {
    currentBreakpoint = getBreakpointFromWidth(
      measured?.width ?? 0,
      breakpoints
    );
    currentDevice = getDeviceFromBreakpoint(currentBreakpoint, devices);
  } else {
    currentBreakpoint = parent.currentBreakpoint as string;
    currentDevice = parent.currentDevice;
  }

  const width = isContainer ? (measured?.width ?? 0) : parentDimensions.width;
  const height = isContainer
    ? (measured?.height ?? 0)
    : parentDimensions.height;
  const orientation: ScreenOrientation = isContainer
    ? width >= height
      ? 'landscape'
      : 'portrait'
    : parent.orientation;

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

  const content = (
    <BreakpointContext.Provider value={breakpointValue}>
      <WindowDimensionsContext.Provider value={windowValue}>
        <ResponsiveContext.Provider value={responsiveValue}>
          {children}
        </ResponsiveContext.Provider>
      </WindowDimensionsContext.Provider>
    </BreakpointContext.Provider>
  );

  if (!isContainer) {
    return content;
  }

  return (
    <RNView style={style} onLayout={onLayout}>
      {content}
    </RNView>
  );
};
