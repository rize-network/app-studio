/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import { Shadows } from '../utils/shadow';
import Color from 'color-convert';
import { generateKeyframes } from './utils';
import {
  isStyleProp,
  StyleProps,
  propertyToKebabCase,
  toKebabCase,
  processStyleProperty,
} from '../utils/style';
import { ElementProps } from './Element.types';
import { numericCssProperties } from '../utils/cssProperties';
import {
  needsVendorPrefix,
  getVendorPrefixedProperties,
} from '../utils/vendorPrefixes';
import { hash } from '../utils/hash';

type StyleContext = 'base' | 'pseudo' | 'media' | 'modifier' | 'override';

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

// Store raw CSS classes
const rawCssCache = new Map<string, string>();

/**
 * Maps a React event to a CSS pseudo-class.
 */
const EVENT_TO_PSEUDO: Record<string, string> = {
  // Basic interaction states
  hover: 'hover',
  active: 'active',
  focus: 'focus',
  visited: 'visited',
  // Form states
  disabled: 'disabled',
  enabled: 'enabled',
  checked: 'checked',
  unchecked: 'not(:checked)',
  invalid: 'invalid',
  valid: 'valid',
  required: 'required',
  optional: 'optional',
  // Selection states
  selected: 'selected',
  // Target states
  target: 'target',
  // Child states
  firstChild: 'first-child',
  lastChild: 'last-child',
  onlyChild: 'only-child',
  firstOfType: 'first-of-type',
  lastOfType: 'last-of-type',
  // Other states
  empty: 'empty',
  // Focus states
  focusVisible: 'focus-visible',
  focusWithin: 'focus-within',
  // Placeholder
  placeholder: 'placeholder',
  // Pseudo-elements
  before: 'before',
  after: 'after',
  firstLetter: 'first-letter',
  firstLine: 'first-line',
  selection: 'selection',
  backdrop: 'backdrop',
  marker: 'marker',
  // Group modifiers
  groupHover: 'group-hover',
  groupFocus: 'group-focus',
  groupActive: 'group-active',
  groupDisabled: 'group-disabled',
  // Peer modifiers
  peerHover: 'peer-hover',
  peerFocus: 'peer-focus',
  peerActive: 'peer-active',
  peerDisabled: 'peer-disabled',
  peerChecked: 'peer-checked',
};

/**
 * Utility functions for animation handling
 */
export const AnimationUtils = {
  parseDuration(duration: string): number {
    const match = duration.match(/^([\d.]+)(ms|s)$/);
    if (!match) return 0;
    const value = parseFloat(match[1]);
    const unit = match[2];
    return unit === 's' ? value * 1000 : value;
  },

  formatDuration(ms: number): string {
    if (ms >= 1000 && ms % 1000 === 0) {
      return `${ms / 1000}s`;
    }
    return `${ms}ms`;
  },

  processAnimations(animations: any[], manager?: UtilityClassManager) {
    const result = {
      names: [] as string[],
      durations: [] as string[],
      timingFunctions: [] as string[],
      delays: [] as string[],
      iterationCounts: [] as string[],
      directions: [] as string[],
      fillModes: [] as string[],
      playStates: [] as string[],
      timelines: [] as string[],
      ranges: [] as string[],
    };

    let cumulativeTime = 0;

    animations.forEach((animation) => {
      const { keyframesName, keyframes } = generateKeyframes(animation);
      if (keyframes) {
        // Use provided manager or fall back to global
        (manager || utilityClassManager).injectRule(keyframes);
      }

      result.names.push(keyframesName);

      // For scroll-driven animations (with timeline), use 'auto' duration
      // For time-based animations, parse the duration normally
      const hasTimeline = !!animation.timeline;

      if (hasTimeline) {
        // Scroll-driven animations should use 'auto' duration
        // unless explicitly specified
        result.durations.push(animation.duration || 'auto');
        // Don't accumulate time for scroll-driven animations
        result.delays.push(animation.delay || '0s');
      } else {
        const durationMs = this.parseDuration(animation.duration || '0s');
        const delayMs = this.parseDuration(animation.delay || '0s');
        const totalDelayMs = cumulativeTime + delayMs;

        cumulativeTime = totalDelayMs + durationMs;

        result.durations.push(this.formatDuration(durationMs));
        result.delays.push(this.formatDuration(totalDelayMs));
      }

      result.timingFunctions.push(animation.timingFunction || 'ease');
      result.iterationCounts.push(
        animation.iterationCount !== undefined
          ? `${animation.iterationCount}`
          : '1'
      );
      result.directions.push(animation.direction || 'normal');
      // Default to 'both' fillMode for scroll-driven animations, 'none' for time-based
      result.fillModes.push(
        animation.fillMode || (hasTimeline ? 'both' : 'none')
      );
      result.playStates.push(animation.playState || 'running');
      result.timelines.push(animation.timeline || '');
      result.ranges.push(animation.range || '');
    });

    return {
      animationName: result.names.join(', '),
      animationDuration: result.durations.join(', '),
      animationTimingFunction: result.timingFunctions.join(', '),
      animationDelay: result.delays.join(', '),
      animationIterationCount: result.iterationCounts.join(', '),
      animationDirection: result.directions.join(', '),
      animationFillMode: result.fillModes.join(', '),
      animationPlayState: result.playStates.join(', '),
      ...(result.timelines.some((t) => t) && {
        animationTimeline: result.timelines.join(', '),
      }),
      ...(result.ranges.some((r) => r) && {
        animationRange: result.ranges.join(', '),
      }),
    };
  },
};

