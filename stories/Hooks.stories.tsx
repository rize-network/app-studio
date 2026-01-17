import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Text, View, useResponsive } from '../src';
import { useActive } from '../src/hooks/useActive';
import { useClickOutside } from '../src/hooks/useClickOutside';
import { useElementPosition } from '../src/hooks/useElementPosition';
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
      <View ref={ref} backgroundColor="color-lightblue" margin="60vh">
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
      <View marginTop="40vh" padding="20px" backgroundColor="color-red">
        Scroll down to see more content.
      </View>
      <View marginTop="40vh" padding="20px" backgroundColor="color-blue">
        Scroll down to see more content.
      </View>
      <View marginTop="40vh" padding="20px" backgroundColor="color-green">
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
        backgroundColor="color-lightcoral"
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
  const media = {
    xs: {
      color: 'red',
    },
    sm: {
      color: 'green',
    },
    md: {
      color: 'blue',
    },
    lg: {
      color: 'yellow',
    },
    xl: {
      color: 'red',
    },
  };

  return (
    <View>
      <View css={{ marginBottom: '10px' }}>Screen: {responsive.screen}</View>
      <View css={{ marginBottom: '10px' }}>
        Orientation: {responsive.orientation}
      </View>
      <Text widthHeight={100} lineHeight={20} media={media}>
        {`${responsive.screen} - ${responsive.on('mobile') ? 'Mobile' : 'Not Mobile'}`}
      </Text>
      <View>Is mobile: {responsive.is('mobile').toString()}</View>
    </View>
  );
};

// Individual corner component
const CornerElement = ({
  corner,
  style,
}: {
  corner: string;
  style: React.CSSProperties;
}) => {
  const { ref, relation, updateRelation } = useElementPosition();
  const [showTooltip, setShowTooltip] = React.useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleClick = () => {
    updateRelation(); // Manually update position
  };

  // Determine tooltip placement based on available space
  const getTooltipStyle = (): React.CSSProperties => {
    if (!relation) return { display: 'none' };

    const baseStyle: React.CSSProperties = {
      position: 'fixed',
      zIndex: 1000,
      pointerEvents: 'none',
    };

    // Place tooltip where there's more space
    if (relation.space.vertical === 'top') {
      return {
        ...baseStyle,
        bottom: '100%',
        marginBottom: '8px',
        left: '50%',
        transform: 'translateX(-50%)',
      };
    } else {
      return {
        ...baseStyle,
        top: '100%',
        marginTop: '8px',
        left: '50%',
        transform: 'translateX(-50%)',
      };
    }
  };

  return (
    <>
      <View
        ref={ref}
        width={120}
        height={80}
        backgroundColor="color-blue-500"
        color="color-white"
        borderRadius={8}
        padding={12}
        cursor="pointer"
        position="absolute"
        css={{
          ...style,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
          fontSize: '12px',
          fontWeight: 'bold',
        }}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div>{corner}</div>
        <div style={{ fontSize: '10px', marginTop: '4px', opacity: 0.8 }}>
          {relation
            ? `${relation.position.vertical}-${relation.position.horizontal}`
            : 'Loading...'}
        </div>
        <div style={{ fontSize: '9px', marginTop: '2px', opacity: 0.6 }}>
          {relation
            ? `Space: ${relation.space.vertical}-${relation.space.horizontal}`
            : ''}
        </div>
      </View>

      {/* Tooltip */}
      {showTooltip && relation && (
        <View
          style={getTooltipStyle()}
          backgroundColor="color-gray-900"
          color="color-white"
          borderRadius={4}
          padding={6}
          fontSize="xs"
          whiteSpace="nowrap"
        >
          More space: {relation.space.vertical}-{relation.space.horizontal}
        </View>
      )}
    </>
  );
};

// Simple element for scrollable container demo
const ScrollableElement = ({
  label,
  style,
}: {
  label: string;
  style: React.CSSProperties;
}) => {
  const { ref, relation, updateRelation } = useElementPosition();
  const [showInfo, setShowInfo] = React.useState(false);

  const handleClick = () => {
    updateRelation();
    setShowInfo(!showInfo);
  };

  return (
    <>
      <View
        ref={ref}
        width={100}
        height={60}
        backgroundColor="color-green-500"
        color="color-white"
        borderRadius={6}
        padding={8}
        cursor="pointer"
        position="absolute"
        css={{
          ...style,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
          fontSize: '10px',
          fontWeight: 'bold',
        }}
        onClick={handleClick}
      >
        <div>{label}</div>
        <div style={{ fontSize: '8px', marginTop: '2px', opacity: 0.8 }}>
          {relation
            ? `${relation.position.vertical}-${relation.position.horizontal}`
            : 'Loading...'}
        </div>
        <div style={{ fontSize: '7px', marginTop: '1px', opacity: 0.6 }}>
          {relation
            ? `Space: ${relation.space.vertical}-${relation.space.horizontal}`
            : ''}
        </div>
      </View>

      {/* Info popup */}
      {showInfo && relation && (
        <View
          position="fixed"
          left="50%"
          top="50%"
          css={{ transform: 'translate(-50%, -50%)' }}
          width={200}
          backgroundColor="color-white"
          boxShadow="xl"
          borderRadius={8}
          padding={12}
          zIndex={1000}
          border="1px solid"
          borderColor="color-gray-300"
        >
          <View fontSize="sm" fontWeight="bold" marginBottom={4}>
            {label} Position Info
          </View>
          <View fontSize="xs" color="color-gray-600" marginBottom={2}>
            Position: {relation.position.vertical}-
            {relation.position.horizontal}
          </View>
          <View fontSize="xs" color="color-gray-600">
            More space: {relation.space.vertical}-{relation.space.horizontal}
          </View>
        </View>
      )}
    </>
  );
};

