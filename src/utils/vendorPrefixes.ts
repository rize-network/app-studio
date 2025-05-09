/**
 * Mapping of standard CSS properties to their vendor-prefixed equivalents.
 * This helps ensure cross-browser compatibility by automatically applying
 * the appropriate vendor prefixes when needed.
 */

// Properties that commonly need vendor prefixes across browsers
export const vendorPrefixedProperties: Record<string, string[]> = {
  // Animation properties
  animation: ['-webkit-animation', '-moz-animation', '-o-animation'],
  animationDelay: [
    '-webkit-animation-delay',
    '-moz-animation-delay',
    '-o-animation-delay',
  ],
  animationDirection: [
    '-webkit-animation-direction',
    '-moz-animation-direction',
    '-o-animation-direction',
  ],
  animationDuration: [
    '-webkit-animation-duration',
    '-moz-animation-duration',
    '-o-animation-duration',
  ],
  animationFillMode: [
    '-webkit-animation-fill-mode',
    '-moz-animation-fill-mode',
    '-o-animation-fill-mode',
  ],
  animationIterationCount: [
    '-webkit-animation-iteration-count',
    '-moz-animation-iteration-count',
    '-o-animation-iteration-count',
  ],
  animationName: [
    '-webkit-animation-name',
    '-moz-animation-name',
    '-o-animation-name',
  ],
  animationPlayState: [
    '-webkit-animation-play-state',
    '-moz-animation-play-state',
    '-o-animation-play-state',
  ],
  animationTimingFunction: [
    '-webkit-animation-timing-function',
    '-moz-animation-timing-function',
    '-o-animation-timing-function',
  ],

  // Transform properties
  transform: [
    '-webkit-transform',
    '-moz-transform',
    '-ms-transform',
    '-o-transform',
  ],
  transformOrigin: [
    '-webkit-transform-origin',
    '-moz-transform-origin',
    '-ms-transform-origin',
    '-o-transform-origin',
  ],
  transformStyle: [
    '-webkit-transform-style',
    '-moz-transform-style',
    '-ms-transform-style',
  ],

  // Transition properties
  transition: [
    '-webkit-transition',
    '-moz-transition',
    '-ms-transition',
    '-o-transition',
  ],
  transitionDelay: [
    '-webkit-transition-delay',
    '-moz-transition-delay',
    '-ms-transition-delay',
    '-o-transition-delay',
  ],
  transitionDuration: [
    '-webkit-transition-duration',
    '-moz-transition-duration',
    '-ms-transition-duration',
    '-o-transition-duration',
  ],
  transitionProperty: [
    '-webkit-transition-property',
    '-moz-transition-property',
    '-ms-transition-property',
    '-o-transition-property',
  ],
  transitionTimingFunction: [
    '-webkit-transition-timing-function',
    '-moz-transition-timing-function',
    '-ms-transition-timing-function',
    '-o-transition-timing-function',
  ],

  // Flexbox properties
  flex: ['-webkit-flex', '-ms-flex'],
  flexBasis: ['-webkit-flex-basis', '-ms-flex-basis'],
  flexDirection: ['-webkit-flex-direction', '-ms-flex-direction'],
  flexFlow: ['-webkit-flex-flow', '-ms-flex-flow'],
  flexGrow: ['-webkit-flex-grow', '-ms-flex-positive'],
  flexShrink: ['-webkit-flex-shrink', '-ms-flex-negative'],
  flexWrap: ['-webkit-flex-wrap', '-ms-flex-wrap'],
  justifyContent: ['-webkit-justify-content', '-ms-flex-pack'],
  alignItems: ['-webkit-align-items', '-ms-flex-align'],
  alignContent: ['-webkit-align-content', '-ms-flex-line-pack'],
  alignSelf: ['-webkit-align-self', '-ms-flex-item-align'],
  order: ['-webkit-order', '-ms-flex-order'],

  // Other commonly prefixed properties
  appearance: ['-webkit-appearance', '-moz-appearance', '-ms-appearance'],
  backfaceVisibility: [
    '-webkit-backface-visibility',
    '-moz-backface-visibility',
  ],
  backgroundClip: ['-webkit-background-clip', '-moz-background-clip'],
  backgroundOrigin: ['-webkit-background-origin', '-moz-background-origin'],
  backgroundSize: [
    '-webkit-background-size',
    '-moz-background-size',
    '-o-background-size',
  ],
  borderImage: ['-webkit-border-image', '-moz-border-image', '-o-border-image'],
  boxShadow: ['-webkit-box-shadow', '-moz-box-shadow'],
  boxSizing: ['-webkit-box-sizing', '-moz-box-sizing'],
  columns: ['-webkit-columns', '-moz-columns'],
  columnCount: ['-webkit-column-count', '-moz-column-count'],
  columnGap: ['-webkit-column-gap', '-moz-column-gap'],
  columnRule: ['-webkit-column-rule', '-moz-column-rule'],
  columnWidth: ['-webkit-column-width', '-moz-column-width'],
  filter: ['-webkit-filter'],
  fontSmoothing: ['-webkit-font-smoothing', '-moz-osx-font-smoothing'],
  hyphens: ['-webkit-hyphens', '-moz-hyphens', '-ms-hyphens'],
  maskImage: ['-webkit-mask-image'],
  perspective: ['-webkit-perspective', '-moz-perspective'],
  perspectiveOrigin: ['-webkit-perspective-origin', '-moz-perspective-origin'],
  textSizeAdjust: [
    '-webkit-text-size-adjust',
    '-moz-text-size-adjust',
    '-ms-text-size-adjust',
  ],
  userSelect: ['-webkit-user-select', '-moz-user-select', '-ms-user-select'],

  // Special webkit-only properties
  textFillColor: ['-webkit-text-fill-color'],
  textStroke: ['-webkit-text-stroke'],
  textStrokeColor: ['-webkit-text-stroke-color'],
  textStrokeWidth: ['-webkit-text-stroke-width'],
  tapHighlightColor: ['-webkit-tap-highlight-color'],
  touchCallout: ['-webkit-touch-callout'],
  userDrag: ['-webkit-user-drag'],
  lineClamp: ['-webkit-line-clamp'],
  overflowScrolling: ['-webkit-overflow-scrolling'],
};

// Convert camelCase property names to kebab-case
export const camelToKebabCase = (property: string): string => {
  return property.replace(/([A-Z])/g, '-$1').toLowerCase();
};

// Get all vendor prefixed versions of a property in kebab-case
export const getVendorPrefixedProperties = (property: string): string[] => {
  const kebabProperty = camelToKebabCase(property);
  const prefixedProperties = vendorPrefixedProperties[property] || [];

  // Return the standard property along with all vendor-prefixed versions
  return [kebabProperty, ...prefixedProperties];
};

// Check if a property needs vendor prefixes
export const needsVendorPrefix = (property: string): boolean => {
  return property in vendorPrefixedProperties;
};
