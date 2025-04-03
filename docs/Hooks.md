# Hooks

The `app-studio` library provides a set of custom React hooks to simplify building responsive, interactive, and maintainable components. These hooks cover various needs: lifecycle management, responsiveness, user interactions (hover, focus, clicks outside), and more.

---

## 1. useMount

The `useMount` hook allows you to run code when a component is first mounted. It takes a callback function that will be called only once, when the component mounts.

### Syntax

```tsx
useMount(callback: () => void): void;
```

### Parameters

-   `callback`: A function invoked when the component mounts.

### Example

```tsx
import { useMount } from 'app-studio';

const MyComponent = () => {
    useMount(() => {
        console.log('MyComponent mounted');
    });

    return <div>MyComponent</div>;
};
```

When `MyComponent` is mounted, "MyComponent mounted" will be logged to the console.

---

## 2. useResponsive

The `useResponsive` hook makes it easier to build responsive components. It leverages the library’s responsive context to obtain breakpoints, media queries, and offers utility functions for checking the current screen size and device type.

### Syntax

```tsx
const { screen, on, is } = useResponsive();
```

### Returned Values

-   `screen`: The current screen size based on defined breakpoints.
-   `on(criteria: string)`: *Function*. Returns `true` if the current screen size falls within the device criteria (e.g., 'mobile', 'tablet', 'desktop') defined in the `ResponsiveProvider`.
-   `is(breakpoint: string)`: *Function*. Returns `true` if the current screen size matches the specific breakpoint (e.g., 'xs', 'sm', 'md', 'lg', 'xl').

### Example

```tsx
import { useResponsive } from 'app-studio';

const MyComponent = () => {
    const { screen, on, is } = useResponsive();

    console.log('Current screen wxh:', screen);

    if (on('mobile')) {
        console.log('On a mobile device');
    }

    if (is('xs')) {
        console.log('Extra small screen size');
    }

    return <div>MyComponent</div>;
};
```

---

## 3. useHover

The `useHover` hook detects whether the referenced element is currently hovered by the mouse.

### Syntax

```tsx
const [ref, hover] = useHover<T extends HTMLElement = HTMLElement>(): [
    React.RefObject<T>,
    boolean
];
```

### Returned Values

-   `ref`: A ref to attach to the element you want to observe.
-   `hover`: A boolean indicating if the element is hovered (`true` if hovered, `false` otherwise).

### Example

```tsx
import { useHover } from 'app-studio';

const HoverComponent = () => {
    const [ref, hover] = useHover<HTMLDivElement>();

    return (
        <div
            ref={ref}
            style={{
                background: hover ? 'red' : 'blue',
                width: '100px',
                height: '100px',
            }}
        >
            Hover over me!
        </div>
    );
};
```

---

## 4. useFocus

The `useFocus` hook indicates whether the referenced element is currently focused.

### Syntax

```tsx
const [ref, focused] = useFocus<T extends HTMLElement = HTMLElement>(): [
    React.RefObject<T>,
    boolean
];
```

### Returned Values

-   `ref`: A ref to attach to the target element.
-   `focused`: A boolean indicating if the element is focused (`true` if yes, `false` otherwise).

### Example

```tsx
import { useFocus } from 'app-studio';

const FocusInput = () => {
    const [ref, focused] = useFocus<HTMLInputElement>();

    return (
        <input
            ref={ref}
            style={{
                border: focused ? '2px solid blue' : '1px solid black',
                padding: '8px',
                outline: 'none',
            }}
        />
    );
};
```

---

## 5. useActive

The `useActive` hook indicates if the referenced element is currently being pressed (e.g., during a mousedown or touchstart).

### Syntax

```tsx
const [ref, active] = useActive<T extends HTMLElement = HTMLElement>(): [
    React.RefObject<T>,
    boolean
];
```

### Returned Values

-   `ref`: A ref to attach to the element.
-   `active`: A boolean indicating if the element is active (clicked or touched).

### Example

```tsx
import { useActive } from 'app-studio';

const ActiveButton = () => {
    const [ref, active] = useActive<HTMLButtonElement>();

    return (
        <button
            ref={ref}
            style={{
                background: active ? 'green' : 'gray',
                color: 'white',
                padding: '10px 20px',
            }}
        >
            {active ? 'Pressed' : 'Normal'}
        </button>
    );
};
```

---

## 6. useKeyPress

The `useKeyPress` hook detects if a specific keyboard key is currently pressed.

### Syntax