/**
 * Utility functions for value processing
 */
const ValueUtils = {
  formatValue(
    value: any,
    property: string,
    getColor: (color: string) => string
  ): any {
    // Use the shared processStyleProperty function which now contains the robust regex logic
    return processStyleProperty(property, value, getColor);
  },

  normalizeCssValue(value: any): string {
    const str = typeof value === 'string' ? value : String(value);

    // Handle CSS variables in values
    if (str.charCodeAt(0) === 45 && str.charCodeAt(1) === 45) {
      // starts with '--'
      return `var-${str.substring(2)}`;
    }

    // Handle vendor-prefixed values
    if (str.startsWith('-webkit-')) {
      return `webkit-${str
        .substring(8)
        .replace(/\./g, 'p')
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9-]/g, '')}`;
    }

    // Single-pass normalization: replace dots with 'p', spaces with '-', strip non-alphanumeric
    return str
      .replace(/\./g, 'p')
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9-]/g, '');
  },

  generateUniqueClassName(css: string): string {
    if (rawCssCache.has(css)) {
      return rawCssCache.get(css)!;
    }

    const shortName = hash(css);
    const newClassName = `raw-css-${shortName}`;

    rawCssCache.set(css, newClassName);
    return newClassName;
  },
};

export class UtilityClassManager {
  private styleSheets: Map<Document, Record<StyleContext, CSSStyleSheet>> =
    new Map();
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
  private propertyShorthand: Record<string, string>;
  private mainDocument: Document | null = null;

  constructor(
    propertyShorthand: Record<string, string>,
    maxCacheSize: number = 10000
  ) {
    this.propertyShorthand = propertyShorthand;
    this.classCache = new LRUCache(maxCacheSize);

    if (typeof document !== 'undefined') {
      this.mainDocument = document;
      this.initStyleSheets(document);
    }
  }

  private initStyleSheets(targetDocument: Document) {
    if (!this.styleSheets.has(targetDocument)) {
      const sheetMap: Record<StyleContext, CSSStyleSheet> = {} as any;

      // Initialize all style sheets at once
      const contextIds: Record<StyleContext, string> = {
        base: 'utility-classes-base',
        pseudo: 'utility-classes-pseudo',
        media: 'utility-classes-media',
        modifier: 'utility-classes-modifier',
        override: 'utility-classes-override',
      };

      for (const [context, id] of Object.entries(contextIds)) {
        let styleTag = targetDocument.getElementById(id) as HTMLStyleElement;

        if (!styleTag) {
          styleTag = targetDocument.createElement('style');
          styleTag.id = id;
          targetDocument.head.appendChild(styleTag);
        }

        sheetMap[context as StyleContext] = styleTag.sheet as CSSStyleSheet;
      }

      this.styleSheets.set(targetDocument, sheetMap);
    }
  }

