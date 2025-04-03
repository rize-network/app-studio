import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { View } from '../src/index';
import * as ScrollAnimations from '../src/element/Animation';

const AnimationBlock: React.FC<{
  title: string;
  animate: any;
  backgroundColor?: string;
}> = ({ title, animate, backgroundColor = 'color.blue' }) => (
  <View
    wxh={150}
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
      --fill: hsl(0 0% 50%);

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
            text-decoration="none"
            backgroundImage="
              linear-gradient(90deg, transparent calc(100% - 1ch), var(--accent) calc(100%  - 1ch)),
              linear-gradient(90deg, var(--fill), var(--fill)),
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
