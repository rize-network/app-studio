// Button.stories.ts|tsx

import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import { View } from '../src/index';

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
    <View display="flex" flexWrap="wrap" width={100} height={200}>
      <View
        size={'10vh'}
        shadow={4}
        display="flex"
        backgroundColor="color.blue"
      />
      <View
        size={'70%'}
        shadow={4}
        paddingHorizontal={20}
        on={{ hover: { backgroundColor: 'theme.primary' } }}
        media={{
          mobile: {
            backgroundColor: 'color.orange',
          },
          md: {
            backgroundColor: 'color.green',
          },
          desktop: {
            backgroundColor: 'color.red',
          },
        }}
        animate={{
          from: { opacity: 0 },
          enter: { opacity: 1 },
          leave: { opacity: 0 },
          duration: '1s',
          timingFunction: 'ease-in-out',
        }}
        // style={{ backgroundColor: 'yellow' }} // Dynamic inline style
        onPress={() => alert('ok')}
        //     only={['mobile']}
      />
    </View>
  );
};
