# App-Studio Documentation

Welcome to the App-Studio documentation. This guide will help you get started with App-Studio and explore its features.

## Table of Contents

1. [Installation](#installation)
2. [Core Concepts](#core-concepts)
3. [Documentation Guides](#documentation-guides)

## Installation

### Prerequisites

- Node.js (>= 14.x)
- React (>= 17.x)

### Setup

1. Install the package:
```bash
npm install --save app-studio
# or
yarn add app-studio
```

2. Set up providers:
```jsx
import {
  ThemeProvider,
  ResponsiveProvider,
  AnalyticsProvider,
  WindowSizeProvider
} from 'app-studio';

function App() {
  return (
    <ThemeProvider>
        <WindowSizeProvider>
      <ResponsiveProvider>
          <AnalyticsProvider>
            {/* Your app content */}
          </AnalyticsProvider>
      </ResponsiveProvider>
        </WindowSizeProvider>
    </ThemeProvider>
  );
}
```

## Core Concepts

### Element Component

The `Element` component is the foundation of App-Studio. It provides:
- Direct styling via props
- Responsive styles through `media` prop
- State-based styling via `on` prop
- Animation support

### Component Categories

- **Layout:** `View`, `Horizontal`, `Vertical`, `Scroll`, `SafeArea`
- **Typography:** `Text`, `Heading`
- **Media:** `Image`, `ImageBackground`
- **Forms:** `Form`, `Input`, `Button`
- **Feedback:** `Skeleton`, `Spinner`

### Style System

App-Studio uses a utility-prop system that:
- Converts props to CSS
- Supports responsive values
- Handles pseudo-states
- Manages animations

## Documentation Guides

Explore these guides to learn more about App-Studio:

- [Components](Components.md) - Detailed documentation of all available components
- [Hooks](Hooks.md) - Guide to the React hooks provided by App-Studio
- [Theming](Theming.md) - How to customize the look and feel of your app
- [Animation](Animation.md) - Creating animations with App-Studio
- [Responsive Design](Responsive.md) - Building responsive layouts
- [Design System](Design.md) - Understanding the design system
- [Event Handling](Events.md) - Working with events and interactions
- [Providers](Providers.md) - Context providers for global state
- [Migration Guide](../codemod/README.md) - Migrating to App-Studio

---

# Components

App-Studio provides a set of reusable components built on the `Element` base.

## Element

The fundamental building block. Renders as a specified HTML tag (`as` prop, defaults to `div`) and accepts extensive styling props.

**Key Props:**

| Prop      | Type                                   | Description                                                                                                |
| :-------- | :------------------------------------- | :--------------------------------------------------------------------------------------------------------- |
| `as`      | `keyof JSX.IntrinsicElements`          | HTML element tag to render (default: 'div').                                                               |
| `style`   | `CSSProperties`                        | Standard React style object.                                                                               |
| `css`     | `CSSProperties` or `string`            | Apply custom CSS styles or raw CSS strings.                                                                |
| `media`   | `Record<string, CssProps>`             | Defines styles for specific breakpoints or devices (e.g., `mobile`, `tablet`, `lg`).                         |
| `on`      | `Record<string, CssProps>`             | Defines styles for interaction states (e.g., `hover`, `focus`, `active`). Includes `animate` support here. |
| `animate` | `AnimationProps` or `AnimationProps[]` | Applies one or more animations from the `Animation` system.                                                |
| `size`    | `number` or `string`                   | Sets equal `width` and `height`.                                                                           |
| `shadow`  | `boolean` or `number`                  | Applies a pre-defined box-shadow effect (levels 0-9).                                                      |
| `blend`   | `boolean`                              | Explicitly applies `mix-blend-mode: difference`. **Default:** Active if `color` is undefined.              |
| `...rest` | `CssProps`                             | Accepts numerous CSS properties directly as props (e.g., `backgroundColor`, `padding`, `fontSize`, etc.).    |

**Example:**

```jsx
import { Element } from 'app-studio';

function MyStyledElement() {
  return (
    <Element
      as="section"
      padding={16}
      backgroundColor="color-blue-500"
      borderRadius={8}
      color="color-white"
      on={{ hover: { backgroundColor: 'color-blue-600' } }}
      media={{ mobile: { padding: 8 } }}
    >
      This is a styled section.
    </Element>
  );
}
```

## View

A versatile container component extending `Element`, primarily used for layout. Defaults to `div`.

**Key Features:**

*   Inherits all `Element` props.
*   Ideal for structuring UI and applying layout styles (Flexbox, Grid).

**Variants:**

*   `Horizontal`: A `View` with `display: flex`, `flexDirection: row`.
*   `Vertical`: A `View` with `display: flex`, `flexDirection: column`.
*   `Center`: A `View` with `display: flex`, `justifyContent: center`, `alignItems: center`.
*   `HorizontalResponsive`: Switches from `row` to `column` on `mobile`.
*   `VerticalResponsive`: Switches from `column` to `row` on `mobile`.
*   `Scroll`: Basic scrollable view (might need explicit overflow styles).
*   `SafeArea`: A view with `overflow: auto`.
*   `Div`, `Span`: Aliases for `Element` rendering `div` and `span` respectively.

**Example:**

```jsx
import { View, Horizontal, Text } from 'app-studio';

function MyLayout() {
  return (
    <View padding={16} backgroundColor="color-gray-100">
      <Horizontal gap={8} alignItems="center">
        <View width={50} height={50} backgroundColor="color-red-500" borderRadius="50%" />
        <Text fontSize="lg" fontWeight="bold">Item Title</Text>
      </Horizontal>
    </View>
  );
}
```

## Text

A component for rendering text content, extending `Element`. Defaults to `span`.

**Key Features:**

*   Inherits all `Element` props.
*   Applies typography styles easily (`fontSize`, `fontWeight`, `lineHeight`, `textAlign`, etc.).
*   Supports `toUpperCase` prop.

**Key Props (in addition to Element props):**

| Prop          | Type      | Description                         |
| :------------ | :-------- | :---------------------------------- |
| `as`          | `string`  | HTML element tag (default: 'span'). |
| `toUpperCase` | `boolean` | Converts text content to uppercase. |
| `...rest`     | `CssProps` | Typography props like `fontSize`, `fontWeight`, `color`, etc. |

**Example:**

```jsx
import { Text } from 'app-studio';

function MyText() {
  return (
    <Text
      fontSize="xl"
      fontWeight="bold"
      color="theme-primary"
      textAlign="center"
      toUpperCase
    >
      Important Heading
    </Text>
  );
}
```

## Image

An optimized image component extending `Element`. Renders an `<img>` tag.

**Key Features:**

*   Inherits `Element` props relevant to images.
*   Supports standard `src`, `alt` attributes.
*   Potentially supports features like lazy loading or fallbacks (verify implementation specifics if needed).

**Key Props (in addition to relevant Element props):**

| Prop      | Type     | Description                                     |
| :-------- | :------- | :---------------------------------------------- |
| `src`     | `string` | Image source URL.                               |
| `alt`     | `string` | Alternative text for accessibility.             |
| `...rest` | `CssProps` | Styling props like `width`, `height`, `borderRadius`, `objectFit`. |

**Variant:**

*   `ImageBackground`: Renders an `Element` (`div`) with the image applied as a `backgroundImage` (covers and no-repeat). Takes `src` prop.

**Example:**

```jsx
import { Image, ImageBackground, Text } from 'app-studio';

function MyImage() {
  return (
    <>
      <Image src="logo.png" alt="Company Logo" width={100} height={50} objectFit="contain" />

      <ImageBackground src="hero.jpg" height={200} width="100%" display="flex" alignItems="center" justifyContent="center">
        <Text color="color-white" fontSize="2xl">Overlay Text</Text>
      </ImageBackground>
    </>
  );
}
```

## Form

Simplifies form creation and handling. Extends `Element` and renders a `<form>` tag.

**Key Features:**

*   Inherits `Element` props.
*   Handles form submission via `onSubmit`.
*   Includes styled sub-components `Form.Input` and `Form.Button`.

**Sub-components:**

*   `Input`: Extends `Element`, renders an `<input>` tag. Accepts standard input attributes (`name`, `type`, `placeholder`, `value`, `onChange`, etc.) and styling props.
*   `Button`: Extends `Element`, renders a `<button>` tag. Accepts standard button attributes (`type`, `disabled`, etc.) and styling props. Handles `onClick`.

**Key Props (Form):**

| Prop       | Type       | Description                               |
| :--------- | :--------- | :---------------------------------------- |
| `onSubmit` | `function` | Callback function executed on submission. |
| `...rest`  | `CssProps` | Styling props for the form container.     |

**Example:**

```jsx
import { Form, Input, Button } from 'app-studio';

function MyForm() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    console.log('Form Data:', data);
  };

  return (
    <Form onSubmit={handleSubmit} display="flex" flexDirection="column" gap={12}>
      <Input name="username" placeholder="Username" padding={8} borderRadius={4} border="1px solid color-gray-300" />
      <Input name="password" type="password" placeholder="Password" padding={8} borderRadius={4} border="1px solid color-gray-300" />
      <Button type="submit" backgroundColor="color-blue-500" color="color-white" padding={10} borderRadius={4} cursor="pointer">
        Log In
      </Button>
    </Form>
  );
}
```

## Skeleton

Displays a placeholder loading state, often with a shimmer animation. Extends `View`.

**Key Props (in addition to View props):**

| Prop             | Type               | Default    | Description                                  |
| :--------------- | :----------------- | :--------- | :------------------------------------------- |
| `width`          | `string \| number` | `100%`     | Width of the skeleton placeholder.           |
| `height`         | `string \| number` | `20px`     | Height of the skeleton placeholder.          |
| `duration`       | `string`           | `'2s'`     | Duration of the shimmer animation.           |
| `timingFunction` | `string`           | `'linear'` | Timing function of the shimmer animation.    |
| `iterationCount` | `string \| number` | `infinite` | How many times the shimmer animation repeats. |

**Example:**

```jsx
import { Skeleton } from 'app-studio';

function UserProfileLoading() {
  return (
    <View display="flex" alignItems="center" gap={12}>
      <Skeleton width={50} height={50} borderRadius="50%" />
      <View flex={1} display="flex" flexDirection="column" gap={8}>
        <Skeleton height={20} width="60%" />
        <Skeleton height={16} width="80%" />
      </View>
    </View>
  );
}
```

---

# Animation System

App-Studio provides a powerful and declarative way to add animations using the `Animation` object and the `animate` prop on `Element`-based components.

**Basic Usage**

Import the `Animation` object and pass animation configurations to the `animate` prop.

```jsx
import { View, Animation } from 'app-studio';

function AnimatedComponent() {
  return (
    <View
      animate={Animation.fadeIn({ duration: '0.5s' })}
      padding={20}
      backgroundColor="color-blue-200"
    >
      Fades In
    </View>
  );
}
```

**Event-Based Animations**

Trigger animations on interaction states using the `on` prop.

```jsx
import { Button, Animation } from 'app-studio';

function HoverButton() {
  return (
    <Button
      padding={10}
      on={{
        hover: {
          animate: Animation.pulse({ duration: '1s', iterationCount: 'infinite' })
        }
      }}
    >
      Hover Over Me
    </Button>
  );
}
```

**Animation Sequences**

Pass an array of animation configurations to the `animate` prop to create sequences. Delays are automatically calculated based on previous animation durations and delays.

```jsx
import { View, Animation } from 'app-studio';

function SequencedAnimation() {
  const sequence = [
    Animation.fadeIn({ duration: '1s' }), // Fades in over 1s
    Animation.slideInRight({ duration: '0.5s', delay: '0.2s' }) // Slides in 0.2s after fade-in finishes
  ];

  return (
    <View
      animate={sequence}
      padding={20}
      backgroundColor="color-green-200"
    >
      Sequence
    </View>
  );
}
```

**Available Animations (`Animation.*`)**

A wide range of pre-defined animations are available (check `element/Animation.tsx` for the full list and options):

*   **Fades:** `fadeIn`, `fadeOut`, `fadeInDown`, `fadeInUp`, etc.
*   **Slides:** `slideInLeft`, `slideInRight`, `slideOutLeft`, `slideOutRight`, etc.
*   **Zooms:** `zoomIn`, `zoomOut`, `zoomInDown`, etc.
*   **Bounces:** `bounce`, `bounceIn`, `bounceOut`.
*   **Rotations:** `rotate`, `flip`, `flipInX`, `flipInY`.
*   **Attention Seekers:** `pulse`, `shake`, `swing`, `tada`, `jello`, `heartBeat`, `headShake`, `wobble`, `flash`.
*   **Special Effects:** `shimmer`, `lightSpeedIn`, `lightSpeedOut`, `hinge`, `jackInTheBox`, `rollIn`, `rollOut`.
*   **Scroll-Driven:** `fadeInScroll`, `slideInLeftScroll`, `scaleDownScroll`, etc. (These often require specific CSS setups like `animation-timeline`).

**Animation Properties**

Each animation function accepts an options object:

```typescript
interface AnimationProps {
  from?: CSSProperties | any; // Starting styles (for keyframes)
  to?: CSSProperties | any;   // Ending styles (for keyframes)
  '0%'?: CSSProperties | any; // Specific keyframe styles
  // ... other percentage keys like '50%'
  duration?: string;        // e.g., '1s', '500ms'
  timingFunction?: string;  // e.g., 'ease', 'linear', 'ease-in-out', 'steps(N)'
  delay?: string;           // e.g., '0.2s', '100ms'
  iterationCount?: string | number; // e.g., '1', 'infinite'
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
  playState?: 'running' | 'paused';
  timeline?: string;        // For scroll-driven animations (e.g., 'scroll()', 'view()', '--custom-timeline')
  range?: string;           // For scroll-driven animations (e.g., 'cover 0% cover 50%', 'entry', 'exit')
}
```

**Responsive Animations**

Combine `animate` with the `media` prop for different animations on different screen sizes.

```jsx
import { View, Animation } from 'app-studio';

function ResponsiveAnimation() {
  return (
    <View
      padding={20}
      backgroundColor="color-purple-200"
      media={{
        mobile: {
          animate: Animation.fadeIn({ duration: '1s' })
        },
        tablet: {
          animate: Animation.slideInLeft({ duration: '0.8s' })
        }
      }}
    >
      Responsive Animation
    </View>
  );
}
```

---

# Hooks

App-Studio provides hooks for common UI logic and state management needs.

*(Note: Descriptions below are based on the provided code structure. Verify specific usage details.)*

| Hook              | Returns         | Description                                                            |
| :---------------- | :-------------- | :--------------------------------------------------------------------- |
| `useActive`       | `[ref, boolean]` | Detects if the referenced element is active (pressed/touched).         |
| `useClickOutside` | `[ref, boolean]` | Detects if a click occurred outside the referenced element.            |
| `useFocus`        | `[ref, boolean]` | Tracks the focus state of the referenced element.                      |
| `useHover`        | `[ref, boolean]` | Detects if the mouse cursor is hovering over the referenced element.   |
| `useInView`       | `{ ref, inView }`| Detects if the referenced element is within the viewport using `IntersectionObserver`. Options allow `triggerOnce`. |
| `useKeyPress`     | `boolean`       | Takes a `targetKey` string and returns `true` if that key is currently pressed. |
| `useMount`        | `void`          | Takes a callback function and runs it once when the component mounts.  |
| `useOnScreen`     | `[ref, boolean]` | Similar to `useInView`, detects if the referenced element is on screen using `IntersectionObserver`. |
| `useResponsive`   | `ScreenConfig & { on: func, is: func }` | Provides screen size (`screen`), device (`currentDevice`), orientation, and helper functions (`on`, `is`) to check against breakpoints/devices. |
| `useScroll`       | `ScrollPosition` | Tracks scroll position (`x`, `y`) and progress (`xProgress`, `yProgress`) of the window or a specified container. Options include `throttleMs`, `container`, `offset`. |
| `useWindowSize`   | `{ width, height }` | Tracks the current width and height of the browser window.           |

**Examples:**

```jsx
// useHover Example
import { useHover } from 'app-studio';
import { View } from './components/View'; // Assuming View component path

function HoverComponent() {
  const [hoverRef, isHovered] = useHover();
  return (
    <View ref={hoverRef} padding={20} backgroundColor={isHovered ? 'color-gray-200' : 'color-white'}>
      Hover over me!
    </View>
  );
}

// useResponsive Example
import { useResponsive } from 'app-studio';
import { View, Text } from './components/Components'; // Assuming component paths

function ResponsiveComponent() {
  const { screen, orientation, on } = useResponsive();
  return (
    <View>
      <Text>Current Screen: {screen}, Orientation: {orientation}</Text>
      {on('mobile') && <Text color="color-red-500">This only shows on mobile!</Text>}
      {on('desktop') && <Text color="color-blue-500">This only shows on desktop!</Text>}
      {/* Check specific breakpoint */}
      {on('md') && <Text>Medium screen size detected.</Text>}
    </View>
  );
}

// useInView Example
import { useInView } from 'app-studio';
import { View, Animation } from './components/Components'; // Assuming component paths

function LazyLoadComponent() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <View ref={ref} height={200} backgroundColor="color-gray-100">
      {inView ? (
        <View animate={Animation.fadeIn()}>Content loaded!</View>
      ) : (
        'Waiting to scroll into view...'
      )}
    </View>
  );
}
```

---

# Providers

Providers wrap parts of your application to offer context and global state.

## ThemeProvider

Manages the application's theme, including color palettes, light/dark modes, and theme tokens.

**Props:**

| Prop    | Type               | Default                             | Description                                                                       |
| :------ | :----------------- | :---------------------------------- | :-------------------------------------------------------------------------------- |
| `theme` | `object`           | `{ primary: 'color-black', ... }`   | Custom theme tokens (e.g., `primary`, `secondary`) that map to color strings.     |
| `mode`  | `'light' \| 'dark'`| `'light'`                           | Sets the initial theme mode.                                                      |
| `dark`  | `Colors`           | Default dark palette & main colors  | Configuration object for dark mode containing `main` (singleton colors) and `palette`. |
| `light` | `Colors`           | Default light palette & main colors | Configuration object for light mode containing `main` (singleton colors) and `palette`.|

**Context Values (via `useTheme`)**

*   `getColor(colorName, mode?)`: Resolves a color string (e.g., `color-blue-500`, `theme-primary`) to its CSS value for the specified or current theme mode. You can also directly access specific theme mode colors using the `light-` or `dark-` prefix (e.g., `light-white` or `dark-red-200`), which will always use that specific theme mode's color regardless of the current theme setting.
*   `theme`: The merged theme configuration object.
*   `themeMode`: The current mode ('light' or 'dark').
*   `setThemeMode(mode)`: Function to change the theme mode.

## ResponsiveProvider

Provides context about the current screen size, orientation, and device type based on configured breakpoints.

**Props:**

| Prop          | Type               | Default                       | Description                                                                          |
| :------------ | :----------------- | :---------------------------- | :----------------------------------------------------------------------------------- |
| `breakpoints` | `ResponsiveConfig` | `{ xs: 0, sm: 340, ... }`     | An object mapping breakpoint names (e.g., `xs`, `sm`) to minimum width pixel values. |
| `devices`     | `DeviceConfig`     | `{ mobile: ['xs', 'sm'], ...}` | An object mapping device names (e.g., `mobile`) to arrays of breakpoint names.       |

**Context Values (via `useResponsive`)**

*   `breakpoints`: The configured breakpoints object.
*   `devices`: The configured devices object.
*   `mediaQueries`: Generated media query strings for each breakpoint.
*   `currentWidth`: Current window width.
*   `currentHeight`: Current window height.
*   `currentBreakpoint`: The name of the currently active breakpoint (e.g., 'sm', 'lg').
*   `currentDevice`: The name of the currently inferred device type (e.g., 'mobile', 'desktop').
*   `orientation`: Current screen orientation ('landscape' or 'portrait').
*   `on(name)` / `is(name)`: Function to check if the current screen matches a breakpoint or device name.

## AnalyticsProvider

Enables event tracking throughout the application. Components like `Element` automatically track `click` events if `onClick` is provided and this provider is used.

**Props:**

| Prop         | Type       | Description                                                       |
| :----------- | :--------- | :---------------------------------------------------------------- |
| `trackEvent` | `function` | A callback function `(event: { type, target?, text?, ... }) => void` that receives event data to be sent to your analytics service. |

**Example Usage (Provider Setup):**

See the [Installation](#installation) section.

## WindowSizeProvider

Provides the current dimensions of the browser window via the `useWindowSize` hook.

**Props:** None.

**Context Values (via `useWindowSize`)**

*   `width`: Current window width in pixels.
*   `height`: Current window height in pixels.

---

# Utilities

App-Studio exports utility objects and functions.

## Colors (`utils/colors.ts`)

Defines the default color palettes (`defaultLightPalette`, `defaultDarkPalette`) and singleton colors (`defaultLightColors`, `defaultDarkColors`) used by `ThemeProvider`. You can import these if needed for custom theme configurations. Colors are accessed within components primarily via the `getColor` function from `useTheme`.

**Accessing Colors:**

```jsx
import { useTheme } from 'app-studio';
import { View, Text } from './components/Components';

function ThemedComponent() {
  const { getColor } = useTheme();

  return (
    <View
      backgroundColor={getColor('theme-primary')} // Get theme color
      color={getColor('color-white')}            // Get singleton color
      borderRadius={8}
      padding={10}
    >
      <Text>My Themed Content</Text>

      {/* Direct access to specific theme mode colors */}
      <View
        marginTop={10}
        padding={8}
        backgroundColor={getColor('light-blue-200')} // Always light mode blue
        borderColor={getColor('dark-red-500')}       // Always dark mode red
        borderWidth={2}
        borderStyle="solid"
        borderRadius={4}
      >
        <Text>Mixed theme mode colors</Text>
      </View>

      {/* Direct usage in component props without getColor */}
      <View marginTop={10} padding={8}>
        <Text color="light-white">Always light mode white text</Text>
        <Text color="dark-blue-700" marginTop={4}>Always dark mode blue text</Text>
      </View>
    </View>
  );
}
```

## Typography (`utils/typography.ts`)

Exports the `Typography` object containing pre-defined scales for `letterSpacings`, `lineHeights`, `fontWeights`, and `fontSizes`. These are typically used internally or can be referenced when customizing themes.

## Shadows (`utils/shadow.ts`)

Exports the `Shadows` object, which maps numbers (0-9) to `box-shadow` configurations used by the `shadow` prop on `Element`.

## Constants (`utils/constants.ts`)

May export various constants used within the library (e.g., internal configuration keys). Check the file for specifics if needed.

---

# Examples

## Responsive Layout

```jsx
import { View, Text, useResponsive } from 'app-studio';

function ResponsiveCard() {
  const { on } = useResponsive();

  return (
    <View
      flexDirection={on('mobile') ? 'column' : 'row'} // Stack on mobile, row otherwise
      padding={16}
      backgroundColor="color-white"
      borderRadius={8}
      shadow={2} // Apply shadow level 2
      gap={on('mobile') ? 12 : 20}
    >
      <View flex={1}> {/* Use flex for layout control */}
        <Text fontWeight="bold" fontSize="lg">Card Title</Text>
        <Text color="color-gray-600">Some descriptive content here.</Text>
      </View>
      <View width={on('mobile') ? '100%' : 100} height={100} backgroundColor="color-blue-100" borderRadius={4}>
        {/* Image or placeholder */}
      </View>
    </View>
  );
}
```

## Animated Button

```jsx
import { Button, Animation } from 'app-studio';

function AnimatedButton() {
  return (
    <Button
      paddingHorizontal={20}
      paddingVertical={10}
      backgroundColor="color-green-500"
      color="color-white"
      borderRadius={5}
      fontWeight="bold"
      animate={Animation.fadeIn({ duration: '0.5s' })}
      on={{
        hover: {
          backgroundColor: 'color-green-600',
          animate: Animation.pulse({ duration: '0.8s', iterationCount: 2 })
        },
        active: {
          transform: 'scale(0.95)' // Simple transform on active
        }
      }}
    >
      Click Me
    </Button>
  );
}
```

---

# API Reference Summary

*   **Core:** `Element`
*   **Components:** `View`, `Horizontal`, `Vertical`, `Center`, `HorizontalResponsive`, `VerticalResponsive`, `Scroll`, `SafeArea`, `Div`, `Span`, `Text`, `Image`, `ImageBackground`, `Form`, `Input`, `Button`, `Skeleton`.
*   **Animation:** `Animation` object with functions like `fadeIn`, `slideInLeft`, `pulse`, etc.
*   **Hooks:** `useActive`, `useClickOutside`, `useElementPosition`, `useFocus`, `useHover`, `useInView`, `useKeyPress`, `useMount`, `useOnScreen`, `useResponsive`, `useScroll`, `useWindowSize`.
*   **Providers:** `ThemeProvider`, `ResponsiveProvider`, `AnalyticsProvider`, `WindowSizeProvider`.
*   **Context Hooks:** `useTheme`, `useResponsiveContext`, `useAnalytics`, `useWindowSize`.
*   **Utilities:** `colors`, `Typography`, `Shadows`.

---

# Contributing

Contributions are welcome! Please follow standard procedures:

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Add tests for your changes.
5.  Commit your changes (`git commit -m 'Add some feature'`).
6.  Push to the branch (`git push origin feature/your-feature-name`).
7.  Open a Pull Request.

---

# Changelog

*(Maintain a log of versions and changes here)*

*   **vX.Y.Z** (Date):
    *   Description of changes.
*   **v1.0.0** (Initial Release):
    *   Core `Element` component.
    *   Basic components: `View`, `Text`, `Image`, `Form`, `Skeleton`.
    *   Hooks for interactions, viewport, and responsiveness.
    *   Providers for Theme, Responsiveness, Analytics, WindowSize.
    *   Animation system via `Animation` object.
