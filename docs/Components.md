# Components

App-Studio provides a comprehensive set of components built on the `Element` base component. This guide covers all the available components and their usage.

> **React Native:** every component on this page also ships in the native build, rendered with the matching RN primitive (`View`, `Pressable`, `Text`, `Image`, `TextInput`, `ScrollView`, `SafeAreaView`). See [Native.md](Native.md) for the full mapping table and a list of native-only / web-only props.

## Element

The `Element` component is the foundation of App-Studio. It is responsible for handling a large part of the styles of the other components. It takes care of responsiveness, shadow, margins, and padding among other properties.

### Usage

```jsx
<Element backgroundColor="color-blue" padding={10}>This is an element</Element>
```

It is the base component for all other components in the library. It adds additional properties to help manage design:

- `widthHeight`: Sets both `width` and `height` to the same value. Accepts a number (in pixels) or a string (e.g., '50%', 'auto').
- `on`: An object to define styles that apply on different CSS pseudo-class events (like `hover`, `focus`, `active`). Refer to the Events documentation for details.
- `media`: An object to define responsive styles for different media queries (breakpoints) or devices. Refer to the Responsive Design documentation for details.
- `shadow`: Applies a shadow effect to the element. Can be a boolean (default shadow), a number (referencing predefined shadow levels), or a `Shadow` object for custom shadow properties.

## Layout Components

### View
The basic building block for layouts. Extends the basic `div` HTML element.

```tsx
import { View } from 'app-studio';

<View
  widthHeight={100}
  backgroundColor="color-white"
  marginTop={20}
>
  {/* Content */}
</View>
```

### Vertical, Horizontal & Center
For stack, row, and centered layouts.

```tsx
import { Vertical, Horizontal, Center } from 'app-studio';

// Vertical stack
<Vertical gap={20}>
  <View />
  <View />
</Vertical>

// Horizontal row
<Horizontal gap={10}>
  <View />
  <View />
</Horizontal>

// Centered content (both horizontally and vertically)
<Center>
  <View />
</Center>
```

**Layout Variants:**
- `Horizontal`: flex row layout
- `Vertical`: flex column layout
- `Center`: flex layout centered both ways
- `Grid`: CSS Grid via `columns`/`rows`/`gap` (flexbox fallback on native)
- `HorizontalResponsive`: switches to column on mobile
- `VerticalResponsive`: switches to row on mobile
- `Scroll`: basic scrollable view
- `SafeArea`: view with overflow auto
- `Div`, `Span`: element aliases

### Grid
CSS Grid layout configured with intuitive `columns` / `rows` / `gap` props — the CSS-Grid sibling of `Vertical`/`Horizontal`.

> **React Native:** RN has no CSS Grid, so `Grid` falls back to flexbox: it chunks its children into rows of N cells (parsing `columns` into per-column `flexGrow` weights) so you still get a real grid layout instead of a flat stacked list. `auto-fit`/`auto-fill` templates collapse to a single column (they need runtime width measurement). See [Native.md](Native.md).

```tsx
import { Grid, View } from 'app-studio';

// N equal columns — a number expands to `repeat(n, 1fr)`
<Grid columns={3} gap={16}>
  <View />
  <View />
  <View />
</Grid>

// Custom tracks — a string is used verbatim
<Grid columns="1fr 2fr 1fr" gap={16}>
  <View />
  <View />
  <View />
</Grid>

// Independent row & column gaps
<Grid columns={4} rowGap={24} columnGap={8}>
  {items.map((item) => (
    <View key={item.id} />
  ))}
</Grid>

// Responsive — collapse columns per breakpoint with `media`
<Grid
  columns={4}
  gap={16}
  media={{
    mobile: { gridTemplateColumns: 'repeat(1, 1fr)' },
    md: { gridTemplateColumns: 'repeat(2, 1fr)' },
  }}
>
  {/* ... */}
</Grid>
```

**Props:**
- `columns`: a number → `repeat(n, 1fr)`, or a raw track string (`"1fr 2fr"`, `"repeat(3, 1fr)"`).
- `rows`: same shorthand as `columns` (web only — ignored on native, where rows follow from the column count).
- `gap` / `rowGap` / `columnGap`: spacing between cells.
- Any other CSS Grid prop (`gridTemplateAreas`, `gridAutoFlow`, `justifyItems`, `alignItems`, …) passes straight through on web.

## Text Components

### Text
For displaying text content with theme support. Extends the basic `span` HTML element.

> **React Native:** renders `<Text>`. Adds `maxLines` (→ `numberOfLines`), `toUpperCase`, `isItalic`, `isStriked`, `isUnderlined`, `isSub`/`isSup`.

```tsx
import { Text } from 'app-studio';

<Text
  color="color-black"
  marginRight={10}
>
  Content
</Text>

// With theme mode
<Text
  color="color-red"
  themeMode="dark"
>
  Dark mode text
</Text>
```

