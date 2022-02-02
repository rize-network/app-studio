/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
import { CSSProperties } from 'styled-components';

export type ColorValue = null | string;

export type DimensionValue = null | number | string;

export type EdgeInsetsValue = {
  top: number;
  left: number;
  right: number;
  bottom: number;
};

export type GenericStyleProp<T> =
  | null
  | void
  | T
  | false
  | ''
  | readonly GenericStyleProp<T>[];

export type LayoutValue = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type LayoutEvent = {
  nativeEvent: {
    layout: LayoutValue;
    target: any;
  };
  timeStamp: number;
};

export type PointValue = {
  x: number;
  y: number;
};

type NumberOrString = number | string;

/**
 * Animations and transitions
 */
type AnimationDirection =
  | 'alternate'
  | 'alternate-reverse'
  | 'normal'
  | 'reverse';
type AnimationFillMode = 'none' | 'forwards' | 'backwards' | 'both';
type AnimationIterationCount = number | 'infinite';
type AnimationKeyframes = string | Object;
type AnimationPlayState = 'paused' | 'running';

export type AnimationStyles = {
  animationDelay?: (string | string[]) | null | undefined;
  animationDirection?:
    | (AnimationDirection | AnimationDirection[])
    | null
    | undefined;
  animationDuration?: (string | string[]) | null | undefined;
  animationFillMode?:
    | (AnimationFillMode | AnimationFillMode[])
    | null
    | undefined;
  animationIterationCount?:
    | (AnimationIterationCount | AnimationIterationCount[])
    | null
    | undefined;
  animationKeyframes?:
    | (AnimationKeyframes | AnimationKeyframes[])
    | null
    | undefined;
  animationPlayState?:
    | (AnimationPlayState | AnimationPlayState[])
    | null
    | undefined;
  animationTimingFunction?: (string | string[]) | null | undefined;
  transitionDelay?: (string | string[]) | null | undefined;
  transitionDuration?: (string | string[]) | null | undefined;
  transitionProperty?: (string | string[]) | null | undefined;
  transitionTimingFunction?: (string | string[]) | null | undefined;
};

/**
 * Border
 */
type BorderRadiusValue = number | string;
type BorderStyleValue = 'solid' | 'dotted' | 'dashed';

export type BorderStyles = {
  border?: string | null | undefined;
  borderColor?: ColorValue | null | undefined;
  borderBottomColor?: ColorValue | null | undefined;
  borderEndColor?: ColorValue | null | undefined;
  borderLeftColor?: ColorValue | null | undefined;
  borderRightColor?: ColorValue | null | undefined;
  borderStartColor?: ColorValue | null | undefined;
  borderTopColor?: ColorValue | null | undefined;
  borderRadius?: BorderRadiusValue | null | undefined;
  borderBottomEndRadius?: BorderRadiusValue | null | undefined;
  borderBottomLeftRadius?: BorderRadiusValue | null | undefined;
  borderBottomRightRadius?: BorderRadiusValue | null | undefined;
  borderBottomStartRadius?: BorderRadiusValue | null | undefined;
  borderTopEndRadius?: BorderRadiusValue | null | undefined;
  borderTopLeftRadius?: BorderRadiusValue | null | undefined;
  borderTopRightRadius?: BorderRadiusValue | null | undefined;
  borderTopStartRadius?: BorderRadiusValue | null | undefined;
  borderStyle?: BorderStyleValue | null | undefined;
  borderBottomStyle?: BorderStyleValue | null | undefined;
  borderEndStyle?: BorderStyleValue | null | undefined;
  borderLeftStyle?: BorderStyleValue | null | undefined;
  borderRightStyle?: BorderStyleValue | null | undefined;
  borderStartStyle?: BorderStyleValue | null | undefined;
  borderTopStyle?: BorderStyleValue | null | undefined;
};

/**
 * Interactions
 */
