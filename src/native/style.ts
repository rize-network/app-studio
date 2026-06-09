import { useMemo } from 'react';
import type React from 'react';
import {
  ImageStyle,
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import { useResponsiveContext } from './providers/Responsive';
import { useTheme } from './providers/Theme';

type NativeStyle = ViewStyle & TextStyle & ImageStyle;
type NativeStyleValue = NativeStyle[keyof NativeStyle] | string | number;

export type NativeStyleProps = Partial<
  Record<keyof NativeStyle, NativeStyleValue>
> & {
  widthHeight?: number | string;
  paddingHorizontal?: number | string;
  paddingVertical?: number | string;
  marginHorizontal?: number | string;
  marginVertical?: number | string;
  shadow?: boolean | number;
};

export interface NativeElementProps extends NativeStyleProps {
  children?: React.ReactNode;
  style?: StyleProp<NativeStyle>;
  css?: NativeStyle;
  media?: Record<string, NativeStyleProps>;
  on?: Record<string, NativeStyleProps>;
  onPress?: (...args: any[]) => void;
  onClick?: (...args: any[]) => void;
  testID?: string;
  className?: string;
  as?: unknown;
  animate?: unknown;
  animateIn?: unknown;
  animateOut?: unknown;
  animateOn?: unknown;
  blend?: boolean;
  before?: React.ReactNode;
  after?: React.ReactNode;
  theme?: Record<string, string>;
  [key: string]: any;
}

const stylePropNames = new Set<string>([
  'alignContent',
  'alignItems',
  'alignSelf',
  'aspectRatio',
  'backfaceVisibility',
  'backgroundColor',
  'borderBottomColor',
  'borderBottomEndRadius',
  'borderBottomLeftRadius',
  'borderBottomRightRadius',
  'borderBottomStartRadius',
  'borderBottomWidth',
  'borderColor',
  'borderCurve',
  'borderEndColor',
  'borderEndWidth',
  'borderLeftColor',
  'borderLeftWidth',
  'borderRadius',
  'borderRightColor',
  'borderRightWidth',
  'borderStartColor',
  'borderStartWidth',
  'borderStyle',
  'borderTopColor',
  'borderTopEndRadius',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderTopStartRadius',
  'borderTopWidth',
  'borderWidth',
  'bottom',
  'boxShadow',
  'color',
  'columnGap',
  'direction',
  'display',
  'elevation',
  'end',
  'flex',
  'flexBasis',
  'flexDirection',
  'flexGrow',
  'flexShrink',
  'flexWrap',
  'fontFamily',
  'fontSize',
  'fontStyle',
  'fontVariant',
  'fontWeight',
  'gap',
  'height',
  'includeFontPadding',
  'justifyContent',
  'left',
  'letterSpacing',
  'lineHeight',
  'margin',
  'marginBottom',
  'marginEnd',
  'marginHorizontal',
  'marginLeft',
  'marginRight',
  'marginStart',
  'marginTop',
  'marginVertical',
  'maxHeight',
  'maxWidth',
  'minHeight',
  'minWidth',
  'objectFit',
  'opacity',
  'overflow',
  'overlayColor',
  'padding',
  'paddingBottom',
  'paddingEnd',
  'paddingHorizontal',
  'paddingLeft',
  'paddingRight',
  'paddingStart',
  'paddingTop',
  'paddingVertical',
  'position',
  'resizeMode',
  'right',
  'rowGap',
  'shadowColor',
  'shadowOffset',
  'shadowOpacity',
  'shadowRadius',
  'start',
  'textAlign',
  'textAlignVertical',
  'textDecorationColor',
  'textDecorationLine',
  'textDecorationStyle',
  'textShadowColor',
  'textShadowOffset',
  'textShadowRadius',
  'textTransform',
  'tintColor',
  'top',
  'transform',
  'transformOrigin',
  'verticalAlign',
  'width',
  'writingDirection',
  'zIndex',
]);

const controlProps = new Set([
  'children',
  'style',
  'css',
  'media',
  'on',
  'onPress',
  'onClick',
  'className',
  'as',
  'animate',
  'animateIn',
  'animateOut',
  'animateOn',
  'blend',
  'before',
  'after',
  'theme',
  'widthHeight',
  'shadow',
]);

const webOnlyProps = new Set([
  '_hover',
  '_active',
  '_focus',
  '_visited',
  '_disabled',
  '_enabled',
  '_checked',
  '_unchecked',
  '_invalid',
  '_valid',
  '_required',
  '_optional',
  '_selected',
  '_target',
  '_firstChild',
  '_lastChild',
  '_onlyChild',
  '_firstOfType',
  '_lastOfType',
  '_empty',
  '_focusVisible',
  '_focusWithin',
  '_placeholder',
  '_groupHover',
  '_groupFocus',
  '_groupActive',
  '_groupDisabled',
  '_peerHover',
  '_peerFocus',
  '_peerActive',
  '_peerDisabled',
  '_peerChecked',
  '_before',
  '_after',
  '_firstLetter',
  '_firstLine',
  '_selection',
  '_backdrop',
  '_marker',
]);

function isColorStyle(property: string) {
  return property === 'color' || property.toLowerCase().includes('color');
}

function normalizeValue(
  property: string,
  value: any,
  getColor: (token: string) => string
) {
  if (typeof value === 'string' && isColorStyle(property)) {
    return getColor(value);
  }

  return value;
}

function applyShadow(style: Record<string, any>, value: boolean | number) {
  if (!value) return;

  const opacity = typeof value === 'number' ? value : 0.2;
  style.shadowColor = '#000000';
  style.shadowOpacity = opacity;
  style.shadowRadius = 4;
  style.shadowOffset = { width: 0, height: 1 };
  style.elevation = Math.max(1, Math.round(opacity * 25));
}

function appendStyleProps(
  input: Record<string, any> | undefined,
  output: Record<string, any>,
  getColor: (token: string) => string
) {
  if (!input) return;

  Object.keys(input).forEach((property) => {
    const value = input[property];
    if (value === undefined || value === null || value === '') return;

    if (property === 'widthHeight') {
      output.width = value;
      output.height = value;
      return;
    }

    if (property === 'shadow') {
      applyShadow(output, value);
      return;
    }

    if (stylePropNames.has(property)) {
      output[property] = normalizeValue(property, value, getColor);
    }
  });
}

function matchesMedia(
  target: string,
  width: number,
  breakpoints: Record<string, number>,
  devices: Record<string, string[]>
) {
  const ordered = Object.entries(breakpoints).sort(([, a], [, b]) => b - a);
  const breakpoint = ordered.find(([, min]) => width >= min)?.[0] || 'xs';

  if (target === breakpoint) return true;
  if (devices[target]?.includes(breakpoint)) return true;
  return false;
}

export function splitNativeProps(props: NativeElementProps) {
  const nativeProps: Record<string, any> = {};

  Object.keys(props).forEach((key) => {
    if (
      controlProps.has(key) ||
      stylePropNames.has(key) ||
      webOnlyProps.has(key)
    ) {
      return;
    }

    if (key === 'data-testid') {
      nativeProps.testID = props[key];
      return;
    }

    if (key === 'aria-label') {
      nativeProps.accessibilityLabel = props[key];
      return;
    }

    nativeProps[key] = props[key];
  });

  return nativeProps;
}

export function useNativeStyle(props: NativeElementProps) {
  const { getColor } = useTheme();
  const responsive = useResponsiveContext();
  const dimensions = useWindowDimensions();

  const scopedGetColor = useMemo(() => {
    if (!props.theme) return getColor;

    return (token: string) => {
      if (!token.startsWith('theme-')) return getColor(token);
      const themeKey = token.slice('theme-'.length).split('-')[0];
      const override = props.theme?.[themeKey];
      return override ? getColor(override) : getColor(token);
    };
  }, [getColor, props.theme]);

  const style = useMemo(() => {
    const next: Record<string, any> = {};

    appendStyleProps(props, next, scopedGetColor);

    if (props.media) {
      Object.keys(props.media).forEach((target) => {
        if (
          matchesMedia(
            target,
            // Context width wins so <Responsive container> / force overrides
            // flow through; fall back to the RN window when no provider is set.
            responsive.currentWidth || dimensions.width,
            responsive.breakpoints,
            responsive.devices
          )
        ) {
          appendStyleProps(props.media?.[target], next, scopedGetColor);
        }
      });
    }

    if (props.css && typeof props.css === 'object') {
      appendStyleProps(props.css, next, scopedGetColor);
    }

    const flattened = StyleSheet.flatten(props.style) || {};
    return { ...next, ...flattened };
  }, [
    props,
    scopedGetColor,
    dimensions.width,
    responsive.currentWidth,
    responsive.breakpoints,
    responsive.devices,
  ]);

  return style;
}
