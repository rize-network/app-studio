import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { Responsive } from '../../../src/components/Responsive';
import { View } from '../../../src/components/View';
import { ThemeProvider } from '../../../src/providers/Theme';
import { useResponsive } from '../../../src/hooks/useResponsive';

// NOTE: this repo's @testing-library/react setup is currently broken
// (@testing-library/dom peer is not installed), so these tests use raw
// react-dom/client + act, matching test/jest/view.test.tsx.
function renderToDiv(ui: React.ReactElement) {
  const div = document.createElement('div');
  document.body.appendChild(div);
  const root = createRoot(div);
  act(() => {
    root.render(ui);
  });
  return {
    div,
    unmount: () =>
      act(() => {
        root.unmount();
      }),
  };
}

const text = (div: HTMLElement, id: string) =>
  div.querySelector(`[data-testid="${id}"]`)?.textContent;

const Probe = () => {
  const { screen, currentDevice, containerScoped } = useResponsive();
  return (
    <>
      <span data-testid="screen">{screen}</span>
      <span data-testid="device">{currentDevice}</span>
      <span data-testid="scoped">{String(!!containerScoped)}</span>
    </>
  );
};

describe('<Responsive> boundary', () => {
  describe('forceBreakpoint', () => {
    it('pins the breakpoint and derives the device', () => {
      const { div, unmount } = renderToDiv(
        <Responsive forceBreakpoint="sm">
          <Probe />
        </Responsive>
      );

      expect(text(div, 'screen')).toBe('sm');
      // sm belongs to the default `mobile` device.
      expect(text(div, 'device')).toBe('mobile');
      // Forcing is not container measurement.
      expect(text(div, 'scoped')).toBe('false');
      unmount();
    });
  });

  describe('responsiveMode', () => {
    it('pins the device and picks a representative breakpoint', () => {
      const { div, unmount } = renderToDiv(
        <Responsive responsiveMode="tablet">
          <Probe />
        </Responsive>
      );

      expect(text(div, 'device')).toBe('tablet');
      // tablet => ['md','lg'], first entry is the representative breakpoint.
      expect(text(div, 'screen')).toBe('md');
      unmount();
    });
  });

  describe('container mode', () => {
    it('marks the subtree as container-scoped', () => {
      const { div, unmount } = renderToDiv(
        <Responsive container>
          <Probe />
        </Responsive>
      );
      expect(text(div, 'scoped')).toBe('true');
      unmount();
    });

    it('compiles the `media` prop to container-query (cq-) classes', () => {
      const { div, unmount } = renderToDiv(
        <ThemeProvider>
          <Responsive container>
            <View
              media={{ md: { backgroundColor: 'red' } }}
              data-testid="box"
            />
          </Responsive>
        </ThemeProvider>
      );

      const box = div.querySelector('[data-testid="box"]') as HTMLElement;
      // Container-scoped responsive styles get the `cq-` prefix.
      expect(box.className).toMatch(/(^|\s)cq-md--/);
      unmount();
    });
  });

  describe('window mode (no boundary)', () => {
    it('compiles the `media` prop to viewport (@media) classes', () => {
      const { div, unmount } = renderToDiv(
        <ThemeProvider>
          <View media={{ md: { backgroundColor: 'red' } }} data-testid="box" />
        </ThemeProvider>
      );

      const box = div.querySelector('[data-testid="box"]') as HTMLElement;
      expect(box.className).toMatch(/(^|\s)md--/);
      // Must NOT be the container-query variant when outside a boundary.
      expect(box.className).not.toMatch(/cq-md--/);
      unmount();
    });
  });
});
