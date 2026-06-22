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

type StyleContext =
  | 'base-shorthand'
  | 'base-side'
  | 'base-cross'
  | 'base'
  | 'pseudo'
  | 'media'
  | 'container'
  | 'modifier'
  | 'override-shorthand'
  | 'override-side'
  | 'override-cross'
  | 'override';

// Top-level CSS shorthands that reset a wide set of longhands on conflict.
// Rules for these properties are injected into a stylesheet that appears
// FIRST in the document, so longhand overrides written later in source order
// win the cascade regardless of which element first instantiated each class.
const TIER2_SHORTHANDS = new Set<string>([
  'all',
  'background',
  'border',
  'borderRadius',
  'font',
  'margin',
  'padding',
  'animation',
  'transition',
  'flex',
  'grid',
  'gridTemplate',
  'gridArea',
  'outline',
  'inset',
  'gap',
  'gridGap',
  'listStyle',
  'textDecoration',
  'placeItems',
  'placeContent',
  'placeSelf',
  'overflow',
  'mask',
  'columns',
  'columnRule',
]);

// Side-shorthands: target a single side of the box and override tier-2
// shorthands for that side. Example: `borderTop` overrides the top piece of
// `border`. They MUST cascade before tier-4 cross-property shorthands so
// that `borderColor` wins the per-side color slot when both are written.
const TIER3_SIDE_SHORTHANDS = new Set<string>([
  'borderTop',
  'borderRight',
  'borderBottom',
  'borderLeft',
]);

// Cross-property shorthands: span all sides for one CSS property and reset
// the per-side longhands. Example: `borderColor` resets all four
// `border-*-color` longhands. These intersect with side-shorthands at
// `border-{side}-{prop}` (e.g. `border-top-color`), so they must cascade
// AFTER side-shorthands to win that intersection.
const TIER4_CROSS_SHORTHANDS = new Set<string>([
  'borderColor',
  'borderStyle',
  'borderWidth',
  'borderImage',
]);

function baseContextForProperty(property: string): StyleContext {
  if (TIER2_SHORTHANDS.has(property)) return 'base-shorthand';
  if (TIER3_SIDE_SHORTHANDS.has(property)) return 'base-side';
  if (TIER4_CROSS_SHORTHANDS.has(property)) return 'base-cross';
  return 'base';
}

function overrideContextForProperty(property: string): StyleContext {
  if (TIER2_SHORTHANDS.has(property)) return 'override-shorthand';
  if (TIER3_SIDE_SHORTHANDS.has(property)) return 'override-side';
  if (TIER4_CROSS_SHORTHANDS.has(property)) return 'override-cross';
  return 'override';
}

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
  // Browser-specific pseudo-classes for form-control polish
  webkitAutofill: '-webkit-autofill',
  webkitContactsAutoFillButton: '-webkit-contacts-auto-fill-button',
  webkitInnerSpinButton: '-webkit-inner-spin-button',
  webkitOuterSpinButton: '-webkit-outer-spin-button',
  webkitSearchCancelButton: '-webkit-search-cancel-button',
  mozPlaceholder: '-moz-placeholder',
  mozFocusInner: '-moz-focus-inner',
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

// Reverse map: pseudo-class/element name -> app-studio event prop, used only to
// produce a helpful suggestion in the dev-mode css selector warning below.
const PSEUDO_TO_EVENT: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const event of Object.keys(EVENT_TO_PSEUDO)) {
    map[EVENT_TO_PSEUDO[event]] = event;
  }
  return map;
})();

// Tracks css objects already warned about, so a re-render doesn't spam the console.
const warnedCssObjects = new WeakSet<object>();

/**
 * Dev-only guardrail. App-Studio has no nested CSS selectors — keys like
 * `&:hover`, `& > div`, or `@media (...)` inside a `css` prop are silently
 * ignored. Warn (once per object) and point to the correct prop. Stripped from
 * production builds via the `process.env.NODE_ENV` guard at the call site.
 */
