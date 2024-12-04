// Button.stories.ts|tsx

import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Input as $Input, Button, Text, View } from '../src/index';
import React, { useRef } from 'react';
import {
  useScroll,
  useScrollDirection,
  useSmoothScroll,
  useScrollAnimation,
} from '../src/hooks/useScroll';
import { slideInDown } from '../src/components/Animation';

const ScrollExample = () => {
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  const sectionTwoRef = useRef(null);
  const smoothScroll = useSmoothScroll();
  const scrollDirection = useScrollDirection(50);
  const { y, yProgress } = useScroll();

  const { isInView, progress } = useScrollAnimation(sectionRef, {
    threshold: [0, 0.5, 1],
  });

  return (
    <View ref={containerRef} height="200vh">
      {/* Header that changes based on scroll direction */}
      <View
        ref={sectionTwoRef}
        height="20vh"
        backgroundColor="color.blue.100"
      />
      <View
        position="fixed"
        top={0}
        left={0}
        right={0}
        backgroundColor="color.white"
        padding={4}
        animate={slideInDown({})}
        style={{
          transform: `translateY(${
            scrollDirection === 'down' ? '-100%' : '0'
          })`,
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        <Text>Scroll Progress: {(yProgress * 100).toFixed(0)}%</Text>
        <Text>Scroll y: {y} </Text>
      </View>

      <View height="100vh" backgroundColor="color.red.200" />

      {/* Scroll-animated section */}
      <View
        ref={sectionRef}
        height="50vh"
        backgroundColor="color.gray.100"
        style={{
          opacity: progress,
          transform: `scale(${0.5 + progress * 0.5})`,
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Text>
          {isInView ? 'Section is in view!' : 'Scroll down to see the section'}
        </Text>
      </View>

      {/* Smooth scroll button */}
      <Button
        position="fixed"
        bottom={4}
        right={4}
        onClick={() => smoothScroll(sectionTwoRef.current)}
      >
        Scroll to Section
      </Button>
    </View>
  );
};

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Scroll',
} as ComponentMeta<any>;

export const Scroll: ComponentStory<typeof $Input> = () => {
  return <ScrollExample />;
};
