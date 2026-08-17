import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { View } from '../../src';

describe('View', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    const root = createRoot(div);
    act(() => {
      root.render(<View />);
    });
    act(() => {
      root.unmount();
    });
  });
});
