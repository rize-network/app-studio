import React from 'react';
import { render } from '@testing-library/react';

import { ResponsiveProvider } from '../../../src/providers/Responsive';
import { ThemeProvider } from '../../../src/providers/Theme';
import { View } from '../../../src/components/View';

/**
 * Two failure modes that used to be completely invisible.
 *
 * Neither produced a type error, an exception, or a failing test: a colour
 * token that does not resolve simply never paints, and `ResponsiveProvider`
 * threw only in environments without `matchMedia` — which is to say, in the
 * consumer's unit tests rather than in the author's browser.
 */

describe('ResponsiveProvider in an environment without matchMedia', () => {
  it('mounts instead of throwing', () => {
    const original = Object.getOwnPropertyDescriptor(window, 'matchMedia');
    // jsdom declares the property but leaves it undefined; reproduce that.
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: undefined,
    });

    try {
      expect(() =>
        render(
          <ThemeProvider>
            <ResponsiveProvider>
              <View>ok</View>
            </ResponsiveProvider>
          </ThemeProvider>
        )
      ).not.toThrow();
    } finally {
      if (original) Object.defineProperty(window, 'matchMedia', original);
    }
  });
});

describe('unresolvable colour tokens are reported in development', () => {
  let warn: jest.SpyInstance;

  beforeEach(() => {
    warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    warn.mockRestore();
  });

  const renderWith = (color: string) =>
    render(
      <ThemeProvider>
        <View color={color}>token</View>
      </ThemeProvider>
    );

  const messages = () => warn.mock.calls.map((call) => String(call[0]));

  it('flags dot notation and names the dashed replacement', () => {
    renderWith('color.gray.500');

    expect(messages().some((m) => m.includes('color.gray.500'))).toBe(true);
    expect(messages().some((m) => m.includes('color-gray-500'))).toBe(true);
  });

  it('flags a misspelled palette', () => {
    renderWith('color-grey-500');
    expect(messages().some((m) => m.includes('color-grey-500'))).toBe(true);
  });

  it('flags a shade the palette does not define', () => {
    renderWith('color-gray-1234');
    expect(messages().some((m) => m.includes('color-gray-1234'))).toBe(true);
  });

  it('flags an unknown theme slot', () => {
    renderWith('theme-primry');
    expect(messages().some((m) => m.includes('theme-primry'))).toBe(true);
  });

  it('stays silent for real tokens and for plain CSS colours', () => {
    renderWith('color-gray-500');
    renderWith('theme-primary');
    renderWith('#ffffff');
    renderWith('rgb(1, 2, 3)');
    renderWith('transparent');

    expect(messages().filter((m) => m.includes('[Theme]'))).toEqual([]);
  });
});
