import React from 'react';
import { View, ViewProps } from './View';
import { Animation } from '../components/Animation';

export interface SkeletonProps extends ViewProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'plain' | 'text' | 'circular' | 'rectangular';
  color?: string;
}

const skeletonAnimation = {
  '0%': { transform: 'translateX(-100%)' },
  '50%, 100%': { transform: 'translateX(100%)' },
};

export const Skeleton: React.FC<SkeletonProps> = React.memo(({
  size = 'md',
  variant = 'plain',
  color = 'neutral',
  ...props
}) => {
  return (
    <View
      {...props}
      backgroundColor="var(--color-emphasis-200)"
      position="relative"
      overflow="hidden"
      className={`skeleton ${size} ${variant} ${color} ${props.className || ''}`}
    >
      <View
        position="absolute"
        inset={0}
        animate={{
          ...Animation.custom(skeletonAnimation),
          duration: '2s',
          timingFunction: 'linear',
          iterationCount: 'infinite',
          delay: '0.5s'
        }}
        background="linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)"
      />
    </View>
  );
});
