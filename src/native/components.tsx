import React from 'react';
import {
  Image as RNImage,
  ImageBackground as RNImageBackground,
  ImageSourcePropType,
  Pressable,
  ScrollView as RNScrollView,
  Text as RNText,
  TextInput,
  View as RNView,
} from 'react-native';
import {
  NativeElementProps,
  NativeStyleProps,
  splitNativeProps,
  useNativeStyle,
} from './style';
import { useAnimation } from './useAnimation';
import { useSafeArea } from './useSafeArea';

export type CssProps = NativeStyleProps;
export type ElementProps = NativeElementProps;
export type ViewProps = NativeElementProps;
export type TextProps = NativeElementProps & {
  toUpperCase?: boolean;
  isItalic?: boolean;
  isStriked?: boolean;
  isUnderlined?: boolean;
  isSub?: boolean;
  isSup?: boolean;
  maxLines?: number;
  bgColor?: string;
};
export type ImageProps = NativeElementProps & {
  src?: string;
  source?: ImageSourcePropType;
  alt?: string;
};
export type InputProps = NativeElementProps & {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChangeText?: (value: string) => void;
};
export type ButtonProps = NativeElementProps & {
  disabled?: boolean;
};

function renderChildren(
  children: React.ReactNode,
  textProps?: Pick<TextProps, 'toUpperCase'>
) {
  if (!textProps?.toUpperCase) return children;

  return React.Children.map(children, (child) =>
    typeof child === 'string' ? child.toUpperCase() : child
  );
}

function sourceFromProps({ source, src }: ImageProps) {
  if (source) return source;
  if (src) return { uri: src };
  return undefined;
}

// Text-style keys forwarded onto an auto-wrapped <RNText> so bare string
// children inherit the element's color/typography (RN <Text> does NOT inherit
// these from a parent <View>, unlike CSS on the web).
const TEXT_STYLE_KEYS = [
  'color',
  'fontSize',
  'fontWeight',
  'fontFamily',
  'fontStyle',
  'letterSpacing',
  'lineHeight',
  'textAlign',
  'textTransform',
  'textDecorationLine',
  'textShadowColor',
  'textShadowOffset',
  'textShadowRadius',
] as const;

function pickTextStyle(style: any): Record<string, any> | undefined {
  const flat = Array.isArray(style)
    ? Object.assign({}, ...style.filter(Boolean))
    : style;
  if (!flat) return undefined;
  let out: Record<string, any> | undefined;
  for (const k of TEXT_STYLE_KEYS) {
    if (flat[k] != null) {
      out = out || {};
      out[k] = flat[k];
    }
  }
  return out;
}

// On the web a `<div>` may contain bare text; on RN a raw string child throws
// "Text strings must be rendered within a <Text> component". Wrap any
// string/number child in <RNText> (carrying the parent's text style) so
// app-studio Views render text the same way cross-platform.
function wrapTextChildren(
  children: React.ReactNode,
  textStyle: Record<string, any> | undefined
): React.ReactNode {
  let wrappedAny = false;
  const mapped = React.Children.map(children, (child) => {
    if (typeof child === 'string' || typeof child === 'number') {
      wrappedAny = true;
      return <RNText style={textStyle}>{child}</RNText>;
    }
    return child;
  });
  return wrappedAny ? mapped : children;
}

const ElementBase = React.forwardRef<any, ElementProps>((props, ref) => {
  const style = useNativeStyle(props);
  const nativeProps = splitNativeProps(props);
  const onPress = props.onPress || props.onClick;

  // Safe-area: additive padding/margin from the live device insets, merged on
  // top of the computed style. No-op unless a safe-area prop is set AND a
  // `<SafeAreaProvider>` is mounted.
  const safeAreaStyle = useSafeArea(props, style as any);

  // `animate` is an array or single `AnimationProps` produced by
  // `Animation.fadeIn()` etc. When set on RN we route the render through
  // `react-native-reanimated`'s Animated.View (lazy-required) so the
  // animation actually plays. When the peer is missing the hook returns
  // {style: undefined, AnimatedView: undefined} and we render the regular
  // RN primitive. `animateIn` is treated as a mount animation (aliases
  // `animate` on native) so mount-in motion authors identically to web.
  const animateProp = ((props as any).animate ?? (props as any).animateIn) as
    | undefined
    | Parameters<typeof useAnimation>[0];
  const {
    style: animatedStyle,
    AnimatedView,
    AnimatedPressable,
  } = useAnimation(animateProp);

  const isAnimated = !!animatedStyle && !!AnimatedView;
  const Component = isAnimated
    ? onPress
      ? AnimatedPressable
      : AnimatedView
    : onPress
      ? Pressable
      : RNView;

  const finalStyle =
    isAnimated || safeAreaStyle
      ? [style, safeAreaStyle, isAnimated ? animatedStyle : null].filter(
          Boolean
        )
      : style;

  const textStyle = pickTextStyle(finalStyle);

  return (
    <Component {...nativeProps} ref={ref} onPress={onPress} style={finalStyle}>
      {wrapTextChildren(props.before, textStyle)}
      {wrapTextChildren(props.children, textStyle)}
      {wrapTextChildren(props.after, textStyle)}
    </Component>
  );
});

ElementBase.displayName = 'Element';

// Memoized so a parent re-render with unchanged props skips the whole element
// (and its style work). Context updates (theme / responsive / safe-area insets)
// still re-render it — `React.memo` only blocks PARENT-driven re-renders, never
// context-driven ones — so dynamic theming/responsiveness keep working.
export const Element = React.memo(ElementBase);

export const View = React.forwardRef<any, ViewProps>((props, ref) => (
  <Element {...props} ref={ref} />
));

