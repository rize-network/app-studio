import { renderHook } from '@testing-library/react-hooks';
import { useResponsive } from '../../../src/hooks/useResponsive';
import { ResponsiveProvider } from '../../../src/providers/Responsive';

describe('useResponsive', () => {
  // Note: Testing context hooks requires wrapping with provider
  // For now, these tests verify the hook signature and basic behavior

  it('should be a callable function', () => {
    expect(typeof useResponsive).toBe('function');
  });

  it.skip('should throw error when used outside provider', () => {
    // This test verifies that the hook behaves correctly
    expect(() => {
      renderHook(() => useResponsive());
    }).toThrow();
  });

  it('should work with ResponsiveProvider wrapper', () => {
    expect(() => {
      renderHook(() => useResponsive(), {
        wrapper: ResponsiveProvider as any,
      });
    }).not.toThrow();
  });
});
