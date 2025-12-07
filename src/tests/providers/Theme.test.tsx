import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, useTheme, deepMerge } from '../../providers/Theme';

describe('ThemeProvider', () => {
  const TestComponent = () => {
    const { getColor, themeMode } = useTheme();

    return (
      <div>
        <div data-testid="theme-mode">{themeMode}</div>
        <div data-testid="primary-color">{getColor('color.white')}</div>
      </div>
    );
  };

  it('should provide theme context to children', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-mode')).toBeInTheDocument();
  });

  it('should default to light mode', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('light');
  });

  it('should support dark mode', () => {
    render(
      <ThemeProvider mode="dark">
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');
  });

  it.skip('should throw error when used outside provider', () => {
    expect(() => {
      render(<TestComponent />);
    }).toThrow();
  });

  it('should provide getColor function', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('primary-color')).toBeInTheDocument();
  });
});

describe('deepMerge', () => {
  it('should merge objects deeply', () => {
    const target = { a: { b: 1 } };
    const source = { a: { c: 2 } };

    const result = deepMerge(target, source);

    expect(result).toEqual({ a: { b: 1, c: 2 } });
  });

  it('should handle arrays by overwriting', () => {
    const target = { arr: [1, 2] };
    const source = { arr: [3, 4] };

    const result = deepMerge(target, source);

    expect(result.arr).toEqual([3, 4]);
  });

  it('should not merge undefined values', () => {
    const target = { a: 1 };
    const source = { b: undefined };

    const result = deepMerge(target, source);

    expect(result).toEqual({ a: 1 });
  });

  it('should handle null source', () => {
    const target = { a: 1 };
    const source = null;

    const result = deepMerge(target, source);

    expect(result).toEqual({ a: 1 });
  });

  it('should handle primitive source', () => {
    const target = { a: 1 };

    const result = deepMerge(target, 'string');

    expect(result).toEqual({ a: 1 });
  });
});
