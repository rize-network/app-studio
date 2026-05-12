import React from 'react';

export const useStyleRegistry = () => ({ manager: undefined });

export const StyleRegistry = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

export const createStyleRegistry = () => undefined;

export const useServerInsertedHTML = () => () => null;
