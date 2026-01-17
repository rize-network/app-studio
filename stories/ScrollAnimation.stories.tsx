import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { View, Text } from '../src/index';
import { useRef, useState } from 'react';
import {
  useScroll,
  useScrollDirection,
  useSmoothScroll,
  useScrollAnimation,
} from '../src/hooks/useScroll';
import * as ScrollAnimations from '../src/element/Animation';
import * as Animations from '../src/element/Animation';

// =============================================================================
// SHARED COMPONENTS
// =============================================================================

const StickyHeader: React.FC<{
  title: string;
  description: string;
  children?: React.ReactNode;
}> = ({ title, description, children }) => (
  <View
    position="sticky"
    top={0}
    backgroundColor="white"
    padding={20}
    zIndex={10}
    marginBottom={20}
    boxShadow="0 2px 10px rgba(0,0,0,0.1)"
    borderBottom="1px solid #eee"
  >
    <Text fontSize={24} fontWeight="bold" marginBottom={8}>
      {title}
    </Text>
    <Text color="#666" marginBottom={children ? 12 : 0}>
      {description}
    </Text>
    {children}
  </View>
);

const AnimationCard: React.FC<{
  title: string;
  code: string;
  animate: any;
  backgroundColor?: string;
}> = ({ title, code, animate, backgroundColor = 'color-blue-500' }) => (
  <View
    animate={animate}
    backgroundColor={backgroundColor}
    padding={30}
    borderRadius={12}
    marginBottom={40}
  >
    <Text color="white" fontWeight="bold" fontSize={16}>
      {title}
    </Text>
    <Text
      color="white"
      opacity={0.85}
      fontSize={13}
      fontFamily="monospace"
      marginTop={8}
    >
      {code}
    </Text>
  </View>
);

const ProgressBadge: React.FC<{
  isInView: boolean;
  progress: number;
}> = ({ isInView, progress }) => (
  <View display="flex" gap={12} marginTop={12}>
    <View
      padding="6px 12px"
      borderRadius={20}
      backgroundColor={isInView ? '#4CAF50' : '#9e9e9e'}
      display="inline-flex"
      alignItems="center"
      gap={6}
    >
      <Text color="white" fontSize={13} fontWeight="500">
        {isInView ? 'In View' : 'Out of View'}
      </Text>
    </View>
    <View
      padding="6px 12px"
      borderRadius={20}
      backgroundColor="rgba(0,0,0,0.1)"
      display="inline-flex"
    >
      <Text fontSize={13} fontWeight="500">
        {(progress * 100).toFixed(0)}%
      </Text>
    </View>
  </View>
);

const ProgressBar: React.FC<{
  progress: number;
  color?: string;
}> = ({ progress, color = '#2196f3' }) => (
  <View
    marginTop={16}
    height={8}
    borderRadius={4}
    backgroundColor="rgba(0,0,0,0.1)"
    overflow="hidden"
  >
    <View
      width={`${progress * 100}%`}
      height="100%"
      borderRadius={4}
      backgroundColor={color}
      style={{ transition: 'width 0.15s ease-out' }}
    />
  </View>
);

// =============================================================================
// STORYBOOK META
// =============================================================================

export default {
  title: 'Hooks/Scroll',
  parameters: {
    docs: {
      description: {
        component:
          'Scroll-related hooks and animations for tracking scroll position, direction, and creating scroll-driven animations.',
      },
    },
  },
} as ComponentMeta<typeof View>;

// =============================================================================
// useScrollAnimation HOOK STORIES
// =============================================================================

/**
 * Demonstrates the useScrollAnimation hook with various configurations.
 * This hook uses IntersectionObserver to track element visibility and progress.
 */
