import React from 'react';
import { Element, ElementProps } from './Element';
import { ViewStyleProps } from '../types/style';
import { CSSProperties } from 'styled-components';

export interface ViewProps
  extends Omit<
      ViewStyleProps,
      'children' | 'translate' | 'style' | 'pointerEvents'
    >,
    Omit<CSSProperties, 'translate'>,
    ElementProps {
  onPress?: (..._args: any) => void;
}

export const View = (props: ViewProps) => <Element {...props} />;

export const Div = View;

export const SafeArea = View;

export const Scroll = (props: any) => <View overflow={'auto'} {...props} />;

export const Span = (props: ViewProps) => <Element {...props} as="span" />;
