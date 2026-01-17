# Theming with App-Studio

Theming is an essential part of any application. It allows you to maintain a consistent look and feel across your app. With App-Studio, theming becomes effortless through its `ThemeProvider` component. This document shows you how to set up theming in App-Studio.

## Available Colors Reference

App-Studio provides an extensive color system with three types of colors:

### 1. Singleton Colors (Basic Colors)
These are simple named colors accessible via `color-{name}`:

- **Basic Colors**: `white`, `black`, `red`, `green`, `blue`, `yellow`, `cyan`, `magenta`, `grey`, `orange`, `brown`, `purple`, `pink`, `lime`, `teal`, `navy`, `olive`, `maroon`, `gold`, `silver`, `indigo`, `violet`, `beige`, `turquoise`, `coral`, `chocolate`, `skyBlue`, `plum`, `darkGreen`, `salmon`

**Usage**: `color-white`, `color-gold`, `color-turquoise`

### 2. Color Palettes (Shaded Colors)
Each palette has 9 shades (50, 100, 200, 300, 400, 500, 600, 700, 800, 900) accessible via `color-{palette}-{shade}`:

**Available Palettes**:
- **Alpha Channels**: `whiteAlpha`, `blackAlpha` - RGBA colors with varying opacity
- **Neutrals**: `white`, `black`, `gray`, `dark`, `light`, `warmGray`, `trueGray`, `coolGray`, `blueGray`
- **Reds & Pinks**: `rose`, `pink`, `red`
- **Purples**: `fuchsia`, `purple`, `violet`
- **Blues**: `indigo`, `blue`, `lightBlue`, `cyan`
- **Greens**: `teal`, `emerald`, `green`, `lime`
- **Yellows & Oranges**: `yellow`, `amber`, `orange`

**Usage**: `color-blue-500`, `color-rose-200`, `color-gray-800`

### 3. Theme Colors
Custom theme colors defined in your theme configuration, accessible via `theme-{path}`:

**Default Theme Colors**:
- `theme-primary` - Main brand color (default: black)
- `theme-secondary` - Secondary brand color (default: blue)
- `theme-success` - Success state color (default: green.500)
- `theme-error` - Error state color (default: red.500)
- `theme-warning` - Warning state color (default: orange.500)
- `theme-disabled` - Disabled state color (default: gray.500)
- `theme-loading` - Loading state color (default: dark-500)

You can extend these with custom theme paths like `theme-button-background` or `theme-header-text`.

**Theme Colors with Alpha Transparency**:

You can add alpha transparency to any theme color by appending a numeric value (0-1000):

**Syntax**: `theme-{key}-{alpha}`

**Examples**:
- `theme-primary-100` → Primary color with 10% opacity
- `theme-primary-500` → Primary color with 50% opacity
- `theme-secondary-200` → Secondary color with 20% opacity
- `theme-error-300` → Error color with 30% opacity

This is especially useful for creating subtle backgrounds, overlays, or hover states using your theme colors:

```javascript
<View backgroundColor="theme-primary-100" padding={20}>
  <Text color="theme-primary">Subtle primary background</Text>
</View>

<Button
  backgroundColor="theme-secondary"
>
  Hover me
</Button>
```

### 4. Mode-Specific Colors
Access light or dark mode colors directly, regardless of current theme:

- **Light Mode**: `light-{colorName}` or `light-{palette}-{shade}`
- **Dark Mode**: `dark-{colorName}` or `dark-{palette}-{shade}`

**Usage**: `light-white`, `dark-blue-500`, `light-gray-100`

### Color System Hierarchy
```
color-*           → Direct color access (current theme mode)
  ├─ color-white  → Singleton colors
  ├─ color-blue-500 → Palette colors with shades
  └─ color-blue-500-200 → Palette colors with alpha (20% opacity)

theme-*           → Custom theme configuration
  ├─ theme-primary → Theme color
  ├─ theme-primary-100 → Theme color with alpha (10% opacity)
  └─ theme-button-background → Nested theme path

light-*           → Always use light mode colors
  ├─ light-white
  └─ light-blue-500

dark-*            → Always use dark mode colors
  ├─ dark-white
  └─ dark-red-200
```

