// Button.stories.ts|tsx

import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import { View, useResponsive } from '../src/index';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'View',
  component: View,
} as ComponentMeta<typeof View>;

export const Exemple: ComponentStory<typeof View> = () => {
  return (
    <View
      size={100}
      shadow={4}
      paddingHorizontal={20}
      display="flex"
      backgroundColor="color.yellow"
      on={{ hover: { backgroundColor: 'theme.primary' } }}
      media={{
        mobile: {
          backgroundColor: 'color.green',
        },
        tablet: {
          backgroundColor: 'color.blue',
        },
        md: {
          backgroundColor: 'color.red',
        },
      }}
      animate={{
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        duration: '2s',
        timingFunction: 'ease-in-out',
      }}
      // style={{ backgroundColor: 'yellow' }} // Dynamic inline style
      onPress={() => alert('ok')}
      //     only={['mobile']}
    />
  );
};
