import {
  vendorPrefixToKebabCase,
  cssPropertyKeys,
  numericCssProperties,
} from '../../utils/cssProperties';

describe('CSS Properties', () => {
  describe('vendorPrefixToKebabCase', () => {
    it('should handle custom CSS variables', () => {
      expect(vendorPrefixToKebabCase('--primary')).toBe('--primary');
      expect(vendorPrefixToKebabCase('--my-color')).toBe('--my-color');
    });

    it('should convert camelCase to kebab-case', () => {
      expect(vendorPrefixToKebabCase('backgroundColor')).toBe(
        'background-color'
      );
      expect(vendorPrefixToKebabCase('fontSize')).toBe('font-size');
    });

    it('should handle webkit prefix (lowercase)', () => {
      expect(vendorPrefixToKebabCase('webkitTransform')).toBe(
        '-webkit-transform'
      );
      expect(vendorPrefixToKebabCase('webkitAppearance')).toBe(
        '-webkit-appearance'
      );
    });

    it('should handle webkit prefix (uppercase)', () => {
      expect(vendorPrefixToKebabCase('WebkitTransform')).toBe(
        '-webkit-transform'
      );
      expect(vendorPrefixToKebabCase('WebkitAppearance')).toBe(
        '-webkit-appearance'
      );
    });

    it('should handle moz prefix', () => {
      expect(vendorPrefixToKebabCase('mozUserSelect')).toBe('-moz-user-select');
      expect(vendorPrefixToKebabCase('MozUserSelect')).toBe('-moz-user-select');
    });

    it('should handle ms prefix', () => {
      expect(vendorPrefixToKebabCase('msTransform')).toBe('-ms-transform');
      expect(vendorPrefixToKebabCase('MsTransform')).toBe('-ms-transform');
    });

    it('should handle o prefix', () => {
      expect(vendorPrefixToKebabCase('oTransform')).toBe('-o-transform');
      expect(vendorPrefixToKebabCase('OTransform')).toBe('-o-transform');
    });

    it('should avoid double hyphens', () => {
      const result = vendorPrefixToKebabCase('webkitTransform');
      expect(result).not.toContain('--');
    });

    it('should not process properties without vendor prefix', () => {
      expect(vendorPrefixToKebabCase('display')).toBe('display');
      expect(vendorPrefixToKebabCase('color')).toBe('color');
    });
  });

  describe('cssPropertyKeys', () => {
    it('should be an array', () => {
      expect(Array.isArray(cssPropertyKeys)).toBe(true);
    });

    it('should contain common CSS properties', () => {
      expect(cssPropertyKeys).toContain('color');
      expect(cssPropertyKeys).toContain('display');
      expect(cssPropertyKeys).toContain('backgroundColor');
      expect(cssPropertyKeys).toContain('flexDirection');
    });

    it('should contain animation properties', () => {
      expect(cssPropertyKeys).toContain('animation');
      expect(cssPropertyKeys).toContain('animationDelay');
      expect(cssPropertyKeys).toContain('animationDuration');
    });

    it('should contain transform properties', () => {
      expect(cssPropertyKeys).toContain('transform');
      expect(cssPropertyKeys).toContain('transformOrigin');
      expect(cssPropertyKeys).toContain('transformStyle');
    });

    it('should contain flexbox properties', () => {
      expect(cssPropertyKeys).toContain('flex');
      expect(cssPropertyKeys).toContain('flexGrow');
      expect(cssPropertyKeys).toContain('flexShrink');
      expect(cssPropertyKeys).toContain('justifyContent');
      expect(cssPropertyKeys).toContain('alignItems');
    });

    it('should contain grid properties', () => {
      expect(cssPropertyKeys).toContain('gridArea');
      expect(cssPropertyKeys).toContain('gridColumn');
      expect(cssPropertyKeys).toContain('gridRow');
    });

    it('should contain margin and padding properties', () => {
      expect(cssPropertyKeys).toContain('margin');
      expect(cssPropertyKeys).toContain('marginTop');
      expect(cssPropertyKeys).toContain('padding');
      expect(cssPropertyKeys).toContain('paddingBottom');
    });

    it('should contain vendor-prefixed properties', () => {
      expect(cssPropertyKeys).toContain('WebkitTransform');
      expect(cssPropertyKeys).toContain('webkitTransform');
      expect(cssPropertyKeys).toContain('MozAppearance');
      expect(cssPropertyKeys).toContain('msTransform');
    });

    it('should have many entries', () => {
      expect(cssPropertyKeys.length).toBeGreaterThan(100);
    });
  });

  describe('numericCssProperties', () => {
    it('should be a Set', () => {
      expect(numericCssProperties instanceof Set).toBe(true);
    });

    it('should contain dimension properties', () => {
      expect(numericCssProperties.has('width')).toBe(true);
      expect(numericCssProperties.has('height')).toBe(true);
      expect(numericCssProperties.has('min-width')).toBe(true);
      expect(numericCssProperties.has('max-height')).toBe(true);
    });

    it('should contain margin properties', () => {
      expect(numericCssProperties.has('margin')).toBe(true);
      expect(numericCssProperties.has('margin-top')).toBe(true);
      expect(numericCssProperties.has('margin-left')).toBe(true);
      expect(numericCssProperties.has('margin-right')).toBe(true);
      expect(numericCssProperties.has('margin-bottom')).toBe(true);
    });

    it('should contain padding properties', () => {
      expect(numericCssProperties.has('padding')).toBe(true);
      expect(numericCssProperties.has('padding-top')).toBe(true);
      expect(numericCssProperties.has('padding-left')).toBe(true);
    });

    it('should contain border properties', () => {
      expect(numericCssProperties.has('border-radius')).toBe(true);
      expect(numericCssProperties.has('border-width')).toBe(true);
      expect(numericCssProperties.has('border-top-width')).toBe(true);
    });

    it('should contain position properties', () => {
      expect(numericCssProperties.has('top')).toBe(true);
      expect(numericCssProperties.has('left')).toBe(true);
      expect(numericCssProperties.has('right')).toBe(true);
      expect(numericCssProperties.has('bottom')).toBe(true);
    });

    it('should contain font and text properties', () => {
      expect(numericCssProperties.has('font-size')).toBe(true);
      expect(numericCssProperties.has('line-height')).toBe(true);
      expect(numericCssProperties.has('letter-spacing')).toBe(true);
      expect(numericCssProperties.has('text-indent')).toBe(true);
    });

    it('should contain gap properties', () => {
      expect(numericCssProperties.has('gap')).toBe(true);
      expect(numericCssProperties.has('column-gap')).toBe(true);
      expect(numericCssProperties.has('row-gap')).toBe(true);
    });

    it('should contain perspective property', () => {
      expect(numericCssProperties.has('perspective')).toBe(true);
    });

    it('should contain webkit vendor-prefixed properties', () => {
      expect(numericCssProperties.has('-webkit-border-radius')).toBe(true);
      expect(numericCssProperties.has('-webkit-margin-top')).toBe(true);
    });

    it('should contain moz vendor-prefixed properties', () => {
      expect(numericCssProperties.has('-moz-border-radius')).toBe(true);
      expect(numericCssProperties.has('-moz-margin-bottom')).toBe(true);
    });

    it('should contain ms vendor-prefixed properties', () => {
      expect(numericCssProperties.has('-ms-margin-left')).toBe(true);
    });
  });
});
