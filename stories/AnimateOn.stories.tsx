import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { View, Text } from '../src/index';
import * as Animations from '../src/element/Animation';

export default {
  title: 'Animation/AnimateOn',
  parameters: {
    docs: {
      description: {
        component: `
## animateOn Prop

Control when animations trigger:
- **Both** (default): Animates on mount AND when scrolling into viewport
- **Mount**: Animates only on component mount
- **View**: Animates only when scrolling into viewport

The Both approach provides the best UX - immediate animation on mount plus re-animation on scroll.
        `,
      },
    },
  },
} as ComponentMeta<typeof View>;

/**
 * Default behavior: animations trigger on Both (mount + scroll into viewport)
 */
export const DefaultBehavior: ComponentStory<typeof View> = () => (
  <View padding={20} minHeight="300vh">
    <View
      position="sticky"
      top={0}
      backgroundColor="white"
      padding={20}
      marginBottom={20}
      boxShadow="0 2px 8px rgba(0,0,0,0.1)"
      zIndex={10}
    >
      <Text fontSize={24} fontWeight="bold" marginBottom={8}>
        Default: animateOn="Both"
      </Text>
      <Text color="#666">
        Cards animate on mount AND re-animate when scrolling back into view (no
        animateOn prop needed)
      </Text>
    </View>

    <View height="40vh" />

    {/* These all use the default animateOn="Both" behavior */}
    <View
      animate={Animations.fadeIn({ duration: '0.6s' })}
      backgroundColor="color.blue.500"
      padding={30}
      borderRadius={12}
      marginBottom={60}
    >
      <Text color="white" fontWeight="bold" fontSize={18}>
        Fade In (Default)
      </Text>
      <Text color="white" opacity={0.9}>
        No animateOn prop - automatically uses View timeline
      </Text>
    </View>

    <View
      animate={Animations.slideInUp({ duration: '0.5s' })}
      backgroundColor="color.green.500"
      padding={30}
      borderRadius={12}
      marginBottom={60}
    >
      <Text color="white" fontWeight="bold" fontSize={18}>
        Slide Up (Default)
      </Text>
      <Text color="white" opacity={0.9}>
        Animates when scrolled into view
      </Text>
    </View>

    <View
      animate={Animations.scale({ duration: '0.6s' })}
      backgroundColor="color.purple.500"
      padding={30}
      borderRadius={12}
      marginBottom={60}
    >
      <Text color="white" fontWeight="bold" fontSize={18}>
        Scale (Default)
      </Text>
      <Text color="white" opacity={0.9}>
        Pure CSS animation on scroll
      </Text>
    </View>

    <View height="100vh" />
  </View>
);

/**
 * Explicitly set animateOn="View"
 */
export const ExplicitView: ComponentStory<typeof View> = () => (
  <View padding={20} minHeight="300vh">
    <View
      position="sticky"
      top={0}
      backgroundColor="white"
      padding={20}
      marginBottom={20}
      boxShadow="0 2px 8px rgba(0,0,0,0.1)"
      zIndex={10}
    >
      <Text fontSize={24} fontWeight="bold" marginBottom={8}>
        Explicit animateOn="View"
      </Text>
      <Text color="#666">Same as default, but explicitly declared</Text>
    </View>

    <View height="40vh" />

    <View
      animate={Animations.fadeIn({ duration: '0.8s' })}
      animateOn="View"
      backgroundColor="color.orange.500"
      padding={30}
      borderRadius={12}
      marginBottom={60}
    >
      <Text color="white" fontWeight="bold" fontSize={18}>
        animateOn="View"
      </Text>
      <Text color="white" opacity={0.9}>
        Explicitly set to View (same as default)
      </Text>
    </View>

    <View height="100vh" />
  </View>
);

/**
 * Using animateOn="Mount" for immediate animations
 */
export const MountBehavior: ComponentStory<typeof View> = () => (
  <View padding={20}>
    <Text fontSize={24} fontWeight="bold" marginBottom={16}>
      animateOn="Mount"
    </Text>
    <Text color="#666" marginBottom={40}>
      These cards animate immediately on page load (old behavior)
    </Text>

    {/* These animate on mount */}
    <View
      animate={Animations.fadeIn({ duration: '1s' })}
      animateOn="Mount"
      backgroundColor="color.red.500"
      padding={30}
      borderRadius={12}
      marginBottom={20}
    >
      <Text color="white" fontWeight="bold" fontSize={18}>
        Fade In on Mount
      </Text>
      <Text color="white" opacity={0.9}>
        Animates immediately when component mounts
      </Text>
    </View>

    <View
      animate={Animations.slideInLeft({ duration: '0.8s' })}
      animateOn="Mount"
      backgroundColor="color.pink.500"
      padding={30}
      borderRadius={12}
      marginBottom={20}
    >
      <Text color="white" fontWeight="bold" fontSize={18}>
        Slide In on Mount
      </Text>
      <Text color="white" opacity={0.9}>
        Good for hero sections or above-the-fold content
      </Text>
    </View>

    <View
      animate={Animations.bounce({ duration: '1s' })}
      animateOn="Mount"
      backgroundColor="color.indigo.500"
      padding={30}
      borderRadius={12}
    >
      <Text color="white" fontWeight="bold" fontSize={18}>
        Bounce on Mount
      </Text>
      <Text color="white" opacity={0.9}>
        Attention-grabbing intro animation
      </Text>
    </View>
  </View>
);

