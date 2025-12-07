import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { View, Text } from '../src/index';
import {
  // Preset functions
  fadeInOnView,
  fadeOutOnView,
  slideUpOnView,
  slideDownOnView,
  slideLeftOnView,
  slideRightOnView,
  scaleUpOnView,
  scaleDownOnView,
  blurInOnView,
  blurOutOnView,
  rotateInOnView,
  revealOnView,
  flipXOnView,
  flipYOnView,
  // Custom animation creator
  animateOnView,
  createViewAnimation,
  // Preset configs
  viewAnimationPresets,
} from '../src/utils/viewAnimation';
import type { ViewAnimationConfig } from '../src/types/scrollAnimation.types';

export default {
  title: 'Animation/ViewTimeline',
  parameters: {
    docs: {
      description: {
        component: `
## CSS View Timeline Animations

Performant scroll-driven animations using CSS \`animation-timeline: view()\`.

**Key Benefits:**
- ✅ No JavaScript state (useState)
- ✅ No IntersectionObserver overhead
- ✅ No re-renders when elements come into view
- ✅ Runs on compositor thread (smooth 60fps)
- ✅ Respects \`prefers-reduced-motion\`

**Browser Support:**
- Chrome 115+
- Edge 115+
- Safari 17.4+
- Firefox 110+ (partial)
        `,
      },
    },
  },
} as ComponentMeta<typeof View>;

// Helper component for demo cards
const AnimationCard: React.FC<{
  title: string;
  description: string;
  animate: any;
  backgroundColor?: string;
}> = ({ title, description, animate, backgroundColor = 'color.blue.500' }) => (
  <View
    animate={animate}
    backgroundColor={backgroundColor}
    padding={30}
    borderRadius={12}
    marginBottom={40}
    boxShadow="0 4px 20px rgba(0,0,0,0.1)"
  >
    <Text color="white" fontSize={20} fontWeight="bold" marginBottom={8}>
      {title}
    </Text>
    <Text color="white" opacity={0.9}>
      {description}
    </Text>
  </View>
);

/**
 * All preset view animations in one demo
 */