### 5. Alpha Transparency (4th Parameter)

Add dynamic transparency to any palette color using a 4th parameter. The alpha value ranges from 0-1000, which maps to CSS opacity percentages (0%-100%).

**Syntax**: `color-{palette}-{shade}-{alpha}`

**Alpha Value Range**:
- `0` = fully transparent (0% opacity)
- `500` = semi-transparent (50% opacity)
- `1000` = fully opaque (100% opacity)

**How It Works**:
Instead of computing RGBA values in JavaScript, App-Studio uses the modern CSS `color-mix()` function. This keeps colors as CSS variables, making them:
- **Theme-aware**: Automatically adapts when switching between light/dark modes
- **Performant**: No JavaScript computation needed
- **Standards-based**: Uses native CSS color functions

**Examples**:
- `color-black-900-200` → `color-mix(in srgb, var(--color-black-900) 20%, transparent)` - Black with 20% opacity
- `color-blue-500-500` → `color-mix(in srgb, var(--color-blue-500) 50%, transparent)` - Blue-500 with 50% opacity
- `color-red-600-800` → `color-mix(in srgb, var(--color-red-600) 80%, transparent)` - Red-600 with 80% opacity

**Use Cases**:
- Create semi-transparent overlays without defining new alpha color palettes
- Apply dynamic transparency to any existing color
- Build glassmorphism effects with precise opacity control
- Use in gradients with CSS variable-based colors

```javascript
// Semi-transparent overlay
<View backgroundColor="color-black-900-300" padding={20}>
  <Text color="color-white">30% opacity black overlay</Text>
</View>

// Glassmorphism card
<View
  backgroundColor="color-gray-100-200"
  backdropFilter="blur(10px)"
  padding={20}
>
  <Text>Glass effect card</Text>
</View>

// Gradient with alpha colors (CSS variables!)
<View
  background="linear-gradient(135deg, color-red-500-200 0%, color-blue-500-1000 100%)"
  padding={20}
>
  <Text>Gradient with variable-based alpha colors</Text>
</View>
```

## Setting up the Theme Object

First, define a theme object that contains the properties you'd like to customize, such as colors and palettes. This object can be as simple or as complex as your needs require.

Here's an example:

```javascript
const theme = {
    main:{
       primary: '#fff7ed'
    },
    components: {
      button:{
        background: '#fff7ed'
      }
    }
};

const colors = {
    main:{
       blue: '#94a3b8'
    },
    palette: {
      blueGray: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a'
      }
    }
};
```

## How ThemeProvider Works

App-Studio's `ThemeProvider` uses a modern, React-idiomatic approach to theming with CSS variables.

### CSS Variables via Style Prop

Instead of imperatively injecting a `<style>` tag into the DOM, the `ThemeProvider` generates CSS variables and passes them directly to the wrapper element's `style` prop:

```tsx
// Under the hood, ThemeProvider does this:
<div 
  data-theme={themeMode}
  style={{
    '--color-white': '#FFFFFF',
    '--color-black': '#000000',
    '--color-blue-500': '#3b82f6',
    '--theme-primary': 'var(--color-black)',
    // ... hundreds more CSS variables
    width: '100%',
    height: '100%',
  }}
>
  {children}
</div>
```

### Benefits of This Approach

1. **React-Managed**: Fully declarative, no imperative DOM manipulation
2. **SSR-Friendly**: Works in server-side rendering without requiring `document`
3. **Auto-Cleanup**: CSS variables are automatically removed when the component unmounts
4. **Performance**: Variables are memoized and only regenerated when theme configuration changes
5. **Type-Safe**: TypeScript-friendly with proper typing for all variables

### Theme Mode Switching

When you switch theme modes (light ↔ dark), React automatically updates all CSS variables:

```tsx
const { setThemeMode } = useTheme();

// This triggers a re-render with new CSS variable values
setThemeMode('dark');
// All --color-* variables now point to dark mode values
```

