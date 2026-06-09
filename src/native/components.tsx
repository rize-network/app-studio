import React from 'react';
import {
  Image as RNImage,
  ImageBackground as RNImageBackground,
  ImageSourcePropType,
  Pressable,
  SafeAreaView,
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

export const Element = React.forwardRef<any, ElementProps>((props, ref) => {
  const style = useNativeStyle(props);
  const nativeProps = splitNativeProps(props);
  const onPress = props.onPress || props.onClick;

  // `animate` is an array or single `AnimationProps` produced by
  // `Animation.fadeIn()` etc. When set on RN we route the render through
  // `react-native-reanimated`'s Animated.View (lazy-required) so the
  // animation actually plays. When the peer is missing the hook returns
  // {style: undefined, AnimatedView: undefined} and we render the regular
  // RN primitive.
  const animateProp = (props as any).animate as
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

  const finalStyle = isAnimated ? [style, animatedStyle] : style;

  return (
    <Component {...nativeProps} ref={ref} onPress={onPress} style={finalStyle}>
      {props.before}
      {props.children}
      {props.after}
    </Component>
  );
});

Element.displayName = 'Element';

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

export const SafeArea = React.forwardRef<any, ViewProps>((props, ref) => {
  const style = useNativeStyle(props);
  const nativeProps = splitNativeProps(props);

  return (
    <SafeAreaView {...nativeProps} ref={ref} style={style}>
      {props.children}
    </SafeAreaView>
  );
});

SafeArea.displayName = 'SafeArea';

export const Div = View;
export const Span = View;

export const Text = React.forwardRef<any, TextProps>(
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

Text.displayName = 'Text';

export const Image = React.forwardRef<any, ImageProps>((props, ref) => {
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

Image.displayName = 'Image';

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

export const Button = React.forwardRef<any, ButtonProps>(
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

Button.displayName = 'Button';

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
