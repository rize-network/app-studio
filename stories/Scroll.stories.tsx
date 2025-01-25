// Button.stories.ts|tsx

import { ComponentStory, ComponentMeta } from '@storybook/react';

import {
  Input as $Input,
  Button,
  Horizontal,
  Image,
  Text,
  Vertical,
  View,
} from '../src/index';
import React, { useEffect, useRef } from 'react';
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
  const scrollDirection = useScrollDirection(300);
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

const Card = ({ title, description, image, tag }) => (
  <Horizontal
    minHeight="414px"
    width="100%"
    backgroundColor="#2D2D2D"
    borderRadius={16}
    overflow="hidden"
    style={{ color: '#FFFFFF' }}
    padding={24}
  >
    <Vertical width="50%" justifyContent="space-between" gap={24}>
      <View
        backgroundColor="#FACC15"
        color="#111111"
        paddingLeft={12}
        paddingTop={8}
        borderRadius={999}
        style={{ fontWeight: '500' }}
      >
        {tag}
      </View>
      <Vertical gap={16}>
        <View style={{ fontSize: '3rem', fontWeight: '600', lineHeight: 1.2 }}>
          {title}
        </View>
        <View style={{ fontSize: '1rem' }}>{description}</View>
      </Vertical>
    </Vertical>
    <Image
      src={image}
      alt="Feature"
      objectFit="cover"
      width="100%"
      height="100%"
    />
  </Horizontal>
);

export const StickyComponent: React.FC = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as any).style.transform = 'translateY(0)';
            (entry.target as any).style.opacity = '1';
          } else {
            (entry.target as any).style.transform = 'translateY(50px)';
            (entry.target as any).style.opacity = '0';
          }
        });
      },
      { threshold: 0.1 }
    );
    const cards = (containerRef.current as any).querySelectorAll('.card');
    cards.forEach((card) => {
      card.style.transition = 'all 0.6s ease-out';
      observer.observe(card);
    });
    return () => observer.disconnect();
  }, []);

  const cardsData = [
    {
      tag: 'Radar',
      title: "Détection d'opportunités",
      description: 'Consultez une liste exhaustive de toutes les opportunités',
      image: '/api/placeholder/400/320',
    },
    {
      tag: 'Assistant',
      title: 'Génération de dossiers',
      description: 'Créez automatiquement une candidature de haute qualité',
      image: '/api/placeholder/400/320',
    },
    {
      tag: 'Dataroom',
      title: 'Gestion des données',
      description: 'Centralisez vos documents importants',
      image: '/api/placeholder/400/320',
    },
  ];

  return (
    <Vertical
      ref={containerRef}
      minHeight="100vh"
      backgroundColor="#111111"
      padding={32}
      gap={48}
      style={{ overflowY: 'auto' }}
    >
      {cardsData.map((card, index) => (
        <View
          key={index}
          className="card"
          style={{
            opacity: 0,
            transform: 'translateY(50px)',
            marginBottom: '2rem',
          }}
        >
          <Card {...card} />
        </View>
      ))}
    </Vertical>
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
