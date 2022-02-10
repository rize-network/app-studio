import React from 'react';
import { CSSProperties } from 'styled-components';
import { ImageElement } from './Element';
import { ImageStyleProps } from '../types/style';
import { Shadow } from '../utils/shadow';

export interface ImageProps
  extends Omit<ImageStyleProps, 'style' | 'pointerEvents' | 'dir'>,
    Omit<
      HTMLImageElement,
      'children' | 'translate' | 'height' | 'width' | 'border' | 'draggable'
    >,
    CSSProperties {
  size?: number;
  on?: Record<string, CSSProperties>;
  onPress?: (...args: any) => void;
  src: string | any;
  shadow?: boolean | number | Shadow;
}

export const Image = (props: ImageProps) => <ImageElement {...props} />;
