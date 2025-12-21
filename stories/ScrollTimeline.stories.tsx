import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { View, Text, Vertical, Image, Button, Animation } from '../src';

export default {
  title: 'CSS/ScrollAnimation',
  component: View,
  parameters: {
    docs: {
      description: {
        component:
          'Demonstrates scroll-driven animations using animateOn="Scroll".',
      },
    },
  },
} as ComponentMeta<typeof View>;

const Kicker = ({ children }: { children: React.ReactNode }) => (
  <View
    backgroundColor="rgba(50, 203, 8, 0.1)"
    borderRadius={30}
    paddingHorizontal={16}
    paddingVertical={8}
    width="fit-content"
    border="1px solid rgba(50, 203, 8, 0.3)"
  >
    <Text color="#32CB08" fontSize={14} fontWeight="600" letterSpacing={1}>
      {children}
    </Text>
  </View>
);

const ImageCard = ({
  src,
  top,
  left,
  right,
  bottom,
  parallaxY,
  delay = 0,
}: any) => (
  <View
    position="absolute"
    top={top}
    left={left}
    right={right}
    bottom={bottom}
    width={240}
    height={300}
    borderRadius={24}
    overflow="hidden"
    boxShadow="0 20px 40px rgba(0,0,0,0.3)"
    animate={[
      {
        timeline: 'view()',
        keyframes: {
          from: { transform: 'translateY(0px)' },
          to: { transform: `translateY(${parallaxY}px)` },
        },
      },
      {
        duration: '3s',
        delay: `${delay}s`,
        iterationCount: 'infinite',
        direction: 'alternate',
        timingFunction: 'ease-in-out',
        keyframes: {
          from: { transform: 'translateY(-10px)' },
          to: { transform: 'translateY(10px)' },
        },
      },
    ]}
    style={{
      transition: 'transform 0.1s linear',
    }}
  >
    <Image src={src} width="100%" height="100%" objectFit="cover" />
  </View>
);

