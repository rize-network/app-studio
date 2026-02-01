import { renderHook } from '@testing-library/react-hooks';
import { useInView } from '../../../src/hooks/useInView';

describe('useInView', () => {
  it('should return ref and inView state', () => {
    const { result } = renderHook(() => useInView());

    expect(result.current).toHaveProperty('ref');
    expect(result.current).toHaveProperty('inView');
  });

  it('should have null ref initially', () => {
    const { result } = renderHook(() => useInView());

    expect(result.current.ref.current).toBeNull();
  });

  it('should return false for inView initially', () => {
    const { result } = renderHook(() => useInView());

    expect(result.current.inView).toBe(false);
  });

  it('should accept options', () => {
    expect(() => {
      renderHook(() =>
        useInView({
          triggerOnce: true,
          threshold: 0.5,
        })
      );
    }).not.toThrow();
  });

  it('should support triggerOnce option', () => {
    expect(() => {
      renderHook(() => useInView({ triggerOnce: true }));
    }).not.toThrow();
  });

  it('should support IntersectionObserver options', () => {
    expect(() => {
      renderHook(() =>
        useInView({
          threshold: [0, 0.5, 1],
          rootMargin: '10px',
        })
      );
    }).not.toThrow();
  });

  it('should work without options', () => {
    const { result } = renderHook(() => useInView());

    expect(result.current.ref).toBeDefined();
    expect(typeof result.current.inView).toBe('boolean');
  });
});