The transition is smooth because:
- CSS variables update instantly
- You can add CSS transitions for smooth color changes
- No DOM manipulation or style tag injection needed


## Using `ThemeProvider`

Wrap your application's root component with `ThemeProvider` and pass the theme object as a prop. This will make the theme available to all child components.

```javascript
import { ThemeProvider, View } from 'app-studio';

// ...

function App() {
  return (
    <ThemeProvider theme={theme} colors={colors}>
      {/* The rest of your app */}
    </ThemeProvider>
  );
}
```

## Using the Theme in Components

Now that the theme is available, you can use it in your components. All color references are resolved automatically based on the current theme mode.

### Color Reference Formats

App-Studio supports multiple ways to reference colors:

1. **Direct Color Values**: `"#fff"`, `"rgb(255,0,0)"`, `"transparent"`
2. **Singleton Colors**: `"color-white"`, `"color-gold"`, `"color-turquoise"`
3. **Palette Colors**: `"color-blue-500"`, `"color-rose-200"`, `"color-gray-800"`
4. **Theme Colors**: `"theme-primary"`, `"theme-button-background"`
5. **Mode-Specific Colors**: `"light-white"`, `"dark-blue-500"`

### Examples

```javascript
import { View, Text } from 'app-studio';
import { Button } from '@app-studio/web';

function Example() {
  return (
    <View backgroundColor="color-blue">
       {/* Using palette colors with shades */}
       <View backgroundColor="color-blueGray-500">
        <Text color="theme-primary">Hello</Text>
       </View>
       
       {/* Using theme colors */}
       <Button backgroundColor="theme-button-background">Hello</Button>
       
       {/* Using singleton colors */}
       <View backgroundColor="color-turquoise" padding={10}>
         <Text color="color-white">Turquoise Background</Text>
       </View>
       
       {/* Using alpha colors for transparency */}
       <View backgroundColor="color-blackAlpha-500">
         <Text color="color-whiteAlpha-900">Semi-transparent</Text>
       </View>
    </View>
  );
}
```

### All Available Color Palettes

Each palette below has shades: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900

**Alpha Transparency**:
- `color-whiteAlpha-{shade}` - White with alpha (rgba)
- `color-blackAlpha-{shade}` - Black with alpha (rgba)

**Neutral Colors**:
- `color-white-{shade}` - White to light gray scale
- `color-black-{shade}` - Black to dark gray scale
- `color-gray-{shade}` - True gray scale
- `color-slate-{shade}` - Cool gray with blue undertones
- `color-zinc-{shade}` - Neutral gray scale
- `color-neutral-{shade}` - True neutral gray
- `color-stone-{shade}` - Warm gray with brown undertones
- `color-dark-{shade}` - Dark neutral scale
- `color-light-{shade}` - Light neutral scale
- `color-warmGray-{shade}` - Warm gray tones
- `color-trueGray-{shade}` - True neutral gray (legacy)
- `color-coolGray-{shade}` - Cool gray tones
- `color-blueGray-{shade}` - Blue-tinted gray

**Red & Pink Family**:
- `color-rose-{shade}` - Rose pink tones
- `color-pink-{shade}` - Pink tones
- `color-red-{shade}` - Red tones

**Purple Family**:
- `color-fuchsia-{shade}` - Bright purple-pink
- `color-purple-{shade}` - Purple tones
- `color-violet-{shade}` - Violet tones

**Blue Family**:
- `color-indigo-{shade}` - Deep blue-purple
- `color-blue-{shade}` - Blue tones
- `color-lightBlue-{shade}` - Light blue tones
- `color-cyan-{shade}` - Cyan tones

**Green Family**:
- `color-teal-{shade}` - Teal (blue-green)
- `color-emerald-{shade}` - Emerald green
- `color-green-{shade}` - Green tones
- `color-lime-{shade}` - Lime green

