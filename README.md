# App-Studio

App-Studio is a powerful React-based library designed to simplify the process of building responsive, interactive, and visually consistent web applications. It provides CSS design props for layout, spacing, sizing, shadows, event management, and theming.

### Features

-   🌈 Add styled props to your application
-   📦 A set of simple and powerful React components
-   🌍 Internationalization support for dozens of languages
-   🎨 Powerful theme customization in every detail

## Table of Contents

- [Installation](#2-installation)
- [Core Components](#3-core-components)
  - [Element](#element)
  - [View](#view)
  - [Text](#text)
  - [Form](#form)
  - [Image](#image)
- [Responsive Design](#4-responsive-design)
  - [Media Prop](#media-prop)
  - [useResponsive Hook](#useresponsive-hook)
- [Event Management](#5-event-management)
- [Theming](#6-theming)
- [Custom Hooks](#7-custom-hooks)
  - [useMount](#usemount)
- [Design Props](#8-design-props)
  - [Shadow Prop](#shadow-prop)
- [Animation](#9-animation)
  - [Basic Usage](#basic-usage)
  - [Available Animations](#available-animations)
  - [Animation Properties](#animation-properties)
- [Advanced Usage](#10-advanced-usage)
- [Contributing](#11-contributing)
- [License](#12-license)

## 2. Installation

To install App-Studio, run the following command:

```bash
npm install app-studio  --save
```

## 3. Core Components

### Element

The `Element` component is the base for all other components. It handles responsiveness, shadows, margins, padding, and more.

#### Key Features

-   Sets both `width` and `height` with the `size` prop.
-   Defines styles for different CSS events with the `on` prop.
-   Defines responsive styles for different media queries with the `media` prop.
-   Applies shadow effects with the `shadow` prop.

#### Usage

```jsx
<Element backgroundColor="color.blue" padding={10}>
  This is an element
</Element>
```

### View

The `View` component extends the basic `div` HTML element. It's a generic container used to create various layouts.

#### Key Features

-   Provides a flexible way to structure content.
-   Supports all `Element` props.

#### Usage

```jsx
<View backgroundColor="color.red" color="color.white" padding={20}>
  This is a view
</View>
```

### Text

The `Text` component extends the basic `div` HTML element for rendering text content.

#### Key Features

-   Provides text-specific styling options.
-   Supports all `Element` props.

#### Usage

```jsx
<Text color="color.blue">This is a text</Text>
```

### Form

The `Form` component extends the basic `form` HTML element and provides nested `Form.Button` and `Form.Input` components.

#### Key Features

-   Simplifies form creation and management.
-   Supports all `Element` props.

#### Usage

```jsx
<Form>
  <Form.Input placeholder="Enter your name" />
  <Form.Button>Submit</Form.Button>
</Form>
```

### Image

The `Image` component extends the basic `img` HTML element for displaying images.

#### Key Features

-   Supports responsive image loading with `media`.
-   Applies shadow effects with `shadow`.
-   Handles events with `on`.

#### Usage

```jsx
<Image src="url_to_image" alt="description" />
```

## 4. Responsive Design

App-Studio offers two primary methods for implementing responsive design: the `media` prop and the `useResponsive` hook.

### Media Prop

The `media` prop allows you to specify different styles for various devices or screen sizes without causing component re-renders.

#### Example

```jsx
<View size={100} 
  media={{
  mobile: { backgroundColor: 'color.green' },
  tablet: { backgroundColor: 'color.yellow' },
  xl: { backgroundColor: 'color.blue' },
  }}  
/>
```

### useResponsive Hook

The `useResponsive` hook provides information about the current screen size and device type based on defined breakpoints and devices.

#### Example

```jsx
const { screen, on } = useResponsive();

return (
  <View size={100} backgroundColor={responsive[screen]}>
  {screen} - mobile: {on('mobile') ? 'yes' : 'no'}
  </View>
);
```

To use these responsive features, wrap your app with `ResponsiveProvider`:

```jsx
<ResponsiveProvider 
  breakpoints={{
  xs: 0,
  sm: 340,
  md: 560,
  lg: 1080,
  xl: 1300,
  }}
  devices={{  
  mobile: ['xs', 'sm'],
  tablet: ['md', 'lg'],
  desktop: ['lg', 'xl']
  }}
>
  <App />
</ResponsiveProvider>
```

## 5. Event Management

App-Studio provides an intuitive way to manage CSS events through the `on` prop. This feature allows you to style elements based on various interactive states.

#### Example

```jsx
<View 
  backgroundColor="grey" 
  padding={20}
  on={{ hover: { backgroundColor: 'blue.100' } }}
>
  Hover over me
</View>
```

Supported events include `hover`, `active`, `focus`, and `disabled`.

## 6. Theming

App-Studio's theming system allows you to maintain a consistent look across your application using the `ThemeProvider` component.

#### Setting up the Theme

```javascript
const theme = {
  main: { primary: '#fff7ed' },
  components: { button: { background: '#fff7ed' } }
};

const colors = {
  main: { blue: '#94a3b8' },
  palette: {
  blueGray: {
    50: '#f8fafc',
    // ... other shades
    900: '#0f172a'
  }
  }
};
```

#### Using ThemeProvider

```jsx
<ThemeProvider theme={theme} colors={colors}>
  <App />
</ThemeProvider>
```

#### Applying Theme in Components

```jsx
<View backgroundColor="color.blue">
  <Text color="theme.primary">Hello</Text>
  <Button backgroundColor="theme.button.background">Click me</Button>
</View>
```

## 7. Custom Hooks

### useMount

The `useMount` hook executes logic when a component first mounts.

#### Usage

```jsx
import { useMount } from '@your-org/app-studio';

const MyComponent = () => {
  useMount(() => {
  console.log('MyComponent mounted');
  });

  return <div>MyComponent</div>;
};
```

## 8. Design Props

App-Studio provides additional props to better manage design integration in CSS. These props offer more control over the styling of components, including layout, spacing, and sizing.

### Example

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

### Shadow Prop

The `shadow` prop is used to manage shadows in CSS. It takes a number or a string as a value, which defines the shadow effect to apply to the component.

```jsx
<View 
  backgroundColor="theme.primary" 
  padding={20}
  shadow={6}
>
  I have a shadow
</View>
```

## 9. Animation

App-Studio provides a powerful animation system through the `Animation` object. Animations can be applied to any `Element` or its derivatives using the `animate` prop.

#### Usage

```jsx
// Basic animation
<View 
  animate={Animation.fadeIn({
    duration: '1s',
    timingFunction: 'ease',
    iterationCount: '1'
  })}
/>

// Animation sequence
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

// Animation on hover
<View
  on={{
    hover: {
      animate: Animation.rotate({ duration: '1s', timingFunction: 'ease' })
    }
  }}
/>
```

#### Available Animations

All animations are available through the `Animation` object:
- `Animation.fadeIn()`
- `Animation.fadeOut()`
- `Animation.bounce()`
- `Animation.rotate()`
- `Animation.pulse()`
- And many more...

### Basic Usage

To apply an animation to a component, use the `animate` prop with an animation object:

```jsx
import { View, Animation } from 'app-studio';

function Example() {
  return (
    <View
      animate={Animation.fadeIn()} // Fades in the view
      backgroundColor="theme.primary"
      padding={20}
    >
      This view will fade in
    </View>
  );
}
```

### Available Animations

App-Studio comes with a set of pre-defined animations that you can use out of the box:

#### Transition Animations

-   `fadeIn` / `fadeOut`
-   `slideInLeft` / `slideInRight` / `slideInUp` / `slideInDown`
-   `zoomIn` / `zoomOut`

#### Transform Animations

-   `rotate`
-   `scale`
-   `translate`

#### Effect Animations

-   `bounce`
-   `pulse`
-   `flash`
-   `shake`
-   `swing`
-   `rubberBand`
-   `wobble`
-   `flip`
-   `heartBeat`
-   `rollIn` / `rollOut`
-   `lightSpeedIn` / `lightSpeedOut`
-   `hinge`
-   `jackInTheBox`

Each animation function accepts parameters to customize the duration, timing function, and other properties.

#### Animation Properties

Each animation function accepts an object with the following properties:

-   `duration`: Length of the animation (e.g., '1s', '500ms')
-   `timingFunction`: CSS timing function (e.g., 'ease', 'linear', 'ease-in-out')
-   `iterationCount`: Number of times to play the animation (number or 'infinite') // e.g., '1', 'infinite'

## 10. Advanced Usage

Here's an advanced example showcasing various features of App-Studio, including animations:

```jsx
import { ThemeProvider, ResponsiveProvider, View, Span, Text, Button, Animation } from 'app-studio';

const theme = {
  main: { primary: '#fff7ed' },
  components: { button: { background: '#fff7ed' } }
};

const colors = {
  main: { blue: '#94a3b8' },
  palette: { blueGray: { 500: '#64748b' } }
};

function Example() {
  return (
    <ResponsiveProvider>
      <ThemeProvider theme={theme} colors={colors}>
        <Span
          animate={Animation.fadeIn({duration: '1s',timingFunction:'ease-out'})}
          backgroundColor="color.blue"
          padding={10}
          media={{
            mobile: {
              padding: 20
            }
          }}
        >
          Base element
        </Span>
        <View 
          animate={Animation.slideInRight()}
          backgroundColor="theme.primary" 
          margin={10}
          width={200}
          on={{ hover: { backgroundColor: 'color.blueGray.500' } }}
        >
          Hover to change color
        </View>
        <Button 
          animate={Animation.pulse({timingFunction:'infinite'})}
          backgroundColor="theme.button.background"
        >
          Click here
        </Button>
        <Text 
          animate={Animation.typewriter('Hello', 100)}
          color="theme.primary"
        />
      </ThemeProvider>
    </ResponsiveProvider>
  );
}
```

## 11. Contributing

We welcome all contributions to App-Studio. Please read our [contributing guide](https://ant.design/docs/react/contributing) and let's build a better App-Studio together.

For more detailed information on contributing, including how to apply for being a collaborator, please refer to our [GitHub repository](https://github.com/rize-network/app-studio).

## 12. License

App-Studio is available under the MIT license. See the LICENSE file for more info.

---

For the latest updates, changelog, and more detailed information, please visit our [GitHub repository](https://github.com/rize-network/app-studio).
