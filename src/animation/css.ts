/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import { Shadows } from '../utils/shadow';
import Color from 'color-convert';
import { generateKeyframes } from './utils';
import { isStyleProp, StyleProps } from '../utils/style';
import { CssProps } from '../components/Element';
import { numericCssProperties } from '../utils/cssProperties';

// utils/UtilityClassManager.ts
type StyleContext = 'base' | 'pseudo' | 'media' | 'modifier';

class UtilityClassManager {
  private baseStyleSheet: CSSStyleSheet | null = null;
  private mediaStyleSheet: CSSStyleSheet | null = null;
  private modifierStyleSheet: CSSStyleSheet | null = null;
  private classCache: Map<string, string> = new Map();
  private maxCacheSize: number;
  private propertyShorthand: Record<string, string>;
  private injectedRulesBase: Set<string> = new Set();
  private injectedRulesMedia: Set<string> = new Set();
  private injectedRulesModifier: Set<string> = new Set();

  constructor(
    propertyShorthand: Record<string, string>,
    maxCacheSize: number = 10000
  ) {
    this.propertyShorthand = propertyShorthand;
    this.maxCacheSize = maxCacheSize;
    this.initStyleSheets();
  }

  private initStyleSheets() {
    if (typeof document !== 'undefined') {
      // Feuille de style de base
      let baseStyleTag = document.getElementById(
        'utility-classes-base'
      ) as HTMLStyleElement;
      if (!baseStyleTag) {
        baseStyleTag = document.createElement('style');
        baseStyleTag.id = 'utility-classes-base';
        document.head.appendChild(baseStyleTag);
      }
      this.baseStyleSheet = baseStyleTag.sheet as CSSStyleSheet;

      // Feuille de style pour les media queries
      let mediaStyleTag = document.getElementById(
        'utility-classes-media'
      ) as HTMLStyleElement;
      if (!mediaStyleTag) {
        mediaStyleTag = document.createElement('style');
        mediaStyleTag.id = 'utility-classes-media';
        document.head.appendChild(mediaStyleTag);
      }
      this.mediaStyleSheet = mediaStyleTag.sheet as CSSStyleSheet;

      // Feuille de style pour les modificateurs
      let modifierStyleTag = document.getElementById(
        'utility-classes-modifier'
      ) as HTMLStyleElement;
      if (!modifierStyleTag) {
        modifierStyleTag = document.createElement('style');
        modifierStyleTag.id = 'utility-classes-modifier';
        document.head.appendChild(modifierStyleTag);
      }
      this.modifierStyleSheet = modifierStyleTag.sheet as CSSStyleSheet;
    }
  }

  private escapeClassName(className: string): string {
    return className.replace(/:/g, '\\:');
  }

  injectRule(cssRule: string, context: StyleContext = 'base') {
    let styleSheet: CSSStyleSheet | null = null;
    let injectedRules: Set<string> = new Set();

    switch (context) {
      case 'base':
        styleSheet = this.baseStyleSheet;
        injectedRules = this.injectedRulesBase;
        break;
      case 'pseudo':
        styleSheet = this.baseStyleSheet; // Si les pseudo-classes sont dans la feuille de base
        injectedRules = this.injectedRulesBase;
        break;
      case 'media':
        styleSheet = this.mediaStyleSheet;
        injectedRules = this.injectedRulesMedia;
        break;
      case 'modifier':
        styleSheet = this.modifierStyleSheet;
        injectedRules = this.injectedRulesModifier;
        break;
      default:
        styleSheet = this.baseStyleSheet;
        injectedRules = this.injectedRulesBase;
    }

    if (styleSheet && !injectedRules.has(cssRule)) {
      try {
        styleSheet.insertRule(cssRule, styleSheet.cssRules.length);
        injectedRules.add(cssRule);
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
      if (firstKey) this.classCache.delete(firstKey);
    }
    this.classCache.set(key, className);
  }

  public getClassNames(
    property: string,
    value: any,
    context: StyleContext = 'base',
    modifier: string = '',
    getColor: (color: string) => string = (color) => color,
    mediaQueries: string[] = []
  ): string[] {
    let processedValue = value;

    // Si la propriété est une couleur, la convertir
    if (property.toLowerCase().includes('color')) {
      processedValue = getColor(value);
    }

    // Gérer les valeurs numériques
    if (typeof processedValue === 'number') {
      if (numericCssProperties.has(property)) {
        processedValue = `${processedValue}px`;
      }
    }

    let formattedValue = processedValue.toString().split(' ').join('-');
    let key = `${property}:${formattedValue}`;
    if (modifier && context !== 'base') {
      key = `${property}:${formattedValue}|${context}:${modifier}`;
    }

    if (this.classCache.has(key)) {
      return [this.classCache.get(key)!];
    }

    // Générer un nom de classe unique avec le modificateur
    let shorthand = this.propertyShorthand[property];
    if (!shorthand) {
      shorthand = property.replace(/([A-Z])/g, '-$1').toLowerCase();
    }

    let normalizedValue = formattedValue
      .toString()
      .replace(/\./g, 'p')
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9\-]/g, '')
      .replace(/%/g, 'pct')
      .replace(/vw/g, 'vw')
      .replace(/vh/g, 'vh')
      .replace(/em/g, 'em')
      .replace(/rem/g, 'rem');

