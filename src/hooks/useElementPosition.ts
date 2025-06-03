import { useRef, useState, useEffect, useCallback } from 'react';

// Type definitions for element position data
export interface ElementPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export interface AvailableSpace {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface OptimalPosition {
  x: number;
  y: number;
  placement: 'top' | 'bottom' | 'left' | 'right';
  availableSpace: AvailableSpace;
}

export interface ElementPositionHelpers {
  // Get available space on all sides
  getAvailableSpace: () => AvailableSpace;
  // Get optimal position based on available space
  getOptimalPosition: (
    overlayWidth: number,
    overlayHeight: number,
    offset?: number
  ) => OptimalPosition;
  // Legacy methods for backward compatibility
  getContextMenuPosition: (
    menuWidth: number,
    menuHeight: number
  ) => OptimalPosition;
  getTooltipPosition: (
    tooltipWidth: number,
    tooltipHeight: number,
    offset?: number
  ) => OptimalPosition;
  getDropdownPosition: (
    dropdownWidth: number,
    dropdownHeight: number
  ) => OptimalPosition;
  isInViewport: () => boolean;
  getViewportOverflow: () => {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface UseElementPositionOptions {
  // Whether to track position changes automatically
  trackChanges?: boolean;
  // Throttle delay for position updates (in ms)
  throttleMs?: number;
  // Whether to include scroll events
  includeScroll?: boolean;
  // Whether to include resize events
  includeResize?: boolean;
  // Custom offset for calculations
  offset?: { x: number; y: number };
  // Scrollable container reference (if null, uses window)
  scrollContainer?: React.RefObject<HTMLElement> | null;
  // Whether to use fixed positioning (relative to viewport) or absolute (relative to container)
  useFixedPositioning?: boolean;
}

export interface UseElementPositionReturn {
  ref: React.RefObject<HTMLElement>;
  position: ElementPosition | null;
  helpers: ElementPositionHelpers;
  updatePosition: () => void;
}

export function useElementPosition<T extends HTMLElement = HTMLElement>(
  options: UseElementPositionOptions = {}
): UseElementPositionReturn {
  const {
    trackChanges = true,
    throttleMs = 16, // ~60fps
    includeScroll = true,
    includeResize = true,
    offset = { x: 0, y: 0 },
    scrollContainer = null,
    useFixedPositioning = false,
  } = options;

  const ref = useRef<T>(null);
  const [position, setPosition] = useState<ElementPosition | null>(null);
  const throttleRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate element position
  const calculatePosition = useCallback((): ElementPosition | null => {
    const element = ref.current;
    if (!element) return null;

    const rect = element.getBoundingClientRect();

    if (useFixedPositioning) {
      // For fixed positioning, use viewport coordinates
      return {
        x: rect.left + offset.x,
        y: rect.top + offset.y,
        width: rect.width,
        height: rect.height,
        top: rect.top + offset.y,
        left: rect.left + offset.x,
        right: rect.right + offset.x,
        bottom: rect.bottom + offset.y,
      };
    }

    // For absolute positioning, calculate relative to document or container
    let scrollX = 0;
    let scrollY = 0;
    let containerRect = { left: 0, top: 0 };

    if (scrollContainer?.current) {
      // Position relative to scrollable container
      const container = scrollContainer.current;
      const containerBounds = container.getBoundingClientRect();
      containerRect = { left: containerBounds.left, top: containerBounds.top };
      scrollX = container.scrollLeft;
      scrollY = container.scrollTop;
    } else {
      // Position relative to document
      scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      scrollY = window.pageYOffset || document.documentElement.scrollTop;
    }

    return {
      x: rect.left - containerRect.left + scrollX + offset.x,
      y: rect.top - containerRect.top + scrollY + offset.y,
      width: rect.width,
      height: rect.height,
      top: rect.top - containerRect.top + scrollY + offset.y,
      left: rect.left - containerRect.left + scrollX + offset.x,
      right: rect.right - containerRect.left + scrollX + offset.x,
      bottom: rect.bottom - containerRect.top + scrollY + offset.y,
    };
  }, [offset.x, offset.y, scrollContainer, useFixedPositioning]);

  // Throttled position update
  const updatePosition = useCallback(() => {
    if (throttleRef.current) {
      clearTimeout(throttleRef.current);
    }

    throttleRef.current = setTimeout(() => {
      const newPosition = calculatePosition();
      setPosition(newPosition);
    }, throttleMs);
  }, [calculatePosition, throttleMs]);

  // Calculate available space on all sides
  const getContainerBounds = () => {
    if (scrollContainer?.current) {
      const container = scrollContainer.current;
      const containerRect = container.getBoundingClientRect();
      return {
        width: container.clientWidth,
        height: container.clientHeight,
        scrollX: container.scrollLeft,
        scrollY: container.scrollTop,
        offsetX: useFixedPositioning ? containerRect.left : 0,
        offsetY: useFixedPositioning ? containerRect.top : 0,
        visibleTop: useFixedPositioning
          ? containerRect.top
          : container.scrollTop,
        visibleBottom: useFixedPositioning
          ? containerRect.bottom
          : container.scrollTop + container.clientHeight,
        visibleLeft: useFixedPositioning
          ? containerRect.left
          : container.scrollLeft,
        visibleRight: useFixedPositioning
          ? containerRect.right
          : container.scrollLeft + container.clientWidth,
      };
    } else {
      const scrollX = window.pageXOffset;
      const scrollY = window.pageYOffset;
      return {
        width: window.innerWidth,
        height: window.innerHeight,
        scrollX,
        scrollY,
        offsetX: 0,
        offsetY: 0,
        visibleTop: scrollY,
        visibleBottom: scrollY + window.innerHeight,
        visibleLeft: scrollX,
        visibleRight: scrollX + window.innerWidth,
      };
    }
  };

  // Helper methods for positioning overlays
  const helpers: ElementPositionHelpers = {
    getAvailableSpace: (): AvailableSpace => {
      if (!position) return { top: 0, right: 0, bottom: 0, left: 0 };

      const bounds = getContainerBounds();
      const elementTop = useFixedPositioning
        ? position.top + bounds.offsetY
        : position.top;
      const elementBottom = useFixedPositioning
        ? position.bottom + bounds.offsetY
        : position.bottom;
      const elementLeft = useFixedPositioning
        ? position.left + bounds.offsetX
        : position.left;
      const elementRight = useFixedPositioning
        ? position.right + bounds.offsetX
        : position.right;

      return {
        top: elementTop - bounds.visibleTop,
        right: bounds.visibleRight - elementRight,
        bottom: bounds.visibleBottom - elementBottom,
        left: elementLeft - bounds.visibleLeft,
      };
    },

    getOptimalPosition: (
      overlayWidth: number,
      overlayHeight: number,
      offset = 8
    ): OptimalPosition => {
      if (!position) {
        return {
          x: 0,
          y: 0,
          placement: 'bottom',
          availableSpace: { top: 0, right: 0, bottom: 0, left: 0 },
        };
      }

      const bounds = getContainerBounds();
      const availableSpace = helpers.getAvailableSpace();
      const elementTop = useFixedPositioning
        ? position.top + bounds.offsetY
        : position.top;
      const elementBottom = useFixedPositioning
        ? position.bottom + bounds.offsetY
        : position.bottom;
      const elementLeft = useFixedPositioning
        ? position.left + bounds.offsetX
        : position.left;
      const elementRight = useFixedPositioning
        ? position.right + bounds.offsetX
        : position.right;

      // Calculate which placement has the most space
      const placements = [
        {
          placement: 'bottom' as const,
          space: availableSpace.bottom,
          fits: availableSpace.bottom >= overlayHeight,
          x: elementLeft + position.width / 2 - overlayWidth / 2,
          y: elementBottom + offset,
        },
        {
          placement: 'top' as const,
          space: availableSpace.top,
          fits: availableSpace.top >= overlayHeight,
          x: elementLeft + position.width / 2 - overlayWidth / 2,
          y: elementTop - overlayHeight - offset,
        },
        {
          placement: 'right' as const,
          space: availableSpace.right,
          fits: availableSpace.right >= overlayWidth,
          x: elementRight + offset,
          y: elementTop + position.height / 2 - overlayHeight / 2,
        },
        {
          placement: 'left' as const,
          space: availableSpace.left,
          fits: availableSpace.left >= overlayWidth,
          x: elementLeft - overlayWidth - offset,
          y: elementTop + position.height / 2 - overlayHeight / 2,
        },
      ];

      // First try to find a placement that fits completely
      const fittingPlacement = placements.find((p) => p.fits);
      if (fittingPlacement) {
        return {
          x: fittingPlacement.x,
          y: fittingPlacement.y,
          placement: fittingPlacement.placement,
          availableSpace,
        };
      }

      // If nothing fits completely, choose the placement with the most space
      const bestPlacement = placements.reduce((best, current) =>
        current.space > best.space ? current : best
      );

      return {
        x: bestPlacement.x,
        y: bestPlacement.y,
        placement: bestPlacement.placement,
        availableSpace,
      };
    },

    getContextMenuPosition: (
      menuWidth: number,
      menuHeight: number
    ): OptimalPosition => {
      return helpers.getOptimalPosition(menuWidth, menuHeight, 4);
    },

    getTooltipPosition: (
      tooltipWidth: number,
      tooltipHeight: number,
      offset = 8
    ): OptimalPosition => {
      return helpers.getOptimalPosition(tooltipWidth, tooltipHeight, offset);
    },

    getDropdownPosition: (
      dropdownWidth: number,
      dropdownHeight: number
    ): OptimalPosition => {
      return helpers.getOptimalPosition(dropdownWidth, dropdownHeight, 4);
    },

    isInViewport: () => {
      if (!position) return false;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const scrollX = window.pageXOffset;
      const scrollY = window.pageYOffset;

      return (
        position.right > scrollX &&
        position.left < viewportWidth + scrollX &&
        position.bottom > scrollY &&
        position.top < viewportHeight + scrollY
      );
    },

    getViewportOverflow: () => {
      if (!position) return { top: 0, right: 0, bottom: 0, left: 0 };

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const scrollX = window.pageXOffset;
      const scrollY = window.pageYOffset;

      return {
        top: Math.max(0, scrollY - position.top),
        right: Math.max(0, position.right - (viewportWidth + scrollX)),
        bottom: Math.max(0, position.bottom - (viewportHeight + scrollY)),
        left: Math.max(0, scrollX - position.left),
      };
    },
  };

  // Set up event listeners
  useEffect(() => {
    if (!trackChanges) return;

    const handleUpdate = () => updatePosition();

    // Initial position calculation
    updatePosition();

    // Add event listeners
    if (includeResize) {
      window.addEventListener('resize', handleUpdate);
    }

    if (includeScroll) {
      if (scrollContainer?.current) {
        // Listen to scroll events on the container
        scrollContainer.current.addEventListener('scroll', handleUpdate, {
          passive: true,
        });
      } else {
        // Listen to window scroll events
        window.addEventListener('scroll', handleUpdate, { passive: true });
      }
    }

    return () => {
      if (throttleRef.current) {
        clearTimeout(throttleRef.current);
      }
      if (includeResize) {
        window.removeEventListener('resize', handleUpdate);
      }
      if (includeScroll) {
        if (scrollContainer?.current) {
          scrollContainer.current.removeEventListener('scroll', handleUpdate);
        } else {
          window.removeEventListener('scroll', handleUpdate);
        }
      }
    };
  }, [
    trackChanges,
    includeResize,
    includeScroll,
    updatePosition,
    scrollContainer,
  ]);

  // Update position when element changes
  useEffect(() => {
    if (ref.current && trackChanges) {
      updatePosition();
    }
  }, [ref.current, updatePosition, trackChanges]);

  return {
    ref,
    position,
    helpers,
    updatePosition,
  };
}
