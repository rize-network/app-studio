import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { View, Text } from '../src/index';
import { useRef, useMemo } from 'react';
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

// =============================================================================
// SCROLL TEXT REVEAL COMPONENTS
// =============================================================================

const Vertical = (props: any) => (
  <View display="flex" flexDirection="column" {...props} />
);

/**
 * ScrollTextReveal - A character-by-character scroll-driven text reveal animation
 * 
 * Works with app-studio's styling system and useScroll hook.
 * Text stays sticky while scrolling, and each character's opacity
 * animates based on scroll progress.
 */

interface ScrollTextRevealProps {
  /** Array of paragraphs to animate */
  paragraphs: string[];
  /** Base opacity for unrevealed characters (0-1) */
  baseOpacity?: number;
  /** Fill opacity for revealed characters (0-1) */
  fillOpacity?: number;
  /** Height of the scroll container (creates scroll distance) */
  scrollHeight?: string;
  /** Font size for the text */
  fontSize?: number | string;
  /** Font weight for the text */
  fontWeight?: number | string;
  /** Color for revealed text (app-studio color token) */
  fillColor?: string;
  /** Color for unrevealed text (app-studio color token) */
  baseColor?: string;
  /** Gap between paragraphs */
  gap?: number;
  /** Maximum width of text container */
  maxWidth?: number | string;
}

const ScrollTextReveal = ({
  paragraphs,
  baseOpacity = 0.1,
  fillOpacity = 1,
  scrollHeight = '300vh',
  fontSize = 26,
  fontWeight = 500,
  fillColor = 'color-white',
  baseColor = 'color-white',
  gap = 30,
  maxWidth = 800,
}: ScrollTextRevealProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  /* 
   Ideally, 'useScroll' tracks the container's own scroll position. 
   Here, we track the *element's progress* through the viewport.
   The updated useScroll now provides 'elementProgress' for this exact sticky case.
   */
  const { elementProgress } = useScroll({ 
    container: wrapperRef,
    throttleMs: 16 
  });

  // Use the hook's returned progress directly, defaulting to 0
  const progress = elementProgress || 0;

  // Count total characters across all paragraphs
  const totalChars = useMemo(() => 
    paragraphs.reduce((sum, p) => sum + p.replace(/\s/g, '').length, 0),
    [paragraphs]
  );
  
  // Track character index across paragraphs
  let globalCharIndex = 0;

  return (
    <View
      ref={wrapperRef}
      height={scrollHeight}
      position="relative"
    >
      <View
        position="sticky"
        top={0}
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        padding={20}
      >
        <Vertical
          gap={gap}
          textAlign="center"
          maxWidth={maxWidth}
          width="100%"
        >
          {paragraphs.map((paragraph, pIndex) => {
            const words = paragraph.split(' ');
            
            return (
              <Text
                key={pIndex}
                as="p"
                fontSize={fontSize}
                fontWeight={fontWeight}
                lineHeight={16}
                margin={0}
              >
                {words.map((word, wIndex) => (
                  <View
                    key={wIndex}
                    as="span"
                    display="inline-block"
                  >
                    {word.split('').map((char, cIndex) => {
                      const currentCharIndex = globalCharIndex++;
                      const charProgress = currentCharIndex / totalChars;
                      
                      // Smooth transition zone
                      const transitionWidth = 0.05; // Slightly wider for smoother effect
                      let opacity: number;
                      
                      // Calculate opacity based on progress vs char position
                      if (progress > charProgress + transitionWidth) {
                         opacity = fillOpacity;
                      } else if (progress < charProgress - transitionWidth) {
                         opacity = baseOpacity;
                      } else {
                         // Interpolate
                         const t = (progress - (charProgress - transitionWidth)) / (2 * transitionWidth);
                         opacity = baseOpacity + (fillOpacity - baseOpacity) * t;
                      }

                      return (
                        <View
                          key={cIndex}
                          as="span"
                          display="inline-block"
                          color={opacity > 0.5 ? fillColor : baseColor}
                          opacity={opacity}
                          transition="color 0.1s ease-out, opacity 0.1s ease-out"
                        >
                          {char}
                        </View>
                      );
                    })}
                    {wIndex < words.length - 1 && (
                      <View as="span" display="inline">&nbsp;</View>
                    )}
                  </View>
                ))}
              </Text>
            );
          })}
        </Vertical>
      </View>
    </View>
  );
};

