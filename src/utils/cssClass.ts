/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import { Shadows } from './shadow';
import Color from 'color-convert';
import { generateKeyframes } from './animation';
import { isStyleProp, StyleProps } from './style';
import { CssProps } from '../components/Element';

// utils/UtilityClassManager.ts
type StyleContext = 'base' | 'pseudo' | 'media';

class UtilityClassManager {
  private styleSheet: CSSStyleSheet | null = null;
  private classCache: Map<string, string> = new Map();
  private maxCacheSize: number;
  private propertyShorthand: Record<string, string>;

  constructor(
    propertyShorthand: Record<string, string>,
    maxCacheSize: number = 10000
  ) {
    this.propertyShorthand = propertyShorthand;
    this.maxCacheSize = maxCacheSize;
    this.initStyleSheet();
  }

  private initStyleSheet() {
    if (typeof document !== 'undefined') {
      let styleTag = document.getElementById(
        'utility-classes'
      ) as HTMLStyleElement;
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'utility-classes';
        document.head.appendChild(styleTag);
      }
      this.styleSheet = styleTag.sheet as CSSStyleSheet;
    }
  }

  private escapeClassName(className: string): string {
    return className.replace(/:/g, '\\:');
  }

  injectRule(cssRule: string) {
    if (this.styleSheet) {
      try {
        const existingRules = Array.from(this.styleSheet.cssRules).map(
          (rule) => rule.cssText
        );
        if (!existingRules.includes(cssRule)) {
          this.styleSheet.insertRule(cssRule, this.styleSheet.cssRules.length);
        }
      } catch (e) {
        console.error(
          `Erreur lors de l'insertion de la règle CSS: "${cssRule}"`,
          e
        );
      }
    }
  }

  private addToCache(key: string, className: string) {
    if (this.classCache.size >= this.maxCacheSize) {
      const firstKey = this.classCache.keys().next().value;
      this.classCache.delete(firstKey);
    }
    this.classCache.set(key, className);
  }

  /**
   * Génère un ou plusieurs noms de classes pour une propriété et une valeur donnée.
   * @param property La propriété CSS (ex: 'padding', 'color').
   * @param value La valeur de la propriété (ex: '10px', '#fff').
   * @param context Le contexte de la classe ('base', 'pseudo', 'media').
   * @param modifier Le modificateur pour les pseudo-classes ou media queries (ex: 'hover', 'sm').
   * @param getColor Fonction pour convertir les couleurs si nécessaire.
   * @param mediaQueries Un tableau de media queries associées (utilisé uniquement pour le contexte 'media').
   * @returns Un tableau de noms de classes générés.
   */
  public getClassNames(
    property: string,
    value: any,
    context: StyleContext = 'base',
    modifier: string = '',
    getColor: (color: string) => string = (color) => color,
    mediaQueries: string[] = []
  ): string[] {
    let processedValue = value;

    // Si la propriété est une couleur, la convertir en valeur hexadécimale ou RGB
    if (property.toLowerCase().includes('color')) {
      processedValue = getColor(value);
    }

    let key = `${property}:${processedValue}`;
    if (modifier) {
      key = `${property}:${processedValue}|${modifier}`;
    }

    if (this.classCache.has(key)) {
      return [this.classCache.get(key)!];
    }

    // Générer un nom de classe unique avec le modificateur
    let shorthand = this.propertyShorthand[property];
    if (!shorthand) {
      shorthand = property.replace(/([A-Z])/g, '-$1').toLowerCase();
    }

    // console.log({ shorthand, property, processedValue });
    // Normaliser la valeur pour le nom de classe
    let normalizedValue = processedValue
      .toString()
      .replace(/\./g, 'p') // Remplacer les points par 'p'
      .replace(/\s+/g, '-') // Remplacer les espaces par '-'
      .replace(/[^a-zA-Z0-9\-]/g, ''); // Supprimer les autres caractères spéciaux

    let baseClassName = `${shorthand}-${normalizedValue}`;

    // Préfixer les noms de classe pour les pseudo-classes et media queries
    let classNames: string[] = [];

    if (context === 'pseudo' && modifier) {
      // Pseudo-class : ajouter '-modifier' suffix
      const pseudoClassName = `${baseClassName}-${modifier}`;
      classNames.push(pseudoClassName);
    } else if (context === 'media' && modifier) {
      // Media query : générer une classe pour chaque media query associée
      mediaQueries.forEach(() => {
        const mediaClassName = `${modifier}:${baseClassName}`;
        classNames.push(mediaClassName);
      });
    } else {
      classNames.push(baseClassName);
    }

    // Convertir camelCase en kebab-case
    const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
    let valueForCss = processedValue;

    // Ajouter des unités si nécessaire
    if (typeof valueForCss === 'number') {
      const propertiesWithUnits = [
        'width',
        'height',
        'padding',
        'margin',
        'padding-left',
        'padding-right',
        'padding-top',
        'padding-bottom',
        'margin-left',
        'margin-right',
        'margin-top',
        'margin-bottom',
        'transform',
        'transition',
      ];
      if (propertiesWithUnits.includes(cssProperty)) {
        valueForCss = `${valueForCss}px`;
      }
    }

    // Construire les règles CSS pour chaque classe générée
    classNames.forEach((className) => {
      const escapedClassName = this.escapeClassName(className);
      let cssRules: string[] = [];

      switch (context) {
        case 'base':
          cssRules.push(
            `.${escapedClassName} { ${cssProperty}: ${valueForCss}; }`
          );
          break;
        case 'pseudo':
          // Appliquer la pseudo-classe directement à la classe principale
          cssRules.push(
            `.${escapedClassName} { ${cssProperty}: ${valueForCss}; }`
          );
          break;
        case 'media':
          // Les media queries sont gérées séparément

          mediaQueries.forEach((mq) => {
            cssRules.push(
              `@media ${mq} { .${escapedClassName} { ${cssProperty}: ${valueForCss}; } }`
            );

            if ((window as any).isResponsive === true) {
              cssRules.push(
                `.${modifier} { .${escapedClassName} { ${cssProperty}: ${valueForCss}; } }`
              );
            }
          });

          break;
        default:
          cssRules.push(
            `.${escapedClassName} { ${cssProperty}: ${valueForCss}; }`
          );
      }

      console.log({ mediaQueries, cssRules, modifier });
      // Injecter les règles CSS
      cssRules.forEach((rule) => this.injectRule(rule));

      // Ajouter au cache
      this.addToCache(key, className);
    });

    return classNames;
  }
}

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

