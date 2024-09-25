import React from 'react';
import { CSSProperties } from 'react';
import { Element, ElementProps } from './Element';
import { ImageStyleProps } from '../types/style';

export interface ImageProps
  extends Omit<ImageStyleProps, 'children' | 'style' | 'pointerEvents'>,
    Omit<
      Partial<HTMLImageElement>,
      | 'width'
      | 'height'
      | 'children'
      | 'translate'
      | 'target'
      | 'border'
      | 'animate'
      | 'draggable'
      | 'style'
    >,
    Omit<CSSProperties, 'animation'>,
    ElementProps {}

export const Image = React.memo((props: ImageProps) => (
  <Element {...props} as="img" />
));
