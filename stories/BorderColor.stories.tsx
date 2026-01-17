import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { View, Text, Vertical, Horizontal } from '../src';
import { ThemeProvider } from '../src/providers/Theme';

export default {
  title: 'Theming/Border Colors',
  component: View,
  parameters: {
    docs: {
      description: {
        component:
          'Demonstrates how border properties can use theme colors and color tokens.',
      },
    },
  },
} as ComponentMeta<typeof View>;

const Template: ComponentStory<typeof View> = () => (
  <ThemeProvider>
    <Vertical
      gap={20}
      padding={20}
      backgroundColor="color-gray-100"
      borderRadius={8}
    >
      <Text fontSize="lg" fontWeight="bold">
        Border Color Examples
      </Text>

      <Horizontal gap={20} alignItems="center">
        <Vertical gap={10} flex={1}>
          <Text fontWeight="medium">Using Theme Colors in Borders:</Text>

          <View
            height={100}
            backgroundColor="white"
            border="2px solid color-blue-500"
            borderRadius={8}
            padding={10}
          >
            <Text>Border using color-blue.500</Text>
          </View>

          <View
            height={100}
            backgroundColor="white"
            border="2px solid theme.primary"
            borderRadius={8}
            padding={10}
          >
            <Text>Border using theme.primary</Text>
          </View>

          <View
            height={100}
            backgroundColor="white"
            borderTop="3px solid color-green-500"
            borderRight="3px solid color-red-500"
            borderBottom="3px solid color-blue-500"
            borderLeft="3px solid color-purple-500"
            borderRadius={8}
            padding={10}
          >
            <Text>Different border colors on each side</Text>
          </View>
        </Vertical>
      </Horizontal>
    </Vertical>
  </ThemeProvider>
);

export const BorderColorExamples = Template.bind({});