/**
 * ScrollTextRevealSection - Complete section with scroll text reveal
 * 
 * A pre-configured section that handles the scroll container setup
 * with proper height and sticky positioning.
 */

interface ScrollTextRevealSectionProps extends ScrollTextRevealProps {
  /** Background color for the section (app-studio color token) */
  backgroundColor?: string;
}

const ScrollTextRevealSection = ({
  backgroundColor = 'color-black',
  ...props
}: ScrollTextRevealSectionProps) => {
  return (
    <View backgroundColor={backgroundColor}>
      <ScrollTextReveal {...props} />
    </View>
  );
};

// =============================================================================
// ALTERNATIVE: Using CSS Scroll-Driven Animations (Pure CSS approach)
// =============================================================================

/**
 * FillTextScrollReveal - Uses app-studio's Animation.fillTextScroll() 
 * for a pure CSS scroll-driven text fill effect.
 * 
 * This approach uses CSS animation-timeline: scroll() and is more performant
 * but has different visual characteristics (sweep fill vs character opacity).
 */

interface FillTextScrollRevealProps {
  /** Text content to animate */
  children: string;
  /** Color palette to use */
  color?: 'blue' | 'emerald' | 'violet' | 'amber' | 'rose' | 'cyan' | 'gray';
  /** Font size */
  fontSize?: number | string;
  /** Font weight */
  fontWeight?: number | string;
  /** Custom timeline name */
  timeline?: string;
  /** Animation range */
  range?: string;
}

const FillTextScrollReveal = ({
  children,
  color = 'blue',
  fontSize = 48,
  fontWeight = 'bold',
  timeline = '--section',
  range = 'entry 100% cover 55%',
}: FillTextScrollRevealProps) => {
  // Color configurations for different palettes
  const colorConfigs = {
    blue: {
      fill: 'var(--color-blue-500)',
      accent: 'var(--color-blue-400)',
      base: 'color-mix(in srgb, var(--color-blue-500) 15%, transparent)',
    },
    emerald: {
      fill: 'var(--color-emerald-500)',
      accent: 'var(--color-emerald-400)',
      base: 'color-mix(in srgb, var(--color-emerald-500) 12%, transparent)',
    },
    violet: {
      fill: 'var(--color-violet-500)',
      accent: 'var(--color-violet-400)',
      base: 'color-mix(in srgb, var(--color-violet-500) 10%, transparent)',
    },
    amber: {
      fill: 'var(--color-amber-500)',
      accent: 'var(--color-amber-400)',
      base: 'color-mix(in srgb, var(--color-amber-500) 12%, transparent)',
    },
    rose: {
      fill: 'var(--color-rose-500)',
      accent: 'var(--color-rose-400)',
      base: 'color-mix(in srgb, var(--color-rose-500) 12%, transparent)',
    },
    cyan: {
      fill: 'var(--color-cyan-500)',
      accent: 'var(--color-cyan-400)',
      base: 'color-mix(in srgb, var(--color-cyan-500) 12%, transparent)',
    },
    gray: {
      fill: 'var(--color-gray-100)',
      accent: 'var(--color-gray-200)',
      base: 'color-mix(in srgb, var(--color-gray-100) 15%, transparent)',
    },
  };

  const { fill, accent, base } = colorConfigs[color] || colorConfigs.blue;

  return (
    <View
      as="span"
      fontSize={fontSize}
      fontWeight={fontWeight}
      css={`
        color: ${base};
        --fill-color: ${fill};
        --accent: ${accent};
        --underline-block-width: 200vmax;
        --underline-width: 100%;
      `}
      backgroundImage={`
        linear-gradient(90deg, transparent calc(100% - 1ch), var(--accent) calc(100% - 1ch)),
        linear-gradient(90deg, var(--fill-color), var(--fill-color))`}
      backgroundSize={`
        var(--underline-block-width) var(--underline-width),
        var(--underline-block-width) var(--underline-width)`}
      backgroundRepeat="no-repeat"
      backgroundPositionX="0"
      backgroundPositionY="100%"
      backgroundClip="text"
      animate={{
        timeline: timeline,
        range: range,
        keyframes: {
          from: { backgroundSize: '0% 100%, 0% 100%' },
          to: { backgroundSize: '200vmax 100%, 200vmax 100%' },
        },
      }}
    >
      {children}
    </View>
  );
};

