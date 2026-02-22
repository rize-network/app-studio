import { useEffect, useRef } from 'react';
export const useMount = (callback: () => void) => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    callbackRef.current();
  }, []);
};
