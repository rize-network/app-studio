import React from 'react';
import { Meta, Story } from '@storybook/react';
import { View, useResponsive } from '../src';
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
      <View ref={ref} backgroundColor="color.lightblue" margin="60vh">
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
      <View marginTop="40vh" padding="20px" backgroundColor="color.red">
        Scroll down to see more content.
      </View>
      <View marginTop="40vh" padding="20px" backgroundColor="color.blue">
        Scroll down to see more content.
      </View>
      <View marginTop="40vh" padding="20px" backgroundColor="color.green">
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
        backgroundColor="color.lightcoral"
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

// Individual corner component
const CornerElement = ({
  corner,
  style,
}: {
  corner: string;
  style: React.CSSProperties;
}) => {
  const { ref, position, helpers } = useElementPosition();
  const [activeOverlay, setActiveOverlay] = React.useState<string | null>(null);

  const handleInteraction = (type: string) => {
    setActiveOverlay(activeOverlay === type ? null : type);
  };

  const contextMenuPosition = helpers.getContextMenuPosition(180, 100);
  const tooltipPosition = helpers.getTooltipPosition(120, 32);
  const dropdownPosition = helpers.getDropdownPosition(160, 80);

  return (
    <>
      <View
        ref={ref}
        width={120}
        height={80}
        backgroundColor="color.blue.500"
        color="color.white"
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
        onClick={() => handleInteraction('dropdown')}
        onContextMenu={(e: React.MouseEvent) => {
          e.preventDefault();
          handleInteraction('context');
        }}
        onMouseEnter={() => handleInteraction('tooltip')}
        onMouseLeave={() => setActiveOverlay(null)}
      >
        <div>{corner}</div>
        <div style={{ fontSize: '10px', marginTop: '4px', opacity: 0.8 }}>
          {position
            ? `${Math.round(position.x)}, ${Math.round(position.y)}`
            : 'Loading...'}
        </div>
      </View>

      {/* Context Menu */}
      {activeOverlay === 'context' && (
        <View
          position="fixed"
          left={contextMenuPosition.x}
          top={contextMenuPosition.y}
          width={180}
          height={100}
          backgroundColor="color.white"
          boxShadow="xl"
          borderRadius={8}
          padding={12}
          zIndex={1000}
          border="1px solid"
          borderColor="color.gray.300"
        >
          <View fontSize="sm" fontWeight="bold" marginBottom={4}>
            Context Menu
          </View>
          <View fontSize="xs" color="color.gray.600" marginBottom={2}>
            Placement: {contextMenuPosition.placement}
          </View>
          <View fontSize="xs" color="color.blue.600">
            Auto-positioned to stay in viewport
          </View>
        </View>
      )}

      {/* Tooltip */}
      {activeOverlay === 'tooltip' && (
        <View
          position="fixed"
          left={tooltipPosition.x}
          top={tooltipPosition.y}
          width={120}
          height={32}
          backgroundColor="color.gray.900"
          color="color.white"
          borderRadius={4}
          padding={6}
          fontSize="xs"
          zIndex={1000}
          css={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {tooltipPosition.placement} tooltip
        </View>
      )}

      {/* Dropdown */}
      {activeOverlay === 'dropdown' && (
        <View
          position="fixed"
          left={dropdownPosition.x}
          top={dropdownPosition.y}
          width={160}
          height={80}
          backgroundColor="color.white"
          boxShadow="lg"
          borderRadius={8}
          padding={8}
          zIndex={1000}
          border="1px solid"
          borderColor="color.gray.200"
        >
          <View fontSize="sm" fontWeight="bold" marginBottom={4}>
            Dropdown ({dropdownPosition.placement})
          </View>
          <View fontSize="xs" color="color.gray.600">
            Smart positioning prevents overflow
          </View>
        </View>
      )}
    </>
  );
};

// Scrollable container element
const ScrollableElement = ({
  label,
  style,
  scrollContainerRef,
}: {
  label: string;
  style: React.CSSProperties;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}) => {
  const { ref, position, helpers } = useElementPosition({
    scrollContainer: scrollContainerRef,
    useFixedPositioning: false, // Use absolute positioning within container
  });
  const [activeOverlay, setActiveOverlay] = React.useState<string | null>(null);

  const handleInteraction = (type: string) => {
    setActiveOverlay(activeOverlay === type ? null : type);
  };

  const contextMenuPosition = helpers.getContextMenuPosition(160, 80);
  const tooltipPosition = helpers.getTooltipPosition(100, 28);
  const availableSpace = helpers.getAvailableSpace();

  return (
    <>
      <View
        ref={ref}
        width={100}
        height={60}
        backgroundColor="color.green.500"
        color="color.white"
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
        onClick={() => handleInteraction('context')}
        onMouseEnter={() => handleInteraction('tooltip')}
        onMouseLeave={() => setActiveOverlay(null)}
      >
        <div>{label}</div>
        <div style={{ fontSize: '8px', marginTop: '2px', opacity: 0.8 }}>
          {position
            ? `${Math.round(position.x)}, ${Math.round(position.y)}`
            : 'Loading...'}
        </div>
        <div style={{ fontSize: '7px', marginTop: '1px', opacity: 0.6 }}>
          Space: T{Math.round(availableSpace.top)} R
          {Math.round(availableSpace.right)} B
          {Math.round(availableSpace.bottom)} L{Math.round(availableSpace.left)}
        </div>
      </View>

      {/* Context Menu */}
      {activeOverlay === 'context' && (
        <View
          position="absolute"
          left={contextMenuPosition.x}
          top={contextMenuPosition.y}
          width={160}
          height={80}
          backgroundColor="color.white"
          boxShadow="lg"
          borderRadius={6}
          padding={8}
          zIndex={1000}
          border="1px solid"
          borderColor="color.gray.300"
        >
          <View fontSize="xs" fontWeight="bold" marginBottom={2}>
            Menu ({contextMenuPosition.placement})
          </View>
          <View fontSize="xs" color="color.gray.600" marginBottom={1}>
            Optimal placement based on space
          </View>
          <View fontSize="xs" color="color.gray.500">
            Available:{' '}
            {Math.round(
              contextMenuPosition.availableSpace[contextMenuPosition.placement]
            )}
            px
          </View>
        </View>
      )}

      {/* Tooltip */}
      {activeOverlay === 'tooltip' && (
        <View
          position="absolute"
          left={tooltipPosition.x}
          top={tooltipPosition.y}
          width={100}
          height={28}
          backgroundColor="color.gray.900"
          color="color.white"
          borderRadius={4}
          padding={4}
          fontSize="xs"
          zIndex={1000}
          css={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {tooltipPosition.placement}
        </View>
      )}
    </>
  );
};

const ElementPositionExample = () => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  return (
    <View
      height="500px"
      width="100%"
      backgroundColor="color.gray.50"
      padding={20}
    >
      <View
        fontSize="lg"
        fontWeight="bold"
        marginBottom={16}
        color="color.gray.700"
      >
        useElementPosition Demo - Scrollable Container
      </View>

      <View display="flex" gap={20} height="400px">
        {/* Fixed viewport demo */}
        <View flex={1}>
          <View
            fontSize="sm"
            fontWeight="bold"
            marginBottom={8}
            color="color.gray.600"
          >
            Fixed Viewport Positioning
          </View>
          <View
            height="300px"
            position="relative"
            backgroundColor="color.blue.50"
            borderRadius={8}
            border="2px solid"
            borderColor="color.blue.200"
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
            color="color.gray.600"
          >
            Scrollable Container Positioning
          </View>
          <View
            ref={scrollContainerRef}
            height="300px"
            position="relative"
            backgroundColor="color.green.50"
            borderRadius={8}
            border="2px solid"
            borderColor="color.green.200"
            css={{
              overflow: 'auto',
            }}
          >
            {/* Large content area to enable scrolling */}
            <View width="600px" height="600px" position="relative">
              <ScrollableElement
                label="TOP LEFT"
                style={{ top: 20, left: 20 }}
                scrollContainerRef={scrollContainerRef}
              />
              <ScrollableElement
                label="TOP RIGHT"
                style={{ top: 20, right: 20 }}
                scrollContainerRef={scrollContainerRef}
              />
              <ScrollableElement
                label="CENTER"
                style={{ top: 200, left: 250 }}
                scrollContainerRef={scrollContainerRef}
              />
              <ScrollableElement
                label="BOTTOM LEFT"
                style={{ bottom: 20, left: 20 }}
                scrollContainerRef={scrollContainerRef}
              />
              <ScrollableElement
                label="BOTTOM RIGHT"
                style={{ bottom: 20, right: 20 }}
                scrollContainerRef={scrollContainerRef}
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
                <View fontSize="sm" color="color.gray.500" marginBottom={4}>
                  Scroll to see positioning in action
                </View>
                <View fontSize="xs" color="color.gray.400">
                  Click elements for context menus
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View fontSize="xs" color="color.gray.500" marginTop={12}>
        Left: Fixed viewport positioning | Right: Container-relative positioning
        with scroll support
      </View>
    </View>
  );
};

const meta: Meta = {
  title: 'Hooks',
};

export const ActiveHook: Story = () => <ActiveExample />;
export const ClickOutsideHook: Story = () => <ClickOutsideExample />;
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