export const AllPresets: ComponentStory<typeof View> = () => (
  <View padding={20} minHeight="400vh">
    <View
      position="sticky"
      top={0}
      backgroundColor="white"
      padding={20}
      zIndex={10}
      marginBottom={20}
    >
      <Text fontSize={28} fontWeight="bold" marginBottom={8}>
        🎬 CSS View Timeline Animations
      </Text>
      <Text color="#666">
        Scroll down to see each animation. No JS state changes - pure CSS!
      </Text>
    </View>

    <View height="30vh" />

    {/* Fade animations */}
    <Text fontSize={22} fontWeight="bold" marginBottom={20}>
      Fade Animations
    </Text>

    <AnimationCard
      title="fadeInOnView()"
      description="Element fades in when entering the viewport"
      animate={fadeInOnView()}
      backgroundColor="color.blue.500"
    />

    <AnimationCard
      title="fadeInOnView({ duration: '1.5s' })"
      description="Slower fade with custom duration"
      animate={fadeInOnView({ duration: '1.5s' })}
      backgroundColor="color.blue.600"
    />

    <View height="20vh" />

    {/* Slide animations */}
    <Text fontSize={22} fontWeight="bold" marginBottom={20}>
      Slide Animations
    </Text>

    <AnimationCard
      title="slideUpOnView()"
      description="Slides up while fading in"
      animate={slideUpOnView()}
      backgroundColor="color.green.500"
    />

    <AnimationCard
      title="slideUpOnView({ distance: '60px' })"
      description="Larger slide distance"
      animate={slideUpOnView({ distance: '60px' })}
      backgroundColor="color.green.600"
    />

    <AnimationCard
      title="slideDownOnView()"
      description="Slides down while fading in"
      animate={slideDownOnView()}
      backgroundColor="color.teal.500"
    />

    <AnimationCard
      title="slideLeftOnView()"
      description="Slides in from the left"
      animate={slideLeftOnView()}
      backgroundColor="color.cyan.500"
    />

    <AnimationCard
      title="slideRightOnView()"
      description="Slides in from the right"
      animate={slideRightOnView()}
      backgroundColor="color.cyan.600"
    />

    <View height="20vh" />

    {/* Scale animations */}
    <Text fontSize={22} fontWeight="bold" marginBottom={20}>
      Scale Animations
    </Text>

    <AnimationCard
      title="scaleUpOnView()"
      description="Scales up from 0.9 to 1.0"
      animate={scaleUpOnView()}
      backgroundColor="color.purple.500"
    />

    <AnimationCard
      title="scaleUpOnView({ scale: 0.7 })"
      description="More dramatic scale from 0.7"
      animate={scaleUpOnView({ scale: 0.7 })}
      backgroundColor="color.purple.600"
    />

    <AnimationCard
      title="scaleDownOnView({ scale: 1.2 })"
      description="Scales down from 1.2 to 1.0"
      animate={scaleDownOnView({ scale: 1.2 })}
      backgroundColor="color.indigo.500"
    />

    <View height="20vh" />

    {/* Blur animations */}
    <Text fontSize={22} fontWeight="bold" marginBottom={20}>
      Blur Animations
    </Text>

    <AnimationCard
      title="blurInOnView()"
      description="Blurs in when entering viewport"
      animate={blurInOnView()}
      backgroundColor="color.orange.500"
    />

    <AnimationCard
      title="blurInOnView({ blur: '20px' })"
      description="Stronger blur effect"
      animate={blurInOnView({ blur: '20px' })}
      backgroundColor="color.orange.600"
    />

    <View height="20vh" />

    {/* Special effects */}
    <Text fontSize={22} fontWeight="bold" marginBottom={20}>
      Special Effects
    </Text>

    <AnimationCard
      title="rotateInOnView()"
      description="Rotates and scales in"
      animate={rotateInOnView()}
      backgroundColor="color.red.500"
    />

    <AnimationCard
      title="rotateInOnView({ angle: '-20deg' })"
      description="Larger rotation angle"
      animate={rotateInOnView({ angle: '-20deg' })}
      backgroundColor="color.red.600"
    />

    <AnimationCard
      title="revealOnView()"
      description="Clip-path reveal from bottom"
      animate={revealOnView()}
      backgroundColor="color.pink.500"
    />

    <AnimationCard
      title="flipXOnView()"
      description="3D flip on X axis"
      animate={flipXOnView()}
      backgroundColor="color.rose.500"
    />

    <AnimationCard
      title="flipYOnView()"
      description="3D flip on Y axis"
      animate={flipYOnView()}
      backgroundColor="color.rose.600"
    />

    <View height="100vh" />
  </View>
);

/**
 * Custom JSON-configured animation
 */
