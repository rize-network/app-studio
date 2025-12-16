import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { View, Text, Vertical, Scroll } from '../src';

export default {
  title: 'CSS/ScrollAnimation',
  component: View,
  parameters: {
    docs: {
      description: {
        component:
          'Demonstrates scroll-driven animations using animateOn="Scroll".',
      },
    },
  },
} as ComponentMeta<typeof View>;

export const ScrollTimeline: ComponentStory<typeof View> = () => {
  return (
    <Vertical gap={20} padding={20} height="100vh">
      <Text fontSize={24} fontWeight="bold">Scroll Timeline Animation</Text>
      <Text>Scroll down to see the progress bar animate.</Text>
      
      {/* Scroll container */}
      <View 
        height={300} 
        overflow="auto" 
        border="1px solid #ccc" 
        padding={20}
        position="relative"
      >
        {/* Progress Bar inside scroll container */}
        <View
          position="sticky"
          top={0}
          left={0}
          width="100%"
          height={8}
          backgroundColor="#ddd"
          marginBottom={20}
          zIndex={10}
        >
           <View
             height="100%"
             backgroundColor="color.blue.500"
             width="0%"
             animateOn="Scroll"
             animate={{
                keyframes: {
                    from: { width: '0%' },
                    to: { width: '100%' }
                }
             }}
           />
        </View>

        <Text>Scroll Content Start</Text>
        <Vertical gap={50} paddingVertical={50}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                <View key={i} padding={20} backgroundColor="#f5f5f5" borderRadius={8}>
                    Item {i}
                </View>
            ))}
        </Vertical>
        <Text>Scroll Content End</Text>
      </View>
    </Vertical>
  );
};
