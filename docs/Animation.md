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

### Custom Scroll Timeline with `animate.timeline`

For fine-grained control over scroll-driven animations, use the `animate` prop with `timeline` and `keyframes`:

```jsx
import { View, Vertical, Text } from 'app-studio';

function ScrollProgressBar() {
  return (
    <Vertical gap={20} padding={20} height="100vh">
      <Text fontSize={24} fontWeight="bold">
        Scroll Timeline Animation
      </Text>
      <Text>Scroll down to see the progress bar animate.</Text>

      {/* Scroll container */}
      <View
        height={300}
        overflow="auto"
        border="1px solid #ccc"
        padding={20}
        position="relative"
      >
        {/* Progress Bar - sticks to top of container */}
        <View
          position="sticky"
          top={0}
          width="100%"
          height={8}
          backgroundColor="#ddd"
          zIndex={10}
        >
          {/* Animated progress fill */}
          <View
            height="100%"
            backgroundColor="color-blue-500"
            width="0%"
            animate={{
              timeline: 'scroll()',
              keyframes: {
                from: { width: '0%' },
                to: { width: '100%' },
              },
            }}
          />
        </View>

        {/* Scrollable content */}
        <Vertical gap={50} paddingVertical={50}>
          {[1, 2, 3, 4, 5].map((i) => (
            <View key={i} padding={20} backgroundColor="#f5f5f5" borderRadius={8}>
              Item {i}
            </View>
          ))}
        </Vertical>
      </View>
    </Vertical>
  );
}
```

**Timeline Options:**

| Timeline | Description |
|----------|-------------|
| `scroll()` | Links animation to the nearest scrollable ancestor's scroll progress |
| `scroll(root)` | Links to the root (viewport) scroll progress |
| `view()` | Links to element's visibility in the viewport (entry/exit) |

**Keyframe Properties:**

You can animate any CSS property between `from` and `to` states, or use percentage keyframes for more control:

```jsx
animate={{
  timeline: 'scroll()',
  keyframes: {
    '0%': { opacity: 0, transform: 'translateY(20px)' },
    '50%': { opacity: 1, transform: 'translateY(0)' },
    '100%': { opacity: 0.5, transform: 'translateY(-10px)' },
  },
}}
```

See the [ScrollTimeline Story](../stories/ScrollTimeline.stories.tsx) for a complete example.

### FillText Scroll Animation with Theming

The `fillTextScroll()` animation creates a text reveal effect that fills as the user scrolls. It integrates with App-Studio's theming system using CSS variables.

#### Basic Usage

```jsx
import { View, Animation } from 'app-studio';

<View
  as="span"
  fontSize={48}
  fontWeight="bold"
  color="color-gray-500"
  backgroundClip="text"
  animate={Animation.fillTextScroll({
    duration: '1s',
    timingFunction: 'linear',
    timeline: '--section',
    range: 'entry 100% cover 55%',
  })}
>
  Text that fills as you scroll
</View>
```

#### Theme-Aware FillText with CSS Variables

For full theme integration, use CSS variables from the theming system. This ensures colors adapt to light/dark mode:

```jsx
import { View, Text } from 'app-studio';
import { Animation } from 'app-studio';

function ThemedFillText({ children, color = 'blue' }) {
  // Map palette names to CSS variables
  const colors = {
    blue: {
      fill: 'var(--color-blue-500)',
      accent: 'var(--color-blue-400)',
      base: 'color-mix(in srgb, var(--color-blue-500) 15%, transparent)',
      underline: 'color-mix(in srgb, var(--color-blue-500) 20%, transparent)',
    },
    emerald: {
      fill: 'var(--color-emerald-500)',
      accent: 'var(--color-emerald-400)',
      base: 'color-mix(in srgb, var(--color-emerald-500) 12%, transparent)',
      underline: 'color-mix(in srgb, var(--color-emerald-500) 20%, transparent)',
    },
    violet: {
      fill: 'var(--color-violet-500)',
      accent: 'var(--color-violet-400)',
      base: 'color-mix(in srgb, var(--color-violet-500) 10%, transparent)',
      underline: 'color-mix(in srgb, var(--color-violet-500) 20%, transparent)',
    },
  };

  const { fill, accent, base, underline } = colors[color] || colors.blue;

  return (
    <View
      as="span"
      fontSize={48}
      fontWeight="bold"
      css={`
        color: ${base};
        --fill-color: ${fill};
        --accent: ${accent};
        --underline-color: ${underline};
        --underline-block-width: 200vmax;
        --underline-width: 100%;
      `}
      backgroundImage={`
        linear-gradient(90deg, transparent calc(100% - 1ch), var(--accent) calc(100% - 1ch)),
        linear-gradient(90deg, var(--fill-color), var(--fill-color)),
        linear-gradient(90deg, var(--underline-color), var(--underline-color))`}
      backgroundSize={`
        var(--underline-block-width) var(--underline-width),
        var(--underline-block-width) var(--underline-width),
        100% var(--underline-width)`}
      backgroundRepeat="no-repeat"
      backgroundPositionX="0"
      backgroundPositionY="100%"
      backgroundClip="text"
      animate={Animation.fillTextScroll({
        duration: '1s',
        timingFunction: 'linear',
      })}
    >
      {children}
    </View>
  );
}

// Usage with different color palettes
<ThemedFillText color="blue">Blue themed text</ThemedFillText>
<ThemedFillText color="emerald">Emerald themed text</ThemedFillText>
<ThemedFillText color="violet">Violet themed text</ThemedFillText>
```