export const CustomAnimation: ComponentStory<typeof View> = () => {
  // Define custom animations as JSON
  const bounceIn: ViewAnimationConfig = {
    keyframes: {
      from: {
        opacity: 0,
        transform: 'scale(0.3)',
      },
      '50%': {
        transform: 'scale(1.1)',
      },
      to: {
        opacity: 1,
        transform: 'scale(1)',
      },
    },
    timing: {
      duration: '0.8s',
      timingFunction: 'ease-out',
    },
    range: 'entry',
  };

  const swingIn: ViewAnimationConfig = {
    keyframes: {
      from: {
        opacity: 0,
        transform: 'perspective(400px) rotateY(-90deg)',
      },
      '50%': {
        transform: 'perspective(400px) rotateY(20deg)',
      },
      to: {
        opacity: 1,
        transform: 'perspective(400px) rotateY(0)',
      },
    },
    timing: {
      duration: '1s',
      timingFunction: 'ease-out',
    },
    range: 'entry 0% entry 100%',
  };

  const glowIn: ViewAnimationConfig = {
    keyframes: {
      from: {
        opacity: 0,
        boxShadow: '0 0 0 rgba(99, 102, 241, 0)',
      },
      to: {
        opacity: 1,
        boxShadow: '0 0 30px rgba(99, 102, 241, 0.5)',
      },
    },
    timing: {
      duration: '0.8s',
      timingFunction: 'ease-out',
    },
    range: 'entry',
  };

  return (
    <View padding={20} minHeight="300vh">
      <View
        position="sticky"
        top={0}
        backgroundColor="white"
        padding={20}
        zIndex={10}
        marginBottom={20}
      >
        <Text fontSize={28} fontWeight="bold" marginBottom={8}>
          🎨 Custom JSON Animations
        </Text>
        <Text color="#666">
          Define animations as JSON configurations for reusability
        </Text>
      </View>

      <View height="30vh" />

      <View
        animate={animateOnView(bounceIn)}
        backgroundColor="color.indigo.500"
        padding={40}
        borderRadius={16}
        marginBottom={60}
      >
        <Text color="white" fontSize={20} fontWeight="bold">
          Bounce In
        </Text>
        <Text color="white" opacity={0.9}>
          Custom keyframes with 50% intermediate state
        </Text>
      </View>

      <View
        animate={createViewAnimation(swingIn)}
        backgroundColor="color.violet.500"
        padding={40}
        borderRadius={16}
        marginBottom={60}
      >
        <Text color="white" fontSize={20} fontWeight="bold">
          Swing In
        </Text>
        <Text color="white" opacity={0.9}>
          3D rotation with perspective
        </Text>
      </View>

      <View
        animate={animateOnView(glowIn)}
        backgroundColor="color.purple.900"
        padding={40}
        borderRadius={16}
        marginBottom={60}
      >
        <Text color="white" fontSize={20} fontWeight="bold">
          Glow In
        </Text>
        <Text color="white" opacity={0.9}>
          Animated box-shadow glow effect
        </Text>
      </View>

      <View height="100vh" />
    </View>
  );
};

/**
 * Using viewAnimationPresets - JSON configs
 */
export const UsingPresets: ComponentStory<typeof View> = () => (
  <View padding={20} minHeight="400vh">
    <View
      position="sticky"
      top={0}
      backgroundColor="white"
      padding={20}
      zIndex={10}
      marginBottom={20}
    >
      <Text fontSize={28} fontWeight="bold" marginBottom={8}>
        📦 Using Preset Configurations
      </Text>
      <Text color="#666">
        viewAnimationPresets provides JSON configs you can customize
      </Text>
    </View>

    <View height="30vh" />

    {Object.entries(viewAnimationPresets).map(([name, preset], index) => (
      <View
        key={name}
        animate={createViewAnimation(preset)}
        backgroundColor={
          [
            'color.blue.500',
            'color.green.500',
            'color.purple.500',
            'color.orange.500',
            'color.red.500',
            'color.teal.500',
            'color.pink.500',
          ][index % 7]
        }
        padding={30}
        borderRadius={12}
        marginBottom={60}
        boxShadow="0 4px 20px rgba(0,0,0,0.1)"
      >
        <Text color="white" fontSize={18} fontWeight="bold" marginBottom={4}>
          viewAnimationPresets.{name}
        </Text>
        <Text color="white" opacity={0.8} fontSize={14} fontFamily="monospace">
          range: &quot;{preset.range}&quot; | duration:{' '}
          {preset.timing?.duration}
        </Text>
      </View>
    ))}

    <View height="100vh" />
  </View>
);

/**
 * Staggered animations with delay
 */
