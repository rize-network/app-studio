
# Hooks

The 'app-studio' library provides several custom hooks that you can use to add additional functionality to your components.

## useMount

The `useMount` hook takes a callback function as a parameter and calls it when the component first mounts. This is done using the `useEffect` hook with an empty dependency array, ensuring that the callback is only called once after the initial render.

Here's a basic usage example:

```tsx
import { useMount } from '@your-org/app-studio';

const MyComponent = () => {
  useMount(() => {
    console.log('MyComponent mounted');
  });

  return <div>MyComponent</div>;
};
```

In this example, 'MyComponent mounted' will be logged to the console when `MyComponent` first mounts.

## useResponsive

The `useResponsive` hook provides a set of responsive design features. It uses the responsive context to get the breakpoints, devices, and media queries values, and provides functions to check the current screen size and device.

Here's a basic usage example:

```tsx
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

In this example, the current screen size is logged to the console, and additional messages are logged if the current device is a mobile device or if the current screen size is extra small ('xs').
