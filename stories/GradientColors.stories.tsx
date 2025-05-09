import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { View, Text, Vertical } from '../src';

export default {
  title: 'CSS/GradientColors',
  component: View,
  parameters: {
    docs: {
      description: {
        component:
          'Demonstrates how color tokens work in gradients and other complex CSS values.',
      },
    },
  },
} as ComponentMeta<typeof View>;

export const GradientWithColorTokens: ComponentStory<typeof View> = () => {
  return (
    <Vertical gap={20} padding={20}>
      <Text fontSize={24} fontWeight="bold">Gradient Color Tokens Test</Text>
      
      {/* Linear gradient with color tokens */}
      <View
        padding={20}
        backgroundColor="#f0f0f0"
        borderRadius={8}
      >
        <Text fontWeight="bold">Linear Gradient with Color Tokens:</Text>
        <View
          height={100}
          width="100%"
          background="linear-gradient(135deg, color.blue.500, color.red.500)"
          borderRadius={8}
          marginTop={10}
        />
      </View>
      
      {/* Radial gradient with color tokens */}
      <View
        padding={20}
        backgroundColor="#f0f0f0"
        borderRadius={8}
      >
        <Text fontWeight="bold">Radial Gradient with Color Tokens:</Text>
        <View
          height={100}
          width="100%"
          background="radial-gradient(circle, color.yellow.300, color.green.600)"
          borderRadius={8}
          marginTop={10}
        />
      </View>
      
      {/* Text with gradient background */}
      <View
        padding={20}
        backgroundColor="#f0f0f0"
        borderRadius={8}
      >
        <Text fontWeight="bold">Text with Gradient Background:</Text>
        <View
          padding={20}
          background="linear-gradient(90deg, color.purple.500, color.pink.500)"
          webkitBackgroundClip="text"
          color="transparent"
          fontSize={24}
          fontWeight="bold"
          marginTop={10}
        >
          This text should have a gradient background
        </View>
      </View>
      
      {/* Border with color tokens */}
      <View
        padding={20}
        backgroundColor="#f0f0f0"
        borderRadius={8}
      >
        <Text fontWeight="bold">Border with Color Tokens:</Text>
        <View
          height={100}
          width="100%"
          border="3px solid color.teal.500"
          borderRadius={8}
          marginTop={10}
        />
      </View>
      
      {/* Box shadow with color tokens */}
      <View
        padding={20}
        backgroundColor="#f0f0f0"
        borderRadius={8}
      >
        <Text fontWeight="bold">Box Shadow with Color Tokens:</Text>
        <View
          height={100}
          width="100%"
          backgroundColor="white"
          boxShadow="0 10px 15px color.blue.500"
          borderRadius={8}
          marginTop={10}
        />
      </View>
    </Vertical>
  );
};
