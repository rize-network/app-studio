// Button.stories.ts|tsx

import { ComponentStory, ComponentMeta } from '@storybook/react';

import {
  Input as $Input,
  Animation,
  Button,
  Text,
  Vertical,
  View,
} from '../src/index';
import React, { useRef } from 'react';
import {
  useScroll,
  useScrollDirection,
  useSmoothScroll,
  useScrollAnimation,
} from '../src/hooks/useScroll';

const ScrollExample = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const sectionTwoRef = useRef<HTMLDivElement>(null);
  const smoothScroll = useSmoothScroll();
  const scrollDirection = useScrollDirection(10);
  const scroll = useScroll();
  // const scroll = useScroll();

  const { isInView, progress } = useScrollAnimation(sectionRef, {
    threshold: [0, 0.5, 1],
  });

  console.log('isInView', isInView);
  console.log('progress', progress);
  console.log('scrollDirection', scrollDirection);
  console.log('scroll', scroll);
  return (
    <View
      ref={containerRef}
      style={{
        height: '200vh',
        position: 'relative',
        overflowY: 'scroll', // Enable scrolling
      }}
    >
      {/* Section Two: Target for Smooth Scroll */}
      <View
        ref={sectionTwoRef}
        style={{
          height: '20vh',
          backgroundColor: '#ADD8E6', // Light Blue
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
        }}
      />
      {/* Header that changes based on scroll direction */}
      <View
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: '#FFFFFF',
          padding: '16px',
          transform: `translateY(${
            scrollDirection === 'down' ? '-100%' : '0'
          })`,
          transition: 'transform 0.3s ease-in-out',
          zIndex: 1000, // Ensure the header stays on top
        }}
      >
        <Text>Scroll Progress: {(scroll.yProgress * 100).toFixed(0)}%</Text>
        <Text>Scroll y: {scroll.y} </Text>
      </View>
      {/* Spacer to enable scrolling */}
      <View style={{ height: '100vh', backgroundColor: '#F08080' }} />{' '}
      {/* Light Coral */}
      {/* Scroll-animated section */}
      <View
        ref={sectionRef}
        style={{
          height: '50vh',
          backgroundColor: '#D3D3D3', // Light Gray
          opacity: progress,
          transform: `scale(${0.5 + progress * 0.5})`,
          transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text>
          {isInView ? 'Section is in view!' : 'Scroll down to see the section'}
        </Text>
      </View>
      {/* Smooth scroll button */}
      <Button
        style={{
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          padding: '8px 16px',
          backgroundColor: '#007BFF', // Bootstrap Blue
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
        onClick={() => smoothScroll(sectionTwoRef.current)}
      >
        Scroll to Section
      </Button>
    </View>
  );
};

export const AnimatedComponent: React.FC = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  const { progress } = useScrollAnimation(elementRef, {
    threshold: [0, 0.25, 0.5, 0.75, 1], // Get more granular progress updates
  });

  return (
    <View>
      <View
        ref={elementRef}
        style={{
          opacity: progress, // Directly tie opacity to scroll progress
          transition: 'opacity 0.5s ease-out', // Add a smooth transition
        }}
        backgroundColor="color.blue"
        color="color.white"
      >
        This content will fade in as you scroll.
      </View>
      <View height={'200vh'} />
    </View>
  );
};

const Card = ({ tag, title, description }) => (
  <View
    backgroundColor="color.gray.800"
    borderRadius={16}
    overflow="hidden"
    minHeight={414}
    width="100%"
  >
    <View
      backgroundColor="color.yellow.300"
      color="color.gray.800"
      padding={8}
      borderRadius={30}
      width="fit-content"
    >
      <Text>{tag}</Text>
    </View>

    <View>
      <Text>{title}</Text>
      <Text size="lg">{description}</Text>
    </View>
  </View>
);

export const AnimatedCards = () => {
  const cards = [
    {
      tag: 'Radar',
      title: "Détection d'opportunités",
      description: 'Consultez une liste exhaustive de toutes les opportunités',
    },
    {
      tag: 'Assistant',
      title: 'Génération de dossiers',
      description: 'Créez automatiquement une candidature de haute qualité',
    },
    {
      tag: 'Dataroom',
      title: 'Gestion des données',
      description: 'Centralisez vos documents importants',
    },
  ];

  return (
    <View backgroundColor="color.gray.900" minHeight="100vh" padding={32}>
      <Vertical gap={48}>
        {cards.map((card, index) => (
          <View key={index} position="sticky" top={32}>
            <Card {...card} />
          </View>
        ))}
      </Vertical>
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
