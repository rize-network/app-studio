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
