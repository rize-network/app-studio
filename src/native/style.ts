import { useMemo, useRef } from 'react';
import type React from 'react';
import {
  ImageStyle,
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import {
  getBreakpointFromWidth,
  useResponsiveContext,
} from './providers/Responsive';
import { useTheme } from './providers/Theme';
import type { SafeAreaProps } from '../utils/safeArea';
import { hash } from '../utils/hash';

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

export interface NativeElementProps extends NativeStyleProps, SafeAreaProps {
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
  // Safe-area control props (consumed by useSafeArea, never passed to RN)
  'safeArea',
  'safeAreaTop',
  'safeAreaBottom',
  'safeAreaLeft',
  'safeAreaRight',
  'safeAreaEdges',
  'ignoreSafeArea',
  'safeAreaMode',
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

// Matches a plain pixel value like "8px", "100px", "-4.5px".
const PX_VALUE = /^-?\d*\.?\d+px$/;

function normalizeValue(
  property: string,
  value: any,
  getColor: (token: string) => string
) {
  if (typeof value === 'string') {
    if (isColorStyle(property)) {
      // CSS color keywords with no RN equivalent ("inherit"/"currentColor"/…)
      // throw on native ("'inherit' is not a valid color or brush"). Drop them
      // so the element falls back to its default instead of crashing.
      const lower = value.toLowerCase();
      if (
        lower === 'inherit' ||
        lower === 'currentcolor' ||
        lower === 'initial' ||
        lower === 'unset' ||
        lower === 'revert'
      ) {
        return undefined;
      }
      return getColor(value);
    }
    // CSS intrinsic-size keywords have no RN equivalent; map to 'auto' so the
    // box sizes to its content instead of being dropped (e.g. width:'fit-content').
    const lowerVal = value.toLowerCase();
    if (
      lowerVal === 'fit-content' ||
      lowerVal === 'max-content' ||
      lowerVal === 'min-content'
    ) {
      return 'auto';
    }
    // React Native expects unitless numbers for dimensions/spacing; a raw
    // "8px"/"100px" string is silently dropped (zero-size boxes, missing dots).
    // Strip the `px` unit so web-authored styles render on native. `%` and
    // other units are left untouched (RN supports `%` on most layout props).
    if (PX_VALUE.test(value)) {
      return parseFloat(value);
    }
  }

  return value;
}

// Convert one CSS length token ("8px", "10", "50%") to the RN value.
function lengthToken(tok: string): number | string {
  const t = tok.trim();
  if (PX_VALUE.test(t)) return parseFloat(t);
  if (/^-?\d*\.?\d+$/.test(t)) return parseFloat(t);
  return t; // leave %, auto, etc.
}

// Expand a CSS `padding`/`margin` shorthand (e.g. "0 6px", "12px 16px",
// "4px 8px 4px 8px") into RN longhand props. RN does NOT accept multi-value
// shorthand strings, so without this they are silently dropped (no spacing).
function expandBox(
  prefix: 'padding' | 'margin',
  value: string,
  output: Record<string, any>
) {
  const parts = value.trim().split(/\s+/).map(lengthToken);
  let top, right, bottom, left;
  if (parts.length === 1) {
    top = right = bottom = left = parts[0];
  } else if (parts.length === 2) {
    top = bottom = parts[0];
    right = left = parts[1];
  } else if (parts.length === 3) {
    top = parts[0];
    right = left = parts[1];
    bottom = parts[2];
  } else {
    [top, right, bottom, left] = parts;
  }
  output[`${prefix}Top`] = top;
  output[`${prefix}Right`] = right;
  output[`${prefix}Bottom`] = bottom;
  output[`${prefix}Left`] = left;
}

// Expand a CSS `border` shorthand ("1px solid #ccc", "1px solid") into RN
// borderWidth/borderStyle/borderColor. RN ignores the shorthand entirely.
function expandBorder(
  value: string,
  output: Record<string, any>,
  getColor: (token: string) => string
) {
  const tokens = value.trim().split(/\s+/);
  const styleKeywords = ['solid', 'dashed', 'dotted', 'none'];
  tokens.forEach((tok) => {
    if (PX_VALUE.test(tok) || /^-?\d*\.?\d+$/.test(tok)) {
      output.borderWidth = parseFloat(tok);
    } else if (styleKeywords.includes(tok.toLowerCase())) {
      output.borderStyle = tok.toLowerCase();
    } else {
      output.borderColor = getColor(tok);
    }
  });
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

    // Expand CSS shorthands RN can't parse (multi-value padding/margin, the
    // `border` shorthand) into longhand so web-authored styles keep their
    // spacing/borders on native.
    if (
      (property === 'padding' || property === 'margin') &&
      typeof value === 'string' &&
      value.trim().includes(' ')
    ) {
      expandBox(property, value, output);
      return;
    }
    if (property === 'border' && typeof value === 'string') {
      expandBorder(value, output, getColor);
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

// Control props (not real CSS keys) that still change the computed style and so
// must participate in the style hash.
const styleAffectingControlProps = new Set<string>([
  'media',
  'css',
  'style',
  'shadow',
  'widthHeight',
  'theme',
]);

function fastSerialize(value: any): string {
  if (value == null) return 'n';
  const t = typeof value;
  if (t === 'string') return 's' + value;
  if (t === 'number') return 'd' + value;
  if (t === 'boolean') return value ? 'T' : 'F';
  return JSON.stringify(value);
}

/**
 * Hash only the style-relevant props so we can detect, cheaply, whether the
 * computed style would change. Non-style props (children, handlers, etc.) are
 * ignored — they never affect the StyleSheet object.
 */
export function hashNativeStyleProps(props: NativeElementProps): string {
  let input = '';
  const keys = Object.keys(props);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (stylePropNames.has(key) || styleAffectingControlProps.has(key)) {
      const value = (props as any)[key];
      if (value !== undefined) input += '|' + key + ':' + fastSerialize(value);
    }
  }
  return hash(input);
}

/**
 * Compute the RN style object for an element.
 *
 * PERFORMANCE: callers always pass a fresh `props` object (spread), so a plain
 * `useMemo([props])` would recompute every render and hand back a new style
 * reference each time — defeating `React.memo`/host-prop bail-outs downstream.
 * Instead we key a ref cache by a hash of only the STYLE-relevant props (plus
 * the resolved theme and matched breakpoint), so:
 *   - the StyleSheet object is recomputed only on a real change, and
 *   - the returned reference is STABLE across renders, letting RN skip
 *     re-diffing and memoized children bail out.
 */
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

  // Context width wins so <Responsive container> / force overrides flow
  // through; fall back to the RN window when no provider is set.
  const mediaActive = !!props.media;
  const widthForMedia = responsive.currentWidth || dimensions.width;
  // Key media re-resolution on the matched BREAKPOINT, not raw width — so a
  // resize within the same breakpoint doesn't bust the cache. Empty when the
  // element has no `media` prop (then width changes never recompute).
  const mediaBreakpoint = mediaActive
    ? getBreakpointFromWidth(widthForMedia, responsive.breakpoints)
    : '';

  const cacheRef = useRef<{
    key: string;
    getColor: (token: string) => string;
    devices: Record<string, string[]>;
    style: Record<string, any>;
  } | null>(null);

  const key = hashNativeStyleProps(props) + '|' + mediaBreakpoint;

  const cache = cacheRef.current;
  const stale =
    !cache ||
    cache.key !== key ||
    cache.getColor !== scopedGetColor ||
    (mediaActive && cache.devices !== responsive.devices);

  if (stale) {
    const next: Record<string, any> = {};

    appendStyleProps(props, next, scopedGetColor);

    if (props.media) {
      Object.keys(props.media).forEach((target) => {
        if (
          matchesMedia(
            target,
            widthForMedia,
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
    cacheRef.current = {
      key,
      getColor: scopedGetColor,
      devices: responsive.devices,
      style: { ...next, ...flattened },
    };
  }

  return cacheRef.current!.style;
}
