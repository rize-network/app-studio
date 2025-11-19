import React from 'react';
import { render, screen } from '@testing-library/react';
import Wrapper from '../../components/Wrapper';
import { useWindowSize } from '../../hooks/useWindowSize';
import { useResponsive } from '../../hooks/useResponsive';
import { useTheme } from '../../providers/Theme';

describe('Wrapper Component', () => {
  it('should render children', () => {
    render(
      <Wrapper>
        <span>Test Content</span>
      </Wrapper>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should provide Theme context', () => {
    const TestComponent = () => {
      try {
        const theme = useTheme();
        return <div>{theme ? 'theme-ok' : 'theme-fail'}</div>;
      } catch {
        return <div>theme-error</div>;
      }
    };

    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    expect(screen.getByText('theme-ok')).toBeInTheDocument();
  });

  it('should provide ResponsiveProvider', () => {
    const TestComponent = () => {
      try {
        const responsive = useResponsive();
        return <div>{responsive ? 'responsive-ok' : 'responsive-fail'}</div>;
      } catch {
        return <div>responsive-error</div>;
      }
    };

    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    expect(screen.getByText('responsive-ok')).toBeInTheDocument();
  });

  it('should provide WindowSizeProvider', () => {
    const TestComponent = () => {
      try {
        const size = useWindowSize();
        return <div>{size && size.width > 0 ? 'size-ok' : 'size-fail'}</div>;
      } catch {
        return <div>size-error</div>;
      }
    };

    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    expect(screen.getByText('size-ok')).toBeInTheDocument();
  });

  it('should support multiple children', () => {
    render(
      <Wrapper>
        <span>Child 1</span>
        <span>Child 2</span>
      </Wrapper>
    );

    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });
});
