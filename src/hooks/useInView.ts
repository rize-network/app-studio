import { useRef, useState, useEffect } from 'react';

interface InViewOptions extends IntersectionObserverInit {
  triggerOnce?: boolean;
  /** Optional target window to use (for iframe support). Defaults to global window. */
  targetWindow?: Window;
}

const DEFAULT_IN_VIEW_OPTIONS: InViewOptions = {};

export function useInView(options?: InViewOptions) {
  const {
    triggerOnce = false,
    targetWindow,
    ...observerOptions
  } = options || DEFAULT_IN_VIEW_OPTIONS;
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // If targetWindow is provided and root is not explicitly set,
    // use the target window's document as the root
    const win = targetWindow || element.ownerDocument?.defaultView || window;
    const effectiveRoot =
      observerOptions.root !== undefined
        ? observerOptions.root
        : targetWindow
          ? win.document.documentElement
          : undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);

          // If triggerOnce is true, disconnect the observer once the element is in view
          if (triggerOnce) {
            observer.disconnect();
          }
        } else if (!triggerOnce) {
          // Only update to false if not using triggerOnce
          setInView(false);
        }
      },
      { ...observerOptions, root: effectiveRoot }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [
    triggerOnce,
    targetWindow,
    observerOptions.root,
    observerOptions.rootMargin,
    observerOptions.threshold,
  ]);

  return { ref, inView };
}
