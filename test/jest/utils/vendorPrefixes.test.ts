import {
  vendorPrefixedProperties,
  camelToKebabCase,
  getVendorPrefixedProperties,
  needsVendorPrefix,
} from '../../../src/utils/vendorPrefixes';

describe('Vendor Prefixes', () => {
  describe('vendorPrefixedProperties', () => {
    // Modern browsers (Chrome 100+, Safari 15+, Firefox 91+) no longer need
    // vendor prefixes for animation, transform, transition, flexbox, etc.
    // Only webkit-specific properties that have no unprefixed equivalent remain.

    it('should have webkit-only properties that still need prefixes', () => {
      expect(vendorPrefixedProperties.textFillColor).toBeDefined();
      expect(vendorPrefixedProperties.textFillColor).toContain(
        '-webkit-text-fill-color'
      );
    });

    it('should have backgroundClip with webkit prefix', () => {
      expect(vendorPrefixedProperties.backgroundClip).toBeDefined();
      expect(vendorPrefixedProperties.backgroundClip).toContain(
        '-webkit-background-clip'
      );
    });

    it('should have lineClamp with webkit prefix', () => {
      expect(vendorPrefixedProperties.lineClamp).toBeDefined();
      expect(vendorPrefixedProperties.lineClamp).toContain(
        '-webkit-line-clamp'
      );
    });

    it('should NOT have animation properties (no longer needed)', () => {
      expect(vendorPrefixedProperties.animation).toBeUndefined();
    });

    it('should NOT have transform properties (no longer needed)', () => {
      expect(vendorPrefixedProperties.transform).toBeUndefined();
    });

    it('should NOT have transition properties (no longer needed)', () => {
      expect(vendorPrefixedProperties.transition).toBeUndefined();
    });

    it('should NOT have flexbox properties (no longer needed)', () => {
      expect(vendorPrefixedProperties.flex).toBeUndefined();
      expect(vendorPrefixedProperties.flexDirection).toBeUndefined();
      expect(vendorPrefixedProperties.justifyContent).toBeUndefined();
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
    it('should return only standard property for animation (no prefixes needed)', () => {
      const result = getVendorPrefixedProperties('animation');
      expect(result).toContain('animation');
      expect(result.length).toBe(1);
    });

    it('should return only standard property for transform (no prefixes needed)', () => {
      const result = getVendorPrefixedProperties('transform');
      expect(result).toContain('transform');
      expect(result.length).toBe(1);
    });

    it('should return property in kebab-case', () => {
      const result = getVendorPrefixedProperties('backgroundColor');
      expect(result[0]).toBe('background-color');
    });

    it('should return single entry for non-vendor-prefixed properties', () => {
      const result = getVendorPrefixedProperties('display');
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toBe('display');
      expect(result.length).toBe(1);
    });

    it('should include webkit prefix for textFillColor', () => {
      const result = getVendorPrefixedProperties('textFillColor');
      expect(result.length).toBeGreaterThan(1);
      expect(result).toContain('-webkit-text-fill-color');
      result.forEach((prop) => {
        expect(typeof prop).toBe('string');
      });
    });

    it('should include webkit prefix for backgroundClip', () => {
      const result = getVendorPrefixedProperties('backgroundClip');
      expect(result).toContain('background-clip');
      expect(result).toContain('-webkit-background-clip');
    });
  });

  describe('needsVendorPrefix', () => {
    // Properties that no longer need vendor prefixes in modern browsers
    it('should return false for animation (modern browsers)', () => {
      expect(needsVendorPrefix('animation')).toBe(false);
    });

    it('should return false for transform (modern browsers)', () => {
      expect(needsVendorPrefix('transform')).toBe(false);
    });

    it('should return false for transition (modern browsers)', () => {
      expect(needsVendorPrefix('transition')).toBe(false);
    });

    it('should return false for flex properties (modern browsers)', () => {
      expect(needsVendorPrefix('flex')).toBe(false);
      expect(needsVendorPrefix('flexDirection')).toBe(false);
      expect(needsVendorPrefix('justifyContent')).toBe(false);
    });

    it('should return false for standard properties', () => {
      expect(needsVendorPrefix('display')).toBe(false);
      expect(needsVendorPrefix('color')).toBe(false);
      expect(needsVendorPrefix('margin')).toBe(false);
    });

    // Properties that still need -webkit- prefix
    it('should return true for textFillColor', () => {
      expect(needsVendorPrefix('textFillColor')).toBe(true);
    });

    it('should return true for backgroundClip', () => {
      expect(needsVendorPrefix('backgroundClip')).toBe(true);
    });

    it('should return true for lineClamp', () => {
      expect(needsVendorPrefix('lineClamp')).toBe(true);
    });

    it('should return true for maskImage', () => {
      expect(needsVendorPrefix('maskImage')).toBe(true);
    });
  });
});
