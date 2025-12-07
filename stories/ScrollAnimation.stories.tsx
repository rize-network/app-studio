import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { View, Text } from '../src/index';
import { useRef, useState, useEffect } from 'react';
import {
  useScroll,
  useScrollDirection,
  useSmoothScroll,
  useScrollAnimation,
} from '../src/hooks/useScroll';
import * as ScrollAnimations from '../src/element/Animation';
import * as Animations from '../src/element/Animation';

const AnimationBlock: React.FC<{
  title: string;
  animate: any;
  backgroundColor?: string;
}> = ({ title, animate, backgroundColor = 'color.blue' }) => (
  <View
    widthHeight={150}
    backgroundColor={backgroundColor}
    animate={animate}
    style={{ margin: '0 auto' }}
  >
    {title}
  </View>
);

const RootContainer = ({ children }: any) => (
  <View
    css={`
      --bg: hsl(0 0% 2%);
      --color: hsl(0 0% 100% / 0.1);
      --underline-block-width: 200vmax;
      --underline-color: hsl(0 0% 50% / 0.15);
      --underline-color-hover: hsl(180 100% 50% / 1);
      --underline-transition: 5s;
      --finish-fill: hsl(0 0% 100%);
      --accent: hsl(0 0% 100%);
      --fill-color: hsl(0 0% 50%);
      --underline-width: 100%;

      background-color: var(--bg);
      color: var(--color);

      @supports (animation-timeline: scroll()) {
        @media (prefers-reduced-motion: no-preference) {
          view-timeline-name: --section;
        }
      }
    `}
    backgroundColor={'black'}
  >
    {children}
  </View>
);

const FillTextDemo: React.FC = () => (
  <RootContainer>
    <View height="50vh" />
    <View as="main" height="200vh">
      <View
        as="section"
        position="sticky"
        top="0"
        height="100vh"
        width="100vw"
        display="grid"
        placeItems="center"
      >
        <View as="p" padding="10ch" textAlign="center">
          <View
            as="span"
            fontSize={60}
            outlineColor="hsl(10 80% 50%)"
            outlineOffset="1ch"
            color="var(--color)"
            textDecoration="none"
            backgroundImage="
              linear-gradient(90deg, transparent calc(100% - 1ch), var(--accent) calc(100%  - 1ch)),
              linear-gradient(90deg, var(--fill-color), var(--fill-color)),
              linear-gradient(90deg, var(--underline-color), var(--underline-color))"
            backgroundSize="
              var(--underline-block-width) var(--underline-width),
              var(--underline-block-width) var(--underline-width),
              100% var(--underline-width)"
            backgroundRepeat="no-repeat"
            backgroundPositionX="0"
            backgroundPositionY="100%"
            backgroundClip="text"
            animate={ScrollAnimations.fillTextScroll({
              duration: '1s',
              timingFunction: 'linear',
              timeline: '--section',
              range: 'entry 100% cover 55%, cover 50% exit 0%',
            })}
          >
            Responsive Animated Text Reveals with CSS Scroll-Driven Animations.
          </View>
        </View>
      </View>
    </View>
    <View as="footer" height="100vh" display="grid" placeItems="center">
      <View as="h2">fin.</View>
    </View>
  </RootContainer>
);

export default {
  title: 'Animation/Scroll/Text',
  component: FillTextDemo,
} as ComponentMeta<typeof FillTextDemo>;

