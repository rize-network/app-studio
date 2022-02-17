import { ViewElement } from './Element';
import { ViewStyleProps } from '../types/style';
import { CSSProperties } from 'styled-components';
import { Shadow } from '../utils/shadow';

export interface FormProps
  extends Omit<ViewStyleProps, 'children' | 'style' | 'pointerEvents'>,
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
      Partial<HTMLButtonElement>,
      | 'width'
      | 'height'
      | 'children'
      | 'translate'
      | 'type'
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
    Omit<Partial<HTMLInputElement>, 'width' | 'height' | 'children'>,
    Omit<CSSProperties, 'style' | 'dir' | 'translate'> {
  on?: Record<string, CSSProperties>;
  paddingHorizontal?: number | string;
  marginHorizontal?: number | string;
  paddingVertical?: number | string;
  marginVertical?: number | string;
  shadow?: boolean | number | Shadow;
}

export const Form = (props: FormProps) => <ViewElement {...props} as="form" />;

export const Input = (props: InputProps) => (
  <ViewElement {...props} as="input" />
);

export const Button = (props: ButtonProps) => (
  <ViewElement {...props} as="button" />
);
