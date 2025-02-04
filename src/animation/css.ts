/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import { Shadows } from '../utils/shadow';
import Color from 'color-convert';
import { generateKeyframes } from './utils';
import { isStyleProp, StyleProps } from '../utils/style';
import { ElementProps } from '../components/Element';
import { numericCssProperties } from '../utils/cssProperties';

// utils/UtilityClassManager.ts
type StyleContext = 'base' | 'pseudo' | 'media' | 'modifier';

class UtilityClassManager {
  private baseStyleSheet: Map<Document, CSSStyleSheet> = new Map();
  private mediaStyleSheet: Map<Document, CSSStyleSheet> = new Map();
  private modifierStyleSheet: Map<Document, CSSStyleSheet> = new Map();
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
    if (typeof document !== 'undefined') {
      this.initStyleSheets(document);
    }
  }

  private initStyleSheets(targetDocument: Document) {
    if (!this.baseStyleSheet.has(targetDocument)) {
      let baseStyleTag = targetDocument.getElementById(
        'utility-classes-base'
      ) as HTMLStyleElement;
      if (!baseStyleTag) {
        baseStyleTag = targetDocument.createElement('style');
        baseStyleTag.id = 'utility-classes-base';
        targetDocument.head.appendChild(baseStyleTag);
      }
      this.baseStyleSheet.set(
        targetDocument,
        baseStyleTag.sheet as CSSStyleSheet
      );
    }

    if (!this.mediaStyleSheet.has(targetDocument)) {
      let mediaStyleTag = targetDocument.getElementById(
        'utility-classes-media'
      ) as HTMLStyleElement;
      if (!mediaStyleTag) {
        mediaStyleTag = targetDocument.createElement('style');
        mediaStyleTag.id = 'utility-classes-media';
        targetDocument.head.appendChild(mediaStyleTag);
      }
      this.mediaStyleSheet.set(
        targetDocument,
        mediaStyleTag.sheet as CSSStyleSheet
      );
    }

    if (!this.modifierStyleSheet.has(targetDocument)) {
      let modifierStyleTag = targetDocument.getElementById(
        'utility-classes-modifier'
      ) as HTMLStyleElement;
      if (!modifierStyleTag) {
        modifierStyleTag = targetDocument.createElement('style');
        modifierStyleTag.id = 'utility-classes-modifier';
        targetDocument.head.appendChild(modifierStyleTag);
      }
      this.modifierStyleSheet.set(
        targetDocument,
        modifierStyleTag.sheet as CSSStyleSheet
      );
    }
  }

  public addDocument(targetDocument: Document) {
    this.initStyleSheets(targetDocument);
    // Reinject all cached rules into the new document
    this.injectedRulesBase.forEach((rule) =>
      this.injectRuleToDocument(rule, 'base', targetDocument)
    );
    this.injectedRulesMedia.forEach((rule) =>
      this.injectRuleToDocument(rule, 'media', targetDocument)
    );
    this.injectedRulesModifier.forEach((rule) =>
      this.injectRuleToDocument(rule, 'modifier', targetDocument)
    );
  }

  private injectRuleToDocument(
    cssRule: string,
    context: StyleContext,
    targetDocument: Document
  ) {
    let styleSheet: CSSStyleSheet | null = null;

    switch (context) {
      case 'base':
      case 'pseudo':
        styleSheet = this.baseStyleSheet.get(targetDocument) || null;
        break;
      case 'media':
        styleSheet = this.mediaStyleSheet.get(targetDocument) || null;
        break;
      case 'modifier':
        styleSheet = this.modifierStyleSheet.get(targetDocument) || null;
        break;
    }

    if (styleSheet) {
      try {
        styleSheet.insertRule(cssRule, styleSheet.cssRules.length);
      } catch (e) {
        console.error(`Error inserting CSS rule to document: "${cssRule}"`, e);
      }
    }
  }

  private escapeClassName(className: string): string {
    return className.replace(/:/g, '\\:');
  }

  injectRule(cssRule: string, context: StyleContext = 'base') {
    let injectedRules: Set<string>;

    switch (context) {
      case 'base':
      case 'pseudo':
        injectedRules = this.injectedRulesBase;
        break;
      case 'media':
        injectedRules = this.injectedRulesMedia;
        break;
      case 'modifier':
        injectedRules = this.injectedRulesModifier;
        break;
      default:
        injectedRules = this.injectedRulesBase;
    }

    if (!injectedRules.has(cssRule)) {
      // Inject to all registered documents
      for (const targetDocument of this.getAllRegisteredDocuments()) {
        this.injectRuleToDocument(cssRule, context, targetDocument);
      }
      injectedRules.add(cssRule);
    }
  }

  private getAllRegisteredDocuments(): Document[] {
    return Array.from(this.baseStyleSheet.keys());
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
    getColor: (color: string) => string,
    mediaQueries: string[] = []
  ): string[] {
    let processedValue = value;

    // If the property is a color, convert it
    if (property.toLowerCase().includes('color')) {
      processedValue = getColor(value);
    }

    // Handle numeric values
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

    // Generate a unique class name with modifier
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
            // if ((window as any).isResponsive === true) {
            //   cssRules.push(
            //     `.${modifier} { .${escapedClassName} { ${cssProperty}: ${valueForCss}; } }`
            //   );
            // }
          });
          break;
        default:
          cssRules.push(
            `.${escapedClassName} { ${cssProperty}: ${valueForCss}; }`
          );
      }

      const isModifier = className.includes('--');
      const ruleContext: StyleContext = isModifier ? 'modifier' : context;

      cssRules.forEach((rule) => this.injectRule(rule, ruleContext));
      this.addToCache(key, className);
    });

    return classNames;
  }

  public removeDocument(targetDocument: Document) {
    this.baseStyleSheet.delete(targetDocument);
    this.mediaStyleSheet.delete(targetDocument);
    this.modifierStyleSheet.delete(targetDocument);
  }

  public clearCache() {
    this.classCache.clear();
    this.injectedRulesBase.clear();
    this.injectedRulesMedia.clear();
    this.injectedRulesModifier.clear();
  }
}

