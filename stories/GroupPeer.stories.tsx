import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { View, Text, Vertical } from '../src';

export default {
  title: 'CSS/GroupPeer',
  component: View,
  parameters: {
    docs: {
      description: {
        component:
          'Demonstrates how group and peer modifiers work in app-studio.',
      },
    },
  },
} as ComponentMeta<typeof View>;

export const GroupHover: ComponentStory<typeof View> = () => {
  return (
    <Vertical gap={20} padding={20}>
      <Text fontSize={24} fontWeight="bold">
        Group Hover Test
      </Text>

      <View
        className="group"
        padding={20}
        backgroundColor="#f0f0f0"
        borderRadius={8}
        cursor="pointer"
        _hover={{ backgroundColor: '#e0e0e0' }}
      >
        <Text fontWeight="bold">Hover over this box (the group parent)</Text>

        <View
          marginTop={10}
          padding={10}
          backgroundColor="white"
          borderRadius={4}
          transition="all 0.2s"
          _groupHover={{
            backgroundColor: 'color-blue-100',
            transform: 'scale(1.02)',
            color: 'color-blue-700',
          }}
        >
          This child reacts to group verify hover!
        </View>

        <Text
          marginTop={10}
          color="gray"
          _groupHover={{ color: 'black', fontWeight: 'bold' }}
        >
          Even this text reacts to group hover
        </Text>
      </View>
    </Vertical>
  );
};

export const PeerHover: ComponentStory<typeof View> = () => {
  return (
    <Vertical gap={20} padding={20}>
      <Text fontSize={24} fontWeight="bold">
        Peer Hover Test
      </Text>

      <View>
        <Text marginBottom={5}>Hover over the button below:</Text>

        <View
          as="button"
          className="peer"
          padding={10}
          backgroundColor="color-blue-500"
          color="white"
          borderRadius={4}
          border="none"
          cursor="pointer"
        >
          I am the Peer
        </View>

        <View
          marginTop={10}
          padding={10}
          backgroundColor="#f0f0f0"
          borderRadius={4}
          transition="all 0.2s"
          _peerHover={{
            backgroundColor: 'color-green-100',
            color: 'color-green-700',
          }}
        >
          I react when my peer (sibling above) is hovered!
        </View>
      </View>
    </Vertical>
  );
};
