import { RefObject, useEffect, useState, useCallback } from 'react';

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

export const useScroll = ({
  container,
  offset = [0, 0],
}: UseScrollOptions = {}) => {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    x: 0,
    y: 0,
    xProgress: 0,
    yProgress: 0,
  });

  const handleScroll = useCallback(() => {
    if (!container || !container.current) return;
    const element = container.current;
    const {
      scrollHeight,
      scrollWidth,
      clientHeight,
      clientWidth,
      scrollTop,
      scrollLeft,
    } = getScrollDimensions(element);

    const x = scrollLeft + offset[0];
    const y = scrollTop + offset[1];

    const maxScrollX = scrollWidth - clientWidth;
    const maxScrollY = scrollHeight - clientHeight;

    const xProgress = maxScrollX > 0 ? x / maxScrollX : 1;
    const yProgress = maxScrollY > 0 ? y / maxScrollY : 1;

    setScrollPosition((prev) => {
      if (
        prev.x !== x ||
        prev.y !== y ||
        prev.xProgress !== xProgress ||
        prev.yProgress !== yProgress
      ) {
        return { x, y, xProgress, yProgress };
      }
      return prev;
    });
  }, [container, offset]);

  useEffect(() => {
    if (!container || container.current) return;
    const element = container.current || window;
    element.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    handleScroll();

    return () => {
      element.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll, container]);

  return scrollPosition;
};

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

export const useSmoothScroll = () => {
  return useCallback((element: HTMLElement | null, offset = 0) => {
    if (!element) return;
    const targetPosition =
      element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
  }, []);
};

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
        if (entries[0].isIntersecting) callback();
      },
      { threshold: options.threshold || 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [sentinel, callback, options.threshold, options.isLoading]);

  return { sentinelRef: setSentinel };
};

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
    window.addEventListener('scroll', updateScrollDirection, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateScrollDirection);
    };
  }, [updateScrollDirection]);

  return scrollDirection;
};
