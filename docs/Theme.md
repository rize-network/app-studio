# Theming with App-Studio

Theming is an essential part of any application. It allows you to maintain a consistent look and feel across your app. With App-Studio, theming becomes effortless through its `ThemeProvider` component. This document shows you how to set up theming in App-Studio.

## Setting up the Theme Object

First, define a theme object that contains the properties you'd like to customize, such as colors and palettes. This object can be as simple or as complex as your needs require.

Here's an example:

```javascript
const theme = {
  colors: {
     orange: '#fff7ed', 
     cyan: '#ecfeff',
  },
  palette: {
    blueGray: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
  }
};
```

## Using `ThemeProvider`

Wrap your application's root component with `ThemeProvider` and pass the theme object as a prop. This will make the theme available to all child components.

```javascript
import { ThemeProvider, View } from 'app-studio';

// ...

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* The rest of your app */}
    </ThemeProvider>
  );
}
```

## Using the Theme in Components

Now that the theme is available, you can use it in your components. For example, any component that accepts `color` or `backgroundColor` props will use the values from the theme.

Here's an example of how you might set the background color for a `View` and text color for a `Text` component:

```javascript
import { View, Text } from 'app-studio';

function Example() {
  return (
    <View backgroundColor="cyan">
      <Text color="blueGray.200">Hello</Text>
    </View>
  );
}
```

Notice how the `backgroundColor` and `color` props use values defined in the theme object.

## Complete Example

Here's a complete example that ties it all together:

```javascript
import React from 'react';
import { ThemeProvider, View, Text } from 'app-studio';

const theme = {
  colors: {
    orange: '#fff7ed',
    cyan: '#ecfeff',
  },
  palette: {
    blueGray: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
  }
};

function Example() {
  return (
    <ThemeProvider theme={theme}>
      <View backgroundColor="cyan">
        <Text color="blueGray.200">Hello</Text>
      </View>
    </ThemeProvider>
  );
}
```

By using the `ThemeProvider` and the theme object, you can now maintain a consistent and easily customizable UI across your application.