  private getDocumentRules(targetDocument: Document): Array<{
    cssText: string;
    context: StyleContext;
  }> {
    const rules: Array<{ cssText: string; context: StyleContext }> = [];
    const styleSheetsMap = this.styleSheets.get(targetDocument);

    if (!styleSheetsMap) return rules;

    // Get rules from all contexts
    for (const [context, sheet] of Object.entries(styleSheetsMap)) {
      Array.from(sheet.cssRules).forEach((rule) => {
        rules.push({ cssText: rule.cssText, context: context as StyleContext });
      });
    }

    return rules;
  }

  public addDocument(targetDocument: Document) {
    if (targetDocument === this.mainDocument) return;

    this.initStyleSheets(targetDocument);
    this.clearStylesFromDocument(targetDocument);

    // Copy rules from main document
    if (this.mainDocument) {
      const mainRules = this.getDocumentRules(this.mainDocument);
      mainRules.forEach(({ cssText, context }) => {
        this.injectRuleToDocument(cssText, context, targetDocument);
      });
    }
  }

  private clearStylesFromDocument(targetDocument: Document) {
    const styleSheetsMap = this.styleSheets.get(targetDocument);
    if (!styleSheetsMap) return;

    for (const sheet of Object.values(styleSheetsMap)) {
      this.clearStyleSheet(sheet);
    }
  }

  private escapeClassName(className: string): string {
    return className.replace(/:/g, '\\:');
  }

  private serverRules: Map<StyleContext, string[]> = new Map();

  public injectRule(cssRule: string, context: StyleContext = 'base') {
    // Inject to main document or cache for server
    if (this.mainDocument) {
      this.injectRuleToDocument(cssRule, context, this.mainDocument);
    } else {
      if (!this.serverRules.has(context)) {
        this.serverRules.set(context, []);
      }
      this.serverRules.get(context)?.push(cssRule);
    }

    // Inject to all other documents
    for (const document of this.getAllRegisteredDocuments()) {
      if (document !== this.mainDocument) {
        this.injectRuleToDocument(cssRule, context, document);
      }
    }
  }

  public getServerStyles(): string {
    const contexts: StyleContext[] = [
      'base',
      'pseudo',
      'media',
      'modifier',
      'override',
    ];
    let css = '';

    contexts.forEach((context) => {
      const rules = this.serverRules.get(context);
      if (rules) {
        css += rules.join('\n') + '\n';
      }
    });

    return css;
  }

  private getAllRegisteredDocuments(): Document[] {
    return Array.from(this.styleSheets.keys());
  }

