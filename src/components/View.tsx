import React, { forwardRef, memo, ComponentPropsWithRef } from 'react';
import { Element, ElementProps } from './Element';
import { ViewStyleProps } from '../types/style';
import { CSSProperties } from 'react';

type ForwardRefComponent<
  Props,
  Ref extends HTMLElement = HTMLElement,
> = React.ForwardRefExoticComponent<
  Props & ViewProps & React.RefAttributes<Ref>
>;
// interface ScrollProps extends ViewProps {
//   // Définir des props spécifiques pour Scroll si nécessaire
// }

// interface SpanProps extends Omit<ViewProps, 'as'> {
//   // Définir des props spécifiques pour Span si nécessaire
// }

// Fonction utilitaire pour combiner memo et forwardRef
export function memoForwardRef<Props, Ref extends HTMLElement = HTMLElement>(
  component: React.ForwardRefRenderFunction<Ref, Props>
): ForwardRefComponent<Props, Ref> {
  const ForwardedComponent = forwardRef(component);
  const MemoizedComponent = memo(
    ForwardedComponent
  ) as unknown as ForwardRefComponent<Props, Ref>;
  return MemoizedComponent;
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

export const View = memoForwardRef<ComponentPropsWithRef<typeof Element>>(
  (props, ref) => <Element {...props} ref={ref} />
);

export const Div = React.memo((props: ViewProps) => <View {...props} />);

export const SafeArea = React.memo((props: ViewProps) => <View {...props} />);

export const Scroll = React.memo((props: ViewProps) => (
  <View overflow="auto" {...props} />
));

export const Span = React.memo((props: ViewProps) => (
  <Element as="span" {...props} />
));