export const StaggeredAnimations: ComponentStory<typeof View> = () => (
  <View padding={20} minHeight="300vh">
    <View
      position="sticky"
      top={0}
      backgroundColor="white"
      padding={20}
      zIndex={10}
      marginBottom={20}
    >
      <Text fontSize={28} fontWeight="bold" marginBottom={8}>
        ⏱️ Staggered Animations
      </Text>
      <Text color="#666">Use delay to create staggered animation effects</Text>
    </View>

    <View height="40vh" />

    <View display="flex" gap={20} flexWrap="wrap">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <View
          key={i}
          flex="1"
          minWidth={150}
          animate={slideUpOnView({ delay: `${i * 0.1}s`, duration: '0.5s' })}
          backgroundColor="color.indigo.500"
          padding={30}
          borderRadius={12}
          textAlign="center"
        >
          <Text color="white" fontSize={32} fontWeight="bold">
            {i + 1}
          </Text>
          <Text color="white" opacity={0.8} fontSize={12}>
            delay: {i * 0.1}s
          </Text>
        </View>
      ))}
    </View>

    <View height="40vh" />

    <Text fontSize={20} fontWeight="bold" marginBottom={20}>
      Cards with staggered fade
    </Text>

    <View display="flex" flexDirection="column" gap={20}>
      {['First', 'Second', 'Third', 'Fourth'].map((text, i) => (
        <View
          key={text}
          animate={fadeInOnView({ delay: `${i * 0.15}s` })}
          backgroundColor="color.purple.500"
          padding={25}
          borderRadius={8}
        >
          <Text color="white" fontWeight="bold">
            {text} Card
          </Text>
          <Text color="white" opacity={0.8}>
            Fades in with {i * 0.15}s delay
          </Text>
        </View>
      ))}
    </View>

    <View height="100vh" />
  </View>
);

/**
 * Performance comparison demonstration
 */
export const PerformanceBenefits: ComponentStory<typeof View> = () => (
  <View padding={20} minHeight="200vh">
    <View
      position="sticky"
      top={0}
      backgroundColor="white"
      padding={20}
      zIndex={10}
      marginBottom={20}
    >
      <Text fontSize={28} fontWeight="bold" marginBottom={8}>
        🚀 Performance Benefits
      </Text>
      <Text color="#666">
        CSS view() timeline vs JavaScript IntersectionObserver
      </Text>
    </View>

    <View height="40vh" />

    <View display="flex" gap={30} flexWrap="wrap">
      <View
        flex="1"
        minWidth={300}
        animate={fadeInOnView({ duration: '1s' })}
        backgroundColor="color.green.500"
        padding={30}
        borderRadius={12}
      >
        <Text color="white" fontSize={22} fontWeight="bold" marginBottom={16}>
          ✅ CSS view() Timeline
        </Text>
        <View as="ul" padding={0} margin={0}>
          <Text as="li" color="white" marginBottom={8}>
            • No useState hook
          </Text>
          <Text as="li" color="white" marginBottom={8}>
            • No IntersectionObserver in JS
          </Text>
          <Text as="li" color="white" marginBottom={8}>
            • No component re-renders
          </Text>
          <Text as="li" color="white" marginBottom={8}>
            • Runs on compositor thread
          </Text>
          <Text as="li" color="white" marginBottom={8}>
            • Automatic memory management
          </Text>
          <Text as="li" color="white">
            • Respects prefers-reduced-motion
          </Text>
        </View>
      </View>

      <View
        flex="1"
        minWidth={300}
        animate={fadeInOnView({ duration: '1s', delay: '0.2s' })}
        backgroundColor="color.gray.600"
        padding={30}
        borderRadius={12}
      >
        <Text color="white" fontSize={22} fontWeight="bold" marginBottom={16}>
          ⚠️ Old animateIn (JS-based)
        </Text>
        <View as="ul" padding={0} margin={0}>
          <Text as="li" color="white" marginBottom={8}>
            • Uses useState for visibility
          </Text>
          <Text as="li" color="white" marginBottom={8}>
            • Creates IntersectionObserver
          </Text>
          <Text as="li" color="white" marginBottom={8}>
            • Triggers re-render on visible
          </Text>
          <Text as="li" color="white" marginBottom={8}>
            • Runs on main thread
          </Text>
          <Text as="li" color="white" marginBottom={8}>
            • Manual cleanup needed
          </Text>
          <Text as="li" color="white">
            • Extra JS bundle size
          </Text>
        </View>
      </View>
    </View>

    <View height="60vh" />

    <View
      animate={scaleUpOnView()}
      backgroundColor="color.indigo.500"
      padding={40}
      borderRadius={16}
      textAlign="center"
    >
      <Text color="white" fontSize={24} fontWeight="bold" marginBottom={8}>
        🎯 Result
      </Text>
      <Text color="white" opacity={0.9} fontSize={18}>
        Buttery smooth 60fps animations with zero JavaScript overhead
      </Text>
    </View>

    <View height="100vh" />
  </View>
);

