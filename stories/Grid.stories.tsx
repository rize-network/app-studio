import React from 'react';

import type { Meta, StoryFn } from '@storybook/react';

import { Grid, Text, View } from '../src/index';

export default {
  title: 'Grid',
  component: Grid,
} as Meta<typeof Grid>;

const Cell = ({ children }: { children: React.ReactNode }) => (
  <View
    backgroundColor="color-blue-200"
    color="color-blue-900"
    padding={16}
    borderRadius={8}
  >
    <Text>{children}</Text>
  </View>
);

// `columns={n}` renders n equal-width columns; `gap` spaces every cell.
export const Columns: StoryFn<typeof Grid> = () => (
  <Grid columns={3} gap={16}>
    {Array.from({ length: 6 }).map((_, i) => (
      <Cell key={i}>Item {i + 1}</Cell>
    ))}
  </Grid>
);

// A string is used verbatim as the track template for uneven columns.
export const CustomTracks: StoryFn<typeof Grid> = () => (
  <Grid columns="1fr 2fr 1fr" gap={16}>
    <Cell>1fr</Cell>
    <Cell>2fr</Cell>
    <Cell>1fr</Cell>
  </Grid>
);

// Collapse columns at breakpoints with the standard `media` prop.
export const Responsive: StoryFn<typeof Grid> = () => (
  <Grid
    columns={4}
    gap={16}
    media={{
      mobile: { gridTemplateColumns: 'repeat(1, 1fr)' },
      md: { gridTemplateColumns: 'repeat(2, 1fr)' },
    }}
  >
    {Array.from({ length: 8 }).map((_, i) => (
      <Cell key={i}>Item {i + 1}</Cell>
    ))}
  </Grid>
);
