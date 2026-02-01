import {
  NumberProps,
  excludedKeys,
  extraKeys,
  includeKeys,
} from '../../../src/utils/constants';

describe('Constants', () => {
  describe('NumberProps', () => {
    it('should be a Set', () => {
      expect(NumberProps instanceof Set).toBe(true);
    });

    it('should contain fontWeight', () => {
      expect(NumberProps.has('fontWeight')).toBe(true);
    });

    it('should contain flex properties', () => {
      expect(NumberProps.has('flex')).toBe(true);
      expect(NumberProps.has('flexGrow')).toBe(true);
      expect(NumberProps.has('flexShrink')).toBe(true);
    });

    it('should contain zIndex', () => {
      expect(NumberProps.has('zIndex')).toBe(true);
    });

    it('should contain opacity', () => {
      expect(NumberProps.has('opacity')).toBe(true);
    });

    it('should contain order', () => {
      expect(NumberProps.has('order')).toBe(true);
    });

    it('should contain aspectRatio', () => {
      expect(NumberProps.has('aspectRatio')).toBe(true);
    });

    it('should contain shadowOpacity and shadowRadius', () => {
      expect(NumberProps.has('shadowOpacity')).toBe(true);
      expect(NumberProps.has('shadowRadius')).toBe(true);
    });

    it('should contain scale', () => {
      expect(NumberProps.has('scale')).toBe(true);
    });

    it('should have all expected properties', () => {
      const expectedProps = [
        'numberOfLines',
        'fontWeight',
        'timeStamp',
        'flex',
        'flexGrow',
        'flexShrink',
        'order',
        'zIndex',
        'aspectRatio',
        'shadowOpacity',
        'shadowRadius',
        'scale',
        'opacity',
        'min',
        'max',
        'now',
      ];

      expectedProps.forEach((prop) => {
        expect(NumberProps.has(prop)).toBe(true);
      });
    });
  });

  describe('excludedKeys', () => {
    it('should be a Set', () => {
      expect(excludedKeys instanceof Set).toBe(true);
    });

    it('should contain style related props', () => {
      expect(excludedKeys.has('shadow')).toBe(true);
      expect(excludedKeys.has('css')).toBe(true);
      expect(excludedKeys.has('media')).toBe(true);
    });

    it('should contain animation props', () => {
      expect(excludedKeys.has('animate')).toBe(true);
      expect(excludedKeys.has('animateIn')).toBe(true);
      expect(excludedKeys.has('animateOut')).toBe(true);
    });

    it('should contain pseudo-class props starting with underscore', () => {
      expect(excludedKeys.has('_hover')).toBe(true);
      expect(excludedKeys.has('_active')).toBe(true);
      expect(excludedKeys.has('_focus')).toBe(true);
      expect(excludedKeys.has('_disabled')).toBe(true);
    });

    it('should contain pseudo-element props', () => {
      expect(excludedKeys.has('_before')).toBe(true);
      expect(excludedKeys.has('_after')).toBe(true);
    });

    it('should contain layout shorthand props', () => {
      expect(excludedKeys.has('paddingHorizontal')).toBe(true);
      expect(excludedKeys.has('paddingVertical')).toBe(true);
      expect(excludedKeys.has('marginHorizontal')).toBe(true);
      expect(excludedKeys.has('marginVertical')).toBe(true);
    });
  });

  describe('extraKeys', () => {
    it('should be a Set', () => {
      expect(extraKeys instanceof Set).toBe(true);
    });

    it('should contain on', () => {
      expect(extraKeys.has('on')).toBe(true);
    });

    it('should contain shadow', () => {
      expect(extraKeys.has('shadow')).toBe(true);
    });

    it('should contain media', () => {
      expect(extraKeys.has('media')).toBe(true);
    });

    it('should contain css', () => {
      expect(extraKeys.has('css')).toBe(true);
    });
  });

  describe('includeKeys', () => {
    it('should be a Set', () => {
      expect(includeKeys instanceof Set).toBe(true);
    });

    it('should contain src', () => {
      expect(includeKeys.has('src')).toBe(true);
    });

    it('should contain alt', () => {
      expect(includeKeys.has('alt')).toBe(true);
    });

    it('should contain style', () => {
      expect(includeKeys.has('style')).toBe(true);
    });

    it('should contain as', () => {
      expect(includeKeys.has('as')).toBe(true);
    });

    it('should have exactly 4 keys', () => {
      expect(includeKeys.size).toBe(4);
    });
  });
});
