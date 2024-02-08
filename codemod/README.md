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