import { RefObject, useEffect, useState, useCallback, useRef } from 'react';

// Enhanced type definitions with documentation
export interface ScrollPosition {
  x: number;
  y: number;
  xProgress: number; // Value between 0 and 1
  yProgress: number; // Value between 0 and 1
}

export interface UseScrollOptions {
  container?: RefObject<HTMLElement>;
  offset?: [number, number];
  throttleMs?: number;
  // Added disabled option to conditionally disable scroll tracking
  disabled?: boolean;
}

export interface UseScrollAnimationOptions {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
  onIntersectionChange?: (isIntersecting: boolean, ratio: number) => void;
}

export interface UseInfiniteScrollOptions {
  threshold?: number;
  isLoading?: boolean;
  root?: Element | null;
  rootMargin?: string;
  // Added to prevent unnecessary rerenders
  debounceMs?: number;
}

interface ScrollDimensions {
  scrollHeight: number;
  scrollWidth: number;
  clientHeight: number;
  clientWidth: number;
  scrollTop: number;
  scrollLeft: number;
}

// Helper to check if element is a Window object (works across iframes)
const isWindow = (obj: any): obj is Window => {
  return obj && obj.window === obj;
};

// Memoized function to get scroll dimensions
const getScrollDimensions = (
  element: HTMLElement | Window
): ScrollDimensions => {
  if (isWindow(element)) {
    const doc = element.document.documentElement;
    return {
      scrollHeight: Math.max(doc.scrollHeight, doc.offsetHeight),
      scrollWidth: Math.max(doc.scrollWidth, doc.offsetWidth),
      clientHeight: element.innerHeight,
      clientWidth: element.innerWidth,
      scrollTop: element.scrollY,
      scrollLeft: element.scrollX,
    };
  }

  return {
    scrollHeight: element.scrollHeight,
    scrollWidth: element.scrollWidth,
    clientHeight: element.clientHeight,
    clientWidth: element.clientWidth,
    scrollTop: element.scrollTop,
    scrollLeft: element.scrollLeft,
  };
};

// Enhanced useScroll hook with better performance and iframe support
export const useScroll = ({
  container,
  offset = [0, 0],
  throttleMs = 100,
  disabled = false,
}: UseScrollOptions = {}): ScrollPosition => {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    x: 0,
    y: 0,
    xProgress: 0,
    yProgress: 0,
  });

  const lastUpdateRef = useRef<number>(0);
  const frameRef = useRef<number>();

  // Get the correct window context (iframe or main window)
  // The container ref is used to find the correct window context, not as the scroll target
  const getTargetWindow = useCallback((): Window | null => {
    if (container?.current) {
      // Get the window from the container's document (works in iframes)
      return container.current.ownerDocument?.defaultView ?? null;
    }
    return typeof window !== 'undefined' ? window : null;
  }, [container]);

  const handleScroll = useCallback(() => {
    if (disabled) return;

    const targetEl = container?.current;
    const targetWindow = getTargetWindow();
    const scrollTarget = targetEl || targetWindow;

    if (!scrollTarget) return;

    const now = Date.now();
    if (throttleMs > 0 && now - lastUpdateRef.current < throttleMs) {
      frameRef.current = requestAnimationFrame(handleScroll);
      return;
    }

    const dimensions = getScrollDimensions(scrollTarget);

    const x = dimensions.scrollLeft + offset[0];
    const y = dimensions.scrollTop + offset[1];
    const maxScrollX = dimensions.scrollWidth - dimensions.clientWidth;
    const maxScrollY = dimensions.scrollHeight - dimensions.clientHeight;

    const xProgress =
      maxScrollX <= 0 ? 1 : Math.min(Math.max(x / maxScrollX, 0), 1);
    const yProgress =
      maxScrollY <= 0 ? 1 : Math.min(Math.max(y / maxScrollY, 0), 1);

    setScrollPosition((prev) => {
      if (
        prev.x !== x ||
        prev.y !== y ||
        prev.xProgress !== xProgress ||
        prev.yProgress !== yProgress
      ) {
        lastUpdateRef.current = now;
        return { x, y, xProgress, yProgress };
      }
      return prev;
    });
  }, [offset, throttleMs, disabled, getTargetWindow, container]);

  useEffect(() => {
    if (disabled) return;

    const targetEl = container?.current;
    const targetWin = getTargetWindow();
    const scrollTarget = targetEl || targetWin;

    if (!scrollTarget) return;

    // Initial scroll position
    handleScroll();

    const options = { passive: true };

    // Listen on the specific target
    scrollTarget.addEventListener('scroll', handleScroll, options);

    // Always listen to resize on window for responsiveness
    if (targetWin) {
      targetWin.addEventListener('resize', handleScroll, options);
    }

    // Also listen on document for scroll if target is window (browser compatibility)
    if (isWindow(scrollTarget) && scrollTarget.document) {
      scrollTarget.document.addEventListener('scroll', handleScroll, options);
    }

    return () => {
      scrollTarget.removeEventListener('scroll', handleScroll);
      if (targetWin) {
        targetWin.removeEventListener('resize', handleScroll);
      }
      if (isWindow(scrollTarget) && scrollTarget.document) {
        scrollTarget.document.removeEventListener('scroll', handleScroll);
      }
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [handleScroll, disabled, getTargetWindow, container]);

  return scrollPosition;
};

// Enhanced useScrollAnimation with callback support
export const useScrollAnimation = (
  ref: RefObject<HTMLElement>,
  options: UseScrollAnimationOptions = {}
) => {
  const [isInView, setIsInView] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsInView(entry.isIntersecting);
        setProgress(entry.intersectionRatio);
        if (options.onIntersectionChange)
          options.onIntersectionChange(
            entry.isIntersecting,
            entry.intersectionRatio
          );
      },
      {
        threshold: options.threshold ?? 0,
        rootMargin: options.rootMargin ?? '0px',
        root: options.root ?? null,
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [
    ref,
    options.threshold,
    options.rootMargin,
    options.root,
    options.onIntersectionChange,
  ]);

  return { isInView, progress };
};

