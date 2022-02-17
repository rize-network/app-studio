import React from 'react';
import { CSSProperties } from 'styled-components';
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
      | 'draggable'
    >,
    CSSProperties,
    ElementProps {}

export const Image = (props: ImageProps) => <Element {...props} as="img" />;