    let baseClassName = `${shorthand}-${normalizedValue}`;

    let classNames: string[] = [baseClassName];

    if (context === 'pseudo' && modifier) {
      const pseudoClassName = `${baseClassName}--${modifier}`;
      classNames.push(pseudoClassName);
    } else if (context === 'media' && modifier) {
      mediaQueries.forEach(() => {
        const mediaClassName = `${modifier}--${baseClassName}`;
        classNames.push(mediaClassName);
      });
    } else {
      classNames.push(baseClassName);
    }

    const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
    let valueForCss = processedValue;

    if (typeof valueForCss === 'number') {
      if (numericCssProperties.has(cssProperty)) {
        valueForCss = `${valueForCss}px`;
      }
    }

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
          cssRules.push(
            `.${escapedClassName}:${modifier} { ${cssProperty}: ${valueForCss}; }`
          );
          break;
        case 'media':
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

      // Déterminer si la classe est un modificateur
      const isModifier = className.includes('--');

      // Définir le contexte approprié
      const ruleContext: StyleContext = isModifier ? 'modifier' : context;

      // Injecter les règles CSS avec le contexte approprié
      cssRules.forEach((rule) => this.injectRule(rule, ruleContext));

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
export const utilityClassManager = new UtilityClassManager(propertyShorthand);

function parseDuration(duration: string): number {
  const match = duration.match(/^([\d.]+)(ms|s)$/);
  if (!match) return 0;
  const value = parseFloat(match[1]);
  const unit = match[2];
  return unit === 's' ? value * 1000 : value;
}

// Fonction pour formater une durée en millisecondes en chaîne avec unité
function formatDuration(ms: number): string {
  if (ms >= 1000 && ms % 1000 === 0) {
    return `${ms / 1000}s`;
  }
  return `${ms}ms`;
}

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
    const animations = Array.isArray(props.animate)
      ? props.animate
      : [props.animate];
    const animationNames: string[] = [];
    const animationDurations: string[] = [];
    const animationTimingFunctions: string[] = [];
    const animationDelays: string[] = [];
    const animationIterationCounts: string[] = [];
    const animationDirections: string[] = [];
    const animationFillModes: string[] = [];
    const animationPlayStates: string[] = [];

    let cumulativeTime = 0; // Temps cumulé en millisecondes

    animations.forEach((animation) => {
      const { keyframesName, keyframes } = generateKeyframes(animation);

      if (keyframes && typeof document !== 'undefined') {
        utilityClassManager.injectRule(keyframes);
      }

      animationNames.push(keyframesName);

      // Parse duration and delay
      const durationStr = animation.duration || '0s';
      const durationMs = parseDuration(durationStr);

      const delayStr = animation.delay || '0s';
      const delayMs = parseDuration(delayStr);

      // Calculer le délai total pour cette animation
      const totalDelayMs = cumulativeTime + delayMs;

      // Mettre à jour le temps cumulé
      cumulativeTime = totalDelayMs + durationMs;

      // Ajouter les valeurs formatées aux tableaux
      animationDurations.push(formatDuration(durationMs));
      animationTimingFunctions.push(animation.timingFunction || 'ease');
      animationDelays.push(formatDuration(totalDelayMs));
      animationIterationCounts.push(
        animation.iterationCount !== undefined
          ? `${animation.iterationCount}`
          : '1'
      );
      animationDirections.push(animation.direction || 'normal');
      animationFillModes.push(animation.fillMode || 'none');
      animationPlayStates.push(animation.playState || 'running');
    });

