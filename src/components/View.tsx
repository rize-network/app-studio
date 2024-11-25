import React from 'react';
import { Element, ElementProps } from './Element';
import { ViewStyleProps } from '../types/style';
import { CSSProperties } from 'react';

interface ScrollProps extends ViewProps {
  // Définir des props spécifiques pour Scroll si nécessaire
}

interface SpanProps extends Omit<ViewProps, 'as'> {
  // Définir des props spécifiques pour Span si nécessaire
}

export interface ViewProps
  extends Omit<
      ViewStyleProps,
      'children' | 'translate' | 'style' | 'pointerEvents'
    >,
    Omit<CSSProperties, 'translate' | 'animation'>,
    ElementProps {
  onPress?: (..._args: any) => void;
}

export const View = React.memo(
  React.forwardRef<HTMLElement, ViewProps>((props, ref) => (
    <Element {...props} ref={ref} />
  ))
);

export const Div = React.memo(
  React.forwardRef<HTMLElement, ViewProps>((props, ref) => (
    <View {...props} ref={ref} />
  ))
);

export const SafeArea = React.memo(
  React.forwardRef<HTMLElement, ViewProps>((props, ref) => (
    <View {...props} ref={ref} />
  ))
);

export const Scroll = React.memo(
  React.forwardRef<HTMLElement, ScrollProps>((props, ref) => (
    <View overflow="auto" {...props} ref={ref} />
  ))
);

export const Span = React.memo(
  React.forwardRef<HTMLSpanElement, SpanProps>((props, ref) => (
    <Element {...props} ref={ref} as="span" />
  ))
);
