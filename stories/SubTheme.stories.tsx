import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { View, Text, Vertical, Horizontal } from '../src';
import { ThemeProvider, useTheme } from '../src/providers/Theme';

export default {
  title: 'Theme/SubTheme',
  component: ThemeProvider,
  parameters: {
    docs: {
      description: {
        component:
          'Demonstrates the component-level `theme` prop. Each Element-derived component can override the global `theme-*` tokens (primary, secondary, success, error, warning, etc.) for itself and its style props, without touching the global ThemeProvider. Useful when a single screen needs a "branded" component (e.g. a Startup Studio launch button) while the rest of the UI keeps the global palette.',
      },
    },
  },
} as Meta<typeof ThemeProvider>;

const Card = ({
  label,
  ...rest
}: { label: string } & React.ComponentProps<typeof View>) => (
  <View padding={20} borderRadius={8} backgroundColor="theme-primary" {...rest}>
    <Text color="color-white" fontWeight="bold">
      {label}
    </Text>
    <Text color="color-white" marginTop={4}>
      bg = theme-primary, text = color-white
    </Text>
  </View>
);

export const Basic: StoryFn<typeof ThemeProvider> = () => {
  return (
    <ThemeProvider>
      <Vertical gap={16} padding={20}>
        <Text fontSize={20} fontWeight="bold">
          Same component, three different sub-themes
        </Text>
        <Text color="color-gray-700">
          Each card uses <code>backgroundColor="theme-primary"</code>. The first
          uses the global theme; the others remap{' '}
          <code>theme-primary</code> via the component <code>theme</code> prop.
        </Text>

        <Card label="Default (global theme-primary)" />

        <Card
          label="Sub-theme: primary -> color-red-500"
          theme={{ primary: 'color-red-500' }}
        />

        <Card
          label="Sub-theme: primary -> color-emerald-600"
          theme={{ primary: 'color-emerald-600' }}
        />
      </Vertical>
    </ThemeProvider>
  );
};

export const AlphaSuffix: StoryFn<typeof ThemeProvider> = () => {
  return (
    <ThemeProvider>
      <Vertical gap={16} padding={20}>
        <Text fontSize={20} fontWeight="bold">
          Alpha suffix works on overridden tokens
        </Text>
        <Text color="color-gray-700">
          <code>theme-primary-200</code> resolves the override and applies 20%
          opacity via <code>color-mix()</code>.
        </Text>

        <View
          padding={20}
          borderRadius={8}
          backgroundColor="theme-primary-200"
          theme={{ primary: 'color-blue-500' }}
        >
          <Text>theme-primary-200 with primary -&gt; color-blue-500</Text>
        </View>

        <View
          padding={20}
          borderRadius={8}
          backgroundColor="theme-primary-500"
          theme={{ primary: 'color-fuchsia-600' }}
        >
          <Text>theme-primary-500 with primary -&gt; color-fuchsia-600</Text>
        </View>
      </Vertical>
    </ThemeProvider>
  );
};

export const ScopedToSubtree: StoryFn<typeof ThemeProvider> = () => {
  return (
    <ThemeProvider>
      <Vertical gap={16} padding={20}>
        <Text fontSize={20} fontWeight="bold">
          Override does not leak to siblings or parents
        </Text>

        <View
          padding={20}
          borderRadius={8}
          backgroundColor="theme-primary"
          theme={{ primary: 'color-orange-500' }}
        >
          <Text color="color-white">
            Parent has primary -&gt; orange-500. Child below inherits CSS
            variables, but only this Element's own `theme-*` props were
            remapped.
          </Text>

          <View
            marginTop={12}
            padding={12}
            borderRadius={6}
            backgroundColor="theme-primary"
          >
            <Text color="color-white">
              Inner View has no `theme` prop. Its `backgroundColor=theme-primary`
              uses the global var(--theme-primary), not the parent's override.
            </Text>
          </View>
        </View>

        <View
          padding={20}
          borderRadius={8}
          backgroundColor="theme-primary"
        >
          <Text color="color-white">
            Sibling without `theme` prop: still global theme-primary.
          </Text>
        </View>
      </Vertical>
    </ThemeProvider>
  );
};

export const MultipleSlots: StoryFn<typeof ThemeProvider> = () => {
  return (
    <ThemeProvider>
      <Vertical gap={16} padding={20}>
        <Text fontSize={20} fontWeight="bold">
          Override several theme slots at once
        </Text>

        <View
          padding={20}
          borderRadius={8}
          backgroundColor="theme-primary"
          borderColor="theme-secondary"
          borderWidth={4}
          borderStyle="solid"
          theme={{
            primary: 'color-indigo-600',
            secondary: 'color-yellow-400',
          }}
        >
          <Text color="color-white">
            primary -&gt; indigo-600, secondary -&gt; yellow-400 (border)
          </Text>
        </View>

        <Horizontal gap={12}>
          <View
            padding={12}
            borderRadius={6}
            backgroundColor="theme-success"
            theme={{ success: 'color-teal-500' }}
          >
            <Text color="color-white">success -&gt; teal-500</Text>
          </View>
          <View
            padding={12}
            borderRadius={6}
            backgroundColor="theme-error"
            theme={{ error: 'color-rose-700' }}
          >
            <Text color="color-white">error -&gt; rose-700</Text>
          </View>
          <View
            padding={12}
            borderRadius={6}
            backgroundColor="theme-warning"
            theme={{ warning: 'color-amber-500' }}
          >
            <Text>warning -&gt; amber-500</Text>
          </View>
        </Horizontal>
      </Vertical>
    </ThemeProvider>
  );
};

const DarkModeBody = () => {
  const { themeMode, setThemeMode } = useTheme();
  return (
    <Vertical gap={16} padding={20}>
      <Horizontal gap={12} alignItems="center">
        <Text fontSize={20} fontWeight="bold">
          Dark mode interaction
        </Text>
        <View
          as="button"
          padding="6px 12px"
          borderRadius={6}
          backgroundColor="color-gray-200"
          color="color-gray-900"
          onClick={() =>
            setThemeMode(themeMode === 'light' ? 'dark' : 'light')
          }
        >
          Toggle ({themeMode})
        </View>
      </Horizontal>
      <Text color="color-gray-700">
        The override below points <code>primary</code> to{' '}
        <code>color-red-500</code>. Because <code>color-red-500</code> is a
        palette token (a CSS variable), it still swaps between light/dark
        palette values when the global mode toggles.
      </Text>

      <View
        padding={20}
        borderRadius={8}
        backgroundColor="theme-primary"
        theme={{ primary: 'color-red-500' }}
      >
        <Text color="color-white">
          theme-primary -&gt; color-red-500 (responds to dark mode)
        </Text>
      </View>

      <Text color="color-gray-700" fontSize={12}>
        Caveat: a hex literal like <code>theme=&#123;&#123; primary: '#ff0000'
        &#125;&#125;</code> would NOT respond to dark mode, since it bypasses
        the palette CSS variables.
      </Text>
    </Vertical>
  );
};

export const DarkModeInteraction: StoryFn<typeof ThemeProvider> = () => {
  return (
    <ThemeProvider>
      <DarkModeBody />
    </ThemeProvider>
  );
};
