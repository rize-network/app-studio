import React from 'react';
import { render } from '@testing-library/react';
import { Text } from '../../../src/components/Text';
import { ThemeProvider } from '../../../src/providers/Theme';

describe('Text Component', () => {
  it('should render text content', () => {
    const { getByText } = render(
      <ThemeProvider>
        <Text>Hello World</Text>
      </ThemeProvider>
    );

    expect(getByText('Hello World')).toBeInTheDocument();
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
    const { getByText } = render(
      <ThemeProvider>
        <Text toUpperCase>hello world</Text>
      </ThemeProvider>
    );

    expect(getByText('HELLO WORLD')).toBeInTheDocument();
  });

  it('should not uppercase non-string children', () => {
    const { container: testContainer } = render(
      <ThemeProvider>
        <Text toUpperCase data-testid="text-with-child">
          <span data-testid="child-span">Hello</span>
        </Text>
      </ThemeProvider>
    );

    expect(
      testContainer.querySelector('[data-testid="child-span"]')
    ).toBeInTheDocument();
  });

  it('should support CSS styling props', () => {
    const { getByText } = render(
      <ThemeProvider>
        <Text fontSize={16} color="red">
          Styled Text
        </Text>
      </ThemeProvider>
    );

    expect(getByText('Styled Text')).toBeInTheDocument();
  });

  it.each([
    ['number', 1.6],
    ['string', '1.6'],
  ])('should render a %s line-height multiplier without pixels', (_, value) => {
    const { getByTestId } = render(
      <ThemeProvider>
        <Text data-testid="line-height" fontSize={20} lineHeight={value}>
          Two lines
        </Text>
      </ThemeProvider>
    );

    expect(window.getComputedStyle(getByTestId('line-height')).lineHeight).toBe(
      '1.6'
    );
  });

  it('should keep fractional absolute line-height precision', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <Text data-testid="line-height" lineHeight={20.5}>
          Precise line height
        </Text>
      </ThemeProvider>
    );

    expect(window.getComputedStyle(getByTestId('line-height')).lineHeight).toBe(
      '20.5px'
    );
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
        <Text data-testid="empty-text" />
      </ThemeProvider>
    );

    const element = container.querySelector('[data-testid="empty-text"]');
    expect(element).toBeInTheDocument();
    expect(element?.tagName.toLowerCase()).toBe('span');
  });
});