/**
 * Grid layout with mixed animations
 */
export const AnimatedGrid: ComponentStory<typeof View> = () => {
  const animations = [
    { fn: fadeInOnView, name: 'Fade' },
    { fn: slideUpOnView, name: 'Slide Up' },
    { fn: scaleUpOnView, name: 'Scale' },
    { fn: blurInOnView, name: 'Blur' },
    { fn: rotateInOnView, name: 'Rotate' },
    { fn: flipXOnView, name: 'Flip X' },
    { fn: slideLeftOnView, name: 'Slide Left' },
    { fn: slideRightOnView, name: 'Slide Right' },
    { fn: revealOnView, name: 'Reveal' },
  ];

  const colors = [
    'color.blue.500',
    'color.green.500',
    'color.purple.500',
    'color.orange.500',
    'color.red.500',
    'color.pink.500',
    'color.teal.500',
    'color.indigo.500',
    'color.cyan.500',
  ];

  return (
    <View padding={20} minHeight="300vh">
      <View
        position="sticky"
        top={0}
        backgroundColor="white"
        padding={20}
        zIndex={10}
        marginBottom={20}
      >
        <Text fontSize={28} fontWeight="bold" marginBottom={8}>
          🎨 Animated Grid
        </Text>
        <Text color="#666">Each card uses a different animation preset</Text>
      </View>

      <View height="30vh" />

      <View
        display="grid"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
        }}
      >
        {animations.map((anim, i) => (
          <View
            key={anim.name}
            animate={anim.fn({ delay: `${i * 0.05}s` })}
            backgroundColor={colors[i]}
            padding={30}
            borderRadius={12}
            textAlign="center"
            minHeight={150}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Text
              color="white"
              fontSize={20}
              fontWeight="bold"
              marginBottom={8}
            >
              {anim.name}
            </Text>
            <Text color="white" opacity={0.8} fontSize={14}>
              {anim.fn.name}()
            </Text>
          </View>
        ))}
      </View>

      <View height="100vh" />
    </View>
  );
};

/**
 * Entry and Exit animations
 */
export const EntryAndExit: ComponentStory<typeof View> = () => (
  <View padding={20} minHeight="400vh">
    <View
      position="sticky"
      top={0}
      backgroundColor="white"
      padding={20}
      zIndex={10}
      marginBottom={20}
    >
      <Text fontSize={28} fontWeight="bold" marginBottom={8}>
        🔄 Entry &amp; Exit Animations
      </Text>
      <Text color="#666">
        Different animations for entering and exiting the viewport
      </Text>
    </View>

    <View height="40vh" />

    <View
      animate={[
        fadeInOnView({ range: 'entry' }),
        fadeOutOnView({ range: 'exit' }),
      ]}
      backgroundColor="color.blue.500"
      padding={40}
      borderRadius={12}
      marginBottom={100}
    >
      <Text color="white" fontSize={20} fontWeight="bold">
        Fade In / Fade Out
      </Text>
      <Text color="white" opacity={0.9}>
        Fades in on entry, fades out on exit
      </Text>
    </View>

    <View
      animate={[
        slideUpOnView({ range: 'entry' }),
        blurOutOnView({ range: 'exit' }),
      ]}
      backgroundColor="color.purple.500"
      padding={40}
      borderRadius={12}
      marginBottom={100}
    >
      <Text color="white" fontSize={20} fontWeight="bold">
        Slide Up / Blur Out
      </Text>
      <Text color="white" opacity={0.9}>
        Slides up on entry, blurs on exit
      </Text>
    </View>

    <View
      animate={[
        scaleUpOnView({ range: 'entry' }),
        fadeOutOnView({ range: 'exit' }),
      ]}
      backgroundColor="color.green.500"
      padding={40}
      borderRadius={12}
      marginBottom={100}
    >
      <Text color="white" fontSize={20} fontWeight="bold">
        Scale Up / Fade Out
      </Text>
      <Text color="white" opacity={0.9}>
        Scales up on entry, fades on exit
      </Text>
    </View>

    <View height="100vh" />
  </View>
);
