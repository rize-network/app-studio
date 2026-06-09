import React, { ReactNode, useMemo } from 'react';
import { useWindowDimensions as useRNWindowDimensions } from 'react-native';
import { WindowSizeContext } from './WindowSizeContext';

export interface WindowSizeProviderProps {
  children: ReactNode;
  targetWindow?: Window;
}

export const WindowSizeProvider = ({ children }: WindowSizeProviderProps) => {
  const { width, height } = useRNWindowDimensions();
  const value = useMemo(() => ({ width, height }), [width, height]);

  return (
    <WindowSizeContext.Provider value={value}>
      {children}
    </WindowSizeContext.Provider>
  );
};
