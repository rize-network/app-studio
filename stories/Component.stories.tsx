// Button.stories.ts|tsx

import React from 'react';

import type { Meta, StoryFn } from '@storybook/react';

import { Input as $Input, Image as $Image, Form as $Form } from '../src/index';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Component',
} as Meta<any>;

export const Input: StoryFn<typeof $Input> = () => {
  return (
    <$Input
      width={100}
      shadow={9}
      on={{ hover: { backgroundColor: 'color-red' } }}
    />
  );
};

export const Form: StoryFn<typeof $Form> = () => {
  return (
    <$Form
      widthHeight={100}
      shadow={9}
      target="https://google.com"
      on={{ hover: { backgroundColor: 'color-red' } }}
    />
  );
};

export const Image: StoryFn<typeof $Image> = () => {
  return (
    <$Image
      widthHeight={100}
      src="https://dummyimage.com/600x400/000/fff"
      on={{ hover: { backgroundColor: 'color-red' } }}
      onClick={() => console.log('click')}
    />
  );
};
