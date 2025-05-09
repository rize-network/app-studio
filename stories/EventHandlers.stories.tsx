import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { View, Text, Vertical, Button } from '../src';

export default {
  title: 'Regression/EventHandlers',
  component: View,
  parameters: {
    docs: {
      description: {
        component:
          'Tests that event handlers like onClick are properly handled and not treated as CSS properties.',
      },
    },
  },
} as ComponentMeta<typeof View>;

export const EventHandlersTest: ComponentStory<typeof View> = () => {
  const [clickCount, setClickCount] = useState(0);
  const [hoverCount, setHoverCount] = useState(0);
  const [changeValue, setChangeValue] = useState('');
  
  const handleClick = () => {
    setClickCount(prev => prev + 1);
  };
  
  const handleMouseEnter = () => {
    setHoverCount(prev => prev + 1);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChangeValue(e.target.value);
  };
  
  return (
    <Vertical gap={20} padding={20}>
      <Text fontSize={24} fontWeight="bold">Event Handlers Test</Text>
      
      {/* onClick handler */}
      <View
        padding={20}
        backgroundColor="#f0f0f0"
        borderRadius={8}
      >
        <Text fontWeight="bold">onClick Handler:</Text>
        <View
          padding={20}
          backgroundColor="#e0e0e0"
          borderRadius={8}
          onClick={handleClick}
          cursor="pointer"
        >
          <Text>Click me! Count: {clickCount}</Text>
        </View>
      </View>
      
      {/* onMouseEnter handler */}
      <View
        padding={20}
        backgroundColor="#f0f0f0"
        borderRadius={8}
      >
        <Text fontWeight="bold">onMouseEnter Handler:</Text>
        <View
          padding={20}
          backgroundColor="#e0e0e0"
          borderRadius={8}
          onMouseEnter={handleMouseEnter}
        >
          <Text>Hover over me! Count: {hoverCount}</Text>
        </View>
      </View>
      
      {/* onChange handler */}
      <View
        padding={20}
        backgroundColor="#f0f0f0"
        borderRadius={8}
      >
        <Text fontWeight="bold">onChange Handler:</Text>
        <View
          padding={20}
          backgroundColor="#e0e0e0"
          borderRadius={8}
          display="flex"
          flexDirection="column"
          gap={10}
        >
          <input 
            type="text" 
            value={changeValue} 
            onChange={handleChange} 
            placeholder="Type something..."
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <Text>Value: {changeValue}</Text>
        </View>
      </View>
      
      {/* Multiple event handlers */}
      <View
        padding={20}
        backgroundColor="#f0f0f0"
        borderRadius={8}
      >
        <Text fontWeight="bold">Multiple Event Handlers:</Text>
        <Button
          padding={10}
          backgroundColor="color.blue.500"
          color="white"
          borderRadius={4}
          onClick={() => alert('Button clicked!')}
          onMouseEnter={() => console.log('Button hovered')}
          onMouseLeave={() => console.log('Button unhovered')}
        >
          Click me (check console too)
        </Button>
      </View>
    </Vertical>
  );
};
