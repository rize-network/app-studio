# Event Management 

App-Studio provides an intuitive way to manage events in your CSS through the `on` prop. This feature is designed to offer a convenient way to style elements based on various interactive states, represented by CSS pseudo-classes like `hover`, `active`, and `focus`.

---

## 1. Introduction to `on` Prop

The `on` prop takes an object as its value. The keys in this object correspond to the names of the CSS pseudo-classes, and the values are objects that define the styles to apply when the event occurs.

```jsx
on={{ [eventName]: { [styleProps]: [styleValue] } }}
```

Here `eventName` is the name of the CSS pseudo-class, `styleProps` are the CSS properties you wish to change, and `styleValue` are the values you want to apply.

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

The `on` prop currently supports a variety of CSS pseudo-classes, allowing you to fine-tune your UI based on user interaction. Here are some commonly used pseudo-classes:

- `hover`: Triggered when the mouse is placed over the component.
- `active`: Triggered when the component is actively being interacted with (e.g., a mouse click).
- `focus`: Triggered when the component gains focus (e.g., through tab navigation).
- `disabled`: Triggered when the component is disabled.

---

The `on` prop is a powerful and efficient way to manage events in your CSS. It offers a straightforward method for enhancing your components' interactivity, making for a more dynamic and engaging user experience.
