import React from 'react';
import { CSSProperties } from 'styled-components';
import { Element, ElementProps } from './Element';
import { TextStyleProps } from '../types/style';

export interface TextProps
  extends Omit<
      TextStyleProps,
      'children' | 'style' | 'onPress' | 'pointerEvents'
    >,
    Omit<CSSProperties, 'animation'>,
    ElementProps {
  toUpperCase?: boolean;
}

export const Text = React.memo((props: TextProps) => {
  return <Element {...props} />;
});
