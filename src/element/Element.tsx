import React, { CSSProperties, useMemo, forwardRef } from 'react';
import { Colors, Theme, useTheme } from '../providers/Theme';
import { useResponsiveContext } from '../providers/Responsive';

import { isStyleProp } from '../utils/style';
import { AnimationProps, excludedKeys, includeKeys } from '../utils/constants';
import { extractUtilityClasses } from './css';
import { Shadow } from '../utils/shadow';
import { useAnalytics } from '../providers/Analytics';
import { ViewStyleProps } from '../types/style';

export interface ElementProps
  extends CssProps,
    Omit<ViewStyleProps, 'children' | 'style' | 'pointerEvents' | 'onClick'> {
  [key: string]: any;
  // Event handling props
  on?: Record<string, CssProps> | undefined;
  media?: Record<string, CssProps> | undefined;
  only?: string[] | undefined;
  css?: CSSProperties | any;
  onPress?: any;
  onClick?: any;
  className?: string;
  themeMode?: 'light' | 'dark';
  as?: keyof JSX.IntrinsicElements;
  style?: CSSProperties;
  shadow?: boolean | number | Shadow;
  widthHeight?: number | string;
  children?: React.ReactNode;
  colors?: Colors;
  theme?: Theme;

  // Underscore-prefixed event props (alternative to using the 'on' prop)
  _hover?: CssProps | string;
  _active?: CssProps | string;
  _focus?: CssProps | string;
  _visited?: CssProps | string;
  _disabled?: CssProps | string;
  _enabled?: CssProps | string;
  _checked?: CssProps | string;
  _unchecked?: CssProps | string;
  _invalid?: CssProps | string;
  _valid?: CssProps | string;
  _required?: CssProps | string;
  _optional?: CssProps | string;
  _selected?: CssProps | string;
  _target?: CssProps | string;
  _firstChild?: CssProps | string;
  _lastChild?: CssProps | string;
  _onlyChild?: CssProps | string;
  _firstOfType?: CssProps | string;
  _lastOfType?: CssProps | string;
  _empty?: CssProps | string;
  _focusVisible?: CssProps | string;
  _focusWithin?: CssProps | string;
  _placeholder?: CssProps | string;
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
      const { getColor, theme } = useTheme();
      const { trackEvent } = useAnalytics();
      const { mediaQueries, devices } = useResponsiveContext();

      const utilityClasses = useMemo(
        () =>
          extractUtilityClasses(
            rest,
            (color: string) => {
              return getColor(color, {
                colors: props.colors,
                theme: props.theme,
                themeMode: props.themeMode,
              });
            },
            mediaQueries,
            devices
          ),
        [rest, mediaQueries, devices, theme]
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
