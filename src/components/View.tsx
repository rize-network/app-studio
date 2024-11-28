import React from 'react';
import { Element, ElementProps } from './Element';
import { ViewStyleProps } from '../types/style';
import { CSSProperties } from 'react';

// interface ScrollProps extends ViewProps {
//   // Définir des props spécifiques pour Scroll si nécessaire
// }

// interface SpanProps extends Omit<ViewProps, 'as'> {
//   // Définir des props spécifiques pour Span si nécessaire
// }

export interface ViewProps
  extends Omit<
      ViewStyleProps,
      'children' | 'translate' | 'style' | 'pointerEvents'
    >,
    Omit<CSSProperties, 'translate' | 'animation'>,
    ElementProps {
  onPress?: (..._args: any) => void;
}

export const View = React.memo((props: ViewProps) => <Element {...props} />);

export const Div = React.memo((props: ViewProps) => <View {...props} />);

export const SafeArea = React.memo((props: ViewProps) => <View {...props} />);

export const Scroll = React.memo((props: ViewProps) => (
  <View overflow="auto" {...props} />
));

export const Span = React.memo((props: ViewProps) => (
  <Element as="span" {...props} />
));
