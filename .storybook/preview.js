import React, { useState } from 'react';
import { addDecorator } from '@storybook/addon-actions';
import { ThemeProvider, ResponsiveProvider } from '../src';
import { WindowSizeProvider } from '../src/providers/WindowSize';

// https://storybook.js.org/docs/react/writing-stories/parameters#global-parameters
export const parameters = {
  // https://storybook.js.org/docs/react/essentials/actions#automatically-matching-args
  actions: { argTypesRegex: '^on.*' },
};

const Container = ({ children }) => {
  return (
    <WindowSizeProvider>
      <ResponsiveProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </ResponsiveProvider>
    </WindowSizeProvider>
  );
};

export default {
  decorators: [(storyFn) => <Container>{storyFn()}</Container>],
};
