import React from 'react';
import { ViewElement } from './Element';
import { ViewStyleProps } from '../types/style';
import { CSSProperties } from 'styled-components';
import { Shadow } from '../utils/shadow';

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
  key?: string;
  shadow?: boolean | number | Shadow;
}

export const View = (props: ViewProps) => <ViewElement {...props} />;

export const SafeArea = View;

export const Scroll = (props: any) => <View overflow={'auto'} {...props} />;
