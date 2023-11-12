import React from 'react';
import { Element, ElementProps } from './Element';
import { ViewStyleProps } from '../types/style';
import { CSSProperties } from 'styled-components';

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
    Omit<CSSProperties, 'translate'>,
    ElementProps {
  onPress?: (..._args: any) => void;
}

export const View: React.FC<ViewProps> = React.memo((props) => (
  <Element {...props} />
));

export const Div = View;

export const SafeArea = View;

export const Scroll: React.FC<ScrollProps> = React.memo((props) => (
  <View overflow={'auto'} {...props} />
));

export const Span: React.FC<SpanProps> = React.memo((props) => (
  <Element {...props} as="span" />
));