type CursorValue =
  | 'alias'
  | 'all-scroll'
  | 'auto'
  | 'cell'
  | 'context-menu'
  | 'copy'
  | 'crosshair'
  | 'default'
  | 'grab'
  | 'grabbing'
  | 'help'
  | 'pointer'
  | 'progress'
  | 'wait'
  | 'text'
  | 'vertical-text'
  | 'move'
  | 'none'
  | 'no-drop'
  | 'not-allowed'
  | 'zoom-in'
  | 'zoom-out' // resize
  | 'col-resize'
  | 'e-resize'
  | 'ew-resize'
  | 'n-resize'
  | 'ne-resize'
  | 'ns-resize'
  | 'nw-resize'
  | 'row-resize'
  | 's-resize'
  | 'se-resize'
  | 'sw-resize'
  | 'w-resize'
  | 'nesw-resize'
  | 'nwse-resize';

type TouchActionValue =
  | 'auto'
  | 'inherit'
  | 'manipulation'
  | 'none'
  | 'pan-down'
  | 'pan-left'
  | 'pan-right'
  | 'pan-up'
  | 'pan-x'
  | 'pan-y'
  | 'pinch-zoom';

type UserSelect = 'all' | 'auto' | 'contain' | 'none' | 'text';

export type InteractionStyles = {
  // https://developer.mozilla.org/en-US/docs/Web/CSS/cursor#Formal_syntax
  cursor?: CursorValue | null | undefined;
  // https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action#Formal_syntax
  touchAction?: TouchActionValue | null | undefined;
  // https://developer.mozilla.org/en-US/docs/Web/CSS/user-select#Formal_syntax_2
  userSelect?: UserSelect | null | undefined;
  willChange?: string | null | undefined;
};

/**
 * Layout
 */
type OverflowValue = 'auto' | 'hidden' | 'scroll' | 'visible';
type VisiblilityValue = 'hidden' | 'visible';

