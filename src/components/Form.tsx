import React from 'react';
import { FormElement, InputElement } from './Element';
import { ViewStyleProps } from '../types/style';
import { CSSProperties } from 'styled-components';
import { Shadow } from '../utils/shadow';

export interface FormProps
  extends Omit<ViewStyleProps, 'style' | 'pointerEvents' | 'dir'>,
    Omit<
      HTMLFormElement,
      'children' | 'translate' | 'height' | 'width' | 'border' | 'draggable'
    >,
    CSSProperties {
  size?: number;
  on?: Record<string, CSSProperties>;
  paddingHorizontal?: number | string;
  marginHorizontal?: number | string;
  paddingVertical?: number | string;
  marginVertical?: number | string;
  shadow?: boolean | number | Shadow;
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
}

export const Form = (props: FormProps) => <FormElement {...props} />;

export const Input = (props: InputProps) => <InputElement {...props} />;
