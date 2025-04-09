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
