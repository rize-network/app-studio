import React from 'react';
import { Element, ElementProps } from '../element/Element';
import { ViewStyleProps } from '../types/style';

// Common props pour éviter la répétition
interface CommonProps
  extends ElementProps,
    Omit<ViewStyleProps, 'children' | 'style' | 'pointerEvents' | 'onClick'> {}

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
      | 'children'
      | 'translate'
      | 'style'
      | 'width'
      | 'height'
      | 'animate'
      | 'size'
    > {}

export const Form = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithRef<typeof Element> & FormProps
>((props, ref) => (
  <Element as="form" {...props} ref={ref} />
)) as unknown as React.ForwardRefExoticComponent<
  React.ComponentPropsWithRef<typeof Element> &
    FormProps &
    React.RefAttributes<HTMLElement>
>;

export const Input = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithRef<typeof Element> & InputProps
>((props, ref) => (
  <Element as="input" {...props} ref={ref} />
)) as unknown as React.ForwardRefExoticComponent<
  React.ComponentPropsWithRef<typeof Element> &
    InputProps &
    React.RefAttributes<HTMLElement>
>;

export const Button = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithRef<typeof Element> & ButtonProps
>((props, ref) => (
  <Element as="button" {...props} ref={ref} />
)) as unknown as React.ForwardRefExoticComponent<
  React.ComponentPropsWithRef<typeof Element> &
    ButtonProps &
    React.RefAttributes<HTMLElement>
>;
