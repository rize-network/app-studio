
##  Props for Design Integration


The 'app-studio' library also provides  props to better manage design integration in CSS. These props are specific to the 'app-studio' library and provide more control over the styling of the components. They include props for managing layout, spacing, sizing, and more.

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

The 'shadow' prop is used to manage Shadows in CSS. It takes a string as a value, which defines the shadow effect to apply to the component. 

Here is an example:

```jsx
<View 
  backgroundColor="theme.primary" 
  padding={20}
  shadow={6}
>
  I have a shadow
</View>
```

In this example, the View component will have a shadow effect defined by the value of the 'shadow' prop.