**Yellow & Orange Family**:
- `color-yellow-{shade}` - Yellow tones
- `color-amber-{shade}` - Amber (orange-yellow)
- `color-orange-{shade}` - Orange tones

### Accessing Specific Theme Mode Colors

You can directly access colors from a specific theme mode regardless of the current theme mode using the `light-` or `dark-` prefix:

```javascript
import { View, Text } from 'app-studio';

function Example() {
  return (
    <View>
      {/* Always use light mode white color regardless of current theme mode */}
      <Text color="light-white">Always light mode white</Text>

      {/* Always use dark mode red-200 color regardless of current theme mode */}
      <View backgroundColor="dark-red-200">
        <Text>Always dark mode red-200 background</Text>
      </View>
    </View>
  );
}
```

This is useful when you need to access a specific theme mode's color regardless of the current theme setting.

### Direct Theme Color Access

App-Studio allows you to directly call theme colors using dash notation format. This makes your code more readable and maintainable:

```javascript
import { View, Text } from 'app-studio';

function Example() {
  return (
    <View>
      {/* Access light theme colors directly */}
      <Text color="light-white">White text in light mode</Text>
      <View backgroundColor="light-blue-500">
        <Text>Light blue background</Text>
      </View>

      {/* Access dark theme colors directly */}
      <Text color="dark-white">White text in dark mode</Text>
      <View backgroundColor="dark-red-200">
        <Text>Dark red background</Text>
      </View>

      {/* Mix and match in the same component */}
      <View
        backgroundColor="light-gray-100"
        borderColor="dark-gray-800"
        borderWidth={1}
      >
        <Text>Mixed theme colors</Text>
      </View>
    </View>
  );
}
```

This direct access syntax works with all color-related properties and can be used with both singleton colors (like `white`, `black`) and palette colors (like `red-200`, `blue-500`). It provides a convenient way to reference specific theme colors without having to use the `getColor` function from the `useTheme` hook.

### Smart Text Contrast

For text that needs to be visible on any background color (light, dark, or dynamic gradients), App-Studio provides a smart contrast feature.

**Default Behavior:** If you do **not** specify a `color` prop on a `Text` or `Element` component, it automatically applies `mix-blend-mode: difference` and sets the color to `white`. This intelligently inverts the text color based on the background behind it, ensuring visibility.

**Explicit Control:** You can also force this behavior by explicitly setting the `blend` prop to `true`, even if a color is specified (though the color will be overridden to white for the blend calculation).

This is particularly useful for:
- Text over images or videos
- Components that need to work in both light and dark modes without specific color overrides
- Text over gradients where the background lightness varies

```javascript
import { View, Text } from 'app-studio';

function SmartTextExample() {
  return (
    <View>
      {/* Automatically becomes white on black background (no color specified) */}
      <View backgroundColor="black" padding={20}>
        <Text>Visible on Black</Text>
      </View>

      {/* Automatically becomes black on white background (no color specified) */}
      <View backgroundColor="white" padding={20}>
        <Text>Visible on White</Text>
      </View>

      {/* Works on colored backgrounds too */}
      <View backgroundColor="red" padding={20}>
        <Text>Visible on Red</Text>
      </View>
      
      {/* And gradients! */}
       <View 
        style={{ background: 'linear-gradient(90deg, #ffffff 0%, #000000 100%)' }} 
        padding={20}
      >
        <Text fontWeight="bold">
          Smart Text Across Gradient
        </Text>
      </View>

      {/* Explicitly disabling it by setting a color */}
      <View backgroundColor="white" padding={20}>
        <Text color="black">Standard Black Text (No Blend)</Text>
      </View>
    </View>
  );
}
```

## Complete Example

Here's a complete example demonstrating all color reference methods:

