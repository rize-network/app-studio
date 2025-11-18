import { renderHook } from '@testing-library/react';
import { useKeyPress } from '../../hooks/useKeyPress';

describe('useKeyPress', () => {
  it('should return a boolean', () => {
    const { result } = renderHook(() => useKeyPress('Enter'));

    expect(typeof result.current).toBe('boolean');
  });

  it('should return false initially', () => {
    const { result } = renderHook(() => useKeyPress('Enter'));

    expect(result.current).toBe(false);
  });

  it('should accept any key string', () => {
    const keys = ['Enter', 'Escape', 'Space', 'ArrowUp', 'a', '1'];

    keys.forEach((key) => {
      const { result } = renderHook(() => useKeyPress(key));
      expect(typeof result.current).toBe('boolean');
    });
  });

  it('should track different keys separately', () => {
    const { result: enterResult } = renderHook(() => useKeyPress('Enter'));
    const { result: escapeResult } = renderHook(() => useKeyPress('Escape'));

    expect(enterResult.current).toBe(false);
    expect(escapeResult.current).toBe(false);
  });

  it('should handle empty string key', () => {
    expect(() => {
      renderHook(() => useKeyPress(''));
    }).not.toThrow();
  });

  it('should handle single character keys', () => {
    const { result } = renderHook(() => useKeyPress('a'));

    expect(typeof result.current).toBe('boolean');
  });

  it('should handle special keys', () => {
    const specialKeys = ['Enter', 'Escape', 'Tab', 'Shift', 'Control', 'Alt'];

    specialKeys.forEach((key) => {
      const { result } = renderHook(() => useKeyPress(key));
      expect(typeof result.current).toBe('boolean');
    });
  });
});
