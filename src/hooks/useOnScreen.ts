import { useRef, useState, useEffect } from 'react';

export function useOnScreen<T extends HTMLElement = HTMLElement>(
  options?: IntersectionObserverInit
): [React.RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [isOnScreen, setOnScreen] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => {
      setOnScreen(entry.isIntersecting);
    }, options);

    observer.observe(node);

    return () => {
      observer.unobserve(node);
    };
  }, [options]);

  return [ref, isOnScreen];
}
