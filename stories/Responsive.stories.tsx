// Responsive.stories.tsx
import React from 'react';

import type { Meta, StoryFn } from '@storybook/react';

import {
  Horizontal,
  Responsive,
  Text,
  useResponsive,
  Vertical,
  View,
} from '../src/index';

export default {
  title: 'Responsive',
  component: Responsive,
} as Meta<typeof Responsive>;

/**
 * A card that adapts in two independent ways:
 *  - CSS (`media` prop): flex-direction + background color switch by device.
 *    Inside `<Responsive container>` these compile to CSS container queries, so
 *    they follow the container; otherwise they follow the window.
 *  - JS (`useResponsive`): the readout shows the resolved breakpoint/device and
 *    whether it came from a container or the window.
 */
const AdaptiveCard = ({ label }: { label?: string }) => {
  const { screen, currentDevice, containerScoped } = useResponsive();

  return (
    <View
      display="flex"
      gap={12}
      padding={16}
      borderRadius={10}
      color="color-white"
      media={{
        mobile: {
          flexDirection: 'column',
          backgroundColor: 'color-orange-500',
        },
        tablet: {
          flexDirection: 'row',
          backgroundColor: 'color-green-500',
        },
        desktop: {
          flexDirection: 'row',
          backgroundColor: 'color-blue-500',
        },
      }}
    >
      <View
        widthHeight={48}
        borderRadius={8}
        backgroundColor="color-white"
        opacity={0.35}
      />
      <Vertical gap={2}>
        <Text fontWeight="bold">{label ?? 'Adaptive card'}</Text>
        <Text fontSize={13}>breakpoint: {screen}</Text>
        <Text fontSize={13}>device: {currentDevice}</Text>
        <Text fontSize={13}>
          source: {containerScoped ? 'container' : 'window'}
        </Text>
      </Vertical>
    </View>
  );
};

/**
 * The headline demo: the SAME card, side by side. The left one is wrapped in a
 * resizable `<Responsive container>`; drag its bottom-right handle and it
 * switches to mobile/tablet/desktop based on its own width — while the window
 * (and the right card) stay desktop-sized.
 */
export const ContainerVsWindow: StoryFn<typeof Responsive> = () => (
  <Vertical gap={20} padding={16}>
    <Text fontSize={14} color="color-gray-600">
      Drag the bottom-right handle of the left box to resize it. The card adapts
      to its <b>container</b> even though the window stays desktop-sized. The
      right card adapts to the <b>window</b>.
    </Text>

    <Horizontal gap={24} flexWrap="wrap" alignItems="flex-start">
      <Vertical gap={8}>
        <Text fontWeight="bold">Container-scoped (resizable)</Text>
        <Responsive
          container
          style={{
            resize: 'horizontal',
            overflow: 'auto',
            width: 440,
            minWidth: 150,
            maxWidth: 900,
            padding: 12,
            border: '2px dashed #cbd5e1',
            borderRadius: 12,
          }}
        >
          <AdaptiveCard label="Container card" />
        </Responsive>
      </Vertical>

      <Vertical gap={8}>
        <Text fontWeight="bold">Window-scoped</Text>
        <View
          width={440}
          padding={12}
          border="2px dashed #cbd5e1"
          borderRadius={12}
        >
          <AdaptiveCard label="Window card" />
        </View>
      </Vertical>
    </Horizontal>
  </Vertical>
);

/**
 * A realistic layout: a half-width chat panel that renders in mobile mode
 * purely because of its container width, not the window.
 */
export const HalfWidthChat: StoryFn<typeof Responsive> = () => (
  <Horizontal gap={0} height={320} width="100%">
    <View flex={1} padding={16} backgroundColor="color-gray-100">
      <Text fontWeight="bold">Editor / main area</Text>
      <Text fontSize={13} color="color-gray-600">
        Takes the other half of the window.
      </Text>
    </View>

    <Responsive container style={{ width: '50%', borderLeft: '1px solid #e2e8f0' }}>
      <Vertical gap={12} padding={16} height="100%">
        <Text fontWeight="bold">Chat panel (container-scoped)</Text>
        <AdaptiveCard label="Chat message" />
        <AdaptiveCard label="Chat message" />
      </Vertical>
    </Responsive>
  </Horizontal>
);

const BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl'];

/** Pin a fixed breakpoint regardless of window/container size. */
export const ForceBreakpoint: StoryFn<typeof Responsive> = () => (
  <Vertical gap={16} padding={16}>
    <Text fontSize={14} color="color-gray-600">
      Each card is pinned with <code>forceBreakpoint</code>.
    </Text>
    <Horizontal gap={16} flexWrap="wrap" alignItems="flex-start">
      {BREAKPOINTS.map((bp) => (
        <Vertical key={bp} gap={6} width={240}>
          <Text fontWeight="bold">forceBreakpoint=&quot;{bp}&quot;</Text>
          <Responsive forceBreakpoint={bp}>
            <AdaptiveCard label={`pinned: ${bp}`} />
          </Responsive>
        </Vertical>
      ))}
    </Horizontal>
  </Vertical>
);

const MODES = ['mobile', 'tablet', 'desktop'] as const;

/** Pin a fixed device with responsiveMode (only real device names are valid). */
export const ForceDevice: StoryFn<typeof Responsive> = () => (
  <Vertical gap={16} padding={16}>
    <Text fontSize={14} color="color-gray-600">
      Each card is pinned with <code>responsiveMode</code>.
    </Text>
    <Horizontal gap={16} flexWrap="wrap" alignItems="flex-start">
      {MODES.map((mode) => (
        <Vertical key={mode} gap={6} width={260}>
          <Text fontWeight="bold">responsiveMode=&quot;{mode}&quot;</Text>
          <Responsive responsiveMode={mode}>
            <AdaptiveCard label={`pinned: ${mode}`} />
          </Responsive>
        </Vertical>
      ))}
    </Horizontal>
  </Vertical>
);
