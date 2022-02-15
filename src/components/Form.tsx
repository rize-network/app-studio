import React from 'react';
import { ViewElement } from './Element';
import { ViewStyleProps } from '../types/style';
import { CSSProperties } from 'styled-components';
import { Shadow } from '../utils/shadow';

export interface FormProps
  extends Omit<ViewStyleProps, 'children' | 'style' | 'pointerEvents'>,
    Omit<
      HTMLFormElement,
      | 'children'
      | 'target'
      | 'translate'
      | 'height'
      | 'width'
      | 'border'
      | 'draggable'
    >,
    CSSProperties {
  children?: any;
  size?: number;
  target?: any;
  on?: Record<string, CSSProperties>;
  media?: Record<string, CSSProperties>;
  paddingHorizontal?: number | string;
  marginHorizontal?: number | string;
  paddingVertical?: number | string;
  marginVertical?: number | string;
  shadow?: boolean | number | Shadow;
}

export interface ButtonProps
  extends Omit<ViewStyleProps, 'children' | 'style' | 'pointerEvents'>,
    Omit<
      HTMLButtonElement,
      | 'children'
      | 'translate'
      | 'type'
      | 'height'
      | 'width'
      | 'border'
      | 'draggable'
    >,
    CSSProperties {
  children?: any;
  size?: number;
  on?: Record<string, CSSProperties>;
  paddingHorizontal?: number | string;
  marginHorizontal?: number | string;
  paddingVertical?: number | string;
  marginVertical?: number | string;
  shadow?: boolean | number | Shadow;
  onClick?: any;
  type?: string;
}

export interface InputProps
  extends Omit<ViewStyleProps, 'style' | 'pointerEvents' | 'onPress' | 'dir'>,
    Omit<
      HTMLInputElement,
      'children' | 'translate' | 'height' | 'width' | 'border' | 'draggable'
    >,
    Omit<CSSProperties, 'style' | 'dir'> {
  on?: Record<string, CSSProperties>;
  paddingHorizontal?: number | string;
  marginHorizontal?: number | string;
  paddingVertical?: number | string;
  marginVertical?: number | string;
  shadow?: boolean | number | Shadow;
  tag?: string;
}

export const Form = (props: FormProps) => <ViewElement {...props} tag="form" />;

export const Input = (props: InputProps) => (
  <ViewElement {...props} tag="input" />
);

export const Button = (props: ButtonProps) => (
  <ViewElement {...props} tag="button" />
);
