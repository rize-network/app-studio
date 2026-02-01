import { renderHook } from '@testing-library/react-hooks';
import { useHover } from '../../../src/hooks/useHover';

describe('useHover', () => {
  it('should return a ref and boolean state', () => {
    const { result } = renderHook(() => useHover());
    const [ref, hover] = result.current;

    expect(ref).toHaveProperty('current');
    expect(typeof hover).toBe('boolean');
  });

  it('should return false initially', () => {
    const { result } = renderHook(() => useHover());
    const [, hover] = result.current;

    expect(hover).toBe(false);
  });

  it('should have null ref initially', () => {
    const { result } = renderHook(() => useHover());
    const [ref] = result.current;

    expect(ref.current).toBeNull();
  });

  it('should work with HTMLElement types', () => {
    const { result } = renderHook(() => useHover<HTMLButtonElement>());
    const [ref] = result.current;

    expect(ref.current).toBeNull();
  });

  it('should return new array on each call', () => {
    const { result: result1 } = renderHook(() => useHover());
    const { result: result2 } = renderHook(() => useHover());

    expect(result1.current).not.toBe(result2.current);
  });
});
