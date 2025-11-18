import { Typography } from '../../utils/typography';

describe('Typography', () => {
  describe('letterSpacings', () => {
    it('should have tighter letter spacing', () => {
      expect(Typography.letterSpacings.tighter).toBe(-0.08);
    });

    it('should have tight letter spacing', () => {
      expect(Typography.letterSpacings.tight).toBe(-0.4);
    });

    it('should have normal letter spacing', () => {
      expect(Typography.letterSpacings.normal).toBe(0);
    });

    it('should have wide letter spacing', () => {
      expect(Typography.letterSpacings.wide).toBe(0.4);
    });

    it('should have wider letter spacing', () => {
      expect(Typography.letterSpacings.wider).toBe(0.8);
    });

    it('should have widest letter spacing', () => {
      expect(Typography.letterSpacings.widest).toBe(1.6);
    });

    it('should have all letter spacing variants', () => {
      const variants = [
        'tighter',
        'tight',
        'normal',
        'wide',
        'wider',
        'widest',
      ];
      variants.forEach((variant) => {
        expect(
          Typography.letterSpacings[
            variant as keyof typeof Typography.letterSpacings
          ]
        ).toBeDefined();
      });
    });
  });

  describe('lineHeights', () => {
    it('should have xs line height', () => {
      expect(Typography.lineHeights.xs).toBe(10);
    });

    it('should have sm line height', () => {
      expect(Typography.lineHeights.sm).toBe(12);
    });

    it('should have md line height', () => {
      expect(Typography.lineHeights.md).toBe(14);
    });

    it('should have lg line height', () => {
      expect(Typography.lineHeights.lg).toBe(16);
    });

    it('should have xl line height', () => {
      expect(Typography.lineHeights.xl).toBe(20);
    });

    it('should have 2xl line height', () => {
      expect(Typography.lineHeights['2xl']).toBe(24);
    });

    it('should have 3xl line height', () => {
      expect(Typography.lineHeights['3xl']).toBe(30);
    });

    it('should have 4xl line height', () => {
      expect(Typography.lineHeights['4xl']).toBe(36);
    });

    it('should have 5xl line height', () => {
      expect(Typography.lineHeights['5xl']).toBe(48);
    });

    it('should have 6xl line height', () => {
      expect(Typography.lineHeights['6xl']).toBe(64);
    });
  });

  describe('fontWeights', () => {
    it('should have hairline font weight', () => {
      expect(Typography.fontWeights.hairline).toBe(100);
    });

    it('should have thin font weight', () => {
      expect(Typography.fontWeights.thin).toBe(200);
    });

    it('should have light font weight', () => {
      expect(Typography.fontWeights.light).toBe(300);
    });

    it('should have normal font weight', () => {
      expect(Typography.fontWeights.normal).toBe(400);
    });

    it('should have medium font weight', () => {
      expect(Typography.fontWeights.medium).toBe(500);
    });

    it('should have semiBold font weight', () => {
      expect(Typography.fontWeights.semiBold).toBe(600);
    });

    it('should have bold font weight', () => {
      expect(Typography.fontWeights.bold).toBe(700);
    });

    it('should have extraBold font weight', () => {
      expect(Typography.fontWeights.extraBold).toBe(800);
    });

    it('should have black font weight', () => {
      expect(Typography.fontWeights.black).toBe(900);
    });

    it('should have all font weight variants', () => {
      const variants = [
        'hairline',
        'thin',
        'light',
        'normal',
        'medium',
        'semiBold',
        'bold',
        'extraBold',
        'black',
      ];
      variants.forEach((variant) => {
        expect(
          Typography.fontWeights[variant as keyof typeof Typography.fontWeights]
        ).toBeDefined();
      });
    });
  });

  describe('fontSizes', () => {
    it('should have xs font size', () => {
      expect(Typography.fontSizes.xs).toBe(10);
    });

    it('should have sm font size', () => {
      expect(Typography.fontSizes.sm).toBe(12);
    });

    it('should have md font size', () => {
      expect(Typography.fontSizes.md).toBe(14);
    });

    it('should have lg font size', () => {
      expect(Typography.fontSizes.lg).toBe(16);
    });

    it('should have xl font size', () => {
      expect(Typography.fontSizes.xl).toBe(20);
    });

    it('should have 2xl font size', () => {
      expect(Typography.fontSizes['2xl']).toBe(24);
    });

    it('should have 3xl font size', () => {
      expect(Typography.fontSizes['3xl']).toBe(30);
    });

    it('should have 4xl font size', () => {
      expect(Typography.fontSizes['4xl']).toBe(36);
    });

    it('should have 5xl font size', () => {
      expect(Typography.fontSizes['5xl']).toBe(48);
    });

    it('should have 6xl font size', () => {
      expect(Typography.fontSizes['6xl']).toBe(64);
    });
  });
});
