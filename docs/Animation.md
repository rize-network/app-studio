# Animation

## 1. Introduction

App-Studio provides a powerful animation system through the `Animation` object and the `Element` component. This system allows you to easily add dynamic and engaging animations, including:

- **Standard CSS Animations**: Immediate animations on mount or loop.
- **Scroll-Triggered Animations** (`view()`): Animations that play when elements enter the viewport.
- **Scroll-Linked Animations** (`scroll()`): Animations driven by the scroll progress (e.g., parallax, reading progress).
- **Interactive Animations**: Triggered by events like hover, click, or focus.

## 2. Basic Usage

### Standard Animations

Use the `Animation` object to access standard animation presets.

```jsx
import { View, Animation } from 'app-studio';

// Simple animation running immediately on mount
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
  duration?: string;          // e.g., '1s', '500ms'
  timingFunction?: string;    // e.g., 'ease', 'linear', 'cubic-bezier(...)'
  iterationCount?: string | number; // e.g., '1', 'infinite'
  delay?: string;             // e.g., '0.5s'
  direction?: string;         // e.g., 'normal', 'reverse', 'alternate'
  fillMode?: string;          // e.g., 'forwards', 'both'
  playState?: string;         // e.g., 'running', 'paused'
}
```

## 3. Element Props for Animation

The `Element` component (and components extending it like `View`, `Text`, `Image`) supports several props to control animations:

### `animate`
The main property to apply animations. Accepts a single animation object or an array of animations.

```jsx
<View animate={Animation.bounce()} />
<View animate={[Animation.fadeIn(), Animation.slideInUp()]} />
```

### `animateIn` & `animateOut`
Useful for mounting and unmounting transitions, or conditional rendering effects.
- `animateIn`: Applied when the component mounts or becomes visible (if `IntersectionObserver` is used internally).
- `animateOut`: Applied during unmount cleanup (requires immediate re-render or external handling to be visible).

### `animateOn`
Controls *when* the animation defined in `animate` starts.

- `'Mount'` (default): Animation starts immediately when the component is added to the DOM.
- `'View'`: Animation is converted to a CSS `view()` timeline animation. It plays as the element enters the viewport. **No JavaScript required.**
- `'Both'`: Technically same as Mount for most cases, ensuring visibility.

```jsx
// Trigger animation only when user scrolls it into view
<View animate={Animation.slideInUp()} animateOn="View" />
```

## 4. Animation Presets

App-Studio comes with a comprehensive library of ready-to-use animations available under the `Animation` namespace.

### Fades
- `Animation.fadeIn()`
- `Animation.fadeOut()`
- `Animation.fadeInDown()`
- `Animation.fadeInUp()`
- `Animation.fadeInScroll()` - Scroll-progress driven fade

### Slides
- `Animation.slideInLeft()`
- `Animation.slideInRight()`
- `Animation.slideInDown()`
- `Animation.slideInUp()`
- `Animation.slideOutLeft()`
- `Animation.slideOutRight()`
- `Animation.slideInLeftScroll()` - Scroll-progress driven slide

### Zooms & Scales
- `Animation.zoomIn()`
- `Animation.zoomOut()`
- `Animation.zoomInDown()`
- `Animation.zoomOutUp()`
- `Animation.scale()` - Pulse scale effect
- `Animation.scaleDownScroll()`
- `Animation.listItemScaleScroll()`

### Bounces
- `Animation.bounce()`
- `Animation.bounceIn()`
- `Animation.bounceOut()`

### Flips & Rotations
- `Animation.rotate()`
- `Animation.flip()`
- `Animation.flipInX()`
- `Animation.flipInY()`
- `Animation.rollIn()`
- `Animation.rollOut()`
- `Animation.swing()`

### Attention Seekers & Effects
- `Animation.pulse()`
- `Animation.flash()`
- `Animation.shake()`
- `Animation.headShake()`
- `Animation.rubberBand()`
- `Animation.wobble()`
- `Animation.heartBeat()`
- `Animation.tada()`
- `Animation.jello()`

### Extrances & Exits
- `Animation.lightSpeedIn()`
- `Animation.lightSpeedOut()`
- `Animation.jackInTheBox()`
- `Animation.hinge()`
- `Animation.backInDown()`
- `Animation.backOutUp()`

### Special / Scroll-Driven
- `Animation.shimmer()` - Loading shimmer effect
- `Animation.typewriter()` - Typing effect
- `Animation.blinkCursor()`
- `Animation.handWaveScroll()`
- `Animation.ctaCollapseScroll()`
- `Animation.fillTextScroll()`

## 5. View Timeline Animations (Scroll-Driven)

There are two ways to create animations that trigger on scroll into view:

### 1. Using `animateOn="View"`
This works with any standard animation.

```jsx
<View animate={Animation.fadeIn()} animateOn="View" />
```

### 2. Using `*OnView` Helper Functions
These are performant, pure CSS animations explicitly designed for entry/exit effects. Imported directly from `app-studio`.

```jsx
import { 
  fadeInOnView, 
  slideUpOnView, 
  scaleUpOnView,
  blurInOnView,
  rotateInOnView,
  revealOnView,
  flipXOnView,
  flipYOnView
} from 'app-studio';

<View animate={fadeInOnView()} />
<View animate={slideUpOnView({ distance: '50px' })} />
<View animate={revealOnView()} /> // Clip-path reveal
```

## 6. Scroll Progress Animations

These animations are linked to the scroll position associated with a timeline (usually the nearest scroller). As you scroll active range, the animation progresses.

```jsx
// Text that fills efficiently as you scroll (requires CSS variable support)
<View animate={Animation.fillTextScroll()} />

// Image that unclips/expands as you scroll
<View animate={Animation.unclipScroll()} />

// Item that fades in based on scroll progress
<View animate={Animation.fadeInScroll()} />
```

## 7. Event-Based Animations

You can trigger animations on interactions like hover, click, or focus using the `on` prop or underscore props (`_hover`, `_active`).

```jsx
<View
  _hover={{
    // Pulse animation while hovering
    animate: Animation.pulse({ duration: '0.5s' }),
    scale: 1.05
  }}
  
  on={{
    click: {
      animate: Animation.flash()
    }
  }}
>
  <Text>Hover or Click Me</Text>
</View>
```

## 8. Custom Animation Sequences

You can create complex animation sequences by configuring keyframes directly.

```jsx
const customTwist = {
  from: { transform: 'rotate(0deg) scale(1)' },
  '50%': { transform: 'rotate(180deg) scale(1.5)' },
  to: { transform: 'rotate(360deg) scale(1)' },
  duration: '2s',
  iterationCount: 'infinite'
};

<View animate={customTwist} />
```

## 9. Best Practices

1.  **Performance**: Prefer standard transforms (`translate`, `scale`, `rotate`) and `opacity`. Avoid animating layout properties like `width` or `margin`.
2.  **Scroll Animations**: Use `animateOn="View"` or `*OnView` helpers for "reveal" effects, as they run on the compositor thread and don't require JavaScript listeners.
3.  **Accessibility**: Respect user motion preferences.
4.  **Composability**: You can mix standard styles with animations.
    ```jsx
    <View 
      style={{ opacity: 0 }} // Initial state
      animate={Animation.fadeIn({ delay: '0.5s', fillMode: 'forwards' })} 
    />
    ```
