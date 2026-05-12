// Button.stories.ts|tsx

import React from 'react';

import type { Meta, StoryFn } from '@storybook/react';

import { Image } from '../src/index';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overImage#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Image',
  component: Image,
} as Meta<typeof Image>;

export const Exemple: StoryFn<typeof Image> = () => {
  return (
    <Image
      widthHeight={100}
      shadow={9}
      src="https://picsum.photos/200"
      //     only={['mobile']}
    />
  );
};
