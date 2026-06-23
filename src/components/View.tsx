import React from 'react';
import { Element, ElementProps } from '../element/Element';
import { ViewStyleProps } from '../types/style';

export interface ViewProps
  extends Omit<ViewStyleProps, keyof ElementProps>, ElementProps {
  onPress?: (..._args: any) => void;
}

export const View = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithRef<typeof Element> & ViewProps
>((props, ref) => (
  <Element {...props} ref={ref} />
)) as unknown as React.ForwardRefExoticComponent<
  React.ComponentPropsWithRef<typeof Element> &
    ViewProps &
    React.RefAttributes<HTMLElement>
>;

export const Horizontal = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithRef<typeof Element> & ViewProps
>((props, ref) => (
  <Element display="flex" flexDirection="row" {...props} ref={ref} />
)) as unknown as React.ForwardRefExoticComponent<
  React.ComponentPropsWithRef<typeof Element> &
    ViewProps &
    React.RefAttributes<HTMLElement>
>;

export const Center = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithRef<typeof Element> & ViewProps
>((props, ref) => (
  <Element
    display="flex"
    justifyContent="center"
    alignItems="center"
    {...props}
    ref={ref}
  />
)) as unknown as React.ForwardRefExoticComponent<
  React.ComponentPropsWithRef<typeof Element> &
    ViewProps &
    React.RefAttributes<HTMLElement>
>;

export const Vertical = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithRef<typeof Element> & ViewProps
>((props, ref) => (
  <Element display="flex" flexDirection="column" {...props} ref={ref} />
)) as unknown as React.ForwardRefExoticComponent<
  React.ComponentPropsWithRef<typeof Element> &
    ViewProps &
    React.RefAttributes<HTMLElement>
>;

export interface GridProps extends Omit<ViewProps, 'columns' | 'rows'> {
  // Column track definition. A number renders that many equal columns
  // (`repeat(n, 1fr)`); a string is used verbatim ("1fr 2fr", "repeat(3, 1fr)").
  columns?: number | string;
  // Row track definition, same shorthand rules as `columns`.
  rows?: number | string;
}

// Turn the `columns`/`rows` shorthand into a CSS grid-template value.
const gridTracks = (value?: number | string): string | undefined =>
  value == null
    ? undefined
    : typeof value === 'number'
      ? `repeat(${value}, 1fr)`
      : value;

// Props Grid forwards to Element, minus the `columns`/`rows` shorthands it owns
// (Element types `rows` as the numeric HTML attribute, hence the Omit).
type GridElementProps = Omit<
  React.ComponentPropsWithRef<typeof Element>,
  'columns' | 'rows'
>;

// Grid is the CSS-Grid sibling of Vertical/Horizontal. Configure it with the
// intuitive `columns`/`rows`/`gap` props; every other grid prop (gridTemplateAreas,
// justifyItems, gridAutoFlow, …) still passes straight through to Element.
export const Grid = React.forwardRef<HTMLElement, GridElementProps & GridProps>(
  ({ columns, rows, ...props }, ref) => (
    <Element
      display="grid"
      gridTemplateColumns={gridTracks(columns)}
      gridTemplateRows={gridTracks(rows)}
      {...props}
      ref={ref}
    />
  )
) as unknown as React.ForwardRefExoticComponent<
  GridElementProps & GridProps & React.RefAttributes<HTMLElement>
>;

export const HorizontalResponsive = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithRef<typeof Element> & ViewProps
>(({ media = {}, ...props }, ref) => (
  <Horizontal
    media={{
      ...media,
      mobile: {
        ...(media as any)?.mobile,
        flexDirection: 'column',
      },
    }}
    {...props}
    ref={ref}
  />
)) as unknown as React.ForwardRefExoticComponent<
  React.ComponentPropsWithRef<typeof Element> &
    ViewProps &
    React.RefAttributes<HTMLElement>
>;

export const VerticalResponsive = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithRef<typeof Element> & ViewProps
>(({ media = {}, ...props }, ref) => (
  <Vertical
    media={{
      ...media,
      mobile: {
        ...(media as any)?.mobile,
        flexDirection: 'row',
      },
    }}
    {...props}
    ref={ref}
  />
)) as unknown as React.ForwardRefExoticComponent<
  React.ComponentPropsWithRef<typeof Element> &
    ViewProps &
    React.RefAttributes<HTMLElement>
>;

export const Scroll = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithRef<typeof Element> & ViewProps
>((props, ref) => (
  <Element {...props} ref={ref} />
)) as unknown as React.ForwardRefExoticComponent<
  React.ComponentPropsWithRef<typeof Element> &
    ViewProps &
    React.RefAttributes<HTMLElement>
>;

// SafeArea insets all four edges by default (status bar / notch / home
// indicator). On web this maps to `env(safe-area-inset-*)` (needs the page to
// use `viewport-fit=cover`); on native it reads live insets from
// `react-native-safe-area-context`. Override with `safeAreaEdges`,
// `safeAreaMode`, per-edge booleans, or `ignoreSafeArea`.
export const SafeArea = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithRef<typeof Element> & ViewProps
>((props, ref) => (
  <Element safeArea {...props} ref={ref} />
)) as unknown as React.ForwardRefExoticComponent<
  React.ComponentPropsWithRef<typeof Element> &
    ViewProps &
    React.RefAttributes<HTMLElement>
>;

export const Div = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithRef<typeof Element> & ViewProps
>((props, ref) => (
  <Element {...props} ref={ref} />
)) as unknown as React.ForwardRefExoticComponent<
  React.ComponentPropsWithRef<typeof Element> &
    ViewProps &
    React.RefAttributes<HTMLElement>
>;

export const Span = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithRef<typeof Element> & ViewProps
>((props, ref) => (
  <Element as="span" {...props} ref={ref} />
)) as unknown as React.ForwardRefExoticComponent<
  React.ComponentPropsWithRef<typeof Element> &
    ViewProps &
    React.RefAttributes<HTMLElement>
>;
