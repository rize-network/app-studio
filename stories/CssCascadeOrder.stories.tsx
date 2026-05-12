import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { View, Text, Vertical, Horizontal } from '../src';
import { ThemeProvider } from '../src/providers/Theme';

export default {
  title: 'Styling/CSS Cascade Order',
  component: View,
  parameters: {
    docs: {
      description: {
        component:
          'Verifies that CSS shorthand and longhand props compose correctly regardless of prop order. Each utility class targets one CSS declaration, but shorthands like `border` reset longhands like `borderColor`. The fix: route shorthands → side-shorthands → cross-property shorthands → longhands into separate stylesheets so the cascade resolves deterministically by source order in <head>.',
      },
    },
  },
} as ComponentMeta<typeof View>;

// The case from the user's report:
//   `borderTop: '1px solid'` + `borderColor: 'color-gray-100'`
// `border-top` shorthand resets `border-top-color` to `currentcolor`.
// `border-color` sets all four `*-color` longhands.
// Expected: a single 1px solid gray-100 line on top, no other borders.
export const BorderTopPlusBorderColor: ComponentStory<typeof View> = () => (
  <ThemeProvider>
    <Vertical gap={16} padding={20}>
      <Text fontSize={20} fontWeight="bold">
        borderTop + borderColor
      </Text>
      <Text color="color-gray-600">
        Each row should show a single gray top edge. If you see a black line
        (currentcolor) or no top edge at all, the cascade is broken.
      </Text>

      {/* borderTop declared BEFORE borderColor */}
      <Vertical
        gap={8}
        padding={16}
        borderTop="1px solid"
        borderColor="color-gray-100"
        justifyContent="flex-end"
      >
        <Text>borderTop first, then borderColor — expect gray top edge</Text>
      </Vertical>

      {/* borderColor declared BEFORE borderTop (reverse source order) */}
      <Vertical
        gap={8}
        padding={16}
        borderColor="color-gray-100"
        borderTop="1px solid"
        justifyContent="flex-end"
      >
        <Text>borderColor first, then borderTop — also expect gray</Text>
      </Vertical>

      {/* The exact pattern from the bug report */}
      <Vertical
        gap={8}
        padding={16}
        borderTop="1px solid"
        borderColor="color-gray-100"
        justifyContent="flex-end"
      >
        <Text>Repro of original failing card markup</Text>
      </Vertical>
    </Vertical>
  </ThemeProvider>
);

// `border` (top-level shorthand) vs `borderColor` (cross-property shorthand).
// `border: '1px solid'` resets all four side colors to currentcolor.
// `borderColor: 'color-blue-500'` then overrides the color on all four sides.
// Expected: a 1px solid blue-500 box.
export const BorderShorthandPlusBorderColor: ComponentStory<typeof View> = () => (
  <ThemeProvider>
    <Vertical gap={16} padding={20}>
      <Text fontSize={20} fontWeight="bold">
        border + borderColor
      </Text>
      <Text color="color-gray-600">
        All four sides should be blue-500.
      </Text>

      <Vertical
        padding={16}
        border="1px solid"
        borderColor="color-blue-500"
      >
        <Text>border declared before borderColor</Text>
      </Vertical>

      <Vertical
        padding={16}
        borderColor="color-blue-500"
        border="1px solid"
      >
        <Text>borderColor declared before border</Text>
      </Vertical>
    </Vertical>
  </ThemeProvider>
);

// `border` shorthand vs per-side `borderTop`. The side-shorthand should win
// for the side it targets and leave the rest as the general `border` set.
// Expected: thick red top, thin gray on the other three sides.
export const BorderShorthandPlusSideShorthand: ComponentStory<typeof View> = () => (
  <ThemeProvider>
    <Vertical gap={16} padding={20}>
      <Text fontSize={20} fontWeight="bold">
        border + borderTop
      </Text>
      <Text color="color-gray-600">
        Top should be 4px solid red; other sides should be 1px solid gray.
      </Text>

      <Vertical
        padding={16}
        border="1px solid color-gray-300"
        borderTop="4px solid color-red-500"
      >
        <Text>border first, then borderTop overrides the top side</Text>
      </Vertical>

      <Vertical
        padding={16}
        borderTop="4px solid color-red-500"
        border="1px solid color-gray-300"
      >
        <Text>borderTop first — border should NOT undo it</Text>
      </Vertical>
    </Vertical>
  </ThemeProvider>
);

// Three-way: `border` < `borderTop` < `borderTopColor`. Each layer should
// override the previous for its slice of the box.
// Expected: green top edge (3px from borderTop, color from borderTopColor),
// gray-300 1px on other sides.
export const FullCascadeStack: ComponentStory<typeof View> = () => (
  <ThemeProvider>
    <Vertical gap={16} padding={20}>
      <Text fontSize={20} fontWeight="bold">
        border + borderTop + borderTopColor
      </Text>
      <Text color="color-gray-600">
        Top should be 3px solid green-600 (width/style from borderTop, color
        from borderTopColor); other sides 1px solid gray-300.
      </Text>

      <Vertical
        padding={16}
        border="1px solid color-gray-300"
        borderTop="3px solid color-red-500"
        borderTopColor="color-green-600"
      >
        <Text>Three layers of specificity, declared in cascade order</Text>
      </Vertical>

      <Vertical
        padding={16}
        borderTopColor="color-green-600"
        borderTop="3px solid color-red-500"
        border="1px solid color-gray-300"
      >
        <Text>Reverse declaration order — same visual result</Text>
      </Vertical>
    </Vertical>
  </ThemeProvider>
);

// The button-in-footer pattern from the user's bug report.
export const ButtonFooterRepro: ComponentStory<typeof View> = () => (
  <ThemeProvider>
    <View
      display="flex"
      flexDirection="column"
      gap={8}
      padding={16}
      borderTop="1px solid"
      borderColor="color-gray-100"
      justifyContent="flex-end"
    >
      <Text fontSize={12} color="color-gray-600">
        Footer with `borderTop="1px solid"` + `borderColor="color-gray-100"`
      </Text>
      <View
        as="button"
        padding={8}
        backgroundColor="color-blue-500"
        color="white"
        borderRadius={8}
        borderWidth={1}
        borderStyle="solid"
        borderColor="color-blue-500"
        cursor="pointer"
        width="fit-content"
      >
        Action
      </View>
    </View>
  </ThemeProvider>
);
