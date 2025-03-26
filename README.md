# App-Studio 

App-Studio is a React library that simplifies the creation of modern web applications by providing reusable components, hooks, and utilities. It offers built-in support for theming, responsive design, and analytics, making it an ideal choice for developers aiming to build high-quality, efficient, and scalable projects. Key features include:

- A robust set of UI components for layouts, forms, and more.
- Hooks for managing state, events, and responsiveness.
- Providers for theming, responsiveness, and analytics.
- Utilities for styling, colors, and typography.

Whether you're building a small prototype or a large-scale application, App-Studio empowers you to work faster and smarter.

---

# Installation

To get started with App-Studio, install it via npm and set up the necessary providers in your application.

Prerequisites

- Node.js (>= 14.x)
- React (>= 17.x)

# Installation Steps

Run the following command to install App-Studio:

bash

```bash
npm install --save app-studio 
```

After installation, wrap your application with the core providers to enable theming, responsiveness, and analytics:

jsx

```jsx
import { ThemeProvider, ResponsiveProvider, AnalyticsProvider } from 'app-studio';

function App() {
  return (
    <ThemeProvider>
      <ResponsiveProvider>
        <AnalyticsProvider>
          {/* Your application components */}
        </AnalyticsProvider>
      </ResponsiveProvider>
    </ThemeProvider>
  );
}

export default App;
```

---

# Components

App-Studio provides a set of reusable components to handle common UI tasks. Below is detailed documentation for each component.

## View

The View component is a versatile container for creating layouts, supporting a wide range of styling options.

Props

| **Prop** | **Type** | **Default** | **Description** |
| --- | --- | --- | --- |
| as | string | 'div' | The HTML element to render as. |
| children | React.ReactNode | - | Content inside the view. |

Example

jsx

```jsx
import { View } from 'app-studio';

function MyComponent() {
  return (
    <View
      backgroundColor="color.blue.500"
      padding={16}
      borderRadius={8}
      onClick={() => console.log('Clicked!')}
    >
      Hello, World!
    </View>
  );
}
```

Best Practices

- Use as to render semantic HTML elements (e.g., section, article).
- Leverage theme colors for consistent styling.

## Image

The Image component optimizes image loading and rendering.

Props

| **Prop** | **Type** | **Default** | **Description** |
| --- | --- | --- | --- |
| src | string | - | Image URL. |
| alt | string | - | Alternative text for the image. |
| lazy | boolean | true | Enables lazy loading. |

Example

jsx

```jsx
import { Image } from 'app-studio';

function MyComponent() {
  return <Image src="example.jpg" alt="Example" lazy />;
}
```

## Text

The Text component provides styled text with typography support.

Props

| **Prop** | **Type** | **Default** | **Description** |
| --- | --- | --- | --- |
| as | string | 'p' | HTML element to render as. |
| size | string | 'md' | Font size (e.g., 'sm', 'lg'). |
| weight | string | 'normal' | Font weight (e.g., 'bold'). |

Example

jsx

```jsx
import { Text } from 'app-studio';

function MyComponent() {
  return <Text size="lg" weight="bold">Bold Large Text</Text>;
}
```

## Form

The Form component simplifies form creation and validation.

Props

| **Prop** | **Type** | **Default** | **Description** |
| --- | --- | --- | --- |
| onSubmit | function | - | Callback on form submission. |
| children | React.ReactNode | - | Form fields and elements. |

Example

jsx

```jsx
import { Form } from 'app-studio';

function MyComponent() {
  return (
    <Form onSubmit={(data) => console.log(data)}>
      <input name="username" />
      <button type="submit">Submit</button>
    </Form>
  );
}
```

## Skeleton

The Skeleton component displays a placeholder while content loads.

Props

| **Prop** | **Type** | **Default** | **Description** |
| --- | --- | --- | --- |
| width | string | '100%' | Width of the skeleton. |
| height | string | '20px' | Height of the skeleton. |

Example

jsx

```jsx
import { Skeleton } from 'app-studio';

function MyComponent() {
  return <Skeleton width="200px" height="30px" />;
}
```

# Hooks

App-Studio includes a variety of hooks to manage state, events, and responsiveness.

## useActive

Detects if an element is active (e.g., pressed).

Parameters

None.

Return Values

| **Value** | **Type** | **Description** |
| --- | --- | --- |
| active | boolean | Whether the element is active. |

Example

jsx

