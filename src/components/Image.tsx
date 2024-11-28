import React from 'react';
import { CSSProperties } from 'react';
import { Element, ElementProps } from './Element';
import { ImageStyleProps } from '../types/style';

export interface ImageProps
  extends Omit<ImageStyleProps, 'children' | 'style' | 'pointerEvents'>,
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
    Omit<CSSProperties, 'animation'>,
    ElementProps {}

export const View = React.memo(
  React.forwardRef<
    HTMLElement,
    React.ComponentPropsWithRef<typeof Element> & ImageProps
  >((props, ref) => <Element as="img" {...props} ref={ref} />)
) as unknown as React.ForwardRefExoticComponent<
  React.ComponentPropsWithRef<typeof Element> &
    ImageProps &
    React.RefAttributes<HTMLElement>
>;
