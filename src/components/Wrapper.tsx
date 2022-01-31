import * as React from 'react';
import { ResponsiveProvider, ThemeProvider } from '..';
export default class Wrapper extends React.Component<{}, {}> {
  render() {
    return (
      <ThemeProvider>
        <ResponsiveProvider>{this.props.children}</ResponsiveProvider>
      </ThemeProvider>
    );
  }
}
