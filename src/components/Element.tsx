// Element.tsx
import React, { CSSProperties, useEffect, useMemo } from 'react';
import { useTheme } from '../providers/Theme';
import { useResponsiveContext } from '../providers/Responsive';
import Color from 'color-convert'; // Used for color conversion

import {
  isStyleProp,
  processStyleProperty,
  styleObjectToCss,
} from '../utils/style';
import { generateKeyframes } from '../utils/animation';
import {
  excludedKeys,
  includeKeys,
  AnimationProps,
  extraKeys,
} from '../utils/constants';
import { Shadows, Shadow } from '../utils/shadow'; // Utilities for shadows

// Define ElementProps interface
export interface ElementProps {
  children?: React.ReactNode;
  size?: number;
  on?: Record<string, CSSProperties>;
  media?: Record<string, CSSProperties>;
  paddingHorizontal?: number | string;
  marginHorizontal?: number | string;
  paddingVertical?: number | string;
  marginVertical?: number | string;
  shadow?: boolean | number | Shadow;
  only?: string[];
  css?: CSSProperties;
  style?: CSSProperties;
  animate?: AnimationProps;
  onPress?: () => void;
  [key: string]: any;
}

// Global style sheet management
const styleSheet = (() => {
  if (typeof document !== 'undefined') {
    let styleTag = document.getElementById(
      'dynamic-styles'
    ) as HTMLStyleElement;
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'dynamic-styles';
      document.head.appendChild(styleTag);
    }
    return styleTag.sheet as CSSStyleSheet;
  }
  return null;
})();

// Cache for generated class names and their CSS rules
const classCache = new Map<string, string>();
const cssRulesCache = new Map<string, string[]>();

let classNameCounter = 0;

// Function to generate unique class name from style props
const generateClassName = (styleProps: Record<string, any>): string => {
  const serialized = JSON.stringify(styleProps);
  if (classCache.has(serialized)) {
    return classCache.get(serialized)!;
  } else {
    const className = 'element-' + classNameCounter++;
    classCache.set(serialized, className);
    return className;
  }
};

// Function to inject CSS rules into the style sheet
const useDynamicStyles = (cssRules: string[]): void => {
  useEffect(() => {
    if (!styleSheet) return;
    cssRules.forEach((rule) => {
      try {
        if (
          [...styleSheet.cssRules].some((cssRule) => cssRule.cssText === rule)
        ) {
          // Rule already exists
          return;
        }
        styleSheet.insertRule(rule, styleSheet.cssRules.length);
      } catch (error) {
        console.error('Error inserting CSS rule:', rule, error);
      }
    });
  }, [cssRules]);
};

// Function to recursively generate CSS rules from classStyles
const generateCssRules = (
  selector: string,
  styles: Record<string, any>,
  getColor: (color: string) => string
): string[] => {
  const rules: string[] = [];
  const mainStyles: Record<string, any> = {};
  const nestedMediaQueries: Record<string, Record<string, any>> = {};

  Object.keys(styles).forEach((key) => {
    const value = styles[key];
    if (key.startsWith('@media ')) {
      const mediaQuery = key;
      if (!nestedMediaQueries[mediaQuery]) {
        nestedMediaQueries[mediaQuery] = {};
      }
      Object.assign(nestedMediaQueries[mediaQuery], value);
    } else if (key.startsWith('&:')) {
      const pseudoSelector = key.slice(1);
      const nestedStyles = styles[key];
      const nestedRules = generateCssRules(
        `${selector}${pseudoSelector}`,
        nestedStyles,
        getColor
      );
      rules.push(...nestedRules);
    } else {
      mainStyles[key] = value;
    }
  });

  if (
    Object.keys(mainStyles).length > 0 ||
    Object.keys(nestedMediaQueries).length > 0
  ) {
    const processedStyles: Record<string, any> = {};
    for (const property in mainStyles) {
      processedStyles[property] = processStyleProperty(
        property,
        mainStyles[property],
        getColor
      );
    }

    let cssRule = `${selector} { ${styleObjectToCss(processedStyles)} `;

    for (const mediaQuery in nestedMediaQueries) {
      const mediaStyles = nestedMediaQueries[mediaQuery];
      const processedMediaStyles: Record<string, any> = {};
      for (const property in mediaStyles) {
        processedMediaStyles[property] = processStyleProperty(
          property,
          mediaStyles[property],
          getColor
        );
      }
      cssRule += ` ${mediaQuery} { ${styleObjectToCss(
        processedMediaStyles
      )} } `;
    }

    cssRule += ` }`;
    rules.push(cssRule);
  }

  return rules;
};

