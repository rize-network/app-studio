import React from 'react';
import { View, ViewProps } from './View';
import { shimmer } from './Animation';

export const Skeleton = React.memo(
  ({
    duration = '2s',
    timingFunction = 'linear',
    iterationCount = 'infinite',
    ...props
  }: ViewProps) => (
    <View backgroundColor="color.black.300" {...props}>
      <View
        position="absolute"
        inset={0}
        width={'100%'}
        height={'100%'}
        animate={shimmer(duration, timingFunction, iterationCount)}
        background="linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)"
      />
    </View>
  )
);