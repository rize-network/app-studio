import React from 'react';
import { View } from './View';
import { shimmer } from '../element/Animation';
import { AnimationProps } from '../utils/constants';

export const Skeleton = React.memo(
  ({
    duration = '2s',
    timingFunction = 'linear',
    iterationCount = 'infinite',
    ...props
  }: AnimationProps & any) => (
    <View backgroundColor="color.black.300" {...props} overflow="hidden">
      <View
        position="relative"
        inset={0}
        width={'100%'}
        height={'100%'}
        animate={shimmer({ duration, timingFunction, iterationCount })}
        background="linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)"
      />
    </View>
  )
);