export type LayoutStyles = {
  alignContent?:
    | 'center'
    | 'flex-end'
    | 'flex-start'
    | 'space-around'
    | 'space-between'
    | 'stretch';
  alignItems?:
    | ('baseline' | 'center' | 'flex-end' | 'flex-start' | 'stretch')
    | null
    | undefined;
  alignSelf?:
    | ('auto' | 'baseline' | 'center' | 'flex-end' | 'flex-start' | 'stretch')
    | null
    | undefined;
  backfaceVisibility?: VisiblilityValue | null | undefined;
  borderWidth?: DimensionValue | null | undefined;
  borderBottomWidth?: DimensionValue | null | undefined;
  borderEndWidth?: DimensionValue | null | undefined;
  borderLeftWidth?: DimensionValue | null | undefined;
  borderRightWidth?: DimensionValue | null | undefined;
  borderStartWidth?: DimensionValue | null | undefined;
  borderTopWidth?: DimensionValue | null | undefined;
  bottom?: DimensionValue | null | undefined;
  boxSizing?: ('border-box' | 'content-box' | 'padding-box') | null | undefined;
  direction?: ('inherit' | 'ltr' | 'rtl') | null | undefined;
  display?: string | null | undefined;
  end?: DimensionValue | null | undefined;
  flex?: number | null | undefined;
  flexBasis?: DimensionValue | null | undefined;
  flexDirection?:
    | ('column' | 'column-reverse' | 'row' | 'row-reverse')
    | null
    | undefined;
  flexGrow?: number | null | undefined;
  flexShrink?: number | null | undefined;
  flexWrap?: ('nowrap' | 'wrap' | 'wrap-reverse') | null | undefined;
  height?: DimensionValue | null | undefined;
  justifyContent?:
    | (
        | 'center'
        | 'flex-end'
        | 'flex-start'
        | 'space-around'
        | 'space-between'
        | 'space-evenly'
      )
    | null
    | undefined;
  left?: DimensionValue | null | undefined;
  margin?: DimensionValue | null | undefined;
  marginBottom?: DimensionValue | null | undefined;
  marginHorizontal?: DimensionValue | null | undefined;
  marginEnd?: DimensionValue | null | undefined;
  marginLeft?: DimensionValue | null | undefined;
  marginRight?: DimensionValue | null | undefined;
  marginStart?: DimensionValue | null | undefined;
  marginTop?: DimensionValue | null | undefined;
  marginVertical?: DimensionValue | null | undefined;
  maxHeight?: DimensionValue | null | undefined;
  maxWidth?: DimensionValue | null | undefined;
  minHeight?: DimensionValue | null | undefined;
  minWidth?: DimensionValue | null | undefined;
  order?: number | null | undefined;
  overflow?: OverflowValue | null | undefined;
  overflowX?: OverflowValue | null | undefined;
  overflowY?: OverflowValue | null | undefined;
  padding?: DimensionValue | null | undefined;
  paddingBottom?: DimensionValue | null | undefined;
  paddingHorizontal?: DimensionValue | null | undefined;
  paddingEnd?: DimensionValue | null | undefined;
  paddingLeft?: DimensionValue | null | undefined;
  paddingRight?: DimensionValue | null | undefined;
  paddingStart?: DimensionValue | null | undefined;
  paddingTop?: DimensionValue | null | undefined;
  paddingVertical?: DimensionValue | null | undefined;
  position?:
    | ('absolute' | 'fixed' | 'relative' | 'static' | 'sticky')
    | null
    | undefined;
  right?: DimensionValue | null | undefined;
  start?: DimensionValue | null | undefined;
  top?: DimensionValue | null | undefined;
  visibility?: VisiblilityValue | null | undefined;
  width?: DimensionValue | null | undefined;
  zIndex?: number | null | undefined;

  /**
   * @platform unsupported
   */
  aspectRatio?: number | null | undefined;

  /**
   * @platform web
   */
  gridAutoColumns?: string | null | undefined;
  gridAutoFlow?: string | null | undefined;
  gridAutoRows?: string | null | undefined;
  gridColumnEnd?: string | null | undefined;
  gridColumnGap?: string | null | undefined;
  gridColumnStart?: string | null | undefined;
  gridRowEnd?: string | null | undefined;
  gridRowGap?: string | null | undefined;
  gridRowStart?: string | null | undefined;
  gridTemplateColumns?: string | null | undefined;
  gridTemplateRows?: string | null | undefined;
  gridTemplateAreas?: string | null | undefined;
};

/**
 * Shadows
 */
export type ShadowStyles = {
  shadowColor?: ColorValue | null | undefined;
  shadowOffset?: {
    width?: DimensionValue;
    height?: DimensionValue;
  };
  shadowOpacity?: number | null | undefined;
  shadowRadius?: DimensionValue | null | undefined;
};

/**
 * Transforms
 */
export type TransformStyles = {
  perspective?: NumberOrString | null | undefined;
  perspectiveOrigin?: string | null | undefined;
  transform?: (
    | { readonly perspective: NumberOrString }
    | { readonly rotate: string }
    | { readonly rotateX: string }
    | { readonly rotateY: string }
    | { readonly rotateZ: string }
    | { readonly scale: number }
    | { readonly scaleX: number }
    | { readonly scaleY: number }
    | { readonly scaleZ: number }
    | { readonly scale3d: string }
    | { readonly skewX: string }
    | { readonly skewY: string }
    | { readonly translateX: NumberOrString }
    | { readonly translateY: NumberOrString }
    | { readonly translateZ: NumberOrString }
    | { readonly translate3d: string }
  )[];
  transformOrigin?: string | null | undefined;
  transformStyle?: ('flat' | 'preserve-3d') | null | undefined;
};

type OverscrollBehaviorValue = 'auto' | 'contain' | 'none';

