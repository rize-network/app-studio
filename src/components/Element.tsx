import React, { CSSProperties, useMemo, forwardRef } from 'react';
import { useTheme } from '../providers/Theme';
import { useResponsiveContext } from '../providers/Responsive';

import { isStyleProp } from '../utils/style';
import { AnimationProps, excludedKeys, includeKeys } from '../utils/constants';
import { extractUtilityClasses } from '../utils/cssClass';
import { Shadow } from '../utils/shadow';

export interface ElementProps extends CssProps {
  on?: Record<string, CssProps>;
  media?: Record<string, CssProps>;
  only?: string[];
  css?: CSSProperties;
}

export interface CssProps {
  children?: React.ReactNode;
  size?: number | string;
  paddingHorizontal?: number | string;
  marginHorizontal?: number | string;
  paddingVertical?: number | string;
  marginVertical?: number | string;
  shadow?: boolean | number | Shadow;
  style?: CSSProperties;
  animate?: AnimationProps[] | AnimationProps;
  onPress?: () => void;
  as?: keyof JSX.IntrinsicElements;
  [key: string]: any;
}

export const Element = React.memo(
  forwardRef<HTMLElement, ElementProps>(
    ({ as = 'div', ...props }: ElementProps, ref) => {
      if ((props.onClick || props.onPress) && props.cursor == undefined) {
        props.cursor = 'pointer';
      }

      const { onPress, ...rest } = props;
      const { getColor } = useTheme();
      const { mediaQueries, devices } = useResponsiveContext();

      const utilityClasses = useMemo(
        () => extractUtilityClasses(rest, getColor, mediaQueries, devices),
        [rest, getColor, mediaQueries, devices]
      );

      const newProps: any = { ref };
      if (onPress) {
        newProps.onClick = onPress;
      }

      if (utilityClasses.length > 0) {
        newProps.className = utilityClasses.join(' ');
      }

      const { style, children, ...otherProps } = rest;
      Object.keys(otherProps).forEach((key) => {
        if (
          (!excludedKeys.has(key) && !isStyleProp(key)) ||
          includeKeys.has(key)
        ) {
          newProps[key] = otherProps[key];
        }
      });

      if (style) {
        newProps.style = style;
      }

      const Component = as;
      return <Component {...newProps}>{children}</Component>;
    }
  )
);
