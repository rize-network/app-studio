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
  on?: Record<string, CssProps>;
  media?: Record<string, CssProps>;
  only?: string[];
  css?: CSSProperties | any;
  onPress?: any;
  onClick?: any;
  className?: string;
  themeMode?: 'light' | 'dark';
  as?: keyof JSX.IntrinsicElements;
  style?: CSSProperties;
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

  // Pseudo-element props
  _before?: CssProps;
  _after?: CssProps;
  _firstLetter?: CssProps;
  _firstLine?: CssProps;
  _selection?: CssProps;
  _backdrop?: CssProps;
  _marker?: CssProps;
}

export interface CssProps extends CSSProperties {
  paddingHorizontal?: number | string;
  marginHorizontal?: number | string;
  paddingVertical?: number | string;
  marginVertical?: number | string;
  animate?: AnimationProps[] | AnimationProps;
  shadow?: boolean | number | Shadow;

  // Underscore-prefixed event props (alternative to using the 'on' prop)
  _hover?: CSSProperties | string;
  _active?: CSSProperties | string;
  _focus?: CSSProperties | string;
  _visited?: CSSProperties | string;
  _disabled?: CSSProperties | string;
  _enabled?: CSSProperties | string;
  _checked?: CSSProperties | string;
  _unchecked?: CSSProperties | string;
  _invalid?: CSSProperties | string;
  _valid?: CSSProperties | string;
  _required?: CSSProperties | string;
  _optional?: CSSProperties | string;
  _selected?: CSSProperties | string;
  _target?: CSSProperties | string;
  _firstChild?: CSSProperties | string;
  _lastChild?: CSSProperties | string;
  _onlyChild?: CSSProperties | string;
  _firstOfType?: CSSProperties | string;
  _lastOfType?: CSSProperties | string;
  _empty?: CSSProperties | string;
  _focusVisible?: CSSProperties | string;
  _focusWithin?: CSSProperties | string;
  _placeholder?: CSSProperties | string;

  // Pseudo-element props
  _before?: CSSProperties;
  _after?: CSSProperties;
  _firstLetter?: CSSProperties;
  _firstLine?: CSSProperties;
  _selection?: CSSProperties;
  _backdrop?: CSSProperties;
  _marker?: CSSProperties;
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

      // Handle event tracking for onClick
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
      } else if (props.onClick && !onPress) {
        // If onClick is provided and not already handled by onPress, pass it directly
        newProps.onClick = props.onClick;
      }

      const { style, children, ...otherProps } = rest;

      // First, add all event handlers (they start with "on" and have a capital letter after)
      Object.keys(otherProps).forEach((key) => {
        if (
          key.startsWith('on') &&
          key.length > 2 &&
          key[2] === key[2].toUpperCase()
        ) {
          newProps[key] = (otherProps as any)[key];
        }
      });

      // Then add all other non-style props
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
