import React, { ReactNode, useState, useEffect } from 'react';
import { WindowSizeContext } from './WindowSizeContext';

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

    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const handleResize = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const newWidth = win.innerWidth;
        const newHeight = win.innerHeight;
        setSize((prev) => {
          if (prev.width === newWidth && prev.height === newHeight) return prev;
          return { width: newWidth, height: newHeight };
        });
      }, 100);
    };

    win.addEventListener('resize', handleResize);
    return () => {
      win.removeEventListener('resize', handleResize);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [win]);

  return (
    <WindowSizeContext.Provider value={size}>
      {children}
    </WindowSizeContext.Provider>
  );
};
