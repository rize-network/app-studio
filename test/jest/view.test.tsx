import React from 'react';
import * as ReactDOM from 'react-dom';
import { View } from '../../src';

describe('View', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<View />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