```tsx
const keyPressed = useKeyPress(targetKey: string): boolean;
```

### Parameters

-   `targetKey`: The key to monitor (e.g. 'Enter', 'Escape', 'a').

### Returned Values

-   `keyPressed`: A boolean indicating if the specified key is pressed.

### Example

```tsx
import { useKeyPress } from 'app-studio';

const KeyPressComponent = () => {
    const isEnterPressed = useKeyPress('Enter');

    return (
        <div>{isEnterPressed ? 'Enter key is pressed' : 'Press the Enter key'}</div>
    );
};
```

---

## 7. useWindowSize

The `useWindowSize` hook provides the current window size (width and height) and updates when the window is resized.

### Syntax

```tsx
const { width, height } = useWindowSize(): {
    width: number;
    height: number;
};
```

### Returned Values

-   `width`: The current window width.
-   `height`: The current window height.

### Example

```tsx
import { useWindowSize } from 'app-studio';

const WindowSizeComponent = () => {
    const { width, height } = useWindowSize();

    return <div>Window wxh: {width} x {height}</div>;
};
```

---

## 8. useOnScreen

The `useOnScreen` hook uses the Intersection Observer API to determine if the referenced element is visible in the viewport.

### Syntax

```tsx
const [ref, isOnScreen] = useOnScreen<
    T extends HTMLElement = HTMLElement
>(options?: IntersectionObserverInit): [React.RefObject<T>, boolean];
```

### Parameters

-   `options`: Optional Intersection Observer options.

### Returned Values

-   `ref`: A ref to attach to the element.
-   `isOnScreen`: A boolean indicating if the element is on the screen.

### Example

```tsx
import { useOnScreen } from 'app-studio';

const OnScreenComponent = () => {
    const [ref, isOnScreen] = useOnScreen<HTMLDivElement>();

    return (
        <div
            ref={ref}
            style={{ height: '200px', background: isOnScreen ? 'lime' : 'tomato' }}
        >
            {isOnScreen ? 'Visible' : 'Not visible'}
        </div>
    );
};
```

---

## 9. useClickOutside

The `useClickOutside` hook detects clicks made outside of the referenced element.

### Syntax

```tsx
const [ref, clickedOutside] = useClickOutside<
    T extends HTMLElement = HTMLElement
>(): [React.RefObject<T>, boolean];
```

### Returned Values

-   `ref`: A ref to attach to the target element.
-   `clickedOutside`: A boolean indicating if a click outside the element was detected.

### Example

```tsx
import { useState } from 'react';
import { useClickOutside } from 'app-studio';

const Dropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [ref, clickedOutside] = useClickOutside<HTMLDivElement>();

    // Toggle the dropdown state when clickedOutside changes
    useEffect(() => {
        if (clickedOutside) {
            setIsOpen(false);
        }
    }, [clickedOutside]);

    return (
        <div ref={ref} style={{ border: '1px solid black', padding: '10px' }}>
            <button onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? 'Close Dropdown' : 'Open Dropdown'}
            </button>
            {isOpen && (
                <div style={{ marginTop: '10px' }}>
                    Dropdown Content Here
                </div>
            )}
        </div>
    );
};
```

## 10. useScroll

The `useScroll` hook provides the current scroll position and progress of a scrollable container or the window.

## Usage

```tsx
import React, { useRef } from 'react';
import { useScroll , View} from 'app-studio';

const MyComponent = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { x, y, xProgress, yProgress } = useScroll({ container: containerRef });

  return (
    <View ref={containerRef} overflow='auto' height='200px' >
      <View height='1000px'>
        <p>Scroll Position X: {x}</p>
        <p>Scroll Position Y: {y}</p>
        <p>Scroll Progress X: {xProgress}</p>
        <p>Scroll Progress Y: {yProgress}</p>
      </View>
    </View>
  );
};
```

## Parameters

- **`container`**: `RefObject<HTMLElement>` *(optional)*  
  A ref to a scrollable element. If not provided, `window` is used.

- **`offset`**: `[number, number]` *(optional)*  
  Additional offset values for the X and Y scroll positions. Defaults to `[0, 0]`.

## Returns

- **`x`**: `number`  
  Current horizontal scroll position.

- **`y`**: `number`  
  Current vertical scroll position.

- **`xProgress`**: `number`  
  Horizontal scroll progress as a value between 0 and 1.

- **`yProgress`**: `number`  
  Vertical scroll progress as a value between 0 and 1.
```
