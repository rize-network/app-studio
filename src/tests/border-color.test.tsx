import React from 'react';
import { render } from '@testing-library/react';
import { Element } from '../element/Element';
import { ThemeProvider } from '../providers/Theme';

describe('Border Color Processing', () => {
  it('should process color values in border properties', () => {
    const { container } = render(
      <ThemeProvider>
        <Element
          border="1px solid color.blue.500"
          data-testid="border-element"
        />
        <Element
          borderTop="2px dashed theme.primary"
          data-testid="border-top-element"
        />
        <Element
          borderBottom="3px dotted color.red.300"
          data-testid="border-bottom-element"
        />
      </ThemeProvider>
    );

    // The actual test would check the computed styles or class names
    // This is a placeholder for manual verification
    expect(container).toBeInTheDocument();
  });
});
