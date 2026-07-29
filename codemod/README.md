# @app-studio/codemod

Provides Codemod transformations to help with code upgrade and migration.

## Usage

```sh
npx @app-studio/codemod <transform> <path>
```

- `transform` - name of the transform
- `path` - files or directory to transform
- `--dry` - Performs a dry-run, no code changes
- `--print` - Prints the changes for comparison
- `--preserveClassNames` - For `tailwind-to-app-studio`, keeps converted class names for contract selectors

## Codemods

### `to-app-studio`

This Codemod migrates your components code to `app-studio` code.

```js
npx @app-studio/codemod to-app-studio
```

Example:


```jsx
export default function () {
  return (
    <div style={{display:"flex"}}>
      <h1 >This is a heading</h1>
      <button>Button</button>
    </div>
  )
}
```


Will be transformed to:


```tsx
import { Div, H1, Button } from "@app-studio/web"

export default function () {
  return (
    <Div display="flex">
      <H1>This is a heading</H1>
      <Button>Button</Button>
    </Div>
  )
}
```

### `tailwind-to-app-studio`

This transform converts Tailwind `className` values into App Studio style
props. It covers layout, spacing, sizing, typography, colors, borders,
effects, states, responsive utilities, common `dark:` pairs, and expressions
composed with `cn`, `clsx`, `classnames`, or `twMerge`. Native tags are mapped
to their App Studio primitive, with `View as="tag"` preserving other DOM tags.

Conversion is partial by default: supported tokens become props and unknown or
unsafe tokens remain in a residual `className`. This makes large migrations
incremental without silently dropping styles. Use `--strict` to skip the whole
element whenever any token has to remain.

```sh
npx @app-studio/codemod tailwind-to-app-studio path/to/src --dry --print
```

By default the original `className` is removed. Pass
`--preserveClassNames` when a class name is a contract selector that must
remain alongside the generated props:

```sh
npx @app-studio/codemod tailwind-to-app-studio path/to/src --preserveClassNames
```

Responsive utilities use bounded App Studio breakpoint ranges. Since these do
not exactly match Tailwind's min-width breakpoints, approximations are recorded
in the report. `--breakpoint-strategy=devices` opts into device keys instead.
Recognized light/dark color pairs become auto-switching theme tokens;
`--dark-strategy=residual` keeps every `dark:` token in `className`.

The transform writes `./tailwind-codemod-report.json` with per-file skips,
unknown utilities, conflicts, and approximations. Configure this with
`--report-path=<file>` or disable it with `--no-report`. Use `--no-all-tags` to
restrict conversion to the direct primitive tag table.

The transform is deterministic and structurally idempotent: converted App
Studio components are not candidates on a second pass, while group/peer marker
classes and unsupported utilities remain available as passthrough class names.
