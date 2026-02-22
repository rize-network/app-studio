import { RefObject, useEffect, useState, useCallback, useRef } from 'react';

// Enhanced type definitions with documentation
export interface ScrollPosition {
  x: number;
  y: number;
  xProgress: number; // Value between 0 and 1
  yProgress: number; // Value between 0 and 1
  /**
   * Position of the tracked element relative to the viewport top (if container is provided).
   * Equivalent to getBoundingClientRect().top
   */
  elementY?: number;
  /**
   * Progress of the element scrolling through the viewport (for sticky/reveal effects).
   * Calculated as: -elementY / (elementHeight - viewportHeight)
   * Varies from 0 (element hits top) to 1 (element finishes scrolling).
   */
  elementProgress?: number;
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
  /** Target window for iframe support - automatically sets correct root */
  targetWindow?: Window | null;
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

// Stable default references to prevent unnecessary re-renders
const DEFAULT_SCROLL_OFFSET: [number, number] = [0, 0];
const DEFAULT_SCROLL_OPTIONS: UseScrollOptions = {};
const DEFAULT_SCROLL_ANIMATION_OPTIONS: UseScrollAnimationOptions = {};
const DEFAULT_INFINITE_SCROLL_OPTIONS: UseInfiniteScrollOptions = {};

// Helper to check if element is a Window object (works across iframes)
const isWindow = (obj: any): obj is Window => {
  return obj && obj.window === obj;
};

const isElementScrollable = (el: HTMLElement) => {
  return el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth;
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
  offset = DEFAULT_SCROLL_OFFSET,
  throttleMs = 100,
  disabled = false,
}: UseScrollOptions = DEFAULT_SCROLL_OPTIONS): ScrollPosition => {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    x: 0,
    y: 0,
    xProgress: 0,
    yProgress: 0,
    elementY: 0,
    elementProgress: 0,
  });

  const lastUpdateRef = useRef<number>(0);
  const frameRef = useRef<number>();
  const ticking = useRef(false);

  // Resolve the window/document context. If the container is an iframe element, use its contentWindow.
  const getContext = useCallback(() => {
    const targetEl = container?.current ?? null;

    if (targetEl && targetEl instanceof HTMLIFrameElement) {
      const frameWindow = targetEl.contentWindow ?? null;
      const frameDoc =
        targetEl.contentDocument ?? frameWindow?.document ?? null;
      return {
        targetEl,
        targetWindow: frameWindow,
        targetDocument: frameDoc,
      } as const;
    }

    const targetDocument = targetEl?.ownerDocument ?? null;
    const targetWindow =
      targetDocument?.defaultView ??
      (typeof window !== 'undefined' ? window : null);

    return { targetEl, targetWindow, targetDocument } as const;
  }, [container]);

  const updateScrollPosition = useCallback(() => {
    const { targetEl, targetWindow } = getContext();
    const hasScrollableElement = targetEl && isElementScrollable(targetEl);
    const scrollTarget = hasScrollableElement
      ? targetEl
      : targetWindow || targetEl;

    if (!scrollTarget) {
      ticking.current = false;
      return;
    }

    const now = Date.now();
    // Verify throttle constraints inside the RAF to skip frame if needed
    if (throttleMs > 0 && now - lastUpdateRef.current < throttleMs) {
      ticking.current = false;
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

    // Calculate element-specific stats if we are tracking a specific element container
    // that is NOT the main scroller itself.
    let elementY = 0;
    let elementProgress = 0;

    if (targetEl && targetEl !== scrollTarget) {
      const rect = targetEl.getBoundingClientRect();
      elementY = rect.top;

      const viewportHeight = dimensions.clientHeight;
      const scrollDistance = rect.height - viewportHeight;

      if (scrollDistance > 0) {
        // Calculate progress consistent with sticky scrolling behavior
        // 0 when hitting top, 1 when finished scrolling
        const scrolled = -rect.top;
        elementProgress = Math.max(0, Math.min(1, scrolled / scrollDistance));
      } else {
        elementProgress = 0;
      }
    }

    setScrollPosition((prev) => {
      if (
        prev.elementProgress !== elementProgress ||
        prev.y !== y ||
        prev.x !== x ||
        prev.yProgress !== yProgress
      ) {
        lastUpdateRef.current = now;
        return { x, y, xProgress, yProgress, elementY, elementProgress };
      }
      return prev;
    });

    ticking.current = false;
  }, [offset, throttleMs, getContext]);

  const handleScroll = useCallback(() => {
    if (disabled) return;

    if (!ticking.current) {
      frameRef.current = requestAnimationFrame(updateScrollPosition);
      ticking.current = true;
    }
  }, [disabled, updateScrollPosition]);

  useEffect(() => {
    if (disabled) return;

    const { targetEl, targetWindow, targetDocument } = getContext();
    const hasScrollableElement = targetEl && isElementScrollable(targetEl);
    const scrollTarget = hasScrollableElement
      ? targetEl
      : targetWindow || targetEl;

    if (!scrollTarget) return;

    // Initial scroll position
    updateScrollPosition();

    const options = { passive: true } as const;

    scrollTarget.addEventListener('scroll', handleScroll, options);

    if (targetWindow) {
      targetWindow.addEventListener('resize', handleScroll, options);
    }

    // If we are using a window (main or iframe), also listen to its document
    if (targetWindow && targetDocument) {
      targetDocument.addEventListener('scroll', handleScroll, options);
    }

    return () => {
      scrollTarget.removeEventListener('scroll', handleScroll);
      if (targetWindow) {
        targetWindow.removeEventListener('resize', handleScroll);
      }
      if (targetWindow && targetDocument) {
        targetDocument.removeEventListener('scroll', handleScroll);
      }
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      ticking.current = false;
    };
  }, [handleScroll, disabled, getContext, updateScrollPosition]);

  return scrollPosition;
};

