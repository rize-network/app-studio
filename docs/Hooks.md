# Hooks

App-Studio provides a comprehensive set of React hooks to help you build interactive and responsive applications. This guide covers all the available hooks and their usage.

## Iframe Support

Many hooks in App-Studio support working inside iframes for micro-frontend architectures, preview environments, and embedded widgets.

**Supported hooks:** `useScroll`, `useScrollAnimation`, `useScrollDirection`, `useSmoothScroll`, `useClickOutside`, plus `ResponsiveProvider` and `WindowSizeProvider`.

See the dedicated [Iframe Support Guide](./IframeSupport.md) for complete documentation and examples.

## Scroll Hooks

### useScroll

A hook that tracks scroll position and progress for a container or window. Supports tracking scroll inside iframes.

```tsx
import { useScroll } from 'app-studio';

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

#### Tracking Scroll Inside an Iframe

When you pass an `HTMLIFrameElement` reference to the `container` option, `useScroll` automatically detects the iframe context and tracks scroll within the iframe's window:

```tsx
import { useScroll } from 'app-studio';

function IframeScrollTracker() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Pass the iframe ref - useScroll will track the iframe's scroll position
  const scrollPosition = useScroll({
    container: iframeRef,
    throttleMs: 50
  });

  return (
    <div>
      <p>Iframe Scroll Y: {Math.round(scrollPosition.y)}px</p>
      <p>Iframe Scroll Progress: {Math.round(scrollPosition.yProgress * 100)}%</p>
      <iframe
        ref={iframeRef}
        src="/your-iframe-content"
        style={{ width: '100%', height: '400px' }}
      />
    </div>
  );
}
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `container` | `RefObject<HTMLElement>` | window | Reference to the scrollable container. If an `HTMLIFrameElement` is passed, tracks the iframe's content scroll. |
| `offset` | `[number, number]` | `[0, 0]` | X and Y offset values to add to scroll position |
| `throttleMs` | `number` | `100` | Throttle interval in milliseconds for performance |
| `disabled` | `boolean` | `false` | Whether to disable scroll tracking |

**Returns:** `ScrollPosition`

| Property | Type | Description |
|----------|------|-------------|
| `x` | `number` | Horizontal scroll position in pixels |
| `y` | `number` | Vertical scroll position in pixels |
| `xProgress` | `number` | Horizontal scroll progress (0 to 1) |
| `yProgress` | `number` | Vertical scroll progress (0 to 1) |

### useScrollDirection

A hook that detects scroll direction. Supports tracking direction inside iframes via the `targetWindow` parameter.

```tsx
import { useScrollDirection } from 'app-studio';

function ScrollDirectionComponent() {
  const scrollDirection = useScrollDirection(50);

  return (
    <div>
      Currently scrolling: {scrollDirection}
    </div>
  );
}
```

#### With Iframe Support

```tsx
import { useScrollDirection } from 'app-studio';

function IframeScrollDirection({ iframeWindow }: { iframeWindow: Window }) {
  // Track scroll direction inside an iframe
  const scrollDirection = useScrollDirection(5, iframeWindow);

  return (
    <div>
      Iframe scroll direction: {scrollDirection}
    </div>
  );
}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `threshold` | `number` | `5` | Minimum scroll distance in pixels before direction change is detected |
| `targetWindow` | `Window` | `window` | Target window to track (use `iframe.contentWindow` for iframe support) |

**Returns:** `'up' | 'down'`

### useSmoothScroll

A hook that provides smooth scrolling functionality to elements. Supports scrolling inside iframes via the `targetWindow` parameter.

```tsx
import { useSmoothScroll } from 'app-studio';

