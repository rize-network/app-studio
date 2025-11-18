import {
  propertyToKebabCase,
  setSize,
  isStyleProp,
  styleObjectToCss,
  toKebabCase,
  processStyleProperty,
  generateClassName,
  shouldBeAttribute,
} from '../../utils/style';

describe('Style Utilities', () => {
  describe('propertyToKebabCase', () => {
    it('should convert camelCase to kebab-case', () => {
      expect(propertyToKebabCase('backgroundColor')).toBe('-background-color');
    });

    it('should handle simple properties', () => {
      expect(propertyToKebabCase('color')).toBe('color');
      expect(propertyToKebabCase('display')).toBe('display');
    });

    it('should handle webkit prefix', () => {
      expect(propertyToKebabCase('webkitTransform')).toBe('-webkit-transform');
    });

    it('should handle moz prefix', () => {
      expect(propertyToKebabCase('mozUserSelect')).toBe('-moz-user-select');
    });

    it('should handle ms prefix', () => {
      expect(propertyToKebabCase('msFilter')).toBe('-ms-filter');
    });

    it('should handle o prefix', () => {
      expect(propertyToKebabCase('oTransform')).toBe('-o-transform');
    });

    it('should handle uppercase vendor prefixes', () => {
      expect(propertyToKebabCase('WebkitTransform')).toBe('-webkit-transform');
    });
  });

  describe('setSize', () => {
    it('should set both width and height to the same value', () => {
      const styleProps: Record<string, any> = {};
      setSize(100, styleProps);
      expect(styleProps.width).toBe(100);
      expect(styleProps.height).toBe(100);
    });

    it('should set string size values', () => {
      const styleProps: Record<string, any> = {};
      setSize('50%', styleProps);
      expect(styleProps.width).toBe('50%');
      expect(styleProps.height).toBe('50%');
    });

    it('should override existing values', () => {
      const styleProps: Record<string, any> = { width: 50, height: 50 };
      setSize(100, styleProps);
      expect(styleProps.width).toBe(100);
      expect(styleProps.height).toBe(100);
    });
  });

  describe('isStyleProp', () => {
    it('should return true for color property', () => {
      expect(isStyleProp('color')).toBe(true);
    });

    it('should return true for backgroundColor property', () => {
      expect(isStyleProp('backgroundColor')).toBe(true);
    });

    it('should return true for margin properties', () => {
      expect(isStyleProp('margin')).toBe(true);
      expect(isStyleProp('marginTop')).toBe(true);
    });

    it('should return false for event handlers', () => {
      expect(isStyleProp('onClick')).toBe(false);
      expect(isStyleProp('onChange')).toBe(false);
      expect(isStyleProp('onSubmit')).toBe(false);
    });

    it('should return true for vendor prefixed properties', () => {
      expect(isStyleProp('webkitTransform')).toBe(true);
      expect(isStyleProp('mozUserSelect')).toBe(true);
    });

    it('should return true for CSS variables', () => {
      expect(isStyleProp('--my-color')).toBe(true);
      expect(isStyleProp('--primary')).toBe(true);
    });

    it('should return true for custom style props', () => {
      expect(isStyleProp('shadow')).toBe(true);
    });
  });

  describe('styleObjectToCss', () => {
    it('should convert style object to CSS string', () => {
      const styles = { color: 'red', display: 'flex' };
      const result = styleObjectToCss(styles);
      expect(result).toContain('color: red');
      expect(result).toContain('display: flex');
    });

    it('should skip null and undefined values', () => {
      const styles = { color: 'red', margin: null, padding: undefined };
      const result = styleObjectToCss(styles);
      expect(result).toContain('color: red');
      expect(result).not.toContain('margin');
      expect(result).not.toContain('padding');
    });

    it('should skip non-style properties', () => {
      const styles = { color: 'red', onClick: () => {} };
      const result = styleObjectToCss(styles);
      expect(result).toContain('color: red');
      expect(result).not.toContain('onClick');
    });

    it('should handle multiple properties', () => {
      const styles = {
        backgroundColor: 'blue',
        color: 'white',
        fontSize: '14px',
      };
      const result = styleObjectToCss(styles);
      expect(result).toContain('-background-color: blue');
      expect(result).toContain('color: white');
      expect(result).toContain('-font-size: 14px');
    });

    it('should return formatted CSS with semicolons', () => {
      const styles = { color: 'red' };
      const result = styleObjectToCss(styles);
      expect(result).toMatch(/color: red;/);
    });
  });

  describe('toKebabCase', () => {
    it('should convert camelCase to kebab-case', () => {
      const result = toKebabCase('backgroundColor');
      expect(result).toBe('-background-color');
    });

    it('should handle vendor prefixes', () => {
      const result = toKebabCase('webkitTransform');
      expect(result).toBe('-webkit-transform');
    });
  });

  describe('processStyleProperty', () => {
    const mockGetColor = (color: string) => color; // Simple mock that returns input

    it('should handle null and undefined values', () => {
      expect(processStyleProperty('color', null, mockGetColor)).toBe('');
      expect(processStyleProperty('color', undefined, mockGetColor)).toBe('');
    });

    it('should pass CSS variables as-is', () => {
      expect(processStyleProperty('--primary', '#FF0000', mockGetColor)).toBe(
        '#FF0000'
      );
    });

    it('should add px to numeric values for appropriate properties', () => {
      const result = processStyleProperty('width', 100, mockGetColor);
      expect(result).toBe('100px');
    });

    it('should not add px to unitless properties', () => {
      const result = processStyleProperty('flex', 1, mockGetColor);
      expect(result).toBe(1);
    });

    it('should process color properties', () => {
      const result = processStyleProperty('color', 'red', mockGetColor);
      expect(result).toBe('red');
    });

    it('should handle string values', () => {
      const result = processStyleProperty('display', 'flex', mockGetColor);
      expect(result).toBe('flex');
    });

    it('should join array values with space', () => {
      const result = processStyleProperty(
        'transform',
        ['rotate(45deg)', 'scale(1.5)'],
        mockGetColor
      );
      expect(result).toBe('rotate(45deg) scale(1.5)');
    });
  });

  describe('generateClassName', () => {
    const mockGetColor = (color: string) => color;

    it('should generate class name from property and value', () => {
      const result = generateClassName('color', 'red', mockGetColor);
      expect(result).toContain('color-red');
    });

    it('should remove special characters from value', () => {
      const result = generateClassName('margin', '10px', mockGetColor);
      expect(result).not.toContain('px');
    });

    it('should handle null values', () => {
      const result = generateClassName('color', null, mockGetColor);
      expect(typeof result).toBe('string');
    });

    it('should handle numeric values', () => {
      const result = generateClassName('flex', 1, mockGetColor);
      expect(result).toContain('flex');
    });
  });

  describe('shouldBeAttribute', () => {
    it('should return true for id attribute', () => {
      expect(shouldBeAttribute('id')).toBe(true);
    });

    it('should return true for className attribute', () => {
      expect(shouldBeAttribute('className')).toBe(true);
    });

    it('should return true for role attribute', () => {
      expect(shouldBeAttribute('role')).toBe(true);
    });

    it('should return true for aria-* attributes', () => {
      expect(shouldBeAttribute('aria-label')).toBe(true);
      expect(shouldBeAttribute('aria-hidden')).toBe(true);
    });

    it('should return true for tabIndex', () => {
      expect(shouldBeAttribute('tabIndex')).toBe(true);
    });

    it('should return false for style properties', () => {
      expect(shouldBeAttribute('color')).toBe(false);
      expect(shouldBeAttribute('backgroundColor')).toBe(false);
    });

    it('should return false for event handlers', () => {
      expect(shouldBeAttribute('onClick')).toBe(false);
      expect(shouldBeAttribute('onChange')).toBe(false);
    });
  });
});
