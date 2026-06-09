import {
  CSSProperties,
  HTMLAttributes,
  HTMLAttributeReferrerPolicy,
  JSX,
} from 'react';
import { AnimationProps } from '../utils/constants';
import { Shadow } from '../utils/shadow';
import { ViewStyleProps } from '../types/style';
import type { Theme } from '../providers/Theme';

export interface CssProps extends CSSProperties {
  paddingHorizontal?: number | string;
  marginHorizontal?: number | string;
  paddingVertical?: number | string;
  marginVertical?: number | string;
  widthHeight?: number | string;
  animate?: AnimationProps[] | AnimationProps;
  animateIn?: AnimationProps[] | AnimationProps;
  animateOut?: AnimationProps[] | AnimationProps;
  animateOn?: 'View' | 'Mount' | 'Both' | 'Scroll';
  shadow?: boolean | number | Shadow;
  blend?: boolean;

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
  _odd?: CSSProperties | string;
  _even?: CSSProperties | string;

  // Group modifiers
  _groupHover?: CSSProperties | string;
  _groupFocus?: CSSProperties | string;
  _groupActive?: CSSProperties | string;
  _groupDisabled?: CSSProperties | string;

  // Peer modifiers
  _peerHover?: CSSProperties | string;
  _peerFocus?: CSSProperties | string;
  _peerActive?: CSSProperties | string;
  _peerDisabled?: CSSProperties | string;
  _peerChecked?: CSSProperties | string;

  // Pseudo-element props
  _before?: CSSProperties;
  _after?: CSSProperties;
  _firstLetter?: CSSProperties;
  _firstLine?: CSSProperties;
  _selection?: CSSProperties;
  _backdrop?: CSSProperties;
  _marker?: CSSProperties;

  // Browser-specific pseudo-classes for form-control polish
  _webkitAutofill?: CSSProperties | string;
  _webkitContactsAutoFillButton?: CSSProperties | string;
  _webkitInnerSpinButton?: CSSProperties | string;
  _webkitOuterSpinButton?: CSSProperties | string;
  _webkitSearchCancelButton?: CSSProperties | string;
  _mozPlaceholder?: CSSProperties | string;
  _mozFocusInner?: CSSProperties | string;

  // Vendor specific
  WebkitUserDrag?: CSSProperties['userSelect']; // Using userSelect type as approximation or just string
  webkitUserDrag?: CSSProperties['userSelect'];
}