#### Using Color Palettes

All App-Studio color palettes work with FillText. Reference them via CSS variables:

| Palette | Fill Variable | Accent Variable |
|---------|--------------|-----------------|
| Blue | `var(--color-blue-500)` | `var(--color-blue-400)` |
| Emerald | `var(--color-emerald-500)` | `var(--color-emerald-400)` |
| Violet | `var(--color-violet-500)` | `var(--color-violet-400)` |
| Amber | `var(--color-amber-500)` | `var(--color-amber-400)` |
| Rose | `var(--color-rose-500)` | `var(--color-rose-400)` |
| Cyan | `var(--color-cyan-500)` | `var(--color-cyan-400)` |
| Gray (light bg) | `var(--color-gray-800)` | `var(--color-gray-900)` |

#### Alpha Transparency with `color-mix()`

For semi-transparent colors that remain theme-aware, use `color-mix()`:

```jsx
// 15% opacity blue
baseColor="color-mix(in srgb, var(--color-blue-500) 15%, transparent)"

// 20% opacity emerald
underlineColor="color-mix(in srgb, var(--color-emerald-500) 20%, transparent)"

// 70% opacity white
fillColor="color-mix(in srgb, var(--color-white) 70%, transparent)"
```

#### Complete Section Example

Here's a complete FillText section with view-timeline:

```jsx
function FillTextSection() {
  return (
    <View
      css={`
        @supports (animation-timeline: scroll()) {
          @media (prefers-reduced-motion: no-preference) {
            view-timeline-name: --hero-section;
          }
        }
      `}
      backgroundColor="color-slate-900"
    >
      <View height="50vh" />
      <View as="main" height="200vh">
        <View
          as="section"
          position="sticky"
          top="0"
          height="100vh"
          display="grid"
          placeItems="center"
        >
          <View padding="5ch" textAlign="center" maxWidth={1200}>
            <View
              as="span"
              fontSize={56}
              fontWeight="bold"
              css={`
                color: color-mix(in srgb, var(--color-blue-500) 15%, transparent);
                --fill-color: var(--color-blue-500);
                --accent: var(--color-blue-400);
                --underline-color: color-mix(in srgb, var(--color-blue-500) 20%, transparent);
                --underline-block-width: 200vmax;
                --underline-width: 100%;
              `}
              backgroundImage={`
                linear-gradient(90deg, transparent calc(100% - 1ch), var(--accent) calc(100% - 1ch)),
                linear-gradient(90deg, var(--fill-color), var(--fill-color)),
                linear-gradient(90deg, var(--underline-color), var(--underline-color))`}
              backgroundSize={`
                var(--underline-block-width) var(--underline-width),
                var(--underline-block-width) var(--underline-width),
                100% var(--underline-width)`}
              backgroundRepeat="no-repeat"
              backgroundPositionX="0"
              backgroundPositionY="100%"
              backgroundClip="text"
              animate={Animation.fillTextScroll({
                duration: '1s',
                timingFunction: 'linear',
                timeline: '--hero-section',
                range: 'entry 100% cover 55%, cover 50% exit 0%',
              })}
            >
              Build beautiful scroll-driven animations with pure CSS.
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
```

See [docs/Theming.md](./Theming.md) for the complete color palette reference.

See the [FillText Examples Story](../stories/ScrollAnimation.stories.tsx) for interactive demos with all color themes.

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
