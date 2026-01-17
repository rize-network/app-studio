
# Design Props and Styling


The `app-studio` library provides a set of design props that simplify styling and enhance design integration. These props offer a more streamlined and efficient way to manage styling compared to using inline styles or CSS classes directly. They are particularly beneficial for implementing responsive and theme-aware styling, allowing you to easily adapt your components to different screen sizes and themes.

Here is an example:

```jsx
<View
  backgroundColor="theme-primary"
  padding={20}
  margin={10}
  width={200}
  height={100}
>
  I am a View component with custom styling
</View>
```

In this example, the View component is styled with custom background color, padding, margin, width, and height.

The `shadow` prop allows you to apply shadow effects to components. It can accept a boolean, a number, or a `Shadow` object. A boolean value applies a default shadow, while a number references predefined shadow levels (e.g., `shadow={6}` might correspond to a specific shadow intensity defined in your theme). For more granular control, you can use a `Shadow` object to customize the shadow's properties.

Here is an example:

```jsx
<View backgroundColor="theme-primary" padding={20} shadow={6}>
  I have a shadow
</View>
```

In this example, the `shadow={6}` applies the 6th predefined shadow level from your theme to the `View` component.

## CSS Custom Properties (Variables)

App-Studio supports CSS custom properties (CSS variables) that start with `--`. You can define and use these variables in your components for more flexible styling:

```jsx
<View
  style={{
    '--primary-color': 'blue',
    '--primary-bg': 'lightblue',
    '--spacing': '15px',
  }}
  backgroundColor="var(--primary-bg)"
  color="var(--primary-color)"
  padding="var(--spacing)"
>
  This component uses CSS variables
</View>
```

You can also define CSS variables using the `css` prop:

```jsx
<View
  css={{
    '--secondary-color': 'green',
    '--secondary-bg': 'lightgreen',
    '--border-radius': '8px',
  }}
  backgroundColor="var(--secondary-bg)"
  borderRadius="var(--border-radius)"
>
  <Text color="var(--secondary-color)">
    This text uses a CSS variable for its color
  </Text>
</View>
```

CSS variables are particularly useful for:
- Creating theme variations within components
- Sharing values between different CSS properties
- Enabling dynamic styling through JavaScript

## Vendor-Prefixed Properties

App-Studio handles vendor-prefixed CSS properties to ensure cross-browser compatibility. You can use both camelCase and lowercase formats for vendor prefixes:

### Camel Case Format (Recommended)

```jsx
<View
  WebkitUserSelect="none"
  MozUserSelect="none"
  msFlexAlign="center"
>
  This element has vendor-prefixed properties
</View>
```

### Lowercase Format

```jsx
<View
  webkitBackgroundClip="text"
  webkitTextFillColor="transparent"
  background="linear-gradient(45deg, #ff0000, #0000ff)"
>
  This text should have a gradient effect
</View>
```

You can also use the `css` prop for more complex vendor-prefixed styles:

```jsx
<View
  css={{
    background: "linear-gradient(45deg, #ff0000, #00ff00, #0000ff)",
    webkitBackgroundClip: "text",
    color: "transparent",
    fontSize: "24px",
    fontWeight: "bold"
  }}
>
  This text should have a gradient background
</View>
```

App-Studio automatically converts JavaScript-style vendor-prefixed properties (like `webkitBackgroundClip`) to their CSS equivalents with hyphens (e.g., `-webkit-background-clip`), ensuring proper rendering across different browsers.
