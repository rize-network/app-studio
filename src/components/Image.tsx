import React from 'react';
import { CSSProperties } from 'styled-components';
import { ImageElement } from './Element';
import { View } from './View';
import {
  ImageProps as ComponentImageProps,
  ResponsiveStyle,
} from '../types/style';

export interface ImageProps
  extends Omit<ComponentImageProps, 'pointerEvents' | 'source'>,
    CSSProperties {
  size?: number;
  className?: string;
  backgroundColor?: string;
  onPress?: () => void;
  action?: string;
  alt?: string;
  src: string | any;
  style?: any;
  responsive?: ResponsiveStyle;
}

export interface ImageBackgroundProps extends ImageProps {
  src: string;
}

export class ImageBackground extends React.PureComponent<ImageBackgroundProps> {
  render() {
    const { src, style, onClick, onPress, ...props } = this.props;

    return (
      <View
        style={{
          backgroundSize: 'contain',
          backgroundImage: `url("${src}")`,
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          ...style,
        }}
        onClick={onClick ? onClick : onPress}
        {...props}
      />
    );
  }
}

export const Image = (props: ImageProps) => <ImageElement {...props} />;

export const RoundedImage = ({ size, src, ...props }: any) => (
  <ImageBackground borderRadius={size / 2} size={size} src={src} {...props} />
);

export const SquaredImage = ({ size, src, ...props }: any) => (
  <ImageBackground {...props} size={size} src={src} />
);
