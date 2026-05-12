import React from 'react';
import type { Preview } from '@storybook/react';
import { ThemeProvider, ResponsiveProvider } from '../src';
import { WindowSizeProvider } from '../src/providers/WindowSize';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <WindowSizeProvider>
        <ResponsiveProvider>
          <ThemeProvider>
            <Story />
          </ThemeProvider>
        </ResponsiveProvider>
      </WindowSizeProvider>
    ),
  ],
};

export default preview;
