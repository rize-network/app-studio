import React, { ReactNode, createContext } from 'react';
import { useWindowDimensions as useRNWindowDimensions } from 'react-native';

export const WindowSizeContext = createContext({ width: 0, height: 0 });

export interface WindowSizeProviderProps {
  children: ReactNode;
  targetWindow?: Window;
}

export const WindowSizeProvider = ({ children }: WindowSizeProviderProps) => {
  const { width, height } = useRNWindowDimensions();

  return (
    <WindowSizeContext.Provider value={{ width, height }}>
      {children}
    </WindowSizeContext.Provider>
  );
};
