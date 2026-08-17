import React from 'react';
import { Element, ElementProps } from '../element/Element';
import { ImageStyleProps } from '../types/style';

export interface ImageProps
  extends
    Omit<ImageStyleProps, keyof ElementProps>,
    Omit<Partial<HTMLImageElement>, keyof ElementProps>,
    ElementProps {}

export const Image = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithRef<typeof Element> & ImageProps
>((props, ref) => {
  const imageProps = { ...props, alt: props.alt || '' };
  return <Element as="img" {...imageProps} ref={ref} />;
}) as unknown as React.ForwardRefExoticComponent<
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
