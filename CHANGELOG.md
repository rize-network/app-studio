# Changelog

## 0.9.0

### Fixed

- **`data-theme` document stamping.** The light/dark CSS-variable blocks are
  keyed on `[data-theme]`, but only the provider's wrapper `<div>` carried the
  attribute — content portaled to `document.body` (modals, drawers, toasts)
  and iframe documents stayed frozen on the light `:root` values whatever the
  active mode. The root `ThemeProvider` (and any provider given
  `targetWindow`) now stamps `data-theme` on the owning
  `document.documentElement`, keeps it in sync with mode changes, and
  restores the previous value on unmount. Nested providers keep scoping their
  mode to their own subtree. Opt out with `stampDocument={false}`.
- **Frozen neutral theme slots warn in development.** A neutral slot
  (`canvas`, `surface`, `text`, `muted`, `border`) whose value cannot be
  snapped to a palette token (e.g. a CSS named colour) silently renders the
  same in light and dark. The provider now says so once per slot in dev.
- **`min`/`max` classified as HTML attributes.** They are not CSS properties,
  but their runtime classification fell through to a `CSS.supports()` probe;
  they are now explicitly on the attribute allowlist so
  `<Input type="number" min max>` always reaches the DOM.

### Added

- **`ThemeSlots` type + widened `ThemeProvider` `theme` prop.**
  `theme?: Partial<Theme> | ThemeSlots`. TypeScript never infers an index
  signature for `interface` declarations, so an external design-system theme
  interface was not assignable to `Partial<Theme>` and forced consumers to
  rebuild the object as `Record<string, string>` (or cast). Interfaces with
  the named slots now assign structurally, no cast.
- **`LayoutViewProps`** = `Omit<ViewProps, 'rows' | 'columns' | 'cols' | 'wrap'>`.
  Durable escape hatch for the recurring TS2430 trap: `rows`/`cols`/`wrap`
  are `<textarea>` attributes and `columns` is the CSS multi-column
  shorthand, so any ergonomic layout component redeclaring them
  (`rows?: number | string`, `wrap?: boolean`, …) had to hand-roll the Omit.
  `Grid` now extends it.

### Docs

- `docs/Theming.md`: rewrote "How ThemeProvider Works" to match the actual
  implementation (injected stylesheet + `[data-theme]` blocks), documented
  the `data-theme` stamping contract (portals, iframes, SSR) and the
  `color-*` vs `theme-*` flip semantics, including literal snapping via
  `normalizeThemeColors` and the frozen-neutral-slot dev warning.

### Tests

- `test/jest/providers/ThemeContract.test.tsx`: locks the light-neutral
  default theme (no dark/`#663399` default at `:root`), the theme-slot flip
  contract, literal→token snapping, the frozen-slot warning, `data-theme`
  stamping (root / nested / opt-out / restore-on-unmount), and the
  interface-typed `theme` prop compiling without a cast.
- `test/jest/form-attrs-and-layout-types.test.tsx`: locks
  `autoComplete`/`min`/`max`/`step`/`htmlFor` DOM forwarding, live label
  association, and the `LayoutViewProps` compile-time contract.
