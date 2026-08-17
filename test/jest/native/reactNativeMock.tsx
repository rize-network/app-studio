import React from 'react';

let dimensions = { width: 390, height: 844, scale: 1, fontScale: 1 };

const createHost = (name: string) =>
  React.forwardRef<any, any>(({ children, ...props }, ref) =>
    React.createElement(name, { ...props, ref }, children)
  );

export const View = createHost('View');
export const Text = createHost('Text');
export const Image = createHost('Image');
export const ImageBackground = createHost('ImageBackground');
export const Pressable = createHost('Pressable');
export const SafeAreaView = createHost('SafeAreaView');
export const ScrollView = createHost('ScrollView');
export const TextInput = createHost('TextInput');

export const StyleSheet = {
  create: <T extends Record<string, any>>(styles: T) => styles,
  flatten: (style: any): any => {
    if (!style) return {};
    if (Array.isArray(style)) {
      return style.reduce(
        (merged, item) => ({ ...merged, ...StyleSheet.flatten(item) }),
        {}
      );
    }
    return style;
  },
};

export const useWindowDimensions = () => dimensions;

export const Dimensions = {
  get: () => dimensions,
  set: (next: { window?: typeof dimensions; screen?: typeof dimensions }) => {
    dimensions = next.window || next.screen || dimensions;
  },
  addEventListener: () => ({ remove: () => {} }),
  removeEventListener: () => {},
};

export const Platform = {
  OS: 'ios',
  select: (options: Record<string, any>) => options.ios || options.default,
};

export const PixelRatio = {
  get: () => 1,
  roundToNearestPixel: (value: number) => value,
};

export const AccessibilityInfo = {
  isScreenReaderEnabled: jest.fn(() => Promise.resolve(false)),
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
};

export const NativeModules = {};
export const I18nManager = { isRTL: false };
export const findNodeHandle = jest.fn();

export default {
  AccessibilityInfo,
  Dimensions,
  I18nManager,
  Image,
  ImageBackground,
  NativeModules,
  PixelRatio,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  findNodeHandle,
  useWindowDimensions,
};
