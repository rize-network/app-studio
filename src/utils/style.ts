// styleHelpers.ts
import { extraKeys, includeKeys, NumberProps } from './constants';
import { vendorPrefixToKebabCase, numericCssProperties } from './cssProperties';
import { hasColorToken, replaceColorTokens } from './colors';

/**
 * Converts a camelCase property to kebab-case with proper vendor prefix handling
 *
 * @param property The property name in camelCase
 * @returns The property name in kebab-case with appropriate vendor prefixes
 */
export function propertyToKebabCase(property: string): string {
  return vendorPrefixToKebabCase(property);
}

// Comprehensive list of CSS properties that should be converted to classes
// NOTE: Uses a static set instead of document.createElement('div').style
// to avoid DOM access at module load time (breaks SSR, adds startup overhead).
// The manual list below is comprehensive and covers all commonly used CSS properties.
const cssProperties = new Set([
  // Box model
  'margin',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'marginHorizontal',
  'marginVertical',
  'padding',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'paddingHorizontal',
  'paddingVertical',
  'width',
  'height',
  'minWidth',
  'minHeight',
  'maxWidth',
  'maxHeight',

  // Positioning
  'position',
  'top',
  'right',
  'bottom',
  'left',
  'zIndex',

  // Flexbox
  'flex',
  'flexDirection',
  'flexWrap',
  'flexFlow',
  'justifyContent',
  'alignItems',
  'alignContent',
  'alignSelf',
  'order',
  'flexGrow',
  'flexShrink',
  'flexBasis',

  // Grid
  'gridTemplateColumns',
  'gridTemplateRows',
  'gridTemplate',
  'gridAutoColumns',
  'gridAutoRows',
  'gridAutoFlow',
  'gridArea',
  'gridColumn',
  'gridRow',
  'gap',
  'gridGap',
  'rowGap',
  'columnGap',

  // Typography
  'fontFamily',
  'fontSize',
  'fontWeight',
  'lineHeight',
  'letterSpacing',
  'textAlign',
  'textDecoration',
  'textTransform',
  'whiteSpace',
  'wordBreak',
  'wordSpacing',
  'wordWrap',

  // Colors and Backgrounds
  'color',
  'backgroundColor',
  'background',
  'backgroundImage',
  'backgroundSize',
  'backgroundPosition',
  'backgroundRepeat',
  'backgroundClip',
  'textFillColor',
  'WebkitTextFillColor',
  'WebkitBackgroundClip',
  'WebkitTextStroke',
  'WebkitTextStrokeColor',
  'WebkitTextStrokeWidth',
  'WebkitTextStrokeStyle',
  'opacity',

  // Borders
  'border',
  'borderWidth',
  'borderStyle',
  'borderColor',
  'borderRadius',
  'borderTop',
  'borderRight',
  'borderBottom',
  'borderLeft',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomLeftRadius',
  'borderBottomRightRadius',

  // Effects
  'boxShadow',
  'textShadow',
  'transform',
  'transition',
  'animation',
  'animationName',
  'animationDuration',
  'animationTimingFunction',
  'animationDelay',
  'animationIterationCount',
  'animationDirection',
  'animationFillMode',
  'animationPlayState',
  // Scroll-driven animation properties (CSS Scroll-Driven Animations spec)
  'animationTimeline',
  'animationRange',
  'animationRangeStart',
  'animationRangeEnd',
  'scrollTimeline',
  'scrollTimelineName',
  'scrollTimelineAxis',
  'viewTimeline',
  'viewTimelineName',
  'viewTimelineAxis',
  'viewTimelineInset',
  'filter',
  'backdropFilter',
  'mixBlendMode',

  // Layout
  'display',
  'visibility',
  'overflow',
  'overflowX',
  'overflowY',
  'float',
  'clear',
  'objectFit',
  'objectPosition',

  // Interactivity
  'cursor',
  'pointerEvents',
  'userSelect',
  'resize',

  // Custom properties
  'widthHeight',
  'shadow',

  // Additional properties from cssExtraProps
  'textJustify',
  'lineClamp',
  'textIndent',
  'perspective',
]);

// Function to set the widthHeight of the element
export const setSize = (
  newSize: string | number,
  styleProps: Record<string, any>
) => {
  styleProps.height = styleProps.width = newSize;
};

// Common React event handlers that should not be treated as style props
const commonEventHandlers = new Set([
  'onClick',
  'onChange',
  'onSubmit',
  'onFocus',
  'onBlur',
  'onKeyDown',
  'onKeyUp',
  'onKeyPress',
  'onMouseDown',
  'onMouseUp',
  'onMouseMove',
  'onMouseEnter',
  'onMouseLeave',
  'onTouchStart',
  'onTouchEnd',
  'onTouchMove',
  'onScroll',
  'onWheel',
  'onDrag',
  'onDragStart',
  'onDragEnd',
  'onDrop',
]);

