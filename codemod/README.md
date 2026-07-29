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

This transform converts only exact, static Tailwind `className` values on
`div` and `span` elements into App Studio `View` and `Span` style props. It
adds or merges a direct named import from `app-studio` and is intentionally
strict: dynamic/template-substituted class names, responsive or pseudo-state
tokens, unknown tokens, spreads, style/App Studio props, generated-prop
conflicts, ambiguous tag pairs, complex or aliased `app-studio` imports, and
local `View`/`Span` bindings are skipped. No partial class conversion occurs.

```sh
npx @app-studio/codemod tailwind-to-app-studio path/to/src --dry --print
```

By default the original `className` is removed. Pass
`--preserveClassNames` when a class name is a contract selector that must
remain alongside the generated props:

```sh
npx @app-studio/codemod tailwind-to-app-studio path/to/src --preserveClassNames
```

The transform is deterministic and idempotent. Its deliberately minimal table
covers display, position, flex direction/wrap, alignment, growth/shrink,
zero/full dimensions, overflow, text alignment, whitespace, word breaking,
cursor, pointer-events, and user-select tokens. It does not attempt arbitrary
Tailwind values, modifiers, colors, spacing, typography, or utility composition.
