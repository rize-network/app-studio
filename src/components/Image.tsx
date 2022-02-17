import React from 'react';
import { CSSProperties } from 'styled-components';
import { ViewElement } from './Element';
import { ImageStyleProps } from '../types/style';
import { Shadow } from '../utils/shadow';

export interface ImageProps
  extends Omit<ImageStyleProps, 'children' | 'style' | 'pointerEvents'>,
    CSSProperties {
  children?: any;
  size?: number;
  on?: Record<string, CSSProperties>;
  media?: Record<string, CSSProperties>;
  onPress?: (...args: any) => void;
  src: string | any;
  shadow?: boolean | number | Shadow;
}

export const Image = (props: ImageProps) => <ViewElement {...props} as="img" />;
