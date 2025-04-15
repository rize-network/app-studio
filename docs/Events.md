# Event Management

App-Studio provides intuitive ways to manage events in your CSS through the `on` prop and underscore-prefixed properties. These features are designed to offer convenient ways to style elements based on various interactive states, represented by CSS pseudo-classes like `hover`, `active`, and `focus`.

---

## 1. Introduction to Event-Based Styling

### Using the `on` Prop

The `on` prop takes an object as its value. The keys in this object correspond to the names of the CSS pseudo-classes, and the values are objects that define the styles to apply when the event occurs.

```jsx
on={{ [eventName]: { [styleProps]: [styleValue] } }}
```

Here `eventName` is the name of the CSS pseudo-class, `styleProps` are the CSS properties you wish to change, and `styleValue` are the values you want to apply.

### Using Underscore-Prefixed Properties

As an alternative to the `on` prop, you can use underscore-prefixed properties directly. This provides a more concise syntax for common event-based styling:

```jsx
_hover={{ backgroundColor: 'blue.100' }}
```

You can also use string values for simple color changes:

```jsx
_hover="color.blue.500"
```

Both approaches achieve the same result, so you can choose the syntax that best fits your coding style.

---

## 2. Usage Examples

### Example 1: Changing Background Color on Hover for `View`

```jsx
<View
  backgroundColor="grey"
  padding={20}
  on={{ hover: { backgroundColor: 'blue.100' } }}
>
  Hover over me
</View>
```

In this example, the `View` component's background color will change to `blue.100` when the user hovers over it.

### Example 2: Background Color Toggle for `Element`

```jsx
<Element backgroundColor="blue" on={{ hover: { backgroundColor: 'color.red' } }} />
```

Here, the `Element` component initially has a background color of `blue`. When hovered over, the background color toggles to `red`.

---

## 3. Supported Events

The `on` prop supports a comprehensive set of CSS pseudo-classes, allowing you to fine-tune your UI based on various states and interactions. These are grouped by category for easier reference:

### Basic Interaction States

- `hover`: Triggered when the mouse is placed over the component.
- `active`: Triggered when the component is actively being interacted with (e.g., a mouse click).
- `focus`: Triggered when the component gains focus (e.g., through tab navigation).
- `visited`: Triggered for links that have been visited.

### Form States

- `disabled`: Triggered when the component is disabled.
- `enabled`: Triggered when the component is enabled.
- `checked`: Triggered for checked inputs (like checkboxes or radio buttons).
- `unchecked`: Triggered for unchecked inputs.
- `invalid`: Triggered when a form element's value is invalid.
- `valid`: Triggered when a form element's value is valid.
- `required`: Triggered for form elements with the required attribute.
- `optional`: Triggered for form elements without the required attribute.
- `placeholder`: Triggered when an input is showing its placeholder text.

### Selection States

- `selected`: Triggered for selected items (like options in a select element).

### Target States