// Cache for CSS.supports results to avoid repeated DOM queries
const cssSupportCache = new Map<string, boolean>();

// Non-hyphenated HTML/SVG attributes that must never be treated as style props.
// Hyphenated attributes (aria-*, data-*, etc.) are caught by a prefix/hyphen check below.
const htmlOnlyAttributes = new Set([
  // Accessibility
  'role',
  'tabIndex',

  // Global HTML attributes
  'id',
  'title',
  'lang',
  'dir',
  'hidden',
  'draggable',
  'contentEditable',
  'spellCheck',
  'nonce',
  'slot',
  'is',
  'inputMode',
  'enterKeyHint',
  'autofocus',
  'autoFocus',
  'translate',

  // Form attributes
  'autoComplete',
  'name',
  'disabled',
  'readOnly',
  'required',
  'checked',
  'selected',
  'multiple',
  'value',
  'defaultValue',
  'defaultChecked',
  'placeholder',
  'htmlFor',
  'type',
  'accept',
  'maxLength',
  'minLength',
  'pattern',
  'noValidate',
  'formAction',
  'formEncType',
  'formMethod',
  'formNoValidate',
  'formTarget',

  // Link/navigation attributes
  'href',
  'target',
  'rel',
  'download',
  'referrerPolicy',
  'integrity',
  'crossOrigin',

  // Form container attributes
  'action',
  'method',
  'encType',

  // Media attributes
  'autoPlay',
  'controls',
  'loop',
  'muted',
  'playsInline',
  'poster',
  'preload',
  'mediaGroup',

  // Image/embed attributes
  'loading',
  'decoding',
  'sizes',
  'srcDoc',
  'srcLang',
  'srcSet',
  'useMap',

  // Table attributes
  'colSpan',
  'rowSpan',
  'cols',
  'rows',
  'headers',
  'scope',
  'span',

  // Iframe/embed attributes
  'sandbox',
  'allowFullScreen',
  'frameBorder',
  'scrolling',
  'seamless',
  'allow',

  // Interactive attributes
  'open',
  'cite',
  'dateTime',
  'reversed',
  'start',
  'high',
  'low',
  'optimum',
  'wrap',
  'shape',
  'size',
  'summary',

  // Script/resource attributes
  'async',
  'defer',
  'noModule',
  'charSet',
  'httpEquiv',
  'manifest',

  // Microdata/RDFa attributes
  'about',
  'datatype',
  'inlist',
  'prefix',
  'property',
  'resource',
  'typeof',
  'vocab',
  'itemProp',
  'itemScope',
  'itemType',
  'itemID',
  'itemRef',

  // Deprecated but still used
  'classID',
  'contextMenu',
  'keyParams',
  'keyType',
  'kind',
  'label',
  'list',
  'profile',
  'radioGroup',
  'wmode',
  'capture',
  'challenge',
  'scoped',
  'step',
  'form',

  // SVG-only attributes (not CSS properties)
  'viewBox',
  'preserveAspectRatio',
  'xmlns',
  'xlinkHref',
  'xmlBase',
  'xmlLang',
  'xmlSpace',
  'd',
  'pathLength',
  'points',
  'markerEnd',
  'markerMid',
  'markerStart',
  'clipPathUnits',
  'gradientUnits',
  'gradientTransform',
  'patternUnits',
  'patternTransform',
  'patternContentUnits',
  'spreadMethod',
  'startOffset',
  'stdDeviation',
  'stitchTiles',
  'surfaceScale',
  'textLength',
  'lengthAdjust',
  'maskUnits',
  'maskContentUnits',
  'filterUnits',
  'primitiveUnits',
  'numOctaves',
  'baseFrequency',
  'seed',
  'result',
  'in2',
  'values',
  'keyTimes',
  'keySplines',
  'repeatCount',
  'repeatDur',
  'calcMode',
  'attributeName',
  'attributeType',
  'begin',
  'dur',
  'end',
  'by',
]);

