function getValidCSSProperties() {
  // Use the CSSStyleDeclaration object to get all supported CSS properties
  const allProps = Object.keys(document.body.style);

  // Create a Set for non-style attributes that we wish to exclude from the style properties
  // Note: This list is not exhaustive and can be expanded as needed.
  const nonStyleAttributes = new Set([
    'length',
    'parentRule',
    'src',
    // ... add any other known non-style properties here
  ]);

  // Filter out non-standard properties, event handlers, and non-style attributes
  const validProps = new Set(
    allProps.filter(
      (prop) =>
        !/^(-moz-|-ms-|-webkit-|-o-)/.test(prop) && // Vendor prefixes
        !/^on[A-Z]/.test(prop) && // Event handlers, e.g., onClick
        !nonStyleAttributes.has(prop) // Specific non-style properties
    )
  );

  return validProps;
}

export const StyleProps: any = getValidCSSProperties();

export const isStyleProp = (property: string): boolean => {
  return StyleProps.has(property);
};
