import React from 'react';
import { Element, ElementProps } from './Element';
import { ViewStyleProps } from '../types/style';
import { CSSProperties } from 'react';

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
  React.forwardRef<
    HTMLElement,
    React.ComponentPropsWithRef<typeof Element> & ViewProps
  >((props, ref) => <Element {...props} ref={ref} />)
) as unknown as React.ForwardRefExoticComponent<
  React.ComponentPropsWithRef<typeof Element> &
    ViewProps &
    React.RefAttributes<HTMLElement>
>;

export const Scroll = React.memo(
  React.forwardRef<
    HTMLElement,
    React.ComponentPropsWithRef<typeof Element> & ViewProps
  >((props, ref) => <Element {...props} ref={ref} />)
) as unknown as React.ForwardRefExoticComponent<
  React.ComponentPropsWithRef<typeof Element> &
    ViewProps &
    React.RefAttributes<HTMLElement>
>;

export const SafeArea = React.memo(
  React.forwardRef<
    HTMLElement,
    React.ComponentPropsWithRef<typeof Element> & ViewProps
  >((props, ref) => <Element overflow="auto" {...props} ref={ref} />)
) as unknown as React.ForwardRefExoticComponent<
  React.ComponentPropsWithRef<typeof Element> &
    ViewProps &
    React.RefAttributes<HTMLElement>
>;

export const Div = React.memo(
  React.forwardRef<
    HTMLElement,
    React.ComponentPropsWithRef<typeof Element> & ViewProps
  >((props, ref) => <Element {...props} ref={ref} />)
) as unknown as React.ForwardRefExoticComponent<
  React.ComponentPropsWithRef<typeof Element> &
    ViewProps &
    React.RefAttributes<HTMLElement>
>;

export const Span = React.memo(
  React.forwardRef<
    HTMLElement,
    React.ComponentPropsWithRef<typeof Element> & ViewProps
  >((props, ref) => <Element as="span" {...props} ref={ref} />)
) as unknown as React.ForwardRefExoticComponent<
  React.ComponentPropsWithRef<typeof Element> &
    ViewProps &
    React.RefAttributes<HTMLElement>
>;
