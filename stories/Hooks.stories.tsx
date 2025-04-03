import React from 'react';
import { Meta, Story } from '@storybook/react';
import { View, useResponsive } from '../src';
import { useActive } from '../src/hooks/useActive';
import { useClickOutside } from '../src/hooks/useClickOutside';
import { useFocus } from '../src/hooks/useFocus';
import { useHover } from '../src/hooks/useHover';
import { useInView } from '../src/hooks/useInView';
import { useKeyPress } from '../src/hooks/useKeyPress';
import { useMount } from '../src/hooks/useMount';
import { useScroll } from '../src/hooks/useScroll';
import { useOnScreen } from '../src/hooks/useOnScreen';
import { useWindowSize } from '../src/hooks/useWindowSize';

const ActiveExample = () => {
  const [ref, active] = useActive<HTMLDivElement>();
  return (
    <View>
      <View
        ref={ref}
        padding="20px"
        backgroundColor={active ? 'green' : 'red'}
        textAlign="center"
        marginBottom="10px"
      >
        {active ? 'Active' : 'Inactive'}
      </View>
      <View>Click or touch the box.</View>
    </View>
  );
};

const ClickOutsideExample = () => {
  const [ref, clickedOutside] = useClickOutside<HTMLDivElement>();
  return (
    <View>
      <View
        ref={ref}
        padding="20px"
        backgroundColor={'green'}
        textAlign="center"
        marginBottom="10px"
      >
        Click inside this box
      </View>
      <View>{clickedOutside ? 'Clicked outside' : 'Clicked inside'}</View>
    </View>
  );
};

const FocusExample = () => {
  const [ref, focused] = useFocus<HTMLInputElement>();
  return (
    <View>
      <input
        ref={ref}
        placeholder="Focus on me"
        style={{ padding: '8px', margin: '8px' }}
      />
      <View>{focused ? 'Focused' : 'Not Focused'}</View>
    </View>
  );
};

const HoverExample = () => {
  const [ref, hover] = useHover<HTMLDivElement>();
  return (
    <View>
      <View
        ref={ref}
        css={{
          padding: '20px',
          border: '1px solid #000',
          textAlign: 'center',
          marginBottom: '10px',
        }}
      >
        {hover ? 'Hovering' : 'Not Hovering'}
      </View>
      <View>Hover over the box.</View>
    </View>
  );
};

const InViewExample = () => {
  const { ref, inView } = useInView({ threshold: 0.5 });
  return (
    <View
      css={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <View marginTop="40vh">
        {inView ? 'Element is in view' : 'Element is out of view'}
      </View>
      <View ref={ref} backgroundColor="lightblue" margin="60vh">
        {inView ? 'Element is in view' : 'Element is out of view'}
      </View>
    </View>
  );
};

const KeyPressExample = () => {
  const keyPressed = useKeyPress('a');
  return (
    <View>
      <View css={{ marginBottom: '10px' }}>Press the "a" key.</View>
      <View>
        {keyPressed ? '"a" key is pressed' : '"a" key is not pressed'}
      </View>
    </View>
  );
};

const MountExample = () => {
  const [mounted, setMounted] = React.useState(false);
  useMount(() => {
    setMounted(true);
  });
  return <View>{mounted ? 'Component has mounted' : 'Mounting...'}</View>;
};

const ScrollExample = () => {
  const { x, y, xProgress, yProgress } = useScroll();
  return (
    <View css={{ height: '200vh', padding: '20px', position: 'relative' }}>
      <View
        position="fixed"
        css={{
          top: 0,
          left: 0,
          backgroundColor: 'rgba(255,255,255,0.9)',
          padding: '10px',
          zIndex: 100,
          border: '1px solid #000',
        }}
      >
        Scroll Position - X: {x}, Y: {y} | Scroll Progress - X:{' '}
        {(xProgress * 100).toFixed(0)}%, Y: {(yProgress * 100).toFixed(0)}%
      </View>
      <View marginTop="40vh" padding="20px" backgroundColor="red">
        Scroll down to see more content.
      </View>
      <View marginTop="40vh" padding="20px" backgroundColor="blue">
        Scroll down to see more content.
      </View>
      <View marginTop="40vh" padding="20px" backgroundColor="green">
        Scroll down to see more content.
      </View>
    </View>
  );
};

const OnScreenExample = () => {
  const [ref, isOnScreen] = useOnScreen<HTMLDivElement>({ threshold: 0.5 });
  return (
    <View height="150vh">
      <View position="fixed">
        {isOnScreen ? 'Element is on screen' : 'Element is off screen'}
      </View>
      <View
        ref={ref}
        marginTop="90vh"
        backgroundColor="lightcoral"
        widthHeight={100}
      />
    </View>
  );
};

const WindowSizeExample = () => {
  const { width, height } = useWindowSize();
  return (
    <View>
      <View>
        Window Size: {width} x {height}
      </View>
    </View>
  );
};

const ResponsiveExample = () => {
  const responsive = useResponsive();
  return (
    <View>
      <View css={{ marginBottom: '10px' }}>Screen: {responsive.screen}</View>
      <View css={{ marginBottom: '10px' }}>
        Orientation: {responsive.orientation}
      </View>
      <View>Is mobile: {responsive.is('mobile').toString()}</View>
    </View>
  );
};

const meta: Meta = {
  title: 'Hooks',
};

export const ActiveHook: Story = () => <ActiveExample />;
export const ClickOutsideHook: Story = () => <ClickOutsideExample />;
export const FocusHook: Story = () => <FocusExample />;
export const HoverHook: Story = () => <HoverExample />;
export const InViewHook: Story = () => <InViewExample />;
export const KeyPressHook: Story = () => <KeyPressExample />;
export const MountHook: Story = () => <MountExample />;
export const ScrollHook: Story = () => <ScrollExample />;
export const OnScreenHook: Story = () => <OnScreenExample />;
export const WindowSizeHook: Story = () => <WindowSizeExample />;
export const ResponsiveHook: Story = () => <ResponsiveExample />;

export default meta;
