import React from 'react';
import { Element } from './Element';
import { ViewStyleProps } from '../types/style';
import { CSSProperties } from 'styled-components';
import { Shadow } from '../utils/shadow';

export interface ViewProps
  extends Omit<
      ViewStyleProps,
      'children' | 'translate' | 'style' | 'pointerEvents'
    >,
    Omit<CSSProperties, 'translate'> {
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
}

export const View = (props: ViewProps) => <Element {...props} />;

export const Div = View;

export const SafeArea = View;

export const Scroll = (props: any) => <View overflow={'auto'} {...props} />;

export const Span = (props: ViewProps) => <Element {...props} as="span" />;
