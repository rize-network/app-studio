import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { View, Text, Vertical, Horizontal } from '../src';

export default {
  title: 'CSS/CrossBrowserCompatibility',
  component: View,
  parameters: {
    docs: {
      description: {
        component:
          'Demonstrates enhanced cross-browser compatibility with automatic vendor prefixing.',
      },
    },
  },
} as ComponentMeta<typeof View>;

export const VendorPrefixedProperties: ComponentStory<typeof View> = () => {
  return (
    <Vertical gap={20} padding={20}>
      <Text fontSize={24} fontWeight="bold">
        Cross-Browser Compatibility Test
      </Text>

      {/* Text with gradient background (WebKit) */}
      <View padding={20} backgroundColor="#f0f0f0" borderRadius={8}>
        <Text fontWeight="bold">Text with Gradient Background (WebKit):</Text>
        <View
          padding={20}
          background="linear-gradient(45deg, #ff0000, #00ff00, #0000ff)"
          backgroundClip="text" // This will be auto-prefixed
          color="transparent"
          fontSize={24}
          fontWeight="bold"
        >
          This text should have a gradient background with auto-prefixing
        </View>
      </View>

      {/* User Select (All browsers) */}
      <View padding={20} backgroundColor="#f0f0f0" borderRadius={8}>
        <Text fontWeight="bold">User Select (All browsers):</Text>
        <View
          padding={20}
          backgroundColor="#e0e0e0"
          userSelect="none" // This will be auto-prefixed for all browsers
          fontSize={18}
        >
          This text cannot be selected (try to select it)
        </View>
      </View>

      {/* Flexbox with vendor prefixes */}
      <View padding={20} backgroundColor="#f0f0f0" borderRadius={8}>
        <Text fontWeight="bold">Flexbox with Vendor Prefixes:</Text>
        <View
          display="flex" // Will be auto-prefixed
          flexDirection="row" // Will be auto-prefixed
          justifyContent="space-between" // Will be auto-prefixed
          alignItems="center" // Will be auto-prefixed
          padding={20}
          backgroundColor="#e0e0e0"
        >
          <View backgroundColor="color-blue-500" widthHeight={50} />
          <View backgroundColor="color-green-500" widthHeight={50} />
          <View backgroundColor="color-red-500" widthHeight={50} />
        </View>
      </View>

      {/* Transforms with vendor prefixes */}
      <View padding={20} backgroundColor="#f0f0f0" borderRadius={8}>
        <Text fontWeight="bold">Transforms with Vendor Prefixes:</Text>
        <Horizontal gap={20} justifyContent="center">
          <View
            backgroundColor="color-purple-500"
            widthHeight={100}
            transform="rotate(45deg)" // Will be auto-prefixed
            margin={20}
          />
          <View
            backgroundColor="color-teal-500"
            widthHeight={100}
            transform="scale(1.2)" // Will be auto-prefixed
            margin={20}
          />
          <View
            backgroundColor="color-orange-500"
            widthHeight={100}
            transform="skew(10deg, 10deg)" // Will be auto-prefixed
            margin={20}
          />
        </Horizontal>
      </View>

      {/* Transitions with vendor prefixes */}
      <View padding={20} backgroundColor="#f0f0f0" borderRadius={8}>
        <Text fontWeight="bold">Transitions with Vendor Prefixes:</Text>
        <View
          backgroundColor="color-blue-500"
          widthHeight={100}
          transition="all 0.3s ease" // Will be auto-prefixed
          _hover={{
            transform: 'scale(1.2)',
            backgroundColor: 'color-red-500',
          }}
          margin="0 auto"
        >
          <Text color="white" textAlign="center" padding={10}>
            Hover me
          </Text>
        </View>
      </View>

      {/* Animations with vendor prefixes */}
      <View padding={20} backgroundColor="#f0f0f0" borderRadius={8}>
        <Text fontWeight="bold">Animations with Vendor Prefixes:</Text>
        <View
          backgroundColor="color-green-500"
          widthHeight={100}
          animate={{
            from: { opacity: 0, transform: 'translateY(20px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
            duration: '1s',
            timingFunction: 'ease-out',
            iterationCount: 'infinite',
            direction: 'alternate',
          }}
          margin="0 auto"
        >
          <Text color="white" textAlign="center" padding={10}>
            Animated
          </Text>
        </View>
      </View>
    </Vertical>
  );
};
