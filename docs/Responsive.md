# Responsive Design with App-Studio

Creating a responsive design is an essential part of modern web development. In App-Studio, two primary features help you achieve this: `useResponsive` hook and the `media` prop. This document provides an overview and examples for both approaches.

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
    <View wxh={100} 
     media={{
        mobile: {
          backgroundColor: 'color.green',
        },
        tablet: {
          backgroundColor: 'color.yellow',
        },
        xl: {
          backgroundColor: 'color.blue',
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
    <View wxh={100} 
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

By combining the `media` prop and `useResponsive`, you can create robust, efficient, and responsive designs with App-Studio.
