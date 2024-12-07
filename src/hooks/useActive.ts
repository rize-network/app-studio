import { useRef, useState, useEffect } from 'react';

export function useActive<T extends HTMLElement = HTMLElement>(): [
  React.RefObject<T>,
  boolean,
] {
  const [active, setActive] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const handleMouseDown = () => setActive(true);
    const handleMouseUp = () => setActive(false);
    const handleTouchStart = () => setActive(true);
    const handleTouchEnd = () => setActive(false);

    node.addEventListener('mousedown', handleMouseDown);
    node.addEventListener('mouseup', handleMouseUp);
    node.addEventListener('mouseleave', handleMouseUp);
    node.addEventListener('touchstart', handleTouchStart);
    node.addEventListener('touchend', handleTouchEnd);

    return () => {
      node.removeEventListener('mousedown', handleMouseDown);
      node.removeEventListener('mouseup', handleMouseUp);
      node.removeEventListener('mouseleave', handleMouseUp);
      node.removeEventListener('touchstart', handleTouchStart);
      node.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return [ref, active];
}
