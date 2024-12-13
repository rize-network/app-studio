import React from 'react';
import { CssProps, Element, ElementProps } from './Element';
import { ImageStyleProps } from '../types/style';

export interface ImageProps
  extends Omit<
      ImageStyleProps,
      'children' | 'style' | 'pointerEvents' | 'onClick'
    >,
    Omit<
      Partial<HTMLImageElement>,
      | 'width'
      | 'height'
      | 'children'
      | 'translate'
      | 'target'
      | 'border'
      | 'animate'
      | 'draggable'
      | 'style'
    >,
    CssProps,
    ElementProps {}

export const Image = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithRef<typeof Element> & ImageProps
>((props, ref) => (
  <Element as="img" {...props} ref={ref} />
)) as unknown as React.ForwardRefExoticComponent<
  React.ComponentPropsWithRef<typeof Element> &
    ImageProps &
    React.RefAttributes<HTMLElement>
>;

export const ImageBackground = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithRef<typeof Element> & ImageProps
>(({ src, ...props }, ref) => (
  <Element
    backgroundImage={`url(${src})`}
    backgroundSize="cover"
    backgroundRepeat="no-repeat"
    {...props}
    ref={ref}
  />
)) as unknown as React.ForwardRefExoticComponent<
  React.ComponentPropsWithRef<typeof Element> &
    ImageProps &
    React.RefAttributes<HTMLElement>
>;
