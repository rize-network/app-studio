// Button.stories.ts|tsx

import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import {
  Horizontal,
  HorizontalResponsive,
  Vertical,
  VerticalResponsive,
  View,
} from '../src/index';

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
        width={100}
        height={100}
        shadow={4}
        display="flex"
        margin="0 20px 20px"
        backgroundColor="color-blue-200"
      />
      <View
        width="70%"
        height="70%"
        shadow={4}
        paddingHorizontal={20}
        on={{ hover: { backgroundColor: 'theme-primary' } }}
        media={{
          mobile: {
            backgroundColor: 'color-orange',
          },
          md: {
            backgroundColor: 'color-green',
          },
          desktop: {
            backgroundColor: 'color-red',
          },
        }}
        animate={{
          from: { opacity: 0 },
          to: { opacity: 1 },
          leave: { opacity: 0 },
          duration: '1s',
          timingFunction: 'ease-in-out',
        }}
        // style={{ backgroundColor: 'yellow' }} // Dynamic inline style
        onPress={() => alert('ok')}
        //     only={['mobile']}
      />
      <View
        as="span"
        width={100}
        height={100}
        display="inline"
        textShadow="none"
        color="transparent"
        shadow={4}
        margin="0 20px 20px"
        backgroundColor="color-green-200"
        WebkitTextStroke="1px #000000"
        WebkitTextFillColor="transparent"
      >
        text
      </View>
    </View>
  );
};

export const VerticalExemple: ComponentStory<typeof View> = () => {
  return (
    <Vertical>
      <View
        widthHeight={100}
        shadow={4}
        display="flex"
        margin="0 20px 20px"
        backgroundColor="color-blue"
      />
      <View
        widthHeight={100}
        shadow={4}
        backgroundColor="color-red"
        paddingHorizontal={20}
      />
    </Vertical>
  );
};

export const VerticalResponsiveExemple: ComponentStory<typeof View> = () => {
  return (
    <VerticalResponsive>
      <View
        widthHeight={100}
        shadow={4}
        display="flex"
        margin="0 20px 20px"
        backgroundColor="color-blue-300"
      />
      <View
        widthHeight={100}
        shadow={4}
        backgroundColor="color-red"
        paddingHorizontal={20}
      />
    </VerticalResponsive>
  );
};

export const HorizontalExemple: ComponentStory<typeof View> = () => {
  return (
    <Horizontal>
      <View
        widthHeight={100}
        shadow={4}
        display="flex"
        margin="0 20px 20px"
        backgroundColor="color-blue"
      />
      <View
        widthHeight={100}
        shadow={4}
        backgroundColor="color-red"
        paddingHorizontal={20}
      />
    </Horizontal>
  );
};

export const HorizontalResponsiveExemple: ComponentStory<typeof View> = () => {
  return (
    <HorizontalResponsive>
      <View
        widthHeight={100}
        shadow={4}
        display="flex"
        margin="0 20px 20px"
        backgroundColor="color-blue"
      />
      <View
        widthHeight={100}
        shadow={4}
        backgroundColor="color-red"
        paddingHorizontal={20}
      />
    </HorizontalResponsive>
  );
};
