import {
  defaultLightPalette,
  defaultDarkPalette,
  defaultColors,
  defaultLightColors,
  defaultDarkColors,
  nearestColorToken,
  normalizeThemeColors,
  isColorToken,
} from '../../../src/utils/colors';

describe('Colors', () => {
  describe('defaultLightPalette', () => {
    it('should have white colors (alpha variants)', () => {
      expect(defaultLightPalette.white).toBeDefined();
      expect(defaultLightPalette.white[50]).toBe(
        'rgba(255, 255, 255, 0.04)'
      );
      expect(defaultLightPalette.white[900]).toBe(
        'rgba(255, 255, 255, 1)'
      );
    });

    it('should have black colors (alpha variants)', () => {
      expect(defaultLightPalette.black).toBeDefined();
      expect(defaultLightPalette.black[50]).toBe('rgba(0, 0, 0, 0.04)');
      expect(defaultLightPalette.black[900]).toBe('rgba(0, 0, 0, 1)');
    });

    it('should have all color scales from 50 to 900', () => {
      const colors = Object.keys(defaultLightPalette);
      colors.forEach((color) => {
        const scale = defaultLightPalette[color];
        expect(scale[50]).toBeDefined();
        expect(scale[100]).toBeDefined();
        expect(scale[200]).toBeDefined();
        expect(scale[300]).toBeDefined();
        expect(scale[400]).toBeDefined();
        expect(scale[500]).toBeDefined();
        expect(scale[600]).toBeDefined();
        expect(scale[700]).toBeDefined();
        expect(scale[800]).toBeDefined();
        expect(scale[900]).toBeDefined();
      });
    });

    it('should have all named color palettes', () => {
      const expectedColors = [
        'white',
        'black',
        'rose',
        'pink',
        'fuchsia',
        'purple',
        'violet',
        'indigo',
        'blue',
        'lightBlue',
        'cyan',
        'teal',
        'emerald',
        'green',
        'lime',
        'yellow',
        'amber',
        'orange',
        'red',
        'warmGray',
        'trueGray',
        'gray',
        'dark',
        'light',
        'coolGray',
        'blueGray',
        'slate',
        'zinc',
        'neutral',
        'stone',
      ];

      expectedColors.forEach((color) => {
        expect(defaultLightPalette[color]).toBeDefined();
      });
    });
  });

  describe('defaultDarkPalette', () => {
    it('should have white colors (inverted for dark theme)', () => {
      expect(defaultDarkPalette.white).toBeDefined();
      expect(defaultDarkPalette.white[50]).toBe(
        'rgba(0, 0, 0, 0.04)'
      );
    });

    it('should have all named color palettes', () => {
      const expectedColors = [
        'white',
        'black',
        'rose',
        'pink',
        'fuchsia',
        'purple',
        'violet',
        'indigo',
        'blue',
        'lightBlue',
        'cyan',
        'teal',
        'emerald',
        'green',
        'lime',
        'yellow',
        'amber',
        'orange',
        'red',
        'warmGray',
        'trueGray',
        'gray',
        'dark',
        'light',
        'coolGray',
        'blueGray',
        'slate',
        'zinc',
        'neutral',
        'stone',
      ];

      expectedColors.forEach((color) => {
        expect(defaultDarkPalette[color]).toBeDefined();
      });
    });
  });

  describe('defaultColors', () => {
    it('should have basic color definitions', () => {
      expect(defaultColors.white).toBe('#FFFFFF');
      expect(defaultColors.black).toBe('#000000');
      expect(defaultColors.red).toBe('#FF0000');
      expect(defaultColors.green).toBe('#00FF00');
      expect(defaultColors.blue).toBe('#0000FF');
    });

    it('should have all standard colors defined', () => {
      const expectedColors = [
        'white',
        'black',
        'red',
        'green',
        'blue',
        'yellow',
        'cyan',
        'magenta',
        'grey',
        'orange',
        'brown',
        'purple',
        'pink',
      ];

      expectedColors.forEach((color) => {
        expect(defaultColors[color]).toBeDefined();
        expect(typeof defaultColors[color]).toBe('string');
      });
    });
  });

  describe('defaultLightColors', () => {
    it('should extend defaultColors with light theme colors', () => {
      expect(defaultLightColors.white).toBe('#FFFFFF');
      expect(defaultLightColors.black).toBe('#000000');
    });

    it('should have same colors as defaultColors', () => {
      expect(defaultLightColors.red).toBe('#FF0000');
      expect(defaultLightColors.green).toBe('#00FF00');
      expect(defaultLightColors.blue).toBe('#0000FF');
    });
  });

  describe('defaultDarkColors', () => {
    it('should extend defaultColors with dark theme colors', () => {
      expect(defaultDarkColors.white).toBe('#000000');
      expect(defaultDarkColors.black).toBe('#FFFFFF');
    });

    it('should invert white and black for dark theme', () => {
      expect(defaultDarkColors.white).toBe('#000000');
      expect(defaultDarkColors.black).toBe('#FFFFFF');
    });

    it('should preserve other colors from defaultColors', () => {
      expect(defaultDarkColors.red).toBe('#FF0000');
      expect(defaultDarkColors.green).toBe('#00FF00');
      expect(defaultDarkColors.blue).toBe('#0000FF');
    });
  });

  describe('isColorToken', () => {
    it('recognizes dash-notation tokens and keywords', () => {
      expect(isColorToken('color-blue-500')).toBe(true);
      expect(isColorToken('theme-primary')).toBe(true);
      expect(isColorToken('light-red-200')).toBe(true);
      expect(isColorToken('dark-red-200')).toBe(true);
      expect(isColorToken('transparent')).toBe(true);
    });

    it('rejects literal colors', () => {
      expect(isColorToken('#ef4444')).toBe(false);
      expect(isColorToken('rgb(239, 68, 68)')).toBe(false);
    });
  });

  describe('nearestColorToken', () => {
    const light = { main: defaultLightColors, palette: defaultLightPalette };

    it('maps an exact palette hex to its token', () => {
      expect(nearestColorToken('#ef4444', light)).toBe('color-red-500');
      expect(nearestColorToken('#3b82f6', light)).toBe('color-blue-500');
      expect(nearestColorToken('#22c55e', light)).toBe('color-green-500');
    });

    it('maps pure white/black to the auto-flipping main tokens', () => {
      expect(nearestColorToken('#FFFFFF', light)).toBe('color-white');
      expect(nearestColorToken('#000000', light)).toBe('color-black');
    });

    it('snaps a near color to the closest token', () => {
      expect(nearestColorToken('#ee4545', light)).toBe('color-red-500');
    });

    it('parses rgb() input', () => {
      expect(nearestColorToken('rgb(59, 130, 246)', light)).toBe(
        'color-blue-500'
      );
    });

    it('preserves alpha as an alpha-suffixed token', () => {
      expect(nearestColorToken('rgba(239, 68, 68, 0.5)', light)).toBe(
        'color-red-500-500'
      );
    });

    it('returns null for unparseable input (named colors)', () => {
      expect(nearestColorToken('cornflowerblue', light)).toBeNull();
      expect(nearestColorToken('not-a-color', light)).toBeNull();
    });
  });

  describe('normalizeThemeColors', () => {
    const light = { main: defaultLightColors, palette: defaultLightPalette };

    it('converts literal colors to tokens while leaving tokens untouched', () => {
      const result = normalizeThemeColors(
        {
          primary: '#ef4444',
          secondary: 'color-blue-500',
          success: 'rgb(34, 197, 94)',
          warning: 'transparent',
          custom: 'cornflowerblue',
        },
        light
      );

      expect(result).toEqual({
        primary: 'color-red-500',
        secondary: 'color-blue-500',
        success: 'color-green-500',
        warning: 'transparent',
        custom: 'cornflowerblue',
      });
    });

    it('does not mutate the input object', () => {
      const theme = { primary: '#ef4444' };
      normalizeThemeColors(theme, light);
      expect(theme.primary).toBe('#ef4444');
    });
  });
});
