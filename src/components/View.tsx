import React from 'react';
import { ViewElement } from './Element';
import { ViewStyleProps } from '../types/style';
import { CSSProperties } from 'styled-components';
import { Shadow } from '../utils/shadow';

export interface ViewProps
  extends Omit<ViewStyleProps, 'children' | 'style' | 'pointerEvents'>,
    CSSProperties {
  children?: any;
  size?: number;
  on?: Record<string, CSSProperties>;
  media?: Record<string, CSSProperties>;
  onPress?: (...args: any) => void;
  paddingHorizontal?: number | string;
  marginHorizontal?: number | string;
  paddingVertical?: number | string;
  marginVertical?: number | string;
  shadow?: boolean | number | Shadow;
  tag?: string;
}

export const View = (props: ViewProps) => <ViewElement {...props} />;

export const Div = View;

export const SafeArea = View;

export const Scroll = (props: any) => <View overflow={'auto'} {...props} />;

export const Span = (props: ViewProps) => <ViewElement {...props} tag="span" />;