export const FillTextScrollStory: ComponentStory<typeof FillTextDemo> = () => (
  <View height="90vh">
    <FillTextDemo />
    <View height={200} />
    <AnimationBlock
      title="Fade In Scroll"
      animate={ScrollAnimations.fadeInScroll({
        duration: '1s',
        timingFunction: 'linear',
      })}
      backgroundColor="lightblue"
    />
    <View height={200} />
    <AnimationBlock
      title="Slide In Left Scroll"
      animate={ScrollAnimations.slideInLeftScroll({
        duration: '0.5s',
        timingFunction: 'ease-out',
      })}
      backgroundColor="blue"
    />
    <View height={200} />
    <AnimationBlock
      title="Scale Down Scroll"
      animate={ScrollAnimations.scaleDownScroll({
        duration: '0.8s',
        timingFunction: 'ease',
      })}
      backgroundColor="lightgreen"
    />
    <View height={200} />
    <AnimationBlock
      title="Fill Text Scroll"
      animate={ScrollAnimations.fillTextScroll({
        duration: '1s',
        timingFunction: 'linear',
      })}
      backgroundColor="lightgray"
    />
    <View height={200} />
    <AnimationBlock
      title="CTA Collapse Scroll"
      animate={ScrollAnimations.ctaCollapseScroll({
        duration: '1s',
        timingFunction: 'linear',
      })}
      backgroundColor="lightcyan"
    />
    <View height={200} />
    <AnimationBlock
      title="Hand Wave Scroll"
      animate={ScrollAnimations.handWaveScroll({
        duration: '2s',
        timingFunction: 'linear',
      })}
      backgroundColor="lavender"
    />
    <View height={200} />
    <AnimationBlock
      title="Fade Blur Scroll"
      animate={ScrollAnimations.fadeBlurScroll({
        duration: '1s',
        timingFunction: 'linear',
      })}
      backgroundColor="mistyrose"
    />
    <View height={200} />
    <AnimationBlock
      title="Unclip Scroll"
      animate={ScrollAnimations.unclipScroll({
        duration: '1s',
        timingFunction: 'linear',
      })}
      backgroundColor="thistle"
    />
    <View height={200} />
    <AnimationBlock
      title="Scale Down Article Scroll"
      animate={ScrollAnimations.scaleDownArticleScroll({
        duration: '1s',
        timingFunction: 'linear',
      })}
      backgroundColor="peachpuff"
    />
    <View height={200} />
    <AnimationBlock
      title="List Item Scale Scroll"
      animate={ScrollAnimations.listItemScaleScroll({
        duration: '0.5s',
        timingFunction: 'ease',
      })}
      backgroundColor="khaki"
    />
    <View height={200} />
  </View>
);

/**
 * CSS View Timeline Animations - Pure CSS, no JavaScript state!
 * These animations now work by default with animate prop (animateOn="Both" is default).
 */
