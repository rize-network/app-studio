// Button.stories.ts|tsx

import { ComponentStory, ComponentMeta } from '@storybook/react';
import { createPortal } from 'react-dom';

import { Input as $Input, Button, Text, Vertical, View } from '../src/index';
import React, { useRef, useState, useEffect } from 'react';
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
  const scroll = useScroll({ container: containerRef });
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

const Card = ({
  tag,
  title,
  description,
}: {
  tag: any;
  title: any;
  description: any;
}) => (
  <View
    backgroundColor="color-gray-800"
    borderRadius={16}
    overflow="hidden"
    minHeight={414}
    width="100%"
  >
    <View
      backgroundColor="color-yellow-300"
      color="color-gray-800"
      padding={8}
      borderRadius={30}
      width="fit-content"
    >
      <Text>{tag}</Text>
    </View>

    <View>
      <Text>{title}</Text>
      <Text widthHeight="lg">{description}</Text>
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
    <View backgroundColor="color-gray-900" minHeight="100vh" padding={32}>
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

const IframeContent = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scroll = useScroll({ container: containerRef });

  return (
    <div
      ref={containerRef}
      style={{
        height: '100vh',
        overflowY: 'scroll',
        backgroundColor: '#f5f5f5',
      }}
    >
      <div style={{ height: '300vh', padding: 20 }}>
        <h1 style={{ fontFamily: 'sans-serif' }}>Iframe Content</h1>
        <div
          style={{
            position: 'sticky',
            top: 10,
            background: 'white',
            padding: 10,
            border: '1px solid #ddd',
            borderRadius: 4,
          }}
        >
          <p style={{ margin: 0, fontFamily: 'monospace' }}>
            Scroll Y: {scroll.y}
          </p>
          <p style={{ margin: 0, fontFamily: 'monospace' }}>
            Progress: {(scroll.yProgress * 100).toFixed(0)}%
          </p>
        </div>
        <div
          style={{
            marginTop: '50vh',
            height: '20vh',
            background: 'lightblue',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Mid Section
        </div>
        <div
          style={{
            marginTop: '80vh',
            height: '20vh',
            background: 'lightgreen',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Bottom Section
        </div>
      </div>
    </div>
  );
};

export const IframeScroll: ComponentStory<typeof $Input> = () => {
  const [frameRef, setFrameRef] = useState<HTMLIFrameElement | null>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (frameRef?.contentWindow?.document?.body) {
      setMountNode(frameRef.contentWindow.document.body);
      const doc = frameRef.contentWindow.document;
      doc.body.style.margin = '0';
    }
  }, [frameRef]);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ marginBottom: 10, display: 'block' }}>
        Scroll inside the iframe below. The values should update properly,
        demonstrating that useScroll creates listeners on the iframe's
        window/document rather than the main window.
      </Text>
      <iframe
        ref={setFrameRef}
        style={{ width: '100%', height: '400px', border: '2px solid #ccc' }}
        title="Scroll Test Iframe"
      />
      {mountNode && createPortal(<IframeContent />, mountNode)}
    </View>
  );
};

const IframeWindowContent = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Use trackWindowScroll: true to track the iframe's window scroll
  // even though we pass a container ref (which is used for context)
  const scroll = useScroll({
    container: containerRef,
    trackWindowScroll: true,
  });

  return (
    <div
      ref={containerRef}
      style={{
        // No fixed height or overflow here, we want the window (body) to scroll
        backgroundColor: '#fff0f0',
      }}
    >
      <div style={{ height: '300vh', padding: 20 }}>
        <h1 style={{ fontFamily: 'sans-serif' }}>Iframe Window Scroll</h1>
        <div
          style={{
            position: 'fixed',
            top: 10,
            left: 10,
            background: 'white',
            padding: 10,
            border: '1px solid #ddd',
            borderRadius: 4,
            zIndex: 1000,
          }}
        >
          <p style={{ margin: 0, fontFamily: 'monospace' }}>
            Window Scroll Y: {scroll.y}
          </p>
          <p style={{ margin: 0, fontFamily: 'monospace' }}>
            Progress: {(scroll.yProgress * 100).toFixed(0)}%
          </p>
        </div>
        <div
          style={{
            marginTop: '50vh',
            height: '20vh',
            background: 'lightcoral',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          Mid Section (Window Scroll)
        </div>
      </div>
    </div>
  );
};

export const IframeWindowScroll: ComponentStory<typeof $Input> = () => {
  const [frameRef, setFrameRef] = useState<HTMLIFrameElement | null>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (frameRef?.contentWindow?.document?.body) {
      setMountNode(frameRef.contentWindow.document.body);
      const doc = frameRef.contentWindow.document;
      doc.body.style.margin = '0';
      // Ensure the body behaves normally
      doc.body.style.overflow = 'auto';
    }
  }, [frameRef]);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ marginBottom: 10, display: 'block' }}>
        This iframe tracks the <b>Window Scroll</b> (main document of the
        iframe). The content flows naturally and scrolls the entire iframe
        window. Use <code>trackWindowScroll: true</code> to achieve this when
        passing a container ref.
      </Text>
      <iframe
        ref={setFrameRef}
        style={{ width: '100%', height: '400px', border: '2px solid #ccc' }}
        title="Window Scroll Test Iframe"
      />
      {mountNode && createPortal(<IframeWindowContent />, mountNode)}
    </View>
  );
};
