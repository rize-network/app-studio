import React, {
  useMemo,
  forwardRef,
  useEffect,
  useRef,
  useCallback,
  useState,
} from 'react';
import { useTheme } from '../providers/Theme';
import { useBreakpointContext } from '../providers/Responsive';
import { useStyleRegistry } from '../providers/StyleRegistry';

import { isStyleProp } from '../utils/style';
import { excludedKeys, includeKeys } from '../utils/constants';
import { extractUtilityClasses, AnimationUtils } from './css';
import { useAnalytics } from '../providers/Analytics';
import { hash } from '../utils/hash';

// Set of special prop names that affect CSS generation
const styleRelevantProps = new Set([
  'on',
  'media',
  'animate',
  'css',
  'shadow',
  'blend',
  'widthHeight',
  'paddingHorizontal',
  'paddingVertical',
  'marginHorizontal',
  'marginVertical',
]);

// Skip these props from hash computation
const skipHashProps = new Set(['children', 'ref', 'key', 'style']);

/**
 * Fast serialization of a value for hashing purposes.
 * Avoids JSON.stringify overhead for common cases (strings, numbers, booleans).
 */
function fastSerialize(value: any): string {
  if (value === null) return 'n';
  const t = typeof value;
  if (t === 'string') return `s${value}`;
  if (t === 'number') return `d${value}`;
  if (t === 'boolean') return value ? 'T' : 'F';
  // Fall back to JSON.stringify only for complex objects
  return JSON.stringify(value);
}

/**
 * Computes a stable hash of style-relevant props.
 * Optimized: avoids sorting, uses fast serialization, feeds directly to hash.
 */
function hashStyleProps(props: Record<string, any>): string {
  // Build a deterministic string representation of style-relevant props
  // We use a single string accumulator instead of array + join
  let hashInput = '';

  const keys = Object.keys(props);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    // Skip non-style props that don't affect CSS generation
    if (skipHashProps.has(key)) continue;

    // Include style-relevant props
    if (
      isStyleProp(key) ||
      key.charCodeAt(0) === 95 || // starts with '_'
      styleRelevantProps.has(key)
    ) {
      const value = props[key];
      if (value !== undefined) {
        hashInput += `|${key}:${fastSerialize(value)}`;
      }
    }
  }

  return hash(hashInput);
}

/**
 * Custom hook that memoizes style extraction based on a stable hash of props.
 * Only recalculates when the hash of style-relevant props changes.
 */
function useStableStyleMemo(
  propsToProcess: Record<string, any>,
  getColor: (color: string) => string,
  mediaQueries: Record<string, string>,
  devices: Record<string, string[]>,
  manager: any,
  theme: any
): string[] {
  const cacheRef = useRef<{ hash: string; classes: string[] } | null>(null);

  // Compute hash of current props
  // Theme hash uses Object.values() concatenation instead of JSON.stringify
  const currentHash = useMemo(() => {
    const themeHash = theme ? hash(Object.values(theme).join('|')) : '';
    return hashStyleProps(propsToProcess) + '|' + themeHash;
  }, [propsToProcess, theme]);

  // Only recompute classes if hash changed
  if (!cacheRef.current || cacheRef.current.hash !== currentHash) {
    const classes = extractUtilityClasses(
      propsToProcess,
      getColor,
      mediaQueries,
      devices,
      manager
    );
    cacheRef.current = { hash: currentHash, classes };
  }

  return cacheRef.current.classes;
}

import { ElementProps, CssProps } from './Element.types';

export type { ElementProps, CssProps };