export type ViewStyle = AnimationStyles &
  BorderStyles &
  InteractionStyles &
  LayoutStyles &
  ShadowStyles &
  TransformStyles & {
    backdropFilter?: string | null | undefined;
    backgroundAttachment?: string | null | undefined;
    backgroundBlendMode?: string | null | undefined;
    backgroundClip?: string | null | undefined;
    backgroundColor?: ColorValue | null | undefined;
    backgroundImage?: string | null | undefined;
    backgroundOrigin?: 'border-box' | 'content-box' | 'padding-box';
    backgroundPosition?: string | null | undefined;
    backgroundRepeat?: string | null | undefined;
    backgroundSize?: string | null | undefined;
    boxShadow?: string | null | undefined;
    clip?: string | null | undefined;
    filter?: string | null | undefined;
    opacity?: number | null | undefined;
    outlineColor?: ColorValue | null | undefined;
    outlineOffset?: NumberOrString | null | undefined;
    outlineStyle?: string | null | undefined;
    outlineWidth?: NumberOrString | null | undefined;
    overscrollBehavior?: OverscrollBehaviorValue | null | undefined;
    overscrollBehaviorX?: OverscrollBehaviorValue | null | undefined;
    overscrollBehaviorY?: OverscrollBehaviorValue | null | undefined;
    scrollbarWidth?: 'auto' | 'none' | 'thin';
    scrollSnapAlign?: string | null | undefined;
    scrollSnapType?: string | null | undefined;
    WebkitMaskImage?: string | null | undefined;
    WebkitOverflowScrolling?: 'auto' | 'touch';
  };

export type ViewStyleProps = {
  accessibilityLabel?: string | null | undefined;
  accessibilityLiveRegion?: 'none' | 'polite' | 'assertive';
  accessibilityRole?: string | null | undefined;
  accessibilityState?: {
    busy?: boolean | null | undefined;
    checked?: (boolean | null | undefined) | 'mixed';
    disabled?: boolean | null | undefined;
    expanded?: boolean | null | undefined;
    grabbed?: boolean | null | undefined;
    hidden?: boolean | null | undefined;
    invalid?: boolean | null | undefined;
    modal?: boolean | null | undefined;
    pressed?: boolean | null | undefined;
    readonly?: boolean | null | undefined;
    required?: boolean | null | undefined;
    selected?: boolean | null | undefined;
  };
  accessibilityValue?: {
    max?: number | null | undefined;
    min?: number | null | undefined;
    now?: number | null | undefined;
    text?: string | null | undefined;
  };
  accessible?: boolean;
  children?: any | null | undefined;
  importantForAccessibility?: 'auto' | 'yes' | 'no' | 'no-hide-descendants';
  nativeID?: string | null | undefined;
  onBlur?: (e: any) => void;
  onClick?: (e: any) => void;
  onClickCapture?: (e: any) => void;
  onContextMenu?: (e: any) => void;
  onFocus?: (e: any) => void;
  onKeyDown?: (e: any) => void;
  onKeyUp?: (e: any) => void;
  onLayout?: (e: LayoutEvent) => void;
  onMoveShouldSetResponder?: (e: any) => boolean;
  onMoveShouldSetResponderCapture?: (e: any) => boolean;
  onResponderEnd?: (e: any) => void;
  onResponderGrant?: (e: any) => void;
  onResponderMove?: (e: any) => void;
  onResponderReject?: (e: any) => void;
  onResponderRelease?: (e: any) => void;
  onResponderStart?: (e: any) => void;
  onResponderTerminate?: (e: any) => void;
  onResponderTerminationRequest?: (e: any) => boolean;
  onScrollShouldSetResponder?: (e: any) => boolean;
  onScrollShouldSetResponderCapture?: (e: any) => boolean;
  onSelectionChangeShouldSetResponder?: (e: any) => boolean;
  onSelectionChangeShouldSetResponderCapture?: (e: any) => boolean;
  onStartShouldSetResponder?: (e: any) => boolean;
  onStartShouldSetResponderCapture?: (e: any) => boolean;
  pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto';
  style?:
    | false
    | void
    | ''
    | ViewStyle
    | readonly GenericStyleProp<ViewStyle>[]
    | null
    | undefined;
  testID?: string | null | undefined;
  // unstable
  dataSet?: Object | null | undefined;
  onMouseDown?: (e: any) => void;
  onMouseEnter?: (e: any) => void;
  onMouseLeave?: (e: any) => void;
  onMouseMove?: (e: any) => void;
  onMouseOver?: (e: any) => void;
  onMouseOut?: (e: any) => void;
  onMouseUp?: (e: any) => void;
  onScroll?: (e: any) => void;
  onTouchCancel?: (e: any) => void;
  onTouchCancelCapture?: (e: any) => void;
  onTouchEnd?: (e: any) => void;
  onTouchEndCapture?: (e: any) => void;
  onTouchMove?: (e: any) => void;
  onTouchMoveCapture?: (e: any) => void;
  onTouchStart?: (e: any) => void;
  onTouchStartCapture?: (e: any) => void;
  onWheel?: (e: any) => void;
  href?: string | null | undefined;
  rel?: string | null | undefined;
  target?: string | null | undefined;
};

