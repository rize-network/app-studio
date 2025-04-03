// Button.stories.ts|tsx

import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Image } from '../src/index';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overImage#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Image',
  component: Image,
} as ComponentMeta<typeof Image>;

export const Exemple: ComponentStory<typeof Image> = () => {
  return (
    <Image
      wxh={100}
      shadow={9}
      src="https://picsum.photos/200"
      //     only={['mobile']}
    />
  );
};
