// constants.ts
import { CSSProperties } from 'react';
import {
  AnimationDirection,
  AnimationFillMode,
  AnimationIterationCount,
  AnimationKeyframes,
} from '../types/style';

// List of numeric properties that don't need 'px' suffix
export const NumberProps = new Set<string>([
  'numberOfLines',
  'fontWeight',
  'timeStamp',
  'flex',
  'flexGrow',
  'flexShrink',
  'order',
  'zIndex',
  'aspectRatio',
  'shadowOpacity',
  'shadowRadius',
  'scale',
  'opacity',
  'min',
  'max',
  'now',
]);

// Keys to exclude when passing props to the component
export const excludedKeys = new Set<string>([
  // Standard styling props
  'on',
  'shadow',
  'only',
  'media',
  'css',
  'widthHeight',
  'paddingHorizontal',
  'paddingVertical',
  'marginHorizontal',
  'marginVertical',
  'animate',
  'animateIn',
  'animateOut',

  // Underscore-prefixed event props
  '_hover',
  '_active',
  '_focus',
  '_visited',
  '_disabled',
  '_enabled',
  '_checked',
  '_unchecked',
  '_invalid',
  '_valid',
  '_required',
  '_optional',
  '_selected',
  '_target',
  '_firstChild',
  '_lastChild',
  '_onlyChild',
  '_firstOfType',
  '_lastOfType',
  '_empty',
  '_focusVisible',
  '_focusWithin',
  '_placeholder',
  // Pseudo-element props
  '_before',
  '_after',
  '_firstLetter',
  '_firstLine',
  '_selection',
  '_backdrop',
  '_marker',
  // Add more styling props here if needed
]);

// Keys to exclude when passing props to the component
export const extraKeys = new Set<string>([
  'on',
  'shadow',
  'only',
  'media',
  'css',
  // Add more styling props here if needed
]);

export const includeKeys = new Set<string>(['src', 'alt', 'style', 'as']);

// Type definitions for animation props
export interface AnimationProps {
  from?: CSSProperties | any;
  to?: CSSProperties | any;
  leave?: CSSProperties | any;
  duration?: string;
  timingFunction?:
    | string
    | 'linear'
    | 'ease'
    | 'ease-in'
    | 'ease-out'
    | 'ease-in-out';
  delay?: string;
  property?: string;
  iterationCount?: AnimationIterationCount;
  direction?: AnimationDirection;
  fillMode?: AnimationFillMode;
  playState?: AnimationPlayState;
  keyframes?: AnimationKeyframes;
  timeline?: string;
  range?: string;
  '--fill'?: any;
  [key: string]:
    | CSSProperties
    | string
    | number
    | Record<string, string | number>
    | undefined;
}
