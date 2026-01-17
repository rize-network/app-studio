import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { View, Text, Vertical } from '../src';
import { ThemeProvider } from '../src/providers/Theme';

export default {
  title: 'Theme/StrictMode',
  component: ThemeProvider,
  parameters: {
    docs: {
      description: {
        component:
          'Demonstrates Strict Mode for ThemeProvider, which warns when non-token colors are used.',
      },
    },
  },
} as ComponentMeta<typeof ThemeProvider>;

export const StrictModeWarning: ComponentStory<typeof ThemeProvider> = () => {
  return (
    <ThemeProvider strict={true}>
      <Vertical gap={20} padding={20}>
        <Text fontSize={24} fontWeight="bold">
          Strict Mode Verification
        </Text>
        <Text>Check the browser console for warnings.</Text>

        {/* Valid usage */}
        <View
          padding={20}
          backgroundColor="color-green-100"
          border="1px solid color-green-500"
          borderRadius={8}
        >
          <Text color="color-green-700">
            This uses valid tokens (color-green-100). No warning.
          </Text>
        </View>

        {/* Invalid usage (should warn) */}
        <View
          padding={20}
          backgroundColor="#ffebee" // Raw hex
          border="1px solid red" // Raw color
          borderRadius={8}
        >
          <Text color="red">
            This uses raw colors (#ffebee, red). Should warn in console.
          </Text>
        </View>
      </Vertical>
    </ThemeProvider>
  );
};
