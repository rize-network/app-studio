# Hooks

App-Studio provides a comprehensive set of React hooks to help you build interactive and responsive applications. This guide covers all the available hooks and their usage.

## Scroll Hooks

### useScroll

A hook that tracks scroll position and progress for a container or window.

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

**Options:**

- `container`: Reference to the scrollable container (optional, defaults to window)
- `target`: Reference to the target element (optional)
- `offset`: X and Y offset values (optional, defaults to [0, 0])
- `throttleMs`: Throttle interval in milliseconds (optional, defaults to 100)
- `disabled`: Whether to disable the hook (optional, defaults to false)

### useScrollDirection

A hook that detects scroll direction.

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

**Parameters:**

- `threshold`: Minimum scroll distance in pixels before direction change is detected (optional, defaults to 0)

### useSmoothScroll

A hook that provides smooth scrolling functionality to elements.

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

### useScrollAnimation

A hook for creating scroll-linked animations using Intersection Observer.

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
      <View backgroundColor={getColor('theme.primary')}>
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
    <View ref={ref} height={200} backgroundColor="gray.100">
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
        backgroundColor="gray.100"
        borderRadius={8}
      >
        Hover me for tooltip
        {relation && (
          <Text fontSize="sm" color="gray.600">
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
      <View ref={ref} padding={20} backgroundColor="blue.100" marginTop={20}>
        Target Element
      </View>
    </View>
  );
}
```

**Options:**
- `trackChanges` (boolean): Whether to automatically track position changes on scroll/resize (default: true)
- `throttleMs` (number): Throttle delay for position updates in milliseconds (default: 100)

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
- Throttled updates during scroll/resize for performance
- Works within scrollable containers (tracks relative to window viewport)
- Lightweight and focused on viewport relationship data

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