// Simple basic example
const BasicElementPositionExample = () => {
  const { ref, relation, updateRelation } = useElementPosition();

  return (
    <View
      height="300px"
      width="100%"
      backgroundColor="color-gray.50"
      padding={20}
      position="relative"
    >
      <View
        fontSize="lg"
        fontWeight="bold"
        marginBottom={16}
        color="color-gray-700"
      >
        Basic useElementPosition Example (Hover Enabled)
      </View>

      <View
        ref={ref}
        width={200}
        height={100}
        backgroundColor="color-blue-500"
        color="color-white"
        borderRadius={8}
        padding={16}
        cursor="pointer"
        position="absolute"
        top="50%"
        left="50%"
        css={{
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.2s ease',
        }}
        onClick={updateRelation}
        _hover={{
          backgroundColor: 'color-blue-600',
        }}
      >
        <View fontSize="sm" fontWeight="bold" marginBottom={8}>
          Hover or Click Me
        </View>
        {relation ? (
          <View fontSize="xs" textAlign="center">
            <div>
              Position: {relation.position.vertical}-
              {relation.position.horizontal}
            </div>
            <div>
              More space: {relation.space.vertical}-{relation.space.horizontal}
            </div>
          </View>
        ) : (
          <View fontSize="xs">Loading...</View>
        )}
      </View>

      <View
        position="absolute"
        bottom={10}
        left={10}
        fontSize="xs"
        color="color-gray-600"
        backgroundColor="color-white"
        padding={8}
        borderRadius={4}
        border="1px solid"
        borderColor="color-gray-200"
      >
        Hover tracking enabled by default. Position updates on hover
        automatically.
      </View>
    </View>
  );
};

