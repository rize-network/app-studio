import React, {
  ReactNode,
  createContext,
  useState,
  useEffect,
  useRef,
} from 'react';

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

  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!win) return;

    const handleResize = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
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
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [win]);

  return (
    <WindowSizeContext.Provider value={size}>
      {children}
    </WindowSizeContext.Provider>
  );
};
