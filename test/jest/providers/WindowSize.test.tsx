import React from 'react';
import { render, screen } from '@testing-library/react';
import { WindowSizeProvider } from '../../../src/providers/WindowSize';
import { useWindowSize } from '../../../src/hooks/useWindowSize';

describe('WindowSizeProvider', () => {
  const TestComponent = () => {
    const { width, height } = useWindowSize();

    return (
      <div>
        <div data-testid="width">{width}</div>
        <div data-testid="height">{height}</div>
      </div>
    );
  };

  it('should provide window size context to children', () => {
    render(
      <WindowSizeProvider>
        <TestComponent />
      </WindowSizeProvider>
    );

    expect(screen.getByTestId('width')).toBeInTheDocument();
    expect(screen.getByTestId('height')).toBeInTheDocument();
  });

  it('should display window width and height', () => {
    render(
      <WindowSizeProvider>
        <TestComponent />
      </WindowSizeProvider>
    );

    const width = screen.getByTestId('width').textContent;
    const height = screen.getByTestId('height').textContent;

    expect(width).toBeTruthy();
    expect(height).toBeTruthy();
    expect(parseInt(width!)).toBeGreaterThan(0);
    expect(parseInt(height!)).toBeGreaterThan(0);
  });

  it.skip('should throw error when used outside provider', () => {
    expect(() => {
      render(<TestComponent />);
    }).toThrow();
  });

  it('should return an object with width and height properties', () => {
    render(
      <WindowSizeProvider>
        <TestComponent />
      </WindowSizeProvider>
    );

    const width = screen.getByTestId('width').textContent;
    const height = screen.getByTestId('height').textContent;

    expect(width).toMatch(/^\d+$/);
    expect(height).toMatch(/^\d+$/);
  });
});

describe('useWindowSize hook', () => {
  it('should return object with width and height', () => {
    const TestComp = () => {
      const size = useWindowSize();

      return (
        <div>
          <span>{typeof size.width === 'number' && 'width-ok'}</span>
          <span>{typeof size.height === 'number' && 'height-ok'}</span>
        </div>
      );
    };

    render(
      <WindowSizeProvider>
        <TestComp />
      </WindowSizeProvider>
    );

    expect(screen.getByText('width-ok')).toBeInTheDocument();
    expect(screen.getByText('height-ok')).toBeInTheDocument();
  });
});
