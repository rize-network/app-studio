import React from 'react';
import { render, screen } from '@testing-library/react';
import { Text } from '../../components/Text';
import { ThemeProvider } from '../../providers/Theme';

describe('Text Component', () => {
  it('should render text content', () => {
    render(
      <ThemeProvider>
        <Text>Hello World</Text>
      </ThemeProvider>
    );

    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('should render as span element', () => {
    const { container } = render(
      <ThemeProvider>
        <Text data-testid="text-element">Test</Text>
      </ThemeProvider>
    );

    const element = container.querySelector('[data-testid="text-element"]');
    expect(element?.tagName.toLowerCase()).toBe('span');
  });

  it('should support toUpperCase prop', () => {
    render(
      <ThemeProvider>
        <Text toUpperCase>hello world</Text>
      </ThemeProvider>
    );

    expect(screen.getByText('HELLO WORLD')).toBeInTheDocument();
  });

  it('should not uppercase non-string children', () => {
    const { container: testContainer } = render(
      <ThemeProvider>
        <Text toUpperCase>
          <span>Hello</span>
        </Text>
      </ThemeProvider>
    );

    expect(testContainer.querySelector('span')).toBeInTheDocument();
  });

  it('should support CSS styling props', () => {
    render(
      <ThemeProvider>
        <Text fontSize={16} color="red">
          Styled Text
        </Text>
      </ThemeProvider>
    );

    expect(screen.getByText('Styled Text')).toBeInTheDocument();
  });

  it('should forward ref', () => {
    const ref = React.createRef<HTMLElement>();

    render(
      <ThemeProvider>
        <Text ref={ref}>Text with ref</Text>
      </ThemeProvider>
    );

    expect(ref.current).toBeInTheDocument();
  });

  it('should render empty when no children', () => {
    const { container } = render(
      <ThemeProvider>
        <Text />
      </ThemeProvider>
    );

    expect(container.querySelector('span')).toBeInTheDocument();
  });
});
