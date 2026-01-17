import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { View, Text, Vertical } from '../src';

export default {
  title: 'CSS/VendorPrefix',
  component: View,
  parameters: {
    docs: {
      description: {
        component:
          'Demonstrates how vendor-prefixed CSS properties work in app-studio.',
      },
    },
  },
} as ComponentMeta<typeof View>;

export const WebkitBackgroundClip: ComponentStory<typeof View> = () => {
  return (
    <Vertical gap={20} padding={20}>
      <Text fontSize={24} fontWeight="bold">Vendor Prefix Test</Text>
      
      {/* Using backgroundClip which auto-generates vendor prefixes */}
      <View
        padding={20}
        backgroundColor="#f0f0f0"
        borderRadius={8}
      >
        <Text fontWeight="bold">Direct Prop Usage (backgroundClip):</Text>
        <View
          padding={20}
          background="linear-gradient(45deg, #ff0000, #00ff00, #0000ff)"
          backgroundClip="text"
          color="transparent"
          fontSize={24}
          fontWeight="bold"
        >
          This text should have a gradient background
        </View>
      </View>
      
      {/* Using the css prop with backgroundClip */}
      <View
        padding={20}
        backgroundColor="#f0f0f0"
        borderRadius={8}
      >
        <Text fontWeight="bold">CSS Prop Usage:</Text>
        <View
          padding={20}
          css={{
            background: "linear-gradient(45deg, #ff0000, #00ff00, #0000ff)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            fontSize: "24px",
            fontWeight: "bold"
          }}
        >
          This text should have a gradient background
        </View>
      </View>
      
      {/* User Select Test */}
      <View
        padding={20}
        backgroundColor="#f0f0f0"
        borderRadius={8}
      >
        <Text fontWeight="bold">User Select (All browsers):</Text>
        <View
          padding={20}
          backgroundColor="color-blue-100"
          borderRadius={8}
          userSelect="none"
          fontSize={18}
        >
          This text should NOT be selectable (userSelect="none")
        </View>
        <View
          padding={20}
          marginTop={10}
          backgroundColor="color-green-100"
          borderRadius={8}
          userSelect="all"
          fontSize={18}
        >
          This text should be selectable with one click (userSelect="all")
        </View>
      </View>

      {/* Using other vendor prefixes */}
      <View
        padding={20}
        backgroundColor="#f0f0f0"
        borderRadius={8}
      >
        <Text fontWeight="bold">Other Vendor Prefixes:</Text>
        <View
          padding={20}
          display="flex"
          fontSize={18}
        >
          This element uses flex display with auto vendor prefixes
        </View>
      </View>
    </Vertical>
  );
};
