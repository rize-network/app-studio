/**
 * View Animation Utilities
 *
 * Create performant CSS scroll-driven animations using view() timeline.
 * These animations are pure CSS - no JavaScript state or IntersectionObserver needed!
 */

import {
  ViewAnimationConfig,
  ViewAnimationOptions,
  SlideAnimationOptions,
  ScaleAnimationOptions,
  BlurAnimationOptions,
  RotateAnimationOptions,
} from '../types/scrollAnimation.types';
import { AnimationProps } from './constants';

/**
 * Convert ViewAnimationConfig to AnimationProps with view() timeline
 * This enables CSS-only animations without JavaScript state
 *
 * @example
 * <View animate={createViewAnimation({
 *   keyframes: { from: { opacity: 0 }, to: { opacity: 1 } },
 *   range: 'entry'
 * })} />
 */
export const createViewAnimation = (
  config: ViewAnimationConfig
): AnimationProps => {
  const { keyframes, timing = {}, range = 'entry' } = config;

  return {
    ...keyframes,
    duration: timing.duration || '0.6s',
    timingFunction: timing.timingFunction || 'ease',
    fillMode: timing.fillMode || 'both',
    delay: timing.delay,
    timeline: 'view()', // CSS view() timeline - pure CSS, no JS!
    range,
  };
};

/**
 * Create an animation that triggers when element enters viewport
 * Uses CSS view() timeline - NO JavaScript state required!
 *
 * @example
 * <View animate={animateOnView({
 *   keyframes: { from: { opacity: 0 }, to: { opacity: 1 } },
 *   range: 'entry'
 * })} />
 */
export const animateOnView = (config: ViewAnimationConfig): AnimationProps => {
  return createViewAnimation(config);
};

/**
 * Preset: Fade in when entering viewport
 *
 * @example
 * <View animate={fadeInOnView()} />
 * <View animate={fadeInOnView({ duration: '1s' })} />
 */
export const fadeInOnView = (
  options: ViewAnimationOptions = {}
): AnimationProps =>
  animateOnView({
    keyframes: { from: { opacity: 0 }, to: { opacity: 1 } },
    timing: {
      duration: options.duration || '0.5s',
      timingFunction: options.timingFunction || 'ease',
      delay: options.delay,
    },
    range: options.range || 'entry',
  });

/**
 * Preset: Fade out when exiting viewport
 *
 * @example
 * <View animate={fadeOutOnView()} />
 */
export const fadeOutOnView = (
  options: ViewAnimationOptions = {}
): AnimationProps =>
  animateOnView({
    keyframes: { from: { opacity: 1 }, to: { opacity: 0 } },
    timing: {
      duration: options.duration || '0.5s',
      timingFunction: options.timingFunction || 'ease',
      delay: options.delay,
    },
    range: options.range || 'exit',
  });

/**
 * Preset: Slide up and fade in when entering viewport
 *
 * @example
 * <View animate={slideUpOnView()} />
 * <View animate={slideUpOnView({ distance: '50px', duration: '0.8s' })} />
 */