// Improved style prop detection
export const isStyleProp = (prop: string): boolean => {
  // First check if it's a common event handler (these should never be treated as style props)
  if (commonEventHandlers.has(prop)) {
    return false;
  }

  // HTML attributes should never be treated as style props
  if (htmlOnlyAttributes.has(prop)) {
    return false;
  }

  // Any prop containing a hyphen is an HTML attribute (aria-*, data-*, accept-charset, etc.)
  // In React, CSS properties are always camelCase — only CSS custom properties use hyphens (--*),
  // and data-style-* is a special convention handled separately below.
  if (
    prop.includes('-') &&
    !prop.startsWith('--') &&
    !prop.startsWith('data-style-')
  ) {
    return false;
  }

  // Check if it's a valid CSS property or custom style prop
  if (
    cssProperties.has(prop) ||
    extraKeys.has(prop) ||
    prop.startsWith('--') ||
    (prop.startsWith('data-style-') && !includeKeys.has(prop))
  ) {
    return true;
  }

  // Check if it's a valid CSS property using CSS.supports (browser environment)
  // Results are cached to avoid repeated CSS.supports calls
  if (typeof CSS !== 'undefined' && CSS.supports) {
    const cached = cssSupportCache.get(prop);
    if (cached !== undefined) return cached;

    try {
      const kebabProp = vendorPrefixToKebabCase(prop);
      const result = CSS.supports(kebabProp, 'inherit');
      cssSupportCache.set(prop, result);
      return result;
    } catch {
      cssSupportCache.set(prop, false);
      return false;
    }
  }

  return false;
};

/**
 * Enhances styleObjectToCss to handle vendor prefixed properties
 *
 * @param styleObject The style object with camelCase properties
 * @returns A CSS string with properly formatted properties
 */
export function styleObjectToCss(styleObject: Record<string, any>): string {
  return Object.entries(styleObject)
    .filter(([key]) => isStyleProp(key))
    .map(([property, value]) => {
      if (value === undefined || value === null) return '';

      // Convert property to kebab-case with vendor prefix handling
      const cssProperty = propertyToKebabCase(property);

      // Return formatted CSS declaration
      return `${cssProperty}: ${value};`;
    })
    .filter(Boolean)
    .join(' ');
}

export const toKebabCase = (str: string): string => {
  return vendorPrefixToKebabCase(str);
};

// Process and normalize style properties
export const processStyleProperty = (
  property: string,
  value: any,
  getColor: (color: string) => string
): string | number => {
  // Handle null or undefined values
  if (value == null) {
    return '';
  }

  // Handle custom CSS properties (variables)
  if (property.startsWith('--')) {
    // For CSS variables, we pass the value as is
    return value;
  }

  // Convert kebab-case property to check against numericCssProperties
  const kebabProperty = toKebabCase(property);

  // Convert numbers to pixels for appropriate properties
  if (typeof value === 'number') {
    // Check if this is a property that should have px units
    // First check the property as is, then check with vendor prefixes removed
    const shouldAddPx =
      !NumberProps.has(property) &&
      (numericCssProperties.has(kebabProperty) ||
        // Check if it's a vendor-prefixed property that needs px
        ((/^-(webkit|moz|ms|o)-/.test(kebabProperty) ||
          /^-(Webkit|Moz|Ms|O)-/.test(kebabProperty)) &&
          numericCssProperties.has(
            kebabProperty.replace(/^-(webkit|moz|ms|o|Webkit|Moz|Ms|O)-/, '')
          )));

    if (shouldAddPx) {
      return `${value}px`;
    }
    return value;
  }

  // Handle color properties directly
  if (
    property.toLowerCase().indexOf('color') >= 0 ||
    property === 'fill' ||
    property === 'stroke'
  ) {
    return getColor(value);
  }

  // Handle properties that might contain color values (borders, gradients, shadows, etc.)
  if (typeof value === 'string' && value.length > 3) {
    if (hasColorToken(value)) {
      return replaceColorTokens(value, (token) => getColor(token));
    }
  }

  // Handle arrays (e.g., for transforms)
  if (Array.isArray(value)) {
    return value.join(' ');
  }

  // Handle objects (e.g., for gradients or transforms)
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return value;
};

// Export the set of valid style properties
export const StyleProps: string[] = Array.from(cssProperties);
export const StyledProps: Set<string> = cssProperties;

// Helper function to validate if a prop should be an attribute
export const shouldBeAttribute = (prop: string): boolean => {
  return (
    !isStyleProp(prop) &&
    !includeKeys.has(prop) &&
    // Common non-style attributes
    /^(id|className|role|aria-|data-(?!style-)|tabIndex|title|lang|dir)/.test(
      prop
    )
  );
};

// Helper to generate class name from style prop
export const generateClassName = (
  property: string,
  value: any,
  getColor: (color: string) => string
): string => {
  const processedValue = processStyleProperty(property, value, getColor);
  const normalizedValue = String(processedValue)
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .replace(/^-+|-+$/g, '');

  return `${toKebabCase(property)}-${normalizedValue}`;
};
