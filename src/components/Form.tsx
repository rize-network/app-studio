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