function SmoothScrollComponent() {
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

#### With Iframe Support

```tsx
import { useSmoothScroll } from 'app-studio';

function IframeSmoothScroll({ iframeWindow }: { iframeWindow: Window }) {
  // Smooth scroll inside an iframe
  const scrollTo = useSmoothScroll(iframeWindow);
  const targetRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <button onClick={() => scrollTo(targetRef.current, 80)}>
        Scroll to Section in Iframe
      </button>
      <div ref={targetRef}>Target Section</div>
    </>
  );
}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `targetWindow` | `Window` | `window` | Target window to scroll (use `iframe.contentWindow` for iframe support) |

**Returns:** `(element: HTMLElement | null, offset?: number) => void`

The returned function accepts:
- `element`: The element to scroll to
- `offset`: Optional offset from the top in pixels (default: 0)

### useScrollAnimation

A hook for creating scroll-linked animations using Intersection Observer. Supports automatic iframe detection and explicit `targetWindow` for cross-window observation.

```tsx
import { useScrollAnimation } from 'app-studio';

function ScrollAnimationComponent() {
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

#### With Multiple Thresholds

Use an array of thresholds to get granular progress updates:

```tsx
import { useScrollAnimation } from 'app-studio';

function AnimatedSection({ index }: { index: number }) {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { isInView, progress } = useScrollAnimation(sectionRef, {
    threshold: [0, 0.25, 0.5, 0.75, 1], // Fire at each 25% visibility
  });

  return (
    <div
      ref={sectionRef}
      style={{
        opacity: 0.3 + progress * 0.7,
        transform: `scale(${0.85 + progress * 0.15})`,
        transition: 'opacity 0.4s, transform 0.4s',
      }}
    >
      <span>{isInView ? '✓ In View' : '○ Out of View'}</span>
      <span>Progress: {(progress * 100).toFixed(0)}%</span>
    </div>
  );
}
```

#### With Iframe Support

The hook automatically detects when elements are inside an iframe and uses the correct `IntersectionObserver`. You can also explicitly pass `targetWindow`:

```tsx
import { useScrollAnimation } from 'app-studio';

function IframeAnimatedSection({ targetWindow }: { targetWindow?: Window }) {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Auto-detect iframe context or use explicit targetWindow
  const { isInView, progress } = useScrollAnimation(sectionRef, {
    threshold: [0, 0.25, 0.5, 0.75, 1],
    targetWindow, // Optional: explicitly set the iframe's window
  });

  return (
    <div
      ref={sectionRef}
      style={{
        opacity: 0.3 + progress * 0.7,
        background: isInView ? '#e8f5e9' : '#f5f5f5',
      }}
    >
      Progress: {(progress * 100).toFixed(0)}%
    </div>
  );
}
```

#### With Callback

Use the `onIntersectionChange` callback for custom logic:

```tsx
const { isInView, progress } = useScrollAnimation(ref, {
  threshold: 0.5,
  onIntersectionChange: (isIntersecting, ratio) => {
    if (isIntersecting) {
      analytics.track('section_viewed', { visibility: ratio });
    }
  },
});
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `threshold` | `number \| number[]` | `0` | Visibility threshold(s) to trigger updates (0-1) |
| `rootMargin` | `string` | `'0px'` | Margin around the root for intersection calculation |
| `root` | `Element \| null` | `null` | Custom root element for intersection |
| `targetWindow` | `Window \| null` | auto-detected | Target window for iframe support. Auto-detects from element's `ownerDocument` if not specified. |
| `onIntersectionChange` | `(isIntersecting: boolean, ratio: number) => void` | - | Callback fired on intersection changes |

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `isInView` | `boolean` | Whether the element is currently in view |
| `progress` | `number` | Intersection ratio (0 to 1) based on threshold |

### useInfiniteScroll

A hook for implementing infinite scroll functionality.

```tsx
import { useInfiniteScroll } from 'app-studio';

function InfiniteScrollComponent() {
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

## Theme Hooks

### useTheme

Access and modify theme settings.

```tsx
import { useTheme } from 'app-studio';

function ThemeComponent() {
  const { themeMode, setThemeMode, getColor } = useTheme();

  return (
    <>
      <Button onClick={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </Button>
      <View backgroundColor={getColor('theme-primary')}>
        Themed content
      </View>
    </>
  );
}
```

## Responsive Hooks

### useResponsive

Access responsive breakpoints and utilities.

```tsx
import { useResponsive } from 'app-studio';

function ResponsiveComponent() {
  const { screen, orientation, on } = useResponsive();

  return (
    <>
      <Text>Current Screen: {screen}, Orientation: {orientation}</Text>
      {on('mobile') && <Text>Mobile View</Text>}
      {on('desktop') && <Text>Desktop View</Text>}
    </>
  );
}
```

## Interaction Hooks

### useHover

Detect hover state on elements.

```tsx
import { useHover } from 'app-studio';

function HoverComponent() {
  const [ref, isHovered] = useHover();

  return (
    <View
      ref={ref}
      backgroundColor={isHovered ? 'blue' : 'gray'}
    >
      Hover over me!
    </View>
  );
}
```

### useFocus

Track focus state of elements.

```tsx
import { useFocus } from 'app-studio';

function FocusComponent() {
  const [ref, isFocused] = useFocus();

  return (
    <Input
      ref={ref}
      borderColor={isFocused ? 'blue' : 'gray'}
      placeholder="Focus me"
    />
  );
}
```

### useClickOutside

Detects if a click occurred outside the referenced element.

```tsx
import { useClickOutside } from 'app-studio';

function ClickOutsideComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [ref] = useClickOutside(() => setIsOpen(false));

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Menu</Button>
      {isOpen && (
        <View ref={ref} padding={20} backgroundColor="white" boxShadow="md">
          Click outside to close
        </View>
      )}
    </>
  );
}
```

## Viewport Hooks

### useInView

Track element visibility in viewport using Intersection Observer.

```tsx
import { useInView } from 'app-studio';

function InViewComponent() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <View ref={ref} height={200} backgroundColor="gray-100">
      {inView ? 'Visible' : 'Hidden'}
    </View>
  );
}
```

### useWindowSize

Tracks the current width and height of the browser window.

```tsx
import { useWindowSize } from 'app-studio';

function WindowSizeComponent() {
  const { width, height } = useWindowSize();

  return (
    <Text>Window size: {width}px × {height}px</Text>
  );
}
```

### useElementPosition

Determines an element's relative position within the viewport and calculates where the most available space is around it. This hook is useful for understanding element positioning and making decisions about where to place overlays, tooltips, or other positioned content.

**Performance Optimized:** By default, only hover events are tracked for optimal performance. You can optionally enable scroll and resize tracking as needed.

```tsx
import { useElementPosition } from 'app-studio';

function PositionAwareComponent() {
  const { ref, relation, updateRelation } = useElementPosition();
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  // Determine tooltip placement based on available space
  const getTooltipStyle = () => {
    if (!relation) return {};

    const baseStyle = { position: 'absolute' as const };

    // Place tooltip where there's more space
    if (relation.space.vertical === 'top') {
      return { ...baseStyle, bottom: '100%', marginBottom: '8px' };
    } else {
      return { ...baseStyle, top: '100%', marginTop: '8px' };
    }
  };

  return (
    <View position="relative">
      <View
        ref={ref}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        padding={20}
        backgroundColor="gray-100"
        borderRadius={8}
      >
        Hover me for tooltip
        {relation && (
          <Text fontSize="sm" color="gray-600">
            Position: {relation.position.vertical}-{relation.position.horizontal}
            <br />
            More space: {relation.space.vertical}-{relation.space.horizontal}
          </Text>
        )}
      </View>

      {showTooltip && (
        <View
          style={getTooltipStyle()}
          padding={8}
          backgroundColor="black"
          color="white"
          borderRadius={4}
          fontSize="sm"
          whiteSpace="nowrap"
        >
          Tooltip positioned optimally!
        </View>
      )}
    </View>
  );
}

// Example with manual updates
function ManualUpdateExample() {
  const { ref, relation, updateRelation } = useElementPosition({
    trackChanges: false, // Disable automatic tracking
  });

  const handleClick = () => {
    updateRelation(); // Manually trigger position calculation
  };

  return (
    <View>
      <Button onClick={handleClick}>Update Position</Button>
      {relation && (
        <Text>
          Element is in {relation.position.vertical}-{relation.position.horizontal} of viewport.
          More space available on {relation.space.vertical} and {relation.space.horizontal}.
        </Text>
      )}
      <View ref={ref} padding={20} backgroundColor="blue-100" marginTop={20}>
        Target Element
      </View>
    </View>
  );
}

// Example with custom event configuration
function CustomEventsExample() {
  const { ref, relation } = useElementPosition({
    trackOnHover: true,    // Track on hover (default: true)
    trackOnScroll: true,   // Also track on scroll (default: false)
    trackOnResize: true,   // Also track on resize (default: false)
    throttleMs: 50,        // Faster throttling for scroll/resize
  });

  return (
    <View ref={ref} padding={20} backgroundColor="green-100">
      Hover, scroll, or resize to see updates
      {relation && (
        <Text fontSize="sm" marginTop={8}>
          Position: {relation.position.vertical}-{relation.position.horizontal}
          <br />
          More space: {relation.space.vertical}-{relation.space.horizontal}
        </Text>
      )}
    </View>
  );
}
```

**Options:**
- `trackChanges` (boolean): Whether to automatically track position changes (default: true)
- `throttleMs` (number): Throttle delay for position updates in milliseconds (default: 100)
- `trackOnHover` (boolean): Whether to track on hover events (default: true)
- `trackOnScroll` (boolean): Whether to track on scroll events (default: false)
- `trackOnResize` (boolean): Whether to track on resize events (default: false)

**Returns:**
- `ref`: React ref to attach to the target element
- `relation`: Object containing position and space information, or null if not calculated
  - `position.vertical`: 'top' | 'bottom' - Element's general location in viewport
  - `position.horizontal`: 'left' | 'right' - Element's general location in viewport
  - `space.vertical`: 'top' | 'bottom' - Where more space exists vertically
  - `space.horizontal`: 'left' | 'right' - Where more space exists horizontally
- `updateRelation`: Function to manually trigger position recalculation

**Key Features:**
- Automatically tracks element position relative to viewport
- Calculates available space on all sides of the element
- Provides optimal placement suggestions for overlays
- Configurable event tracking (hover, scroll, resize) for performance optimization
- Hover events trigger immediate updates for better UX
- Scroll/resize events are throttled for performance
- Works within scrollable containers (tracks relative to window viewport)
- Lightweight and focused on viewport relationship data
- Hover-only tracking by default for optimal performance

## Utility Hooks

### useMount

Execute code on component mount.

```tsx
import { useMount } from 'app-studio';

function MountComponent() {
  useMount(() => {
    console.log('Component mounted');
    return () => console.log('Component unmounted');
  });

  return <View>I'm mounted!</View>;
}
```

### useKeyPress

Detects when a specific key is pressed.

```tsx
import { useKeyPress } from 'app-studio';

function KeyPressComponent() {
  const isEscapePressed = useKeyPress('Escape');

  return (
    <View>
      {isEscapePressed ? 'You pressed Escape!' : 'Press Escape key'}
    </View>
  );
}
```