```javascript
import React from 'react';
import { ThemeProvider, View, Text, Button } from 'app-studio';

// Custom theme configuration
const theme = {
  main: {
    primary: 'color-blue-600',      // References a palette color
    secondary: 'color-purple-500',
    accent: 'color-orange-400'
  },
  components: {
    button: {
      background: 'color-emerald-500',
      text: 'color-white',
      disabled: 'color-gray-400'
    },
    card: {
      background: 'color-white',
      border: 'color-gray-200'
    }
  }
};

// Custom color overrides (optional)
const customColors = {
  main: {
    brand: '#0066cc',  // Custom singleton color
    blue: '#1e40af'    // Override default blue
  },
  palette: {
    // Override or add custom palettes
    custom: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e'
    }
  }
};

function Example() {
  return (
    <ThemeProvider theme={theme} colors={customColors} mode="light">
      {/* Using theme colors */}
      <View backgroundColor="theme-components-card-background" padding={20}>
        <Text color="theme-main-primary" fontSize={24}>
          Primary Theme Color
        </Text>
        
        {/* Using palette colors directly */}
        <View backgroundColor="color-rose-100" padding={10} marginTop={10}>
          <Text color="color-rose-900">Rose palette color</Text>
        </View>
        
        {/* Using singleton colors */}
        <View backgroundColor="color-turquoise" padding={10} marginTop={10}>
          <Text color="color-white">Turquoise singleton</Text>
        </View>
        
        {/* Using custom colors */}
        <View backgroundColor="color-brand" padding={10} marginTop={10}>
          <Text color="color-white">Custom brand color</Text>
        </View>
        
        {/* Using mode-specific colors */}
        <View backgroundColor="light-gray-100" padding={10} marginTop={10}>
          <Text color="dark-gray-900">Always light background, dark text</Text>
        </View>
        
        {/* Using alpha transparency */}
        <View backgroundColor="color-blackAlpha-500" padding={10} marginTop={10}>
          <Text color="color-whiteAlpha-900">Semi-transparent overlay</Text>
        </View>
        
        {/* Button using theme */}
        <Button 
          backgroundColor="theme-components-button-background"
          color="theme-components-button-text"
        >
          Themed Button
        </Button>
      </View>
    </ThemeProvider>
  );
}
```

## Quick Reference for AI Agents

When working with colors in App-Studio, use these patterns:

### Color Access Patterns
```javascript
// Pattern: color-{name}
"color-white"           // → "#FFFFFF" (in light mode) or "#000000" (in dark mode)
"color-gold"            // → "#FFD700"
"color-turquoise"       // → "#40E0D0"

// Pattern: color-{palette}-{shade}
"color-blue-500"        // → "#3b82f6" (light) or "#60a5fa" (dark)
"color-rose-200"        // → "#fecdd3" (light) or "#6b112f" (dark)
"color-gray-800"        // → "#27272a" (light) or "#f4f4f5" (dark)

// Pattern: color-{palette}-{shade}-{alpha} (CSS color-mix!)
"color-black-900-200"   // → "color-mix(in srgb, var(--color-black-900) 20%, transparent)"
"color-blue-500-500"    // → "color-mix(in srgb, var(--color-blue-500) 50%, transparent)"
"color-red-600-800"     // → "color-mix(in srgb, var(--color-red-600) 80%, transparent)"

// Pattern: theme-{path}
"theme-primary"         // → Resolves to your theme's primary color
"theme-button-background" // → Resolves to nested theme path

// Pattern: theme-{key}-{alpha} (CSS color-mix!)
"theme-primary-100"     // → "color-mix(in srgb, var(--theme-primary) 10%, transparent)"
"theme-primary-500"     // → "color-mix(in srgb, var(--theme-primary) 50%, transparent)"
"theme-secondary-200"   // → "color-mix(in srgb, var(--theme-secondary) 20%, transparent)"

// Pattern: light-{name} or light-{palette}-{shade}
"light-white"           // → Always "#FFFFFF" (light mode)
"light-blue-500"        // → Always "#3b82f6" (light mode value)

// Pattern: dark-{name} or dark-{palette}-{shade}
"dark-white"            // → Always "#000000" (dark mode white)
"dark-red-200"          // → Always "#6b112f" (dark mode value)

// Direct values (unchanged)
"#ff0000"               // → "#ff0000"
"rgb(255, 0, 0)"        // → "rgb(255, 0, 0)"
"transparent"           // → "transparent"
```

