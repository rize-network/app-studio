import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { WindowSizeContext } from './providers/WindowSize';
import {
  BreakpointConfig,
  WindowDimensions,
  useBreakpointContext,
  useResponsiveContext,
  useWindowDimensionsContext,
} from './providers/Responsive';

export const useWindowSize = () => useContext(WindowSizeContext);

export const useBreakpoint = () => {
  const context = useBreakpointContext();
  const { currentBreakpoint: screen, devices, orientation } = context;
  const on = useCallback(
    (target: string) =>
      devices[target] ? devices[target].includes(screen) : target === screen,
    [devices, screen]
  );

  return useMemo(
    () => ({ ...context, screen, orientation, on, is: on }),
    [context, screen, orientation, on]
  );
};

export const useWindowDimensions = (): WindowDimensions =>
  useWindowDimensionsContext();

export const useResponsive = () => {
  const context = useResponsiveContext();
  const { currentBreakpoint: screen, devices, orientation } = context;
  const on = useCallback(
    (target: string) =>
      devices[target] ? devices[target].includes(screen) : target === screen,
    [devices, screen]
  );

  return useMemo(
    () => ({ ...context, screen, orientation, on, is: on }),
    [context, screen, orientation, on]
  );
};

export const useMount = (callback: () => void) => {
  useEffect(() => {
    callback();
  }, [callback]);
};

export const useHover = () => {
  const [isHovered] = useState(false);
  return { isHovered, hoverProps: {} };
};

export const useActive = () => {
  const [isActive] = useState(false);
  return { isActive, activeProps: {} };
};

export const useFocus = () => {
  const [isFocused] = useState(false);
  return { isFocused, focusProps: {} };
};

export const useClickOutside = () => ({ ref: useRef(null), isOutside: false });
export const useElementPosition = () => ({ ref: useRef(null), position: null });
export const useKeyPress = () => false;
export const useOnScreen = () => ({ ref: useRef(null), isOnScreen: true });
export const useInView = () => ({ ref: useRef(null), inView: true });
export const useIframeStyles = () => ({ iframeRef: useRef(null) });
export const useScroll = () => ({
  scrollY: 0,
  scrollX: 0,
  scrollDirection: null,
  scrollTo: () => {},
  scrollToTop: () => {},
  scrollToBottom: () => {},
});

export type { BreakpointConfig, WindowDimensions };
