import React from 'react';
import { ViewElement } from './Element';
import { ViewStyleProps } from '../types/style';
import { CSSProperties } from 'styled-components';

export interface ViewProps
  extends Omit<ViewStyleProps, 'pointerEvents'>,
    CSSProperties {
  size?: number;
  on?: Record<string, CSSProperties>;
  onPress?: (...args: any) => void;
  paddingHorizontal?: number | string;
  marginHorizontal?: number | string;
  paddingVertical?: number | string;
  marginVertical?: number | string;
  shadow?: boolean | number;
}

export const View = (props: ViewProps) => <ViewElement {...props} />;

export const SafeArea = View;

export const Scroll = (props: any) => <View overflow={'auto'} {...props} />;