### Available Singleton Colors (30 total)
```
white, black, red, green, blue, yellow, cyan, magenta, grey, orange,
brown, purple, pink, lime, teal, navy, olive, maroon, gold, silver,
indigo, violet, beige, turquoise, coral, chocolate, skyBlue, plum,
darkGreen, salmon
```

### Available Color Palettes (34 total)
```
whiteAlpha, blackAlpha, white, black, rose, pink, fuchsia, purple,
violet, indigo, blue, lightBlue, cyan, teal, emerald, green, lime,
yellow, amber, orange, red, warmGray, trueGray, gray, dark, light,
coolGray, blueGray, slate, zinc, neutral, stone
```

### Shades Available
Each palette has these shades: `50, 100, 200, 300, 400, 500, 600, 700, 800, 900`

**Note**: For a `1000` shade (fully opaque), use the alpha parameter: `color-{palette}-900-1000`

### Theme Mode Behavior
- **Light Mode**: Uses `defaultLightPalette` and `defaultLightColors`
- **Dark Mode**: Uses `defaultDarkPalette` and `defaultDarkColors`
- Colors automatically switch based on `themeMode` unless using `light-*` or `dark-*` prefix
- Color values are inverted for dark mode (e.g., `color-white` becomes black in dark mode)

## Using Colors with Animations

When using colors in CSS animations or gradients, you can reference theme variables directly using the `var(--color-*)` syntax. This is especially useful for scroll-driven animations like `fillTextScroll()`.

### CSS Variable References

App-Studio generates CSS variables for all palette colors:

```javascript
// CSS Variable naming pattern
var(--color-{palette}-{shade})

// Examples
var(--color-blue-500)      // Blue 500
var(--color-emerald-400)   // Emerald 400
var(--color-rose-600)      // Rose 600
var(--color-white)         // White singleton
var(--color-black)         // Black singleton
```

### Using Colors in Gradients

For animations that use gradients (like FillText), use CSS variables:

```jsx
<View
  backgroundImage={`
    linear-gradient(90deg, var(--color-blue-500), var(--color-blue-400))
  `}
/>
```

### Alpha Transparency in Animations

Use `color-mix()` for semi-transparent colors that remain theme-aware:

```jsx
<View
  css={`
    /* 15% opacity blue */
    color: color-mix(in srgb, var(--color-blue-500) 15%, transparent);

    /* 50% opacity white */
    background: color-mix(in srgb, var(--color-white) 50%, transparent);
  `}
/>
```

### FillText Animation Example

The `Animation.fillTextScroll()` uses theme colors for the text fill effect:

```jsx
import { View, Animation } from 'app-studio';

<View
  as="span"
  fontSize={48}
  fontWeight="bold"
  css={`
    color: color-mix(in srgb, var(--color-violet-500) 15%, transparent);
    --fill-color: var(--color-violet-500);
    --accent: var(--color-violet-400);
  `}
  backgroundImage={`
    linear-gradient(90deg, transparent calc(100% - 1ch), var(--accent) calc(100% - 1ch)),
    linear-gradient(90deg, var(--fill-color), var(--fill-color))`}
  backgroundClip="text"
  animate={Animation.fillTextScroll()}
>
  Themed scroll animation
</View>
```

### Available Palette Variables

All color palettes have CSS variables available:

| Palette | Example Variable | Use Case |
|---------|-----------------|----------|
| `blue` | `var(--color-blue-500)` | Primary actions, links |
| `emerald` | `var(--color-emerald-500)` | Success states |
| `rose` | `var(--color-rose-500)` | Error states |
| `amber` | `var(--color-amber-500)` | Warning states |
| `violet` | `var(--color-violet-500)` | Creative, premium |
| `cyan` | `var(--color-cyan-500)` | Info, highlights |
| `gray` | `var(--color-gray-800)` | Text on light backgrounds |

See [docs/Animation.md](./Animation.md) for complete animation examples with theming.