```jsx
import { useActive } from 'app-studio';

function MyComponent() {
  const { active } = useActive();
  return <button style={{ opacity: active ? 0.7 : 1 }}>Click me</button>;
}
```

## useClickOutside

Triggers a callback when clicking outside an element.

Parameters

| **Param** | **Type** | **Description** |
| --- | --- | --- |
| callback | function | Called when clicking outside. |

Example

jsx

```jsx
import { useClickOutside } from 'app-studio';
import { useRef } from 'react';

function MyComponent() {
  const ref = useRef();
  useClickOutside(() => console.log('Clicked outside'), ref);
  return <div ref={ref}>Click outside me</div>;
}
```

## useFocus

Tracks focus state of an element.

Return Values

| **Value** | **Type** | **Description** |
| --- | --- | --- |
| focused | boolean | Whether the element is focused. |

Example

jsx

```jsx
import { useFocus } from 'app-studio';

function MyComponent() {
  const { focused } = useFocus();
  return <input style={{ borderColor: focused ? 'blue' : 'gray' }} />;
}
```

## useHover

Detects if an element is being hovered.

Return Values

| **Value** | **Type** | **Description** |
| --- | --- | --- |
| hovered | boolean | Whether the element is hovered. |

Example

jsx

```jsx
import { useHover } from 'app-studio';

function MyComponent() {
  const { hovered } = useHover();
  return <div style={{ background: hovered ? 'lightgray' : 'white' }}>Hover me</div>;
}
```

## useInView

Detects if an element is in the viewport.

Return Values

| **Value** | **Type** | **Description** |
| --- | --- | --- |
| inView | boolean | Whether the element is in view. |

Example

jsx

```jsx
import { useInView } from 'app-studio';
import { useRef } from 'react';

function MyComponent() {
  const ref = useRef();
  const { inView } = useInView(ref);
  return <div ref={ref}>{inView ? 'Visible' : 'Hidden'}</div>;
}
```

## useKeyPress

Detects key presses.

Parameters

| **Param** | **Type** | **Description** |
| --- | --- | --- |
| key | string | The key to listen for (e.g., 'Enter'). |

Return Values

| **Value** | **Type** | **Description** |
| --- | --- | --- |
| pressed | boolean | Whether the key is pressed. |

Example

jsx

```jsx
import { useKeyPress } from 'app-studio';

function MyComponent() {
  const pressed = useKeyPress('Enter');
  return <div>{pressed ? 'Enter pressed' : 'Waiting...'}</div>;
}
```

## useMount

Runs a callback when the component mounts.

Parameters

| **Param** | **Type** | **Description** |
| --- | --- | --- |
| callback | function | Called on mount. |

Example

jsx

```jsx
import { useMount } from 'app-studio';

function MyComponent() {
  useMount(() => console.log('Mounted'));
  return <div>Hello</div>;
}
```

## useOnScreen

Similar to useInView, detects if an element is on screen.

Return Values

| **Value** | **Type** | **Description** |
| --- | --- | --- |
| onScreen | boolean | Whether the element is on screen. |

Example

jsx

```jsx
import { useOnScreen } from 'app-studio';
import { useRef } from 'react';

function MyComponent() {
  const ref = useRef();
  const { onScreen } = useOnScreen(ref);
  return <div ref={ref}>{onScreen ? 'On screen' : 'Off screen'}</div>;
}
```

## useResponsive

Provides screen size and orientation data.

Return Values

| **Value** | **Type** | **Description** |
| --- | --- | --- |
| screen | string | Current screen size (e.g., 'xs', 'sm'). |
| orientation | `'landscape' | 'portrait'` |
| on | function | Checks if the screen matches a size. |

Example

jsx

```jsx
import { useResponsive } from 'app-studio';

function MyComponent() {
  const { screen, orientation, on } = useResponsive();
  return (
    <div>
      Screen: {screen}, Orientation: {orientation}
      {on('mobile') && <div>Mobile view</div>}
    </div>
  );
}
```

## useScroll

Tracks scroll position and direction.

Parameters

| **Param** | **Type** | **Default** | **Description** |
| --- | --- | --- | --- |
| throttleMs | number | 100 | Throttle updates (in ms). |

Return Values

| **Value** | **Type** | **Description** |
| --- | --- | --- |
| scrollY | number | Vertical scroll position. |
| scrollX | number | Horizontal scroll position. |

Example

jsx

