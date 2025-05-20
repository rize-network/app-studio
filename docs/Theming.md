# Theming with App-Studio

Theming is an essential part of any application. It allows you to maintain a consistent look and feel across your app. With App-Studio, theming becomes effortless through its `ThemeProvider` component. This document shows you how to set up theming in App-Studio.

## Setting up the Theme Object

First, define a theme object that contains the properties you'd like to customize, such as colors and palettes. This object can be as simple or as complex as your needs require.

Here's an example:

```javascript
const theme = {
    main:{
       primary: '#fff7ed'
    },
    components: {
      button:{
        background: '#fff7ed'
      }
    }
};

const colors = {
    main:{
       blue: '#94a3b8'
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
        900: '#0f172a'
      }
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
    <ThemeProvider theme={theme} colors={colors}>
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
import { Button } from '@app-studio/web';

function Example() {
  return (
    <View backgroundColor="color.blue">
       <View backgroundColor="color.blueGray.500">
        <Text color="theme.primary">Hello</Text>
       </View>
       <Button backgroundColor="theme.button.background">Hello</Button>
    </View>
  );
}
```

Notice how the `backgroundColor` and `color` props use values defined in the theme object.

### Accessing Specific Theme Mode Colors

You can directly access colors from a specific theme mode regardless of the current theme mode using the `light.` or `dark.` prefix:

```javascript
import { View, Text } from 'app-studio';

function Example() {
  return (
    <View>
      {/* Always use light mode white color regardless of current theme mode */}
      <Text color="light.white">Always light mode white</Text>

      {/* Always use dark mode red.200 color regardless of current theme mode */}
      <View backgroundColor="dark.red.200">
        <Text>Always dark mode red.200 background</Text>
      </View>
    </View>
  );
}
```

This is useful when you need to access a specific theme mode's color regardless of the current theme setting.

### Direct Theme Color Access

App-Studio allows you to directly call theme colors using a simple dot notation format. This makes your code more readable and maintainable:

```javascript
import { View, Text } from 'app-studio';

function Example() {
  return (
    <View>
      {/* Access light theme colors directly */}
      <Text color="light.white">White text in light mode</Text>
      <View backgroundColor="light.blue.500">
        <Text>Light blue background</Text>
      </View>

      {/* Access dark theme colors directly */}
      <Text color="dark.white">White text in dark mode</Text>
      <View backgroundColor="dark.red.200">
        <Text>Dark red background</Text>
      </View>

      {/* Mix and match in the same component */}
      <View
        backgroundColor="light.gray.100"
        borderColor="dark.gray.800"
        borderWidth={1}
      >
        <Text>Mixed theme colors</Text>
      </View>
    </View>
  );
}
```

This direct access syntax works with all color-related properties and can be used with both singleton colors (like `white`, `black`) and palette colors (like `red.200`, `blue.500`). It provides a convenient way to reference specific theme colors without having to use the `getColor` function from the `useTheme` hook.

## Complete Example

Here's a complete example that ties it all together:

```javascript
import React from 'react';
import { ThemeProvider, View, Text, Button } from 'app-studio';

const theme = {
    main:{
       primary: '#fff7ed'
    },
    components: {
      button:{
        background: '#fff7ed'
      }
    }
};

const colors = {
    main:{
       blue: '#94a3b8'
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
        900: '#0f172a'
      }
    }
};

function Example() {
  return (
    <ThemeProvider theme={theme} colors={colors}>
      <View backgroundColor="color.blue">
         <View backgroundColor="color.blueGray.500">
            <Text color="theme.primary">Hello</Text>
         </View>
         <Button backgroundColor="theme.button.background">Hello</Button>
      </View>
    </ThemeProvider>
  );
}
```

By using the `ThemeProvider` and the theme object, you can now maintain a consistent and easily customizable UI across your application.
