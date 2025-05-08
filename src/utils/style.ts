// styleHelpers.ts
import { extraKeys, includeKeys, NumberProps } from './constants';
import { vendorPrefixToKebabCase, numericCssProperties } from './cssProperties';

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
        (/^-(webkit|moz|ms|o)-/.test(kebabProperty) &&
          numericCssProperties.has(
            kebabProperty.replace(/^-(webkit|moz|ms|o)-/, '')
          )));

    if (shouldAddPx) {
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

  // Handle border properties that might contain color values
  if (
    typeof value === 'string' &&
    value.length > 7 &&
    (value.indexOf('color.') >= 0 || value.indexOf('theme.') >= 0)
  ) {
    // Parse border property to extract color
    // Format could be like: "1px solid red" or "1px solid color.red.500"
    const parts = value.split(' ');
    if (parts.length >= 3) {
      // The color is typically the last part
      const colorIndex = parts.length - 1;
      const colorValue = parts[colorIndex];
      // Process the color part through getColor
      const processedColor = getColor(colorValue);
      // Replace the color part and reconstruct the border value
      parts[colorIndex] = processedColor;
      return parts.join(' ');
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
