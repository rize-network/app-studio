# Components

App-Studio provides a comprehensive set of components built on the `Element` base component. This guide covers all the available components and their usage.

## Element

The `Element` component is the foundation of App-Studio. It is responsible for handling a large part of the styles of the other components. It takes care of responsiveness, shadow, margins, and padding among other properties.

### Usage

```jsx
<Element backgroundColor="color.blue" padding={10}>This is an element</Element>
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
  backgroundColor="color.white"
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
- `HorizontalResponsive`: switches to column on mobile
- `VerticalResponsive`: switches to row on mobile
- `Scroll`: basic scrollable view
- `SafeArea`: view with overflow auto
- `Div`, `Span`: element aliases

## Text Components

### Text
For displaying text content with theme support. Extends the basic `span` HTML element.

```tsx
import { Text } from 'app-studio';

<Text
  color="color.black"
  marginRight={10}
>
  Content
</Text>

// With theme mode
<Text
  color="color.red"
  themeMode="dark"
>
  Dark mode text
</Text>
```

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

## Form Components

### Form
Extends the basic `form` HTML element. It's used for creating forms and provides nested `Form.Button` and `Form.Input` components for form elements.

```jsx
<Form>
  <Input placeholder="Enter your name" />
  <Button>Submit</Button>
</Form>
```

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
      backgroundColor: 'color.red'
    }
  }}
/>
```

### Button
Interactive button component with built-in states and animations.

```tsx
import { Button } from 'app-studio';

<Button
  paddingHorizontal={20}
  paddingVertical={10}
  backgroundColor="color.green.500"
  color="color.white"
  borderRadius={5}
  fontWeight="bold"
  on={{
    hover: { backgroundColor: 'color.green.600' },
    active: { transform: 'scale(0.95)' }
  }}
>
  Click Me
</Button>
```

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