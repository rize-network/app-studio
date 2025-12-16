import React from 'react';
import { render } from '@testing-library/react';
import { View, Horizontal, Vertical } from '../components/View';
import { ThemeProvider } from '../providers/Theme';
import { Text } from '../components/Text';

// Mock matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('Regression Suite', () => {
  it('renders View with basic styles', () => {
    const { container } = render(
      <ThemeProvider>
        <View backgroundColor="red" padding={10} margin={20} />
      </ThemeProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders Text with typography props', () => {
    const { container } = render(
      <ThemeProvider>
        <Text fontSize={16} fontWeight="bold" color="blue">
          Hello World
        </Text>
      </ThemeProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders Horizontal stack (flex row)', () => {
    const { container } = render(
      <ThemeProvider>
        <Horizontal gap={10}>
          <View width={50} height={50} backgroundColor="red" />
          <View width={50} height={50} backgroundColor="blue" />
        </Horizontal>
      </ThemeProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders Vertical stack (flex column)', () => {
    const { container } = render(
      <ThemeProvider>
        <Vertical padding={5}>
          <View flex={1} />
          <View flex={2} />
        </Vertical>
      </ThemeProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders pseudo-selectors (_hover)', () => {
    const { container } = render(
      <ThemeProvider>
        <View
          backgroundColor="white"
          _hover={{ backgroundColor: 'gray' }}
          _active={{ opacity: 0.8 }}
        />
      </ThemeProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders media queries', () => {
    const { container } = render(
      <ThemeProvider>
        <View
          width={100}
          media={{
            mobile: { width: '100%' },
            tablet: { width: '50%' },
          }}
        />
      </ThemeProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders custom tokens', () => {
    const { container } = render(
      <ThemeProvider>
        <View backgroundColor="color.blue.500" color="theme.primary" />
      </ThemeProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
