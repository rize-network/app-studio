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

-   `container`: `RefObject<HTMLElement>` - Reference to the scrollable container (optional, defaults to window).
-   `target`: `RefObject<HTMLElement>` - Reference to the target element (optional).
-   `offset`: `[number, number]` - X and Y offset values (optional, defaults to `[0, 0]`).
-   `throttleMs`: `number` - Throttle interval in milliseconds to limit the rate of scroll events (optional, defaults to 100).
-   `disabled`: `boolean` - Whether to disable the hook (optional, defaults to `false`).

### Usage Notes

-   The `throttleMs` option can be used to improve performance by reducing the frequency of scroll event handling.
-   The `disabled` option can be used to temporarily disable the hook without unmounting the component.

### Returns

-   `ScrollPosition` object:
    -   `x`: `number` - Horizontal scroll position in pixels.
    -   `y`: `number` - Vertical scroll position in pixels.
    -   `xProgress`: `number` - Horizontal scroll progress as a fraction between 0 and 1, representing the current horizontal scroll position relative to the total scrollable width.
    -   `yProgress`: `number` - Vertical scroll progress as a fraction between 0 and 1, representing the current vertical scroll position relative to the total scrollable height.

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

-   `threshold`: `number | number[]` - Intersection observer threshold (optional).
-   `root`: `React.RefObject<HTMLElement>` - The root element to use for the Intersection Observer (optional, defaults to the viewport).
-   `rootMargin`: `string` - Margin around the root. Can have values similar to the CSS margin property (optional, defaults to '0px').

### Returns

-   `isInView`: `boolean` - Whether the element is in the viewport.
-   `progress`: `number` - Intersection ratio (between 0 and 1) indicating the percentage of the target element that is visible within the root.

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

-   `scrollTo`: `(element: HTMLElement | null, offset?: number) => void` - Function to initiate smooth scrolling.
    -   `element`: The target element to scroll to.
    -   `offset`: Optional offset from the top of the element (in pixels).

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

-   `threshold`: `number` - Intersection observer threshold (optional, defaults to 0).
-   `root`: `React.RefObject<HTMLElement>` - The root element to use for the Intersection Observer (optional, defaults to the viewport).
-   `rootMargin`: `string` - Margin around the root. Can have values similar to the CSS margin property (optional, defaults to '0px').
-   `debounceMs`: `number` - Debounce interval in milliseconds to limit the rate of loadMore calls (optional, defaults to 300).
-   `isLoading`: `boolean` - Loading state to prevent multiple triggers (optional).

### Returns

-   `sentinelRef`: `React.RefCallback<HTMLDivElement>` - Ref callback function that should be attached to the sentinel `div` element in your component. This `div` acts as a trigger for loading more content when it comes into view.

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

-   `threshold`: `number` - Minimum scroll distance in pixels before the direction change is detected (optional, defaults to 0).

### Returns

-   `scrollDirection`: `'up' | 'down'` - Current scroll direction.
