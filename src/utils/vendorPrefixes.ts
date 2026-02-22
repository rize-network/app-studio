/**
 * Mapping of standard CSS properties to their vendor-prefixed equivalents.
 *
 * Optimized for modern browsers (Chrome 100+, Safari 15+, Firefox 91+).
 * Most properties no longer need vendor prefixes in these browsers.
 * Only -webkit- prefixes are kept where still needed by Safari/WebKit.
 *
 * Removed prefixes:
 * - -moz- (Firefox 91+ supports all standard properties unprefixed)
 * - -ms- (IE/Edge Legacy no longer supported)
 * - -o- (Opera uses Blink engine, same as Chrome)
 * - -webkit- for animation, transform, transition, flexbox, boxShadow,
 *   boxSizing, columns, borderImage, backgroundSize, backgroundOrigin,
 *   perspective, hyphens (all unprefixed in Safari 15+)
 */

// Properties that still need vendor prefixes in modern browsers
export const vendorPrefixedProperties: Record<string, string[]> = {
  // Properties that still need -webkit- in Safari
  backgroundClip: ['-webkit-background-clip'],
  maskImage: ['-webkit-mask-image'],

  // Webkit-only properties (no unprefixed equivalent)
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
