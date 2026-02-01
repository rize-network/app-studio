import React from 'react';
import { render } from '@testing-library/react';
import { Skeleton } from '../../../src/components/Skeleton';
import { ThemeProvider } from '../../../src/providers/Theme';

describe('Skeleton Component', () => {
  it('should render without crashing', () => {
    const { container } = render(
      <ThemeProvider>
        <Skeleton />
      </ThemeProvider>
    );

    expect(container).toBeInTheDocument();
  });

  it('should accept data-testid prop', () => {
    const { container } = render(
      <ThemeProvider>
        <Skeleton data-testid="skeleton-loader" />
      </ThemeProvider>
    );

    expect(container.querySelector('[data-testid="skeleton-loader"]')).toBeInTheDocument();
  });

  it('should accept animation props', () => {
    const { container } = render(
      <ThemeProvider>
        <Skeleton duration="3s" timingFunction="ease-in-out" />
      </ThemeProvider>
    );

    expect(container.querySelector('div')).toBeInTheDocument();
  });

  it('should accept animation props with data-testid', () => {
    const { container } = render(
      <ThemeProvider>
        <Skeleton
          duration="3s"
          timingFunction="ease-in-out"
          data-testid="animated-skeleton"
        />
      </ThemeProvider>
    );

    expect(container.querySelector('[data-testid="animated-skeleton"]')).toBeInTheDocument();
  });

  it('should support width and height', () => {
    const { container } = render(
      <ThemeProvider>
        <Skeleton width={100} height={100} />
      </ThemeProvider>
    );

    expect(container).toBeInTheDocument();
  });

  it('should support width and height with data-testid', () => {
    const { container } = render(
      <ThemeProvider>
        <Skeleton width={100} height={100} data-testid="sized-skeleton" />
      </ThemeProvider>
    );

    const skeleton = container.querySelector('[data-testid="sized-skeleton"]');
    expect(skeleton).toBeInTheDocument();
  });

  it('should be memoized', () => {
    expect(Skeleton.$$typeof).toBeDefined();
  });

  it('should support custom styling props with data-testid', () => {
    const { container } = render(
      <ThemeProvider>
        <Skeleton
          width={200}
          height={50}
          borderRadius={8}
          data-testid="styled-skeleton"
        />
      </ThemeProvider>
    );

    expect(container.querySelector('[data-testid="styled-skeleton"]')).toBeInTheDocument();
  });
});