  private addToCache(
    key: string,
    className: string,
    rules: Array<{ rule: string; context: StyleContext }>
  ) {
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
    // Format value
    let processedValue = ValueUtils.formatValue(value, property, getColor);

    let formattedValue = processedValue.toString().split(' ').join('-');
    let key = `${property}:${formattedValue}`;
    if (modifier && context !== 'base') {
      key = `${property}:${formattedValue}|${context}:${modifier}`;
    }

    // Check cache
    const cached = this.classCache.get(key);
    if (cached) {
      return [cached.className];
    }

    // Get property shorthand
    let shorthand =
      this.propertyShorthand[property] ||
      (property.startsWith('--') ? property : toKebabCase(property));

    // Special handling for vendor-prefixed properties to avoid double hyphens
    if (shorthand.startsWith('-webkit-')) {
      shorthand = 'webkit' + shorthand.substring(8); // Remove the extra hyphen
    } else if (shorthand.startsWith('-moz-')) {
      shorthand = 'moz' + shorthand.substring(5);
    } else if (shorthand.startsWith('-ms-')) {
      shorthand = 'ms' + shorthand.substring(4);
    } else if (shorthand.startsWith('-o-')) {
      shorthand = 'o' + shorthand.substring(3);
    }

    // Normalize the value for class name generation
    let normalizedValue = ValueUtils.normalizeCssValue(formattedValue);

    // Generate class name
    let baseClassName = `${shorthand}-${normalizedValue}`;
    let classNames: string[] = [baseClassName];
    let rules: Array<{ rule: string; context: StyleContext }> = [];

    // Format CSS property name with proper vendor prefix handling
    const cssProperty = propertyToKebabCase(property);
    let valueForCss = processedValue;

    // Handle numeric values for CSS
    if (
      typeof valueForCss === 'number' &&
      numericCssProperties.has(cssProperty)
    ) {
      valueForCss = `${valueForCss}px`;
    }

    // Check if this property needs vendor prefixes
    const needsPrefixes = needsVendorPrefix(property);
    const cssProperties = needsPrefixes
      ? getVendorPrefixedProperties(property)
      : [cssProperty];

    // Generate CSS rules based on context
    if (context === 'pseudo' && modifier) {
      const pseudoClassName = `${baseClassName}--${modifier}`;
      classNames = [pseudoClassName];
      const escapedClassName = this.escapeClassName(pseudoClassName);

      // Format CSS rules for group and peer modifiers
      if (modifier.startsWith('group-')) {
        const groupState = modifier.replace('group-', '');
        cssProperties.forEach((prefixedProperty) => {
          rules.push({
            rule: `.group:${groupState} .${escapedClassName} { ${prefixedProperty}: ${valueForCss}; }`,
            context: 'pseudo',
          });
        });
      } else if (modifier.startsWith('peer-')) {
        const peerState = modifier.replace('peer-', '');
        cssProperties.forEach((prefixedProperty) => {
          rules.push({
            rule: `.peer:${peerState} ~ .${escapedClassName} { ${prefixedProperty}: ${valueForCss}; }`,
            context: 'pseudo',
          });
        });
      } else {
        // Standard pseudo-class
        cssProperties.forEach((prefixedProperty) => {
          rules.push({
            rule: `.${escapedClassName}:${modifier} { ${prefixedProperty}: ${valueForCss}; }`,
            context: 'pseudo',
          });
        });
      }
    } else if (context === 'media' && modifier) {
      const mediaClassName = `${modifier}--${baseClassName}`;
      classNames = [mediaClassName];
      const escapedClassName = this.escapeClassName(mediaClassName);

      mediaQueries.forEach((mq) => {
        // Add media query rules for all necessary vendor prefixes
        cssProperties.forEach((prefixedProperty) => {
          rules.push({
            rule: `@media ${mq} { .${escapedClassName} { ${prefixedProperty}: ${valueForCss}; } }`,
            context: 'media',
          });
        });
      });
    } else {
      const escapedClassName = this.escapeClassName(baseClassName);

      // Add rules for all necessary vendor prefixes
      // Use the passed context (base or override) for proper specificity
      cssProperties.forEach((prefixedProperty) => {
        rules.push({
          rule: `.${escapedClassName} { ${prefixedProperty}: ${valueForCss}; }`,
          context: context === 'override' ? 'override' : 'base',
        });
      });
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
    this.styleSheets.delete(targetDocument);
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
      // For other documents, copy from main document
      this.addDocument(targetDocument);
    }
  }

  public regenerateAllStyles() {
    for (const document of this.getAllRegisteredDocuments()) {
      this.regenerateStyles(document);
    }
  }

  private injectRuleToDocument(
    cssRule: string,
    context: StyleContext,
    targetDocument: Document
  ) {
    const styleSheetsMap = this.styleSheets.get(targetDocument);
    if (!styleSheetsMap) return;

    const styleSheet = styleSheetsMap[context];

    if (styleSheet) {
      try {
        styleSheet.insertRule(cssRule, styleSheet.cssRules.length);
      } catch (e) {
        console.error(`Error inserting CSS rule to document: "${cssRule}"`, e);
      }
    }
  }

