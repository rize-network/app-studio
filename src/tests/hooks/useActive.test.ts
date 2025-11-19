import { renderHook } from '@testing-library/react';
import { useActive } from '../../hooks/useActive';

describe('useActive', () => {
  it('should return a ref and boolean state', () => {
    const { result } = renderHook(() => useActive());
    const [ref, active] = result.current;

    expect(ref).toHaveProperty('current');
    expect(typeof active).toBe('boolean');
  });

  it('should return false initially', () => {
    const { result } = renderHook(() => useActive());
    const [, active] = result.current;

    expect(active).toBe(false);
  });

  it('should have null ref initially', () => {
    const { result } = renderHook(() => useActive());
    const [ref] = result.current;

    expect(ref.current).toBeNull();
  });

  it('should work with specific HTMLElement types', () => {
    const { result } = renderHook(() => useActive<HTMLButtonElement>());
    const [ref] = result.current;

    expect(ref.current).toBeNull();
  });

  it('should return a tuple of ref and boolean', () => {
    const { result } = renderHook(() => useActive());

    expect(Array.isArray(result.current)).toBe(true);
    expect(result.current).toHaveLength(2);
  });
});
