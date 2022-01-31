import React from 'react';
import { ViewElement } from './Element';
import {
  GenericStyleProp,
  ViewProps,
  ViewStyle,
  ResponsiveStyle,
} from '../types/style';
import { CSSProperties } from 'styled-components';

export interface ComponentViewProps
  extends Omit<ViewProps, 'pointerEvents'>,
    CSSProperties {
  size?: number;
  className?: string;
  loading?: boolean;
  style?: GenericStyleProp<ViewStyle>;
  paddingHorizontal?: number | string;
  marginHorizontal?: number | string;
  paddingVertical?: number | string;
  marginVertical?: number | string;
  responsive?: ResponsiveStyle;
  onPress?: () => void;
  action?: string;
  backgroundColor?: string;
}

export const View = (props: ComponentViewProps) => <ViewElement {...props} />;

export const SafeArea = View;

export const Scroll = (props: any) => <View overflow={'auto'} {...props} />;

export const Horizontal = (props: any) => (
  <View display={'flex'} flexDirection="row" {...props} />
);
export const HorizontalScroll = (props: any) => (
  <Horizontal overflowX="auto" {...props} />
);

export const Vertical = (props: any) => (
  <View flexDirection="column" {...props} />
);

export const VerticalScroll = (props: any) => (
  <Vertical overflowY="auto" {...props} />
);

export const Inline = (props: any) => (
  <View
    display={'flex'}
    flexDirection="row"
    wordBreak="break-word"
    {...props}
  />
);

export const Start = (props: any) => (
  <View display={'flex'} alignSelf="flex-start" {...props} />
);

export const End = (props: any) => (
  <View display={'flex'} alignSelf="flex-end" {...props} />
);

export const Center = (props: any) => (
  <View
    display={'flex'}
    justifyContent="center"
    alignItems={'center'}
    {...props}
  />
);

export const AlignStart = (props: any) => (
  <View display={'flex'} justifyContent="flex-start" {...props} />
);

export const AlignCenter = (props: any) => (
  <View display={'flex'} justifyContent="center" width={'100%'} {...props} />
);

export const AlignEnd = (props: any) => (
  <View display={'flex'} justifyContent="flex-end" width={'100%'} {...props} />
);

export default View;
