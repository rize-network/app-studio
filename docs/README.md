# App Studio

##  Components

The `Element` component is the foundation of App-Studio. It serves as the base component for building other components and provides extensive styling capabilities.

**Key Features:**
- Responsive design support
- Event handling
- Shadow effects
- Margin and padding control
- Media query support

**Props:**
- `size`: Sets equal width and height
- `on`: Event handling styles
- `media`: Media query styles
- `shadow`: Shadow effects
- All standard HTML div props are supported

### View Component

The `View` component extends the HTML `div` element with enhanced styling capabilities.

**Key Features:**
- Layout management
- Flexbox support
- Background styling
- Border control

**Props:**
- All Element component props
- `flex`: Flexbox properties
- `direction`: Flex direction
- `wrap`: Flex wrap
- `justify`: Justify content
- `align`: Align items

### Text Component

The `Text` component provides typography-related styling and text manipulation features.

**Key Features:**
- Typography control
- Text alignment
- Text transformation
- Font styling

**Props:**
- All Element component props
- `fontSize`: Font size
- `fontWeight`: Font weight
- `lineHeight`: Line height
- `textAlign`: Text alignment
- `transform`: Text transformation

### Form Component

The `Form` component provides form handling capabilities with built-in validation and styling.

**Key Features:**
- Form validation
- Input styling
- Button styling
- Form layout control

**Subcomponents:**
- `Form.Input`
- `Form.Button`

**Props:**
- All Element component props
- `onSubmit`: Form submission handler
- `validation`: Form validation rules
- `initialValues`: Initial form values

### Image Component

The `Image` component extends the HTML `img` element with additional styling and loading features.

**Key Features:**
- Lazy loading
- Responsive images
- Image styling
- Error handling

**Props:**
- All Element component props
- `src`: Image source
- `alt`: Alternative text
- `lazy`: Enable lazy loading
- `fallback`: Fallback image source

## Animation System

App-Studio provides a powerful animation system through the `Animation` object. All components that extend from `Element` can use animations.

**Basic Usage:**

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

// Animation on hover
<View
  on={{
    hover: {
      animate: Animation.rotate({ duration: '1s', timingFunction: 'ease' })
    }
  }}
/>
```

**Animation Sequences:**

You can create complex animation sequences by defining an array of animation states:

```jsx
const sequence = [
  {
    from: { opacity: 0, transform: 'translateY(-100px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    duration: '2s',
    timingFunction: 'ease-in'
  },
  {
    from: { opacity: 1, transform: 'translateY(100px)' },
    to: { opacity: 0, transform: 'translateY(0)' },
    duration: '2s',
    timingFunction: 'ease-out'
  }
];

<View animate={sequence} />
```

**Available Animations:**

All animations are accessed through the `Animation` object:

- **Transitions:**
  - `Animation.fadeIn()`
  - `Animation.fadeOut()`
  - `Animation.slideInLeft()`
  - `Animation.slideInRight()`
  - `Animation.slideOutLeft()`
  - `Animation.slideOutRight()`
  
- **Transforms:**
  - `Animation.rotate()`
  - `Animation.scale()`
  - `Animation.translate()`
  
- **Effects:**
  - `Animation.bounce()`
  - `Animation.pulse()`
  - `Animation.shake()`
  - `Animation.flash()`

**Animation Properties:**

Each animation function accepts an options object with these properties:

```typescript
{
  duration?: string;        // e.g., '1s', '500ms'
  timingFunction?: string;  // e.g., 'ease', 'linear', 'ease-in-out'
  iterationCount?: string | number; // e.g., '1', 'infinite'
}
```

**Responsive Animations:**

Animations can be combined with media queries for responsive behavior:

```jsx
<View
  media={{
    mobile: {
      animate: Animation.fadeIn({ duration: '1s' })
    },
    tablet: {
      animate: Animation.slideInLeft({ duration: '0.5s' })
    }
  }}
/>
```

**Event-Based Animations:**

Animations can be triggered by events using the `on` prop:

```jsx
<View
  on={{
    hover: {
      animate: Animation.pulse({ duration: '1s', iterationCount: 'infinite' })
    },
    click: {
      animate: Animation.flash({ duration: '0.5s' })
    }
  }}
/>
```
