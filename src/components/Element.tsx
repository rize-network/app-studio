// Element.tsx
import React, { CSSProperties, useMemo } from 'react';
import { useTheme } from '../providers/Theme';
import { useResponsiveContext } from '../providers/Responsive';
import Color from 'color-convert';

import { isStyleProp } from '../utils/style';
import { generateKeyframes } from '../utils/animation';
import {
  excludedKeys,
  includeKeys,
  AnimationProps,
  extraKeys,
} from '../utils/constants';
import { Shadows, Shadow } from '../utils/shadow';
import { utilityClassManager } from '../utils/cssClass';

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

export const Element: React.FC<ElementProps> = React.memo((props) => {
  const { onPress, ...rest } = props;

  const { getColor } = useTheme();
  const { mediaQueries, devices } = useResponsiveContext();

  /**
   * Extrait les classes utilitaires basées sur les props.
   * Gère les styles de base, les pseudo-classes et les media queries.
   */
  const extractUtilityClasses = (props: CssProps): string[] => {
    const classes: string[] = [];

    // Styles calculés basés sur les props
    const computedStyles: Record<string, any> = {};

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
      // Ajout des unités si nécessaire
      const sizeValue = typeof size === 'number' ? `${size}px` : size;
      computedStyles.height = sizeValue;
      computedStyles.width = sizeValue;
    }

    // Gestion du padding et de la marge
    if (props.paddingHorizontal) {
      const paddingH =
        typeof props.paddingHorizontal === 'number'
          ? `${props.paddingHorizontal}px`
          : props.paddingHorizontal;
      computedStyles.paddingLeft = paddingH;
      computedStyles.paddingRight = paddingH;
    }
    if (props.marginHorizontal) {
      const marginH =
        typeof props.marginHorizontal === 'number'
          ? `${props.marginHorizontal}px`
          : props.marginHorizontal;
      computedStyles.marginLeft = marginH;
      computedStyles.marginRight = marginH;
    }
    if (props.paddingVertical) {
      const paddingV =
        typeof props.paddingVertical === 'number'
          ? `${props.paddingVertical}px`
          : props.paddingVertical;
      computedStyles.paddingTop = paddingV;
      computedStyles.paddingBottom = paddingV;
    }
    if (props.marginVertical) {
      const marginV =
        typeof props.marginVertical === 'number'
          ? `${props.marginVertical}px`
          : props.marginVertical;
      computedStyles.marginTop = marginV;
      computedStyles.marginBottom = marginV;
    }

    // Application des ombres si spécifié
    if (props.shadow) {
      let shadowValue: number;
      if (
        typeof props.shadow === 'number' &&
        Shadows[props.shadow] !== undefined
      ) {
        shadowValue = props.shadow;
      } else if (typeof props.shadow === 'boolean') {
        shadowValue = props.shadow ? 2 : 0;
      } else {
        shadowValue = 2;
      }

      if (Shadows[shadowValue]) {
        const shadowColor = Shadows[shadowValue].shadowColor;
        const shadowOpacity = Shadows[shadowValue].shadowOpacity;
        const shadowOffset = Shadows[shadowValue].shadowOffset;
        const shadowRadius = Shadows[shadowValue].shadowRadius;

        // Convertir la couleur en rgba
        const rgb = Color.hex.rgb(shadowColor);
        const rgbaColor = `rgba(${rgb.join(',')}, ${shadowOpacity})`;

        computedStyles.boxShadow = `${shadowOffset.height}px ${shadowOffset.width}px ${shadowRadius}px ${rgbaColor}`;
      }
    }

    // Gestion des animations
    if (props.animate) {
      const animation = props.animate;
      const { keyframesName, keyframes } = generateKeyframes(animation);

      if (keyframes && typeof document !== 'undefined') {
        const styleSheet = document.styleSheets[0];
        try {
          styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
        } catch (e) {
          console.error(
            `Erreur lors de l'insertion des keyframes: "${keyframes}"`,
            e
          );
        }
      }

      computedStyles.animationName = keyframesName;
      if (animation.duration)
        computedStyles.animationDuration = animation.duration;
      if (animation.timingFunction)
        computedStyles.animationTimingFunction = animation.timingFunction;
      if (animation.delay) computedStyles.animationDelay = animation.delay;
      if (animation.iterationCount !== undefined)
        computedStyles.animationIterationCount = `${animation.iterationCount}`;
      if (animation.direction)
        computedStyles.animationDirection = animation.direction;
      if (animation.fillMode)
        computedStyles.animationFillMode = animation.fillMode;
      if (animation.playState)
        computedStyles.animationPlayState = animation.playState;
    }

    /**
     * Génère des classes utilitaires pour un ensemble de styles.
     * @param styles Les styles à transformer en classes utilitaires.
     * @param context Le contexte des styles ('base', 'pseudo', 'media').
     * @param modifier Le modificateur pour les pseudo-classes ou media queries.
     */
    const generateUtilityClasses = (
      styles: Record<string, any>,
      context: 'base' | 'pseudo' | 'media' = 'base',
      modifier: string = ''
    ) => {
      Object.keys(styles).forEach((property) => {
        const value = styles[property];
        const className = utilityClassManager.getClassName(
          property,
          value,
          context,
          modifier,
          getColor
        );
        classes.push(className);
      });
    };

    // Générer des classes utilitaires pour les styles calculés
    generateUtilityClasses(computedStyles, 'base');

    // Parcourir toutes les propriétés de style et générer des classes utilitaires
    Object.keys(props).forEach((property) => {
      if (
        property !== 'style' &&
        (isStyleProp(property) || extraKeys.has(property))
      ) {
        const value = props[property];

        if (typeof value === 'object' && value !== null) {
          if (property === 'on') {
            // Styles liés aux événements (pseudo-classes)
            Object.keys(value).forEach((event) => {
              const eventStyles = value[event];
              // Mapper les événements React aux pseudo-classes CSS
              const pseudo = mapEventToPseudo(event);
              if (pseudo) {
                generateUtilityClasses(eventStyles, 'pseudo', pseudo);
              }
            });
          } else if (property === 'media') {
            // Styles conditionnels basés sur les media queries
            Object.keys(value).forEach((screenOrDevice) => {
              const mediaStyles = value[screenOrDevice];
              const mediaQuery =
                mediaQueries[screenOrDevice] || devices[screenOrDevice];
              if (mediaQuery) {
                if (Array.isArray(mediaQuery)) {
                  mediaQuery.forEach((mq) => {
                    generateUtilityClasses(mediaStyles, 'media', mq);
                  });
                } else {
                  generateUtilityClasses(mediaStyles, 'media', mediaQuery);
                }
              }
            });
          }
        } else {
          // Générer une classe utilitaire pour cette propriété et valeur
          const className = utilityClassManager.getClassName(
            property,
            value,
            'base',
            '',
            getColor
          );
          classes.push(className);
        }
      }
    });

    return classes;
  };

  /**
   * Mappe un événement React à une pseudo-classe CSS.
   * @param event L'événement React (ex: 'hover', 'active')
   * @returns La pseudo-classe CSS correspondante ou null si non supporté.
   */
  const mapEventToPseudo = (event: string): string | null => {
    const eventMap: Record<string, string> = {
      hover: 'hover',
      active: 'active',
      focus: 'focus',
      visited: 'visited',
      // Ajoutez d'autres mappings si nécessaire
    };
    return eventMap[event] || null;
  };

  const utilityClasses = useMemo(
    () => extractUtilityClasses(rest),
    [rest, getColor, mediaQueries, devices]
  );

  // Gestion des événements
  const newProps: any = {};
  if (onPress) {
    newProps.onClick = onPress;
  }

  // Ajouter les classes utilitaires
  if (utilityClasses.length > 0) {
    newProps.className = utilityClasses.join(' ');
  }

  // Ajouter le reste des props qui ne sont pas des styles
  const { style, children, ...otherProps } = rest;
  Object.keys(otherProps).forEach((key) => {
    if ((!excludedKeys.has(key) && !isStyleProp(key)) || includeKeys.has(key)) {
      newProps[key] = otherProps[key];
    }
  });

  // Ajouter les styles inline s'il y en a
  if (style) {
    newProps.style = style;
  }

  // Définir le composant HTML
  const Component = newProps.as || 'div';
  delete newProps.as;

  return <Component {...newProps}>{children}</Component>;
});