View.displayName = 'View';

export const Horizontal = React.forwardRef<any, ViewProps>((props, ref) => (
  <Element flexDirection="row" {...props} ref={ref} />
));

Horizontal.displayName = 'Horizontal';

export const Vertical = React.forwardRef<any, ViewProps>((props, ref) => (
  <Element flexDirection="column" {...props} ref={ref} />
));

Vertical.displayName = 'Vertical';

export const Center = React.forwardRef<any, ViewProps>((props, ref) => (
  <Element justifyContent="center" alignItems="center" {...props} ref={ref} />
));

Center.displayName = 'Center';

export const HorizontalResponsive = React.forwardRef<any, ViewProps>(
  ({ media = {}, ...props }, ref) => {
    const mergedMedia = React.useMemo(
      () => ({
        ...media,
        mobile: {
          ...(media as any).mobile,
          flexDirection: 'column' as const,
        },
      }),
      [media]
    );
    return <Horizontal media={mergedMedia} {...props} ref={ref} />;
  }
);

HorizontalResponsive.displayName = 'HorizontalResponsive';

export const VerticalResponsive = React.forwardRef<any, ViewProps>(
  ({ media = {}, ...props }, ref) => {
    const mergedMedia = React.useMemo(
      () => ({
        ...media,
        mobile: {
          ...(media as any).mobile,
          flexDirection: 'row' as const,
        },
      }),
      [media]
    );
    return <Vertical media={mergedMedia} {...props} ref={ref} />;
  }
);

VerticalResponsive.displayName = 'VerticalResponsive';

export const Scroll = React.forwardRef<any, ViewProps>((props, ref) => {
  const style = useNativeStyle(props);
  const nativeProps = splitNativeProps(props);

  return (
    <RNScrollView {...nativeProps} ref={ref} style={style}>
      {props.children}
    </RNScrollView>
  );
});

Scroll.displayName = 'Scroll';

// SafeArea defaults to insetting all four edges. Unlike RN's built-in
// `SafeAreaView` (iOS-only, top/bottom only) this routes through `Element`'s
// per-edge `useSafeArea`, so it works on Android too and honours
// `safeAreaEdges`, `safeAreaMode`, `ignoreSafeArea`, etc.
export const SafeArea = React.forwardRef<any, ViewProps>((props, ref) => (
  <Element safeArea {...props} ref={ref} />
));

SafeArea.displayName = 'SafeArea';

export const Div = View;
export const Span = View;

const TextBase = React.forwardRef<any, TextProps>(
  (
    {
      children,
      toUpperCase,
      isItalic,
      isStriked,
      isUnderlined,
      isSub,
      isSup,
      maxLines,
      ...props
    },
    ref
  ) => {
    const style = useNativeStyle({
      ...props,
      fontStyle: isItalic ? 'italic' : props.fontStyle,
      textDecorationLine: isStriked
        ? 'line-through'
        : isUnderlined
          ? 'underline'
          : props.textDecorationLine,
      fontSize: isSub || isSup ? props.fontSize || 12 : props.fontSize,
    });
    const nativeProps = splitNativeProps(props);

    return (
      <RNText {...nativeProps} ref={ref} numberOfLines={maxLines} style={style}>
        {renderChildren(children, { toUpperCase })}
      </RNText>
    );
  }
);

TextBase.displayName = 'Text';
export const Text = React.memo(TextBase);

const ImageBase = React.forwardRef<any, ImageProps>((props, ref) => {
  const style = useNativeStyle(props);
  const nativeProps = splitNativeProps(props);

  return (
    <RNImage
      {...nativeProps}
      ref={ref}
      source={sourceFromProps(props)}
      accessibilityLabel={props.alt || nativeProps.accessibilityLabel}
      style={style}
    />
  );
});

ImageBase.displayName = 'Image';
export const Image = React.memo(ImageBase);

export const ImageBackground = React.forwardRef<any, ImageProps>(
  (props, ref) => {
    const style = useNativeStyle(props);
    const nativeProps = splitNativeProps(props);

    return (
      <RNImageBackground
        {...nativeProps}
        ref={ref}
        source={sourceFromProps(props)}
        accessibilityLabel={props.alt || nativeProps.accessibilityLabel}
        style={style}
      >
        {props.children}
      </RNImageBackground>
    );
  }
);

ImageBackground.displayName = 'ImageBackground';

export const Form = View;

export const Input = React.forwardRef<any, InputProps>((props, ref) => {
  const style = useNativeStyle(props);
  const nativeProps = splitNativeProps(props);

  return <TextInput {...nativeProps} ref={ref} style={style} />;
});

Input.displayName = 'Input';

const ButtonBase = React.forwardRef<any, ButtonProps>(
  ({ children, disabled, ...props }, ref) => {
    const style = useNativeStyle(props);
    const nativeProps = splitNativeProps(props);
    const onPress = disabled ? undefined : props.onPress || props.onClick;

    return (
      <Pressable
        {...nativeProps}
        ref={ref}
        accessibilityRole="button"
        disabled={disabled}
        onPress={onPress}
        style={style}
      >
        {typeof children === 'string' || typeof children === 'number' ? (
          <RNText>{children}</RNText>
        ) : (
          children
        )}
      </Pressable>
    );
  }
);

ButtonBase.displayName = 'Button';
export const Button = React.memo(ButtonBase);

export const Skeleton = React.forwardRef<any, ViewProps>(
  ({ backgroundColor = 'color-gray-200', ...props }, ref) => (
    <View
      accessibilityRole="progressbar"
      backgroundColor={backgroundColor}
      {...props}
      ref={ref}
    />
  )
);

Skeleton.displayName = 'Skeleton';