export const ViewTimelineAnimations: ComponentStory<typeof View> = () => (
  <View padding={20} minHeight="400vh">
    <View
      position="sticky"
      top={0}
      backgroundColor="white"
      padding={20}
      zIndex={10}
      marginBottom={20}
      boxShadow="0 2px 10px rgba(0,0,0,0.1)"
    >
      <Text fontSize={24} fontWeight="bold" marginBottom={8}>
        🚀 Default View Timeline Animations
      </Text>
      <Text color="#666">
        Just use animate prop - animates on mount AND scroll (animateOn="Both"
        is default)
      </Text>
    </View>

    <View height="30vh" />

    {/* Fade animations */}
    <Text fontSize={20} fontWeight="bold" marginBottom={16}>
      Fade Animations
    </Text>

    <View
      animate={Animations.fadeIn()}
      backgroundColor="color.blue.500"
      padding={30}
      borderRadius={12}
      marginBottom={40}
    >
      <Text color="white" fontWeight="bold">
        Animation.fadeIn()
      </Text>
      <Text color="white" opacity={0.9}>
        Fades in when entering viewport (default behavior)
      </Text>
    </View>

    <View
      animate={Animations.fadeIn({
        duration: '1.5s',
        timingFunction: 'ease-out',
      })}
      backgroundColor="color.blue.600"
      padding={30}
      borderRadius={12}
      marginBottom={60}
    >
      <Text color="white" fontWeight="bold">
        Animation.fadeIn({'{ duration: "1.5s" }'})
      </Text>
      <Text color="white" opacity={0.9}>
        Custom duration
      </Text>
    </View>

    {/* Slide animations */}
    <Text fontSize={20} fontWeight="bold" marginBottom={16}>
      Slide Animations
    </Text>

    <View
      animate={Animations.slideInUp({})}
      backgroundColor="color.green.500"
      padding={30}
      borderRadius={12}
      marginBottom={40}
    >
      <Text color="white" fontWeight="bold">
        Animation.slideInUp()
      </Text>
      <Text color="white" opacity={0.9}>
        Slides up while fading in
      </Text>
    </View>

    <View
      animate={Animations.slideInLeft({ duration: '0.8s' })}
      backgroundColor="color.teal.500"
      padding={30}
      borderRadius={12}
      marginBottom={40}
    >
      <Text color="white" fontWeight="bold">
        Animation.slideInLeft()
      </Text>
      <Text color="white" opacity={0.9}>
        Slides from left
      </Text>
    </View>

    <View
      animate={Animations.slideInRight()}
      backgroundColor="color.cyan.500"
      padding={30}
      borderRadius={12}
      marginBottom={60}
    >
      <Text color="white" fontWeight="bold">
        Animation.slideInRight()
      </Text>
      <Text color="white" opacity={0.9}>
        Slides from right
      </Text>
    </View>

    {/* Scale & Effects */}
    <Text fontSize={20} fontWeight="bold" marginBottom={16}>
      Scale & Special Effects
    </Text>

    <View
      animate={Animations.scale({ duration: '0.8s' })}
      backgroundColor="color.purple.500"
      padding={30}
      borderRadius={12}
      marginBottom={40}
    >
      <Text color="white" fontWeight="bold">
        Animation.scale()
      </Text>
      <Text color="white" opacity={0.9}>
        Scales up on scroll
      </Text>
    </View>

    <View
      animate={Animations.rotate({ duration: '0.8s' })}
      backgroundColor="color.red.500"
      padding={30}
      borderRadius={12}
      marginBottom={40}
    >
      <Text color="white" fontWeight="bold">
        Animation.rotate()
      </Text>
      <Text color="white" opacity={0.9}>
        Rotates on scroll
      </Text>
    </View>

    <View
      animate={Animations.bounce({ duration: '1s' })}
      backgroundColor="color.pink.500"
      padding={30}
      borderRadius={12}
      marginBottom={60}
    >
      <Text color="white" fontWeight="bold">
        Animation.bounce()
      </Text>
      <Text color="white" opacity={0.9}>
        Bounces on scroll
      </Text>
    </View>

    {/* Staggered */}
    <Text fontSize={20} fontWeight="bold" marginBottom={16}>
      Staggered Animations
    </Text>

    <View display="flex" gap={16} flexWrap="wrap" marginBottom={60}>
      {[0, 1, 2, 3, 4].map((i) => (
        <View
          key={i}
          flex="1"
          minWidth={120}
          animate={Animations.slideInUp({ delay: `${i * 0.1}s` })}
          backgroundColor="color.violet.500"
          padding={20}
          borderRadius={8}
          textAlign="center"
        >
          <Text color="white" fontSize={24} fontWeight="bold">
            {i + 1}
          </Text>
          <Text color="white" opacity={0.8} fontSize={12}>
            delay: {i * 0.1}s
          </Text>
        </View>
      ))}
    </View>

    <View height="100vh" />
  </View>
);

/**
 * Entry + Exit animations combined
 */
export const EntryExitAnimations: ComponentStory<typeof View> = () => (
  <View padding={20} minHeight="300vh">
    <View
      position="sticky"
      top={0}
      backgroundColor="white"
      padding={20}
      zIndex={10}
      marginBottom={20}
    >
      <Text fontSize={24} fontWeight="bold" marginBottom={8}>
        🔄 Entry &amp; Exit Animations
      </Text>
      <Text color="#666">
        Elements animate both when entering AND exiting the viewport
      </Text>
    </View>

    <View height="40vh" />

    <View
      animate={[
        Animations.fadeIn({ range: 'entry' }),
        Animations.fadeOut({ range: 'exit' }),
      ]}
      backgroundColor="color.blue.500"
      padding={40}
      borderRadius={12}
      marginBottom={100}
    >
      <Text color="white" fontWeight="bold" fontSize={18}>
        Fade In / Fade Out
      </Text>
      <Text color="white" opacity={0.9}>
        Fades in on entry, fades out on exit
      </Text>
    </View>

    <View
      animate={[
        Animations.slideInUp({ range: 'entry' }),
        Animations.slideInDown({ range: 'exit' }),
      ]}
      backgroundColor="color.green.500"
      padding={40}
      borderRadius={12}
      marginBottom={100}
    >
      <Text color="white" fontWeight="bold" fontSize={18}>
        Slide Up / Slide Down
      </Text>
      <Text color="white" opacity={0.9}>
        Slides up on entry, slides down on exit
      </Text>
    </View>

    <View
      animate={[
        Animations.scale({ range: 'entry' }),
        Animations.fadeOut({ range: 'exit' }),
      ]}
      backgroundColor="color.purple.500"
      padding={40}
      borderRadius={12}
      marginBottom={100}
    >
      <Text color="white" fontWeight="bold" fontSize={18}>
        Scale / Fade Out
      </Text>
      <Text color="white" opacity={0.9}>
        Scales on entry, fades on exit
      </Text>
    </View>

    <View height="100vh" />
  </View>
);