export const slideUpOnView = (
  options: SlideAnimationOptions = {}
): AnimationProps =>
  animateOnView({
    keyframes: {
      from: {
        opacity: 0,
        transform: `translateY(${options.distance || '30px'})`,
      },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
    timing: {
      duration: options.duration || '0.6s',
      timingFunction: options.timingFunction || 'ease-out',
      delay: options.delay,
    },
    range: options.range || 'entry',
  });

/**
 * Preset: Slide down and fade in when entering viewport
 *
 * @example
 * <View animate={slideDownOnView()} />
 */
export const slideDownOnView = (
  options: SlideAnimationOptions = {}
): AnimationProps =>
  animateOnView({
    keyframes: {
      from: {
        opacity: 0,
        transform: `translateY(-${options.distance || '30px'})`,
      },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
    timing: {
      duration: options.duration || '0.6s',
      timingFunction: options.timingFunction || 'ease-out',
      delay: options.delay,
    },
    range: options.range || 'entry',
  });

/**
 * Preset: Slide in from left when entering viewport
 *
 * @example
 * <View animate={slideLeftOnView()} />
 */
export const slideLeftOnView = (
  options: SlideAnimationOptions = {}
): AnimationProps =>
  animateOnView({
    keyframes: {
      from: {
        opacity: 0,
        transform: `translateX(-${options.distance || '50px'})`,
      },
      to: { opacity: 1, transform: 'translateX(0)' },
    },
    timing: {
      duration: options.duration || '0.6s',
      timingFunction: options.timingFunction || 'ease-out',
      delay: options.delay,
    },
    range: options.range || 'entry',
  });

/**
 * Preset: Slide in from right when entering viewport
 *
 * @example
 * <View animate={slideRightOnView()} />
 */
export const slideRightOnView = (
  options: SlideAnimationOptions = {}
): AnimationProps =>
  animateOnView({
    keyframes: {
      from: {
        opacity: 0,
        transform: `translateX(${options.distance || '50px'})`,
      },
      to: { opacity: 1, transform: 'translateX(0)' },
    },
    timing: {
      duration: options.duration || '0.6s',
      timingFunction: options.timingFunction || 'ease-out',
      delay: options.delay,
    },
    range: options.range || 'entry',
  });

/**
 * Preset: Scale up when entering viewport
 *
 * @example
 * <View animate={scaleUpOnView()} />
 * <View animate={scaleUpOnView({ scale: 0.8 })} />
 */
export const scaleUpOnView = (
  options: ScaleAnimationOptions = {}
): AnimationProps =>
  animateOnView({
    keyframes: {
      from: { opacity: 0, transform: `scale(${options.scale || 0.9})` },
      to: { opacity: 1, transform: 'scale(1)' },
    },
    timing: {
      duration: options.duration || '0.5s',
      timingFunction: options.timingFunction || 'ease',
      delay: options.delay,
    },
    range: options.range || 'entry',
  });

/**
 * Preset: Scale down when entering viewport
 *
 * @example
 * <View animate={scaleDownOnView({ scale: 1.1 })} />
 */
export const scaleDownOnView = (
  options: ScaleAnimationOptions = {}
): AnimationProps =>
  animateOnView({
    keyframes: {
      from: { opacity: 0, transform: `scale(${options.scale || 1.1})` },
      to: { opacity: 1, transform: 'scale(1)' },
    },
    timing: {
      duration: options.duration || '0.5s',
      timingFunction: options.timingFunction || 'ease',
      delay: options.delay,
    },
    range: options.range || 'entry',
  });

/**
 * Preset: Blur in when entering viewport
 *
 * @example
 * <View animate={blurInOnView()} />
 * <View animate={blurInOnView({ blur: '15px' })} />
 */
export const blurInOnView = (
  options: BlurAnimationOptions = {}
): AnimationProps =>
  animateOnView({
    keyframes: {
      from: { opacity: 0, filter: `blur(${options.blur || '10px'})` },
      to: { opacity: 1, filter: 'blur(0)' },
    },
    timing: {
      duration: options.duration || '0.6s',
      timingFunction: options.timingFunction || 'ease-out',
      delay: options.delay,
    },
    range: options.range || 'entry',
  });

/**
 * Preset: Blur out when exiting viewport
 *
 * @example
 * <View animate={blurOutOnView()} />
 */
export const blurOutOnView = (
  options: BlurAnimationOptions = {}
): AnimationProps =>
  animateOnView({
    keyframes: {
      from: { opacity: 1, filter: 'blur(0)' },
      to: { opacity: 0, filter: `blur(${options.blur || '10px'})` },
    },
    timing: {
      duration: options.duration || '0.5s',
      timingFunction: options.timingFunction || 'ease-in',
      delay: options.delay,
    },
    range: options.range || 'exit',
  });

/**
 * Preset: Rotate in when entering viewport
 *
 * @example
 * <View animate={rotateInOnView()} />
 * <View animate={rotateInOnView({ angle: '-15deg' })} />
 */
export const rotateInOnView = (
  options: RotateAnimationOptions = {}
): AnimationProps =>
  animateOnView({
    keyframes: {
      from: {
        opacity: 0,
        transform: `rotate(${options.angle || '-10deg'}) scale(0.9)`,
      },
      to: { opacity: 1, transform: 'rotate(0) scale(1)' },
    },
    timing: {
      duration: options.duration || '0.6s',
      timingFunction: options.timingFunction || 'ease-out',
      delay: options.delay,
    },
    range: options.range || 'entry',
  });

/**
 * Preset: Reveal with clip-path from bottom
 *
 * @example
 * <View animate={revealOnView()} />
 */
export const revealOnView = (
  options: ViewAnimationOptions = {}
): AnimationProps =>
  animateOnView({
    keyframes: {
      from: { clipPath: 'inset(100% 0 0 0)' },
      to: { clipPath: 'inset(0 0 0 0)' },
    },
    timing: {
      duration: options.duration || '0.7s',
      timingFunction: options.timingFunction || 'ease-out',
      delay: options.delay,
    },
    range: options.range || 'entry 0% entry 80%',
  });

/**
 * Preset: Flip in on X axis
 *
 * @example
 * <View animate={flipXOnView()} />
 */
export const flipXOnView = (
  options: ViewAnimationOptions = {}
): AnimationProps =>
  animateOnView({
    keyframes: {
      from: {
        opacity: 0,
        transform: 'perspective(400px) rotateX(90deg)',
      },
      to: {
        opacity: 1,
        transform: 'perspective(400px) rotateX(0)',
      },
    },
    timing: {
      duration: options.duration || '0.6s',
      timingFunction: options.timingFunction || 'ease-out',
      delay: options.delay,
    },
    range: options.range || 'entry',
  });

/**
 * Preset: Flip in on Y axis
 *
 * @example
 * <View animate={flipYOnView()} />
 */
export const flipYOnView = (
  options: ViewAnimationOptions = {}
): AnimationProps =>
  animateOnView({
    keyframes: {
      from: {
        opacity: 0,
        transform: 'perspective(400px) rotateY(90deg)',
      },
      to: {
        opacity: 1,
        transform: 'perspective(400px) rotateY(0)',
      },
    },
    timing: {
      duration: options.duration || '0.6s',
      timingFunction: options.timingFunction || 'ease-out',
      delay: options.delay,
    },
    range: options.range || 'entry',
  });

/**
 * Preset JSON configurations for common view animations
 * Use with createViewAnimation() or animateOnView()
 */
export const viewAnimationPresets: Record<string, ViewAnimationConfig> = {
  fadeIn: {
    keyframes: { from: { opacity: 0 }, to: { opacity: 1 } },
    timing: { duration: '0.5s', timingFunction: 'ease' },
    range: 'entry',
  },

  fadeOut: {
    keyframes: { from: { opacity: 1 }, to: { opacity: 0 } },
    timing: { duration: '0.5s', timingFunction: 'ease' },
    range: 'exit',
  },

  slideUp: {
    keyframes: {
      from: { opacity: 0, transform: 'translateY(30px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
    timing: { duration: '0.6s', timingFunction: 'ease-out' },
    range: 'entry',
  },

  slideDown: {
    keyframes: {
      from: { opacity: 0, transform: 'translateY(-30px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
    timing: { duration: '0.6s', timingFunction: 'ease-out' },
    range: 'entry',
  },

  scaleUp: {
    keyframes: {
      from: { opacity: 0, transform: 'scale(0.9)' },
      to: { opacity: 1, transform: 'scale(1)' },
    },
    timing: { duration: '0.5s', timingFunction: 'ease' },
    range: 'entry',
  },

  blurIn: {
    keyframes: {
      from: { opacity: 0, filter: 'blur(10px)' },
      to: { opacity: 1, filter: 'blur(0)' },
    },
    timing: { duration: '0.6s', timingFunction: 'ease-out' },
    range: 'entry',
  },

  reveal: {
    keyframes: {
      from: { clipPath: 'inset(100% 0 0 0)' },
      to: { clipPath: 'inset(0 0 0 0)' },
    },
    timing: { duration: '0.7s', timingFunction: 'ease-out' },
    range: 'entry 0% entry 80%',
  },
};
