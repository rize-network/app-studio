import React from 'react';
import { View, ViewProps } from './View';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const opacityKeyFrame = keyframes`
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(100%);
  }
`;

const StyledSkeleton = styled(View)`
  background-color: var(--color-emphasis-200);
  position: relative;
  overflow: hidden;
  &::after {
    animation: ${opacityKeyFrame} 2s linear 0.5s infinite;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.4),
      transparent
    );
    content: "";
    position: absolute;
    transform: translateX(-100%);
    inset: 0px;
  }
`;

export interface SkeletonProps extends ViewProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'plain' | 'text' | 'circular' | 'rectangular';
  color?: string;
}

export const Skeleton: React.FC<SkeletonProps> = React.memo(({
  size = 'md',
  variant = 'plain',
  color = 'neutral',
  ...props
}) => {
  return (
    <StyledSkeleton
      {...props}
      className={`skeleton ${size} ${variant} ${color} ${props.className || ''}`}
    />
  );
});
