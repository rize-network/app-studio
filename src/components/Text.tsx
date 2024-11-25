import React from 'react';
import { CSSProperties } from 'react';
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

export const Text = React.memo(
  React.forwardRef<HTMLSpanElement, TextProps>((props, ref) => {
    const { toUpperCase, children, ...rest } = props;

    // Convertir le texte en majuscules si toUpperCase est activé
    const content =
      toUpperCase && typeof children === 'string'
        ? children.toUpperCase()
        : children;

    return (
      <Element as="span" ref={ref} {...rest}>
        {content}
      </Element>
    );
  })
);
