import React from 'react';
import { CSSProperties } from 'styled-components';
import styled from 'styled-components';
import { applyStyle } from './Element';
import { TextProps as $TextProps } from '../types/style';

export interface TextProps
  extends Omit<$TextProps, 'pointerEvents' | 'onPress'>,
    CSSProperties {
  on?: Record<string, CSSProperties>;
  onPress?: (...args: any) => void;
  paddingHorizontal?: number | string;
  marginHorizontal?: number | string;
  paddingVertical?: number | string;
  marginVertical?: number | string;
  toUpperCase?: boolean;
  shadow?: boolean | number;
}

export const TextSpan: React.FC<CSSProperties> = styled.div(
  (props: CSSProperties) => {
    props.display = 'inherit';
    props.flexDirection = 'column';
    return applyStyle(props);
  }
);

export class Text extends React.PureComponent<TextProps> {
  render() {
    const { toUpperCase = false, children, ...props } = this.props;
    let content: any = children;

    if (children && typeof children === 'string') {
      content = children.toString().trim();
    }

    if (typeof content === 'string' && toUpperCase) {
      content = content.toUpperCase();
    }

    if (typeof content === 'string') {
      content = content.split('\n').map((item, key) => {
        return (
          <span key={key.toString()}>
            {item}
            <br />
          </span>
        );
      });
    }

    return <TextSpan {...props}>{content}</TextSpan>;
  }
}
