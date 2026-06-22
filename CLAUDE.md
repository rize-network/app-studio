# App-Studio — Agent Guidelines

This is **app-studio** + **@app-studio/web**. CSS properties are passed directly as
props on components (`<View backgroundColor="blue" padding={20} />`). It is **not**
Emotion, styled-components, or Tailwind.

## ⚠️ Pseudo-classes & state styling: use `_hover`, NOT `css={{ "&:hover" }}`

App-Studio has **no nested CSS selectors**. Selector strings inside `css` are silently
ignored — they do nothing.

```jsx
// ❌ WRONG — silently ignored
<View css={{ "&:hover": { backgroundColor: "darkblue" } }} />

// ✅ CORRECT — underscore-prefixed state prop (preferred)
<View _hover={{ backgroundColor: "darkblue" }} />

// ✅ CORRECT — `on` map, for grouping multiple states
<View on={{ hover: { backgroundColor: "darkblue" }, focus: { outline: "2px solid red" } }} />
```

- **State** (`:hover`, `:focus`, `:active`, `:disabled`, `:checked`, …) → `_hover` / `_focus` / `_active` / … or `on={{ ... }}`. Never `css={{ "&:..." }}`.
- **Responsive** → the `media` prop (`media={{ mobile: {...} }}`), never `@media` strings.
- The `css` prop is only for raw CSS values / CSS variables (e.g. `css={{ "--gap": "8px" }}`), not selectors.
- `_hover` also accepts a color shorthand string: `_hover="color-blue-500"`.
- Supported states: hover, active, focus, visited, disabled, enabled, checked, unchecked, invalid, valid, required, optional, placeholder, selected, target, firstChild, lastChild, onlyChild, firstOfType, lastOfType, empty, focusVisible, focusWithin.

See [prompt.md](prompt.md) and [docs/Events.md](docs/Events.md) for the full styling guide.
