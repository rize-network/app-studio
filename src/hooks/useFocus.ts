import { useRef, useState, useEffect } from 'react';

export function useFocus<T extends HTMLElement = HTMLElement>(): [
  React.RefObject<T>,
  boolean,
] {
  const [focused, setFocused] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const handleFocus = () => setFocused(true);
    const handleBlur = () => setFocused(false);

    node.addEventListener('focus', handleFocus);
    node.addEventListener('blur', handleBlur);

    return () => {
      node.removeEventListener('focus', handleFocus);
      node.removeEventListener('blur', handleBlur);
    };
  }, []);

  return [ref, focused];
}