function warnOnCssSelectors(css: Record<string, any>): void {
  if (warnedCssObjects.has(css)) return;
  for (const key of Object.keys(css)) {
    // Selector-ish keys: parent ref (&), combinators (>, +, ~, space),
    // pseudo (:), or at-rules (@media / @container / @supports).
    const isSelector =
      key.includes('&') ||
      key.startsWith('@') ||
      key.includes(':') ||
      /[>+~]/.test(key) ||
      /\s/.test(key.trim());
    if (!isSelector) continue;

    warnedCssObjects.add(css);

    if (key.startsWith('@media') || key.startsWith('@container')) {
      console.warn(
        `[app-studio] The css prop does not support "${key}". ` +
          `App-Studio has no nested selectors. Use the \`media\` prop for ` +
          `responsive styles, e.g. media={{ mobile: { ... } }}.`
      );
      return;
    }

    const pseudoMatch = key.match(/:{1,2}([a-z-]+)/i);
    const pseudo = pseudoMatch ? pseudoMatch[1].toLowerCase() : '';
    const event = PSEUDO_TO_EVENT[pseudo];
    const suggestion = event
      ? `Use the \`_${event}\` prop (or on={{ ${event}: { ... } }}) instead, ` +
        `e.g. _${event}={{ ... }}.`
      : `Use the matching underscore prop (e.g. _hover={{ ... }}) or ` +
        `on={{ ... }} map instead.`;

    console.warn(
      `[app-studio] The css prop does not support nested selectors like "${key}" — ` +
        `it is silently ignored. ${suggestion} ` +
        `The css prop is only for raw CSS values / CSS variables.`
    );
    return;
  }
}

/**
 * Pseudo-elements require the `::` prefix, pseudo-classes require `:`.
 * `EVENT_TO_PSEUDO` mixes both, so we centralize the distinction here.
 */
const PSEUDO_ELEMENTS = new Set<string>([
  'before',
  'after',
  'first-letter',
  'first-line',
  'placeholder',
  'selection',
  'backdrop',
  'marker',
  '-moz-placeholder',
  '-moz-focus-inner',
  '-webkit-contacts-auto-fill-button',
  '-webkit-inner-spin-button',
  '-webkit-outer-spin-button',
  '-webkit-search-cancel-button',
]);

const isPseudoElement = (pseudo: string): boolean =>
  PSEUDO_ELEMENTS.has(pseudo);

const pseudoPrefix = (pseudo: string): string =>
  isPseudoElement(pseudo) ? '::' : ':';

/**
 * Build a complete pseudo selector string (e.g. `:focus::placeholder`) from
 * a chain of pseudo identifiers joined with `::`. Each part is prefixed with
 * `:` or `::` depending on whether it is a pseudo-class or pseudo-element.
 */
const buildPseudoSelector = (chain: string): string =>
  chain
    .split('::')
    .filter(Boolean)
    .map((part) => `${pseudoPrefix(part)}${part}`)
    .join('');

/**
 * Convert a viewport media-query string into a CSS container-query condition.
 *
 * `getMediaQueries` emits strings like `only screen and (min-width: 560px) and
 * (max-width: 1079px)`. Container queries (`@container`) take only the feature
 * conditions, so we strip the leading media-type (`only screen` / `screen`) and
 * the connecting `and`. The numeric `(min-width|max-width)` features are valid
 * inside `@container` (resolved against the container's inline size).
 *
 * Falls back to `(min-width: 0px)` (always-true) when no condition remains —
 * e.g. a single-breakpoint config where the query is just `only screen`.
 */