const ThoughtlyFooterContent = () => {
  // Sample images for the floating cards
  const cardImages = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=496&h=624&fit=crop',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=496&h=624&fit=crop',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=496&h=624&fit=crop',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=496&h=624&fit=crop',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=496&h=624&fit=crop',
  ];

  // Card positions (rotations and offsets)
  const cardPositions = [
    { rotate: -12, left: '5%' },
    { rotate: -6, left: '20%' },
    { rotate: 0, left: '38%' },
    { rotate: 6, left: '56%' },
    { rotate: 12, left: '74%' },
  ];

  return (
    <View height="300vh" backgroundColor="#000" position="relative">
      {/* Spacer content before the CTA */}
      <View height="100vh" backgroundColor="color.gray.900" padding={100}>
        <Text fontSize={48} fontWeight="bold" color="white" textAlign="center">
          Scroll down to see the <br /> Animation
        </Text>
        <Text color="color.gray.400" textAlign="center" marginTop={20}>
          The CTA section scales down from 1.0 to 0.8 and rounds its corners <br /> as you scroll, revealing the footer underneath.
        </Text>
      </View>

      {/* Container for the animated CTA and footer */}
      <View position="relative" height="200vh">
        {/* CTA Section - Animated wrapper that scales and rounds */}
        <View
          backgroundColor="rgb(246, 246, 244)"
          minHeight="100vh"
          position="sticky"
          top={0}
          zIndex={2}
          paddingTop={80}
          paddingHorizontal={80}
          paddingBottom={182}
          overflow="hidden"
          style={{ transformOrigin: '50% 100%' }}
          animate={{
            timeline: 'view()',
            range: 'exit 0% exit 100%',
            fillMode: 'both',
            keyframes: {
              from: {
                transform: 'translate3d(0px, 0px, 0px) scale(1, 1)',
                borderBottomRightRadius: '0px',
                borderBottomLeftRadius: '0px',
              },
              to: {
                transform: 'translate3d(0px, -18.5547px, 0px) scale(0.8, 0.8)',
                borderBottomRightRadius: '74px',
                borderBottomLeftRadius: '74px',
              },
            },
          }}
        >
          {/* CTA Inner Content */}
          <View maxWidth={1400} marginHorizontal="auto" width="100%">
            {/* Top Section - Text and Form */}
            <View
              display="flex"
              flexDirection="row"
              gap={48}
              marginBottom={64}
              flexWrap="wrap"
            >
              {/* Left - Headlines */}
              <View flex={1} minWidth={300}>
                {/* Kicker Badge */}
                <Kicker>Scale with Ease</Kicker>
                
                {/* Main Headline */}
                <Text
                  fontSize={60}
                  fontWeight="bold"
                  color="#1a1a1a"
                  lineHeight={1.1}
                  marginTop={24}
                >
                  Join the communication revolution.
                </Text>
              </View>

              {/* Right - Description and Form */}
              <View flex={1} minWidth={300} display="flex" flexDirection="column" gap={32}>
                <Text fontSize={18} color="#666666" lineHeight={1.6}>
                  Slash your costs and transform your customer experience. The generative AI revolution is here. Don't get left behind.
                </Text>
                
                {/* Email Input Form */}
                <View position="relative">
                  <View
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    backgroundColor="white"
                    borderRadius={50}
                    border="2px solid rgba(26, 26, 26, 0.1)"
                    paddingVertical={4}
                    paddingHorizontal={4}
                  >
                    <input
                      type="email"
                      placeholder="What is your work email?"
                      style={{
                        flex: 1,
                        padding: '16px 24px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        outline: 'none',
                        fontSize: '16px',
                        color: '#1a1a1a',
                      }}
                    />
                    <View
                      backgroundColor="#1a1a1a"
                      borderRadius={50}
                      paddingVertical={12}
                      paddingHorizontal={24}
                      cursor="pointer"
                      display="flex"
                      flexDirection="row"
                      alignItems="center"
                      gap={8}
                    >
                      <Text color="white" fontWeight="500">Get Started</Text>
                      <Text color="#32CB08">▶</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Bottom Section - Graph and Photo Cards */}
            <View position="relative" height={500} overflow="visible">
              {/* Green Gradient Graph Line */}
              <svg
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                }}
                viewBox="0 0 1400 400"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="graphGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#32CB08" stopOpacity="0.1" />
                    <stop offset="50%" stopColor="#32CB08" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#32CB08" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,350 Q200,320 400,280 T800,200 T1200,150 T1400,180"
                  fill="none"
                  stroke="url(#graphGradient)"
                  strokeWidth="3"
                />
                <path
                  d="M0,350 Q200,320 400,280 T800,200 T1200,150 T1400,180 L1400,400 L0,400 Z"
                  fill="url(#graphGradient)"
                  opacity="0.2"
                />
              </svg>

              {/* Graph Cover (reveal animation) */}
              <View
                position="absolute"
                bottom={0}
                right={0}
                height="100%"
                width="100%"
                backgroundColor="rgb(246, 246, 244)"
                style={{ transformOrigin: '100% 50%' }}
                animate={{
                  timeline: 'view()',
                  range: 'cover 0% cover 100%',
                  fillMode: 'both',
                  keyframes: {
                    from: { transform: 'translateX(0%) scaleX(1)' },
                    to: { transform: 'translateX(100%) scaleX(0)' },
                  },
                }}
              />

              {/* Floating Image Cards */}
              {cardImages.map((src, index) => {
                const pos = cardPositions[index];
                
                return (
                  <View
                    key={index}
                    position="absolute"
                    left={pos.left}
                    bottom="-60%"
                    width={200}
                    height={250}
                    borderRadius={24}
                    overflow="hidden"
                    boxShadow="0 20px 40px rgba(0,0,0,0.3)"
                    style={{
                      transform: `translateY(-90%) rotate(${pos.rotate}deg)`,
                    }}
                    animate={{
                      timeline: 'view()',
                      range: 'cover 0% cover 100%',
                      fillMode: 'both',
                      keyframes: {
                        from: { transform: `translateY(-90%) rotate(${pos.rotate}deg)` },
                        to: { transform: `translateY(${244.922 * (0.8 + index * 0.1) - 90}%) rotate(${pos.rotate}deg)` },
                      },
                    }}
                  >
                    <Image
                      src={src}
                      width="100%"
                      height="100%"
                      objectFit="cover"
                    />
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Footer - Sits behind and is revealed as CTA shrinks */}
        <View
          backgroundColor="#1a1a1a"
          paddingVertical={100}
          paddingHorizontal={80}
          minHeight="100vh"
        >
          <View maxWidth={1400} marginHorizontal="auto">
            <Vertical gap={64}>
              <View display="flex" flexDirection="row" justifyContent="space-between" flexWrap="wrap" gap={32}>
                <Vertical gap={24}>
                  <Text fontSize={32} fontWeight="bold" color="white">
                    Thoughtly
                  </Text>
                  <Text color="rgba(255,255,255,0.5)" maxWidth={300}>
                    Building the future of communication with human-like AI agents.
                  </Text>
                </Vertical>

                <View display="flex" flexDirection="row" gap={48} flexWrap="wrap">
                  <Vertical gap={16}>
                    <Text color="white" fontWeight="bold">Product</Text>
                    <Text color="rgba(255,255,255,0.5)">Features</Text>
                    <Text color="rgba(255,255,255,0.5)">Pricing</Text>
                    <Text color="rgba(255,255,255,0.5)">API</Text>
                  </Vertical>
                  <Vertical gap={16}>
                    <Text color="white" fontWeight="bold">Company</Text>
                    <Text color="rgba(255,255,255,0.5)">About</Text>
                    <Text color="rgba(255,255,255,0.5)">Careers</Text>
                    <Text color="rgba(255,255,255,0.5)">Blog</Text>
                  </Vertical>
                  <Vertical gap={16}>
                    <Text color="white" fontWeight="bold">Social</Text>
                    <Text color="rgba(255,255,255,0.5)">X (Twitter)</Text>
                    <Text color="rgba(255,255,255,0.5)">LinkedIn</Text>
                    <Text color="rgba(255,255,255,0.5)">Instagram</Text>
                  </Vertical>
                </View>
              </View>

              <View
                borderTop="1px solid rgba(255,255,255,0.1)"
                paddingTop={32}
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap={16}
              >
                <Text color="rgba(255,255,255,0.4)">
                  © {new Date().getFullYear()} Thoughtly, Inc
                </Text>
                <View display="flex" flexDirection="row" gap={24}>
                  <Text color="rgba(255,255,255,0.4)">Privacy Policy</Text>
                  <Text color="rgba(255,255,255,0.4)">Terms of Service</Text>
                </View>
              </View>
            </Vertical>
          </View>
        </View>
      </View>
    </View>
  );
};

export const ThoughtlyFooter: ComponentStory<typeof View> = () => {
  return <ThoughtlyFooterContent />;
};

export const ScrollTimeline: ComponentStory<typeof View> = () => {
  return (
    <Vertical gap={20} padding={20} height="100vh">
      <Text fontSize={24} fontWeight="bold">
        Scroll Timeline Animation
      </Text>
      <Text>Scroll down to see the progress bar animate.</Text>

      {/* Scroll container */}
      <View
        height={300}
        overflow="auto"
        border="1px solid #ccc"
        padding={20}
        position="relative"
      >
        {/* Progress Bar inside scroll container */}
        <View
          position="sticky"
          top={0}
          left={0}
          width="100%"
          height={8}
          backgroundColor="#ddd"
          marginBottom={20}
          zIndex={10}
        >
          <View
            height="100%"
            backgroundColor="color.blue.500"
            width="0%"
            animate={{
              timeline: 'scroll()',
              keyframes: {
                from: { width: '0%' },
                to: { width: '100%' },
              },
            }}
          />
        </View>

        <Text>Scroll Content Start</Text>
        <Vertical gap={50} paddingVertical={50}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <View
              key={i}
              padding={20}
              backgroundColor="#f5f5f5"
              borderRadius={8}
            >
              Item {i}
            </View>
          ))}
        </Vertical>
        <Text>Scroll Content End</Text>
      </View>
    </Vertical>
  );
};

