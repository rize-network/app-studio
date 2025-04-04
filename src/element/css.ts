/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import { Shadows } from '../utils/shadow';
import Color from 'color-convert';
import { generateKeyframes } from './utils';
import { isStyleProp, StyleProps } from '../utils/style';
import { ElementProps } from './Element';
import { numericCssProperties } from '../utils/cssProperties';

type StyleContext = 'base' | 'pseudo' | 'media' | 'modifier';

// Implement a simple LRU cache for classCache
class LRUCache<K, V> {
  private cache: Map<K, V>;
  private maxSize: number;

  constructor(maxSize: number) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }

  get(key: K): V | undefined {
    const item = this.cache.get(key);
    if (item) {
      // Move to the end to mark as recently used
      this.cache.delete(key);
      this.cache.set(key, item);
      return item;
    }
    return undefined;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      // If already in cache, just move to the end
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Remove the least recently used (first item in the map)
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: K): void {
    this.cache.delete(key);
  }

  get size(): number {
    return this.cache.size;
  }

  keys(): IterableIterator<K> {
    return this.cache.keys();
  }

  values(): IterableIterator<V> {
    return this.cache.values();
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }
}

class UtilityClassManager {
  private baseStyleSheet: Map<Document, CSSStyleSheet> = new Map();
  private mediaStyleSheet: Map<Document, CSSStyleSheet> = new Map();
  private modifierStyleSheet: Map<Document, CSSStyleSheet> = new Map();
  // Use LRUCache instead of WeakMap for classCache
  private classCache: LRUCache<
    string,
    {
      className: string;
      rules: Array<{
        rule: string;
        context: StyleContext;
      }>;
    }
  >;
  private maxCacheSize: number;
  private propertyShorthand: Record<string, string>;
  private mainDocument: Document | null = null;

