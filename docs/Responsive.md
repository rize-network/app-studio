# Responsive Design with App-Studio

Creating a responsive design is an essential part of modern web development. In App-Studio, two primary features help you achieve this: `useResponsive` hook and the `media` prop. This document provides an overview and examples for both approaches.

> **React Native:** both the `media` prop and `useResponsive` work on native. Width tracking is backed by RN's `useWindowDimensions`, so values update on rotation and split-screen. The default breakpoints (`xs: 0`, `sm: 340`, `md: 560`, `lg: 1080`, `xl: 1300`) and devices (`mobile`, `tablet`, `desktop`) are shared with web — override them by passing `breakpoints` / `devices` to `ResponsiveProvider`. See [Native.md → Responsive & Media Queries](Native.md#responsive--media-queries).

---

## 1. Media Prop for Responsive Design

The `media` prop is particularly useful for managing responsive design without causing your components to re-render. You can specify different styles for various devices or screen sizes.

### Example

Here's a quick example to demonstrate its usage:

```jsx
import React from 'react';
import { ResponsiveProvider, View } from 'app-studio';

const Example = () => {
  return (
    <View widthHeight={100} 
     media={{
        mobile: {
          backgroundColor: 'color-green',
        },
        tablet: {
          backgroundColor: 'color-yellow',
        },
        xl: {
          backgroundColor: 'color-blue',
        },
      }}  
      />
  );
};

const App = () => (
  <ResponsiveProvider 
    breakpoints={{
        xs: 0,
        sm: 340,
        md: 560,
        lg: 1080,
        xl: 1300,
    }}
    devices={{  
        mobile: ['xs', 'sm'],
        tablet: ['md', 'lg'],
        desktop: ['lg', 'xl']
    }}
  >
    <Example />
  </ResponsiveProvider>
);
```

The `media` prop receives an object, where each key corresponds to a device type or screen size, and its value is another object describing the CSS to apply for that specific device.

---

## 2. Using `useResponsive` Hook

The `useResponsive` hook provides you with screen size and device type information based on your defined breakpoints and devices.

### Example

Here's how you can use `useResponsive`:

```jsx
import React from 'react';
import { ResponsiveProvider, View, useResponsive } from 'app-studio';

const Example = () => {
  const { screen, on } = useResponsive();
  
  const responsive = {
    xs: {
      backgroundColor: 'red',
    },
    sm: {
      backgroundColor: 'green',
    },
    md: {
      backgroundColor: 'blue',
    },
    lg: {
      backgroundColor: 'yellow',
    },
    xl: {
      backgroundColor: 'red',
    },
  };

  return (
    <View widthHeight={100} 
      {...responsive[screen]}       
    >
      {screen} -  mobile : {on('mobile') ? 'yes' : 'no'}
    </View>
  );
};

const App = () => (
  <ResponsiveProvider 
    breakpoints={{
        xs: 0,
        sm: 340,
        md: 560,
        lg: 1080,
        xl: 1300,
    }}
    devices={{  
        mobile: ['xs', 'sm'],
        tablet: ['md', 'lg'],
        desktop: ['lg', 'xl']
    }}
  >
    <Example />
  </ResponsiveProvider>
);
```

In this example, `useResponsive` provides `screen` and `on`:
- `screen`: Gives you the current screen size based on your breakpoints.
- `on`: A function that returns `true` or `false` depending on whether the current screen size is included in the given device type.

It's important to note that `useResponsive` causes re-renders when the screen size changes, as it relies on React state updates. In contrast, the `media` prop avoids re-renders because it applies styles directly through CSS media queries. Choose the method that best suits your performance needs and design requirements.


These can then be used to dynamically apply styles to your components, as demonstrated with the `responsive` object.


---

## 3. Container-Scoped & Forced Responsiveness with `<Responsive>`

By default, both the `media` prop and `useResponsive` respond to the **browser window**. That breaks down when a component is rendered inside a smaller container — a split view, side panel, half-width chat, embedded preview, or constrained modal. The window is still desktop-sized, so the component keeps rendering as desktop even though it only has a fraction of the space.

The `<Responsive>` boundary fixes this. Wrap a constrained region with it to scope responsiveness to **the container** (measured) or to a **forced** value — overriding the window for everything inside, including hooks **and** the `media` prop.

> `<Responsive>` is a scoped boundary. The app-root `ResponsiveProvider` stays exactly as before — keep it at the top of your app, and reach for `<Responsive>` only around regions that need their own responsive context.

### Container mode — adapt to the box, not the window

```jsx
import { Responsive, View } from 'app-studio';

// This chat takes half the window, but renders as mobile because the
// CONTAINER is narrow — not the window.
<Responsive container style={{ width: '50%' }}>
  <View
    media={{
      mobile: { flexDirection: 'column' },
      desktop: { flexDirection: 'row' },
    }}
  >
    <Chat />
  </View>
</Responsive>
```

In `container` mode, `<Responsive>` renders a wrapper element that:

- measures its own width with a `ResizeObserver`, and
- establishes a CSS containment context (`container-type: inline-size`).

As a result:

- `useResponsive()` / `useBreakpoint()` inside report the **container's** breakpoint and re-render when it crosses a threshold.
- The `media` prop compiles to **CSS container queries** (`@container`) instead of `@media`, so container-driven styles apply with **no re-render** — exactly like the window-based `media` prop, but scoped to the box.

You can pass `as`, `style`, and `className` to shape the wrapper element, and per-scope `breakpoints` / `devices` to override the thresholds for just this region.

### Forced mode — pin a breakpoint or device

When you want a region to render at a fixed size regardless of window or container, force it:

```jsx
<Responsive forceBreakpoint="sm">
  <Panel /> {/* everything inside behaves as the `sm` breakpoint */}
</Responsive>

<Responsive responsiveMode="mobile">
  <Sidebar /> {/* everything inside behaves as the `mobile` device */}
</Responsive>
```

- `forceBreakpoint` pins `currentBreakpoint` (and derives the device from your `devices` map).
- `responsiveMode` pins `currentDevice` and selects a representative breakpoint for it.
- `responsiveMode` only accepts real device names (`mobile` / `tablet` / `desktop`); unknown values like `"compact"` are a TypeScript error.

Forced mode does no measurement and renders no wrapper element. If you set both a force prop and `container`, **the force prop wins**.

### Notes

- **Browser support:** container queries are supported in all modern evergreen browsers (Chrome/Edge 105+, Safari 16+, Firefox 110+). In a browser without `@container`, container-mode `media` styles degrade gracefully (they simply don't apply) — the JS hooks (`useResponsive`) still work everywhere.
- **React Native:** `<Responsive>` works on native too. `container` mode measures via `onLayout`, and the force props behave identically. See [Native.md → Responsive & Media Queries](Native.md#responsive--media-queries).

---

By combining the `media` prop, `useResponsive`, and the `<Responsive>` boundary, you can create robust, efficient, and responsive designs that adapt to the window **or** to any container — with App-Studio.
