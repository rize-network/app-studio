import React, {
  ReactNode,
  createContext,
  useState,
  useEffect,
  useContext,
} from 'react';

export const WindowSizeContext = createContext({ width: 0, height: 0 });

export const WindowSizeProvider = ({ children }: { children: ReactNode }) => {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <WindowSizeContext.Provider value={size}>
      {children}
    </WindowSizeContext.Provider>
  );
};

export const useWindowSize = () => useContext(WindowSizeContext);