  constructor(
    propertyShorthand: Record<string, string>,
    maxCacheSize: number = 10000
  ) {
    this.propertyShorthand = propertyShorthand;
    this.maxCacheSize = maxCacheSize;
    // Initialize LRUCache with maxSize
    this.classCache = new LRUCache(this.maxCacheSize);
    if (typeof document !== 'undefined') {
      this.mainDocument = document;
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

  private getMainDocumentRules(): Array<{
    cssText: string;
    context: StyleContext;
  }> {
    if (!this.mainDocument) return [];

    const rules: Array<{ cssText: string; context: StyleContext }> = [];

    // Get base rules
    const baseSheet = this.baseStyleSheet.get(this.mainDocument);
    if (baseSheet) {
      Array.from(baseSheet.cssRules).forEach((rule) => {
        rules.push({ cssText: rule.cssText, context: 'base' });
      });
    }

    // Get media rules
    const mediaSheet = this.mediaStyleSheet.get(this.mainDocument);
    if (mediaSheet) {
      Array.from(mediaSheet.cssRules).forEach((rule) => {
        rules.push({ cssText: rule.cssText, context: 'media' });
      });
    }

    // Get modifier rules
    const modifierSheet = this.modifierStyleSheet.get(this.mainDocument);
    if (modifierSheet) {
      Array.from(modifierSheet.cssRules).forEach((rule) => {
        rules.push({ cssText: rule.cssText, context: 'modifier' });
      });
    }

    return rules;
  }

  public addDocument(targetDocument: Document) {
    if (targetDocument === this.mainDocument) return;

    this.initStyleSheets(targetDocument);

    this.clearStylesFromDocument(targetDocument);

    // Reinject all cached rules into the new document
    const mainRules = this.getMainDocumentRules();
    mainRules.forEach(({ cssText, context }) => {
      this.injectRuleToDocument(cssText, context, targetDocument);
    });
  }

  private clearStylesFromDocument(targetDocument: Document) {
    const baseSheet = this.baseStyleSheet.get(targetDocument);
    const mediaSheet = this.mediaStyleSheet.get(targetDocument);
    const modifierSheet = this.modifierStyleSheet.get(targetDocument);

    if (baseSheet) this.clearStyleSheet(baseSheet);
    if (mediaSheet) this.clearStyleSheet(mediaSheet);
    if (modifierSheet) this.clearStyleSheet(modifierSheet);
  }

  private escapeClassName(className: string): string {
    return className.replace(/:/g, '\\:');
  }

  injectRule(cssRule: string, context: StyleContext = 'base') {
    // First inject to main document
    if (this.mainDocument) {
      this.injectRuleToDocument(cssRule, context, this.mainDocument);
    }

    // Then inject to all iframe documents
    for (const document of this.getAllRegisteredDocuments()) {
      if (document !== this.mainDocument) {
        this.injectRuleToDocument(cssRule, context, document);
      }
    }
  }

  private getAllRegisteredDocuments(): Document[] {
    return Array.from(this.baseStyleSheet.keys());
  }

  private addToCache(
    key: string,
    className: string,
    rules: Array<{ rule: string; context: StyleContext }>
  ) {
    // LRUCache handles size limit internally
    this.classCache.set(key, { className, rules });
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

    const cached = this.classCache.get(key);
    if (cached) {
      return [cached.className];
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
    let rules: Array<{ rule: string; context: StyleContext }> = [];

    const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
    let valueForCss = processedValue;

    if (
      typeof valueForCss === 'number' &&
      numericCssProperties.has(cssProperty)
    ) {
      valueForCss = `${valueForCss}px`;
    }

    const generateRules = (className: string) => {
      const escapedClassName = this.escapeClassName(className);

      switch (context) {
        case 'base':
          rules.push({
            rule: `.${escapedClassName} { ${cssProperty}: ${valueForCss}; }`,
            context: 'base',
          });
          break;
        case 'pseudo':
          rules.push({
            rule: `.${escapedClassName}:${modifier} { ${cssProperty}: ${valueForCss}; }`,
            context: 'pseudo',
          });
          break;
        case 'media':
          mediaQueries.forEach((mq) => {
            rules.push({
              rule: `@media ${mq} { .${escapedClassName} { ${cssProperty}: ${valueForCss}; } }`,
              context: 'media',
            });
          });
          break;
      }
    };

    if (context === 'pseudo' && modifier) {
      const pseudoClassName = `${baseClassName}--${modifier}`;
      classNames = [pseudoClassName];
      generateRules(pseudoClassName);
    } else if (context === 'media' && modifier) {
      const mediaClassName = `${modifier}--${baseClassName}`;
      classNames = [mediaClassName];
      generateRules(mediaClassName);
    } else {
      generateRules(baseClassName);
    }

    // Inject all rules
    rules.forEach(({ rule, context }) => {
      this.injectRule(rule, context);
    });

    // Cache the generated rules
    this.addToCache(key, classNames[0], rules);

    return classNames;
  }

  public removeDocument(targetDocument: Document) {
    if (targetDocument === this.mainDocument) return;

    this.baseStyleSheet.delete(targetDocument);
    this.mediaStyleSheet.delete(targetDocument);
    this.modifierStyleSheet.delete(targetDocument);
  }

  public clearCache() {
    this.classCache.clear();
  }

  private clearStyleSheet(styleSheet: CSSStyleSheet) {
    while (styleSheet.cssRules.length > 0) {
      styleSheet.deleteRule(0);
    }
  }

  public regenerateStyles(targetDocument: Document) {
    if (targetDocument === this.mainDocument) {
      // For main document, regenerate from cache
      this.clearStylesFromDocument(targetDocument);
      const values = Array.from(this.classCache.values());
      for (const { rules } of values) {
        rules.forEach(
          ({ rule, context }: { rule: string; context: StyleContext }) => {
            this.injectRuleToDocument(rule, context, targetDocument);
          }
        );
      }
    } else {
      // For iframes, copy from main document
      this.addDocument(targetDocument);
    }
  }

  public regenerateAllStyles() {
    // Regenerate styles for all registered documents
    for (const document of this.getAllRegisteredDocuments()) {
      this.regenerateStyles(document);
    }
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

  // Optional: Add helpers for debugging
  public printStyles(targetDocument: Document) {
    console.group('Current styles for document:');

    console.group('Base styles:');
    const baseSheet = this.baseStyleSheet.get(targetDocument);
    if (baseSheet) {
      Array.from(baseSheet.cssRules).forEach((rule, i) => {
        console.log(`${i}: ${rule.cssText}`);
      });
    }
    console.groupEnd();

    console.group('Media styles:');
    const mediaSheet = this.mediaStyleSheet.get(targetDocument);
    if (mediaSheet) {
      Array.from(mediaSheet.cssRules).forEach((rule, i) => {
        console.log(`${i}: ${rule.cssText}`);
      });
    }
    console.groupEnd();

    console.group('Modifier styles:');
    const modifierSheet = this.modifierStyleSheet.get(targetDocument);
    if (modifierSheet) {
      Array.from(modifierSheet.cssRules).forEach((rule, i) => {
        console.log(`${i}: ${rule.cssText}`);
      });
    }
    console.groupEnd();

    console.groupEnd();
  }
}

/**
 * WeakMaps a React event to a CSS pseudo-class.
 */
const mapEventToPseudo = (event: string): string | null => {
  const eventWeakMap: Record<string, string> = {
    hover: 'hover',
    active: 'active',
    focus: 'focus',
    visited: 'visited',
  };
  return eventWeakMap[event] || null;
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

const rawCssCache = new Map<string, string>();
function generateUniqueClassName(css: string): string {
  // If we already have a class name for this exact CSS, return it

  // Otherwise, create a new encoded and truncated class name

  if (rawCssCache.has(css)) {
    return rawCssCache.get(css)!;
  }

  const shortName = Math.random().toString(36).substring(7);

  // Optionally include a counter to reduce collisions on identical slice
  const newClassName = `raw-css-${shortName}`;

  // Store it in the cache
  rawCssCache.set(css, newClassName);
  return newClassName;
}

const propertyShorthand = generatePropertyShorthand(StyleProps);
export const utilityClassManager = new UtilityClassManager(
  propertyShorthand,
  10000
); // You can adjust maxSize here

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

  // Handle widthHeight
  const widthHeight =
    props.height !== undefined &&
    props.width !== undefined &&
    props.height === props.width
      ? props.height
      : props.widthHeight || null;
  if (widthHeight) {
    const widthHeightValue =
      typeof widthHeight === 'number' ? `${widthHeight}px` : widthHeight;
    computedStyles.width = widthHeightValue;
    computedStyles.height = widthHeightValue;
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
    const animationTimelines: string[] = [];
    const animationRanges: string[] = [];
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
      animationTimelines.push(animation.timeline || '');
      animationRanges.push(animation.range || '');
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
    if (animationTimelines.some((t) => t)) {
      computedStyles.animationTimeline = animationTimelines.join(', ');
    }
    if (animationRanges.some((r) => r)) {
      computedStyles.animationRange = animationRanges.join(', ');
    }
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
      property !== 'css' &&
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

  if (props.css) {
    if (typeof props.css === 'object') {
      Object.assign(computedStyles, props.css);
    } else if (typeof props.css === 'string') {
      // Generate or reuse a class for the raw CSS
      const uniqueClassName = generateUniqueClassName(props.css);
      console.log('uniqueClassName', uniqueClassName, props.css);
      utilityClassManager.injectRule(`.${uniqueClassName} { ${props.css} }`);
      classes.push(uniqueClassName);
    }
  }

  return classes;
};
