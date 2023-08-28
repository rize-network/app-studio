# Hooks

The 'app-studio' library offers a set of custom React hooks that provide useful functionalities for building responsive, interactive, and maintainable components. This documentation will cover some of the most essential hooks available in the library.

## Table of Contents

1. [useMount](#usemount)
2. [useResponsive](#useresponsive)

---

## 1. useMount

The `useMount` hook is designed for executing logic when a component first mounts. It takes a callback function as an argument, which is called when the component mounts.

### Syntax

```jsx
useMount(callback: Function)
```

### Parameters

- `callback`: A function that will be called when the component mounts.

### Usage Example

Here's a simple example demonstrating how to use `useMount`:

```jsx
import { useMount } from '@your-org/app-studio';

const MyComponent = () => {
  useMount(() => {
    console.log('MyComponent mounted');
  });

  return <div>MyComponent</div>;
};
```

In this example, "MyComponent mounted" will be logged to the console when `MyComponent` first mounts.

---

## 2. useResponsive

The `useResponsive` hook is used for making components responsive to different screen sizes and devices. It leverages the library's responsive context to obtain relevant values like breakpoints and media queries and provides utility functions for checking the current screen size and device.

### Syntax

```jsx
const { screen, on, is } = useResponsive()
```

### Returned Values

- `screen`: Provides the current screen size according to defined breakpoints.
- `on`: A function that returns a boolean indicating whether the current device matches the given criteria.
- `is`: A function that returns a boolean indicating whether the current screen size matches the given breakpoint.

### Usage Example

Here's a basic example demonstrating how to use `useResponsive`:

```jsx
import { useResponsive } from '@your-org/app-studio';

const MyComponent = () => {
  const { screen, on, is } = useResponsive();

  console.log('Current screen size:', screen);

  if (on('mobile')) {
    console.log('On a mobile device');
  }

  if (is('xs')) {
    console.log('Extra small screen size');
  }

  return <div>MyComponent</div>;
};
```

In this example, the current screen size, device type, and extra small screen size are logged to the console based on the conditions.

---

These hooks offer a simple yet effective way to manage component lifecycle and responsiveness, making it easier for developers to build robust applications.