## Event Management


The 'on' prop is used to manage events in CSS. It takes an object as a value, where the keys are the names of the CSS pseudo-classes and the values are objects that define the styles to apply when the event represented by the pseudo-class occurs. 

Here is an example:

```jsx
<View 
  backgroundColor="grey" 
  padding={20}
  on={{ hover: { backgroundColor: 'blue.100' } }}
>
  Hover over me
</View>
```

In this example, the background color of the View component will change to 'blue.100' when it is hovered over.

Here's an example of how to use the `on` prop to change the background color of an `Element` when it's hovered over:

```tsx
<Element backgroundColor="blue" on={{ hover: { backgroundColor: 'red' } }} />
```

In this example, the background color of the `Element` is 'blue', but when the `Element` is hovered over, the background color changes to 'red'.

The `on` prop is a powerful tool for managing events in CSS, giving you the ability to directly control the visual feedback of user interactions.