export const AnimatedComponent: React.FC = () => {
  const fadeRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef<HTMLDivElement>(null);
  const rotateRef = useRef<HTMLDivElement>(null);

  const { progress: fadeProgress } = useScrollAnimation(fadeRef, {
    threshold: [0, 0.25, 0.5, 0.75, 1],
  });

  const { progress: slideProgress } = useScrollAnimation(slideRef, {
    threshold: [0, 0.25, 0.5, 0.75, 1],
  });

  const { progress: scaleProgress } = useScrollAnimation(scaleRef, {
    threshold: [0, 0.25, 0.5, 0.75, 1],
  });

  const { progress: rotateProgress } = useScrollAnimation(rotateRef, {
    threshold: [0, 0.25, 0.5, 0.75, 1],
  });

  return (
    <View style={{ paddingBottom: '100vh' }}>
      <Text
        style={{ fontSize: '24px', marginBottom: '20px', display: 'block' }}
      >
        Scroll Animation Examples
      </Text>
      <Text style={{ marginBottom: '40px', display: 'block', color: '#666' }}>
        Scroll down to see the elements animate as they enter the viewport.
      </Text>

      {/* Spacer */}
      <View style={{ height: '50vh' }} />

      {/* Fade In Example */}
      <View
        style={{
          marginBottom: '100px',
          padding: '20px',
          border: '1px solid #eee',
        }}
      >
        <Text
          style={{ marginBottom: '10px', display: 'block', fontWeight: 'bold' }}
        >
          1. Fade In
        </Text>
        <View
          ref={fadeRef}
          style={{
            opacity: fadeProgress,
            transition: 'opacity 0.3s ease-out',
            height: '150px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
          }}
          backgroundColor="color.blue.500"
          color="color.white"
        >
          I fade in (Opacity: {fadeProgress.toFixed(2)})
        </View>
      </View>

      {/* Slide In Example */}
      <View
        style={{
          marginBottom: '100px',
          padding: '20px',
          border: '1px solid #eee',
        }}
      >
        <Text
          style={{ marginBottom: '10px', display: 'block', fontWeight: 'bold' }}
        >
          2. Slide In from Left
        </Text>
        <View
          ref={slideRef}
          style={{
            transform: `translateX(${(1 - slideProgress) * -100}%)`,
            opacity: slideProgress,
            transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
            height: '150px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
          }}
          backgroundColor="color.green.500"
          color="color.white"
        >
          I slide in
        </View>
      </View>

      {/* Scale Up Example */}
      <View
        style={{
          marginBottom: '100px',
          padding: '20px',
          border: '1px solid #eee',
        }}
      >
        <Text
          style={{ marginBottom: '10px', display: 'block', fontWeight: 'bold' }}
        >
          3. Scale Up
        </Text>
        <View
          ref={scaleRef}
          style={{
            transform: `scale(${0.5 + scaleProgress * 0.5})`,
            opacity: scaleProgress,
            transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
            height: '150px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
          }}
          backgroundColor="color.purple.500"
          color="color.white"
        >
          I scale up
        </View>
      </View>

      {/* Rotate Example */}
      <View
        style={{
          marginBottom: '100px',
          padding: '20px',
          border: '1px solid #eee',
        }}
      >
        <Text
          style={{ marginBottom: '10px', display: 'block', fontWeight: 'bold' }}
        >
          4. Rotate In
        </Text>
        <View
          ref={rotateRef}
          style={{
            transform: `rotate(${
              (1 - rotateProgress) * -180
            }deg) scale(${rotateProgress})`,
            opacity: rotateProgress,
            transition: 'transform 0.5s ease-out, opacity 0.5s ease-out',
            height: '150px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
          }}
          backgroundColor="color.orange.500"
          color="color.white"
        >
          I rotate & scale
        </View>
      </View>
    </View>
  );
};
