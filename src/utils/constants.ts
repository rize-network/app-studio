// constants.ts
import { CSSProperties } from 'react';

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
  'size',
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
  from: CSSProperties;
  enter: CSSProperties;
  leave?: CSSProperties;
  duration?: string;
  timingFunction?: string;
  delay?: string;
  iterationCount?: string;
  direction?: string;
  fillMode?: string;
  playState?: string;
}