export const UseScrollAnimationHook: ComponentStory<typeof View> = () => {
  const fadeRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef<HTMLDivElement>(null);
  const rotateRef = useRef<HTMLDivElement>(null);
  const combinedRef = useRef<HTMLDivElement>(null);

  const { isInView: fadeInView, progress: fadeProgress } = useScrollAnimation(
    fadeRef,
    { threshold: [0, 0.25, 0.5, 0.75, 1] }
  );

  const { isInView: slideInView, progress: slideProgress } = useScrollAnimation(
    slideRef,
    { threshold: [0, 0.25, 0.5, 0.75, 1] }
  );

  const { isInView: scaleInView, progress: scaleProgress } = useScrollAnimation(
    scaleRef,
    { threshold: [0, 0.25, 0.5, 0.75, 1] }
  );

  const { progress: rotateProgress } = useScrollAnimation(rotateRef, {
    threshold: [0, 0.25, 0.5, 0.75, 1],
  });

  const { isInView: combinedInView, progress: combinedProgress } =
    useScrollAnimation(combinedRef, {
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    });

  return (
    <View padding={20} minHeight="400vh">
      <StickyHeader
        title="useScrollAnimation Hook"
        description="Track element visibility and progress using IntersectionObserver. Each card shows real-time isInView and progress values."
      />

      <View height="30vh" />

      {/* Fade Animation */}
      <View
        marginBottom={100}
        padding={20}
        border="1px solid #eee"
        borderRadius={12}
      >
        <Text fontWeight="bold" marginBottom={12} fontSize={18}>
          1. Fade In Effect
        </Text>
        <Text color="#666" marginBottom={16} fontSize={14}>
          <code>opacity: progress</code>
        </Text>
        <View
          ref={fadeRef}
          style={{
            opacity: fadeProgress,
            transition: 'opacity 0.2s ease-out',
          }}
          backgroundColor="color-blue-500"
          padding={30}
          borderRadius={12}
          minHeight={120}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <View>
            <Text color="white" fontWeight="bold" fontSize={20}>
              Opacity: {fadeProgress.toFixed(2)}
            </Text>
            <ProgressBadge isInView={fadeInView} progress={fadeProgress} />
          </View>
        </View>
      </View>

      {/* Slide Animation */}
      <View
        marginBottom={100}
        padding={20}
        border="1px solid #eee"
        borderRadius={12}
      >
        <Text fontWeight="bold" marginBottom={12} fontSize={18}>
          2. Slide In from Left
        </Text>
        <Text color="#666" marginBottom={16} fontSize={14}>
          <code>translateX: (1 - progress) * -100%</code>
        </Text>
        <View
          ref={slideRef}
          style={{
            transform: `translateX(${(1 - slideProgress) * -100}%)`,
            opacity: slideProgress,
            transition: 'transform 0.2s ease-out, opacity 0.2s ease-out',
          }}
          backgroundColor="color-green-500"
          padding={30}
          borderRadius={12}
          minHeight={120}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <View>
            <Text color="white" fontWeight="bold" fontSize={20}>
              Slide Progress
            </Text>
            <ProgressBadge isInView={slideInView} progress={slideProgress} />
          </View>
        </View>
      </View>

      {/* Scale Animation */}
      <View
        marginBottom={100}
        padding={20}
        border="1px solid #eee"
        borderRadius={12}
      >
        <Text fontWeight="bold" marginBottom={12} fontSize={18}>
          3. Scale Up
        </Text>
        <Text color="#666" marginBottom={16} fontSize={14}>
          <code>scale: 0.5 + progress * 0.5</code>
        </Text>
        <View display="flex" justifyContent="center">
          <View
            ref={scaleRef}
            style={{
              transform: `scale(${0.5 + scaleProgress * 0.5})`,
              opacity: scaleProgress,
              transition: 'transform 0.2s ease-out, opacity 0.2s ease-out',
            }}
            backgroundColor="color-purple-500"
            padding={30}
            borderRadius={12}
            minHeight={120}
            minWidth={200}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <View>
              <Text color="white" fontWeight="bold" fontSize={20}>
                Scale: {(0.5 + scaleProgress * 0.5).toFixed(2)}
              </Text>
              <ProgressBadge isInView={scaleInView} progress={scaleProgress} />
            </View>
          </View>
        </View>
      </View>

      {/* Rotate Animation */}
      <View
        marginBottom={100}
        padding={20}
        border="1px solid #eee"
        borderRadius={12}
      >
        <Text fontWeight="bold" marginBottom={12} fontSize={18}>
          4. Rotate & Scale
        </Text>
        <Text color="#666" marginBottom={16} fontSize={14}>
          <code>rotate: (1 - progress) * -180deg</code>
        </Text>
        <View display="flex" justifyContent="center">
          <View
            ref={rotateRef}
            style={{
              transform: `rotate(${(1 - rotateProgress) * -180}deg) scale(${rotateProgress})`,
              opacity: rotateProgress,
              transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
            }}
            backgroundColor="color-orange-500"
            padding={30}
            borderRadius={12}
            widthHeight={150}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <View textAlign="center">
              <Text color="white" fontWeight="bold" fontSize={18}>
                Rotate
              </Text>
              <Text color="white" opacity={0.9} fontSize={14}>
                {((1 - rotateProgress) * -180).toFixed(0)}deg
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Combined Animation */}
      <View
        marginBottom={100}
        padding={20}
        border="1px solid #eee"
        borderRadius={12}
      >
        <Text fontWeight="bold" marginBottom={12} fontSize={18}>
          5. Combined Effects (10% threshold steps)
        </Text>
        <Text color="#666" marginBottom={16} fontSize={14}>
          Multiple transforms combined with fine-grained thresholds
        </Text>
        <View
          ref={combinedRef}
          style={{
            transform: `
              translateY(${(1 - combinedProgress) * 50}px)
              scale(${0.8 + combinedProgress * 0.2})
              rotateX(${(1 - combinedProgress) * 15}deg)
            `,
            opacity: combinedProgress,
            transition: 'all 0.15s ease-out',
            perspective: '1000px',
          }}
          background="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          padding={40}
          borderRadius={16}
          minHeight={150}
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow={`0 ${20 * combinedProgress}px ${40 * combinedProgress}px rgba(102, 126, 234, ${0.3 * combinedProgress})`}
        >
          <View textAlign="center">
            <Text color="white" fontWeight="bold" fontSize={24}>
              Combined Animation
            </Text>
            <ProgressBadge
              isInView={combinedInView}
              progress={combinedProgress}
            />
            <ProgressBar
              progress={combinedProgress}
              color="rgba(255,255,255,0.5)"
            />
          </View>
        </View>
      </View>

      <View height="50vh" />
    </View>
  );
};

