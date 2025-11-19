import { Shadows } from '../../utils/shadow';

describe('Shadows', () => {
  it('should have shadow definitions for levels 0-9', () => {
    for (let i = 0; i <= 9; i++) {
      expect(Shadows[i]).toBeDefined();
    }
  });

  it('should have correct shadow structure', () => {
    const shadow = Shadows[0];
    expect(shadow).toHaveProperty('shadowColor');
    expect(shadow).toHaveProperty('shadowOffset');
    expect(shadow).toHaveProperty('shadowOpacity');
    expect(shadow).toHaveProperty('shadowRadius');
  });

  it('should have shadowOffset with width and height', () => {
    const shadow = Shadows[0];
    expect(shadow.shadowOffset).toHaveProperty('width');
    expect(shadow.shadowOffset).toHaveProperty('height');
    expect(typeof shadow.shadowOffset.width).toBe('number');
    expect(typeof shadow.shadowOffset.height).toBe('number');
  });

  it('should have black shadow color', () => {
    const shadow = Shadows[0];
    expect(shadow.shadowColor).toBe('#000');
  });

  it('should have increasing shadow opacity with level', () => {
    expect(Shadows[0].shadowOpacity).toBe(0.18);
    expect(Shadows[1].shadowOpacity).toBe(0.2);
    expect(Shadows[9].shadowOpacity).toBe(0.34);
  });

  it('should have increasing shadow radius with level', () => {
    expect(Shadows[0].shadowRadius).toBe(1.0);
    expect(Shadows[1].shadowRadius).toBe(1.41);
    expect(Shadows[4].shadowRadius).toBe(3.84);
  });

  it('should have correct shadow at level 0', () => {
    const shadow = Shadows[0];
    expect(shadow.shadowOffset.width).toBe(1);
    expect(shadow.shadowOffset.height).toBe(2);
    expect(shadow.shadowOpacity).toBe(0.18);
  });

  it('should have correct shadow at level 5', () => {
    const shadow = Shadows[5];
    expect(shadow.shadowOffset.width).toBe(6);
    expect(shadow.shadowOffset.height).toBe(6);
    expect(shadow.shadowOpacity).toBe(0.27);
  });

  it('should have correct shadow at level 9', () => {
    const shadow = Shadows[9];
    expect(shadow.shadowOffset.width).toBe(10);
    expect(shadow.shadowOffset.height).toBe(10);
    expect(shadow.shadowOpacity).toBe(0.34);
    expect(shadow.shadowRadius).toBe(6.27);
  });

  it('should have valid shadow properties for all levels', () => {
    for (let i = 0; i <= 9; i++) {
      const shadow = Shadows[i];
      expect(shadow.shadowColor).toBe('#000');
      expect(typeof shadow.shadowOpacity).toBe('number');
      expect(shadow.shadowOpacity).toBeGreaterThan(0);
      expect(shadow.shadowOpacity).toBeLessThan(1);
      expect(typeof shadow.shadowRadius).toBe('number');
      expect(shadow.shadowRadius).toBeGreaterThan(0);
    }
  });
});