  // Debug helper
  public printStyles(targetDocument: Document) {
    console.group('Current styles for document:');

    const styleSheetsMap = this.styleSheets.get(targetDocument);
    if (!styleSheetsMap) {
      console.log('No styles found for this document');
      console.groupEnd();
      return;
    }

    for (const [context, sheet] of Object.entries(styleSheetsMap)) {
      console.group(`${context} styles:`);
      Array.from(sheet.cssRules).forEach((rule, i) => {
        console.log(`${i}: ${rule.cssText}`);
      });
      console.groupEnd();
    }

    console.groupEnd();
  }
}

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

export const propertyShorthand = generatePropertyShorthand(StyleProps);
export const utilityClassManager = new UtilityClassManager(
  propertyShorthand,
  10000
);

/**
 * Process styles for various contexts (base, pseudo, media)
 */
function processStyles(
  styles: Record<string, any>,
  context: StyleContext = 'base',
  modifier: string = '',
  getColor: (color: string) => string,
  mediaQueries: Record<string, string> = {},
  devices: Record<string, string[]> = {},
  manager?: UtilityClassManager
): string[] {
  const classes: string[] = [];
  const activeManager = manager || utilityClassManager;

  // Pre-compute media queries for this modifier (only done once per call)
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

  const keys = Object.keys(styles);
  for (let i = 0; i < keys.length; i++) {
    const value = styles[keys[i]];
    if (value !== undefined && value !== '') {
      const classNames = activeManager.getClassNames(
        keys[i],
        value,
        context,
        modifier,
        getColor,
        mediaQueriesForClass
      );
      classes.push(...classNames);
    }
  }

  return classes;
}

// Add a function to handle nested pseudo-classes
function processPseudoStyles(
  styles: Record<string, any>,
  parentPseudo: string = '',
  getColor: (color: string) => string,
  manager?: UtilityClassManager
): string[] {
  const classes: string[] = [];

  // Process each property in the styles object
  Object.keys(styles).forEach((key) => {
    const value = styles[key];

    // Check if this is a nested pseudo selector (starts with underscore)
    if (key.startsWith('_') && typeof value === 'object') {
      const pseudoName = key.substring(1);
      const pseudo = EVENT_TO_PSEUDO[pseudoName];

      if (pseudo) {
        // Construct the combined pseudo selector
        const combinedPseudo = parentPseudo
          ? `${parentPseudo}::${pseudo}`
          : `${pseudo}`;

        // Process the nested styles with the combined pseudo
        classes.push(
          ...processPseudoStyles(value, combinedPseudo, getColor, manager)
        );
      }
    } else if (typeof value !== 'object' || value === null) {
      // This is a regular CSS property
      if (parentPseudo) {
        // Generate class for the pseudo element/class
        const pseudoClassName = `${key}-${ValueUtils.normalizeCssValue(
          value
        )}-${parentPseudo.replace(/:/g, '-')}`;
        const escapedClassName = pseudoClassName.replace(/[^\w-]/g, '-');

        // Format the value
        const processedValue = ValueUtils.formatValue(value, key, getColor);

        // Create and inject the rule
        const rule = `.${escapedClassName}::${parentPseudo} { ${propertyToKebabCase(
          key
        )}: ${processedValue}; }`;
        (manager || utilityClassManager).injectRule(rule, 'pseudo');

        classes.push(escapedClassName);
      }
    }
  });

  return classes;
}

/**
 * Process event-based styles (hover, focus, etc.)
 */
