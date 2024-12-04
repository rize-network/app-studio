# Scroll Hooks Documentation

This document provides documentation for the scroll-related React hooks available in the `useScroll.ts` module.

## useScroll

A hook that tracks scroll position and progress for a container or window.

### Usage

```typescript
import { useScroll } from './hooks/useScroll';

function MyComponent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { x, y, xProgress, yProgress } = useScroll({
    container: containerRef,
    offset: [0, 0]
  });

  return (
    <div ref={containerRef}>
      <p>Scroll Position: {x}px, {y}px</p>
      <p>Scroll Progress: {xProgress * 100}%, {yProgress * 100}%</p>
    </div>
  );
}
```

### Options

- `container`: RefObject<HTMLElement> - Reference to the scrollable container (optional, defaults to window)
- `target`: RefObject<HTMLElement> - Reference to the target element (optional)
- `offset`: [number, number] - X and Y offset values (optional, defaults to [0, 0])

### Returns

- `ScrollPosition` object:
  - `x`: number - Horizontal scroll position
  - `y`: number - Vertical scroll position
  - `xProgress`: number - Horizontal scroll progress (0 to 1)
  - `yProgress`: number - Vertical scroll progress (0 to 1)

## useScrollAnimation

A hook for creating scroll-linked animations using Intersection Observer.

### Usage

```typescript
import { useScrollAnimation } from './hooks/useScroll';

function MyComponent() {
  const elementRef = useRef<HTMLDivElement>(null);
  const { isInView, progress } = useScrollAnimation(elementRef, {
    threshold: 0.5,
    rootMargin: '0px'
  });

  return (
    <div ref={elementRef} style={{ opacity: progress }}>
      {isInView ? 'Element is visible' : 'Element is hidden'}
    </div>
  );
}
```

### Options

- `threshold`: number | number[] - Intersection observer threshold (optional)
- `rootMargin`: string - Intersection observer root margin (optional)

### Returns

- `isInView`: boolean - Whether the element is in view
- `progress`: number - Intersection ratio (0 to 1)

## useSmoothScroll

A hook that provides smooth scrolling functionality to elements.

### Usage

```typescript
import { useSmoothScroll } from './hooks/useScroll';

function MyComponent() {
  const scrollTo = useSmoothScroll();
  const targetRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <button onClick={() => scrollTo(targetRef.current, 80)}>
        Scroll to Element
      </button>
      <div ref={targetRef}>Target Element</div>
    </>
  );
}
```

### Returns

- `scrollTo`: (element: HTMLElement | null, offset?: number) => void - Function to smoothly scroll to an element

## useInfiniteScroll

A hook for implementing infinite scroll functionality.

### Usage

```typescript
import { useInfiniteScroll } from './hooks/useScroll';

function MyComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const loadMore = () => {
    setIsLoading(true);
    // Load more data...
  };

  const { sentinelRef } = useInfiniteScroll(loadMore, {
    threshold: 0.5,
    isLoading
  });

  return (
    <div>
      {/* Your list items */}
      <div ref={sentinelRef} />
    </div>
  );
}
```

### Options

- `threshold`: number - Intersection observer threshold (optional)
- `isLoading`: boolean - Loading state to prevent multiple triggers (optional)

### Returns

- `sentinelRef`: (element: HTMLDivElement | null) => void - Ref callback for the sentinel element

## useScrollDirection

A hook that detects scroll direction.

### Usage

```typescript
import { useScrollDirection } from './hooks/useScroll';

function MyComponent() {
  const scrollDirection = useScrollDirection(50);

  return (
    <div>
      Currently scrolling: {scrollDirection}
    </div>
  );
}
```

### Parameters

- `threshold`: number - Minimum scroll amount before direction change is detected (optional, defaults to 0)

### Returns

- `scrollDirection`: 'up' | 'down' - Current scroll direction
