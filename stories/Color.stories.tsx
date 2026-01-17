// src/stories/Theming.stories.tsx (or adjust path as needed)

import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

// Import necessary components and types from your framework
import {
  View,
  Text,
  Vertical,
  Horizontal,
  Colors, // Import the Colors type
  Theme,
  ThemeProvider,
} from '../src'; // Adjust the import path based on your structure

export default {
  title: 'Theming/Custom Colors', // Organize under Theming or similar
  component: View,
  parameters: {
    docs: {
      description: {
        component:
          'Demonstrates how to override theme colors using a nested `ThemeProvider`. Wrap components in a `ThemeProvider` with custom `theme` and `light`/`dark` props to override colors locally. Colors like `color-blue-500` and `theme-primary` will resolve using the nested provider\'s configuration.',
      },
    },
  },
} as ComponentMeta<typeof View>;

// --- Define a Custom Color Palette for the Story ---
// Let's create a palette where 'blue' is actually shades of purple,
// and the 'primary' theme color points to a specific green shade.

const customTheme: Partial<Theme> = {
  primary: 'color-green-600', // Override 'theme-primary' to use our green.600
  secondary: 'color-orange-500', // Override 'theme-secondary'
};
const customComponentColors: Partial<Colors> = {
  // Define color palette overrides
  palette: {
    // Override the entire 'blue' palette with shades of purple
    blue: {
      50: '#faf5ff', // purple-50
      100: '#f3e8ff', // purple-100
      200: '#e9d5ff', // purple-200
      300: '#d8b4fe', // purple-300
      400: '#c084fc', // purple-400
      500: '#a855f7', // purple-500 <- This will be used for 'color-blue-500'
      600: '#9333ea', // purple-600
      700: '#7e22ce', // purple-700
      800: '#6b21a8', // purple-800
      900: '#581c87', // purple-900
    },
    // Keep other palettes like 'red', 'green' etc., from the defaultLightPalette
    // Or override them too if needed
    green: {
      // Let's slightly tweak green too
      600: '#10B981', // Make green 600 more vibrant (emerald-500)
    },
  },
};

// --- Story Template ---
const Template: ComponentStory<typeof View> = () => (
  <Vertical
    gap={20}
    padding={20}
    backgroundColor="color-gray-100"
    borderRadius={8}
  >
    <Text fontSize={20} fontWeight="bold">
      Demonstrating ThemeProvider Color Override
    </Text>

    <Horizontal gap={20} alignItems="center">
      {/* Component using GLOBAL theme colors */}
      <Vertical gap={5} flex={1}>
        <Text fontWeight="medium">Using Global Theme:</Text>
        <View
          height={100}
          backgroundColor="color-blue-500" // Should be the default blue
          borderRadius={8}
          display="flex"
          alignItems="center"
          justifyContent="center"
          shadow={2}
        >
          <Text color="white" fontWeight="bold">
            BG: color-blue-500
          </Text>
        </View>
        <View
          height={50}
          backgroundColor="theme-primary" // Should be default theme's primary
          borderRadius={8}
          display="flex"
          alignItems="center"
          justifyContent="center"
          shadow={2}
        >
          <Text color="white" fontWeight="bold">
            BG: theme-primary
          </Text>
        </View>
        <View
          height={50}
          backgroundColor="theme-secondary" // Should be default theme's secondary
          borderRadius={8}
          display="flex"
          alignItems="center"
          justifyContent="center"
          shadow={2}
        >
          <Text color="white" fontWeight="bold">
            BG: theme-secondary
          </Text>
        </View>
      </Vertical>

      {/* Component using ThemeProvider override */}
      <ThemeProvider theme={customTheme} light={customComponentColors}>
        <Vertical gap={5} flex={1}>
          <Text fontWeight="medium">Using ThemeProvider Override:</Text>
          <View
            height={100}
            backgroundColor="color-blue-500" // Should use the OVERRIDDEN purple-500
            borderRadius={8}
            display="flex"
            alignItems="center"
            justifyContent="center"
            shadow={2}
          >
            <Text color="white" fontWeight="bold">
              BG: color-blue-500 (Overridden)
            </Text>
          </View>
          <View
            height={50}
            backgroundColor="theme-primary" // Should use the OVERRIDDEN green-600
            borderRadius={8}
            display="flex"
            alignItems="center"
            justifyContent="center"
            shadow={2}
          >
            <Text color="color-white" fontWeight="bold">
              BG: theme-primary (Overridden)
            </Text>
          </View>
          <View
            height={50}
            backgroundColor="theme-secondary" // Uses overridden orange-500
            borderRadius={8}
            display="flex"
            alignItems="center"
            justifyContent="center"
            shadow={2}
          >
            <Text color="color-white" fontWeight="bold">
              BG: theme-secondary (Overridden)
            </Text>
          </View>
        </Vertical>
      </ThemeProvider>
    </Horizontal>
  </Vertical>
);

// --- Export the Story ---
export const ColorOverrideExample = Template.bind({});
ColorOverrideExample.args = {
  // You can add args here if needed, but this story primarily shows the prop's effect
};
