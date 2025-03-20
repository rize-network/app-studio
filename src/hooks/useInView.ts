import { useRef, useState, useEffect } from 'react';

interface InViewOptions extends IntersectionObserverInit {
  triggerOnce?: boolean;
}

export function useInView(options?: InViewOptions) {
  const { triggerOnce = false, ...observerOptions } = options || {};
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
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
    }, observerOptions);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [triggerOnce, ...Object.values(observerOptions || {})]);

  return { ref, inView };
}