```jsx
import { useScroll } from 'app-studio';

function MyComponent() {
  const { scrollY } = useScroll({ throttleMs: 200 });
  return <div>Scroll Y: {scrollY}px</div>;
}
```

## useWindowSize

Tracks window dimensions.

Return Values

| **Value** | **Type** | **Description** |
| --- | --- | --- |
| width | number | Window width. |
| height | number | Window height. |

Example

jsx

```jsx
import { useWindowSize } from 'app-studio';

function MyComponent() {
  const { width, height } = useWindowSize();
  return <div>Window: {width}x{height}</div>;
}
```

---

# Providers

Providers manage global state and functionality across your application.

## AnalyticsProvider

Enables analytics tracking.

Props

| **Prop** | **Type** | **Default** | **Description** |
| --- | --- | --- | --- |
| trackEvent | function | - | Callback for tracking events. |

Example

jsx

```jsx
import { AnalyticsProvider } from 'app-studio';

function App() {
  return (
    <AnalyticsProvider  
        trackEvent={({ type, target, ...event }) => {
            AppAnalytics.track(`${type}_${target}`, event);
          }}>
      {/* App content */}
    </AnalyticsProvider>
  );
}
```

## ResponsiveProvider

Manages responsive design context.

Props

| **Prop** | **Type** | **Default** | **Description** |
| --- | --- | --- | --- |
| breakpoints | object | - | Custom breakpoints. |

Example

jsx

```jsx
import { ResponsiveProvider } from 'app-studio';

function App() {
  return (
    <ResponsiveProvider breakpoints={{ xs: 0, sm: 600, md: 960 }}>
      {/* App content */}
    </ResponsiveProvider>
  );
}
```

## ThemeProvider

Manages theming, including colors and typography.

Props

| **Prop** | **Type** | **Default** | **Description** |
| --- | --- | --- | --- |
| theme | Theme | - | Custom theme configuration. |
| mode | `'light' | 'dark'` | 'light' |
| dark | Colors | - | Dark mode colors. |
| light | Colors | - | Light mode colors. |

Context

- getColor: Resolves theme colors.
- theme: Current theme configuration.
- themeMode: Current mode.
- setThemeMode: Switches mode.

Example

jsx

```jsx
import { ThemeProvider, useTheme } from 'app-studio';

function App() {
  return (
    <ThemeProvider mode="dark">
      <MyComponent />
    </ThemeProvider>
  );
}

function MyComponent() {
  const { getColor, themeMode } = useTheme();
  return <div style={{ color: getColor('primary') }}>{themeMode} mode</div>;
}
```

---

# Utilities

Utilities provide helper functions and constants.

Colors

Predefined color palettes for theming.

Usage

jsx

```jsx
import { useTheme } from 'app-studio';

function MyComponent() {
  const { getColor } = useTheme();
  return <div style={{ backgroundColor: getColor('color.blue.500') }} />;
}
```

# Constants

Common values like breakpoints and sizes.

Usage

jsx

```jsx
import { BREAKPOINTS } from 'app-studio/constants';

console.log(BREAKPOINTS.sm); // 600
```

## Theming

Customize themes with ThemeProvider. Define light and dark modes and use getColor to access colors.

Example

jsx

```jsx
<ThemeProvider
  theme={{ primary: '#007bff' }}
  dark={{ background: '#333' }}
  light={{ background: '#fff' }}
/>
```

---

# Responsive Design

Use ResponsiveProvider and useResponsive to adapt to screen sizes.

Example

jsx

```jsx
const { on } = useResponsive();
return on('sm') ? <SmallLayout /> : <LargeLayout />;
```

---

## Analytics

Integrate analytics with AnalyticsProvider to track events.

Example

jsx

```jsx
<AnalyticsProvider config={{ provider: 'google', trackingId: 'UA-123' }} />
```

---

API Reference

- Components: View, Image, Text, Form, Skeleton, Wrapper
- Hooks: useActive, useClickOutside, etc.
- Providers: AnalyticsProvider, ResponsiveProvider, ThemeProvider
- Utilities: colors, constants, etc.

---

Examples

## Responsive Layout

jsx

```jsx
import { View, useResponsive } from 'app-studio';

function Layout() {
  const { on } = useResponsive();
  return (
    <View flexDirection={on('mobile') ? 'column' : 'row'}>
      <View>Sidebar</View>
      <View>Main Content</View>
    </View>
  );
}
```

---

Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch.
3. Submit a pull request with tests.

---

Changelog

- v1.0.0: Initial release with components, hooks, and providers.