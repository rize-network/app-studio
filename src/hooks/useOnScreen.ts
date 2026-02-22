import { useRef, useState, useEffect } from 'react';

export interface UseOnScreenOptions extends IntersectionObserverInit {
  /** Optional target window to use (for iframe support). Defaults to global window. */
  targetWindow?: Window;
}

const DEFAULT_ON_SCREEN_OPTIONS: UseOnScreenOptions = {};

export function useOnScreen<T extends HTMLElement = HTMLElement>(
  options?: UseOnScreenOptions
): [React.RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [isOnScreen, setOnScreen] = useState(false);
  const { targetWindow, ...observerOptions } =
    options || DEFAULT_ON_SCREEN_OPTIONS;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // If targetWindow is provided and root is not explicitly set,
    // use the target window's document as the root
    const win = targetWindow || node.ownerDocument?.defaultView || window;
    const effectiveRoot =
      observerOptions.root !== undefined
        ? observerOptions.root
        : targetWindow
          ? win.document.documentElement
          : undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setOnScreen(entry.isIntersecting);
      },
      { ...observerOptions, root: effectiveRoot }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [
    targetWindow,
    observerOptions.root,
    observerOptions.rootMargin,
    observerOptions.threshold,
  ]);

  return [ref, isOnScreen];
}
