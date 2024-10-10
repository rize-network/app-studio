// Button.stories.ts|tsx

import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Skeleton } from '../src/index';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overSkeleton#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Skeleton',
  component: Skeleton,
} as ComponentMeta<typeof Skeleton>;

export const Exemple: ComponentStory<typeof Skeleton> = () => {
  return <Skeleton size={100} />;
};