    computedStyles.animationName = animationNames.join(', ');
    computedStyles.animationDuration = animationDurations.join(', ');
    computedStyles.animationTimingFunction =
      animationTimingFunctions.join(', ');
    computedStyles.animationDelay = animationDelays.join(', ');
    computedStyles.animationIterationCount =
      animationIterationCounts.join(', ');
    computedStyles.animationDirection = animationDirections.join(', ');
    computedStyles.animationFillMode = animationFillModes.join(', ');
    computedStyles.animationPlayState = animationPlayStates.join(', ');
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

      if (value !== undefined && value !== '') {
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
        if ((window as any).isDebug === true)
          console.error({ styles, value, property });
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
      const value = (props as any)[property];

      if (typeof value === 'object' && value !== null) {
        if (property === 'on') {
          // Styles liés aux événements (pseudo-classes)
          Object.keys(value).forEach((event) => {
            const eventStyles = value[event];
            // Séparer les propriétés de transition et les autres propriétés
            // Extraire 'animate' des styles d'événement
            const { animate, ...otherEventStyles } = eventStyles;

            // Gestion des animations dans les événements
            if (animate) {
              const animations = Array.isArray(animate) ? animate : [animate];
              const animationNames: string[] = [];
              const animationDurations: string[] = [];
              const animationTimingFunctions: string[] = [];
              const animationDelays: string[] = [];
              const animationIterationCounts: string[] = [];
              const animationDirections: string[] = [];
              const animationFillModes: string[] = [];
              const animationPlayStates: string[] = [];

              animations.forEach((animation) => {
                const { keyframesName, keyframes } =
                  generateKeyframes(animation);

                if (keyframes && typeof document !== 'undefined') {
                  utilityClassManager.injectRule(keyframes);
                }

                animationNames.push(keyframesName);
                animationDurations.push(animation.duration || '0s');
                animationTimingFunctions.push(
                  animation.timingFunction || 'ease'
                );
                animationDelays.push(animation.delay || '0s');
                animationIterationCounts.push(
                  animation.iterationCount !== undefined
                    ? `${animation.iterationCount}`
                    : '1'
                );
                animationDirections.push(animation.direction || 'normal');
                animationFillModes.push(animation.fillMode || 'none');
                animationPlayStates.push(animation.playState || 'running');
              });

              // Créer un objet avec les propriétés d'animation
              const animationStyles = {
                animationName: animationNames.join(', '),
                animationDuration: animationDurations.join(', '),
                animationTimingFunction: animationTimingFunctions.join(', '),
                animationDelay: animationDelays.join(', '),
                animationIterationCount: animationIterationCounts.join(', '),
                animationDirection: animationDirections.join(', '),
                animationFillMode: animationFillModes.join(', '),
                animationPlayState: animationPlayStates.join(', '),
              };

              // Fusionner les styles d'animation avec les autres styles de l'événement
              Object.assign(otherEventStyles, animationStyles);
            }

            // Générer les classes pour les pseudo-classes
            if (Object.keys(otherEventStyles).length > 0) {
              const pseudo = mapEventToPseudo(event);
              if (pseudo) {
                generateUtilityClasses(otherEventStyles, 'pseudo', pseudo);
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
        if (value !== undefined && value !== '') {
          const classNames = utilityClassManager.getClassNames(
            property,
            value,
            'base',
            '',
            getColor
          );

          classes.push(...classNames);
        } else {
          if ((window as any).isDebug === true)
            console.error({ value, property });
        }
      }
    }
  });

  return classes;
};
