

# Element

The `Element` component is a fundamental component in the library. It is responsible for handling a large part of the styles of the other components. It takes care of responsiveness, shadow, margins, and padding among other properties.

## Usage

```jsx
<Element backgroundColor="color.blue" padding={10}>This is an element</Element>
```


It's the base of every elements.  The adds  additional properties to helps manage better the design :

- `size`:  make width and height equal to size.
- `on`: Object that defines style for different css events.
- `media`: Object that defines styles for different media queries.
- `shadow`: Shadow an element, it can be a boolean, number, or `Shadow` object.



# View

The `View` component is a more generic one, it can be used to create any kind of layout. It extends the basic `div` HTML tag and provides additional properties for managing styles. It also provides several other components for convenience, including `Div`, `SafeArea`, `Scroll`, and `Span`.

## Usage

```jsx
<View backgroundColor="color.red" color="color.white" padding={20}>This is a view</View>
```


# Text

The `Text` component extends the basic `div` HTML tag with additional properties for managing text styles.

## Usage

```jsx
<Text color="color.blue">This is a text</Text>
```

# Form

The `Form` component extends the basic `form` HTML tag. It also provides `Button` and `Input` components.

## Usage

```jsx
<Form>
  <Input placeholder="Enter your name" />
  <Button>Submit</Button>
</Form>
```


# Image

The `Image` component extends the basic `img` HTML tag with additional properties like `shadow`, `media`, and `on`.

## Usage

```jsx
<Image src="url_to_image" alt="description" />
```


