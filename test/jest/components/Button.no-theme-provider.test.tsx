import React from 'react';
import { render } from '@testing-library/react';
import { Button } from '../../../src/components/Form';

describe('Button without ThemeProvider', () => {
  it('generates utility classes and does not forward pseudo props to the DOM', () => {
    const { getByTestId } = render(
      <Button
        data-testid="button-without-theme-provider"
        color="var(--foreground)"
        _hover={{ color: 'var(--foreground)' }}
        _groupHover={{ color: 'var(--foreground)' }}
      >
        Save
      </Button>
    );

    const button = getByTestId('button-without-theme-provider');

    expect(button.className.trim()).not.toBe('');
    expect(button).not.toHaveAttribute('_hover');
    expect(button).not.toHaveAttribute('_grouphover');
  });
});
