import { renderHook } from '@testing-library/react-hooks';
import {
  useScroll,
  useScrollAnimation,
  useSmoothScroll,
  useInfiniteScroll,
  useScrollDirection,
} from '../../../src/hooks/useScroll';

describe('useScroll', () => {
  it('should return ScrollPosition object', () => {
    const { result } = renderHook(() => useScroll());

    expect(result.current).toHaveProperty('x');
    expect(result.current).toHaveProperty('y');
    expect(result.current).toHaveProperty('xProgress');
    expect(result.current).toHaveProperty('yProgress');
  });

  it('should initialize with zero values', () => {
    const { result } = renderHook(() => useScroll());

    expect(result.current.x).toBe(0);
    expect(result.current.y).toBe(0);
  });

  it('should accept options', () => {
    expect(() => {
      renderHook(() =>
        useScroll({
          container: undefined,
          offset: [0, 0],
          throttleMs: 100,
          disabled: false,
        })
      );
    }).not.toThrow();
  });

  it('should handle disabled option', () => {
    const { result } = renderHook(() => useScroll({ disabled: true }));

    expect(typeof result.current.y).toBe('number');
  });

  it('should support custom throttle delay', () => {
    expect(() => {
      renderHook(() => useScroll({ throttleMs: 500 }));
    }).not.toThrow();
  });

  it('should support custom offset', () => {
    expect(() => {
      renderHook(() => useScroll({ offset: [10, 20] }));
    }).not.toThrow();
  });
});

describe('useScrollAnimation', () => {
  it('should return isInView and progress', () => {
    const ref = { current: null };
    const { result } = renderHook(() => useScrollAnimation(ref));

    expect(result.current).toHaveProperty('isInView');
    expect(result.current).toHaveProperty('progress');
  });

  it('should return false for isInView initially', () => {
    const ref = { current: null };
    const { result } = renderHook(() => useScrollAnimation(ref));

    expect(result.current.isInView).toBe(false);
  });

  it('should return 0 for progress initially', () => {
    const ref = { current: null };
    const { result } = renderHook(() => useScrollAnimation(ref));

    expect(result.current.progress).toBe(0);
  });

  it('should accept options', () => {
    const ref = { current: null };

    expect(() => {
      renderHook(() =>
        useScrollAnimation(ref, {
          threshold: 0.5,
          rootMargin: '10px',
        })
      );
    }).not.toThrow();
  });
});

describe('useSmoothScroll', () => {
  it('should return a function', () => {
    const { result } = renderHook(() => useSmoothScroll());

    expect(typeof result.current).toBe('function');
  });

  it('should handle null element', () => {
    const { result } = renderHook(() => useSmoothScroll());

    expect(() => {
      result.current(null);
    }).not.toThrow();
  });

  it('should accept optional offset', () => {
    const { result } = renderHook(() => useSmoothScroll());
    const div = document.createElement('div');

    expect(() => {
      result.current(div, 100);
    }).not.toThrow();
  });
});

describe('useInfiniteScroll', () => {
  it('should return sentinelRef setter', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useInfiniteScroll(callback));

    expect(result.current).toHaveProperty('sentinelRef');
    expect(typeof result.current.sentinelRef).toBe('function');
  });

  it('should work with callback function', () => {
    const callback = jest.fn();

    expect(() => {
      renderHook(() => useInfiniteScroll(callback));
    }).not.toThrow();
  });

  it('should accept options', () => {
    const callback = jest.fn();

    expect(() => {
      renderHook(() =>
        useInfiniteScroll(callback, {
          threshold: 0.5,
          isLoading: false,
          debounceMs: 300,
        })
      );
    }).not.toThrow();
  });
});

describe('useScrollDirection', () => {
  it('should return scroll direction', () => {
    const { result } = renderHook(() => useScrollDirection());

    expect(typeof result.current).toBe('string');
    expect(['up', 'down']).toContain(result.current);
  });

  it('should initialize as up', () => {
    const { result } = renderHook(() => useScrollDirection());

    expect(result.current).toBe('up');
  });

  it('should accept threshold option', () => {
    expect(() => {
      renderHook(() => useScrollDirection(10));
    }).not.toThrow();
  });
});
