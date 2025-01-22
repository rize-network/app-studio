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

// Memoized function to get scroll dimensions
const getScrollDimensions = (
  element: HTMLElement | Window
): ScrollDimensions => {
  if (element instanceof Window) {
    const doc = document.documentElement;
    return {
      scrollHeight: Math.max(doc.scrollHeight, doc.offsetHeight),
      scrollWidth: Math.max(doc.scrollWidth, doc.offsetWidth),
      clientHeight: window.innerHeight,
      clientWidth: window.innerWidth,
      scrollTop: window.scrollY,
      scrollLeft: window.scrollX,
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

// Enhanced useScroll hook with better performance
export const useScroll = ({
  container,
  offset = [0, 0],
  throttleMs = 0,
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

  const handleScroll = useCallback(() => {
    if (disabled) return;

    const now = Date.now();
    if (throttleMs > 0 && now - lastUpdateRef.current < throttleMs) {
      frameRef.current = requestAnimationFrame(handleScroll);
      return;
    }

    const target = container && container.current ? container.current : window;
    const dimensions = getScrollDimensions(target);

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
  }, [container, offset, throttleMs, disabled]);

  useEffect(() => {
    if (disabled) return;

    const target = container && container.current ? container.current : window;
    handleScroll();

    const options = { passive: true };
    target.addEventListener('scroll', handleScroll, options);
    window.addEventListener('resize', handleScroll, options);

    return () => {
      target.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [handleScroll, container, disabled]);

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

// Enhanced useScrollDirection with better performance
export const useScrollDirection = (threshold = 0) => {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const lastScrollYRef = useRef(0);
  const prevDirectionRef = useRef<'up' | 'down'>('up');
  const frameRef = useRef<number>();

  const updateDirection = useCallback(() => {
    const scrollY = window.scrollY || window.pageYOffset;
    const direction = scrollY > lastScrollYRef.current ? 'down' : 'up';

    if (
      Math.abs(scrollY - lastScrollYRef.current) > threshold &&
      direction !== prevDirectionRef.current
    ) {
      setScrollDirection(direction);
      prevDirectionRef.current = direction;
    }

    lastScrollYRef.current = scrollY > 0 ? scrollY : 0;
  }, [threshold]);

  useEffect(() => {
    const handleScroll = () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      frameRef.current = requestAnimationFrame(updateDirection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [updateDirection]);

  return scrollDirection;
};
