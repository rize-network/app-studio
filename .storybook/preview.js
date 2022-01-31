import React, { useState } from 'react';
import { addDecorator } from '@storybook/react';
import { ThemeProvider, ResponsiveProvider } from '../src';

// https://storybook.js.org/docs/react/writing-stories/parameters#global-parameters
export const parameters = {
  // https://storybook.js.org/docs/react/essentials/actions#automatically-matching-args
  actions: { argTypesRegex: '^on.*' },
};

const Container = ({ children }) => {
  return (
    <ResponsiveProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </ResponsiveProvider>
  );
};

addDecorator((storyFn) => <Container>{storyFn()}</Container>);
