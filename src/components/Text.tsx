import React from 'react';
import { CSSProperties } from 'styled-components';
import styled from 'styled-components';
import { applyStyle } from './Element';
import { TextStyleProps } from '../types/style';
import { Shadow } from '../utils/shadow';

export interface TextProps
  extends Omit<TextStyleProps, 'children' | 'style' | 'pointerEvents' | 'dir'>,
    Omit<HTMLDivElement, 'translate'>,
    CSSProperties {
  on?: Record<string, CSSProperties>;
  onPress?: (...args: any) => void;
  paddingHorizontal?: number | string;
  marginHorizontal?: number | string;
  paddingVertical?: number | string;
  marginVertical?: number | string;
  toUpperCase?: boolean;
  shadow?: boolean | number | Shadow;
}

export const TextSpan: React.FC<TextProps> = styled.span((props: TextProps) => {
  return applyStyle(props);
});

export const Text = (props: TextProps) => {
  const { toUpperCase = false, children, ...textPops } = props;
  let content: any = children;

  if (children && typeof children === 'string') {
    content = children.toString().trim();
  }

  if (typeof content === 'string' && toUpperCase) {
    content = content.toUpperCase();
  }

  // if (typeof content === 'string' && toFormat) {
  //   const newtext: any = content
  //     .split('\n')
  //     .map((item: any, key: number): any => {
  //       return (
  //         <span key={key.toString()}>
  //           {item}
  //           <br />
  //         </span>
  //       );
  //     });
  // }

  return <TextSpan {...textPops} children={content} />;
};
