// Element.tsx
import React, { CSSProperties, useEffect, useMemo } from 'react';
import { useTheme } from '../providers/Theme';
import { useResponsiveContext } from '../providers/Responsive';
import Color from 'color-convert';

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
import { Shadows, Shadow } from '../utils/shadow';

export interface ElementProps extends CssProps {
  on?: Record<string, CssProps>;
  media?: Record<string, CssProps>;
  only?: string[];
  css?: CSSProperties;
}

export interface CssProps {
  children?: React.ReactNode;
  size?: number;
  paddingHorizontal?: number | string;
  marginHorizontal?: number | string;
  paddingVertical?: number | string;
  marginVertical?: number | string;
  shadow?: boolean | number | Shadow;
  style?: CSSProperties;
  animate?: AnimationProps;
  onPress?: () => void;
  [key: string]: any;
}
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

/**
 * Fonction de hachage simple et rapide basée sur l'algorithme djb2.
 * @param {string} str - La chaîne de caractères à hacher.
 * @returns {number} - Le hachage sous forme d'entier non signé 32 bits.
 */
const hashString = (str: any): number => {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    // hash * 33 + c
    hash = (hash << 5) + hash + str.charCodeAt(i);
    // Pour éviter les dépassements, on utilise l'opérateur >>> 0
    hash = hash >>> 0;
  }
  return hash;
};

/**
 * Fonction pour hacher un objet en utilisant JSON.stringify et hashString.
 * @param {Object} obj - L'objet à hacher.
 * @returns {number} - Le hachage de l'objet.
 */
const hashObject = (obj: any): string => {
  const str = JSON.stringify(obj);
  return hashString(str).toString();
};

const classCache = new Map<string, string>();
const cssRulesCache = new Map<string, string[]>();

let classNameCounter = 0;

const generateClassName = (styleProps: Record<string, any>): string => {
  // Extract only relevant, primitive style properties
  console.log({ styleProps });
  // Generate a unique hash based on relevantProps
  const hash = hashObject(styleProps);

  if (classCache.has(hash)) {
    return classCache.get(hash)!;
  } else {
    const className = 'clz-' + classNameCounter++;
    classCache.set(hash, className);
    return className;
  }
};

const useDynamicStyles = (cssRules: string[]): void => {
  useEffect(() => {
    if (!styleSheet) return;
    cssRules.forEach((rule) => {
      try {
        if (
          Array.from(styleSheet.cssRules).some(
            (cssRule) => cssRule.cssText === rule
          )
        ) {
          return;
        }
        styleSheet.insertRule(rule, styleSheet.cssRules.length);
      } catch (error) {
        console.error('Error inserting CSS rule:', rule, error);
      }
    });
  }, [cssRules]);
};
const generateCssRules = (
  selector: string,
  styles: Record<string, any>,
  getColor: (color: string) => string,
  mediaQueries?: Record<string, any>
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
        // Ne pas passer mediaQueries ici
      );
      rules.push(...nestedRules);
    } else {
      mainStyles[key] = value;
    }
  });

  // Gestion des media queries
  // eslint-disable-next-line prefer-const
  let mediaBreakpoints: Record<string, string> = {};

  if (mediaQueries) {
    for (const query in mediaQueries) {
      const queries = mediaQueries[query].trim();
      mediaBreakpoints['@media ' + queries] = query;
    }
  }

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

    const cssRule = `${selector} { ${styleObjectToCss(processedStyles)} }`;
    rules.push(cssRule);

    for (let mediaQuery in nestedMediaQueries) {
      mediaQuery = mediaQuery.trim();
      const mediaStyles = nestedMediaQueries[mediaQuery];
      const processedMediaStyles: Record<string, any> = {};
      for (const property in mediaStyles) {
        processedMediaStyles[property] = processStyleProperty(
          property,
          mediaStyles[property],
          getColor
        );
      }
      const cssProperties = styleObjectToCss(processedMediaStyles);
      const mediaRule = `${mediaQuery} { ${selector} { ${cssProperties} } }`;
      rules.push(mediaRule);

      if (mediaBreakpoints[mediaQuery]) {
        const breakpoint = mediaBreakpoints[mediaQuery];
        const bpRule = `.${breakpoint} ${selector} { ${cssProperties} }`;
        rules.push(bpRule);
      }
    }
  }

  return rules;
};