/**
 * Comparison of Both vs Mount vs View
 */
export const Comparison: ComponentStory<typeof View> = () => (
  <View padding={20} minHeight="250vh">
    <View
      position="sticky"
      top={0}
      backgroundColor="white"
      padding={20}
      marginBottom={20}
      boxShadow="0 2px 8px rgba(0,0,0,0.1)"
      zIndex={10}
    >
      <Text fontSize={24} fontWeight="bold" marginBottom={8}>
        Both vs Mount vs View
      </Text>
      <Text color="#666">
        Top card (Mount) animates once. Middle card (Both - default) animates on
        mount + scroll. Bottom card (View) only on scroll.
      </Text>
    </View>

    {/* Mount: Animates only once on mount */}
    <View
      animate={Animations.fadeIn({ duration: '1s' })}
      animateOn="Mount"
      backgroundColor="color.blue.500"
      padding={30}
      borderRadius={12}
      marginBottom={40}
    >
      <Text color="white" fontWeight="bold" fontSize={18}>
        animateOn="Mount"
      </Text>
      <Text color="white" opacity={0.9} marginBottom={10}>
        ✅ Animates once on mount
      </Text>
      <Text color="white" opacity={0.9} marginBottom={10}>
        ❌ Won't re-animate on scroll
      </Text>
      <Text color="white" opacity={0.9}>
        📌 Good for one-time intro animations
      </Text>
    </View>

    <View height="60vh" />

    {/* Both: Default - animates on mount AND scroll */}
    <View
      animate={Animations.fadeIn({ duration: '1s' })}
      backgroundColor="color.green.500"
      padding={30}
      borderRadius={12}
      marginBottom={40}
    >
      <Text color="white" fontWeight="bold" fontSize={18}>
        animateOn="Both" (Default)
      </Text>
      <Text color="white" opacity={0.9} marginBottom={10}>
        ✅ Animates on mount
      </Text>
      <Text color="white" opacity={0.9} marginBottom={10}>
        ✅ Re-animates when scrolling back into view
      </Text>
      <Text color="white" opacity={0.9}>
        📌 Best of both worlds!
      </Text>
    </View>

    <View height="60vh" />

    {/* View: Only animates on scroll */}
    <View
      animate={Animations.fadeIn({ duration: '1s' })}
      animateOn="View"
      backgroundColor="color.orange.500"
      padding={30}
      borderRadius={12}
      marginBottom={40}
    >
      <Text color="white" fontWeight="bold" fontSize={18}>
        animateOn="View"
      </Text>
      <Text color="white" opacity={0.9} marginBottom={10}>
        ❌ No animation on mount
      </Text>
      <Text color="white" opacity={0.9} marginBottom={10}>
        ✅ Animates when scrolled into view
      </Text>
      <Text color="white" opacity={0.9}>
        📌 Pure scroll-triggered animations
      </Text>
    </View>

    <View height="40vh" />
  </View>
);

/**
 * Multiple animations with mixed triggers
 */
export const MixedTriggers: ComponentStory<typeof View> = () => (
  <View padding={20} minHeight="300vh">
    <Text fontSize={24} fontWeight="bold" marginBottom={16}>
      Mixed Animation Triggers
    </Text>
    <Text color="#666" marginBottom={40}>
      Hero animates on mount, content cards animate on view
    </Text>

    {/* Hero - animates on mount */}
    <View
      animate={Animations.fadeIn({ duration: '1.2s' })}
      animateOn="Mount"
      backgroundColor="color.purple.600"
      padding={60}
      borderRadius={16}
      marginBottom={60}
      textAlign="center"
    >
      <Text color="white" fontSize={32} fontWeight="bold" marginBottom={16}>
        Hero Section
      </Text>
      <Text color="white" opacity={0.9} fontSize={18}>
        Animates immediately (animateOn="Mount")
      </Text>
    </View>

    <Text fontSize={20} fontWeight="bold" marginBottom={20}>
      Content Cards (Scroll to animate)
    </Text>

    <View height="20vh" />

    {/* Content cards - animate on view */}
    {[1, 2, 3, 4].map((i) => (
      <View
        key={i}
        animate={Animations.slideInUp({ duration: '0.6s' })}
        backgroundColor={`color.${
          ['blue', 'green', 'orange', 'red'][i - 1]
        }.500`}
        padding={30}
        borderRadius={12}
        marginBottom={40}
      >
        <Text color="white" fontWeight="bold" fontSize={18}>
          Card {i} (Default: View)
        </Text>
        <Text color="white" opacity={0.9}>
          Animates when scrolled into viewport
        </Text>
      </View>
    ))}

    <View height="40vh" />
  </View>
);
