# Animation

## 1. Introduction

App-Studio provides a powerful animation system through the `Animation` object. This system allows you to easily add dynamic and engaging animations to any component that extends from `Element`. The animations are based on CSS animations and can be customized with various properties.

## 2. Usage

### Basic Usage

```jsx
import { View, Animation } from 'app-studio';

// Simple animation
<View 
  animate={Animation.fadeIn({
    duration: '1s',
    timingFunction: 'ease',
    iterationCount: '1'
  })}
/>
```

### Animation Properties

Each animation function accepts an options object with these properties:

```typescript
type AnimationOptions = {
  duration?: string;        // e.g., '1s', '500ms'
  timingFunction?: string;  // e.g., 'ease', 'linear', 'ease-in-out'
  iterationCount?: string | number; // e.g., '1', 'infinite'
}
```

## 3. Animation Types

### Transition Animations

Animations that involve changes in opacity or position:

```jsx
// Fade animations (change opacity)
Animation.fadeIn()
Animation.fadeOut()

// Slide animations (move elements)
Animation.slideInLeft()
Animation.slideInRight()
Animation.slideOutLeft()
Animation.slideOutRight()
Animation.slideInUp()
Animation.slideOutDown()
```

### Transform Animations

Animations that modify the element's transformation:

```jsx
// Rotate
Animation.rotate()

// Scale
Animation.scale()

// Translate
Animation.translate()
```

### Effect Animations

Animations that create special effects:

```jsx
// Attention seekers
Animation.bounce()
Animation.pulse()
Animation.shake()
Animation.flash()

// Special effects
Animation.flip()
Animation.rubberBand()
Animation.heartBeat()
```

## 4. Event-Based Animations

Animations can be triggered by various events using the `on` prop:

```jsx
<View
  on={{
    // Animation on hover
    hover: {
      backgroundColor: 'lightblue', // Example: change background color on hover
      animate: Animation.pulse({
        duration: "1s",
        iterationCount: "infinite",
      }),
    },
    
    // Animation on click
    click: {
      animate: Animation.flash({ duration: '0.5s' })
    }
  }}
/>
```

## 5. Responsive Animations

You can define different animations for different screen sizes using the `media` prop:

```jsx
<View
  media={{
    mobile: {
      animate: Animation.fadeIn({ duration: '1s' })
    },
    tablet: {
      animate: Animation.slideInLeft({ duration: '0.5s' })
    },
    desktop: {
      animate: Animation.bounce({ duration: '2s' })
    }
  }}
/>
```

## 6. Custom Animation Sequences

You can create complex animation sequences by defining an array of animation states. Each state in the sequence is an object with `from` and `to` properties that define the CSS styles at the start and end of that animation segment.

Here's a simple example:

```jsx
const simpleSequence = [
  {
    from: { opacity: 0 }, // Start fully transparent
    to: { opacity: 1 }, // End fully opaque
    duration: "1s",
    timingFunction: "ease-in",
  },
];

<View animate={simpleSequence} />
```

And here's a more complex example:

```jsx
const complexSequence = [
  {
    from: { opacity: 0, transform: "translateY(-100px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    duration: "2s",
    timingFunction: "ease-in",
  },
  {
    from: { opacity: 1, transform: "translateY(100px)" },
    to: { opacity: 0, transform: "translateY(0)" },
    duration: "2s",
    timingFunction: "ease-out",
  },
];

<View animate={complexSequence} />
```

## 7. Best Practices

1. **Performance**
   - Use animations sparingly and purposefully
   - Prefer transform and opacity animations for better performance
   - Avoid animating too many properties simultaneously

2. **User Experience**
   - Keep animations short and subtle
   - Use appropriate timing functions for natural movement
   - Consider reducing motion for accessibility

3. **Code Organization**
   - Define reusable animation configurations
   - Use meaningful names for custom sequences
   - Keep animation logic separate from component logic. For example, you can create separate configuration objects for your animations:
     ```jsx
     const myAnimation = Animation.fadeIn({ duration: '1s' });

     <View animate={myAnimation} />
     ```

4. **Responsive Design**
   - Adjust animation duration for different screen sizes
   - Consider disabling complex animations on mobile devices
   - Test animations on *real devices* in addition to browser developer tools, as performance can vary.
