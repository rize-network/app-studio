# Animation

## Table of Contents

- [Animation](#animation)
  - [Table of Contents](#table-of-contents)
  - [1. Introduction](#1-introduction)
  - [2. Usage](#2-usage)
  - [3. Available Animations](#3-available-animations)
    - [Fade Animations](#fade-animations)
      - [fadeIn](#fadein)
      - [fadeOut](#fadeout)
    - [Slide Animations](#slide-animations)
      - [slideInLeft](#slideinleft)
      - [slideInRight](#slideinright)
      - [slideInDown](#slideindown)
      - [slideInUp](#slideinup)
      - [slideOutLeft](#slideoutleft)
      - [slideOutRight](#slideoutright)
    - [Bounce Animations](#bounce-animations)
      - [bounce](#bounce)
      - [bounceIn](#bouncein)
      - [bounceOut](#bounceout)
    - [Rotate Animations](#rotate-animations)
      - [rotate](#rotate)
      - [flip](#flip)
      - [flipInX](#flipinx)
      - [flipInY](#flipiny)
    - [Scale Animations](#scale-animations)
      - [pulse](#pulse)
      - [zoomIn](#zoomin)
      - [zoomOut](#zoomout)
      - [zoomInDown](#zoomindown)
      - [zoomOutUp](#zoomoutup)
    - [Special Animations](#special-animations)
      - [shake](#shake)
      - [swing](#swing)
      - [rubberBand](#rubberband)
      - [wobble](#wobble)
      - [heartBeat](#heartbeat)
      - [rollIn](#rollin)
      - [rollOut](#rollout)
      - [lightSpeedIn](#lightspeedin)
      - [lightSpeedOut](#lightspeedout)
      - [hinge](#hinge)
      - [jackInTheBox](#jackinthebox)
      - [headShake](#headshake)
      - [tada](#tada)
      - [jello](#jello)
    - [heartBeat](#heartbeat-1)
    - [Other Animations](#other-animations)
      - [swing](#swing-1)
      - [rubberBand](#rubberband-1)
      - [wobble](#wobble-1)
    - [heartBeat](#heartbeat-2)
    - [rollIn](#rollin-1)
    - [rollOut](#rollout-1)
    - [lightSpeedIn](#lightspeedin-1)
    - [lightSpeedOut](#lightspeedout-1)
    - [hinge](#hinge-1)
    - [jackInTheBox](#jackinthebox-1)
    - [headShake](#headshake-1)
    - [tada](#tada-1)
    - [jello](#jello-1)
    - [backInDown](#backindown)
    - [backOutUp](#backoutup)
  - [4. Creating Custom Animations](#4-creating-custom-animations)
  - [5. Best Practices](#5-best-practices)
  - [6. Conclusion](#6-conclusion)

---

## 1. Introduction

The Animation file is a collection of predefined animation functions designed to simplify the process of adding dynamic and engaging animations to your components using the **App-Studio** library. Each animation function returns an object that defines keyframes and animation properties, allowing for easy customization and reuse across your application.

## 2. Usage

To utilize the animations defined in Animation, follow these steps:

1. **Import the Desired Animation:**

   ```typescript
   import { fadeIn, shake } from './animations';
   ```

2. **Apply the Animation to a Component:**

   ```jsx
   <Element animate={fadeIn('1s', 'ease-in')} />
   <Element animate={shake('0.5s', 'infinite')} />
   ```

   - **Parameters:**
     - `duration` (string): Specifies how long the animation should take to complete one cycle (e.g., `'1s'`, `'500ms'`).
     - `timingFunction` (string): Defines the speed curve of the animation (e.g., `'ease'`, `'linear'`, `'ease-in-out'`).
     - `iterationCount` (string): Determines how many times the animation should repeat (e.g., `'infinite'`, `'1'`, `'3'`).

## 3. Available Animations

### Fade Animations

#### fadeIn

**Description:**  
Gradually changes the opacity of an element from invisible to fully visible, creating a fading-in effect.

**Parameters:**

- `duration` (default: `'1s'`): Duration of the animation.
- `timingFunction` (default: `'ease'`): Timing function of the animation.

**Keyframes:**

```javascript
{
  from: { opacity: 0 },
  enter: { opacity: 1 },
  duration,
  timingFunction,
}
```

**Usage Example:**

```jsx
<Element animate={fadeIn('2s', 'ease-in')} />
```

---

#### fadeOut

**Description:**  
Gradually changes the opacity of an element from fully visible to invisible, creating a fading-out effect.

**Parameters:**

- `duration` (default: `'1s'`): Duration of the animation.
- `timingFunction` (default: `'ease'`): Timing function of the animation.

**Keyframes:**

```javascript
{
  from: { opacity: 1 },
  enter: { opacity: 0 },
  duration,
  timingFunction,
}
```

**Usage Example:**

```jsx
<Element animate={fadeOut('1.5s', 'ease-out')} />
```

---

### Slide Animations

#### slideInLeft

**Description:**  
Slides the element in from the left side of the viewport to its original position.

**Parameters:**

- `duration` (default: `'0.5s'`): Duration of the animation.
- `timingFunction` (default: `'ease-out'`): Timing function of the animation.

**Keyframes:**

```javascript
{
  from: { transform: 'translateX(-100%)' },
  enter: { transform: 'translateX(0)' },
  duration,
  timingFunction,
}
```

**Usage Example:**

```jsx
<Element animate={slideInLeft('0.7s', 'ease-in')} />
```

---

#### slideInRight

**Description:**  
Slides the element in from the right side of the viewport to its original position.

**Parameters:**

- `duration` (default: `'0.5s'`): Duration of the animation.
- `timingFunction` (default: `'ease-out'`): Timing function of the animation.

**Keyframes:**

```javascript
{
  from: { transform: 'translateX(100%)' },
  enter: { transform: 'translateX(0)' },
  duration,
  timingFunction,
}
```

**Usage Example:**

```jsx
<Element animate={slideInRight()} />
```

---

#### slideInDown

**Description:**  
Slides the element in from the top of the viewport to its original position.

**Parameters:**

- `duration` (default: `'0.5s'`): Duration of the animation.
- `timingFunction` (default: `'ease-out'`): Timing function of the animation.

**Keyframes:**

```javascript
{
  from: { transform: 'translateY(-100%)' },
  enter: { transform: 'translateY(0)' },
  duration,
  timingFunction,
}
```

**Usage Example:**

```jsx
<Element animate={slideInDown('0.6s')} />
```

---

#### slideInUp

**Description:**  
Slides the element in from the bottom of the viewport to its original position.

**Parameters:**

- `duration` (default: `'0.5s'`): Duration of the animation.
- `timingFunction` (default: `'ease-out'`): Timing function of the animation.

**Keyframes:**

```javascript
{
  from: { transform: 'translateY(100%)' },
  enter: { transform: 'translateY(0)' },
  duration,
  timingFunction,
}
```

**Usage Example:**

```jsx
<Element animate={slideInUp()} />
```

---

#### slideOutLeft

**Description:**  
Slides the element out to the left side of the viewport from its current position.

**Parameters:**

- `duration` (default: `'0.5s'`): Duration of the animation.
- `timingFunction` (default: `'ease-in'`): Timing function of the animation.

**Keyframes:**

```javascript
{
  from: { transform: 'translateX(0)' },
  enter: { transform: 'translateX(-100%)' },
  duration,
  timingFunction,
}
```

**Usage Example:**

```jsx
<Element animate={slideOutLeft('0.8s', 'linear')} />
```

---

#### slideOutRight

**Description:**  
Slides the element out to the right side of the viewport from its current position.

**Parameters:**

- `duration` (default: `'0.5s'`): Duration of the animation.
- `timingFunction` (default: `'ease-in'`): Timing function of the animation.

**Keyframes:**

```javascript
{
  from: { transform: 'translateX(0)' },
  enter: { transform: 'translateX(100%)' },
  duration,
  timingFunction,
}
```

**Usage Example:**

```jsx
<Element animate={slideOutRight('0.6s')} />
```

---

### Bounce Animations

#### bounce

**Description:**  
Creates a bouncing effect by moving the element vertically up and down.

**Parameters:**

- `duration` (default: `'2s'`): Duration of each animation cycle.
- `timingFunction` (default: `'ease'`): Timing function of the animation.
- `iterationCount` (default: `'infinite'`): Number of times the animation repeats.

**Keyframes:**

```javascript
{
  from: { transform: 'translateY(0)' },
  '20%': { transform: 'translateY(-30px)' },
  '40%': { transform: 'translateY(0)' },
  '60%': { transform: 'translateY(-15px)' },
  '80%': { transform: 'translateY(0)' },
  enter: { transform: 'translateY(0)' },
  duration,
  timingFunction,
  iterationCount,
}
```

**Usage Example:**

```jsx
<Element animate={bounce('1.5s', 'ease-in-out', 'infinite')} />
```

---

#### bounceIn

**Description:**  
Animates the element by scaling it from a smaller size to its original size with a bounce effect.

**Parameters:**

- `duration` (default: `'0.75s'`): Duration of the animation.
- `timingFunction` (default: `'ease-in'`): Timing function of the animation.

**Keyframes:**

```javascript
{
  from: { opacity: 0, transform: 'scale(0.3)' },
  '50%': { opacity: 1, transform: 'scale(1.05)' },
  '70%': { transform: 'scale(0.9)' },
  enter: { transform: 'scale(1)' },
  duration,
  timingFunction,
}
```

**Usage Example:**

```jsx
<Element animate={bounceIn()} />
```

---

#### bounceOut

**Description:**  
Animates the element by scaling it down with a bounce effect before it disappears.

**Parameters:**

- `duration` (default: `'0.75s'`): Duration of the animation.
- `timingFunction` (default: `'ease-out'`): Timing function of the animation.

**Keyframes:**

```javascript
{
  from: { transform: 'scale(1)' },
  '20%': { transform: 'scale(0.9)' },
  '50%, 55%': { opacity: 1, transform: 'scale(1.1)' },
  enter: { opacity: 0, transform: 'scale(0.3)' },
  duration,
  timingFunction,
}
```

**Usage Example:**

```jsx
<Element animate={bounceOut()} />
```

---

### Rotate Animations

#### rotate

**Description:**  
Rotates the element 360 degrees continuously.

**Parameters:**

- `duration` (default: `'1s'`): Duration of one full rotation.
- `timingFunction` (default: `'linear'`): Timing function of the animation.
- `iterationCount` (default: `'infinite'`): Number of times the animation repeats.

**Keyframes:**

```javascript
{
  from: { transform: 'rotate(0deg)' },
  enter: { transform: 'rotate(360deg)' },
  duration,
  timingFunction,
  iterationCount,
}
```

**Usage Example:**

```jsx
<Element animate={rotate('2s', 'linear', 'infinite')} />
```

---

#### flip

**Description:**  
Performs a 360-degree flip animation along the Y-axis.

**Parameters:**

- `duration` (default: `'1s'`): Duration of the animation.
- `timingFunction` (default: `'ease-in'`): Timing function of the animation.

**Keyframes:**

```javascript
{
  from: {
    transform: 'perspective(400px) rotateY(0deg)',
  },
  '40%': {
    transform: 'perspective(400px) rotateY(-180deg)',
  },
  enter: {
    transform: 'perspective(400px) rotateY(-360deg)',
  },
  duration,
  timingFunction,
}
```

**Usage Example:**

```jsx
<Element animate={flip('1.5s', 'ease-in')} />
```

---

#### flipInX

**Description:**  
Flips the element in along the X-axis from 90 degrees to 0 degrees.

**Parameters:**

- `duration` (default: `'1s'`): Duration of the animation.
- `timingFunction` (default: `'ease-in'`): Timing function of the animation.

**Keyframes:**

```javascript
{
  from: {
    transform: 'perspective(400px) rotateX(90deg)',
    opacity: 0,
  },
  '40%': {
    transform: 'perspective(400px) rotateX(-10deg)',
    opacity: 1,
  },
  enter: {
    transform: 'perspective(400px) rotateX(0deg)',
  },
  duration,
  timingFunction,
}
```

**Usage Example:**

```jsx
<Element animate={flipInX()} />
```

---

#### flipInY

**Description:**  
Flips the element in along the Y-axis from 90 degrees to 0 degrees.

**Parameters:**

- `duration` (default: `'1s'`): Duration of the animation.
- `timingFunction` (default: `'ease-in'`): Timing function of the animation.

**Keyframes:**

```javascript
{
  from: {
    transform: 'perspective(400px) rotateY(90deg)',
    opacity: 0,
  },
  '40%': {
    transform: 'perspective(400px) rotateY(-10deg)',
    opacity: 1,
  },
  enter: {
    transform: 'perspective(400px) rotateY(0deg)',
  },
  duration,
  timingFunction,
}
```

**Usage Example:**

```jsx
<Element animate={flipInY()} />
```

---

### Scale Animations

#### pulse

**Description:**  
Creates a pulsing effect by scaling the element up and down.

**Parameters:**

- `duration` (default: `'1s'`): Duration of the animation cycle.
- `timingFunction` (default: `'ease-in-out'`): Timing function of the animation.
- `iterationCount` (default: `'infinite'`): Number of times the animation repeats.

**Keyframes:**

```javascript
{
  from: { transform: 'scale(1)' },
  '50%': { transform: 'scale(1.05)' },
  enter: { transform: 'scale(1)' },
  duration,
  timingFunction,
  iterationCount,
}
```

**Usage Example:**

```jsx
<Element animate={pulse()} />
```

---

#### zoomIn

**Description:**  
Scales the element from 0 to its original size, creating a zoom-in effect.

**Parameters:**

- `duration` (default: `'0.5s'`): Duration of the animation.
- `timingFunction` (default: `'ease-out'`): Timing function of the animation.

**Keyframes:**

```javascript
{
  from: { transform: 'scale(0)' },
  enter: { transform: 'scale(1)' },
  duration,
  timingFunction,
}
```

**Usage Example:**

```jsx
<Element animate={zoomIn()} />
```

---

#### zoomOut

**Description:**  
Scales the element from its original size to 0, creating a zoom-out effect.

**Parameters:**

- `duration` (default: `'0.5s'`): Duration of the animation.
- `timingFunction` (default: `'ease-out'`): Timing function of the animation.

**Keyframes:**

```javascript
{
  from: { transform: 'scale(1)' },
  enter: { transform: 'scale(0)' },
  duration,
  timingFunction,
}
```

**Usage Example:**

```jsx
<Element animate={zoomOut()} />
```

---

#### zoomInDown

**Description:**  
Combines a zoom-in and slide-down effect, making the element appear from above with scaling.

**Parameters:**

- `duration` (default: `'1s'`): Duration of the animation.
- `timingFunction` (default: `'ease-out'`): Timing function of the animation.

**Keyframes:**

```javascript
{
  from: {
    opacity: 0,
    transform: 'scale(0.1) translateY(-1000px)',
  },
  '60%': {
    opacity: 1,
    transform: 'scale(0.475) translateY(60px)',
  },
  enter: {
    transform: 'scale(1) translateY(0)',
  },
  duration,
  timingFunction,
}
```

**Usage Example:**

```jsx
<Element animate={zoomInDown()} />
```

---

#### zoomOutUp

**Description:**  
Combines a zoom-out and slide-up effect, making the element disappear upwards with scaling.

**Parameters:**

- `duration` (default: `'1s'`): Duration of the animation.
- `timingFunction` (default: `'ease-in'`): Timing function of the animation.

**Keyframes:**

```javascript
{
  from: {
    opacity: 1,
    transform: 'scale(1) translateY(0)',
  },
  '40%': {
    opacity: 1,
    transform: 'scale(0.475) translateY(-60px)',
  },
  enter: {
    opacity: 0,
    transform: 'scale(0.1) translateY(-1000px)',
  },
  duration,
  timingFunction,
}
```

**Usage Example:**

```jsx
<Element animate={zoomOutUp()} />
```

---

### Special Animations

#### shake

**Description:**  
Shakes the element horizontally, useful for indicating errors or drawing attention.

**Parameters:**

- `duration` (default: `'0.5s'`): Duration of the animation cycle.
- `iterationCount` (default: `'infinite'`): Number of times the animation repeats.

**Keyframes:**

```javascript
{
  from: { transform: 'translateX(0)' },
  '10%': { transform: 'translateX(-10px)' },
  '20%': { transform: 'translateX(10px)' },
  '30%': { transform: 'translateX(-10px)' },
  '40%': { transform: 'translateX(10px)' },
  '50%': { transform: 'translateX(-10px)' },
  '60%': { transform: 'translateX(10px)' },
  '70%': { transform: 'translateX(-10px)' },
  '80%': { transform: 'translateX(10px)' },
  '90%': { transform: 'translateX(-10px)' },
  enter: { transform: 'translateX(0)' },
  duration,
  iterationCount,
}
```

**Usage Example:**

```jsx
<Element animate={shake('0.7s', 'infinite')} />
```

---

#### swing

**Description:**  
Swings the element back and forth, simulating a pendulum-like motion.

**Parameters:**

- `duration` (default: `'1s'`): Duration of the animation cycle.
- `iterationCount` (default: `'infinite'`): Number of times the animation repeats.

**Keyframes:**

```javascript
{
  from: { transform: 'rotate(0deg)' },
  '20%': { transform: 'rotate(15deg)' },
  '40%': { transform: 'rotate(-10deg)' },
  '60%': { transform: 'rotate(5deg)' },
  '80%': { transform: 'rotate(-5deg)' },
  enter: { transform: 'rotate(0deg)' },
  duration,
  iterationCount,
}
```

**Usage Example:**

```jsx
<Element animate={swing()} />
```

---

#### rubberBand

**Description:**  
Stretches and compresses the element along the X and Y axes, creating a rubber-like stretching effect.

**Parameters:**

- `duration` (default: `'1s'`): Duration of the animation cycle.
- `timingFunction` (default: `'ease-in-out'`): Timing function of the animation.

**Keyframes:**

```javascript
{
  from: { transform: 'scale3d(1, 1, 1)' },
  '30%': { transform: 'scale3d(1.25, 0.75, 1)' },
  '40%': { transform: 'scale3d(0.75, 1.25, 1)' },
  '50%': { transform: 'scale3d(1.15, 0.85, 1)' },
  '65%': { transform: 'scale3d(0.95, 1.05, 1)' },
  '75%': { transform: 'scale3d(1.05, 0.95, 1)' },
  enter: { transform: 'scale3d(1, 1, 1)' },
  duration,
  timingFunction,
}
```

**Usage Example:**

```jsx
<Element animate={rubberBand()} />
```

---

#### wobble

**Description:**  
Wobbles the element side to side and rotates slightly, giving a playful effect.

**Parameters:**

- `duration` (default: `'1s'`): Duration of the animation cycle.

**Keyframes:**

```javascript
{
  from: { transform: 'translateX(0%)' },
  '15%': { transform: 'translateX(-25%) rotate(-5deg)' },
  '30%': { transform: 'translateX(20%) rotate(3deg)' },
  '45%': { transform: 'translateX(-15%) rotate(-3deg)' },
  '60%': { transform: 'translateX(10%) rotate(2deg)' },
  '75%': { transform: 'translateX(-5%) rotate(-1deg)' },
  enter: { transform: 'translateX(0%)' },
  duration,
}
```

**Usage Example:**

```jsx
<Element animate={wobble('1.2s')} />
```

---

#### heartBeat

**Description:**  
Simulates a heartbeat by scaling the element up and down rhythmically.

**Parameters:**

- `duration` (default: `'1.3s'`): Duration of the animation cycle.
- `iterationCount` (default: `'infinite'`): Number of times the animation repeats.

**Keyframes:**

```javascript
{
  from: { transform: 'scale(1)' },
  '14%': { transform: 'scale(1.3)' },
  '28%': { transform: 'scale(1)' },
  '42%': { transform: 'scale(1.3)' },
  '70%': { transform: 'scale(1)' },
  enter: { transform: 'scale(1)' },
  duration,
  iterationCount,
}
```

**Usage Example:**

```jsx
<Element animate={heartBeat('1.5s', 'infinite')} />
```

---

#### rollIn

**Description:**  
Rolls the element into view from the left with rotation.

**Parameters:**

- `duration` (default: `'1s'`): Duration of the animation.

**Keyframes:**

```javascript
{
  from: {
    opacity: 0,
    transform: 'translateX(-100%) rotate(-120deg)',
  },
  enter: {
    opacity: 1,
    transform: 'translateX(0px) rotate(0deg)',
  },
  duration,
}
```

**Usage Example:**

```jsx
<Element animate={rollIn()} />
```

---

#### rollOut

**Description:**  
Rolls the element out of view to the right with rotation.

**Parameters:**

- `duration` (default: `'1s'`): Duration of the animation.

**Keyframes:**

```javascript
{
  from: {
    opacity: 1,
    transform: 'translateX(0px) rotate(0deg)',
  },
  enter: {
    opacity: 0,
    transform: 'translateX(100%) rotate(120deg)',
  },
  duration,
}
```

**Usage Example:**

```jsx
<Element animate={rollOut()} />
```

---

#### lightSpeedIn

**Description:**  
Animates the element with a fast sliding and skewing effect from the right, giving a light speed entrance.

**Parameters:**

- `duration` (default: `'1s'`): Duration of the animation.
- `timingFunction` (default: `'ease-out'`): Timing function of the animation.

**Keyframes:**

```javascript
{
  from: {
    transform: 'translateX(100%) skewX(-30deg)',
    opacity: 0,
  },
  '60%': {
    transform: 'skewX(20deg)',
    opacity: 1,
  },
  '80%': {
    transform: 'skewX(-5deg)',
  },
  enter: {
    transform: 'translateX(0)',
    opacity: 1,
  },
  duration,
  timingFunction,
}
```

**Usage Example:**

```jsx
<Element animate={lightSpeedIn()} />
```

---

#### lightSpeedOut

**Description:**  
Animates the element with a fast sliding and skewing effect to the left, giving a light speed exit.

**Parameters:**

- `duration` (default: `'1s'`): Duration of the animation.
- `timingFunction` (default: `'ease-in'`): Timing function of the animation.

**Keyframes:**

```javascript
{
  from: {
    opacity: 1,
  },
  '20%': {
    opacity: 1,
    transform: 'translateX(-20%) skewX(20deg)',
  },
  enter: {
    opacity: 0,
    transform: 'translateX(-100%) skewX(30deg)',
  },
  duration,
  timingFunction,
}
```

**Usage Example:**

```jsx
<Element animate={lightSpeedOut()} />
```

---

#### hinge

**Description:**  
Simulates the element being attached to a hinge and swinging before falling off the screen.

**Parameters:**

- `duration` (default: `'2s'`): Duration of the animation.
- `timingFunction` (default: `'ease-in-out'`): Timing function of the animation.

**Keyframes:**

```javascript
{
  from: {
    transform: 'rotate(0deg)',
    transformOrigin: 'top left',
    opacity: 1,
  },
  '20%': {
    transform: 'rotate(80deg)',
    opacity: 1,
  },
  '40%': {
    transform: 'rotate(60deg)',
    opacity: 1,
  },
  '60%': {
    transform: 'rotate(80deg)',
    opacity: 1,
  },
  '80%': {
    transform: 'rotate(60deg)',
    opacity: 1,
  },
  enter: {
    transform: 'translateY(700px)',
    opacity: 0,
  },
  duration,
  timingFunction,
}
```

**Usage Example:**

```jsx
<Element animate={hinge()} />
```

---

#### jackInTheBox

**Description:**  
Simulates an element popping out of a box with scaling and rotation effects.

**Parameters:**

- `duration` (default: `'1s'`): Duration of the animation.
- `timingFunction` (default: `'ease'`): Timing function of the animation.

**Keyframes:**

```javascript
{
  from: {
    opacity: 0,
    transform: 'scale(0.1) rotate(30deg)',
    transformOrigin: 'center bottom',
  },
  '50%': {
    transform: 'rotate(-10deg)',
  },
  '70%': {
    transform: 'rotate(3deg)',
  },
  enter: {
    opacity: 1,
    transform: 'scale(1) rotate(0deg)',
  },
  duration,
  timingFunction,
}
```

**Usage Example:**

```jsx
<Element animate={jackInTheBox()} />
```

---

#### headShake

**Description:**  
Shakes the element horizontally with slight rotations, mimicking a head-shaking motion.

**Parameters:**

- `duration` (default: `'1s'`): Duration of the animation cycle.
- `iterationCount` (default: `'infinite'`): Number of times the animation repeats.

**Keyframes:**

```javascript
{
  from: { transform: 'translateX(0)' },
  '6.5%': { transform: 'translateX(-6px) rotateY(-9deg)' },
  '18.5%': { transform: 'translateX(5px) rotateY(7deg)' },
  '31.5%': { transform: 'translateX(-3px) rotateY(-5deg)' },
  '43.5%': { transform: 'translateX(2px) rotateY(3deg)' },
  '50%': { transform: 'translateX(0)' },
  duration,
  iterationCount,
}
```

**Usage Example:**

```jsx
<Element animate={headShake('1s', 'infinite')} />
```

---

#### tada

**Description:**  
Applies a playful scaling and rotation effect to emphasize an element, often used to draw attention.

**Parameters:**

- `duration` (default: `'1s'`): Duration of the animation cycle.
- `iterationCount` (default: `'infinite'`): Number of times the animation repeats.

**Keyframes:**

```javascript
{
  from: { transform: 'scale3d(1, 1, 1)', opacity: 1 },
  '10%, 20%': {
    transform: 'scale3d(0.9, 0.9, 0.9) rotate(-3deg)',
  },
  '30%, 50%, 70%, 90%': {
    transform: 'scale3d(1.1, 1.1, 1.1) rotate(3deg)',
  },
  '40%, 60%, 80%': {
    transform: 'scale3d(1.1, 1.1, 1.1) rotate(-3deg)',
  },
  enter: { transform: 'scale3d(1, 1, 1)', opacity: 1 },
  duration,
  iterationCount,
}
```

**Usage Example:**

```jsx
<Element animate={tada('1.2s', 'infinite')} />
```

---

#### jello

**Description:**  
Creates a wobbly and squishy effect, making the element appear as if it's made of jelly.

**Parameters:**

- `duration` (default: `'1s'`): Duration of the animation cycle.
- `iterationCount` (default: `'infinite'`): Number of times the animation repeats.

**Keyframes:**

```javascript
{
  from: { transform: 'none' },
  '11.1%': { transform: 'skewX(-12.5deg) skewY(-12.5deg)' },
  '22.2%': { transform: 'skewX(6.25deg) skewY(6.25deg)' },
  '33.3%': { transform: 'skewX(-3.125deg) skewY(-3.125deg)' },
  '44.4%': { transform: 'skewX(1.5625deg) skewY(1.5625deg)' },
  '55.5%': { transform: 'skewX(-0.78125deg) skewY(-0.78125deg)' },
  '66.6%': { transform: 'skewX(0.390625deg) skewY(0.390625deg)' },
  '77.7%': { transform: 'skewX(-0.1953125deg) skewY(-0.1953125deg)' },
  '88.8%': { transform: 'skewX(0.09765625deg) skewY(0.09765625deg)' },
  enter: { transform: 'none' },
  duration,
  iterationCount,
}
```

**Usage Example:**

```jsx
<Element animate={jello('1s', 'infinite')} />
```

---

### heartBeat

**Description:**  
Simulates the rhythm of a heartbeat by scaling the element up and down in a rhythmic pattern.

**Parameters:**

- `duration` (default: `'1.3s'`): Duration of the animation cycle.
- `iterationCount` (default: `'infinite'`): Number of times the animation repeats.

**Keyframes:**

```javascript
{
  from: { transform: 'scale(1)' },
  '14%': { transform: 'scale(1.3)' },
  '28%': { transform: 'scale(1)' },
  '42%': { transform: 'scale(1.3)' },
  '70%': { transform: 'scale(1)' },
  enter: { transform: 'scale(1)' },
  duration,
  iterationCount,
}
```

**Usage Example:**

```jsx
<Element animate={heartBeat()} />
```

---

### Other Animations

#### swing

**Description:**  
Swings the element back and forth with rotation, creating a playful motion.

**Parameters:**

- `duration` (default: `'1s'`): Duration of the animation cycle.
- `iterationCount` (default: `'infinite'`): Number of times the animation repeats.

**Keyframes:**

```javascript
{
  from: { transform: 'rotate(0deg)' },
  '20%': { transform: 'rotate(15deg)' },
  '40%': { transform: 'rotate(-10deg)' },
  '60%': { transform: 'rotate(5deg)' },
  '80%': { transform: 'rotate(-5deg)' },
  enter: { transform: 'rotate(0deg)' },
  duration,
  iterationCount,
}
```

**Usage Example:**

```jsx
<Element animate={swing()} />
```

---

#### rubberBand

**Description:**  
Applies a stretching and compressing effect to the element, mimicking the elasticity of rubber.

**Parameters:**

- `duration` (default: `'1s'`): Duration of the animation cycle.
- `timingFunction` (default: `'ease-in-out'`): Timing function of the animation.

**Keyframes:**

```javascript
{
  from: { transform: 'scale3d(1, 1, 1)' },
  '30%': { transform: 'scale3d(1.25, 0.75, 1)' },
  '40%': { transform: 'scale3d(0.75, 1.25, 1)' },
  '50%': { transform: 'scale3d(1.15, 0.85, 1)' },
  '65%': { transform: 'scale3d(0.95, 1.05, 1)' },
  '75%': { transform: 'scale3d(1.05, 0.95, 1)' },
  enter: { transform: 'scale3d(1, 1, 1)' },
  duration,
  timingFunction,
}
```

**Usage Example:**

```jsx
<Element animate={rubberBand()} />
```

---

#### wobble

**Description:**  
Creates a wobbly effect by translating and rotating the element in a rhythmic pattern.

**Parameters:**

- `duration` (default: `'1s'`): Duration of the animation.

**Keyframes:**

```javascript
{
  from: { transform: 'translateX(0%)' },
  '15%': { transform: 'translateX(-25%) rotate(-5deg)' },
  '30%': { transform: 'translateX(20%) rotate(3deg)' },
  '45%': { transform: 'translateX(-15%) rotate(-3deg)' },
  '60%': { transform: 'translateX(10%) rotate(2deg)' },
  '75%': { transform: 'translateX(-5%) rotate(-1deg)' },
  enter: { transform: 'translateX(0%)' },
  duration,
}
```

**Usage Example:**

```jsx
<Element animate={wobble('1.2s')} />
```

---

### heartBeat

Already documented above.

---

### rollIn

Already documented above.

---

### rollOut

Already documented above.

---

### lightSpeedIn

Already documented above.

---

### lightSpeedOut

Already documented above.

---

### hinge

Already documented above.

---

### jackInTheBox

Already documented above.

---

### headShake

Already documented above.

---

### tada

Already documented above.

---

### jello

Already documented above.

---

### backInDown

**Description:**  
Animates the element with a zoom and slide-down effect from the top, creating a dynamic entrance.

**Parameters:**

- `duration` (default: `'1s'`): Duration of the animation.
- `timingFunction` (default: `'ease-in'`): Timing function of the animation.

**Keyframes:**

```javascript
{
  from: {
    opacity: 0.7,
    transform: 'translateY(-2000px) scaleY(2.5) scaleX(0.2)',
  },
  enter: {
    opacity: 1,
    transform: 'translateY(0) scaleY(1) scaleX(1)',
  },
  duration,
  timingFunction,
}
```

**Usage Example:**

```jsx
<Element animate={backInDown()} />
```

---

### backOutUp

**Description:**  
Animates the element with a zoom and slide-up effect, making it disappear upwards.

**Parameters:**

- `duration` (default: `'1s'`): Duration of the animation.
- `timingFunction` (default: `'ease-in'`): Timing function of the animation.

**Keyframes:**

```javascript
{
  from: {
    opacity: 1,
    transform: 'translateY(0)',
  },
  '80%': {
    opacity: 0.7,
    transform: 'translateY(-20px)',
  },
  enter: {
    opacity: 0,
    transform: 'translateY(-2000px)',
  },
  duration,
  timingFunction,
}
```

**Usage Example:**

```jsx
<Element animate={backOutUp()} />
```

---

## 4. Creating Custom Animations

In addition to the predefined animations, you can create custom animations by defining your own keyframes and animation properties.

**Steps to Create a Custom Animation:**

1. **Define Keyframes:**

   Create a new function in Animation that returns an object with keyframes and animation properties.

   ```typescript
   // animations.ts

   export const customFadeSlide = (
     duration = '1s',
     timingFunction = 'ease-in-out',
     iterationCount = 'infinite'
   ) => ({
     from: { opacity: 0, transform: 'translateY(-20px)' },
     '50%': { opacity: 1, transform: 'translateY(0)' },
     enter: { opacity: 0, transform: 'translateY(20px)' },
     duration,
     timingFunction,
     iterationCount,
   });
   ```

2. **Use the Custom Animation:**

   Apply the custom animation to a component using the `animate` prop.

   ```jsx
   <Element animate={customFadeSlide('2s', 'linear', 'infinite')} />
   ```

---

## 5. Best Practices

- **Consistency:** Use predefined animations to maintain consistency across your application. Create custom animations only when necessary.
- **Performance:** Be cautious with animations that run infinitely (`'infinite'`), as they can impact performance, especially on mobile devices.
- **Accessibility:** Ensure that animations do not hinder accessibility. Provide alternatives or options to disable animations for users who prefer reduced motion.
- **Theming:** Utilize theme-based colors and properties to ensure animations align with your application's overall design.
- **Reusability:** Leverage animation functions to promote reusability and reduce redundancy in your codebase.

---

## 6. Conclusion

The Animation file serves as a centralized repository for all animation effects used within your **App-Studio** library. By providing a variety of predefined animations and the ability to create custom ones, you can enhance the interactivity and visual appeal of your components seamlessly. Adhering to best practices ensures that animations contribute positively to the user experience without compromising performance or accessibility.

Feel free to expand the Animation with additional animations tailored to your project's needs. If you encounter any challenges or require further assistance, don't hesitate to seek help.

---

*For further assistance or to contribute to the Animation file, please refer to the [App-Studio Documentation](#app-studio-documentation) or visit our [GitHub repository](https://github.com/rize-network/app-studio).*