// Example with configurable events
const ConfigurableEventsExample = () => {
  const hoverOnly = useElementPosition(); // Default: hover only
  const allEvents = useElementPosition({
    trackOnHover: true,
    trackOnScroll: true,
    trackOnResize: true,
    throttleMs: 50,
  });
  const noEvents = useElementPosition({
    trackChanges: false, // Manual only
  });

  return (
    <View
      height="400px"
      width="100%"
      backgroundColor="color-gray.50"
      padding={20}
    >
      <View
        fontSize="lg"
        fontWeight="bold"
        marginBottom={16}
        color="color-gray-700"
      >
        Configurable Events Demo
      </View>

      <View display="flex" gap={20} flexWrap="wrap">
        {/* Hover only (default) */}
        <View flex={1} minWidth={200}>
          <View fontSize="sm" fontWeight="bold" marginBottom={8}>
            Hover Only (Default)
          </View>
          <View
            ref={hoverOnly.ref}
            height={100}
            backgroundColor="color-blue-500"
            color="color-white"
            borderRadius={8}
            padding={12}
            cursor="pointer"
            css={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View fontSize="xs" textAlign="center">
              {hoverOnly.relation ? (
                <>
                  <div>
                    Pos: {hoverOnly.relation.position.vertical}-
                    {hoverOnly.relation.position.horizontal}
                  </div>
                  <div>
                    Space: {hoverOnly.relation.space.vertical}-
                    {hoverOnly.relation.space.horizontal}
                  </div>
                </>
              ) : (
                'Hover me!'
              )}
            </View>
          </View>
        </View>

        {/* All events */}
        <View flex={1} minWidth={200}>
          <View fontSize="sm" fontWeight="bold" marginBottom={8}>
            All Events (Hover + Scroll + Resize)
          </View>
          <View
            ref={allEvents.ref}
            height={100}
            backgroundColor="color-green-500"
            color="color-white"
            borderRadius={8}
            padding={12}
            cursor="pointer"
            css={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View fontSize="xs" textAlign="center">
              {allEvents.relation ? (
                <>
                  <div>
                    Pos: {allEvents.relation.position.vertical}-
                    {allEvents.relation.position.horizontal}
                  </div>
                  <div>
                    Space: {allEvents.relation.space.vertical}-
                    {allEvents.relation.space.horizontal}
                  </div>
                </>
              ) : (
                'Hover, scroll, or resize!'
              )}
            </View>
          </View>
        </View>

        {/* Manual only */}
        <View flex={1} minWidth={200}>
          <View fontSize="sm" fontWeight="bold" marginBottom={8}>
            Manual Only
          </View>
          <View
            ref={noEvents.ref}
            height={100}
            backgroundColor="color-orange-500"
            color="color-white"
            borderRadius={8}
            padding={12}
            cursor="pointer"
            css={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={noEvents.updateRelation}
          >
            <View fontSize="xs" textAlign="center">
              {noEvents.relation ? (
                <>
                  <div>
                    Pos: {noEvents.relation.position.vertical}-
                    {noEvents.relation.position.horizontal}
                  </div>
                  <div>
                    Space: {noEvents.relation.space.vertical}-
                    {noEvents.relation.space.horizontal}
                  </div>
                </>
              ) : (
                'Click to update!'
              )}
            </View>
          </View>
        </View>
      </View>

      <View fontSize="xs" color="color-gray-500" marginTop={12}>
        Blue: Hover tracking only (default) | Green: All events enabled |
        Orange: Manual updates only
      </View>
    </View>
  );
};

const ElementPositionExample = () => {
  return (
    <View
      height="500px"
      width="100%"
      backgroundColor="color-gray.50"
      padding={20}
    >
      <View
        fontSize="lg"
        fontWeight="bold"
        marginBottom={16}
        color="color-gray-700"
      >
        useElementPosition Demo - Viewport Relation Detection
      </View>

      <View display="flex" gap={20} height="400px">
        {/* Viewport positioning demo */}
        <View flex={1}>
          <View
            fontSize="sm"
            fontWeight="bold"
            marginBottom={8}
            color="color-gray-600"
          >
            Viewport Position Detection
          </View>
          <View
            height="300px"
            position="relative"
            backgroundColor="color-blue.50"
            borderRadius={8}
            border="2px solid"
            borderColor="color-blue-200"
          >
            <CornerElement corner="TOP LEFT" style={{ top: 10, left: 10 }} />
            <CornerElement corner="TOP RIGHT" style={{ top: 10, right: 10 }} />
            <CornerElement
              corner="BOTTOM LEFT"
              style={{ bottom: 10, left: 10 }}
            />
            <CornerElement
              corner="BOTTOM RIGHT"
              style={{ bottom: 10, right: 10 }}
            />
          </View>
        </View>

        {/* Scrollable container demo */}
        <View flex={1}>
          <View
            fontSize="sm"
            fontWeight="bold"
            marginBottom={8}
            color="color-gray-600"
          >
            Scrollable Content Demo
          </View>
          <View
            height="300px"
            position="relative"
            backgroundColor="color-green.50"
            borderRadius={8}
            border="2px solid"
            borderColor="color-green-200"
            css={{
              overflow: 'auto',
            }}
          >
            {/* Large content area to enable scrolling */}
            <View width="600px" height="600px" position="relative">
              <ScrollableElement
                label="TOP LEFT"
                style={{ top: 20, left: 20 }}
              />
              <ScrollableElement
                label="TOP RIGHT"
                style={{ top: 20, right: 20 }}
              />
              <ScrollableElement
                label="CENTER"
                style={{ top: 200, left: 250 }}
              />
              <ScrollableElement
                label="BOTTOM LEFT"
                style={{ bottom: 20, left: 20 }}
              />
              <ScrollableElement
                label="BOTTOM RIGHT"
                style={{ bottom: 20, right: 20 }}
              />

              {/* Scroll indicator */}
              <View
                position="absolute"
                top="50%"
                left="50%"
                css={{
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                }}
              >
                <View fontSize="sm" color="color-gray-500" marginBottom={4}>
                  Scroll to see position updates
                </View>
                <View fontSize="xs" color="color-gray-400">
                  Click elements for position info
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View fontSize="xs" color="color-gray-500" marginTop={12}>
        Left: Hover for tooltips, click to update | Right: Click elements for
        position details
      </View>
    </View>
  );
};

const meta: Meta = {
  title: 'Hooks',
};

export const ActiveHook: Story = () => <ActiveExample />;
export const ClickOutsideHook: Story = () => <ClickOutsideExample />;
export const ElementPositionBasicHook: Story = () => (
  <BasicElementPositionExample />
);
export const ElementPositionConfigurableHook: Story = () => (
  <ConfigurableEventsExample />
);
export const ElementPositionHook: Story = () => <ElementPositionExample />;
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