- `target`: Triggered when the element is the target of the URL fragment (e.g., #section).

### Child Position States

- `firstChild`: Triggered when the element is the first child of its parent.
- `lastChild`: Triggered when the element is the last child of its parent.
- `onlyChild`: Triggered when the element is the only child of its parent.
- `firstOfType`: Triggered when the element is the first of its type among siblings.
- `lastOfType`: Triggered when the element is the last of its type among siblings.

### Other States

- `empty`: Triggered when the element has no children.
- `focusVisible`: Triggered when the element has keyboard focus.
- `focusWithin`: Triggered when the element or any of its descendants has focus.

## 4. Advanced Examples

### Example 3: Form Input States Using the `on` Prop

```jsx
<Form.Input
  value="Focus me"
  on={{
    focus: { borderColor: 'color.blue.500', boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.5)' },
    invalid: { borderColor: 'color.red.500' },
    disabled: { backgroundColor: 'color.gray.100', cursor: 'not-allowed' },
    placeholder: { color: 'color.gray.400' }
  }}
/>
```

This example shows how to style an input field in different states: when it has focus, when it contains invalid data, when it's disabled, and when it's showing placeholder text.

### Example 3b: Form Input States Using Underscore Properties

```jsx
<Form.Input
  value="Focus me"
  _focus={{ borderColor: 'color.blue.500', boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.5)' }}
  _invalid={{ borderColor: 'color.red.500' }}
  _disabled={{ backgroundColor: 'color.gray.100', cursor: 'not-allowed' }}
  _placeholder={{ color: 'color.gray.400' }}
/>
```

This example achieves the same result as the previous one but uses the more concise underscore-prefixed properties.

### Example 4: Interactive Button with Multiple States Using the `on` Prop

```jsx
<Button
  backgroundColor="color.blue.500"
  color="white"
  padding={10}
  borderRadius={4}
  on={{
    hover: { backgroundColor: 'color.blue.600', shadow: 3 },
    active: { backgroundColor: 'color.blue.700', transform: 'scale(0.98)', shadow: 1 },
    focus: { boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.5)' },
    disabled: { opacity: 0.6, cursor: 'not-allowed', shadow: 0 }
  }}
>
  Click Me
</Button>
```

> **Note:** You can use the `shadow` property inside the `on` prop to change the shadow level based on interaction state. The shadow property accepts numbers from 0-9, with higher numbers creating more pronounced shadows.

This button changes its appearance based on different interaction states, providing visual feedback to users.

### Example 4b: Interactive Button with Multiple States Using Underscore Properties

```jsx
<Button
  backgroundColor="color.blue.500"
  color="white"
  padding={10}
  borderRadius={4}
  _hover={{ backgroundColor: 'color.blue.600', shadow: 3 }}
  _active={{ backgroundColor: 'color.blue.700', transform: 'scale(0.98)', shadow: 1 }}
  _focus={{ boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.5)' }}
  _disabled={{ opacity: 0.6, cursor: 'not-allowed', shadow: 0 }}
>
  Click Me
</Button>
```

This example achieves the same result as the previous one but uses the more concise underscore-prefixed properties.

### Example 5: List Item with Position-Based Styling

```jsx
<View as="ul" padding={0} margin={0} listStyle="none">
  {items.map(item => (
    <View
      as="li"
      padding={10}
      borderBottom="1px solid color.gray.200"
      on={{
        firstChild: { borderTop: '1px solid color.gray.200' },
        lastChild: { borderBottom: 'none' },
        hover: { backgroundColor: 'color.gray.50' }
      }}
    >
      {item.name}
    </View>
  ))}
</View>
```

This example shows how to apply different styles to list items based on their position in the list.

### Example 6: Form Checkbox with State Styling

```jsx
<View
  as="label"
  display="flex"
  alignItems="center"
  cursor="pointer"
>
  <Input
    type="checkbox"
    marginRight={8}
    on={{
      checked: { /* Custom styles for the checked state */ },
      focus: { outline: 'none', boxShadow: '0 0 0 2px color.blue.300' }
    }}
  />
  Accept terms and conditions
</View>
```

This example demonstrates styling a checkbox input based on its checked and focus states.

---

## 5. Combining with Animations

### Using the `on` Prop with Animations

The `on` prop can be combined with animations to create dynamic effects:

```jsx
<Button
  padding={10}
  backgroundColor="color.purple.500"
  color="white"
  borderRadius={4}
  on={{
    hover: {
      backgroundColor: 'color.purple.600',
      animate: Animation.pulse({ duration: '1s', iterationCount: 'infinite' })
    },
    active: {
      backgroundColor: 'color.purple.700',
      animate: Animation.scale({ from: { transform: 'scale(1)' }, to: { transform: 'scale(0.95)' }, duration: '0.1s' })
    }
  }}
>
  Animated Button
</Button>
```

### Using Underscore Properties with Animations

You can also use underscore-prefixed properties with animations:

```jsx
<Button
  padding={10}
  backgroundColor="color.purple.500"
  color="white"
  borderRadius={4}
  _hover={{
    backgroundColor: 'color.purple.600',
    animate: Animation.pulse({ duration: '1s', iterationCount: 'infinite' })
  }}
  _active={{
    backgroundColor: 'color.purple.700',
    animate: Animation.scale({ from: { transform: 'scale(1)' }, to: { transform: 'scale(0.95)' }, duration: '0.1s' })
  }}
>
  Animated Button
</Button>
```

---

App-Studio provides powerful and efficient ways to manage events in your CSS through both the `on` prop and underscore-prefixed properties. These approaches offer straightforward methods for enhancing your components' interactivity, making for a more dynamic and engaging user experience.

The `on` prop is great for grouping related event styles together, while underscore-prefixed properties offer a more concise syntax that some developers may prefer. By leveraging CSS pseudo-classes through either approach, you can create sophisticated UI behaviors without complex JavaScript logic.
