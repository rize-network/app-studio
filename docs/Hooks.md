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

Tracks the position and dimensions of an element relative to the window, providing intelligent helper methods for positioning overlays like context menus, tooltips, and dropdowns. The hook automatically calculates available space on all sides and chooses the optimal placement to prevent overflow.

```tsx
import { useElementPosition } from 'app-studio';

function ContextMenuComponent() {
  const { ref, position, helpers } = useElementPosition();
  const [showMenu, setShowMenu] = useState(false);

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowMenu(true);
  };

  const menuPosition = helpers.getContextMenuPosition(200, 150);

  return (
    <>
      <View
        ref={ref}
        onContextMenu={handleRightClick}
        padding={20}
        backgroundColor="gray.100"
      >
        Right-click me for context menu
        {position && (
          <div>Position: {Math.round(position.x)}, {Math.round(position.y)}</div>
        )}
      </View>

      {showMenu && (
        <View
          position="fixed"
          left={menuPosition.x}
          top={menuPosition.y}
          width={200}
          height={150}
          backgroundColor="white"
          boxShadow="md"
          borderRadius={8}
        >
          Context Menu ({menuPosition.placement})
        </View>
      )}
    </>
  );
}

// Advanced example with scrollable container
function ScrollableContainerDemo() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { ref, position, helpers } = useElementPosition({
    scrollContainer: scrollContainerRef,
    useFixedPositioning: false, // Position relative to container
  });

  const [showMenu, setShowMenu] = useState(false);
  const menuPosition = helpers.getContextMenuPosition(180, 100);

  return (
    <View height="400px" display="flex" gap={20}>
      {/* Scrollable container */}
      <View
        ref={scrollContainerRef}
        flex={1}
        height="100%"
        css={{ overflow: 'auto' }}
        backgroundColor="gray.50"
        borderRadius={8}
      >
        {/* Large content area */}
        <View width="800px" height="800px" position="relative">
          <View
            ref={ref}
            position="absolute"
            top={200}
            left={300}
            width={120}
            height={80}
            backgroundColor="blue.500"
            color="white"
            borderRadius={8}
            padding={12}
            cursor="pointer"
            onClick={() => setShowMenu(!showMenu)}
          >
            Click me for menu
            {position && (
              <div>Pos: {Math.round(position.x)}, {Math.round(position.y)}</div>
            )}
          </View>

          {/* Context menu positioned within scrollable container */}
          {showMenu && (
            <View
              position="absolute"
              left={menuPosition.x}
              top={menuPosition.y}
              width={180}
              height={100}
              backgroundColor="white"
              boxShadow="lg"
              borderRadius={8}
              padding={12}
            >
              Menu ({menuPosition.placement})
              <br />
              Stays within scroll bounds
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
```

**Options:**
- `trackChanges` (boolean): Whether to automatically track position changes (default: true)
- `throttleMs` (number): Throttle delay for position updates in milliseconds (default: 16)
- `includeScroll` (boolean): Whether to include scroll events (default: true)
- `includeResize` (boolean): Whether to include resize events (default: true)
- `offset` (object): Custom offset for calculations (default: { x: 0, y: 0 })
- `scrollContainer` (RefObject): Reference to scrollable container (default: null, uses window)
- `useFixedPositioning` (boolean): Use fixed positioning relative to viewport (default: false)

**Returns:**
- `ref`: React ref to attach to the element
- `position`: Current position data (x, y, width, height, top, left, right, bottom)
- `helpers`: Helper methods for positioning overlays
- `updatePosition`: Manual position update function

**Helper Methods:**
- `getAvailableSpace()`: Returns available space on all sides (top, right, bottom, left)
- `getOptimalPosition(width, height, offset?)`: Calculates optimal placement based on available space
- `getContextMenuPosition(width, height)`: Optimal position for context menus (uses getOptimalPosition)
- `getTooltipPosition(width, height, offset?)`: Optimal position for tooltips (uses getOptimalPosition)
- `getDropdownPosition(width, height)`: Optimal position for dropdowns (uses getOptimalPosition)
- `isInViewport()`: Check if element is visible in viewport
- `getViewportOverflow()`: Get overflow amounts for each side

**Intelligent Positioning:**
The hook automatically:
1. Calculates available space on all four sides (top, right, bottom, left)
2. Determines which placements can fit the overlay completely
3. If multiple placements fit, chooses the one with the most space
4. If no placement fits completely, chooses the side with the most available space
5. Works correctly within scrollable containers and with fixed positioning

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
