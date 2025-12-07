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

## 7. Animation Trigger Control

By default, animations trigger when elements are mounted (immediate animation). You can control this behavior with the `animateOn` prop.

### animateOn Prop

```jsx
// Default: Animations trigger on mount (immediate)
<View animate={Animation.fadeIn()} />

// Explicitly set to trigger on mount (same as default)
<View animate={Animation.fadeIn()} animateOn="Both" />
<View animate={Animation.fadeIn()} animateOn="Mount" />

// Trigger only when scrolling into viewport
<View animate={Animation.fadeIn()} animateOn="View" />
```

### Benefits of Each Mode

**Both / Mount (Default)**
- ✅ **Immediate feedback** - Animates as soon as element appears
- ✅ **Familiar behavior** - Works like traditional CSS animations
- ✅ **No dependencies** - Works in all browsers
- 📌 **Best for**: Hero sections, immediately visible content

**View**
- ✅ **Better performance** - Pure CSS, no JavaScript state
- ✅ **No re-renders** - Browser handles visibility detection  
- ✅ **Scroll-triggered** - Animates when user scrolls to it
- 📌 **Best for**: Content below the fold that should animate on scroll

### When to Use Each Mode

```jsx
// Hero section - animate immediately
<View animate={Animation.fadeIn()} animateOn="Mount">
  <Text>Welcome!</Text>
</View>

// Content card - animate on scroll into view
<View animate={Animation.slideUp()} animateOn="View">
  <Text>This card animates when scrolled into view</Text>
</View>
```

## 8. View Timeline Animations (CSS Scroll-Driven)


App-Studio provides performant scroll-driven animations using CSS `animation-timeline: view()`. These animations trigger when elements enter/exit the viewport **without any JavaScript state or IntersectionObserver**.

### Benefits

- ✅ **No JavaScript state** - Pure CSS, no `useState` or re-renders
- ✅ **No IntersectionObserver** - Browser handles visibility detection
- ✅ **Compositor thread** - Smooth 60fps animations
- ✅ **JSON configurable** - Define animations as data

### Basic Usage

```jsx
import { fadeInOnView, slideUpOnView, scaleUpOnView } from 'app-studio';

// Elements animate when scrolling into view
<View animate={fadeInOnView()} />
<View animate={slideUpOnView({ distance: '50px' })} />
<View animate={scaleUpOnView({ scale: 0.8 })} />
```

### Available Presets

| Function | Effect | Default Range |
|----------|--------|---------------|
| `fadeInOnView()` | Fade in | entry |
| `fadeOutOnView()` | Fade out | exit |
| `slideUpOnView()` | Slide up + fade | entry |
| `slideDownOnView()` | Slide down + fade | entry |
| `slideLeftOnView()` | Slide from left | entry |
| `slideRightOnView()` | Slide from right | entry |
| `scaleUpOnView()` | Scale up (0.9→1) | entry |
| `scaleDownOnView()` | Scale down | entry |
| `blurInOnView()` | Blur in | entry |
| `blurOutOnView()` | Blur out | exit |
| `rotateInOnView()` | Rotate + scale | entry |
| `revealOnView()` | Clip-path reveal | entry |
| `flipXOnView()` | 3D flip X | entry |
| `flipYOnView()` | 3D flip Y | entry |

### Custom Options

```jsx
// All presets accept customization options
<View animate={fadeInOnView({
  duration: '1s',
  timingFunction: 'ease-out',
  delay: '0.2s',
  range: 'entry 0% entry 80%'
})} />

<View animate={slideUpOnView({ distance: '60px' })} />
<View animate={blurInOnView({ blur: '20px' })} />
<View animate={scaleUpOnView({ scale: 0.7 })} />
```

### Custom JSON Configuration

```jsx
import { animateOnView } from 'app-studio';

<View animate={animateOnView({
  keyframes: {
    from: { opacity: 0, transform: 'rotate(-10deg) scale(0.9)' },
    to: { opacity: 1, transform: 'rotate(0) scale(1)' }
  },
  timing: {
    duration: '0.8s',
    timingFunction: 'ease-out'
  },
  range: 'entry'
})} />
```

### Entry and Exit Animations

```jsx
// Combine entry and exit animations
<View animate={[
  fadeInOnView({ range: 'entry' }),
  fadeOutOnView({ range: 'exit' })
]} />

<View animate={[
  slideUpOnView({ range: 'entry' }),
  blurOutOnView({ range: 'exit' })
]} />
```

### Staggered Animations

```jsx
// Create staggered effects with delay
{items.map((item, index) => (
  <View
    key={item.id}
    animate={slideUpOnView({ delay: `${index * 0.1}s` })}
  >
    {item.content}
  </View>
))}
```

### Using Preset Configurations

```jsx
import { viewAnimationPresets, createViewAnimation } from 'app-studio';

// Use predefined JSON configs
<View animate={createViewAnimation(viewAnimationPresets.fadeIn)} />
<View animate={createViewAnimation(viewAnimationPresets.slideUp)} />
<View animate={createViewAnimation(viewAnimationPresets.reveal)} />
```

### Browser Support

| Browser | Support |
|---------|---------|
| Chrome 115+ | ✅ Full |
| Edge 115+ | ✅ Full |
| Safari 17.4+ | ✅ Full |
| Firefox 110+ | ⚠️ Partial |

> **Note:** In unsupported browsers, elements appear without animation (graceful degradation).

## 9. Best Practices


1. **Performance**
   - Use view timeline animations (`fadeInOnView`, etc.) for scroll-triggered effects
   - Prefer transform and opacity animations for better performance
   - Avoid animating layout properties (width, height, margin)

2. **User Experience**
   - Keep animations short and subtle
   - Use appropriate timing functions for natural movement
   - Consider `prefers-reduced-motion` for accessibility

3. **Code Organization**
   - Define reusable animation configurations as JSON
   - Use meaningful names for custom sequences
   - Keep animation logic separate from component logic:
     ```jsx
     const myAnimation = fadeInOnView({ duration: '1s' });
     <View animate={myAnimation} />
     ```

4. **Responsive Design**
   - Adjust animation duration for different screen sizes
   - Consider disabling complex animations on mobile
   - Test animations on real devices

5. **View Timeline Animations**
   - Use for on-scroll reveal effects instead of `animateIn`
   - Combine entry and exit animations for complete interactions
   - Use staggered delays for list animations
