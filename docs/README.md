# App-Studio Documentation

## Table of Contents
- [App-Studio Documentation](#app-studio-documentation)
  - [Table of Contents](#table-of-contents)
  - [1. Introduction](#1-introduction)
    - [Features](#features)
  - [2. Installation](#2-installation)
  - [3. Core Components](#3-core-components)
    - [Element](#element)
      - [Usage](#usage)
      - [Key Properties](#key-properties)
    - [View](#view)
      - [Usage](#usage-1)
    - [Text](#text)
      - [Usage](#usage-2)
    - [Form](#form)
      - [Usage](#usage-3)
    - [Image](#image)
      - [Usage](#usage-4)
  - [4. Responsive Design](#4-responsive-design)
    - [Media Prop](#media-prop)
      - [Example](#example)
    - [useResponsive Hook](#useresponsive-hook)
      - [Example](#example-1)
  - [5. Event Management](#5-event-management)
      - [Example](#example-2)
  - [6. Theming](#6-theming)
      - [Setting up the Theme](#setting-up-the-theme)
      - [Using ThemeProvider](#using-themeprovider)
      - [Applying Theme in Components](#applying-theme-in-components)
  - [7. Custom Hooks](#7-custom-hooks)
    - [useMount](#usemount)
      - [Usage](#usage-5)
  - [8. Design Props](#8-design-props)
    - [Example](#example-3)
    - [Shadow Prop](#shadow-prop)
  - [9. Animations](#9-animations)
    - [Basic Usage](#basic-usage)
    - [Available Animations](#available-animations)
    - [Customizing Animations](#customizing-animations)
    - [Creating Custom Animations](#creating-custom-animations)
    - [Combining Animations](#combining-animations)
    - [Animation Events](#animation-events)
  - [10. Advanced Usage](#10-advanced-usage)
  - [10. Contributing](#10-contributing)
  - [11. License](#11-license)

## 1. Introduction

App-Studio is a powerful React-based library designed to simplify the process of building responsive, interactive, and visually consistent web applications. It provides CSS design props for layout, spacing, sizing, shadows, event management, and theming.

### Features

- 🌈 Add styled props to your application
- 📦 A set of simple and powerful React components
- 🌍 Internationalization support for dozens of languages
- 🎨 Powerful theme customization in every detail

## 2. Installation

To install App-Studio, run the following command:

```bash
npm install app-studio  --save
```

## 3. Core Components

### Element

The `Element` component is the foundation of App-Studio. It handles a large part of the styling for other components, including responsiveness, shadow, margins, and padding.

#### Usage

```jsx
<Element backgroundColor="color.blue" padding={10}>
  This is an element
</Element>
```

#### Key Properties

- `size`: Sets equal width and height
- `on`: Defines styles for different CSS events
- `media`: Defines styles for different media queries
- `shadow`: Adds shadow to an element (boolean, number, or `Shadow` object)

### View

The `View` component is a versatile layout component that extends the basic HTML `div` tag with additional styling properties.

#### Usage

```jsx
<View backgroundColor="color.red" color="color.white" padding={20}>
  This is a view
</View>
```

### Text

The `Text` component extends the HTML `div` tag with additional text styling properties.

#### Usage

```jsx
<Text color="color.blue">This is a text</Text>
```

### Form

The `Form` component extends the HTML `form` tag and provides `Button` and `Input` subcomponents.

#### Usage

```jsx
<Form>
  <Input placeholder="Enter your name" />
  <Button>Submit</Button>
</Form>
```

### Image

The `Image` component extends the HTML `img` tag with additional properties like `shadow`, `media`, and `on`.

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

## 9. Animations

App-Studio provides a powerful and flexible animation system that allows you to easily add dynamic effects to your components. The animation system is based on CSS animations and can be applied using the `animate` prop.

### Basic Usage

To apply an animation to a component, use the `animate` prop with an animation object:

```jsx
import { View, Animation } from 'app-studio';

function Example() {
  return (
    <View
      animate={Animation.fadeIn()}
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

- `fadeIn` / `fadeOut`
- `slideInLeft` / `slideInRight` / `slideInUp` / `slideInDown`
- `zoomIn` / `zoomOut`
- `bounce`
- `rotate`
- `pulse`
- `flash`
- `shake`
- `swing`
- `rubberBand`
- `wobble`
- `flip`
- `heartBeat`
- `rollIn` / `rollOut`
- `lightSpeedIn` / `lightSpeedOut`
- `hinge`
- `jackInTheBox`

Each animation function accepts parameters to customize the duration, timing function, and other properties.

### Customizing Animations

You can customize animations by passing parameters to the animation functions:

```jsx
<View
  animate={Animation.fadeIn('2s', 'ease-in-out')}
  backgroundColor="theme.primary"
  padding={20}
>
  This view will fade in slowly
</View>
```

### Creating Custom Animations

You can also create custom animations by defining your own keyframes:

```jsx
const customAnimation = {
  from: { opacity: 0, transform: 'translateY(-50px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
  duration: '1s',
  timingFunction: 'ease-out'
};

<View
  animate={customAnimation}
  backgroundColor="theme.primary"
  padding={20}
>
  This view will have a custom animation
</View>
```

### Combining Animations

You can combine multiple animations by using the `Animation.compose` function:

```jsx
const combinedAnimation = Animation.compose(
  Animation.fadeIn(),
  Animation.slideInUp()
);

<View
  animate={combinedAnimation}
  backgroundColor="theme.primary"
  padding={20}
>
  This view will fade in and slide up simultaneously
</View>
```

### Animation Events

You can also listen to animation events using the `onAnimationStart`, `onAnimationEnd`, and `onAnimationIteration` props:

```jsx
<View
  animate={Animation.bounce()}
  onAnimationStart={() => console.log('Animation started')}
  onAnimationEnd={() => console.log('Animation ended')}
  backgroundColor="theme.primary"
  padding={20}
>
  This view will bounce
</View>
```

By leveraging these animation capabilities, you can create rich, interactive user interfaces with App-Studio.

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
          animate={Animation.fadeIn('1s', 'ease-out')}
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
          animate={Animation.pulse('infinite')}
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

This example demonstrates how to combine animations with other App-Studio features like theming, responsive design, and event handling.

## 10. Contributing

We welcome all contributions to App-Studio. Please read our [contributing guide](https://ant.design/docs/react/contributing) and let's build a better App-Studio together.

For more detailed information on contributing, including how to apply for being a collaborator, please refer to our [GitHub repository](https://github.com/rize-network/app-studio).

## 11. License

App-Studio is available under the MIT license. See the LICENSE file for more info.

---

For the latest updates, changelog, and more detailed information, please visit our [GitHub repository](https://github.com/rize-network/app-studio).
