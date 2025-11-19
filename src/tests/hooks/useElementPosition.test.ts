import { renderHook } from '@testing-library/react';
import { useElementPosition } from '../../hooks/useElementPosition';

describe('useElementPosition', () => {
  it('should return object with ref, relation, and updateRelation', () => {
    const { result } = renderHook(() => useElementPosition());

    expect(result.current).toHaveProperty('ref');
    expect(result.current).toHaveProperty('relation');
    expect(result.current).toHaveProperty('updateRelation');
  });

  it('should have null relation initially', () => {
    const { result } = renderHook(() => useElementPosition());

    expect(result.current.relation).toBeNull();
  });

  it('should have null ref initially', () => {
    const { result } = renderHook(() => useElementPosition());

    expect(result.current.ref.current).toBeNull();
  });

  it('should have updateRelation as function', () => {
    const { result } = renderHook(() => useElementPosition());

    expect(typeof result.current.updateRelation).toBe('function');
  });

  it('should accept options', () => {
    expect(() => {
      renderHook(() =>
        useElementPosition({
          trackChanges: true,
          throttleMs: 500,
          trackOnHover: true,
          trackOnScroll: false,
          trackOnResize: false,
        })
      );
    }).not.toThrow();
  });

  it('should support default options', () => {
    const { result } = renderHook(() => useElementPosition());

    expect(result.current.ref).toBeDefined();
    expect(result.current.relation).toBeNull();
    expect(typeof result.current.updateRelation).toBe('function');
  });

  it('should work with specific HTMLElement type', () => {
    expect(() => {
      renderHook(() => useElementPosition<HTMLDivElement>());
    }).not.toThrow();
  });

  it('should support disabling tracking', () => {
    expect(() => {
      renderHook(() =>
        useElementPosition({
          trackChanges: false,
        })
      );
    }).not.toThrow();
  });

  it('should support custom throttle delay', () => {
    expect(() => {
      renderHook(() =>
        useElementPosition({
          throttleMs: 1000,
        })
      );
    }).not.toThrow();
  });
});
