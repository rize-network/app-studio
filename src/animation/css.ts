/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import { Shadows } from '../utils/shadow';
import Color from 'color-convert';
import { generateKeyframes } from './utils';
import { isStyleProp, StyleProps } from '../utils/style';
import { ElementProps } from '../components/Element';
import { numericCssProperties } from '../utils/cssProperties';

type StyleContext = 'base' | 'pseudo' | 'media' | 'modifier';

class UtilityClassManager {
  // Maintain a Map from Document to its style sheets.
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
    // Register the main document
    if (typeof document !== 'undefined') {
      this.initStyleSheets(document);
    }
  }

  private initStyleSheets(targetDoc: Document) {
    // Base stylesheet
    if (!this.baseStyleSheet.has(targetDoc)) {
      let baseStyleTag = targetDoc.getElementById(
        'utility-classes-base'
      ) as HTMLStyleElement;
      if (!baseStyleTag) {
        baseStyleTag = targetDoc.createElement('style');
        baseStyleTag.id = 'utility-classes-base';
        targetDoc.head.appendChild(baseStyleTag);
      }
      this.baseStyleSheet.set(targetDoc, baseStyleTag.sheet as CSSStyleSheet);
    }
    // Media stylesheet
    if (!this.mediaStyleSheet.has(targetDoc)) {
      let mediaStyleTag = targetDoc.getElementById(
        'utility-classes-media'
      ) as HTMLStyleElement;
      if (!mediaStyleTag) {
        mediaStyleTag = targetDoc.createElement('style');
        mediaStyleTag.id = 'utility-classes-media';
        targetDoc.head.appendChild(mediaStyleTag);
      }
      this.mediaStyleSheet.set(targetDoc, mediaStyleTag.sheet as CSSStyleSheet);
    }
    // Modifier stylesheet
    if (!this.modifierStyleSheet.has(targetDoc)) {
      let modifierStyleTag = targetDoc.getElementById(
        'utility-classes-modifier'
      ) as HTMLStyleElement;
      if (!modifierStyleTag) {
        modifierStyleTag = targetDoc.createElement('style');
        modifierStyleTag.id = 'utility-classes-modifier';
        targetDoc.head.appendChild(modifierStyleTag);
      }
      this.modifierStyleSheet.set(
        targetDoc,
        modifierStyleTag.sheet as CSSStyleSheet
      );
    }
  }

  // Register a new document (e.g. an iframe's document)
  public addDocument(targetDoc: Document) {
    this.initStyleSheets(targetDoc);
    // Reinject cached rules
    this.injectedRulesBase.forEach((rule) =>
      this.injectRuleToDocument(rule, 'base', targetDoc)
    );
    this.injectedRulesMedia.forEach((rule) =>
      this.injectRuleToDocument(rule, 'media', targetDoc)
    );
    this.injectedRulesModifier.forEach((rule) =>
      this.injectRuleToDocument(rule, 'modifier', targetDoc)
    );
  }

  // Remove a document from management
  public removeDocument(targetDoc: Document) {
    this.baseStyleSheet.delete(targetDoc);
    this.mediaStyleSheet.delete(targetDoc);
    this.modifierStyleSheet.delete(targetDoc);
  }

  // Clear cache and injected rules
  public clearCache() {
    this.classCache.clear();
    this.injectedRulesBase.clear();
    this.injectedRulesMedia.clear();
    this.injectedRulesModifier.clear();
  }

  private injectRuleToDocument(
    cssRule: string,
    context: StyleContext,
    targetDoc: Document
  ) {
    let sheet: CSSStyleSheet | undefined;
    if (context === 'base' || context === 'pseudo') {
      sheet = this.baseStyleSheet.get(targetDoc) || undefined;
    } else if (context === 'media') {
      sheet = this.mediaStyleSheet.get(targetDoc) || undefined;
    } else if (context === 'modifier') {
      sheet = this.modifierStyleSheet.get(targetDoc) || undefined;
    }
    if (sheet) {
      try {
        sheet.insertRule(cssRule, sheet.cssRules.length);
      } catch (e) {
        console.error(`Error inserting rule into document: "${cssRule}"`, e);
      }
    }
  }

  private getAllRegisteredDocuments(): Document[] {
    return Array.from(this.baseStyleSheet.keys());
  }

  private escapeClassName(className: string): string {
    return className.replace(/:/g, '\\:');
  }

  private addToCache(key: string, className: string) {
    if (this.classCache.size >= this.maxCacheSize) {
      const firstKey = this.classCache.keys().next().value;
      if (firstKey) this.classCache.delete(firstKey);
    }
    this.classCache.set(key, className);
  }

  public injectRule(cssRule: string, context: StyleContext = 'base') {
    let injectedRules: Set<string>;
    if (context === 'base' || context === 'pseudo') {
      injectedRules = this.injectedRulesBase;
    } else if (context === 'media') {
      injectedRules = this.injectedRulesMedia;
    } else if (context === 'modifier') {
      injectedRules = this.injectedRulesModifier;
    } else {
      injectedRules = this.injectedRulesBase;
    }
    if (!injectedRules.has(cssRule)) {
      // Inject rule into all registered documents
      for (const doc of this.getAllRegisteredDocuments()) {
        this.injectRuleToDocument(cssRule, context, doc);
      }
      injectedRules.add(cssRule);
    }
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
    if (property.toLowerCase().includes('color')) {
      processedValue = getColor(value);
    }
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
          });
          break;
        default:
          cssRules.push(
            `.${escapedClassName} { ${cssProperty}: ${valueForCss}; }`
          );
      }
      // If the generated class includes a modifier, treat its rules as modifier rules.
      const ruleContext: StyleContext = className.includes('--')
        ? 'modifier'
        : context;
      cssRules.forEach((rule) => this.injectRule(rule, ruleContext));
      this.addToCache(key, className);
    });
    return classNames;
  }
}