const toContainerCondition = (mediaQuery: string): string => {
  const condition = mediaQuery
    .replace(/^\s*only\s+screen\s*/i, '')
    .replace(/^\s*screen\s*/i, '')
    .replace(/^\s*and\s+/i, '')
    .trim();
  return condition || '(min-width: 0px)';
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
      // Order matters: <style> tags are appended to <head> in the order
      // listed here, and the cascade resolves equal-specificity rules by
      // source order. Earlier entries cascade FIRST (lower priority), so
      // top-level shorthands like `border` are listed before their
      // sub-shorthands and longhands.
      const contextIds: Record<StyleContext, string> = {
        'base-shorthand': 'utility-classes-base-shorthand',
        'base-side': 'utility-classes-base-side',
        'base-cross': 'utility-classes-base-cross',
        base: 'utility-classes-base',
        pseudo: 'utility-classes-pseudo',
        media: 'utility-classes-media',
        container: 'utility-classes-container',
        modifier: 'utility-classes-modifier',
        'override-shorthand': 'utility-classes-override-shorthand',
        'override-side': 'utility-classes-override-side',
        'override-cross': 'utility-classes-override-cross',
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
      'base-shorthand',
      'base-side',
      'base-cross',
      'base',
      'pseudo',
      'media',
      'container',
      'modifier',
      'override-shorthand',
      'override-side',
      'override-cross',
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
    mediaQueries: string[] = [],
    containerQuery: boolean = false
  ): string[] {
    // Format value
    let processedValue = ValueUtils.formatValue(value, property, getColor);

    let formattedValue = processedValue.toString().split(' ').join('-');
    let key = `${property}:${formattedValue}`;
    if (modifier && context !== 'base') {
      key = `${property}:${formattedValue}|${context}:${modifier}`;
      // Container-query variants compile to different CSS (@container vs
      // @media) and a different class name, so they need a distinct cache key.
      if (containerQuery && context === 'media') {
        key += '|cq';
      }
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
    if (typeof valueForCss === 'number') {
      // lineHeight
      if (property === 'lineHeight' && Number.isInteger(valueForCss)) {
        // Keep as unitless
      } else if (numericCssProperties.has(cssProperty)) {
        valueForCss = `${valueForCss}px`;
      }
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
        // Standard pseudo-class or pseudo-element. Pseudo-elements like
        // `placeholder`, `before`, `selection` require `::` while
        // pseudo-classes like `focus`, `hover` require `:`.
        const colon = pseudoPrefix(modifier);
        cssProperties.forEach((prefixedProperty) => {
          rules.push({
            rule: `.${escapedClassName}${colon}${modifier} { ${prefixedProperty}: ${valueForCss}; }`,
            context: 'pseudo',
          });
        });
      }
    } else if (context === 'media' && modifier && containerQuery) {
      // Container-scoped responsive styles. The `cq-` prefix keeps these
      // classes distinct from their viewport `@media` counterparts so both can
      // coexist for the same property/value. Rules are unnamed `@container`
      // queries, which resolve against the nearest ancestor that established a
      // containment context (rendered by <Responsive container>).
      const containerClassName = `cq-${modifier}--${baseClassName}`;
      classNames = [containerClassName];
      const escapedClassName = this.escapeClassName(containerClassName);

      mediaQueries.forEach((mq) => {
        const condition = toContainerCondition(mq);
        cssProperties.forEach((prefixedProperty) => {
          rules.push({
            rule: `@container ${condition} { .${escapedClassName} { ${prefixedProperty}: ${valueForCss}; } }`,
            context: 'container',
          });
        });
      });
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

      // Add rules for all necessary vendor prefixes.
      // Route to a tiered sheet (shorthand → sub → longhand) within the
      // passed context (base or override), so shorthand properties cascade
      // BEFORE their longhands regardless of which element first
      // instantiated each utility class.
      const tier =
        context === 'override'
          ? overrideContextForProperty(property)
          : baseContextForProperty(property);
      cssProperties.forEach((prefixedProperty) => {
        rules.push({
          rule: `.${escapedClassName} { ${prefixedProperty}: ${valueForCss}; }`,
          context: tier,
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
  manager?: UtilityClassManager,
  containerQuery: boolean = false
): string[] {
  const classes: string[] = [];
  const activeManager = manager || utilityClassManager;

  // Pre-compute media queries for this modifier (only done once per call)
  let mediaQueriesForClass: string[] = [];
  if (context === 'media') {
    if (mediaQueries[modifier]) {
      mediaQueriesForClass = [mediaQueries[modifier]];
    } else if (devices[modifier]) {
      mediaQueriesForClass = devices[modifier].flatMap((mq) =>
        mediaQueries[mq] ? [mediaQueries[mq]] : []
      );
    }
  }

  const expandedStyles = expandShorthandStyles(styles);

  const keys = Object.keys(expandedStyles);
  for (let i = 0; i < keys.length; i++) {
    const value = expandedStyles[keys[i]];
    if (value !== undefined && value !== '') {
      const classNames = activeManager.getClassNames(
        keys[i],
        value,
        context,
        modifier,
        getColor,
        mediaQueriesForClass,
        containerQuery
      );
      classes.push(...classNames);
    }
  }

  return classes;
}

/**
 * Expand shorthand props (widthHeight, paddingHorizontal, marginVertical, ...)
 * into their canonical CSS properties. Returns a new object so the caller's
 * input is not mutated. Keeps unknown shorthands only if their value is set.
 */
function expandShorthandStyles(
  styles: Record<string, any>
): Record<string, any> {
  const wh = styles.widthHeight;
  const ph = styles.paddingHorizontal;
  const pv = styles.paddingVertical;
  const mh = styles.marginHorizontal;
  const mv = styles.marginVertical;

  if (
    wh === undefined &&
    ph === undefined &&
    pv === undefined &&
    mh === undefined &&
    mv === undefined
  ) {
    return styles;
  }

  const out: Record<string, any> = {};
  const keys = Object.keys(styles);
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if (
      k === 'widthHeight' ||
      k === 'paddingHorizontal' ||
      k === 'paddingVertical' ||
      k === 'marginHorizontal' ||
      k === 'marginVertical'
    ) {
      continue;
    }
    out[k] = styles[k];
  }

  if (wh !== undefined) {
    const v = typeof wh === 'number' ? `${wh}px` : wh;
    if (out.width === undefined) out.width = v;
    if (out.height === undefined) out.height = v;
  }
  if (ph !== undefined) {
    const v = typeof ph === 'number' ? `${ph}px` : ph;
    if (out.paddingLeft === undefined) out.paddingLeft = v;
    if (out.paddingRight === undefined) out.paddingRight = v;
  }
  if (pv !== undefined) {
    const v = typeof pv === 'number' ? `${pv}px` : pv;
    if (out.paddingTop === undefined) out.paddingTop = v;
    if (out.paddingBottom === undefined) out.paddingBottom = v;
  }
  if (mh !== undefined) {
    const v = typeof mh === 'number' ? `${mh}px` : mh;
    if (out.marginLeft === undefined) out.marginLeft = v;
    if (out.marginRight === undefined) out.marginRight = v;
  }
  if (mv !== undefined) {
    const v = typeof mv === 'number' ? `${mv}px` : mv;
    if (out.marginTop === undefined) out.marginTop = v;
    if (out.marginBottom === undefined) out.marginBottom = v;
  }

  return out;
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

        // Create and inject the rule. The parentPseudo chain may contain
        // a mix of pseudo-classes (`:focus`) and pseudo-elements
        // (`::placeholder`); buildPseudoSelector prefixes each part with the
        // correct colon count.
        const rule = `.${escapedClassName}${buildPseudoSelector(
          parentPseudo
        )} { ${propertyToKebabCase(key)}: ${processedValue}; }`;
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
  manager?: UtilityClassManager,
  containerQuery: boolean = false
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

  if (props.lineHeight) {
    const lh = props.lineHeight as string | number;
    if (typeof lh === 'number') {
      computedStyles.lineHeight = `${lh.toFixed(0)}px`;
    } else if (lh.indexOf('px') === -1) {
      const numericValue = parseFloat(lh);
      if (!isNaN(numericValue) && Number.isInteger(numericValue)) {
        computedStyles.lineHeight = `${numericValue.toFixed(0)}px`;
      } else {
        computedStyles.lineHeight = lh;
      }
    }
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
              manager,
              containerQuery
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
      if (process.env.NODE_ENV !== 'production') {
        warnOnCssSelectors(props.css);
      }
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
