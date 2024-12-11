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

export const View = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithRef<typeof Element> & ViewProps
>((props, ref) => (
  <Element {...props} ref={ref} />
)) as unknown as React.ForwardRefExoticComponent<
  React.ComponentPropsWithRef<typeof Element> &
    ViewProps &
    React.RefAttributes<HTMLElement>
>;

export const Horizontal = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithRef<typeof Element> & ViewProps
>((props, ref) => (
  <Element display="flex" flexDirection="row" {...props} ref={ref} />
)) as unknown as React.ForwardRefExoticComponent<
  React.ComponentPropsWithRef<typeof Element> &
    ViewProps &
    React.RefAttributes<HTMLElement>
>;

export const Vertical = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithRef<typeof Element> & ViewProps
>((props, ref) => (
  <Element display="flex" flexDirection="column" {...props} ref={ref} />
)) as unknown as React.ForwardRefExoticComponent<
  React.ComponentPropsWithRef<typeof Element> &
    ViewProps &
    React.RefAttributes<HTMLElement>
>;

export const HorizontalResponsive = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithRef<typeof Element> & ViewProps
>(({ media = {}, ...props }, ref) => (
  <Horizontal
    media={{
      ...media,
      mobile: {
        ...media.mobile,
        flexDirection: 'column',
      },
    }}
    {...props}
    ref={ref}
  />
)) as unknown as React.ForwardRefExoticComponent<
  React.ComponentPropsWithRef<typeof Element> &
    ViewProps &
    React.RefAttributes<HTMLElement>
>;

export const VerticalResponsive = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithRef<typeof Element> & ViewProps
>(({ media = {}, ...props }, ref) => (
  <Vertical
    media={{
      ...media,
      mobile: {
        ...media.mobile,
        flexDirection: 'row',
      },
    }}
    {...props}
    ref={ref}
  />
)) as unknown as React.ForwardRefExoticComponent<
  React.ComponentPropsWithRef<typeof Element> &
    ViewProps &
    React.RefAttributes<HTMLElement>
>;

export const Scroll = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithRef<typeof Element> & ViewProps
>((props, ref) => (
  <Element {...props} ref={ref} />
)) as unknown as React.ForwardRefExoticComponent<
  React.ComponentPropsWithRef<typeof Element> &
    ViewProps &
    React.RefAttributes<HTMLElement>
>;

export const SafeArea = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithRef<typeof Element> & ViewProps
>((props, ref) => (
  <Element overflow="auto" {...props} ref={ref} />
)) as unknown as React.ForwardRefExoticComponent<
  React.ComponentPropsWithRef<typeof Element> &
    ViewProps &
    React.RefAttributes<HTMLElement>
>;

export const Div = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithRef<typeof Element> & ViewProps
>((props, ref) => (
  <Element {...props} ref={ref} />
)) as unknown as React.ForwardRefExoticComponent<
  React.ComponentPropsWithRef<typeof Element> &
    ViewProps &
    React.RefAttributes<HTMLElement>
>;

export const Span = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithRef<typeof Element> & ViewProps
>((props, ref) => (
  <Element as="span" {...props} ref={ref} />
)) as unknown as React.ForwardRefExoticComponent<
  React.ComponentPropsWithRef<typeof Element> &
    ViewProps &
    React.RefAttributes<HTMLElement>
>;
