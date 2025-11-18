import {
  defaultLightPalette,
  defaultDarkPalette,
  defaultColors,
  defaultLightColors,
  defaultDarkColors,
} from '../../utils/colors';

describe('Colors', () => {
  describe('defaultLightPalette', () => {
    it('should have whiteAlpha colors', () => {
      expect(defaultLightPalette.whiteAlpha).toBeDefined();
      expect(defaultLightPalette.whiteAlpha[50]).toBe(
        'rgba(255, 255, 255, 0.04)'
      );
      expect(defaultLightPalette.whiteAlpha[900]).toBe(
        'rgba(255, 255, 255, 0.92)'
      );
    });

    it('should have blackAlpha colors', () => {
      expect(defaultLightPalette.blackAlpha).toBeDefined();
      expect(defaultLightPalette.blackAlpha[50]).toBe('rgba(0, 0, 0, 0.04)');
      expect(defaultLightPalette.blackAlpha[900]).toBe('rgba(0, 0, 0, 0.92)');
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
        'whiteAlpha',
        'blackAlpha',
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
      ];

      expectedColors.forEach((color) => {
        expect(defaultLightPalette[color]).toBeDefined();
      });
    });
  });

  describe('defaultDarkPalette', () => {
    it('should have whiteAlpha colors', () => {
      expect(defaultDarkPalette.whiteAlpha).toBeDefined();
      expect(defaultDarkPalette.whiteAlpha[50]).toBe(
        'rgba(255, 255, 255, 0.04)'
      );
    });

    it('should have all named color palettes', () => {
      const expectedColors = [
        'whiteAlpha',
        'blackAlpha',
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
        'lime',
        'teal',
        'navy',
        'olive',
        'maroon',
        'gold',
        'silver',
        'indigo',
        'violet',
        'beige',
        'turquoise',
        'coral',
        'chocolate',
        'skyBlue',
        'plum',
        'darkGreen',
        'salmon',
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
      expect(defaultLightColors.dark).toBe('#a1a1aa');
    });

    it('should have dark property for light theme', () => {
      expect(defaultLightColors.dark).toBeDefined();
      expect(defaultLightColors.dark).toBe('#a1a1aa');
    });
  });

  describe('defaultDarkColors', () => {
    it('should extend defaultColors with dark theme colors', () => {
      expect(defaultDarkColors.white).toBe('#000000');
      expect(defaultDarkColors.black).toBe('#FFFFFF');
      expect(defaultDarkColors.dark).toBe('#adb5bd');
    });

    it('should invert white and black for dark theme', () => {
      expect(defaultDarkColors.white).toBe('#000000');
      expect(defaultDarkColors.black).toBe('#FFFFFF');
    });

    it('should have dark property for dark theme', () => {
      expect(defaultDarkColors.dark).toBeDefined();
      expect(defaultDarkColors.dark).toBe('#adb5bd');
    });
  });
});
