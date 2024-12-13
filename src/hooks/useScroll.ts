import { RefObject, useEffect, useState, useCallback, useRef } from 'react';

// Types and Interfaces
export interface ScrollPosition {
  x: number;
  y: number;
  xProgress: number;
  yProgress: number;
}

export interface UseScrollOptions {
  container?: RefObject<HTMLElement>;
  offset?: [number, number];
  throttleMs?: number;
}

export interface UseScrollAnimationOptions {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
}

export interface UseInfiniteScrollOptions {
  threshold?: number;
  isLoading?: boolean;
  root?: Element | null;
  rootMargin?: string;
}

interface ScrollDimensions {
  scrollHeight: number;
  scrollWidth: number;
  clientHeight: number;
  clientWidth: number;
  scrollTop: number;
  scrollLeft: number;
}

// Utility Functions
const getScrollDimensions = (
  element: HTMLElement | Window
): ScrollDimensions => {
  if (element instanceof Window) {
    return {
      scrollHeight: document.documentElement.scrollHeight,
      scrollWidth: document.documentElement.scrollWidth,
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

/**
 * Hook to track scroll position and progress of a container element or window
 */
export const useScroll = ({
  container,
  offset = [0, 0],
  throttleMs = 0,
}: UseScrollOptions = {}): ScrollPosition => {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    x: 0,
    y: 0,
    xProgress: 0,
    yProgress: 0,
  });

  const lastUpdateRef = useRef<number>(0);

  const handleScroll = useCallback(() => {
    const now = Date.now();
    if (throttleMs > 0 && now - lastUpdateRef.current < throttleMs) {
      return;
    }

    const targetElement =
      container && container.current ? container.current : window;
    const {
      scrollHeight,
      scrollWidth,
      clientHeight,
      clientWidth,
      scrollTop,
      scrollLeft,
    } = getScrollDimensions(targetElement);

    const x = scrollLeft + offset[0];
    const y = scrollTop + offset[1];

    const maxScrollX = scrollWidth - clientWidth;
    const maxScrollY = scrollHeight - clientHeight;

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
  }, [container, offset, throttleMs]);

  useEffect(() => {
    const targetElement =
      container && container.current ? container.current : window;

    handleScroll();

    targetElement.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      targetElement.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll, container]);

  return scrollPosition;
};

/**
 * Hook to track element visibility and intersection progress
 */
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
      },
      {
        threshold: options.threshold || 0,
        rootMargin: options.rootMargin || '0px',
        root: options.root || null,
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, options.threshold, options.rootMargin, options.root]);

  return { isInView, progress };
};

/**
 * Hook to handle smooth scrolling to elements
 */
export const useSmoothScroll = () => {
  return useCallback((element: HTMLElement | null, offset = 0) => {
    if (!element) return;

    const targetPosition =
      element.getBoundingClientRect().top +
      (window.scrollY || window.pageYOffset) -
      offset;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth',
    });
  }, []);
};

/**
 * Hook to implement infinite scrolling functionality
 */
export const useInfiniteScroll = (
  callback: () => void,
  options: UseInfiniteScrollOptions = {}
) => {
  const [sentinel, setSentinel] = useState<HTMLDivElement | null>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const element = sentinel;
    if (!element || options.isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callbackRef.current();
        }
      },
      {
        threshold: options.threshold || 0,
        root: options.root || null,
        rootMargin: options.rootMargin || '0px',
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [
    sentinel,
    options.threshold,
    options.isLoading,
    options.root,
    options.rootMargin,
  ]);

  return { sentinelRef: setSentinel };
};

/**
 * Hook to detect scroll direction with configurable threshold
 */
export const useScrollDirection = (threshold = 0) => {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const lastScrollYRef = useRef(0);
  const previousDirectionRef = useRef<'up' | 'down'>('up');

  const updateScrollDirection = useCallback(() => {
    const scrollY = window.scrollY || window.pageYOffset;
    const direction = scrollY > lastScrollYRef.current ? 'down' : 'up';

    if (
      Math.abs(scrollY - lastScrollYRef.current) > threshold &&
      direction !== previousDirectionRef.current
    ) {
      setScrollDirection(direction);
      previousDirectionRef.current = direction;
    }

    lastScrollYRef.current = scrollY > 0 ? scrollY : 0;
  }, [threshold]);

  useEffect(() => {
    const handleScroll = () => {
      window.requestAnimationFrame(updateScrollDirection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [updateScrollDirection]);

  return scrollDirection;
};
