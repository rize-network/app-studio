import React from 'react';
import { render } from '@testing-library/react';
import {
  View,
  Center,
  Horizontal,
  Vertical,
} from '../../../src/components/View';
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
    const { getByText } = render(
      <ThemeProvider>
        <View>
          <span>Hello World</span>
        </View>
      </ThemeProvider>
    );

    expect(getByText('Hello World')).toBeInTheDocument();
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

    const center = container.querySelector(
      '[data-testid="center"]'
    ) as HTMLElement;
    const styles = window.getComputedStyle(center);

    expect(center).toBeInTheDocument();
    expect(styles.display).toBe('flex');
    expect(styles.justifyContent).toBe('center');
    expect(styles.alignItems).toBe('center');
  });

  it('should keep its centering contract when conflicting props are passed', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <Center
          data-testid="center-contract"
          display="block"
          justifyContent="flex-start"
          alignItems="stretch"
        />
      </ThemeProvider>
    );

    const styles = window.getComputedStyle(getByTestId('center-contract'));
    expect(styles.display).toBe('flex');
    expect(styles.justifyContent).toBe('center');
    expect(styles.alignItems).toBe('center');
  });

  it('should render children centered', () => {
    const { getByText } = render(
      <ThemeProvider>
        <Center>
          <span>Centered Content</span>
        </Center>
      </ThemeProvider>
    );

    expect(getByText('Centered Content')).toBeInTheDocument();
  });
});

describe('Horizontal Component', () => {
  it('should render with horizontal flex layout', () => {
    const { container } = render(
      <ThemeProvider>
        <Horizontal data-testid="horizontal" />
      </ThemeProvider>
    );

    const horizontal = container.querySelector(
      '[data-testid="horizontal"]'
    ) as HTMLElement;
    const styles = window.getComputedStyle(horizontal);

    expect(horizontal).toBeInTheDocument();
    expect(styles.display).toBe('flex');
    expect(styles.flexDirection).toBe('row');
  });

  it('should keep the row direction when a conflicting prop is passed', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <Horizontal
          data-testid="horizontal-contract"
          display="block"
          flexDirection="column"
        />
      </ThemeProvider>
    );

    const styles = window.getComputedStyle(getByTestId('horizontal-contract'));
    expect(styles.display).toBe('flex');
    expect(styles.flexDirection).toBe('row');
  });

  it('should render multiple children in row', () => {
    const { getByText } = render(
      <ThemeProvider>
        <Horizontal>
          <span>Item 1</span>
          <span>Item 2</span>
        </Horizontal>
      </ThemeProvider>
    );

    expect(getByText('Item 1')).toBeInTheDocument();
    expect(getByText('Item 2')).toBeInTheDocument();
  });
});

describe('Vertical Component', () => {
  it('should keep its flex column layout contract', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <Vertical
          data-testid="vertical-contract"
          display="block"
          flexDirection="row"
        />
      </ThemeProvider>
    );

    const styles = window.getComputedStyle(getByTestId('vertical-contract'));
    expect(styles.display).toBe('flex');
    expect(styles.flexDirection).toBe('column');
  });
});
