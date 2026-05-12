# React Native

App-Studio ships a dedicated React Native build alongside its web build. The same import paths and prop-based styling API work in both environments — Metro picks the correct build automatically through the `react-native` export condition.

## Table of Contents

1. [Setup](#setup)
2. [Component Mapping](#component-mapping)
3. [Styling Props on Native](#styling-props-on-native)
4. [Web-Only Props (No-ops on Native)](#web-only-props-no-ops-on-native)
5. [Theme & Color Resolution](#theme--color-resolution)
6. [Responsive & Media Queries](#responsive--media-queries)
7. [Hooks on Native](#hooks-on-native)
8. [Accessibility & Test IDs](#accessibility--test-ids)
9. [Animations](#animations)
10. [Differences Cheat Sheet](#differences-cheat-sheet)

---

## Setup

### Requirements

- React Native `>= 0.79` (Metro must support [package exports](https://reactnative.dev/blog/2023/06/21/package-exports-support); enabled by default in 0.79+).
- React `>= 17`.

### Install

```bash
npm install app-studio
# or
yarn add app-studio
```

App-Studio's only runtime dependencies (`color-convert`, `hyphenate-style-name`) are shared between web and native and require no extra Metro configuration.

### Import paths

Use the bare package name from any RN file — Metro resolves it to the native build:

```tsx
import {
  View,
  Text,
  Button,
  ThemeProvider,
  ResponsiveProvider,
  WindowSizeProvider,
} from 'app-studio';
```

Two explicit subpaths are also available if you ever need to force a build:

- `app-studio/native` — always loads the native build (useful for inspecting the API in a web tool, or for monorepos with non-standard resolvers).
- `app-studio/web` — always loads the web build.

You should not need these subpaths in normal application code.

### Provider tree

The provider API is identical to web. A typical RN entrypoint looks like:

```tsx
import React from 'react';
import {
  ThemeProvider,
  ResponsiveProvider,
  WindowSizeProvider,
  AnalyticsProvider,
} from 'app-studio';
import RootScreen from './RootScreen';

export default function App() {
  return (
    <ThemeProvider>
      <WindowSizeProvider>
        <ResponsiveProvider>
          <AnalyticsProvider trackEvent={(event) => console.log(event)}>
            <RootScreen />
          </AnalyticsProvider>
        </ResponsiveProvider>
      </WindowSizeProvider>
    </ThemeProvider>
  );
}
```

---

## Component Mapping

Every cross-platform primitive renders a familiar React Native node under the hood. Children are wrapped or forwarded as needed.

| App-Studio component                | Native renders as                                                          | Notes |
| :---------------------------------- | :------------------------------------------------------------------------- | :---- |
| `Element`, `View`, `Div`, `Span`    | `<View>` — or `<Pressable>` when `onPress`/`onClick` is provided           | Children are wrapped between optional `before` / `after` slots. |
| `Horizontal`                        | `<View flexDirection="row">`                                               | |
| `Vertical`                          | `<View flexDirection="column">`                                            | |
| `Center`                            | `<View justifyContent="center" alignItems="center">`                       | |
| `HorizontalResponsive`              | `<View flexDirection="row">` → `column` at `mobile` breakpoint             | Uses `useWindowDimensions` + `ResponsiveProvider`. |
| `VerticalResponsive`                | `<View flexDirection="column">` → `row` at `mobile` breakpoint             | |
| `Scroll`                            | `<ScrollView>`                                                             | Pass standard RN scroll props (e.g. `contentContainerStyle`, `horizontal`). |
| `SafeArea`                          | `<SafeAreaView>` (from `react-native`)                                     | For richer behavior use `react-native-safe-area-context` directly. |
| `Text`                              | `<Text>`                                                                   | See [Text-specific props](#text). |
| `Image`                             | `<Image>`                                                                  | `src` is translated to `{ uri: src }` automatically; `source` is also accepted. |
| `ImageBackground`                   | `<ImageBackground>`                                                        | Same `src` / `source` handling as `Image`. |
| `Form`                              | `<View>`                                                                   | Form semantics don't exist in RN; treat it as an alias for `View`. |
| `Input`                             | `<TextInput>`                                                              | Use `onChangeText` (not `onChange`). |
| `Button`                            | `<Pressable accessibilityRole="button">`                                   | String / number children are wrapped in `<Text>` automatically. |
| `Skeleton`                          | `<View accessibilityRole="progressbar">`                                   | Static placeholder — see [Animations](#animations) for shimmer notes. |

### Text

Native `Text` accepts a few extra typographic props that translate to RN-friendly equivalents:

| Prop            | Mapping                                                                  |
| :-------------- | :----------------------------------------------------------------------- |
| `toUpperCase`   | Converts string children to uppercase before rendering.                  |
| `isItalic`      | Sets `fontStyle: 'italic'`.                                              |
| `isStriked`     | Sets `textDecorationLine: 'line-through'`.                               |
| `isUnderlined`  | Sets `textDecorationLine: 'underline'`.                                  |
| `isSub` / `isSup` | Forces `fontSize` to 12 unless an explicit size is provided.           |
| `maxLines`      | Sets RN's `numberOfLines` prop.                                          |

```tsx
<Text fontSize={16} fontWeight="bold" maxLines={2} toUpperCase>
  Important headline
</Text>
```

### Image

Pass either a remote URL via `src` (web-style) or a native `ImageSourcePropType` via `source`:

```tsx
<Image src="https://example.com/avatar.png" width={48} height={48} borderRadius={24} alt="User avatar" />

// or with a bundled asset
<Image source={require('./logo.png')} width={120} height={32} />
```

`alt` is forwarded as `accessibilityLabel`.

### Button

Wraps `Pressable`. A `disabled` prop short-circuits both `onPress` and `onClick`:

```tsx
<Button
  paddingHorizontal={20}
  paddingVertical={12}
  backgroundColor="theme-primary"
  borderRadius={8}
  onPress={handleSubmit}
  disabled={isSubmitting}
>
  Submit
</Button>
```

String children become `<Text>` automatically; pass JSX directly for anything more complex.

---

## Styling Props on Native

All cross-platform style props you already use on web work the same way on native, with the same theme-aware color resolution. The native style engine accepts the subset of CSS properties that React Native supports.

### Supported style props

The following props are read by the native style engine and applied to the underlying `View` / `Text` / `Image` style. Anything not in this list is passed through to React Native as-is.

```
Layout & Flex:   flex, flexDirection, flexBasis, flexGrow, flexShrink, flexWrap,
                 alignContent, alignItems, alignSelf, justifyContent, gap,
                 rowGap, columnGap, aspectRatio, direction, display, position,
                 top, right, bottom, left, start, end, zIndex, overflow,

Box model:       width, height, minWidth, minHeight, maxWidth, maxHeight,
                 margin*, padding*, (including marginHorizontal/Vertical
                 and paddingHorizontal/Vertical), borderWidth*,
                 borderRadius*, borderColor*, borderStyle, borderCurve,

Typography:      color, fontFamily, fontSize, fontStyle, fontWeight,
                 fontVariant, lineHeight, letterSpacing, textAlign,
                 textAlignVertical, textDecorationLine, textDecorationColor,
                 textDecorationStyle, textShadow*, textTransform,
                 verticalAlign, writingDirection, includeFontPadding,

Visual:          backgroundColor, opacity, transform, transformOrigin,
                 shadowColor, shadowOffset, shadowOpacity, shadowRadius,
                 elevation, boxShadow, overlayColor, tintColor,
                 backfaceVisibility, objectFit, resizeMode
```

### Native-only convenience props

Two cross-platform props are expanded on native (they also exist on web with the same meaning):

| Prop          | Behavior                                                                              |
| :------------ | :------------------------------------------------------------------------------------ |
| `widthHeight` | Sets both `width` and `height` to the same value.                                     |
| `shadow`      | `true` or a number `0..1` — applies `shadowColor #000`, `shadowRadius 4`, `shadowOffset {0,1}`, `shadowOpacity` (defaulting to `0.2`), and a matching Android `elevation`. |

```tsx
<View widthHeight={48} backgroundColor="theme-primary" borderRadius={24} shadow={0.3} />
```

### `media`, `css`, and `style`

The native style engine reads styles from four sources, merged in this order (later sources override earlier ones):

1. Top-level style props on the component.
2. `media={{ breakpoint: { ... } }}` entries matching the current width.
3. `css={{ ... }}` (plain object only — raw CSS strings have no effect on native).
4. `style={{ ... }}` (standard RN `StyleProp`, including arrays). `StyleSheet.flatten` is applied automatically.

```tsx
<View
  padding={12}
  backgroundColor="color-gray-100"
  media={{ tablet: { padding: 24 }, desktop: { padding: 32 } }}
  css={{ borderColor: 'theme-primary', borderWidth: 1 }}
  style={{ borderRadius: 12 }}
/>
```

### `onPress` & `onClick`

Native components accept both. If either is set on a non-pressable primitive (`Element`/`View`), the component automatically renders as `Pressable`. `onClick` is forwarded to `Pressable`'s `onPress` so web code that uses `onClick` keeps working.

---

## Web-Only Props (No-ops on Native)

To keep the prop API uniform across platforms, the native build *accepts* the following props but does nothing with them — they're silently dropped before reaching the underlying RN component. Code that targets both platforms can leave them in place.

**State modifiers (underscore-prefixed):** `_hover`, `_active`, `_focus`, `_visited`, `_disabled`, `_enabled`, `_checked`, `_unchecked`, `_invalid`, `_valid`, `_required`, `_optional`, `_selected`, `_target`, `_firstChild`, `_lastChild`, `_onlyChild`, `_firstOfType`, `_lastOfType`, `_empty`, `_focusVisible`, `_focusWithin`, `_placeholder`, `_groupHover`, `_groupFocus`, `_groupActive`, `_groupDisabled`, `_peerHover`, `_peerFocus`, `_peerActive`, `_peerDisabled`, `_peerChecked`.

**Pseudo-elements:** `_before`, `_after`, `_firstLetter`, `_firstLine`, `_selection`, `_backdrop`, `_marker`.

**`on={{ ... }}`** — the `on` map (hover/focus/active/etc.) is also a no-op. RN drives interactions through `Pressable` props (`onPressIn`, `onPressOut`, `onHoverIn`, etc.); use those directly when you need interaction-driven style changes.

**Other web-only props:**

- `as` — RN components don't have HTML tags; the underlying primitive is fixed.
- `className` — ignored.
- `css` raw CSS strings — only object-form `css` is read on native.
- CSS animations declared via `animate` / `animateIn` / `animateOut` / `animateOn` — see [Animations](#animations).

If you write a component that's truly platform-divergent, the cleanest path is to split it into `MyComponent.tsx` (web) and `MyComponent.native.tsx` (native) — Metro will pick the `.native` file automatically.

---

## Theme & Color Resolution

`ThemeProvider`, `useTheme`, and all the theme prop syntax work on native just like web. Pass color strings (`color-blue-500`, `theme-primary`, `light-white`, `dark-red-200`, `theme-primary-300` for 30% alpha, etc.) directly into any color-accepting prop and they resolve through the theme — no `getColor` call required:

```tsx
<View backgroundColor="theme-primary" padding={16}>
  <Text color="color-white">Hello, native!</Text>
</View>
```

### Implementation detail

On web, alpha colors compile to `color-mix(...)` CSS. On native, the theme provider's `getColor` returns the resolved color string directly (hex or rgba), and the style engine substitutes it into any prop whose name contains `color` (case-insensitive) — `backgroundColor`, `borderColor`, `tintColor`, `shadowColor`, and so on.

### `useTheme` API

The native theme context exposes the same surface as web:

```tsx
const {
  getColor,         // (name) => resolved color string
  getColorHex,      // (name) => normalized hex
  getColorRGBA,     // (name, alpha?: 0..1000) => rgba(...)
  getColorScheme,   // (name) => palette or theme token name
  getContrastColor, // (name) => 'black' | 'white'
  theme,
  colors,
  themeMode,
  setThemeMode,
} = useTheme();
```

`getColor` returns concrete color values (hex/rgba), so you can pass them to third-party RN libraries that expect a plain string.

### Scoped theme override

`Element`, `View`, etc. accept a `theme` prop that locally overrides theme tokens for that subtree. The override applies only to `theme-*` color tokens consumed by *that* component's style props — it does not propagate to child components.

```tsx
<Element backgroundColor="theme-primary" theme={{ primary: 'color-purple-500' }}>
  ...
</Element>
```

---

## Responsive & Media Queries

The native `ResponsiveProvider` is powered by `useWindowDimensions()` from React Native, so it reacts to device rotation and split-screen mode automatically.

**Default breakpoints (px):** `xs: 0`, `sm: 340`, `md: 560`, `lg: 1080`, `xl: 1300`.
**Default devices:** `mobile: [xs, sm]`, `tablet: [md, lg]`, `desktop: [lg, xl]`.

Pass `breakpoints` and `devices` props to `ResponsiveProvider` to customize them.

### `media` prop

Works the same as on web — keys can be breakpoint names or device names. On native, `media` styles are merged into the inline RN style object whenever the active breakpoint matches.

```tsx
<View
  padding={12}
  media={{
    mobile: { padding: 12, flexDirection: 'column' },
    tablet: { padding: 24, flexDirection: 'row' },
  }}
/>
```

### `useResponsive`

```tsx
import { useResponsive } from 'app-studio';

function AdaptiveCard() {
  const { screen, currentDevice, orientation, on } = useResponsive();

  return (
    <View flexDirection={on('mobile') ? 'column' : 'row'}>
      <Text>{screen} · {currentDevice} · {orientation}</Text>
    </View>
  );
}
```

`screen` (alias for `currentBreakpoint`), `currentDevice`, `orientation`, `on(name)`, and `is(name)` behave identically to web.

---

## Hooks on Native

Some hooks are inherently web-only (DOM events, IntersectionObserver, keyboard listeners). On native they are exported as **safe stubs** so that shared component code keeps compiling — but you should not rely on them returning meaningful values.

| Hook                  | Native behavior                                                                                |
| :-------------------- | :--------------------------------------------------------------------------------------------- |
| `useWindowSize`       | ✅ Works. Backed by RN's `useWindowDimensions`.                                                |
| `useWindowDimensions` | ✅ Works. Same data as `useWindowSize`.                                                        |
| `useResponsive`       | ✅ Works. Reads from `ResponsiveProvider`.                                                     |
| `useBreakpoint`       | ✅ Works. Same as `useResponsive` minus width/height.                                          |
| `useTheme`            | ✅ Works (covered above).                                                                      |
| `useAnalytics`        | ✅ Works.                                                                                      |
| `useMount`            | ✅ Works.                                                                                      |
| `useHover`            | ⚠️ Stub. Returns `{ isHovered: false, hoverProps: {} }`. Use RN's `Pressable` `onHoverIn`/`onHoverOut` if you need hover on a mouse-capable device. |
| `useActive`           | ⚠️ Stub. Returns `{ isActive: false, activeProps: {} }`. Use `Pressable` `onPressIn`/`onPressOut`. |
| `useFocus`            | ⚠️ Stub. Returns `{ isFocused: false, focusProps: {} }`. Use `TextInput`'s `onFocus`/`onBlur` directly. |
| `useClickOutside`     | ⚠️ Stub. Returns a ref and `isOutside: false`. Patterns like outside-tap dismissal need a `Pressable` overlay in RN. |
| `useElementPosition`  | ⚠️ Stub. RN equivalent is `measure()` on a `ref`. |
| `useKeyPress`         | ⚠️ Stub. Returns `false`. Use `react-native-keyboard-events` or platform-specific code. |
| `useOnScreen`         | ⚠️ Stub. Returns `{ ref, isOnScreen: true }` — assume always visible. |
| `useInView`           | ⚠️ Stub. Returns `{ ref, inView: true }`. For real visibility tracking inside lists, prefer `FlatList`'s `viewabilityConfig` / `onViewableItemsChanged`. |
| `useIframeStyles`     | ⚠️ Stub. iframes don't exist on native. |
| `useScroll`           | ⚠️ Stub. Returns zeroed values and no-op scroll methods. Drive scroll behavior from `ScrollView`/`FlatList`'s `onScroll`. |
| `useScrollDirection`, `useSmoothScroll`, `useScrollAnimation`, `useInfiniteScroll` | ❌ Not exported on native. Build with RN's own scroll events. |

The stubs exist so a single component body can run on both platforms without conditionals — but on native you should branch when meaningful interaction state is required.

---

## Accessibility & Test IDs

The native build automatically rewrites two common web attributes to their RN equivalents:

| Web prop       | Native prop            |
| :------------- | :--------------------- |
| `data-testid`  | `testID`               |
| `aria-label`   | `accessibilityLabel`   |

So shared component code can keep using `data-testid="submit"` and it will be picked up by Detox/Maestro/Appium without any changes.

```tsx
<Button data-testid="submit" aria-label="Submit form" onPress={handleSubmit}>
  Submit
</Button>
```

For RN-specific a11y APIs (`accessibilityRole`, `accessibilityState`, `accessibilityHint`, etc.) pass them through directly — they're forwarded untouched to the underlying primitive.

---

## Animations

The `Animation.*` presets and the `animate` / `animateIn` / `animateOut` / `animateOn` props compile to CSS keyframes, which **don't run** in React Native. On native these props are accepted but have no visual effect.

For motion on native, use one of:

- **`Animated` API** (`react-native` core) for simple interpolations.
- **`react-native-reanimated`** for performant, gesture-driven animations.
- **`LayoutAnimation`** for automatic layout transitions.
- **`moti`** for a declarative API similar to App-Studio's `animate` prop.

A native-flavored animation system is on the roadmap — see [next.md](../next.md) for status. Until then, drop down to the libraries above for native motion.

---

## Differences Cheat Sheet

| Concern                       | Web                                            | Native                                                                  |
| :---------------------------- | :--------------------------------------------- | :---------------------------------------------------------------------- |
| Underlying primitive          | HTML elements (`div`, `span`, `button`, …)     | RN primitives (`View`, `Pressable`, `Text`, `Image`, `TextInput`, …)    |
| `as` prop                     | Selects HTML tag                               | Ignored                                                                 |
| Pseudo-classes (`_hover`, `on`) | Compiled to CSS                              | Silently dropped — use `Pressable` event props instead                  |
| Pseudo-elements (`_before`, `_after`) | Compiled to CSS                          | Silently dropped — render real components instead                       |
| `className`                   | Applied to DOM element                         | Ignored                                                                 |
| `css` raw string              | Injected into stylesheet                       | Ignored (object form still works)                                       |
| `style`                       | Standard CSSProperties                         | RN `StyleProp` (object, array, or `StyleSheet` reference)               |
| Animations                    | CSS keyframes via `Animation.*`                | No-op — bring `Animated` / Reanimated / Moti                            |
| `Image` source                | `src` / `srcSet`                               | `src` (URI shorthand) or `source={...}`                                 |
| `Input` change handler        | `onChange`                                     | `onChangeText` (RN-native) — `onChange` is also forwarded               |
| Click handlers                | `onClick`                                      | `onPress` (preferred); `onClick` forwards to `onPress`                  |
| Test IDs                      | `data-testid`                                  | `data-testid` (rewritten to `testID`) — or `testID` directly            |
| A11y label                    | `aria-label`                                   | `aria-label` (rewritten to `accessibilityLabel`) — or `accessibilityLabel` directly |
| `useScroll` family            | Reads from `window` / scroll containers        | Stubbed; use `ScrollView`/`FlatList` `onScroll`                         |
| `useInView` / `useOnScreen`   | `IntersectionObserver`                         | Stubbed; use `FlatList` viewability                                     |
| `useKeyPress`                 | DOM key events                                 | Stubbed                                                                 |