type SourceObject = {
  /**
   * `body` is the HTTP body to send with the request. This must be a valid
   * UTF-8 string, and will be sent exactly as specified, with no
   * additional encoding (e.g. URL-escaping or base64) applied.
   */
  body?: string;

  /**
   * `cache` determines how the requests handles potentially cached
   * responses.
   *
   * - `default`: Use the native platforms default strategy. `useProtocolCachePolicy` on iOS.
   *
   * - `reload`: The data for the URL will be loaded from the originating source.
   * No existing cache data should be used to satisfy a URL load request.
   *
   * - `force-cache`: The existing cached data will be used to satisfy the request,
   * regardless of its age or expiration date. If there is no existing data in the cache
   * corresponding the request, the data is loaded from the originating source.
   *
   * - `only-if-cached`: The existing cache data will be used to satisfy a request, regardless of
   * its age or expiration date. If there is no existing data in the cache corresponding
   * to a URL load request, no attempt is made to load the data from the originating source,
   * and the load is considered to have failed.
   *
   * @platform ios
   */
  cache?: 'default' | 'reload' | 'force-cache' | 'only-if-cached';

  /**
   * `headers` is an object representing the HTTP headers to send along with the
   * request for a remote image.
   */
  headers?: Record<string, string>;

  /**
   * `method` is the HTTP Method to use. Defaults to GET if not specified.
   */
  method?: string;

  /**
   * `scale` is used to indicate the scale factor of the image. Defaults to 1.0 if
   * unspecified, meaning that one image pixel equates to one display point / DIP.
   */
  scale?: number;

  /**
   * `uri` is a string representing the resource identifier for the image, which
   * could be an http address, a local file path, or the name of a static image
   * resource (which should be wrapped in the `require('./path/to/image.png')`
   * function).
   */
  uri: string;

  /**
   * `width` and `height` can be specified if known at build time, in which case
   * these will be used to set the default `<Image/>` component dimensions.
   */
  height?: number;
  width?: number;
};

export type ResizeMode =
  | 'center'
  | 'contain'
  | 'cover'
  | 'none'
  | 'repeat'
  | 'stretch';

export type Source = number | string | SourceObject | SourceObject[];

export type ImageStyle = AnimationStyles &
  BorderStyles &
  InteractionStyles &
  LayoutStyles &
  ShadowStyles &
  TransformStyles & {
    backgroundColor?: ColorValue;
    boxShadow?: string;
    filter?: string;
    opacity?: number;
    resizeMode?: ResizeMode;
    tintColor?: ColorValue;
  };

