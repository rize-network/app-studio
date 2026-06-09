import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { WindowSizeContext } from './providers/WindowSizeContext';
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

// Tuple signature, aligned with web: [ref, isHovered]
export function useHover<T = any>(): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [hover] = useState(false);
  return [ref, hover];
}

export function useActive<T = any>(): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [active] = useState(false);
  return [ref, active];
}

export function useFocus<T = any>(): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [focused] = useState(false);
  return [ref, focused];
}

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
