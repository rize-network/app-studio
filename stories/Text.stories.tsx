// Button.stories.ts|tsx

import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Text, useResponsive } from '../src/index';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overText#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Text',
  component: Text,
} as ComponentMeta<typeof Text>;

export const Exemple: ComponentStory<typeof Text> = () => {
  const { screen, on } = useResponsive();
  const responsive = {
    xs: {
      color: 'red',
    },
    sm: {
      color: 'green',
    },
    md: {
      color: 'blue',
    },
    lg: {
      color: 'yellow',
    },
    xl: {
      color: 'red',
    },
  };

  return (
    <Text size={100} lineHeight={20} {...responsive[screen]}>
      {screen} - {on('mobile') ? 'Mobile' : 'Not Mobile'}
    </Text>
  );
};
