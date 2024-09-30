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
  // ... autres props ...
  onClick?: (..._args: any) => void;
  // ... autres props ...
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

// Utilisation de React.memo pour une meilleure performance
export const Form = React.memo((props: FormProps) => (
  <Element {...props} as="form" />
));

export const Input = React.memo((props: InputProps) => (
  <Element {...props} as="input" />
));

export const Button = React.memo((props: ButtonProps) => (
  <Element {...props} as="button" />
));
