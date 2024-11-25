import React from 'react';
import { Element, ElementProps } from './Element';
import { ViewStyleProps } from '../types/style';
import { CSSProperties } from 'react';

// Common props pour éviter la répétition
interface CommonProps
  extends Omit<ViewStyleProps, 'children' | 'style' | 'pointerEvents'> {}

// Props pour le composant Form
export interface FormProps
  extends CommonProps,
    Omit<
      Partial<HTMLFormElement>,
      | 'width'
      | 'height'
      | 'children'
      | 'translate'
      | 'target'
      | 'border'
      | 'draggable'
    >,
    CSSProperties,
    ElementProps {}

// Props pour le composant Button
export interface ButtonProps
  extends CommonProps,
    Omit<
      Partial<HTMLButtonElement>,
      | 'width'
      | 'height'
      | 'children'
      | 'translate'
      | 'type'
      | 'border'
      | 'animate'
      | 'style'
      | 'draggable'
    >,
    Omit<CSSProperties, 'animation'>,
    ElementProps {
  children?: React.ReactNode;
  onClick?: (..._args: any) => void;
}

// Props pour le composant Input
export interface InputProps
  extends ElementProps,
    CommonProps,
    Omit<
      Partial<HTMLInputElement>,
      'children' | 'style' | 'width' | 'height' | 'animate' | 'size'
    >,
    Omit<CSSProperties, 'style' | 'dir' | 'translate'> {}

// Composant Form
export const Form = React.memo(
  React.forwardRef<HTMLFormElement, FormProps>((props, ref) => (
    <Element {...props} ref={ref} as="form" />
  ))
);

// Composant Input
export const Input = React.memo(
  React.forwardRef<HTMLInputElement, InputProps>((props, ref) => (
    <Element {...props} ref={ref} as="input" />
  ))
);

// Composant Button
export const Button = React.memo(
  React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => (
    <Element {...props} ref={ref} as="button" />
  ))
);