export interface ElementProps
  extends
    CssProps,
    Omit<
      ViewStyleProps,
      keyof HTMLAttributes<HTMLElement> | 'children' | 'style' | 'pointerEvents'
    >,
    Omit<
      HTMLAttributes<HTMLElement>,
      'color' | 'style' | 'content' | 'translate'
    > {
  // --- Native HTML attributes that depend on `as`
  // Surfaced explicitly so consumers can pass <View as="video"|"audio"|"img"|"iframe"|"button"|"input"|"select"|"textarea"|"svg">
  // without TS complaining. Listed here rather than via AllHTMLAttributes
  // because AllHTMLAttributes would collide with CSS props (width, height,
  // size, start, etc.) that are part of ViewStyleProps.

  // Media (img / video / audio / iframe / source / track)
  src?: string;
  alt?: string;
  controls?: boolean;
  muted?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  poster?: string;
  playsInline?: boolean;
  preload?: 'none' | 'metadata' | 'auto' | '';
  crossOrigin?: 'anonymous' | 'use-credentials' | '';
  srcSet?: string;
  sizes?: string;
  loading?: 'eager' | 'lazy';
  referrerPolicy?: HTMLAttributeReferrerPolicy;
  decoding?: 'async' | 'auto' | 'sync';

  // Form controls (button / input / select / textarea / form / fieldset)
  // INTENTIONALLY EXCLUDED — they conflict with domain components that narrow
  // these to discriminated unions or specific shapes:
  //   - `name`     → Icon narrows it to an icon-id union
  //   - `value`    → Switch (boolean), Select (string|string[])
  //   - `defaultValue` / `checked` / `defaultChecked` / `multiple` → same idea
  // Components that need an actual HTML input attribute should use the
  // specialized `Input` component (which accepts them via InputProps),
  // not a polymorphic `<View as="input">`.
  //
  // `name` IS included because consumers use `<Element as="textarea|select"
  // name=...>` directly for form submission. Components that narrow `name`
  // (e.g. Icon's icon-id union) must Omit it when extending ViewProps.
  name?: string;
  // `value` / `defaultValue` / `multiple` are also re-exposed because polymorphic
  // `<View as="select|input|textarea">` callers need them. Domain components
  // that narrow these (Switch -> boolean, Select -> string|string[]) Omit them
  // when extending InputProps. Default HTMLInputElement-style typing.
  value?: string | number | readonly string[];
  defaultValue?: string | number | readonly string[];
  multiple?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  placeholder?: string;
  pattern?: string;
  min?: number | string;
  max?: number | string;
  minLength?: number;
  maxLength?: number;
  step?: number | string;
  form?: string;
  formAction?: string;
  formEncType?: string;
  formMethod?: 'get' | 'post' | 'dialog';
  formNoValidate?: boolean;
  formTarget?: string;
  rows?: number;
  cols?: number;
  /** HTML textarea wrap attribute. Browsers accept 'hard' | 'soft' | 'off' but
   * the DOM type widens to plain `string`, so we mirror that here. */
  wrap?: string;
  list?: string;
  accept?: string;
  capture?: boolean | 'user' | 'environment';

  // Table cells (td / th)
  colSpan?: number;
  rowSpan?: number;
  headers?: string;
  scope?: string;

  // Links / nav (a / area)
  href?: string;
  target?: string;
  rel?: string;
  hrefLang?: string;
  download?: string | boolean;

  // SVG-specific attributes for <View as="svg"> usage.
  // NOTE: `fill`, `stroke`, `strokeWidth`, `strokeLinecap`, `strokeLinejoin`,
  // `strokeDasharray`, `strokeDashoffset`, `strokeOpacity`, `fillOpacity`,
  // `fillRule` are intentionally NOT redeclared — they already flow in via
  // CssProps -> CSSProperties (csstype). Redeclaring them here narrows the
  // type and breaks consumers that pass CSSProperties through.
  xmlns?: string;
  viewBox?: string;
  preserveAspectRatio?: string;

  // Misc
  open?: boolean;
  scoped?: boolean;
  reversed?: boolean;
  start?: number;
  htmlFor?: string;
  // Event handling props
  on?: Record<string, CssProps>;
  media?: Record<string, CssProps>;
  only?: string[];
  css?: CSSProperties | any;
  onPress?: any;
  onClick?: any;
  className?: string;
  blend?: boolean;
  type?: string;

  as?: keyof JSX.IntrinsicElements;
  style?: CSSProperties;
  widthHeight?: number | string;
  children?: React.ReactNode;
  // iframe-specific attributes — surfaced for <View as="iframe"> usage
  srcDoc?: string;
  sandbox?: string;
  // Polymorphic-link helper — translated to <a href> when present on a clickable element
  to?: string;
  // Editor-driven prop: list of i18n / location keys associated with this node.
  // Consumed by tooling (page editor, content extractor) but inert at runtime.
  keys?: any[];
  // Material-UI compatibility shim — alternate style sink (merged with style).
  sx?: any;
  // Skeleton-component compatibility shim — per-item style override.
  itemStyle?: any;
  // Spacing shorthands — convenience aliases for paddingHorizontal/Vertical
  paddingX?: number | string;
  paddingY?: number | string;
  marginX?: number | string;
  marginY?: number | string;
  // Hover-style shorthand — convenience alias for on={{ hover: { backgroundColor: ... } }}
  hoverBackgroundColor?: string;
  // Hover-state style sink — convenience alias for on={{ hover: {...} }} (or `true` for default elevated style)
  hover?: boolean | Record<string, any>;
  // Hover-state style sink alternate alias
  hoverStyle?: Record<string, any>;
  // HTML input attribute — surfaced for <View as="input" type="checkbox|radio"> usage
  checked?: boolean;
  defaultChecked?: boolean;
  // CSS transition shorthand (also flows through `style`, this is the prop alias)
  transition?: string;
  before?: React.ReactNode;
  after?: React.ReactNode;

  /**
   * Component-scoped theme override. Remaps `theme-*` tokens used by this
   * component (and its style props) to different color tokens, without
   * affecting the global ThemeProvider. Each value is a color token string
   * (`color-red-500`, `theme-secondary`) or a raw color (`#ff0000`).
   */
  theme?: Partial<Theme>;
  themeMode?: 'light' | 'dark';

  animateOn?: 'View' | 'Mount' | 'Both' | 'Scroll';

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
  _odd?: CssProps | string;
  _even?: CssProps | string;

  // Group modifiers
  _groupHover?: CssProps | string;
  _groupFocus?: CssProps | string;
  _groupActive?: CssProps | string;
  _groupDisabled?: CssProps | string;

  // Peer modifiers
  _peerHover?: CssProps | string;
  _peerFocus?: CssProps | string;
  _peerActive?: CssProps | string;
  _peerDisabled?: CssProps | string;
  _peerChecked?: CssProps | string;

  // Pseudo-element props
  _before?: CssProps;
  _after?: CssProps;
  _firstLetter?: CssProps;
  _firstLine?: CssProps;
  _selection?: CssProps;
  _backdrop?: CssProps;
  _marker?: CssProps;

  // Browser-specific pseudo-classes for form-control polish
  _webkitAutofill?: CssProps | string;
  _webkitContactsAutoFillButton?: CssProps | string;
  _webkitInnerSpinButton?: CssProps | string;
  _webkitOuterSpinButton?: CssProps | string;
  _webkitSearchCancelButton?: CssProps | string;
  _mozPlaceholder?: CssProps | string;
  _mozFocusInner?: CssProps | string;
}
