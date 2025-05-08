// Test function for vendor prefixes
function propertyToKebabCase(property) {
  // Handle special webkit, moz, ms prefixed properties
  // Check for both lowercase and uppercase vendor prefixes
  const vendorPrefixRegex = /^(webkit|moz|ms|o)([A-Z])/i;
  if (vendorPrefixRegex.test(property)) {
    const match = property.match(/^(webkit|moz|ms|o)/i);
    if (match) {
      const prefix = match[0].toLowerCase();
      const restOfProperty = property.slice(prefix.length);

      // First convert the entire property to kebab case
      let kebabProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();

      // Then ensure the vendor prefix is correctly formatted
      // This replaces patterns like "webkit-" with "-webkit-"
      kebabProperty = kebabProperty.replace(/^(webkit|moz|ms|o)-/, '-$1-');

      return kebabProperty;
    }
  }

  // Standard property conversion to kebab-case
  return property.replace(/([A-Z])/g, '-$1').toLowerCase();
}

// Test cases
const testCases = [
  'webkitBackgroundClip',
  'WebkitBackgroundClip',
  'msTransform',
  'MozUserSelect',
  'backgroundColor',
  'marginTop',
];

// Run tests
testCases.forEach((prop) => {
  console.log(`${prop} -> ${propertyToKebabCase(prop)}`);
});
