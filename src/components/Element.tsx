import React, { CSSProperties, useMemo, forwardRef } from 'react';
import { useTheme } from '../providers/Theme';
import { useResponsiveContext } from '../providers/Responsive';

import { isStyleProp } from '../utils/style';
import { AnimationProps, excludedKeys, includeKeys } from '../utils/constants';
import { extractUtilityClasses } from '../animation/css';
import { Shadow } from '../utils/shadow';
import { useAnalytics } from '../providers/Analytics';
import { ViewStyleProps } from '../types/style';

export interface ElementProps
  extends CssProps,
    Omit<ViewStyleProps, 'children' | 'style' | 'pointerEvents' | 'onClick'> {
  on?: Record<string, CssProps> | undefined;
  media?: Record<string, CssProps> | undefined;
  only?: string[] | undefined;
  css?: CSSProperties | undefined;
  onPress?: any;
  onClick?: any;
  themeMode?: 'light' | 'dark';
  as?: keyof JSX.IntrinsicElements;
  style?: CSSProperties;
  shadow?: boolean | number | Shadow;
  size?: number | string;
  children?: React.ReactNode;
}

export interface CssProps extends CSSProperties {
  paddingHorizontal?: number | string;
  marginHorizontal?: number | string;
  paddingVertical?: number | string;
  marginVertical?: number | string;
  animate?: AnimationProps[] | AnimationProps;
}

export const Element = React.memo(
  forwardRef<HTMLElement, ElementProps>(
    ({ as = 'div', ...props }: ElementProps, ref) => {
      if ((props.onClick || props.onPress) && props.cursor == undefined) {
        props.cursor = 'pointer';
      }

      const { onPress, ...rest } = props;
      const { getColor, themeMode } = useTheme();
      const { trackEvent } = useAnalytics();
      const { mediaQueries, devices } = useResponsiveContext();

      const elementMode = props.themeMode ? props.themeMode : themeMode;
      const utilityClasses = useMemo(
        () =>
          extractUtilityClasses(
            rest,
            (color: string) => {
              return getColor(color, elementMode);
            },
            mediaQueries,
            devices
          ),
        [rest, mediaQueries, devices, elementMode]
      );

      const newProps: any = { ref };
      if (onPress) {
        newProps.onClick = onPress;
      }

      if (utilityClasses.length > 0) {
        newProps.className = utilityClasses.join(' ');
      }

      if (trackEvent && props.onClick) {
        let componentName: string;
        if (typeof as === 'string') {
          componentName = as;
        } else {
          componentName =
            (as as React.ComponentType<any>).displayName ||
            (as as React.ComponentType<any>).name ||
            'div';
        }
        let text: string | undefined;
        if (typeof props.children === 'string') {
          text = props.children.slice(0, 100);
        }
        newProps.onClick = (event: any) => {
          trackEvent({
            type: 'click',
            target: componentName !== 'div' ? componentName : undefined,
            text,
          });
          if (props.onClick) {
            props.onClick(event);
          }
        };
      }

      const { style, children, ...otherProps } = rest;
      Object.keys(otherProps).forEach((key) => {
        if (
          (!excludedKeys.has(key) && !isStyleProp(key)) ||
          includeKeys.has(key)
        ) {
          newProps[key] = (otherProps as any)[key];
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