export const Element = React.memo(
  forwardRef<HTMLElement, ElementProps>(
    ({ as = 'div', animateIn, animateOut, ...props }: ElementProps, ref) => {
      if ((props.onClick || props.onPress) && props.cursor == undefined) {
        props.cursor = 'pointer';
      }

      const { onPress, blend, animateOn = 'Both', ...rest } = props;
      const elementRef = useRef<HTMLElement | null>(null);
      const setRef = useCallback(
        (node: HTMLElement | null) => {
          elementRef.current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            (ref as React.MutableRefObject<HTMLElement | null>).current = node;
          }
        },
        [ref]
      );
      const { getColor, theme } = useTheme();
      const { trackEvent } = useAnalytics();
      const { mediaQueries, devices } = useBreakpointContext();
      const { manager } = useStyleRegistry();
      const [isVisible, setIsVisible] = useState(false);

      useEffect(() => {
        if (!animateIn) {
          setIsVisible(true);
          return;
        }

        if (
          typeof IntersectionObserver === 'undefined' ||
          !elementRef.current
        ) {
          setIsVisible(true);
          return;
        }

        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              observer.disconnect();
            }
          },
          { threshold: 0.1 }
        );

        observer.observe(elementRef.current);

        return () => {
          observer.disconnect();
        };
      }, [animateIn]);

      useEffect(() => {
        if (animateIn && elementRef.current && isVisible) {
          const animations = Array.isArray(animateIn) ? animateIn : [animateIn];
          const styles = AnimationUtils.processAnimations(animations, manager);
          Object.assign(elementRef.current.style, styles);
        }
      }, [animateIn, isVisible, manager]);

      useEffect(() => {
        const node = elementRef.current;
        return () => {
          if (animateOut && node) {
            const animations = Array.isArray(animateOut)
              ? animateOut
              : [animateOut];
            const styles = AnimationUtils.processAnimations(
              animations,
              manager
            );
            Object.assign(node.style, styles);
          }
        };
      }, [animateOut, manager]);

      // Prepare props for processing (apply view/scroll timeline if needed)
      const propsToProcess = useMemo(() => {
        const processed: Record<string, any> = {
          ...rest,
          blend,
        };

        // Apply view() timeline ONLY if animateOn='View' (not Both or Mount)
        if (animateOn === 'View' && processed.animate) {
          const animations = Array.isArray(processed.animate)
            ? processed.animate
            : [processed.animate];

          processed.animate = animations.map((anim) => {
            // Only add timeline if not already specified
            if (!anim.timeline) {
              return {
                ...anim,
                timeline: 'view()',
                range: anim.range || 'entry',
                fillMode: anim.fillMode || 'both',
              };
            }
            return anim;
          });
        }

        // Apply scroll() timeline if animateOn='Scroll'
        if (animateOn === 'Scroll' && processed.animate) {
          const animations = Array.isArray(processed.animate)
            ? processed.animate
            : [processed.animate];

          processed.animate = animations.map((anim) => {
            // Only add timeline if not already specified
            if (!anim.timeline) {
              return {
                ...anim,
                timeline: 'scroll()',
                fillMode: anim.fillMode || 'both',
              };
            }
            return anim;
          });
        }

        return processed;
      }, [rest, blend, animateOn]);

      // Use hash-based memoization for style extraction
      const utilityClasses = useStableStyleMemo(
        propsToProcess,
        getColor,
        mediaQueries,
        devices,
        manager,
        theme
      );

      const newProps: any = { ref: setRef };
      if (onPress) {
        newProps.onClick = onPress;
      }

      if (utilityClasses.length > 0) {
        newProps.className = utilityClasses.join(' ');
      }

      if (props.className) {
        newProps.className = newProps.className
          ? `${newProps.className} ${props.className}`
          : props.className;
      }

      // Handle event tracking for onClick
      if (trackEvent && props.onClick) {
        let componentName: string;
        if (typeof as === 'string') {
          componentName = as;
        } else {
          componentName =
            (as as React.ComponentType<any>).displayName ||
            (as as React.ComponentType<any>).name ||
            'div';
        }
        let text: string | undefined;
        if (typeof props.children === 'string') {
          text = props.children.slice(0, 100);
        }
        newProps.onClick = (event: any) => {
          trackEvent({
            type: 'click',
            target: componentName !== 'div' ? componentName : undefined,
            text,
          });
          if (props.onClick) {
            props.onClick(event);
          }
        };
      } else if (props.onClick && !onPress) {
        // If onClick is provided and not already handled by onPress, pass it directly
        newProps.onClick = props.onClick;
      }

      const { style, children, before, after, ...otherProps } = rest;

      // Single pass: add event handlers and non-style props together
      const otherKeys = Object.keys(otherProps);
      for (let i = 0; i < otherKeys.length; i++) {
        const key = otherKeys[i];
        // Event handlers: start with "on" + uppercase letter
        if (
          key.charCodeAt(0) === 111 && // 'o'
          key.charCodeAt(1) === 110 && // 'n'
          key.length > 2 &&
          key.charCodeAt(2) >= 65 &&
          key.charCodeAt(2) <= 90 // uppercase A-Z
        ) {
          newProps[key] = (otherProps as any)[key];
        }
        // Non-style props (pass through to DOM)
        else if (
          (!excludedKeys.has(key) && !isStyleProp(key)) ||
          includeKeys.has(key)
        ) {
          newProps[key] = (otherProps as any)[key];
        }
      }

      if (style) {
        newProps.style = style;
      }

      if (animateIn && !isVisible) {
        newProps.style = {
          ...newProps.style,
          opacity: 0,
        };
      }

      const Component = as;
      return children ? (
        <Component {...newProps}>
          {before}
          {children}
          {after}
        </Component>
      ) : (
        <Component {...newProps} />
      );
    }
  )
);
