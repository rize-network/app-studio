import { RefObject, useEffect, useState, useCallback } from 'react';

// Types
export interface ScrollPosition {
  x: number;
  y: number;
  xProgress: number;
  yProgress: number;
}

export interface UseScrollOptions {
  container?: RefObject<HTMLElement>;
  target?: RefObject<HTMLElement>;
  offset?: [number, number];
}

// Utility to get scroll dimensions
const getScrollDimensions = (element: HTMLElement | Window) => {
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

// Main scroll hook
export const useScroll = ({
  container,
  target,
  offset = [0, 0],
}: UseScrollOptions = {}) => {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    x: 0,
    y: 0,
    xProgress: 0,
    yProgress: 0,
  });

  const handleScroll = useCallback(() => {
    const element = container?.current || window;

    const {
      scrollHeight,
      scrollWidth,
      clientHeight,
      clientWidth,
      scrollTop,
      scrollLeft,
    } = getScrollDimensions(element);

    // Calculate scroll positions
    const x = scrollLeft + offset[0];
    const y = scrollTop + offset[1];

    // Calculate maximum scroll distances
    const maxScrollX = scrollWidth - clientWidth;
    const maxScrollY = scrollHeight - clientHeight;

    // Calculate progress (0 to 1)
    const xProgress = maxScrollX <= 0 ? 1 : x / maxScrollX;
    const yProgress = maxScrollY <= 0 ? 1 : y / maxScrollY;

    setScrollPosition({
      x,
      y,
      xProgress,
      yProgress,
    });
  }, [container, target, offset]);

  useEffect(() => {
    const element = container?.current || window;

    // Add scroll listener
    element.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Initial calculation
    handleScroll();

    // Cleanup
    return () => {
      element.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]);

  return scrollPosition;
};

// Hook for scroll-linked animations
export const useScrollAnimation = (
  ref: RefObject<HTMLElement>,
  options: {
    threshold?: number | number[];
    rootMargin?: string;
  } = {}
) => {
  const [isInView, setIsInView] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
          setProgress(entry.intersectionRatio);
        });
      },
      {
        threshold: options.threshold || 0,
        rootMargin: options.rootMargin || '0px',
      }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, options.threshold, options.rootMargin]);

  return { isInView, progress };
};

// Hook for smooth scrolling
export const useSmoothScroll = () => {
  const scrollTo = useCallback((element: HTMLElement | null, offset = 0) => {
    if (!element) return;

    const targetPosition =
      element.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth',
    });
  }, []);

  return scrollTo;
};

// Hook for infinite scroll
export const useInfiniteScroll = (
  callback: () => void,
  options: {
    threshold?: number;
    isLoading?: boolean;
  } = {}
) => {
  const [sentinel, setSentinel] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sentinel || options.isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callback();
        }
      },
      {
        threshold: options.threshold || 0,
      }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [sentinel, callback, options.threshold, options.isLoading]);

  return { sentinelRef: setSentinel };
};

// Hook for scroll direction
export const useScrollDirection = (threshold = 0) => {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [lastScrollY, setLastScrollY] = useState(0);

  const updateScrollDirection = useCallback(() => {
    const scrollY = window.scrollY;
    const direction = scrollY > lastScrollY ? 'down' : 'up';

    if (
      Math.abs(scrollY - lastScrollY) > threshold &&
      direction !== scrollDirection
    ) {
      setScrollDirection(direction);
    }

    setLastScrollY(scrollY > 0 ? scrollY : 0);
  }, [scrollDirection, lastScrollY, threshold]);

  useEffect(() => {
    window.addEventListener('scroll', updateScrollDirection);

    return () => {
      window.removeEventListener('scroll', updateScrollDirection);
    };
  }, [updateScrollDirection]);

  return scrollDirection;
};
