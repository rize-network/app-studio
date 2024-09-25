// styleHelpers.ts
import { NumberProps } from './constants';
// Excluded keys imported from constants.ts
// import { excludedKeys } from './constants';

// Function to set the size of the element
export const setSize = (
  newSize: string | number,
  styleProps: Record<string, any>
) => {
  styleProps.height = styleProps.width = newSize; // Set height and width
};

// Function to convert style object to CSS string
export const styleObjectToCss = (styleObj: Record<string, any>): string => {
  return Object.entries(styleObj)
    .map(([key, value]) => `${toKebabCase(key)}: ${value};`)
    .join(' ');
};

// Function to convert camelCase to kebab-case
export const toKebabCase = (str: string): string =>
  str.replace(/([A-Z])/g, (match) => '-' + match.toLowerCase());

// // Function to check if a property is a style prop
// export const isStyleProp = (prop: string): boolean => {
//   // Implement your logic to determine if a prop is a style prop
//   // For simplicity, we assume all props not in excludedKeys are style props
//   return !excludedKeys.has(prop);
// };

export const isStyleProp = (prop: string): boolean => {
  // Convert camelCase to kebab-case
  const kebabCase = prop
    .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
    .toLowerCase();

  // Check if it's a standard CSS property
  if (CSS.supports(kebabCase, 'initial')) {
    return true;
  }

  // Check for vendor prefixes
  const prefixes = ['-webkit-', '-moz-', '-ms-', '-o-'];
  for (const prefix of prefixes) {
    if (CSS.supports(prefix + kebabCase, 'initial')) {
      return true;
    }
  }

  // Check if it's a valid CSS custom property
  if (CSS.supports('--test', 'initial')) {
    return CSS.supports(`--${kebabCase}`, 'initial');
  }

  return false;
};

// Function to process and normalize style properties
export const processStyleProperty = (
  property: string,
  value: any,
  getColor: (color: string) => string
): string | number => {
  if (typeof value === 'number' && !NumberProps.has(property)) {
    return `${value}px`;
  } else if (property.toLowerCase().includes('color')) {
    return getColor(value);
  } else {
    return value;
  }
};
