import { useRef, useState, useEffect, useCallback } from 'react';

// Type definitions for the desired output
export interface RelativePlacement {
  vertical: 'top' | 'bottom';
  horizontal: 'left' | 'right';
}

export interface ElementPosition {
  position: RelativePlacement; // Element's general location in viewport
  space: RelativePlacement; // Where more space exists around the element in viewport
}

// Options for the hook
export interface UseElementPositionOptions {
  /** Whether to track changes automatically. Default: true */
  trackChanges?: boolean;
  /** Throttle delay in milliseconds for updates. Default: 100 */
  throttleMs?: number;
  /** Whether to track on hover events. Default: true */
  trackOnHover?: boolean;
  /** Whether to track on scroll events. Default: false */
  trackOnScroll?: boolean;
  /** Whether to track on resize events. Default: false */
  trackOnResize?: boolean;
  /** Optional target window to use (for iframe support). Defaults to global window. */
  targetWindow?: Window;
}

// Return type of the hook
export interface UseElementPositionReturn {
  /** React ref to attach to the target HTML element. */
  ref: React.RefObject<HTMLElement>;
  /**
   * The calculated viewport relation data, or null if not yet calculated
   * or element not found.
   */
  relation: ElementPosition | null;
  /** Function to manually trigger an immediate recalculation. */
  updateRelation: () => void;
}

/**
 * A React hook to determine an element's relative position within the viewport
 * and where the most available space is around it within the viewport.
 */
export function useElementPosition<T extends HTMLElement = HTMLElement>(
  options: UseElementPositionOptions = {}
): UseElementPositionReturn {
  const {
    trackChanges = true,
    throttleMs = 500,
    trackOnHover = true,
    trackOnScroll = false,
    trackOnResize = false,
    targetWindow,
  } = options;

  const elementRef = useRef<T>(null);
  const [relation, setRelation] = useState<ElementPosition | null>(null);
  const throttleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const calculateRelation = useCallback(() => {
    const element = elementRef.current;
    if (!element) {
      setRelation((currentRelation) =>
        currentRelation === null ? null : null
      );
      return;
    }

    const win = targetWindow || element.ownerDocument?.defaultView || window;

    const rect = element.getBoundingClientRect();
    const viewportHeight = win.innerHeight;
    const viewportWidth = win.innerWidth;

    // 1. Determine element's general position in viewport
    const elementCenterY = rect.top + rect.height / 2;
    const elementCenterX = rect.left + rect.width / 2;

    const positionVertical =
      elementCenterY < viewportHeight / 2 ? 'top' : 'bottom';
    const positionHorizontal =
      elementCenterX < viewportWidth / 2 ? 'left' : 'right';

    // 2. Determine where more space is available around the element in viewport
    const spaceAbove = rect.top; // Space from viewport top to element top
    const spaceBelow = viewportHeight - rect.bottom; // Space from element bottom to viewport bottom
    const spaceLeft = rect.left; // Space from viewport left to element left
    const spaceRight = viewportWidth - rect.right; // Space from element right to viewport right

    const spaceVertical = spaceAbove >= spaceBelow ? 'top' : 'bottom'; // Prefer 'top' if equal
    const spaceHorizontal = spaceLeft >= spaceRight ? 'left' : 'right'; // Prefer 'left' if equal

    const newRelation: ElementPosition = {
      position: { vertical: positionVertical, horizontal: positionHorizontal },
      space: { vertical: spaceVertical, horizontal: spaceHorizontal },
    };

    setRelation((currentRelation) => {
      if (
        currentRelation &&
        currentRelation.position.vertical === newRelation.position.vertical &&
        currentRelation.position.horizontal ===
          newRelation.position.horizontal &&
        currentRelation.space.vertical === newRelation.space.vertical &&
        currentRelation.space.horizontal === newRelation.space.horizontal
      ) {
        return currentRelation; // No change
      }
      return newRelation;
    });
  }, [targetWindow]); // This callback is stable

  const throttledUpdate = useCallback(() => {
    if (throttleTimerRef.current) {
      clearTimeout(throttleTimerRef.current);
    }
    throttleTimerRef.current = setTimeout(() => {
      calculateRelation();
    }, throttleMs);
  }, [calculateRelation, throttleMs]);

  useEffect(() => {
    // Initial calculation
    calculateRelation();

    if (!trackChanges) {
      if (throttleTimerRef.current) clearTimeout(throttleTimerRef.current);
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    const win = targetWindow || element.ownerDocument?.defaultView || window;
    const handler = throttledUpdate;
    const immediateHandler = calculateRelation;

    // Add event listeners based on configuration
    const cleanupFunctions: (() => void)[] = [];

    // Hover events (mouseenter/mouseleave) - immediate calculation for better UX
    if (trackOnHover) {
      element.addEventListener('mouseenter', immediateHandler);
      element.addEventListener('mouseleave', immediateHandler);
      cleanupFunctions.push(() => {
        element.removeEventListener('mouseenter', immediateHandler);
        element.removeEventListener('mouseleave', immediateHandler);
      });
    }

    // Scroll events - throttled
    if (trackOnScroll) {
      win.addEventListener('scroll', handler, { passive: true });
      cleanupFunctions.push(() => {
        win.removeEventListener('scroll', handler);
      });
    }

    // Resize events - throttled
    if (trackOnResize) {
      win.addEventListener('resize', handler);
      cleanupFunctions.push(() => {
        win.removeEventListener('resize', handler);
      });
    }

    return () => {
      if (throttleTimerRef.current) {
        clearTimeout(throttleTimerRef.current);
      }
      cleanupFunctions.forEach((cleanup) => cleanup());
    };
  }, [
    trackChanges,
    trackOnHover,
    trackOnScroll,
    trackOnResize,
    throttledUpdate,
    calculateRelation,
    targetWindow,
  ]);

  const manualUpdateRelation = useCallback(() => {
    calculateRelation();
  }, [calculateRelation]);

  return {
    ref: elementRef,
    relation,
    updateRelation: manualUpdateRelation,
  };
}
