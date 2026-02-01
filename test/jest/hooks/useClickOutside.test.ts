import { renderHook } from '@testing-library/react-hooks';
import { useClickOutside } from '../../../src/hooks/useClickOutside';

describe('useClickOutside', () => {
  it('should return a ref and boolean state', () => {
    const { result } = renderHook(() => useClickOutside());
    const [ref, clickedOutside] = result.current;

    expect(ref).toHaveProperty('current');
    expect(typeof clickedOutside).toBe('boolean');
  });

  it('should return false initially', () => {
    const { result } = renderHook(() => useClickOutside());
    const [, clickedOutside] = result.current;

    expect(clickedOutside).toBe(false);
  });

  it('should have null ref initially', () => {
    const { result } = renderHook(() => useClickOutside());
    const [ref] = result.current;

    expect(ref.current).toBeNull();
  });

  it('should work with generic HTMLElement type', () => {
    const { result } = renderHook(() => useClickOutside<HTMLDivElement>());
    const [ref] = result.current;

    expect(ref.current).toBeNull();
  });

  it('should return a tuple of ref and boolean', () => {
    const { result } = renderHook(() => useClickOutside());

    expect(Array.isArray(result.current)).toBe(true);
    expect(result.current.length).toBe(2);
  });

  it('should be re-callable multiple times', () => {
    const { result: result1 } = renderHook(() => useClickOutside());
    const { result: result2 } = renderHook(() => useClickOutside());

    expect(result1.current).not.toBe(result2.current);
  });
});
