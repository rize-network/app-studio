import { renderHook } from '@testing-library/react-hooks';
import { useOnScreen } from '../../hooks/useOnScreen';

describe('useOnScreen', () => {
  it('should return a ref and boolean state', () => {
    const { result } = renderHook(() => useOnScreen());
    const [ref, isOnScreen] = result.current;

    expect(ref).toHaveProperty('current');
    expect(typeof isOnScreen).toBe('boolean');
  });

  it('should return false initially', () => {
    const { result } = renderHook(() => useOnScreen());
    const [, isOnScreen] = result.current;

    expect(isOnScreen).toBe(false);
  });

  it('should have null ref initially', () => {
    const { result } = renderHook(() => useOnScreen());
    const [ref] = result.current;

    expect(ref.current).toBeNull();
  });

  it('should accept IntersectionObserver options', () => {
    expect(() => {
      renderHook(() =>
        useOnScreen({
          threshold: 0.5,
          rootMargin: '10px',
        })
      );
    }).not.toThrow();
  });

  it('should work with specific HTMLElement types', () => {
    const { result } = renderHook(() => useOnScreen<HTMLDivElement>());
    const [ref] = result.current;

    expect(ref.current).toBeNull();
  });

  it('should return a tuple structure', () => {
    const { result } = renderHook(() => useOnScreen());

    expect(Array.isArray(result.current)).toBe(true);
    expect(result.current.length).toBe(2);
  });

  it('should work without options', () => {
    const { result } = renderHook(() => useOnScreen());

    expect(result.current).toBeDefined();
    expect(Array.isArray(result.current)).toBe(true);
  });

  it('should support multiple threshold values', () => {
    expect(() => {
      renderHook(() =>
        useOnScreen({
          threshold: [0, 0.5, 1],
        })
      );
    }).not.toThrow();
  });
});
