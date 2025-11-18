import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  ResponsiveProvider,
  useResponsiveContext,
} from '../../providers/Responsive';

describe('ResponsiveProvider', () => {
  const TestComponent = () => {
    const {
      currentBreakpoint,
      currentDevice,
      orientation,
      currentWidth,
      currentHeight,
    } = useResponsiveContext();

    return (
      <div>
        <div data-testid="breakpoint">{currentBreakpoint}</div>
        <div data-testid="device">{currentDevice}</div>
        <div data-testid="orientation">{orientation}</div>
        <div data-testid="width">{currentWidth}</div>
        <div data-testid="height">{currentHeight}</div>
      </div>
    );
  };

  it('should provide responsive context to children', () => {
    render(
      <ResponsiveProvider>
        <TestComponent />
      </ResponsiveProvider>
    );

    expect(screen.getByTestId('breakpoint')).toBeInTheDocument();
    expect(screen.getByTestId('device')).toBeInTheDocument();
    expect(screen.getByTestId('orientation')).toBeInTheDocument();
  });

  it('should display current breakpoint', () => {
    render(
      <ResponsiveProvider>
        <TestComponent />
      </ResponsiveProvider>
    );

    const breakpoint = screen.getByTestId('breakpoint').textContent;
    expect(['xs', 'sm', 'md', 'lg', 'xl']).toContain(breakpoint);
  });

  it('should display current device type', () => {
    render(
      <ResponsiveProvider>
        <TestComponent />
      </ResponsiveProvider>
    );

    const device = screen.getByTestId('device').textContent;
    expect(['mobile', 'tablet', 'desktop']).toContain(device);
  });

  it('should display screen orientation', () => {
    render(
      <ResponsiveProvider>
        <TestComponent />
      </ResponsiveProvider>
    );

    const orientation = screen.getByTestId('orientation').textContent;
    expect(['portrait', 'landscape']).toContain(orientation);
  });

  it('should throw error when used outside provider', () => {
    expect(() => {
      render(<TestComponent />);
    }).toThrow();
  });

  it('should accept custom breakpoints', () => {
    const customBreakpoints = {
      small: 0,
      medium: 600,
      large: 1200,
    };

    render(
      <ResponsiveProvider breakpoints={customBreakpoints}>
        <TestComponent />
      </ResponsiveProvider>
    );

    const breakpoint = screen.getByTestId('breakpoint').textContent;
    expect(['small', 'medium', 'large']).toContain(breakpoint);
  });

  it('should display current width and height', () => {
    render(
      <ResponsiveProvider>
        <TestComponent />
      </ResponsiveProvider>
    );

    const width = parseInt(screen.getByTestId('width').textContent || '0');
    const height = parseInt(screen.getByTestId('height').textContent || '0');

    expect(width).toBeGreaterThan(0);
    expect(height).toBeGreaterThan(0);
  });
});

describe('useResponsiveContext', () => {
  const TestComp = () => {
    const context = useResponsiveContext();

    return (
      <div>
        <span data-testid="has-breakpoints">
          {typeof context.breakpoints === 'object' && 'ok'}
        </span>
        <span data-testid="has-mediaQueries">
          {typeof context.mediaQueries === 'object' && 'ok'}
        </span>
        <span data-testid="has-devices">
          {typeof context.devices === 'object' && 'ok'}
        </span>
      </div>
    );
  };

  it('should return context with all required properties', () => {
    render(
      <ResponsiveProvider>
        <TestComp />
      </ResponsiveProvider>
    );

    expect(screen.getByTestId('has-breakpoints')).toHaveTextContent('ok');
    expect(screen.getByTestId('has-mediaQueries')).toHaveTextContent('ok');
    expect(screen.getByTestId('has-devices')).toHaveTextContent('ok');
  });
});
