
# Design Props and Styling


The `app-studio` library provides a set of design props that simplify styling and enhance design integration. These props offer a more streamlined and efficient way to manage styling compared to using inline styles or CSS classes directly. They are particularly beneficial for implementing responsive and theme-aware styling, allowing you to easily adapt your components to different screen sizes and themes.

Here is an example:

```jsx
<View 
  backgroundColor="theme.primary" 
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
<View backgroundColor="theme.primary" padding={20} shadow={6}>
  I have a shadow
</View>
```

In this example, the `shadow={6}` applies the 6th predefined shadow level from your theme to the `View` component.
