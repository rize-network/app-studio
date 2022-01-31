import React from 'react';
import { Meta, Story } from '@storybook/react';
import { useTheme, useResponsive } from '../src';

const Theme = () => {
  const theme = useTheme();

  console.log({ theme });
  return <>{Object.keys(theme.main).join(', ')}</>;
};

const Responsive = () => {
  const responsive = useResponsive();
  console.log({ responsive });

  return <>{responsive.screen}</>;
};

const meta: Meta = {
  title: 'Hooks',
  subcomponents: [
    {
      title: 'Theme',
      component: Theme,
    },
    {
      title: 'Responsive',
      component: Responsive,
    },
  ],
};

export default meta;

const ThemeTemplate: Story = () => <Theme />;

const ResponsiveTemplate: Story = () => <Responsive />;
// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const ThemeHook = ThemeTemplate.bind({});

export const ResponsiveHook = ResponsiveTemplate.bind({});
