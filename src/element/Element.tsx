import React, {
  useMemo,
  forwardRef,
  useEffect,
  useRef,
  useCallback,
  useState,
} from 'react';
import { useTheme } from '../providers/Theme';
import { useResponsiveContext } from '../providers/Responsive';
import { useStyleRegistry } from '../providers/StyleRegistry';

import { isStyleProp } from '../utils/style';
import { excludedKeys, includeKeys } from '../utils/constants';
import { extractUtilityClasses, AnimationUtils } from './css';
import { useAnalytics } from '../providers/Analytics';

import { ElementProps, CssProps } from './Element.types';

export type { ElementProps, CssProps };

export const Element = React.memo(
  forwardRef<HTMLElement, ElementProps>(
    ({ as = 'div', animateIn, animateOut, ...props }: ElementProps, ref) => {
      if ((props.onClick || props.onPress) && props.cursor == undefined) {
        props.cursor = 'pointer';
      }

      const {
        onPress,
        blend: initialBlend,
        animateOn = 'Both',
        ...rest
      } = props;
      let blend = initialBlend;

      if (
        blend !== false &&
        props.color === undefined &&
        typeof props.children === 'string' &&
        (as === 'span' || as === 'div' || blend === true)
      ) {
        blend = true;
      }
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
      const { mediaQueries, devices } = useResponsiveContext();
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

      const utilityClasses = useMemo(() => {
        const propsToProcess = {
          ...rest,
          blend,
        };

        // Apply view() timeline ONLY if animateOn='View' (not Both or Mount)
        if (animateOn === 'View' && propsToProcess.animate) {
          const animations = Array.isArray(propsToProcess.animate)
            ? propsToProcess.animate
            : [propsToProcess.animate];

          propsToProcess.animate = animations.map((anim) => {
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
        if (animateOn === 'Scroll' && propsToProcess.animate) {
          const animations = Array.isArray(propsToProcess.animate)
            ? propsToProcess.animate
            : [propsToProcess.animate];

          propsToProcess.animate = animations.map((anim) => {
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

        return extractUtilityClasses(
          propsToProcess,
          (color: string) => {
            return getColor(color);
          },
          mediaQueries,
          devices,
          manager
        );
      }, [rest, blend, animateOn, mediaQueries, devices, theme, manager]);

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

      // First, add all event handlers (they start with "on" and have a capital letter after)
      Object.keys(otherProps).forEach((key) => {
        if (
          key.startsWith('on') &&
          key.length > 2 &&
          key[2] === key[2].toUpperCase()
        ) {
          newProps[key] = (otherProps as any)[key];
        }
      });

      // Then add all other non-style props
      Object.keys(otherProps).forEach((key) => {
        if (
          (!excludedKeys.has(key) && !isStyleProp(key)) ||
          includeKeys.has(key)
        ) {
          newProps[key] = (otherProps as any)[key];
        }
      });

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
