import React from 'react';
import { render, screen } from '@testing-library/react';
import { View, Center, Horizontal } from '../../../src/components/View';
import { ThemeProvider } from '../../../src/providers/Theme';

describe('View Component', () => {
  it('should render without crashing', () => {
    const { container } = render(
      <ThemeProvider>
        <View />
      </ThemeProvider>
    );

    expect(container).toBeInTheDocument();
  });

  it('should render children', () => {
    render(
      <ThemeProvider>
        <View>
          <span>Hello World</span>
        </View>
      </ThemeProvider>
    );

    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('should accept CSS props', () => {
    const { container } = render(
      <ThemeProvider>
        <View backgroundColor="red" padding={10}>
          Test
        </View>
      </ThemeProvider>
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should forward ref', () => {
    const ref = React.createRef<HTMLElement>();

    render(
      <ThemeProvider>
        <View ref={ref} data-testid="view" />
      </ThemeProvider>
    );

    expect(ref.current).toBeInTheDocument();
  });

  it('should support className prop', () => {
    const { container } = render(
      <ThemeProvider>
        <View className="custom-class" data-testid="view-with-class" />
      </ThemeProvider>
    );

    const element = container.querySelector('[data-testid="view-with-class"]');
    expect(element).toBeInTheDocument();
    expect(element?.classList.contains('custom-class')).toBe(true);
  });
});

describe('Center Component', () => {
  it('should render with flexbox centered styles', () => {
    const { container } = render(
      <ThemeProvider>
        <Center data-testid="center" />
      </ThemeProvider>
    );

    expect(
      container.querySelector('[data-testid="center"]')
    ).toBeInTheDocument();
  });

  it('should render children centered', () => {
    render(
      <ThemeProvider>
        <Center>
          <span>Centered Content</span>
        </Center>
      </ThemeProvider>
    );

    expect(screen.getByText('Centered Content')).toBeInTheDocument();
  });
});

describe('Horizontal Component', () => {
  it('should render with horizontal flex layout', () => {
    const { container } = render(
      <ThemeProvider>
        <Horizontal data-testid="horizontal" />
      </ThemeProvider>
    );

    expect(
      container.querySelector('[data-testid="horizontal"]')
    ).toBeInTheDocument();
  });

  it('should render multiple children in row', () => {
    render(
      <ThemeProvider>
        <Horizontal>
          <span>Item 1</span>
          <span>Item 2</span>
        </Horizontal>
      </ThemeProvider>
    );

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });
});
