// styleHelpers.ts
import { extraKeys, includeKeys, NumberProps } from './constants';

// Comprehensive list of CSS properties that should be converted to classes
const cssProperties = new Set([
  // Standard CSS properties
  ...Object.keys(document.createElement('div').style),

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
  'filter',
  'backdropFilter',

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

// Improved style prop detection
export const isStyleProp = (prop: string): boolean => {
  // Check if it's a valid CSS property or custom style prop
  return (
    cssProperties.has(prop) ||
    extraKeys.has(prop) ||
    // Check for vendor prefixes
    /^(webkit|moz|ms|o)[A-Z]/.test(prop) ||
    // Check for custom properties
    prop.startsWith('--') ||
    // Check for data attributes that should be treated as styles
    (prop.startsWith('data-style-') && !includeKeys.has(prop))
  );
};

// Convert style object to CSS string
export const styleObjectToCss = (styles: Record<string, any>): string => {
  return Object.entries(styles)
    .filter(([key]) => isStyleProp(key))
    .map(([key, value]) => {
      const cssProperty = toKebabCase(key);
      const processedValue = processStyleProperty(key, value, (color) => color);
      return `${cssProperty}: ${processedValue};`;
    })
    .join(' ');
};

export const toKebabCase = (str: string): string => {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
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

  // Convert numbers to pixels for appropriate properties
  if (typeof value === 'number') {
    if (!NumberProps.has(property)) {
      return `${value}px`;
    }
    return value;
  }

  // Handle color properties
  if (
    property.toLowerCase().indexOf('color') >= 0 ||
    property === 'fill' ||
    property === 'stroke'
  ) {
    return getColor(value);
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
