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
      
      {/* Using webkitBackgroundClip directly as a prop */}
      <View
        padding={20}
        backgroundColor="#f0f0f0"
        borderRadius={8}
      >
        <Text fontWeight="bold">Direct Prop Usage:</Text>
        <View
          padding={20}
          background="linear-gradient(45deg, #ff0000, #00ff00, #0000ff)"
          webkitBackgroundClip="text"
          color="transparent"
          fontSize={24}
          fontWeight="bold"
        >
          This text should have a gradient background (webkit)
        </View>
      </View>
      
      {/* Using the css prop with webkitBackgroundClip */}
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
            webkitBackgroundClip: "text",
            color: "transparent",
            fontSize: "24px",
            fontWeight: "bold"
          }}
        >
          This text should have a gradient background (webkit)
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
          msFlexDirection="row"
          mozUserSelect="none"
          webkitUserDrag="none"
          fontSize={18}
        >
          This element uses various vendor prefixes
        </View>
      </View>
    </Vertical>
  );
};
