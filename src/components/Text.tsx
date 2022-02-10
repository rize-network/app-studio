import React from 'react';
import { CSSProperties } from 'styled-components';
import { applyStyle, ViewElement } from './Element';
import { TextStyleProps } from '../types/style';
import { Shadow } from '../utils/shadow';

export interface TextProps
  extends Omit<TextStyleProps, 'children' | 'style' | 'pointerEvents'>,
    CSSProperties {
  children?: any;
  on?: Record<string, CSSProperties>;
  onPress?: (...args: any) => void;
  paddingHorizontal?: number | string;
  marginHorizontal?: number | string;
  paddingVertical?: number | string;
  marginVertical?: number | string;
  toUpperCase?: boolean;
  shadow?: boolean | number | Shadow;
  tag?: string;
}

export const Text = (props: TextProps) => {
  return <ViewElement {...props} />;
};