// =============================================================================
// STORIES
// =============================================================================

export const ScrollTextRevealStory: ComponentStory<typeof View> = () => {
  const demoParagraphs = [
    "Small businesses don't need more software, they need ones built around how they actually work.",
    "We build focused apps that solve one problem perfectly and connect to the rest of their stack.",
    "Allo handles calls. Claim tracks expenses. Due manages invoices. Solving every problem that slows small teams down, one app at a time."
  ];

  const secondDemo = [
    "Design is not just what it looks like and feels like.",
    "Design is how it works.",
    "— Steve Jobs"
  ];

  return (
    <View backgroundColor="color-black" minHeight="100vh">
      {/* Hero Section */}
      <View
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Vertical alignItems="center" gap={20}>
          <Text
            fontSize={56}
            fontWeight="bold"
            color="color-white"
            textAlign="center"
          >
            Scroll Text Reveal
          </Text>
          <Text fontSize={20} color="color-gray-400" textAlign="center">
            Scroll down to see the animation
          </Text>
          <Text fontSize={24} color="color-gray-600" marginTop={40}>
            ↓
          </Text>
        </Vertical>
      </View>

      {/* First Demo */}
      <ScrollTextRevealSection
        paragraphs={demoParagraphs}
        backgroundColor="color-black"
        fillColor="color-white"
        baseColor="color-white"
        baseOpacity={0.1}
        fillOpacity={1}
        fontSize={26}
        fontWeight={500}
        gap={30}
        maxWidth={800}
      />

      {/* Spacer */}
      <View
        height="50vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text color="color-gray-600" fontSize={18}>
          Keep scrolling...
        </Text>
      </View>

      {/* Second Demo - Quote */}
      <ScrollTextRevealSection
        paragraphs={secondDemo}
        backgroundColor="color-gray-900"
        fillColor="color-blue-400"
        baseColor="color-blue-400"
        baseOpacity={0.15}
        fillOpacity={1}
        fontSize={32}
        fontWeight={600}
        gap={20}
        maxWidth={600}
      />

      {/* Footer */}
      <View
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        backgroundColor="color-black"
      >
        <Vertical alignItems="center" gap={16}>
          <Text fontSize={40} fontWeight="bold" color="color-white">
            That's it!
          </Text>
          <Text color="color-gray-400">
            Scroll back up to replay
          </Text>
        </Vertical>
      </View>
    </View>
  );
};
ScrollTextRevealStory.storyName = 'JS Scroll Text Reveal';

export const FillTextScrollRevealStory: ComponentStory<typeof View> = () => {
    // Section wrapper with view-timeline
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
      <View padding={40} backgroundColor="color-black" textAlign="center">
        <Text color="white" fontSize={32} fontWeight="bold">CSS Scroll-Driven Examples</Text>
      </View>
      
      <Section backgroundColor="color-slate-900">
        <FillTextScrollReveal color="blue">
            CSS-driven animations are performant and smooth.
        </FillTextScrollReveal>
      </Section>

      <Section backgroundColor="color-emerald-950">
        <FillTextScrollReveal color="emerald">
            Perfect for hero sections and storytelling.
        </FillTextScrollReveal>
      </Section>

      <Section backgroundColor="color-indigo-950">
        <FillTextScrollReveal color="violet">
            Driven entirely by CSS scroll-timeline.
        </FillTextScrollReveal>
      </Section>

      <Section backgroundColor="color-stone-900">
        <FillTextScrollReveal color="amber">
            Make your content stand out.
        </FillTextScrollReveal>
      </Section>
      
      <Section backgroundColor="color-dark-900">
        <FillTextScrollReveal color="cyan">
            Works with any theme palette.
        </FillTextScrollReveal>
      </Section>

      <Section backgroundColor="color-stone-900">
        <FillTextScrollReveal color="rose">
            They work using view-timeline and scroll-timeline.
        </FillTextScrollReveal>
      </Section>
    </View>
  );
};
FillTextScrollRevealStory.storyName = 'CSS Scroll Text Reveal';

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