/**
 * Maps a React event to a CSS pseudo-class.
 * @param event The React event (e.g., 'hover', 'active')
 * @returns The corresponding CSS pseudo-class or null if unsupported.
 */
const mapEventToPseudo = (event: string): string | null => {
  const eventMap: Record<string, string> = {
    hover: 'hover',
    active: 'active',
    focus: 'focus',
    visited: 'visited',
    // Add more mappings if necessary
  };
  return eventMap[event] || null;
};

/**
 * Generates shorthand abbreviations for CSS properties.
 * @param styledProps Array of CSS properties to abbreviate.
 * @returns An object mapping each CSS property to its abbreviation.
 */
function generatePropertyShorthand(
  styledProps: string[]
): Record<string, string> {
  const propertyShorthand: Record<string, string> = {};
  const usedAbbreviations = new Set<string>();

  /**
   * Generates a unique abbreviation for a given CSS property.
   * @param prop The CSS property to abbreviate.
   * @returns The unique abbreviation generated.
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

// Function to format a duration in milliseconds to a string with units
function formatDuration(ms: number): string {
  if (ms >= 1000 && ms % 1000 === 0) {
    return `${ms / 1000}s`;
  }
  return `${ms}ms`;
}

export const extractUtilityClasses = (
  props: ElementProps,
  getColor: (color: string) => string,
  mediaQueries: Record<string, string>,
  devices: Record<string, string[]>
): string[] => {
  const classes: string[] = [];

  // Computed styles based on props
  const computedStyles: Record<string, any> = {};

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
    const sizeValue = typeof size === 'number' ? `${size}px` : size;
    computedStyles.width = sizeValue;
    computedStyles.height = sizeValue;
  }

  // Handle padding and margin
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

  // Apply shadows if specified
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

      // Convert color to rgba
      const rgb = Color.hex.rgb(shadowColor);
      const rgbaColor = `rgba(${rgb.join(',')}, ${shadowOpacity})`;

      computedStyles.boxShadow = `${shadowOffset.height}px ${shadowOffset.width}px ${shadowRadius}px ${rgbaColor}`;
    }
  }

  // Handle animations
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

    let cumulativeTime = 0; // Cumulative time in milliseconds

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

      // Calculate total delay for this animation
      const totalDelayMs = cumulativeTime + delayMs;

      // Update cumulative time
      cumulativeTime = totalDelayMs + durationMs;

      // Add formatted values to arrays
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
   * Generates utility classes for a set of styles.
   * @param styles The styles to transform into utility classes.
   * @param context The context of the styles ('base', 'pseudo', 'media').
   * @param modifier The modifier for pseudo-classes or media queries.
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
        // 'modifier' can be a breakpoint or a device
        if (mediaQueries[modifier]) {
          mediaQueriesForClass = [mediaQueries[modifier]];
        } else if (devices[modifier]) {
          mediaQueriesForClass = devices[modifier]
            .map((mq) => mediaQueries[mq])
            .filter((mq) => mq); // Filter valid media queries
        }
      }

      if (value !== undefined && value !== '') {
        const classNames = utilityClassManager.getClassNames(
          property,
          value,
          context,
          modifier,
          getColor, // Pass getColor with single parameter
          mediaQueriesForClass
        );

        classes.push(...classNames);
      } else {
        if ((window as any).isDebug === true)
          console.error({ styles, value, property });
      }
    });
  };

  // Generate utility classes for computed styles
  generateUtilityClasses(computedStyles, 'base');

  // Iterate over all style properties and generate utility classes
  Object.keys(props).forEach((property) => {
    if (
      property !== 'style' &&
      (isStyleProp(property) || ['on', 'media'].includes(property))
    ) {
      const value = (props as any)[property];

      if (typeof value === 'object' && value !== null) {
        if (property === 'on') {
          // Styles related to events (pseudo-classes)
          Object.keys(value).forEach((event) => {
            const eventStyles = value[event];
            // Separate transition properties and other properties
            // Extract 'animate' from event styles
            const { animate, ...otherEventStyles } = eventStyles;

            // Handle animations in events
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

              // Create an object with animation properties
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

              // Merge animation styles with other event styles
              Object.assign(otherEventStyles, animationStyles);
            }

            // Generate classes for pseudo-classes
            if (Object.keys(otherEventStyles).length > 0) {
              const pseudo = mapEventToPseudo(event);
              if (pseudo) {
                generateUtilityClasses(otherEventStyles, 'pseudo', pseudo);
              }
            }
          });
        } else if (property === 'media') {
          // Conditional styles based on media queries or devices
          Object.keys(value).forEach((screenOrDevice) => {
            const mediaStyles = value[screenOrDevice];
            generateUtilityClasses(mediaStyles, 'media', screenOrDevice);
          });
        }
      } else {
        // Generate a utility class for this property and value
        if (value !== undefined && value !== '') {
          const classNames = utilityClassManager.getClassNames(
            property,
            value,
            'base',
            '',
            getColor,
            []
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
