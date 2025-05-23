import React from 'react';
import { Element, ElementProps } from '../element/Element';
import { TextStyleProps } from '../types/style';

export interface TextProps
  extends Omit<
      TextStyleProps,
      | 'children'
      | 'style'
      | 'onPress'
      | 'pointerEvents'
      | 'onClick'
      | 'accessibilityRole'
      | 'accessibilityState'
    >,
    ElementProps {
  toUpperCase?: boolean;
}

export const Text = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithRef<typeof Element> & TextProps
>((props, ref) => {
  const { toUpperCase, children, ...rest } = props;

  // Convertir le texte en majuscules si toUpperCase est activé
  const content =
    toUpperCase && typeof children === 'string'
      ? children.toUpperCase()
      : children;

  return (
    <Element as="span" {...rest} ref={ref}>
      {content}
    </Element>
  );
}) as unknown as React.ForwardRefExoticComponent<
  React.ComponentPropsWithRef<typeof Element> &
    TextProps &
    React.RefAttributes<HTMLElement>
>;
