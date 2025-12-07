import { renderHook } from '@testing-library/react-hooks';
import { useMount } from '../../hooks/useMount';

describe('useMount', () => {
  it('should call callback on mount', () => {
    const callback = jest.fn();
    renderHook(() => useMount(callback));

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should call callback with no arguments', () => {
    const callback = jest.fn();
    renderHook(() => useMount(callback));

    expect(callback).toHaveBeenCalledWith();
  });

  it('should only call callback once', () => {
    const callback = jest.fn();
    const { rerender } = renderHook(() => useMount(callback));

    expect(callback).toHaveBeenCalledTimes(1);

    rerender();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should not throw error with empty callback', () => {
    expect(() => {
      renderHook(() => useMount(() => {}));
    }).not.toThrow();
  });

  it('should execute callback logic', () => {
    const state = { value: 0 };
    const callback = () => {
      state.value = 42;
    };

    renderHook(() => useMount(callback));
    expect(state.value).toBe(42);
  });
});
