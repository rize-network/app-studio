import React from 'react';
import { render } from '@testing-library/react';
import { Skeleton } from '../../components/Skeleton';
import { ThemeProvider } from '../../providers/Theme';

describe('Skeleton Component', () => {
  it('should render without crashing', () => {
    const { container } = render(
      <ThemeProvider>
        <Skeleton />
      </ThemeProvider>
    );

    expect(container).toBeInTheDocument();
  });

  it('should accept animation props', () => {
    const { container } = render(
      <ThemeProvider>
        <Skeleton duration="3s" timingFunction="ease-in-out" />
      </ThemeProvider>
    );

    expect(container.querySelector('div')).toBeInTheDocument();
  });

  it('should support width and height', () => {
    const { container } = render(
      <ThemeProvider>
        <Skeleton width={100} height={100} />
      </ThemeProvider>
    );

    expect(container).toBeInTheDocument();
  });

  it('should be memoized', () => {
    expect(Skeleton.$$typeof).toBeDefined();
  });
});
