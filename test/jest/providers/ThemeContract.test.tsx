import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, ThemeSlots, useTheme } from '../../../src/providers/Theme';

// Reads the CSS the provider injects into <head>.
const injectedCss = (): string =>
  document.getElementById('app-studio-theme-vars')?.textContent ?? '';

afterEach(() => {
  document.getElementById('app-studio-theme-vars')?.remove();
  document.documentElement.removeAttribute('data-theme');
});

describe('default theme contract', () => {
  it('emits a light neutral default theme (no dark/purple default)', () => {
    render(
      <ThemeProvider>
        <div>content</div>
      </ThemeProvider>
    );

    const css = injectedCss();
    // Neutral slots resolve to auto-flipping tokens, light-first.
    expect(css).toContain('--theme-canvas:var(--color-white)');
    expect(css).toContain('--theme-surface:var(--color-gray-50)');
    expect(css).toContain('--theme-text:var(--color-black)');
    expect(css).toContain('--theme-primary:var(--color-black)');
    // The historical dark default that leaked into portaled content.
    expect(css).not.toContain('#663399');
    expect(css).not.toContain('#121212');
  });

  it('defaults to light mode', () => {
    const Mode = () => <div data-testid="mode">{useTheme().themeMode}</div>;
    render(
      <ThemeProvider>
        <Mode />
      </ThemeProvider>
    );
    expect(screen.getByTestId('mode')).toHaveTextContent('light');
  });
});

describe('theme-* light/dark flip contract', () => {
  it('re-declares token-referencing theme vars inside both mode blocks so they flip', () => {
    render(
      <ThemeProvider theme={{ primary: 'color-blue-500' }}>
        <div />
      </ThemeProvider>
    );
    const css = injectedCss();
    const darkBlock = css.slice(css.indexOf("[data-theme='dark']"));
    const lightBlock = css.slice(
      css.indexOf("[data-theme='light']"),
      css.indexOf("[data-theme='dark']")
    );
    expect(lightBlock).toContain('--theme-primary:var(--color-blue-500)');
    expect(darkBlock).toContain('--theme-primary:var(--color-blue-500)');
  });

  it('snaps a literal hex theme value to the nearest palette token so it adapts', () => {
    render(
      <ThemeProvider theme={{ primary: '#ef4444' }}>
        <div />
      </ThemeProvider>
    );
    // #ef4444 is exactly color-red-500 in the light palette; the emitted var
    // references the token (mode-dependent), not the frozen literal.
    expect(injectedCss()).toContain('--theme-primary:var(--color-red-500)');
  });

  it('warns in dev when a NEUTRAL slot stays frozen on an unsnappable literal', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <ThemeProvider theme={{ canvas: 'cornflowerblue' }}>
        <div />
      </ThemeProvider>
    );
    expect(
      warn.mock.calls.some(
        ([message]) =>
          typeof message === 'string' &&
          message.includes('theme.canvas') &&
          message.includes('NOT flip')
      )
    ).toBe(true);
    warn.mockRestore();
  });

  it('does not warn for neutral slots that resolve to tokens', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <ThemeProvider theme={{ surface: '#ffffff', border: 'color-gray-200' }}>
        <div />
      </ThemeProvider>
    );
    expect(
      warn.mock.calls.some(
        ([message]) =>
          typeof message === 'string' && message.includes('NOT flip')
      )
    ).toBe(false);
    warn.mockRestore();
  });
});

describe('data-theme document stamping', () => {
  it('stamps the document element with the active mode (portals depend on it)', () => {
    render(
      <ThemeProvider mode="dark">
        <div />
      </ThemeProvider>
    );
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('follows mode changes', () => {
    const Toggle = () => {
      const { setThemeMode } = useTheme();
      return (
        <button onClick={() => setThemeMode('dark')} data-testid="to-dark" />
      );
    };
    render(
      <ThemeProvider mode="light">
        <Toggle />
      </ThemeProvider>
    );
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    act(() => {
      screen.getByTestId('to-dark').click();
    });
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('a nested provider does not restamp the document (subtree override only)', () => {
    render(
      <ThemeProvider mode="light">
        <ThemeProvider mode="dark">
          <div />
        </ThemeProvider>
      </ThemeProvider>
    );
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('stampDocument={false} opts out', () => {
    render(
      <ThemeProvider mode="dark" stampDocument={false}>
        <div />
      </ThemeProvider>
    );
    expect(document.documentElement.getAttribute('data-theme')).toBeNull();
  });

  it('restores the previous attribute on unmount', () => {
    document.documentElement.setAttribute('data-theme', 'dark');
    const { unmount } = render(
      <ThemeProvider mode="light">
        <div />
      </ThemeProvider>
    );
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    unmount();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});

describe('theme prop accepts an external interface without a cast', () => {
  // Mirrors a design-system config type: an interface with fixed string
  // slots and NO index signature. Such an interface is not assignable to
  // Partial<Theme> (index signature requirement) — the prop union with
  // ThemeSlots is what makes this compile.
  interface BrandTheme {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    canvas: string;
    surface: string;
    text: string;
    muted: string;
    border: string;
    onPrimary: string;
  }

  it('compiles and applies an interface-typed theme', () => {
    const brand: BrandTheme = {
      primary: '#2563eb',
      secondary: '#7c3aed',
      success: '#16a34a',
      warning: '#d97706',
      error: '#dc2626',
      canvas: 'color-white',
      surface: 'color-gray-50',
      text: 'color-black',
      muted: 'color-gray-500',
      border: 'color-gray-200',
      onPrimary: '#ffffff',
    };
    // Type-level assertion: BrandTheme satisfies ThemeSlots.
    const slots: ThemeSlots = brand;
    expect(slots).toBe(brand);

    render(
      <ThemeProvider theme={brand}>
        <div />
      </ThemeProvider>
    );
    // #2563eb is exactly color-blue-600 in the light palette.
    expect(injectedCss()).toContain('--theme-primary:var(--color-blue-600)');
  });
});
