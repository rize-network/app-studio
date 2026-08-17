import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Input } from '../../src/components/Form';
import {
  Grid,
  LayoutViewProps,
  View,
} from '../../src/components/View';
import { ThemeProvider } from '../../src/providers/Theme';

describe('form primitives forward standard HTML attributes', () => {
  it('forwards autoComplete, min/max, and htmlFor to the DOM', () => {
    render(
      <ThemeProvider>
        <View as="label" htmlFor="qty" data-testid="lbl">
          Quantity
        </View>
        <Input
          id="qty"
          data-testid="qty"
          type="number"
          autoComplete="off"
          min={0}
          max={10}
          step={2}
        />
      </ThemeProvider>
    );
    const input = screen.getByTestId('qty');
    expect(input).toHaveAttribute('autocomplete', 'off');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '10');
    expect(input).toHaveAttribute('step', '2');
    expect(screen.getByTestId('lbl')).toHaveAttribute('for', 'qty');
    // Label association is live: the label resolves to the input.
    expect(screen.getByLabelText('Quantity')).toBe(input);
  });

  it('accepts autoComplete on the shared Input type (regression: type was DOM-cased only)', () => {
    // Compile-time contract — autoComplete is the React camelCase prop.
    const node = <Input autoComplete="email" />;
    expect(node.props.autoComplete).toBe('email');
  });
});

describe('LayoutViewProps — rows/columns collision escape hatch', () => {
  // The recurring TS2430 trap: ViewProps carries `rows`/`cols` (numeric
  // textarea attributes), `columns` (CSS multi-column shorthand) and `wrap`
  // (textarea attribute). An ergonomic layout component that redeclares them
  // with its own shape must extend LayoutViewProps — this interface is the
  // compile-time regression test: it fails with TS2430 if the Omit ever
  // regresses.
  interface CardGridProps extends LayoutViewProps {
    columns?: number | string;
    rows?: number | string;
    wrap?: boolean;
  }

  it('Grid consumes the columns/rows shorthand', () => {
    const props: CardGridProps = { columns: 3, rows: '1fr 2fr' };
    render(
      <ThemeProvider>
        <Grid data-testid="grid" columns={props.columns} rows={props.rows} />
      </ThemeProvider>
    );
    const grid = screen.getByTestId('grid');
    expect(grid).toBeInTheDocument();
    // The shorthands become grid-template tracks, not DOM attributes.
    expect(grid).not.toHaveAttribute('rows');
    expect(grid).not.toHaveAttribute('columns');
  });
});
