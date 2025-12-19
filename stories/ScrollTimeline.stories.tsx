import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { View, Text, Vertical, Image, Button } from '../src';

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
  // Images generated earlier
  const images = [
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop', // Business woman
    'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2670&auto=format&fit=crop', // Team working
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop', // Digital connectivity
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2670&auto=format&fit=crop', // Tech specialist
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop', // Cybersecurity/Tech
  ];

  return (
    <View
      height="100vh"
      overflow="auto"
      backgroundColor="#000"
      position="relative"
    >
      {/* Spacer to enable scroll */}
      <View height="100vh" backgroundColor="color.gray.900" padding={100}>
        <Text fontSize={48} fontWeight="bold" color="white" textAlign="center">
          Scroll down to see the <br /> Final CTA Merge Animation
        </Text>
        <Text color="color.gray.400" textAlign="center" marginTop={20}>
          As you reach the bottom, the section will scale down <br /> and round
          its corners to merge with the footer.
        </Text>
      </View>

      <View position="relative" backgroundColor="red">
        {/* The Final CTA Wrapper that merges into the footer */}
        <View
         
          backgroundColor="red"
          minHeight="100vh"
          position="relative"
          zIndex={2}
          overflow="hidden"
          padding={80}
          display="flex"
          alignItems="center"
          justifyContent="center"
          style={{ 
            transformOrigin: '50% 100%',
            margin: '0 auto' 
          }}
           animate={{
            // Use 'contain' range to animate as it hits the bottom
            timingFunction: 'ease',
            timeline: 'scroll()',
            range: 'cover',
    // range: 'contain 0% exit 100%',
            fillMode: 'both',
            keyframes: {
              '0%': {
                transform: 'scale(1)',
                borderRadius: '0px',
                width: '100%',
              },
              '100%': {
                // Shrink width and animate all corners as specified
                transform: 'scale(0.8)',
                borderRadius: '300px',
                width: '94%',
              },
            },
          }}
        >
          {/* Photos Panel / Parallax Cards */}
          <View
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            pointerEvents="none"
          >
            <ImageCard
              src={images[0]}
              top="10%"
              left="5%"
              parallaxY={-100}
              delay={0}
            />
            <ImageCard
              src={images[1]}
              top="20%"
              right="8%"
              parallaxY={-150}
              delay={0.5}
            />
            <ImageCard
              src={images[2]}
              bottom="15%"
              left="12%"
              parallaxY={-80}
              delay={1}
            />
            <ImageCard
              src={images[3]}
              bottom="25%"
              right="15%"
              parallaxY={-120}
              delay={1.5}
            />
            <ImageCard
              src={images[4]}
              top="50%"
              left="30%"
              parallaxY={-200}
              delay={2}
            />
          </View>

          {/* Content */}
          <Vertical
            gap={32}
            alignItems="center"
            maxWidth={800}
            position="relative"
            zIndex={3}
          >
            <Kicker>Scale with Ease</Kicker>
            <Text
              fontSize={72}
              fontWeight="bold"
              color="white"
              textAlign="center"
              lineHeight={1.1}
            >
              Join the communication revolution.
            </Text>
            <Text
              fontSize={20}
              color="color.gray.400"
              textAlign="center"
              maxWidth={600}
            >
              Slash your costs and transform your customer experience. The
              generative AI revolution is here. Don't get left behind.
            </Text>

            <View
              backgroundColor="white"
              borderRadius={100}
              padding={8}
              paddingLeft={24}
              width="100%"
              maxWidth={500}
              display="flex"
              flexDirection="row"
              alignItems="center"
              gap={16}
              border="1px solid rgba(255,255,255,0.1)"
              style={{ backdropFilter: 'blur(10px)' }}
            >
              <Text color="#666" flex={1}>
                What is your work email?
              </Text>
              <Button
                backgroundColor="#32CB08"
                borderRadius={100}
                paddingHorizontal={24}
                paddingVertical={12}
                onPress={() => {}}
              >
                <Text color="black" fontWeight="bold">
                  Get Started
                </Text>
              </Button>
            </View>
          </Vertical>

          {/* Background Graph Line */}
          <View
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            height={300}
            pointerEvents="none"
            opacity={0.5}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 1000 200"
              preserveAspectRatio="none"
            >
              <path
                d="M0 150 Q 250 50 500 150 T 1000 150"
                stroke="#32CB08"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </View>
        </View>

        {/* The Reveal Footer - This footer is "sticky" or fixed behind the CTA */}
        <View
          backgroundColor="black"
          paddingVertical={100}
          paddingHorizontal={80}
          position="sticky"
          bottom={0}
          zIndex={1}
        >
          <Vertical gap={64}>
            <View display="flex" flexDirection="row" justifyContent="space-between" width="100%">
              <Vertical gap={24}>
                <Text fontSize={32} fontWeight="bold" color="white">
                  Thoughtly
                </Text>
                <Text color="color.gray.500" maxWidth={300}>
                  Building the future of communication with human-like AI agents.
                </Text>
              </Vertical>

              <View display="flex" flexDirection="row" gap={48}>
                <Vertical gap={16}>
                  <Text color="white" fontWeight="bold">Product</Text>
                  <Text color="color.gray.500">Features</Text>
                  <Text color="color.gray.500">Pricing</Text>
                  <Text color="color.gray.500">API</Text>
                </Vertical>
                <Vertical gap={16}>
                  <Text color="white" fontWeight="bold">Company</Text>
                  <Text color="color.gray.500">About</Text>
                  <Text color="color.gray.500">Careers</Text>
                  <Text color="color.gray.500">Blog</Text>
                </Vertical>
                <Vertical gap={16}>
                  <Text color="white" fontWeight="bold">Social</Text>
                  <Text color="color.gray.500">X (Twitter)</Text>
                  <Text color="color.gray.500">LinkedIn</Text>
                  <Text color="color.gray.500">Instagram</Text>
                </Vertical>
              </View>
            </View>

            <View
              borderTop="1px solid #333"
              paddingTop={32}
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Text color="color.gray.600">
                © 2024 Thoughtly AI. All rights reserved.
              </Text>
              <View display="flex" flexDirection="row" gap={24}>
                <Text color="color.gray.600">Privacy Policy</Text>
                <Text color="color.gray.600">Terms of Service</Text>
              </View>
            </View>
          </Vertical>
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