// Function to apply styles to a component
const applyStyle = (
  props: Record<string, any>
): {
  styleProps: Record<string, any>;
  getColor: (color: string) => string;
  keyframes?: string[];
} => {
  const { getColor } = useTheme();
  const { mediaQueries, devices } = useResponsiveContext();

  const styleProps: Record<string, any> = {};
  const keyframesList: string[] = [];

  // Handle element size
  const size =
    props.height !== undefined &&
    props.width !== undefined &&
    props.height === props.width
      ? props.height
      : props.size
      ? props.size
      : null;

  if (size) {
    styleProps.height = styleProps.width = size;
  }

  // Handle padding and margin
  if (props.paddingHorizontal) {
    styleProps.paddingLeft = props.paddingHorizontal;
    styleProps.paddingRight = props.paddingHorizontal;
  }

  if (props.marginHorizontal) {
    styleProps.marginLeft = props.marginHorizontal;
    styleProps.marginRight = props.marginHorizontal;
  }

  if (props.paddingVertical) {
    styleProps.paddingTop = props.paddingVertical;
    styleProps.paddingBottom = props.paddingVertical;
  }

  if (props.marginVertical) {
    styleProps.marginTop = props.marginVertical;
    styleProps.marginBottom = props.marginVertical;
  }

  // Apply shadows if specified
  if (props.shadow) {
    if (typeof props.shadow === 'number' || typeof props.shadow === 'boolean') {
      const shadowValue: number =
        typeof props.shadow === 'number' && Shadows[props.shadow] !== undefined
          ? props.shadow
          : 2;

      if (Shadows[shadowValue]) {
        const shadowColor = Color.hex
          .rgb(Shadows[shadowValue].shadowColor)
          .join(',');

        styleProps[
          'boxShadow'
        ] = `${Shadows[shadowValue].shadowOffset.height}px ${Shadows[shadowValue].shadowOffset.width}px ${Shadows[shadowValue].shadowRadius}px rgba(${shadowColor},${Shadows[shadowValue].shadowOpacity})`;
      }
    } else {
      const shadowColor = Color.hex.rgb(props.shadow.shadowColor).join(',');

      styleProps[
        'boxShadow'
      ] = `${props.shadow.shadowOffset.height}px ${props.shadow.shadowOffset.width}px ${props.shadow.shadowRadius}px rgba(${shadowColor},${props.shadow.shadowOpacity})`;
    }
  }

  // Gestion des animations
  if (props.animate) {
    const animation = props.animate;
    const { keyframesName, keyframes } = generateKeyframes(animation);

    if (keyframes) {
      keyframesList.push(keyframes);
    }

    styleProps.animationName = keyframesName;
    styleProps.animationDuration = animation.duration || '1s';
    styleProps.animationTimingFunction = animation.timingFunction || 'ease';
    styleProps.animationDelay = animation.delay || '0s';
    styleProps.animationIterationCount = animation.iterationCount || '1';
    styleProps.animationDirection = animation.direction || 'normal';
    styleProps.animationFillMode = animation.fillMode || 'both';
    styleProps.animationPlayState = animation.playState || 'running';
  }

  // Process the styling props
  Object.keys(props).forEach((property) => {
    if (
      property !== 'style' &&
      (isStyleProp(property) || extraKeys.has(property))
    ) {
      const value = props[property];

      if (typeof value === 'object' && value !== null) {
        // For properties like 'on', 'media'
        if (property === 'on') {
          // Pseudo-selectors
          for (const event in value) {
            if (!styleProps[`&:${event}`]) {
              styleProps[`&:${event}`] = {};
            }
            const nestedStyles = applyStyle(value[event]).styleProps;
            Object.assign(styleProps[`&:${event}`], nestedStyles);
          }
        } else if (property === 'media') {
          // Media queries

          for (const screenOrDevices in value) {
            const mediaValue = value[screenOrDevices];
            if (mediaQueries[screenOrDevices]) {
              const mediaQuery = '@media ' + mediaQueries[screenOrDevices];
              if (!styleProps[mediaQuery]) {
                styleProps[mediaQuery] = {};
              }
              const nestedStyles = applyStyle(mediaValue).styleProps;
              Object.assign(styleProps[mediaQuery], nestedStyles);
              console.log({ mediaQuery, style: styleProps[mediaQuery] });
            } else if (devices[screenOrDevices]) {
              const deviceScreens = devices[screenOrDevices];
              deviceScreens.forEach((screen: string) => {
                if (mediaQueries[screen]) {
                  const mediaQuery = '@media ' + mediaQueries[screen];
                  if (!styleProps[mediaQuery]) {
                    styleProps[mediaQuery] = {};
                  }
                  const nestedStyles = applyStyle(mediaValue).styleProps;
                  Object.assign(styleProps[mediaQuery], nestedStyles);
                }
              });
            }
          }
        } else {
          // Nested styles
          styleProps[property] = applyStyle(value).styleProps;
        }
      } else {
        // Simple style property
        styleProps[property] = value;
      }
    }
  });

  console.log({ styleProps, keyframes: keyframesList });
  return { styleProps, getColor, keyframes: keyframesList };
};

// Function to filter and separate props
const useStyledProps = (
  props: any
): { newProps: any; className: string; cssRules: string[] } => {
  const { styleProps, getColor, keyframes } = applyStyle(props);

  const className = generateClassName(styleProps);

  let cssRules: string[] = [];

  if (cssRulesCache.has(className)) {
    cssRules = cssRulesCache.get(className)!;
  } else {
    cssRules = generateCssRules(`.${className}`, styleProps, getColor);

    // Ajouter les keyframes aux règles CSS
    if (keyframes && keyframes.length > 0) {
      cssRules = keyframes.concat(cssRules);
    }

    cssRulesCache.set(className, cssRules);
  }

  // Extract the style prop for inline styles
  const { style, ...restProps } = props;

  // Filter props to exclude those used for styling
  const newProps = Object.keys(restProps).reduce((acc: any, key) => {
    if ((!excludedKeys.has(key) && !isStyleProp(key)) || includeKeys.has(key)) {
      acc[key] = restProps[key];
    }
    return acc;
  }, {});

  if (className) {
    newProps.className = className;
  }

  if (style) {
    newProps.style = style;
  }

  return { newProps, className, cssRules };
};

export const Element: React.FC<ElementProps> = (props) => {
  const { onPress, ...rest } = props;

  const { newProps, cssRules } = useMemo(() => useStyledProps(rest), [rest]);

  if (onPress) {
    newProps.onClick = onPress;
  }

  useDynamicStyles(cssRules);

  // Use the 'as' prop if provided
  const Component = newProps.as || 'div';
  delete newProps.as; // Remove 'as' from props to avoid React warnings

  // Render the component with the props
  return <Component {...newProps}>{props.children}</Component>;
};