/**
 * Maps a React event to a CSS pseudo-class.
 */
const mapEventToPseudo = (event: string): string | null => {
  const eventMap: Record<string, string> = {
    hover: 'hover',
    active: 'active',
    focus: 'focus',
    visited: 'visited',
  };
  return eventMap[event] || null;
};

/**
 * Generates shorthand abbreviations for CSS properties.
 */
function generatePropertyShorthand(
  styledProps: string[]
): Record<string, string> {
  const propertyShorthand: Record<string, string> = {};
  const usedAbbreviations = new Set<string>();

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
      uniqueAbbr = abbr + prop.slice(-i).toLowerCase();
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
  const computedStyles: Record<string, any> = {};

  // Handle size
  const size =
    props.height !== undefined &&
    props.width !== undefined &&
    props.height === props.width
      ? props.height
      : props.size || null;
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

  // Handle shadows
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
      const { shadowColor, shadowOpacity, shadowOffset, shadowRadius } =
        Shadows[shadowValue];
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
    let cumulativeTime = 0;
    animations.forEach((animation) => {
      const { keyframesName, keyframes } = generateKeyframes(animation);
      if (keyframes && typeof document !== 'undefined') {
        utilityClassManager.injectRule(keyframes);
      }
      animationNames.push(keyframesName);
      const durationMs = parseDuration(animation.duration || '0s');
      const delayMs = parseDuration(animation.delay || '0s');
      const totalDelayMs = cumulativeTime + delayMs;
      cumulativeTime = totalDelayMs + durationMs;
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

  // Generate utility classes for computed styles
  const generateUtilityClasses = (
    styles: Record<string, any>,
    context: 'base' | 'pseudo' | 'media' = 'base',
    modifier: string = ''
  ) => {
    Object.keys(styles).forEach((property) => {
      const value = styles[property];
      let mediaQueriesForClass: string[] = [];
      if (context === 'media') {
        if (mediaQueries[modifier]) {
          mediaQueriesForClass = [mediaQueries[modifier]];
        } else if (devices[modifier]) {
          mediaQueriesForClass = devices[modifier]
            .map((mq) => mediaQueries[mq])
            .filter((mq) => mq);
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
      }
    });
  };

  generateUtilityClasses(computedStyles, 'base');

  // Iterate over remaining style props
  Object.keys(props).forEach((property) => {
    if (
      property !== 'style' &&
      (isStyleProp(property) || ['on', 'media'].includes(property))
    ) {
      const value = (props as any)[property];
      if (typeof value === 'object' && value !== null) {
        if (property === 'on') {
          Object.keys(value).forEach((event) => {
            const eventStyles = value[event];
            const { animate, ...otherEventStyles } = eventStyles;
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
              Object.assign(otherEventStyles, animationStyles);
            }
            if (Object.keys(otherEventStyles).length > 0) {
              const pseudo = mapEventToPseudo(event);
              if (pseudo) {
                generateUtilityClasses(otherEventStyles, 'pseudo', pseudo);
              }
            }
          });
        } else if (property === 'media') {
          Object.keys(value).forEach((screenOrDevice) => {
            const mediaStyles = value[screenOrDevice];
            generateUtilityClasses(mediaStyles, 'media', screenOrDevice);
          });
        }
      } else {
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
        }
      }
    }
  });

  return classes;
};