UseScrollAnimationHook.storyName = 'useScrollAnimation';

// =============================================================================
// useScroll HOOK STORY
// =============================================================================

/**
 * Demonstrates the useScroll hook for tracking scroll position and progress.
 */
export const UseScrollHook: ComponentStory<typeof View> = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const windowScroll = useScroll();
  const containerScroll = useScroll({
    container: containerRef,
    throttleMs: 16,
  });

  return (
    <View padding={20} minHeight="300vh">
      <StickyHeader
        title="useScroll Hook"
        description="Track scroll position (x, y) and progress (0-1) for window or any scrollable container."
      >
        <View
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
          gap={16}
          marginTop={16}
          padding={16}
          backgroundColor="#f5f5f5"
          borderRadius={8}
        >
          <View>
            <Text fontSize={12} color="#666" marginBottom={4}>
              Window Scroll Y
            </Text>
            <Text fontSize={24} fontWeight="bold">
              {Math.round(windowScroll.y)}px
            </Text>
          </View>
          <View>
            <Text fontSize={12} color="#666" marginBottom={4}>
              Window Progress Y
            </Text>
            <Text fontSize={24} fontWeight="bold">
              {(windowScroll.yProgress * 100).toFixed(1)}%
            </Text>
          </View>
        </View>
      </StickyHeader>

      <View height="20vh" />

      {/* Scrollable Container Demo */}
      <View marginBottom={40}>
        <Text fontSize={18} fontWeight="bold" marginBottom={12}>
          Container Scroll Tracking
        </Text>
        <Text color="#666" marginBottom={16}>
          Pass a container ref to track scroll within a specific element.
        </Text>

        <View display="flex" gap={20} alignItems="flex-start">
          {/* Scroll Container */}
          <View
            ref={containerRef}
            height={300}
            width="100%"
            maxWidth={500}
            overflow="auto"
            border="2px solid #2196f3"
            borderRadius={12}
            backgroundColor="#fafafa"
          >
            <View padding={20} minHeight={800}>
              <Text fontWeight="bold" marginBottom={20}>
                Scrollable Container
              </Text>
              {Array.from({ length: 15 }).map((_, i) => (
                <View
                  key={i}
                  padding={16}
                  marginBottom={12}
                  backgroundColor="white"
                  borderRadius={8}
                  boxShadow="0 1px 3px rgba(0,0,0,0.1)"
                >
                  Item {i + 1}
                </View>
              ))}
            </View>
          </View>

          {/* Container Stats */}
          <View
            padding={20}
            backgroundColor="#e3f2fd"
            borderRadius={12}
            minWidth={200}
          >
            <Text fontWeight="bold" marginBottom={16}>
              Container Stats
            </Text>
            <View marginBottom={12}>
              <Text fontSize={12} color="#666">
                Scroll Y
              </Text>
              <Text fontSize={20} fontWeight="bold">
                {Math.round(containerScroll.y)}px
              </Text>
            </View>
            <View>
              <Text fontSize={12} color="#666">
                Progress
              </Text>
              <Text fontSize={20} fontWeight="bold">
                {(containerScroll.yProgress * 100).toFixed(1)}%
              </Text>
              <ProgressBar progress={containerScroll.yProgress} />
            </View>
          </View>
        </View>
      </View>

      <View height="100vh" />
    </View>
  );
};

UseScrollHook.storyName = 'useScroll';

// =============================================================================
// useScrollDirection HOOK STORY
// =============================================================================

/**
 * Demonstrates the useScrollDirection hook.
 */
