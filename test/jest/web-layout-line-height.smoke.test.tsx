import React from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { Text } from '../../src/components/Text';
import { Center, Horizontal, Vertical } from '../../src/components/View';
import { ThemeProvider } from '../../src/providers/Theme';

describe('web line height and semantic layouts smoke test', () => {
  it('renders normalized line heights and invariant layout styles', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const root = createRoot(host);

    flushSync(() => {
      root.render(
        <ThemeProvider>
          <Text id="number-line-height" fontSize={20} lineHeight={1.6}>
            Number
          </Text>
          <Text id="string-line-height" fontSize={20} lineHeight="1.6">
            String
          </Text>
          <Text id="absolute-line-height" lineHeight={20.5}>
            Absolute
          </Text>
          <Center
            id="center"
            display="block"
            justifyContent="flex-start"
            alignItems="stretch"
          />
          <Horizontal id="horizontal" flexDirection="column" />
          <Vertical id="vertical" flexDirection="row" />
        </ThemeProvider>
      );
    });

    expect(
      window.getComputedStyle(host.querySelector('#number-line-height')!)
        .lineHeight
    ).toBe('1.6');
    expect(
      window.getComputedStyle(host.querySelector('#string-line-height')!)
        .lineHeight
    ).toBe('1.6');
    expect(
      window.getComputedStyle(host.querySelector('#absolute-line-height')!)
        .lineHeight
    ).toBe('20.5px');

    const center = window.getComputedStyle(host.querySelector('#center')!);
    expect(center.display).toBe('flex');
    expect(center.justifyContent).toBe('center');
    expect(center.alignItems).toBe('center');
    expect(
      window.getComputedStyle(host.querySelector('#horizontal')!).flexDirection
    ).toBe('row');
    expect(
      window.getComputedStyle(host.querySelector('#vertical')!).flexDirection
    ).toBe('column');

    flushSync(() => root.unmount());
    host.remove();
  });
});
