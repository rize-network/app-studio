# Element

The `Element` component is a fundamental component in the library. It is responsible for handling a large part of the styles of the other components. It takes care of responsiveness, shadow, margins, and padding among other properties.

## Usage

```jsx
<Element backgroundColor="color.blue" padding={10}>This is an element</Element>
```

It is the base component for all other components in the library. The adds additional properties to helps manage better the design:

- `size`: Sets both `width` and `height` to the same value. Accepts a number (in pixels) or a string (e.g., '50%', 'auto').
- `on`: An object to define styles that apply on different CSS pseudo-class events (like `hover`, `focus`, `active`). Refer to the Events documentation for details.
- `media`: An object to define responsive styles for different media queries (breakpoints) or devices. Refer to the Responsive Design documentation for details.
- `shadow`: Applies a shadow effect to the element. Can be a boolean (default shadow), a number (referencing predefined shadow levels), or a `Shadow` object for custom shadow properties. See the Shadow documentation for details.

# View

The `View` component extends the basic `div` HTML element. It's a generic container used to create various layouts and provides additional properties for managing styles. It also provides several other components for convenience, including `View.Div`, `View.SafeArea`, `View.Scroll`, and `View.Span`.

## Usage

```jsx
<View backgroundColor="color.red" color="color.white" padding={20}>This is a view</View>
```

# Text

The `Text` component extends the basic `div` HTML element with additional properties for managing text styles. It's primarily used for rendering text content.

## Usage

```jsx
<Text color="color.blue">This is a text</Text>
```

# Form

The `Form` component extends the basic `form` HTML element. It's used for creating forms and provides nested `Form.Button` and `Form.Input` components for form elements.

## Usage

```jsx
<Form>
  <Input placeholder="Enter your name" />
  <Button>Submit</Button>
</Form>
```

# Image

The `Image` component extends the basic `img` HTML element with additional properties like `shadow`, `media`, and `on`. It's used for displaying images.

## Usage

```jsx
<Image src="url_to_image" alt="description" />
```