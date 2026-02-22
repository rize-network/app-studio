import { useRef, useState, useEffect } from 'react';

export interface UseClickOutsideOptions {
  /** Optional target window to use (for iframe support). Defaults to global window. */
  targetWindow?: Window;
}

const DEFAULT_CLICK_OUTSIDE_OPTIONS: UseClickOutsideOptions = {};

export function useClickOutside<T extends HTMLElement = HTMLElement>(
  options?: UseClickOutsideOptions
): [React.RefObject<T>, boolean] {
  const [clickedOutside, setClickedOutside] = useState(false);
  const ref = useRef<T>(null);
  const { targetWindow } = options || DEFAULT_CLICK_OUTSIDE_OPTIONS;

  useEffect(() => {
    const win = targetWindow || (typeof window !== 'undefined' ? window : null);
    if (!win) return;

    const doc = win.document;

    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setClickedOutside(true);
      } else {
        setClickedOutside(false);
      }
    };

    doc.addEventListener('mousedown', handleClick);
    return () => {
      doc.removeEventListener('mousedown', handleClick);
    };
  }, [targetWindow]);

  return [ref, clickedOutside];
}