export const UseScrollDirectionHook: ComponentStory<typeof View> = () => {
  const direction = useScrollDirection(10);

  return (
    <View padding={20} minHeight="300vh">
      <StickyHeader
        title="useScrollDirection Hook"
        description="Detect whether the user is scrolling up or down with configurable threshold."
      >
        <View
          display="inline-flex"
          alignItems="center"
          gap={12}
          padding="12px 20px"
          backgroundColor={direction === 'down' ? '#e3f2fd' : '#fce4ec'}
          borderRadius={8}
          marginTop={16}
        >
          <Text fontSize={32}>{direction === 'down' ? '↓' : '↑'}</Text>
          <View>
            <Text fontSize={12} color="#666">
              Direction
            </Text>
            <Text fontSize={24} fontWeight="bold" textTransform="capitalize">
              {direction}
            </Text>
          </View>
        </View>
      </StickyHeader>

      <View height="20vh" />

      {Array.from({ length: 10 }).map((_, i) => (
        <View
          key={i}
          padding={40}
          marginBottom={40}
          backgroundColor={i % 2 === 0 ? '#f5f5f5' : '#fff'}
          borderRadius={12}
          border="1px solid #eee"
        >
          <Text fontSize={20} fontWeight="bold">
            Section {i + 1}
          </Text>
          <Text color="#666" marginTop={8}>
            Scroll to see direction changes
          </Text>
        </View>
      ))}
    </View>
  );
};

UseScrollDirectionHook.storyName = 'useScrollDirection';

// =============================================================================
// useSmoothScroll HOOK STORY
// =============================================================================

/**
 * Demonstrates the useSmoothScroll hook for programmatic smooth scrolling.
 */