export type ImageStyleProps = ViewStyleProps & {
  blurRadius?: number;
  defaultSource?: Source;
  draggable?: boolean;
  onError?: (e: any) => void;
  onLayout?: (e: any) => void;
  onLoad?: (e: any) => void;
  onLoadEnd?: (e: any) => void;
  onLoadStart?: (e: any) => void;
  onProgress?: (e: any) => void;
  resizeMode?: ResizeMode;
  source: Source;
  style?:
    | false
    | void
    | ''
    | ViewStyle
    | readonly GenericStyleProp<ImageStyle>[]
    | null
    | undefined;
};

type FontWeightValue =
  | 'normal'
  | 'bold'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900';

export type TextStyle = ViewStyle & {
  color?: ColorValue | null | undefined;
  float?: string | null | undefined;
  fontFamily?: string | null | undefined;
  fontFeatureSettings?: string | null | undefined;
  fontSize?: NumberOrString | null | undefined;
  fontStyle?: 'italic' | 'normal';
  fontWeight?: FontWeightValue | null | undefined;
  fontVariant?: readonly (
    | 'small-caps'
    | 'oldstyle-nums'
    | 'lining-nums'
    | 'tabular-nums'
    | 'proportional-nums'
  )[];
  letterSpacing?: NumberOrString | null | undefined;
  lineHeight?: NumberOrString | null | undefined;
  textAlign?:
    | 'center'
    | 'end'
    | 'inherit'
    | 'justify'
    | 'justify-all'
    | 'left'
    | 'right'
    | 'start';
  textAlignVertical?: string | null | undefined;
  textDecorationColor?: ColorValue | null | undefined;
  textDecorationLine?:
    | 'none'
    | 'underline'
    | 'line-through'
    | 'underline line-through';
  textDecorationStyle?: 'solid' | 'double' | 'dotted' | 'dashed';
  textIndent?: NumberOrString | null | undefined;
  textOverflow?: string | null | undefined;
  textRendering?:
    | 'auto'
    | 'geometricPrecision'
    | 'optimizeLegibility'
    | 'optimizeSpeed';
  textShadowColor?: ColorValue | null | undefined;
  textShadowOffset?: { width?: number; height?: number };
  textShadowRadius?: number | null | undefined;
  textTransform?: 'capitalize' | 'lowercase' | 'none' | 'uppercase';
  unicodeBidi?:
    | 'normal'
    | 'bidi-override'
    | 'embed'
    | 'isolate'
    | 'isolate-override'
    | 'plaintext';
  whiteSpace?: string | null | undefined;
  wordBreak?: 'normal' | 'break-all' | 'break-word' | 'keep-all';
  wordWrap?: string | null | undefined;
  writingDirection?: 'auto' | 'ltr' | 'rtl';

  /* @platform web */
  MozOsxFontSmoothing?: string | null | undefined;
  WebkitFontSmoothing?: string | null | undefined;
};

export type TextStyleProps = ViewStyleProps & {
  accessibilityRole?:
    | 'button'
    | 'header'
    | 'heading'
    | 'label'
    | 'link'
    | 'listitem'
    | 'none'
    | 'text';
  accessibilityState?: {
    busy?: boolean | null | undefined;
    checked?: (boolean | null | undefined) | 'mixed';
    disabled?: boolean | null | undefined;
    expanded?: boolean | null | undefined;
    grabbed?: boolean | null | undefined;
    hidden?: boolean | null | undefined;
    invalid?: boolean | null | undefined;
    pressed?: boolean | null | undefined;
    readonly?: boolean | null | undefined;
    required?: boolean | null | undefined;
    selected?: boolean | null | undefined;
  };
  dir?: 'auto' | 'ltr' | 'rtl';
  numberOfLines?: number | null | undefined;
  onPress?: (e: any) => void;
  selectable?: boolean;
  style?:
    | false
    | void
    | ''
    | ViewStyle
    | readonly GenericStyleProp<TextStyle>[]
    | null
    | undefined;
  testID?: string | null | undefined;
};

export type ResponsiveStyle = Record<string, CSSProperties>;
