import { useRef, useState, useEffect } from 'react';

export function useClickOutside<T extends HTMLElement = HTMLElement>(): [
  React.RefObject<T>,
  boolean,
] {
  const [clickedOutside, setClickedOutside] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setClickedOutside(true);
      } else {
        setClickedOutside(false);
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  return [ref, clickedOutside];
}
