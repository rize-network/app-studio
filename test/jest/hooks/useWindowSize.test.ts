import { renderHook } from '@testing-library/react-hooks';
import { useWindowSize } from '../../../src/hooks/useWindowSize';
import { WindowSizeProvider } from '../../../src/providers/WindowSize';

describe('useWindowSize', () => {
  // Testing context hooks requires wrapping with provider

  it('should be a callable function', () => {
    expect(typeof useWindowSize).toBe('function');
  });

  it.skip('should throw error when used outside provider', () => {
    expect(() => {
      renderHook(() => useWindowSize());
    }).toThrow();
  });

  it('should work with WindowSizeProvider wrapper', () => {
    expect(() => {
      renderHook(() => useWindowSize(), {
        wrapper: WindowSizeProvider as any,
      });
    }).not.toThrow();
  });
});