function processEventStyles(
  eventName: string,
  eventStyles: any,
  getColor: (color: string) => string,
  manager?: UtilityClassManager
): string[] {
  const classes: string[] = [];

  // Handle string shorthand (e.g., _hover: "color-red-500")
  if (typeof eventStyles === 'string') {
    eventStyles = { color: eventStyles };
  }

  // Ensure eventStyles is an object
  if (typeof eventStyles !== 'object' || eventStyles === null) {
    return classes;
  }

  const {
    animate = undefined,
    shadow = undefined,
    ...otherEventStyles
  } = eventStyles;

  // Process animations if present
  if (animate) {
    const animations = Array.isArray(animate) ? animate : [animate];
    const animationStyles = AnimationUtils.processAnimations(
      animations,
      manager
    );
    Object.assign(otherEventStyles, animationStyles);
  }

  // Process shadow if present
  if (shadow !== undefined) {
    let shadowValue: number;

    if (typeof shadow === 'number' && Shadows[shadow] !== undefined) {
      shadowValue = shadow;
    } else if (typeof shadow === 'boolean') {
      shadowValue = shadow ? 2 : 0;
    } else {
      shadowValue = 2;
    }

    if (Shadows[shadowValue]) {
      const { shadowColor, shadowOpacity, shadowOffset, shadowRadius } =
        Shadows[shadowValue];
      const rgb = Color.hex.rgb(shadowColor);
      const rgbaColor = `rgba(${rgb.join(',')}, ${shadowOpacity})`;
      otherEventStyles.boxShadow = `${shadowOffset.height}px ${shadowOffset.width}px ${shadowRadius}px ${rgbaColor}`;
    }
  }

  // Check for nested pseudo selectors
  const nestedPseudos = Object.keys(otherEventStyles).filter(
    (key) => key.startsWith('_') && typeof otherEventStyles[key] === 'object'
  );

  if (nestedPseudos.length > 0) {
    // Handle nested pseudo selectors
    const pseudo = EVENT_TO_PSEUDO[eventName];
    if (pseudo) {
      nestedPseudos.forEach((nestedKey) => {
        const nestedPseudoName = nestedKey.substring(1);
        const nestedPseudo = EVENT_TO_PSEUDO[nestedPseudoName];

        if (nestedPseudo) {
          const combinedPseudo = `${pseudo}::${nestedPseudo}`;
          classes.push(
            ...processPseudoStyles(
              otherEventStyles[nestedKey],
              combinedPseudo,
              getColor,
              manager
            )
          );
        }
      });

      // Remove processed nested pseudos
      nestedPseudos.forEach((key) => {
        delete otherEventStyles[key];
      });
    }
  }

  // Apply remaining styles if we have a valid pseudo-class
  if (Object.keys(otherEventStyles).length > 0) {
    const pseudo = EVENT_TO_PSEUDO[eventName];
    if (pseudo) {
      classes.push(
        ...processStyles(
          otherEventStyles,
          'pseudo',
          pseudo,
          getColor,
          {},
          {},
          manager
        )
      );
    }
  }

  return classes;
}