/**
 * Génère des abréviations pour les propriétés CSS.
 * @param styledProps Tableau des propriétés CSS à abréger.
 * @returns Un objet mappant chaque propriété CSS à son abréviation.
 */
function generatePropertyShorthand(
  styledProps: string[]
): Record<string, string> {
  const propertyShorthand: Record<string, string> = {};
  const usedAbbreviations = new Set<string>();

  /**
   * Génère une abréviation unique pour une propriété CSS donnée.
   * @param prop La propriété CSS à abréger.
   * @returns L'abréviation unique générée.
   */
  function generateAbbreviation(prop: string): string {
    const first = prop[0].toLowerCase();
    const last = prop[prop.length - 1].toLowerCase();
    const middle = prop.slice(1, -1).replace(/[a-z]/g, '').toLowerCase();
    let abbr = first + middle + last;

    if (abbr.length < 2) {
      abbr = prop.slice(0, 2).toLowerCase();
    }

    let i = 0;
    let uniqueAbbr = abbr;
    while (usedAbbreviations.has(uniqueAbbr)) {
      i++;
      uniqueAbbr = abbr + prop.slice(-i, prop.length).toLowerCase();
    }

    usedAbbreviations.add(uniqueAbbr);
    return uniqueAbbr;
  }

  for (const prop of styledProps) {
    propertyShorthand[prop] = generateAbbreviation(prop);
  }

  return propertyShorthand;
}

const propertyShorthand = generatePropertyShorthand(StyleProps);
const utilityClassManager = new UtilityClassManager(propertyShorthand);

export const extractUtilityClasses = (
  props: CssProps,
  getColor: (color: string) => string,
  mediaQueries: Record<string, string>,
  devices: Record<string, string[]>
): string[] => {
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
    const sizeValue = typeof size === 'number' ? `${size}px` : size;
    computedStyles.width = sizeValue;
    computedStyles.height = sizeValue;
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
      utilityClassManager.injectRule(keyframes);
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
    console.log({ styles });
    Object.keys(styles).forEach((property) => {
      const value = styles[property];
      let mediaQueriesForClass: string[] = [];

      if (context === 'media') {
        // 'modifier' peut être un breakpoint ou un dispositif
        if (mediaQueries[modifier]) {
          mediaQueriesForClass = [mediaQueries[modifier]];
        } else if (devices[modifier]) {
          mediaQueriesForClass = devices[modifier]
            .map((mq) => mediaQueries[mq])
            .filter((mq) => mq); // Filtrer les media queries valides
        }
      }

      if (value !== undefined) {
        const classNames = utilityClassManager.getClassNames(
          property,
          value,
          context,
          modifier,
          getColor,
          mediaQueriesForClass
        );

        classes.push(...classNames);
      } else {
        console.error({ styles, value, property });
        debugger;
      }
    });
  };

  // Générer des classes utilitaires pour les styles calculés
  generateUtilityClasses(computedStyles, 'base');

  // Parcourir toutes les propriétés de style et générer des classes utilitaires
  Object.keys(props).forEach((property) => {
    if (
      property !== 'style' &&
      (isStyleProp(property) || ['on', 'media'].includes(property))
    ) {
      const value = props[property];

      if (typeof value === 'object' && value !== null) {
        if (property === 'on') {
          // Styles liés aux événements (pseudo-classes)
          Object.keys(value).forEach((event) => {
            const eventStyles = value[event];
            // Séparer les propriétés de transition et les autres propriétés
            const transitionStyles: Record<string, any> = {};
            const nonTransitionStyles: Record<string, any> = {};

            Object.keys(eventStyles).forEach((prop) => {
              if (prop === 'transition') {
                transitionStyles[prop] = eventStyles[prop];
              } else {
                nonTransitionStyles[prop] = eventStyles[prop];
              }
            });

            // Appliquer les transitions aux styles de base
            if (Object.keys(transitionStyles).length > 0) {
              generateUtilityClasses(transitionStyles, 'base');
            }

            // Générer les classes pour les pseudo-classes
            if (Object.keys(nonTransitionStyles).length > 0) {
              const pseudo = mapEventToPseudo(event);
              if (pseudo) {
                generateUtilityClasses(nonTransitionStyles, 'pseudo', pseudo);
              }
            }
          });
        } else if (property === 'media') {
          // Styles conditionnels basés sur les media queries ou devices
          Object.keys(value).forEach((screenOrDevice) => {
            const mediaStyles = value[screenOrDevice];
            generateUtilityClasses(mediaStyles, 'media', screenOrDevice);
          });
        }
      } else {
        // Générer une classe utilitaire pour cette propriété et valeur
        if (value !== undefined) {
          const classNames = utilityClassManager.getClassNames(
            property,
            value,
            'base',
            '',
            getColor
          );

          classes.push(...classNames);
        } else {
          console.error({ value, property });
          debugger;
        }
      }
    }
  });

  return classes;
};