// Enhanced useSmoothScroll with error handling
export const useSmoothScroll = () => {
  return useCallback((element: HTMLElement | null, offset = 0) => {
    if (!element) return;

    try {
      const top =
        element.getBoundingClientRect().top +
        (window.scrollY || window.pageYOffset) -
        offset;

      if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({ top, behavior: 'smooth' });
      } else {
        // Fallback for browsers that don't support smooth scrolling
        window.scrollTo(0, top);
      }
    } catch (error) {
      console.error('Error during smooth scroll:', error);
    }
  }, []);
};

// Enhanced useInfiniteScroll with debouncing
export const useInfiniteScroll = (
  callback: () => void,
  options: UseInfiniteScrollOptions = {}
) => {
  const [sentinel, setSentinel] = useState<HTMLDivElement | null>(null);
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!sentinel || options.isLoading) return;

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        if (options.debounceMs) {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          timeoutRef.current = setTimeout(
            callbackRef.current,
            options.debounceMs
          );
        } else {
          callbackRef.current();
        }
      }
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: options.threshold ?? 0,
      root: options.root ?? null,
      rootMargin: options.rootMargin ?? '0px',
    });

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    sentinel,
    options.threshold,
    options.isLoading,
    options.root,
    options.rootMargin,
    options.debounceMs,
  ]);

  return { sentinelRef: setSentinel };
};

export const useScrollDirection = (threshold = 5) => {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const lastScrollY = useRef(0);
  const lastDirection = useRef<'up' | 'down'>('up');
  const animationFrame = useRef<number>();
  const ticking = useRef(false);

  const updateDirection = () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const direction = scrollY > lastScrollY.current ? 'down' : 'up';
    const scrollDelta = Math.abs(scrollY - lastScrollY.current);

    // Vérifier si on est au bas de la page
    const isAtBottom =
      window.innerHeight + scrollY >= document.documentElement.scrollHeight - 1;

    // Logique principale
    if (scrollDelta > threshold || (direction === 'down' && isAtBottom)) {
      if (direction !== lastDirection.current) {
        lastDirection.current = direction;
        setScrollDirection(direction);
      }
    }

    // Mise à jour de la position avec un minimum de 0
    lastScrollY.current = Math.max(scrollY, 0);
    ticking.current = false;
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        animationFrame.current = requestAnimationFrame(() => {
          updateDirection();
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [threshold]);

  return scrollDirection;
};
