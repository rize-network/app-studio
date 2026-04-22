# Comprehensive Styling Guide for App-Studio

This guide covers advanced styling techniques in App-Studio, including state modifiers, pseudo-elements, media queries, and the underlying CSS system.

## Table of Contents

1. [State Modifiers](#state-modifiers)
2. [Pseudo-Elements](#pseudo-elements)
3. [Media Queries](#media-queries)
4. [CSS System Architecture](#css-system-architecture)
5. [Performance Optimization](#performance-optimization)
6. [Advanced Patterns](#advanced-patterns)

## State Modifiers

State modifiers allow you to define styles that apply based on user interactions or element states. They use underscore-prefixed props for a clean, declarative syntax.

### Basic State Modifiers

```javascript
import { Element } from 'app-studio';

<Element
  as="button"
  // Base styles
  padding={12}
  backgroundColor="color-blue-500"
  color="color-white"
  
  // Interaction states
  _hover={{ backgroundColor: "color-blue-600" }}
  _active={{ backgroundColor: "color-blue-700" }}
  _focus={{ outline: "2px solid color-blue-400" }}
  _disabled={{ opacity: 0.5, cursor: "not-allowed" }}
/>
```

### Form States

```javascript
// Input with validation states
<Element
  as="input"
  borderColor="color-gray-300"
  _focus={{ borderColor: "color-blue-500" }}
  _valid={{ borderColor: "color-green-500" }}
  _invalid={{ borderColor: "color-red-500" }}
/>

// Checkbox states
<Element
  as="input"
  type="checkbox"
  _checked={{ accentColor: "color-blue-500" }}
  _disabled={{ accentColor: "color-gray-400" }}
/>
```

### Child & Element Relationship States

```javascript
// First/last child
<View>
  <Element
    _firstChild={{ marginTop: 0 }}
    _lastChild={{ marginBottom: 0 }}
    marginTop={12}
    marginBottom={12}
  >
    List item
  </Element>
</View>

// Group hover - child reacts to parent hover
<View className="group" _hover={{ backgroundColor: "color-gray-100" }}>
  <Element
    color="color-gray-600"
    _groupHover={{ color: "color-blue-500" }}
  >
    Text changes when group hovers
  </Element>
</View>

// Peer modifiers - sibling relationships
<View>
  <input className="peer" />
  <Element
    color="color-gray-400"
    _peerFocus={{ color: "color-blue-500" }}
  >
    Label
  </Element>
</View>
```

## Pseudo-Elements

Pseudo-elements like `::before`, `::after`, `::first-letter`, etc., can be styled with the underscore prefix:

### Common Pseudo-Elements

```javascript
import { Element } from 'app-studio';

function ButtonWithUnderline() {
  return (
    <Element
      as="button"
      position="relative"
      
      // ::before pseudo-element
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '2px',
        backgroundColor: 'color-blue-500',
      }}
      
      // ::after pseudo-element
      _after={{
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 0,
        height: '2px',
        backgroundColor: 'color-blue-500',
        transition: 'width 300ms ease',
      }}
      
      _hover={{
        _after: {
          width: '100%',
        },
      }}
    >
      Hover me
    </Element>
  );
}
```

### Text Pseudo-Elements

```javascript
// Style first letter
<Element
  as="p"
  _firstLetter={{
    fontSize: 24,
    fontWeight: 'bold',
    color: 'color-blue-500',
  }}
>
  Lorem ipsum dolor sit amet...
</Element>

// Style first line
<Element
  as="p"
  _firstLine={{
    fontWeight: 'bold',
    color: 'color-gray-800',
  }}
>
  First line will be bold
</Element>

// Style selected text
<Element
  _selection={{
    backgroundColor: 'color-blue-300',
    color: 'color-white',
  }}
>
  Try selecting this text
</Element>
```

## Media Queries

Define responsive styles using the `media` prop:

### Basic Responsive Styles

```javascript
import { View, Text } from 'app-studio';

function ResponsiveComponent() {
  return (
    <View
      // Mobile first
      padding={8}
      fontSize={14}
      
      // Tablet and up
      media={{
        tablet: {
          padding: 16,
          fontSize: 16,
        },
        // Desktop and up
        desktop: {
          padding: 24,
          fontSize: 18,
        },
      }}
    >
      <Text>Responsive content</Text>
    </View>
  );
}
```

### Color Changes Across Breakpoints

```javascript
<View
  backgroundColor="color-white"
  color="color-gray-900"
  
  media={{
    tablet: {
      backgroundColor: "color-gray-50",
    },
    desktop: {
      backgroundColor: "color-white",
      color: "color-gray-950",
    },
  }}
/>
```

### Hide/Show Based on Breakpoint

```javascript
<View
  display="none"
  media={{
    tablet: { display: "block" },
  }}
>
  Only visible on tablet and larger
</View>
```

## CSS System Architecture

### How App-Studio's CSS System Works

App-Studio uses a sophisticated utility-class generation system based on CSS variables and atomic CSS principles.

#### Style Processing Pipeline

```
User Props
    ↓
Color Resolution (theme-aware)
    ↓
CSS Property Normalization
    ↓
Utility Class Generation
    ↓
LRU Cache (10,000 entries)
    ↓
CSS Injection (contextual)
    ↓
DOM Rendering
```

#### Contexts for CSS Injection

Styles are injected into different contexts for proper specificity management:

1. **Base**: Standard styles (lowest specificity)
2. **Pseudo**: Pseudo-class/element styles (`:hover`, `::before`, etc.)
3. **Media**: Media query styles
4. **Modifier**: Complex modifiers (group/peer)
5. **Override**: Highest specificity for `css` prop

### CSS Variables System

All theme colors are exposed as CSS variables:

```css
/* Color palettes */
--color-blue-500: #3b82f6;
--color-blue-600: #2563eb;
--color-rose-200: #fecdd3;

/* Theme colors */
--theme-primary: var(--color-blue-600);
--theme-secondary: var(--color-purple-500);

/* Light mode colors */
--light-white: #ffffff;
--dark-white: #000000;
```

Access them directly in CSS:

```javascript
<View
  css={{
    background: 'linear-gradient(90deg, var(--color-blue-500), var(--color-purple-500))',
  }}
/>
```

### Color Processing

Colors are processed through multiple stages:

1. **Token Recognition**: Identify color tokens (e.g., `color-blue-500`)
2. **Theme Resolution**: Resolve theme colors to actual values
3. **Alpha Application**: Apply transparency using `color-mix()`
4. **Mode Awareness**: Switch between light/dark mode colors

## Performance Optimization

### 1. LRU Caching

The utility class manager uses an LRU (Least Recently Used) cache with 10,000 entries:

```javascript
// Every computed class is cached
// Subsequent renders reuse the cached class
// Old entries are evicted to maintain memory
```

### 2. CSS Variable Reuse

Avoid redundant property-value combinations:

```javascript
// Good - reuses computed values
<View backgroundColor="color-blue-500" />
<View backgroundColor="color-blue-500" />

// Less efficient - different instances
<View backgroundColor="rgb(59, 130, 246)" />
<View backgroundColor="rgb(59, 130, 246)" />
```

### 3. Batch Style Updates

Group related style changes:

```javascript
// Good - batches all changes
<View
  padding={16}
  gap={8}
  flexDirection="column"
/>

// Less efficient - multiple renders
const [padding, setPadding] = useState(0);
const [gap, setGap] = useState(0);
```

### 4. Media Query Optimization

Define media queries once:

```javascript
// Define at component level
const responsiveStyles = {
  mobile: { padding: 8 },
  tablet: { padding: 16 },
  desktop: { padding: 24 },
};

// Reuse across multiple elements
<View media={responsiveStyles} />
<View media={responsiveStyles} />
```

## Advanced Patterns

### Compound States

Combine multiple state modifiers:

```javascript
<Element
  as="button"
  backgroundColor="color-blue-500"
  
  _hover={{
    backgroundColor: "color-blue-600",
    
    // Nested state: hover + focus
    _focus: {
      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
    },
  }}
  
  _active={{
    backgroundColor: "color-blue-700",
    transform: "scale(0.98)",
  }}
/>
```

### Dynamic Theming

```javascript
import { useTheme } from 'app-studio';
import { View } from 'app-studio';

function DynamicThemedComponent() {
  const { getColor } = useTheme();
  
  return (
    <View
      backgroundColor={getColor('theme-primary')}
      borderColor={getColor('theme-secondary')}
    />
  );
}
```

### CSS-in-JS Patterns

Use the `css` prop for complex styles:

```javascript
<View
  css={{
    // Standard CSS
    'background': 'linear-gradient(135deg, var(--color-blue-500) 0%, var(--color-purple-500) 100%)',
    'clip-path': 'polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)',
    'position': 'relative',
    
    // Vendor prefixes
    'WebkitMaskImage': 'linear-gradient(to bottom, black 0%, transparent 100%)',
  }}
  padding={20}
/>
```

### Animation with Colors

```javascript
import { View, Animation } from 'app-studio';

<View
  fontSize={48}
  fontWeight="bold"
  css={{
    'background': 'linear-gradient(90deg, var(--color-blue-500), var(--color-purple-500))',
    'background-clip': 'text',
    'color': 'transparent',
    'WebkitBackgroundClip': 'text',
    'WebkitTextFillColor': 'transparent',
  }}
  animate={Animation.scroll()}
/>
```

### Responsive Grid Layouts

```javascript
<View
  display="grid"
  gridTemplateColumns="1fr"
  gap={16}
  
  media={{
    tablet: {
      gridTemplateColumns: "1fr 1fr",
      gap: 24,
    },
    desktop: {
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 32,
    },
  }}
>
  {/* Grid items */}
</View>
```

### Accessibility Patterns

```javascript
import { Element } from 'app-studio';

function AccessibleButton() {
  return (
    <Element
      as="button"
      aria-label="Close dialog"
      backgroundColor="color-gray-100"
      
      // High contrast on focus
      _focusVisible={{
        outline: "3px solid color-blue-600",
        outlineOffset: "2px",
      }}
      
      // Disabled state indication
      _disabled={{
        backgroundColor: "color-gray-300",
        color: "color-gray-600",
        cursor: "not-allowed",
      }}
      
      // Reduce motion preference
      media={{
        'prefers-reduced-motion': {
          transition: "none",
        },
      }}
    >
      Close
    </Element>
  );
}
```

## Best Practices

1. **Use semantic color names** - `theme-primary`, `theme-error`, not arbitrary colors
2. **Leverage CSS variables** - Reference `var(--color-*)` for better performance
3. **Compose state modifiers** - Build complex states from simple ones
4. **Mobile-first responsive design** - Define mobile styles first, then enhance
5. **Cache computed styles** - Reuse style objects across components
6. **Avoid inline computations** - Pre-define color combinations in theme
7. **Use pseudo-elements sparingly** - They can complicate debugging
8. **Test state combinations** - Ensure all interactive states work properly

## Debugging

### Chrome DevTools Tips

1. **Inspect Utility Classes** - Look for `.{property}-{value}` class names
2. **Check CSS Variables** - Use DevTools to see all `--color-*` variables
3. **Monitor Cache** - Check if classes are being reused (cache hits)

### Browser Console

```javascript
// Check if a color is available
getComputedStyle(document.documentElement).getPropertyValue('--color-blue-500');

// Find all theme variables
Array.from(document.documentElement.style)
  .filter(prop => prop.startsWith('--'))
```

## Summary

App-Studio's styling system provides:

- ✅ Declarative state management with underscore-prefixed props
- ✅ Pseudo-element styling with full CSS support
- ✅ Responsive design with media queries
- ✅ Theme-aware colors with CSS variables
- ✅ High-performance caching and optimization
- ✅ Type-safe styling with TypeScript support
- ✅ Server-side rendering compatibility

For more information, see:
- [Theming Guide](./Theming.md)
- [Animation Guide](./Animation.md)
- [Responsive Design](./Responsive.md)