// Enhanced useScrollAnimation with callback support and iframe support
export const useScrollAnimation = (
  ref: RefObject<HTMLElement>,
  options: UseScrollAnimationOptions = DEFAULT_SCROLL_ANIMATION_OPTIONS
) => {
  const [isInView, setIsInView] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Auto-detect iframe context from element's ownerDocument
    const elementWindow = element.ownerDocument?.defaultView;
    const targetWindow = options.targetWindow ?? elementWindow;

    // If no valid window context, bail out
    if (!targetWindow) return;

    // Use the IntersectionObserver from the target window context
    // This is crucial for iframe support - we need to use the iframe's
    // IntersectionObserver, not the parent window's
    const ObserverClass = (targetWindow as Window & typeof globalThis)
      .IntersectionObserver;
    if (!ObserverClass) return;

    // Determine effective root:
    // 1. If explicit root provided, use it
    // 2. Otherwise use null (default viewport of the target window)
    // Note: When using the iframe's IntersectionObserver with null root,
    // it correctly observes relative to the iframe's viewport
    const effectiveRoot = options.root !== undefined ? options.root : null;

    const observer = new ObserverClass(
      (entries: IntersectionObserverEntry[]) => {
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
        root: effectiveRoot,
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [
    ref,
    options.threshold,
    options.rootMargin,
    options.root,
    options.targetWindow,
    options.onIntersectionChange,
  ]);

  return { isInView, progress };
};

// Enhanced useSmoothScroll with error handling
export const useSmoothScroll = (targetWindow?: Window) => {
  return useCallback(
    (element: HTMLElement | null, offset = 0) => {
      if (!element) return;

      try {
        const win =
          targetWindow || element.ownerDocument?.defaultView || window;
        const top =
          element.getBoundingClientRect().top +
          (win.scrollY || win.pageYOffset) -
          offset;

        if ('scrollBehavior' in win.document.documentElement.style) {
          win.scrollTo({ top, behavior: 'smooth' });
        } else {
          // Fallback for browsers that don't support smooth scrolling
          win.scrollTo(0, top);
        }
      } catch (error) {
        console.error('Error during smooth scroll:', error);
      }
    },
    [targetWindow]
  );
};

// Enhanced useInfiniteScroll with debouncing
export const useInfiniteScroll = (
  callback: () => void,
  options: UseInfiniteScrollOptions = DEFAULT_INFINITE_SCROLL_OPTIONS
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

export const useScrollDirection = (threshold = 5, targetWindow?: Window) => {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const lastScrollY = useRef(0);
  const lastDirection = useRef<'up' | 'down'>('up');
  const animationFrame = useRef<number>();
  const ticking = useRef(false);

  const updateDirection = useCallback(() => {
    const win = targetWindow || (typeof window !== 'undefined' ? window : null);
    if (!win) return;

    const doc = win.document.documentElement;
    const scrollY = win.scrollY || doc.scrollTop;
    const direction = scrollY > lastScrollY.current ? 'down' : 'up';
    const scrollDelta = Math.abs(scrollY - lastScrollY.current);

    // Vérifier si on est au bas de la page
    const isAtBottom = win.innerHeight + scrollY >= doc.scrollHeight - 1;

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
  }, [threshold, targetWindow]);

  useEffect(() => {
    const win = targetWindow || (typeof window !== 'undefined' ? window : null);
    if (!win) return;

    const handleScroll = () => {
      if (!ticking.current) {
        animationFrame.current = requestAnimationFrame(() => {
          updateDirection();
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    win.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      win.removeEventListener('scroll', handleScroll);
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [updateDirection, targetWindow]);

  return scrollDirection;
};
