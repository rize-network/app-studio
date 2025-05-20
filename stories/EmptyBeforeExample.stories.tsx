import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { View, Text, Vertical, Button } from '../src';

export default {
  title: 'CSS/EmptyBeforeExample',
  component: View,
  parameters: {
    docs: {
      description: {
        component:
          'Demonstrates the _empty and _before nested pseudo-class pattern that was previously causing TypeScript errors.',
      },
    },
  },
} as ComponentMeta<typeof View>;

export const EmptyBeforePattern: ComponentStory<typeof View> = () => {
  const [hasContent, setHasContent] = useState(false);

  return (
    <Vertical gap={20} padding={20}>
      <Text fontSize="xl" fontWeight="bold">
        Empty Before Pattern
      </Text>

      <Button
        padding="8px 16px"
        backgroundColor="color.blue.500"
        color="color.white"
        borderRadius={4}
        onClick={() => setHasContent(!hasContent)}
      >
        {hasContent ? 'Clear Content' : 'Add Content'}
      </Button>

      <View
        width={400}
        height={200}
        padding={16}
        backgroundColor="color.gray.100"
        borderRadius={8}
        border="1px solid"
        borderColor="color.gray.300"
        position="relative"
        _empty={{
          _before: {
            content:
              '"This element is empty. Click the button to add content."',
            color: 'color.gray.400',
            pointerEvents: 'none',
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            width: '80%',
          },
        }}
      >
        {hasContent && (
          <Text>
            This is some content that has been added to the container. Click the
            button above to remove it and see the empty state.
          </Text>
        )}
      </View>

      <Text fontSize="md" fontWeight="bold" marginTop={20}>
        Custom Input Example
      </Text>

      <View
        as="input"
        type="text"
        padding={12}
        width={400}
        border="1px solid"
        borderColor="color.gray.300"
        borderRadius={8}
        outline="none"
        data-placeholder="Enter your search query..."
        _empty={{
          _before: {
            content: 'attr(data-placeholder)',
            color: 'color.gray.400',
            pointerEvents: 'none',
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
          },
        }}
        _focus={{
          borderColor: 'color.blue.500',
          boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.2)',
        }}
      />

      <Text fontSize="sm" color="color.gray.500">
        This example demonstrates how to use the _empty and _before nested
        pseudo-classes to create custom placeholder behavior. The TypeScript
        error has been fixed to properly support this pattern.
      </Text>
    </Vertical>
  );
};

export const MultipleNestedPseudos: ComponentStory<typeof View> = () => (
  <Vertical gap={20} padding={20}>
    <Text fontSize="xl" fontWeight="bold">
      Multiple Nested Pseudo-Classes
    </Text>

    <View
      width={400}
      height={200}
      backgroundColor="color.white"
      borderRadius={8}
      border="1px solid"
      borderColor="color.gray.300"
      position="relative"
      padding={16}
      _hover={{
        borderColor: 'color.blue.400',
        _before: {
          content: '"Hovering"',
          position: 'absolute',
          top: '-25px',
          right: '10px',
          backgroundColor: 'color.blue.500',
          color: 'color.white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
        },
        _after: {
          content: '""',
          position: 'absolute',
          bottom: '-10px',
          right: '10px',
          width: '10px',
          height: '10px',
          backgroundColor: 'color.blue.500',
          borderRadius: '50%',
        },
      }}
      _empty={{
        _before: {
          content: '"Empty Container"',
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'color.gray.400',
          fontSize: '16px',
        },
      }}
    />

    <Text fontSize="sm" color="color.gray.500">
      This example shows multiple levels of nesting with different
      pseudo-classes and pseudo-elements. Hover over the box to see both
      ::before and ::after pseudo-elements applied simultaneously.
    </Text>
  </Vertical>
);
