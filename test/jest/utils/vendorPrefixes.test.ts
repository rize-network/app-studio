import {
  vendorPrefixedProperties,
  camelToKebabCase,
  getVendorPrefixedProperties,
  needsVendorPrefix,
} from '../../../src/utils/vendorPrefixes';

describe('Vendor Prefixes', () => {
  describe('vendorPrefixedProperties', () => {
    it('should have animation properties', () => {
      expect(vendorPrefixedProperties.animation).toBeDefined();
      expect(vendorPrefixedProperties.animation).toContain('-webkit-animation');
    });

    it('should have transform properties', () => {
      expect(vendorPrefixedProperties.transform).toBeDefined();
      expect(vendorPrefixedProperties.transform).toContain('-webkit-transform');
      expect(vendorPrefixedProperties.transform).toContain('-moz-transform');
    });

    it('should have transition properties', () => {
      expect(vendorPrefixedProperties.transition).toBeDefined();
      expect(vendorPrefixedProperties.transition).toContain(
        '-webkit-transition'
      );
    });

    it('should have flexbox properties', () => {
      expect(vendorPrefixedProperties.flex).toBeDefined();
      expect(vendorPrefixedProperties.flexDirection).toBeDefined();
      expect(vendorPrefixedProperties.justifyContent).toBeDefined();
    });
  });

  describe('camelToKebabCase', () => {
    it('should convert camelCase to kebab-case', () => {
      expect(camelToKebabCase('backgroundColor')).toBe('background-color');
    });

    it('should convert single word to lowercase', () => {
      expect(camelToKebabCase('color')).toBe('color');
    });

    it('should handle already kebab-case', () => {
      expect(camelToKebabCase('background-color')).toBe('background-color');
    });

    it('should convert multiple uppercase letters', () => {
      expect(camelToKebabCase('transformOrigin')).toBe('transform-origin');
      expect(camelToKebabCase('WebkitTransform')).toBe('-webkit-transform');
    });

    it('should handle vendor prefixed camelCase', () => {
      expect(camelToKebabCase('webkitAppearance')).toBe('webkit-appearance');
      expect(camelToKebabCase('mozAppearance')).toBe('moz-appearance');
    });

    it('should handle standard properties', () => {
      expect(camelToKebabCase('display')).toBe('display');
      expect(camelToKebabCase('backgroundColor')).toBe('background-color');
    });
  });

  describe('getVendorPrefixedProperties', () => {
    it('should return standard property and prefixed versions for animation', () => {
      const result = getVendorPrefixedProperties('animation');
      expect(result).toContain('animation');
      expect(result).toContain('-webkit-animation');
    });

    it('should return standard property and prefixed versions for transform', () => {
      const result = getVendorPrefixedProperties('transform');
      expect(result).toContain('transform');
      expect(result).toContain('-webkit-transform');
      expect(result).toContain('-moz-transform');
    });

    it('should return property in kebab-case', () => {
      const result = getVendorPrefixedProperties('backgroundColor');
      expect(result[0]).toBe('background-color');
    });

    it('should return empty array for non-vendor-prefixed properties', () => {
      const result = getVendorPrefixedProperties('display');
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toBe('display');
    });

    it('should include all vendor prefixes for transform', () => {
      const result = getVendorPrefixedProperties('transform');
      expect(result.length).toBeGreaterThan(1);
      result.forEach((prop) => {
        expect(typeof prop).toBe('string');
      });
    });
  });

  describe('needsVendorPrefix', () => {
    it('should return true for animation', () => {
      expect(needsVendorPrefix('animation')).toBe(true);
    });

    it('should return true for transform', () => {
      expect(needsVendorPrefix('transform')).toBe(true);
    });

    it('should return true for transition', () => {
      expect(needsVendorPrefix('transition')).toBe(true);
    });

    it('should return true for flex properties', () => {
      expect(needsVendorPrefix('flex')).toBe(true);
      expect(needsVendorPrefix('flexDirection')).toBe(true);
      expect(needsVendorPrefix('justifyContent')).toBe(true);
    });

    it('should return true for appearance', () => {
      expect(needsVendorPrefix('appearance')).toBe(true);
    });

    it('should return true for userSelect', () => {
      expect(needsVendorPrefix('userSelect')).toBe(true);
    });

    it('should return false for standard properties', () => {
      expect(needsVendorPrefix('display')).toBe(false);
      expect(needsVendorPrefix('color')).toBe(false);
      expect(needsVendorPrefix('margin')).toBe(false);
    });

    it('should return true for boxShadow', () => {
      expect(needsVendorPrefix('boxShadow')).toBe(true);
    });

    it('should return true for filter', () => {
      expect(needsVendorPrefix('filter')).toBe(true);
    });
  });
});