export const UseSmoothScrollHook: ComponentStory<typeof View> = () => {
  const scrollTo = useSmoothScroll();
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  const section4Ref = useRef<HTMLDivElement>(null);

  const sections = [
    { ref: section1Ref, color: '#2196f3', name: 'Section 1' },
    { ref: section2Ref, color: '#4caf50', name: 'Section 2' },
    { ref: section3Ref, color: '#9c27b0', name: 'Section 3' },
    { ref: section4Ref, color: '#ff9800', name: 'Section 4' },
  ];

  return (
    <View padding={20} minHeight="400vh">
      <StickyHeader
        title="useSmoothScroll Hook"
        description="Programmatically smooth scroll to any element with optional offset."
      >
        <View display="flex" gap={8} flexWrap="wrap" marginTop={16}>
          {sections.map(({ ref, color, name }) => (
            <View
              key={name}
              as="button"
              onClick={() => scrollTo(ref.current, 100)}
              padding="10px 20px"
              backgroundColor={color}
              color="white"
              border="none"
              borderRadius={8}
              cursor="pointer"
              fontWeight="bold"
              style={{ transition: 'transform 0.1s' }}
              _hover={{ transform: 'scale(1.05)' }}
            >
              Go to {name}
            </View>
          ))}
        </View>
      </StickyHeader>

      <View height="20vh" />

      {sections.map(({ ref, color, name }) => (
        <View
          key={name}
          ref={ref}
          padding={60}
          marginBottom={200}
          backgroundColor={color}
          borderRadius={16}
          minHeight={300}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <View textAlign="center">
            <Text color="white" fontSize={48} fontWeight="bold">
              {name}
            </Text>
            <Text color="white" opacity={0.9} marginTop={8}>
              Click buttons above to smooth scroll here
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

UseSmoothScrollHook.storyName = 'useSmoothScroll';

// =============================================================================
// CSS ANIMATION STORIES
// =============================================================================

/**
 * CSS View Timeline Animations - Pure CSS, no JavaScript state!
 */
export const CSSViewTimelineAnimations: ComponentStory<typeof View> = () => (
  <View padding={20} minHeight="400vh">
    <StickyHeader
      title="CSS View Timeline Animations"
      description="Pure CSS animations using the animate prop. Works on mount AND scroll by default (animateOn='Both')."
    />

    <View height="30vh" />

    {/* Fade Animations */}
    <Text fontSize={20} fontWeight="bold" marginBottom={16}>
      Fade Animations
    </Text>

    <AnimationCard
      title="Fade In"
      code="Animation.fadeIn()"
      animate={Animations.fadeIn()}
      backgroundColor="color-blue-500"
    />

    <AnimationCard
      title="Fade In (Custom Duration)"
      code="Animation.fadeIn({ duration: '1.5s' })"
      animate={Animations.fadeIn({
        duration: '1.5s',
        timingFunction: 'ease-out',
      })}
      backgroundColor="color-blue-600"
    />

    {/* Slide Animations */}
    <Text fontSize={20} fontWeight="bold" marginBottom={16} marginTop={40}>
      Slide Animations
    </Text>

    <AnimationCard
      title="Slide In Up"
      code="Animation.slideInUp()"
      animate={Animations.slideInUp({})}
      backgroundColor="color-green-500"
    />

    <AnimationCard
      title="Slide In Left"
      code="Animation.slideInLeft({ duration: '0.8s' })"
      animate={Animations.slideInLeft({ duration: '0.8s' })}
      backgroundColor="color-teal-500"
    />

    <AnimationCard
      title="Slide In Right"
      code="Animation.slideInRight()"
      animate={Animations.slideInRight()}
      backgroundColor="color-cyan-500"
    />

    {/* Scale & Effects */}
    <Text fontSize={20} fontWeight="bold" marginBottom={16} marginTop={40}>
      Scale & Effects
    </Text>

    <AnimationCard
      title="Scale"
      code="Animation.scale({ duration: '0.8s' })"
      animate={Animations.scale({ duration: '0.8s' })}
      backgroundColor="color-purple-500"
    />

    <AnimationCard
      title="Rotate"
      code="Animation.rotate({ duration: '0.8s' })"
      animate={Animations.rotate({ duration: '0.8s' })}
      backgroundColor="color-red-500"
    />

    <AnimationCard
      title="Bounce"
      code="Animation.bounce({ duration: '1s' })"
      animate={Animations.bounce({ duration: '1s' })}
      backgroundColor="color-pink-500"
    />

    {/* Staggered */}
    <Text fontSize={20} fontWeight="bold" marginBottom={16} marginTop={40}>
      Staggered Animations
    </Text>

    <View display="flex" gap={16} flexWrap="wrap" marginBottom={60}>
      {[0, 1, 2, 3, 4].map((i) => (
        <View
          key={i}
          flex="1"
          minWidth={120}
          animate={Animations.slideInUp({ delay: `${i * 0.1}s` })}
          backgroundColor="color-violet-500"
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

CSSViewTimelineAnimations.storyName = 'CSS Animations';

/**
 * Entry + Exit animations combined
 */
export const EntryExitAnimations: ComponentStory<typeof View> = () => (
  <View padding={20} minHeight="300vh">
    <StickyHeader
      title="Entry & Exit Animations"
      description="Combine entry and exit animations using the range property. Elements animate when entering AND exiting the viewport."
    />

    <View height="40vh" />

    <View
      animate={[
        Animations.fadeIn({ range: 'entry' }),
        Animations.fadeOut({ range: 'exit' }),
      ]}
      backgroundColor="color-blue-500"
      padding={40}
      borderRadius={12}
      marginBottom={100}
    >
      <Text color="white" fontWeight="bold" fontSize={18}>
        Fade In / Fade Out
      </Text>
      <Text color="white" opacity={0.9} marginTop={8}>
        <code>range: 'entry'</code> + <code>range: 'exit'</code>
      </Text>
    </View>

    <View
      animate={[
        Animations.slideInUp({ range: 'entry' }),
        Animations.slideInDown({ range: 'exit' }),
      ]}
      backgroundColor="color-green-500"
      padding={40}
      borderRadius={12}
      marginBottom={100}
    >
      <Text color="white" fontWeight="bold" fontSize={18}>
        Slide Up / Slide Down
      </Text>
      <Text color="white" opacity={0.9} marginTop={8}>
        Slides up on entry, slides down on exit
      </Text>
    </View>

    <View
      animate={[
        Animations.scale({ range: 'entry' }),
        Animations.fadeOut({ range: 'exit' }),
      ]}
      backgroundColor="color-purple-500"
      padding={40}
      borderRadius={12}
      marginBottom={100}
    >
      <Text color="white" fontWeight="bold" fontSize={18}>
        Scale / Fade Out
      </Text>
      <Text color="white" opacity={0.9} marginTop={8}>
        Scales on entry, fades on exit
      </Text>
    </View>

    <View height="100vh" />
  </View>
);

// =============================================================================
// SCROLL-DRIVEN ANIMATIONS (CSS)
// =============================================================================

const RootContainer = ({ children }: { children: React.ReactNode }) => (
  <View
    css={`
      --bg: hsl(0 0% 2%);
      --color: hsl(0 0% 100% / 0.1);
      --underline-block-width: 200vmax;
      --underline-color: hsl(0 0% 50% / 0.15);
      --accent: hsl(0 0% 100%);
      --fill-color: hsl(0 0% 50%);
      --underline-width: 100%;

      @supports (animation-timeline: scroll()) {
        @media (prefers-reduced-motion: no-preference) {
          view-timeline-name: --section;
        }
      }
    `}
    backgroundColor="black"
  >
    {children}
  </View>
);

/**
 * Scroll-driven text fill animation
 */
export const ScrollDrivenTextFill: ComponentStory<typeof View> = () => (
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
            color="var(--color)"
            backgroundImage="
              linear-gradient(90deg, transparent calc(100% - 1ch), var(--accent) calc(100% - 1ch)),
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
      <Text color="white" fontSize={32}>
        fin.
      </Text>
    </View>
  </RootContainer>
);

ScrollDrivenTextFill.storyName = 'Scroll-Driven Text Fill';

/**
 * FillText Examples - Using App-Studio's Theming System
 *
 * This story demonstrates FillText scroll animations integrated with App-Studio's
 * color system. Colors use CSS variables for theme-awareness:
 *
 * - Palette colors: var(--color-blue-500), var(--color-emerald-500)
 * - Alpha transparency: color-mix(in srgb, var(--color-blue-500) 20%, transparent)
 * - Background colors: color-slate.900, color-emerald.950, etc.
 *
 * See docs/Theming.md for the complete color reference.
 */
export const FillTextExamples: ComponentStory<typeof View> = () => {
  // Reusable FillText-style component with CSS variable support
  const FillText: React.FC<{
    children: React.ReactNode;
    fontSize?: number;
    /** CSS color or var(--color-*) reference */
    fillColor?: string;
    /** CSS color or var(--color-*) reference */
    accentColor?: string;
    /** CSS color or color-mix() for transparency */
    underlineColor?: string;
    /** CSS color or color-mix() for transparency */
    baseColor?: string;
    timeline?: string;
    range?: string;
  }> = ({
    children,
    fontSize = 48,
    fillColor = 'var(--color-gray-500)',
    accentColor = 'var(--color-white)',
    underlineColor = 'color-mix(in srgb, var(--color-gray-500) 15%, transparent)',
    baseColor = 'color-mix(in srgb, var(--color-white) 10%, transparent)',
    timeline = '--section',
    range = 'entry 100% cover 55%, cover 50% exit 0%',
  }) => (
    <View
      as="span"
      fontSize={fontSize}
      fontWeight="bold"
      css={`
        color: ${baseColor};
        --fill-color: ${fillColor};
        --accent: ${accentColor};
        --underline-color: ${underlineColor};
        --underline-block-width: 200vmax;
        --underline-width: 100%;
      `}
      backgroundImage={`
        linear-gradient(90deg, transparent calc(100% - 1ch), var(--accent) calc(100% - 1ch)),
        linear-gradient(90deg, var(--fill-color), var(--fill-color)),
        linear-gradient(90deg, var(--underline-color), var(--underline-color))`}
      backgroundSize={`
        var(--underline-block-width) var(--underline-width),
        var(--underline-block-width) var(--underline-width),
        100% var(--underline-width)`}
      backgroundRepeat="no-repeat"
      backgroundPositionX="0"
      backgroundPositionY="100%"
      backgroundClip="text"
      animate={ScrollAnimations.fillTextScroll({
        duration: '1s',
        timingFunction: 'linear',
        timeline,
        range,
      })}
    >
      {children}
    </View>
  );

  // Section wrapper with view-timeline
  const Section: React.FC<{
    children: React.ReactNode;
    backgroundColor?: string;
    timelineName?: string;
  }> = ({
    children,
    backgroundColor = 'color-black',
    timelineName = '--section',
  }) => (
    <View
      css={`
        @supports (animation-timeline: scroll()) {
          @media (prefers-reduced-motion: no-preference) {
            view-timeline-name: ${timelineName};
          }
        }
      `}
      backgroundColor={backgroundColor}
    >
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
          <View padding="5ch" textAlign="center" maxWidth={1200}>
            {children}
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View>
      {/* Example 1: Default - Using gray palette */}
      <Section backgroundColor="color-black-900">
        <FillText fontSize={56}>
          Build beautiful scroll-driven animations with pure CSS.
        </FillText>
        <View marginTop={40}>
          <Text
            color="color-whiteAlpha-400"
            fontSize={14}
            fontFamily="monospace"
          >
            Default: var(--color-gray-500), var(--color-white)
          </Text>
        </View>
      </Section>

      {/* Example 2: Blue Theme - Using blue palette */}
      <Section backgroundColor="color-slate-900" timelineName="--blue-section">
        <FillText
          fontSize={48}
          fillColor="var(--color-blue-500)"
          accentColor="var(--color-blue-400)"
          baseColor="color-mix(in srgb, var(--color-blue-500) 15%, transparent)"
          underlineColor="color-mix(in srgb, var(--color-blue-500) 20%, transparent)"
          timeline="--blue-section"
        >
          Create engaging reading experiences with text that reveals as users
          scroll.
        </FillText>
        <View marginTop={40}>
          <Text color="color-blue-400" fontSize={14} fontFamily="monospace">
            Blue: var(--color-blue-500), var(--color-blue-400)
          </Text>
        </View>
      </Section>

      {/* Example 3: Emerald Theme - Using emerald palette */}
      <Section
        backgroundColor="color-emerald.950"
        timelineName="--green-section"
      >
        <FillText
          fontSize={52}
          fillColor="var(--color-emerald-500)"
          accentColor="var(--color-emerald-400)"
          baseColor="color-mix(in srgb, var(--color-emerald-500) 12%, transparent)"
          underlineColor="color-mix(in srgb, var(--color-emerald-500) 20%, transparent)"
          timeline="--green-section"
        >
          Perfect for hero sections, landing pages, and storytelling websites.
        </FillText>
        <View marginTop={40}>
          <Text color="color-emerald-400" fontSize={14} fontFamily="monospace">
            Emerald: var(--color-emerald-500), var(--color-emerald-400)
          </Text>
        </View>
      </Section>

      {/* Example 4: Violet Theme - Using violet palette */}
      <Section
        backgroundColor="color-indigo.950"
        timelineName="--purple-section"
      >
        <FillText
          fontSize={44}
          fillColor="var(--color-violet-500)"
          accentColor="var(--color-violet-400)"
          baseColor="color-mix(in srgb, var(--color-violet-500) 10%, transparent)"
          underlineColor="color-mix(in srgb, var(--color-violet-500) 20%, transparent)"
          timeline="--purple-section"
        >
          The animation progress is driven entirely by CSS scroll-timeline, no
          JavaScript required.
        </FillText>
        <View marginTop={40}>
          <Text color="color-violet-400" fontSize={14} fontFamily="monospace">
            Violet: var(--color-violet-500), var(--color-violet-400)
          </Text>
        </View>
      </Section>

      {/* Example 5: Amber Theme - Using amber palette */}
      <Section
        backgroundColor="color-stone-900"
        timelineName="--orange-section"
      >
        <FillText
          fontSize={60}
          fillColor="var(--color-amber-500)"
          accentColor="var(--color-amber-400)"
          baseColor="color-mix(in srgb, var(--color-amber-500) 10%, transparent)"
          underlineColor="color-mix(in srgb, var(--color-amber-500) 15%, transparent)"
          timeline="--orange-section"
        >
          Make your content stand out.
        </FillText>
        <View marginTop={40}>
          <Text color="color-amber-400" fontSize={14} fontFamily="monospace">
            Amber: var(--color-amber-500), var(--color-amber-400)
          </Text>
        </View>
      </Section>

      {/* Example 6: Light Theme - Using gray on light background */}
      <Section backgroundColor="color-gray.50" timelineName="--light-section">
        <FillText
          fontSize={50}
          fillColor="var(--color-gray-800)"
          accentColor="var(--color-gray-900)"
          baseColor="color-mix(in srgb, var(--color-gray-800) 15%, transparent)"
          underlineColor="color-mix(in srgb, var(--color-gray-800) 10%, transparent)"
          timeline="--light-section"
        >
          Works great on light backgrounds too. The text fills in as you scroll
          through this section.
        </FillText>
        <View marginTop={40}>
          <Text color="color-gray-500" fontSize={14} fontFamily="monospace">
            Light: var(--color-gray-800), var(--color-gray-900)
          </Text>
        </View>
      </Section>

      {/* Example 7: Rose Theme - Using rose palette */}
      <Section backgroundColor="color-stone-900" timelineName="--rose-section">
        <FillText
          fontSize={46}
          fillColor="var(--color-rose-500)"
          accentColor="var(--color-rose-400)"
          baseColor="color-mix(in srgb, var(--color-rose-500) 10%, transparent)"
          underlineColor="color-mix(in srgb, var(--color-rose-500) 15%, transparent)"
          timeline="--rose-section"
        >
          Combine multiple FillText elements for more complex layouts and visual
          hierarchies.
        </FillText>
        <View marginTop={40}>
          <Text color="color-rose-400" fontSize={14} fontFamily="monospace">
            Rose: var(--color-rose-500), var(--color-rose-400)
          </Text>
        </View>
      </Section>

      {/* Example 8: Multi-line with different sizes using white palette */}
      <Section backgroundColor="color-zinc-900" timelineName="--multi-section">
        <View>
          <FillText
            fontSize={72}
            fillColor="var(--color-white)"
            accentColor="var(--color-white)"
            baseColor="color-mix(in srgb, var(--color-white) 8%, transparent)"
            timeline="--multi-section"
          >
            Big Impact.
          </FillText>
        </View>
        <View marginTop={24}>
          <FillText
            fontSize={28}
            fillColor="color-mix(in srgb, var(--color-white) 70%, transparent)"
            accentColor="color-mix(in srgb, var(--color-white) 90%, transparent)"
            baseColor="color-mix(in srgb, var(--color-white) 10%, transparent)"
            timeline="--multi-section"
            range="entry 80% cover 50%, cover 45% exit 0%"
          >
            Smaller supporting text that fills in slightly after the headline.
            Great for creating visual hierarchy.
          </FillText>
        </View>
        <View marginTop={40}>
          <Text
            color="color-whiteAlpha-400"
            fontSize={14}
            fontFamily="monospace"
          >
            Multi-size: staggered ranges with whiteAlpha
          </Text>
        </View>
      </Section>

      {/* Example 9: Theme Colors - Using theme.primary/secondary */}
      <Section backgroundColor="color-dark-900" timelineName="--theme-section">
        <FillText
          fontSize={48}
          fillColor="var(--color-cyan-500)"
          accentColor="var(--color-cyan-400)"
          baseColor="color-mix(in srgb, var(--color-cyan-500) 12%, transparent)"
          underlineColor="color-mix(in srgb, var(--color-cyan-500) 18%, transparent)"
          timeline="--theme-section"
        >
          Use any palette from the theming system: blue, emerald, violet, amber,
          rose, cyan, and more.
        </FillText>
        <View marginTop={40}>
          <Text color="color-cyan-400" fontSize={14} fontFamily="monospace">
            Cyan: var(--color-cyan-500), var(--color-cyan-400)
          </Text>
        </View>
      </Section>

      {/* Footer */}
      <View
        backgroundColor="color-black"
        height="100vh"
        display="grid"
        placeItems="center"
      >
        <View textAlign="center">
          <Text color="color-white" fontSize={24} marginBottom={16}>
            End of FillText Examples
          </Text>
          <Text color="color-whiteAlpha-600" fontSize={14}>
            See docs/Theming.md for all available color palettes
          </Text>
        </View>
      </View>
    </View>
  );
};

FillTextExamples.storyName = 'FillText Examples';

/**
 * All scroll-driven animation presets
 */
export const ScrollDrivenAnimationPresets: ComponentStory<typeof View> = () => {
  const AnimationBlock: React.FC<{
    title: string;
    animate: any;
    backgroundColor?: string;
  }> = ({ title, animate, backgroundColor = 'color-blue-500' }) => (
    <View
      widthHeight={180}
      backgroundColor={backgroundColor}
      animate={animate}
      margin="0 auto"
      borderRadius={12}
      display="flex"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      padding={16}
    >
      <Text color="white" fontWeight="bold" fontSize={14}>
        {title}
      </Text>
    </View>
  );

  const animations = [
    {
      title: 'Fade In Scroll',
      animate: ScrollAnimations.fadeInScroll({ duration: '1s' }),
      color: '#2196f3',
    },
    {
      title: 'Slide In Left Scroll',
      animate: ScrollAnimations.slideInLeftScroll({ duration: '0.5s' }),
      color: '#4caf50',
    },
    {
      title: 'Scale Down Scroll',
      animate: ScrollAnimations.scaleDownScroll({ duration: '0.8s' }),
      color: '#9c27b0',
    },
    {
      title: 'CTA Collapse Scroll',
      animate: ScrollAnimations.ctaCollapseScroll({ duration: '1s' }),
      color: '#00bcd4',
    },
    {
      title: 'Hand Wave Scroll',
      animate: ScrollAnimations.handWaveScroll({ duration: '2s' }),
      color: '#e91e63',
    },
    {
      title: 'Fade Blur Scroll',
      animate: ScrollAnimations.fadeBlurScroll({ duration: '1s' }),
      color: '#ff5722',
    },
    {
      title: 'Unclip Scroll',
      animate: ScrollAnimations.unclipScroll({ duration: '1s' }),
      color: '#795548',
    },
    {
      title: 'Scale Down Article',
      animate: ScrollAnimations.scaleDownArticleScroll({ duration: '1s' }),
      color: '#607d8b',
    },
    {
      title: 'List Item Scale',
      animate: ScrollAnimations.listItemScaleScroll({ duration: '0.5s' }),
      color: '#ffc107',
    },
  ];

  return (
    <View padding={20} minHeight="400vh">
      <StickyHeader
        title="Scroll-Driven Animation Presets"
        description="CSS scroll-timeline animations that progress as you scroll. These require browser support for animation-timeline: scroll()."
      />

      <View height="20vh" />

      {animations.map(({ title, animate, color }) => (
        <View key={title} marginBottom={200}>
          <AnimationBlock
            title={title}
            animate={animate}
            backgroundColor={color}
          />
        </View>
      ))}

      <View height="50vh" />
    </View>
  );
};

ScrollDrivenAnimationPresets.storyName = 'Scroll-Driven Presets';
