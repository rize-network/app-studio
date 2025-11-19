import { renderHook } from '@testing-library/react';
import { useFocus } from '../../hooks/useFocus';

describe('useFocus', () => {
  it('should return a ref and boolean state', () => {
    const { result } = renderHook(() => useFocus());
    const [ref, focused] = result.current;

    expect(ref).toHaveProperty('current');
    expect(typeof focused).toBe('boolean');
  });

  it('should return false initially', () => {
    const { result } = renderHook(() => useFocus());
    const [, focused] = result.current;

    expect(focused).toBe(false);
  });

  it('should have null ref initially', () => {
    const { result } = renderHook(() => useFocus());
    const [ref] = result.current;

    expect(ref.current).toBeNull();
  });

  it('should work with specific HTMLElement types', () => {
    const { result } = renderHook(() => useFocus<HTMLInputElement>());
    const [ref] = result.current;

    expect(ref.current).toBeNull();
  });

  it('should return a tuple structure', () => {
    const { result } = renderHook(() => useFocus());

    expect(Array.isArray(result.current)).toBe(true);
    expect(result.current.length).toBe(2);
  });
});