**Typography shorthands** map to the design-system scale (`utils/typography.ts`). Explicit props (`fontSize`, `fontWeight`, `letterSpacing`) override them; unknown values pass through unchanged.

```tsx
// heading: semantic <h1>–<h6> tag + matching size / weight / line-height
<Text heading="h1">Heading 1</Text>

// size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' (or a number)
<Text size="lg">Large (16px)</Text>

// weight: 'hairline' … 'black' (100–900, or a number)
<Text weight="semiBold">Semi Bold (600)</Text>

// spacing: 'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest'
<Text spacing="wide">Tracked out</Text>
```

### Typewriter
Types out one or several paragraphs character by character with a blinking cursor. Built on `Text`/`View`, so it works on web and native and forwards `Text` styling props to every paragraph.

```tsx
import { Typewriter } from 'app-studio';

// Single paragraph
<Typewriter text="Typed one character at a time." />

// Multiple paragraphs (typed in sequence) + in-paragraph line break with "|"
<Typewriter
  typingSpeed={20}
  pauseTime={700}
  paragraphGap={16}
  lineHeight="1.6"
  text={[
    'First paragraph.',
    'Second paragraph after a pause.',
    'Break a single paragraph|across lines with a pipe.',
  ]}
/>

// Looping tagline
<Typewriter loop text={['Build faster.', 'Ship anywhere.', 'Style with props.']} />
```

Props: `text`, `typingSpeed` (50), `pauseTime` (600), `paragraphGap` (8), `lineBreakChar` (`"|"`), `loop` (false), `loopDelay` (1500), `showCursor` (true), `cursorColor` (`'currentColor'`), `onComplete`. Remount with a changing `key` to replay.

> ⚠️ Use a unitless string `lineHeight="1.6"` (or an integer `1`–`3`) — a fractional **number** like `lineHeight={1.6}` is converted to pixels and collapses the lines.

## Media Components

### Image
Extends the basic `img` HTML element with additional properties like `shadow`, `media`, and `on`.

```tsx
import { Image } from 'app-studio';

// Basic usage
<Image
  widthHeight={100}
  shadow={9}
  src="https://picsum.photos/200"
/>

// Responsive image (mobile only)
<Image
  widthHeight={100}
  src="https://picsum.photos/200"
  only={['mobile']}
/>
```

> **React Native:** `src` is translated to `{ uri: src }` automatically. To use a bundled asset, pass `source={require('./logo.png')}` instead. `alt` becomes `accessibilityLabel`.

## Form Components

### Form
Extends the basic `form` HTML element. It's used for creating forms and provides nested `Form.Button` and `Form.Input` components for form elements.

```jsx
<Form>
  <Input placeholder="Enter your name" />
  <Button>Submit</Button>
</Form>
```

> **React Native:** `Form` is an alias for `View` — there is no `form` element on native. Drive submission manually from a `Button`'s `onPress` handler.

### Input
Extends the basic `input` HTML element with additional styling properties.

```tsx
import { Input } from 'app-studio';

// Basic usage
<Input width={100} />

// With hover state
<Input
  width={100}
  shadow={9}
  on={{
    hover: {
      backgroundColor: 'color-red'
    }
  }}
/>
```

> **React Native:** renders `<TextInput>`. Prefer `onChangeText={value => ...}` over `onChange`. The `on` map (hover/focus/etc.) is a no-op — use `TextInput`'s `onFocus`/`onBlur` props for focus styling.

### Button
Interactive button component with built-in states and animations.

```tsx
import { Button } from 'app-studio';

<Button
  paddingHorizontal={20}
  paddingVertical={10}
  backgroundColor="color-green-500"
  color="color-white"
  borderRadius={5}
  fontWeight="bold"
  on={{
    hover: { backgroundColor: 'color-green-600' },
    active: { transform: 'scale(0.95)' }
  }}
>
  Click Me
</Button>
```

> **React Native:** renders `<Pressable accessibilityRole="button">`. Use `onPress` (or keep `onClick` — it is forwarded to `onPress`). String/number children are wrapped in `<Text>` automatically. The `on` map is dropped — express press feedback via `Pressable`'s `({ pressed }) => style` callback or RN's `Animated` API.

## Feedback Components

### Skeleton
Used for loading states and content placeholders. Extends `View`.

```tsx
import { Skeleton, View } from 'app-studio';

// Basic usage
<View>
  <Skeleton widthHeight={100} />
</View>

// With background comparison
<View>
  <View widthHeight={100} backgroundColor="red" />
  <Skeleton widthHeight={100} />
</View>
```

## Component Props

All components extend the base `Element` props:

- `as`: HTML element to render as
- `media`: Responsive styles object
- `on`: Interactive state styles
- `animate`: Animation configuration
- `themeMode`: Override theme mode
- `colors`: Custom color palette
- `theme`: Custom theme tokens

Additional component-specific props are documented in their respective sections above.