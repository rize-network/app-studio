import React from 'react';
import { ThemeProvider } from '../providers/Theme';
import { ResponsiveProvider } from '../providers/Responsive';
import { WindowSizeProvider } from '../providers/WindowSize';

export default class Wrapper extends React.Component<any> {
  render() {
    return (
      <WindowSizeProvider>
        <ThemeProvider>
          <ResponsiveProvider>{this.props.children}</ResponsiveProvider>
        </ThemeProvider>
      </WindowSizeProvider>
    );
  }
}
