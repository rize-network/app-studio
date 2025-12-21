import React, { ReactNode, createContext, useState, useEffect } from 'react';

export const WindowSizeContext = createContext({ width: 0, height: 0 });

export interface WindowSizeProviderProps {
  children: ReactNode;
  /** Optional target window to track (for iframe support). Defaults to global window. */
  targetWindow?: Window;
}

export const WindowSizeProvider = ({
  children,
  targetWindow,
}: WindowSizeProviderProps) => {
  const win = targetWindow || (typeof window !== 'undefined' ? window : null);

  const [size, setSize] = useState({
    width: win?.innerWidth || 0,
    height: win?.innerHeight || 0,
  });

  useEffect(() => {
    if (!win) return;

    const handleResize = () =>
      setSize({ width: win.innerWidth, height: win.innerHeight });
    win.addEventListener('resize', handleResize);
    return () => win.removeEventListener('resize', handleResize);
  }, [win]);

  return (
    <WindowSizeContext.Provider value={size}>
      {children}
    </WindowSizeContext.Provider>
  );
};
