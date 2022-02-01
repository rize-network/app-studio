import React from 'react';
import { CSSProperties } from 'styled-components';
import styled from 'styled-components';
import { applyStyle } from './Element';
import {
  GenericStyleProp,
  TextProps,
  TextStyle,
  ResponsiveStyle,
} from '../types/style';

export interface ComponentTextProps
  extends Omit<TextProps, 'pointerEvents' | 'onPress'>,
    CSSProperties {
  data?: object;
  children?: string | any;
  className?: string;
  paddingHorizontal?: number | string;
  marginHorizontal?: number | string;
  paddingVertical?: number | string;
  marginVertical?: number | string;
  locale?: string;
  toUpperCase?: boolean;
  style?: GenericStyleProp<TextStyle>;
  responsive?: ResponsiveStyle;
  backgroundColor?: string;

  onPress?: void;
  action?: string;
}

export const formatTextStyle: any = ({
  hint = false,
  disabled = false,
  opacity,
  fontSize,
  ...props
}: CSSProperties & {
  disabled: number | boolean;
  hint: number | boolean;
  opacity: number;
  fontSize?: number;
}) => {
  if (props) {
    if (hint) {
      opacity = hint as number;
    }

    if (disabled) {
      opacity = disabled as number;
    }

    return { ...props, opacity, fontSize };
  }

  return applyStyle(props);
};

export const TextSpan: React.FC<CSSProperties> = styled.div(
  (props: CSSProperties) => {
    props.display = 'inherit';
    props.flexDirection = 'column';
    return applyStyle(props);
  }
);

export class Text extends React.PureComponent<ComponentTextProps> {
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