export const extractUtilityClasses = (
  props: ElementProps,
  getColor: (color: string) => string,
  mediaQueries: Record<string, string>,
  devices: Record<string, string[]>,
  manager?: UtilityClassManager
): string[] => {
  const classes: string[] = [];
  const computedStyles: Record<string, any> = {};
  const activeManager = manager || utilityClassManager;

  // Handle widthHeight (shorthand for both width and height)
  if (
    props.widthHeight ||
    (props.height !== undefined &&
      props.width !== undefined &&
      props.height === props.width)
  ) {
    const widthHeightValue = props.widthHeight || props.width;
    const formattedValue =
      typeof widthHeightValue === 'number'
        ? `${widthHeightValue}px`
        : widthHeightValue;
    computedStyles.width = formattedValue;
    computedStyles.height = formattedValue;
  }

  // Handle padding and margin shorthands (inlined to avoid Object.entries overhead)
  const ph = (props as any).paddingHorizontal;
  if (ph !== undefined) {
    const v = typeof ph === 'number' ? `${ph}px` : ph;
    computedStyles.paddingLeft = v;
    computedStyles.paddingRight = v;
  }
  const pv = (props as any).paddingVertical;
  if (pv !== undefined) {
    const v = typeof pv === 'number' ? `${pv}px` : pv;
    computedStyles.paddingTop = v;
    computedStyles.paddingBottom = v;
  }
  const mh = (props as any).marginHorizontal;
  if (mh !== undefined) {
    const v = typeof mh === 'number' ? `${mh}px` : mh;
    computedStyles.marginLeft = v;
    computedStyles.marginRight = v;
  }
  const mv = (props as any).marginVertical;
  if (mv !== undefined) {
    const v = typeof mv === 'number' ? `${mv}px` : mv;
    computedStyles.marginTop = v;
    computedStyles.marginBottom = v;
  }

  // Handle shadows
  if (props.shadow !== undefined) {
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
    Object.assign(
      computedStyles,
      AnimationUtils.processAnimations(animations, manager)
    );
  }

  // Handle default blend
  if (props.blend === true) {
    if ((props as any).bgColor) {
      computedStyles.mixBlendMode = 'overlay';
      computedStyles.color = 'white';
    } else {
      computedStyles.mixBlendMode = 'difference';
      computedStyles.color = 'white';
    }
  }

  // Process base computed styles
  classes.push(
    ...processStyles(computedStyles, 'base', '', getColor, {}, {}, manager)
  );

  // SINGLE PASS over props: classify each prop into style, event, or underscore
  const propKeys = Object.keys(props);
  for (let i = 0; i < propKeys.length; i++) {
    const property = propKeys[i];
    const value = (props as any)[property];

    // Handle underscore-prefixed event properties (_hover, _focus, etc.)
    if (property.charCodeAt(0) === 95 && property.length > 1) {
      // 95 = '_'
      const eventName = property.substring(1);
      classes.push(...processEventStyles(eventName, value, getColor, manager));

      // Handle blend for underscore props
      if (props.blend === true && value?.color === undefined) {
        if ((props as any).bgColor) {
          value.mixBlendMode = 'overlay';
          value.color = 'white';
        } else {
          value.mixBlendMode = 'difference';
          value.color = 'white';
        }
      }
      continue;
    }

    // Skip non-style props
    if (property === 'style' || property === 'css') continue;

    if (property === 'on') {
      // Process event-based styles
      if (typeof value === 'object' && value !== null) {
        const events = Object.keys(value);
        for (let j = 0; j < events.length; j++) {
          classes.push(
            ...processEventStyles(
              events[j],
              value[events[j]],
              getColor,
              manager
            )
          );
        }

        // Handle blend for 'on' prop
        if (props.blend === true && value?.color === undefined) {
          if ((props as any).bgColor) {
            value.mixBlendMode = 'overlay';
            value.color = 'white';
          } else {
            value.mixBlendMode = 'difference';
            value.color = 'white';
          }
        }
      }
      continue;
    }

    if (property === 'media') {
      // Process media query styles
      if (typeof value === 'object' && value !== null) {
        const screens = Object.keys(value);
        for (let j = 0; j < screens.length; j++) {
          classes.push(
            ...processStyles(
              value[screens[j]],
              'media',
              screens[j],
              getColor,
              mediaQueries,
              devices,
              manager
            )
          );
        }

        // Handle blend for 'media' prop
        if (props.blend === true && value?.color === undefined) {
          if ((props as any).bgColor) {
            value.mixBlendMode = 'overlay';
            value.color = 'white';
          } else {
            value.mixBlendMode = 'difference';
            value.color = 'white';
          }
        }
      }
      continue;
    }

    // Standard style props
    if (isStyleProp(property)) {
      if (value !== undefined && value !== '') {
        if (typeof value === 'object' && value !== null) {
          // Object-style props are not directly processed as base styles
          continue;
        }
        classes.push(
          ...activeManager.getClassNames(
            property,
            value,
            'base',
            '',
            getColor,
            []
          )
        );
      }
    }
  }

  // Handle raw CSS - uses 'override' context for higher specificity
  if (props.css) {
    if (typeof props.css === 'object') {
      classes.push(
        ...processStyles(props.css, 'override', '', getColor, {}, {}, manager)
      );
    } else if (typeof props.css === 'string') {
      const uniqueClassName = ValueUtils.generateUniqueClassName(props.css);
      activeManager.injectRule(
        `.${uniqueClassName} { ${props.css} }`,
        'override'
      );
      classes.push(uniqueClassName);
    }
  }

  return classes;
};