// Function to apply styles to a component
const computeStyleProps = (
  props: Record<string, any>
): {
  styleProps: Record<string, any>;
  keyframes?: string[];
} => {
  const styleProps: Record<string, any> = {};
  const keyframesList: string[] = [];

  // Gestion de la taille de l'élément
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

  // Gestion du padding et de la marge
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

  // Application des ombres si spécifié
  if (props.shadow) {
    if (typeof props.shadow === 'number' || typeof props.shadow === 'boolean') {
      const shadowValue: number =
        typeof props.shadow === 'number' && Shadows[props.shadow] !== undefined
          ? props.shadow
          : 2;

      if (Shadows[shadowValue]) {
        const shadowColor =
          Color.hex.rgb(Shadows[shadowValue].shadowColor) || [];

        styleProps['boxShadow'] = `${
          Shadows[shadowValue].shadowOffset.height
        }px ${Shadows[shadowValue].shadowOffset.width}px ${
          Shadows[shadowValue].shadowRadius
        }px rgba(${shadowColor.join(',')},${
          Shadows[shadowValue].shadowOpacity
        })`;
      }
    } else {
      const shadowColor = Color.hex.rgb(props.shadow.shadowColor) || [];

      styleProps['boxShadow'] = `${props.shadow.shadowOffset.height}px ${
        props.shadow.shadowOffset.width
      }px ${props.shadow.shadowRadius}px rgba(${shadowColor.join(',')},${
        props.shadow.shadowOpacity
      })`;
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
    styleProps.animationIterationCount = `${animation.iterationCount || '1'}`;
    styleProps.animationDirection = animation.direction || 'normal';
    styleProps.animationFillMode = animation.fillMode || 'both';
    styleProps.animationPlayState = animation.playState || 'running';
  }

  Object.keys(props).forEach((property) => {
    if (
      property !== 'style' &&
      (isStyleProp(property) || extraKeys.has(property))
    ) {
      // Simple style property
      styleProps[property] = props[property];
    }
  });

  return { styleProps, keyframes: keyframesList };
};

// Function to apply styles to a component
const applyStyle = (
  props: Record<string, any>,
  mediaQueries: any,
  devices: any,
  depth: number = 0, // Add a depth parameter
  maxDepth: number = 10 // Set a maximum depth
): {
  styleProps: Record<string, any>;
  keyframes?: string[];
} => {
  if (depth > maxDepth) {
    console.error('Maximum recursion depth reached in applyStyle');
    return { styleProps: {}, keyframes: [] };
  }

  const styleProps: Record<string, any> = {};
  const keyframesList: string[] = [];

  // Gestion de la taille de l'élément
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

  // Gestion du padding et de la marge
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

  // Application des ombres si spécifié
  if (props.shadow) {
    if (typeof props.shadow === 'number' || typeof props.shadow === 'boolean') {
      const shadowValue: number =
        typeof props.shadow === 'number' && Shadows[props.shadow] !== undefined
          ? props.shadow
          : 2;

      if (Shadows[shadowValue]) {
        const shadowColor =
          Color.hex.rgb(Shadows[shadowValue].shadowColor) || [];

        styleProps['boxShadow'] = `${
          Shadows[shadowValue].shadowOffset.height
        }px ${Shadows[shadowValue].shadowOffset.width}px ${
          Shadows[shadowValue].shadowRadius
        }px rgba(${shadowColor.join(',')},${
          Shadows[shadowValue].shadowOpacity
        })`;
      }
    } else {
      const shadowColor = Color.hex.rgb(props.shadow.shadowColor) || [];

      styleProps['boxShadow'] = `${props.shadow.shadowOffset.height}px ${
        props.shadow.shadowOffset.width
      }px ${props.shadow.shadowRadius}px rgba(${shadowColor.join(',')},${
        props.shadow.shadowOpacity
      })`;
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
    styleProps.animationIterationCount = `${animation.iterationCount || '1'}`;
    styleProps.animationDirection = animation.direction || 'normal';
    styleProps.animationFillMode = animation.fillMode || 'both';
    styleProps.animationPlayState = animation.playState || 'running';
  }

  Object.keys(props).forEach((property) => {
    if (
      property !== 'style' &&
      (isStyleProp(property) || extraKeys.has(property))
    ) {
      const value = props[property];

      if (typeof value === 'object' && value !== null) {
        if (property === 'on') {
          for (const event in value) {
            if (!styleProps[`&:${event}`]) {
              styleProps[`&:${event}`] = {};
            }
            const nestedResult = computeStyleProps(value[event]);
            Object.assign(styleProps[`&:${event}`], nestedResult.styleProps);
            keyframesList.push(...(nestedResult.keyframes || []));
          }
        } else if (property === 'media') {
          for (const screenOrDevices in value) {
            const mediaValue = value[screenOrDevices];
            if (mediaQueries[screenOrDevices]) {
              const mediaQuery = '@media ' + mediaQueries[screenOrDevices];
              if (!styleProps[mediaQuery]) {
                styleProps[mediaQuery] = {};
              }
              const nestedResult = computeStyleProps(mediaValue);
              Object.assign(styleProps[mediaQuery], nestedResult.styleProps);
              keyframesList.push(...(nestedResult.keyframes || []));
            } else if (devices[screenOrDevices]) {
              const deviceScreens = devices[screenOrDevices];
              deviceScreens.forEach((screen: string) => {
                if (mediaQueries[screen]) {
                  const mediaQuery = '@media ' + mediaQueries[screen];
                  if (!styleProps[mediaQuery]) {
                    styleProps[mediaQuery] = {};
                  }
                  const nestedResult = computeStyleProps(mediaValue);
                  Object.assign(
                    styleProps[mediaQuery],
                    nestedResult.styleProps
                  );
                  keyframesList.push(...(nestedResult.keyframes || []));
                }
              });
            }
          }
        } else {
          // For other nested styles, exclude 'on' and 'media'
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { on, media, ...nestedProps } = value;
          const nestedResult = computeStyleProps(nestedProps);
          styleProps[property] = nestedResult.styleProps;
          keyframesList.push(...(nestedResult.keyframes || []));
        }
      } else {
        // Simple style property
        styleProps[property] = value;
      }
    }
  });

  return { styleProps, keyframes: keyframesList };
};

const getStyledProps = (
  props: any,
  getColor: (color: string) => string,
  mediaQueries: any,
  devices: any
): { newProps: any; className: string; cssRules: string[] } => {
  const { styleProps, keyframes } = applyStyle(props, mediaQueries, devices);

  const className = generateClassName(styleProps);

  let cssRules: string[] = [];

  if (cssRulesCache.has(className)) {
    cssRules = cssRulesCache.get(className)!;
  } else {
    cssRules = generateCssRules(
      `.${className}`,
      styleProps,
      getColor,
      mediaQueries
    );

    if (keyframes && keyframes.length > 0) {
      cssRules = keyframes.concat(cssRules);
    }

    cssRulesCache.set(className, cssRules);
  }

  const { style, ...restProps } = props;

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

  const { getColor } = useTheme();
  const { mediaQueries, devices } = useResponsiveContext();

  const { newProps, cssRules } = useMemo(
    () => getStyledProps(rest, getColor, mediaQueries, devices),
    [rest, getColor, mediaQueries, devices]
  );

  if (onPress) {
    newProps.onClick = onPress;
  }

  useDynamicStyles(cssRules);

  const Component = newProps.as || 'div';
  delete newProps.as;

  return <Component {...newProps}>{props.children}</Component>;
};
