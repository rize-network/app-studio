// animations.ts

export const fadeIn = ({
  duration = '1s',
  timingFunction = 'ease',
  ...props
}) => ({
  from: { opacity: 0 },
  to: { opacity: 1 },
  duration,
  timingFunction,
  ...props,
});

export const fadeOut = ({
  duration = '1s',
  timingFunction = 'ease',
  ...props
}) => ({
  from: { opacity: 1 },
  to: { opacity: 0 },
  duration,
  timingFunction,
  ...props,
});

export const slideInLeft = ({
  duration = '0.5s',
  timingFunction = 'ease-out',
  ...props
}) => ({
  from: { transform: 'translateX(-100%)' },
  to: { transform: 'translateX(0)' },
  duration,
  timingFunction,
  ...props,
});

export const slideInRight = ({
  duration = '0.5s',
  timingFunction = 'ease-out',
  ...props
}) => ({
  from: { transform: 'translateX(100%)' },
  to: { transform: 'translateX(0)' },
  duration,
  timingFunction,
  ...props,
});

export const slideInDown = ({
  duration = '0.5s',
  timingFunction = 'ease-out',
  ...props
}) => ({
  from: { transform: 'translateY(-100%)' },
  to: { transform: 'translateY(0)' },
  duration,
  timingFunction,
  ...props,
});

export const slideInUp = ({
  duration = '0.5s',
  timingFunction = 'ease-out',
  ...props
}) => ({
  from: { transform: 'translateY(100%)' },
  to: { transform: 'translateY(0)' },
  duration,
  timingFunction,
  ...props,
});

export const bounce = ({
  duration = '2s',
  timingFunction = 'ease',
  iterationCount = 'infinite',
  ...props
}) => ({
  from: { transform: 'translateY(0)' },
  '20%': { transform: 'translateY(-30px)' },
  '40%': { transform: 'translateY(0)' },
  '60%': { transform: 'translateY(-15px)' },
  '80%': { transform: 'translateY(0)' },
  to: { transform: 'translateY(0)' },
  duration,
  timingFunction,
  iterationCount,
  ...props,
});

export const rotate = ({
  duration = '1s',
  timingFunction = 'linear',
  iterationCount = 'infinite',
  ...props
}) => ({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
  duration,
  timingFunction,
  iterationCount,
  ...props,
});

export const pulse = ({
  duration = '1s',
  timingFunction = 'ease-in-out',
  iterationCount = 'infinite',
  ...props
}) => ({
  from: { transform: 'scale(1)' },
  '50%': { transform: 'scale(1.05)' },
  to: { transform: 'scale(1)' },
  duration,
  timingFunction,
  iterationCount,
  ...props,
});

export const zoomIn = ({
  duration = '0.5s',
  timingFunction = 'ease-out',
  ...props
}) => ({
  from: { transform: 'scale(0)' },
  to: { transform: 'scale(1)' },
  duration,
  timingFunction,
  ...props,
});

export const zoomOut = ({
  duration = '0.5s',
  timingFunction = 'ease-out',
  ...props
}) => ({
  from: { transform: 'scale(1)' },
  to: { transform: 'scale(0)' },
  duration,
  timingFunction,
  ...props,
});

export const flash = ({
  duration = '1s',
  iterationCount = 'infinite',
  ...props
}) => ({
  from: { opacity: 1 },
  '50%': { opacity: 0 },
  to: { opacity: 1 },
  duration,
  iterationCount,
  ...props,
});

export const shake = ({
  duration = '0.5s',
  iterationCount = 'infinite',
  ...props
}) => ({
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
  to: { transform: 'translateX(0)' },
  duration,
  iterationCount,
  ...props,
});

export const swing = ({
  duration = '1s',
  iterationCount = 'infinite',
  ...props
}) => ({
  from: { transform: 'rotate(0deg)' },
  '20%': { transform: 'rotate(15deg)' },
  '40%': { transform: 'rotate(-10deg)' },
  '60%': { transform: 'rotate(5deg)' },
  '80%': { transform: 'rotate(-5deg)' },
  to: { transform: 'rotate(0deg)' },
  duration,
  iterationCount,
  ...props,
});

export const rubberBand = ({
  duration = '1s',
  timingFunction = 'ease-in-out',
  ...props
}) => ({
  from: { transform: 'scale3d(1, 1, 1)' },
  '30%': { transform: 'scale3d(1.25, 0.75, 1)' },
  '40%': { transform: 'scale3d(0.75, 1.25, 1)' },
  '50%': { transform: 'scale3d(1.15, 0.85, 1)' },
  '65%': { transform: 'scale3d(0.95, 1.05, 1)' },
  '75%': { transform: 'scale3d(1.05, 0.95, 1)' },
  to: { transform: 'scale3d(1, 1, 1)' },
  duration,
  timingFunction,
  ...props,
});

export const wobble = ({ duration = '1s', ...props }) => ({
  from: { transform: 'translateX(0%)' },
  '15%': { transform: 'translateX(-25%) rotate(-5deg)' },
  '30%': { transform: 'translateX(20%) rotate(3deg)' },
  '45%': { transform: 'translateX(-15%) rotate(-3deg)' },
  '60%': { transform: 'translateX(10%) rotate(2deg)' },
  '75%': { transform: 'translateX(-5%) rotate(-1deg)' },
  to: { transform: 'translateX(0%)' },
  duration,
  ...props,
});

export const flip = ({ duration = '1s', ...props }) => ({
  from: {
    transform: 'perspective(400px) rotateY(0deg)',
  },
  '40%': {
    transform: 'perspective(400px) rotateY(-180deg)',
  },
  to: {
    transform: 'perspective(400px) rotateY(-360deg)',
  },
  duration,
  ...props,
});

export const heartBeat = ({
  duration = '1.3s',
  iterationCount = 'infinite',
  ...props
}) => ({
  from: { transform: 'scale(1)' },
  '14%': { transform: 'scale(1.3)' },
  '28%': { transform: 'scale(1)' },
  '42%': { transform: 'scale(1.3)' },
  '70%': { transform: 'scale(1)' },
  to: { transform: 'scale(1)' },
  duration,
  iterationCount,
  ...props,
});

export const rollIn = ({ duration = '1s', ...props }) => ({
  from: {
    opacity: 0,
    transform: 'translateX(-100%) rotate(-120deg)',
  },
  to: {
    opacity: 1,
    transform: 'translateX(0px) rotate(0deg)',
  },
  duration,
  ...props,
});

export const rollOut = ({ duration = '1s', ...props }) => ({
  from: {
    opacity: 1,
    transform: 'translateX(0px) rotate(0deg)',
  },
  to: {
    opacity: 0,
    transform: 'translateX(100%) rotate(120deg)',
  },
  duration,
  ...props,
});

export const lightSpeedIn = ({
  duration = '1s',
  timingFunction = 'ease-out',
  ...props
}) => ({
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
  to: {
    transform: 'translateX(0)',
    opacity: 1,
  },
  duration,
  timingFunction,
  ...props,
});

export const lightSpeedOut = ({
  duration = '1s',
  timingFunction = 'ease-in',
  ...props
}) => ({
  from: {
    opacity: 1,
  },
  '20%': {
    opacity: 1,
    transform: 'translateX(-20%) skewX(20deg)',
  },
  to: {
    opacity: 0,
    transform: 'translateX(-100%) skewX(30deg)',
  },
  duration,
  timingFunction,
  ...props,
});

export const hinge = ({
  duration = '2s',
  timingFunction = 'ease-in-out',
  ...props
}) => ({
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
  to: {
    transform: 'translateY(700px)',
    opacity: 0,
  },
  duration,
  timingFunction,
  ...props,
});

export const jackInTheBox = ({
  duration = '1s',
  timingFunction = 'ease',
  ...props
}) => ({
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
  to: {
    opacity: 1,
    transform: 'scale(1) rotate(0deg)',
  },
  duration,
  timingFunction,
  ...props,
});

export const flipInX = ({
  duration = '1s',
  timingFunction = 'ease-in',
  ...props
}) => ({
  from: {
    transform: 'perspective(400px) rotateX(90deg)',
    opacity: 0,
  },
  '40%': {
    transform: 'perspective(400px) rotateX(-10deg)',
    opacity: 1,
  },
  to: {
    transform: 'perspective(400px) rotateX(0deg)',
  },
  duration,
  timingFunction,
  ...props,
});

export const flipInY = ({
  duration = '1s',
  timingFunction = 'ease-in',
  ...props
}) => ({
  from: {
    transform: 'perspective(400px) rotateY(90deg)',
    opacity: 0,
  },
  '40%': {
    transform: 'perspective(400px) rotateY(-10deg)',
    opacity: 1,
  },
  to: {
    transform: 'perspective(400px) rotateY(0deg)',
  },
  duration,
  timingFunction,
  ...props,
});

export const headShake = ({
  duration = '1s',
  iterationCount = 'infinite',
  ...props
}) => ({
  from: {
    transform: 'translateX(0)',
  },
  '6.5%': {
    transform: 'translateX(-6px) rotateY(-9deg)',
  },
  '18.5%': {
    transform: 'translateX(5px) rotateY(7deg)',
  },
  '31.5%': {
    transform: 'translateX(-3px) rotateY(-5deg)',
  },
  '43.5%': {
    transform: 'translateX(2px) rotateY(3deg)',
  },
  '50%': {
    transform: 'translateX(0)',
  },
  duration,
  iterationCount,
  ...props,
});

export const tada = ({
  duration = '1s',
  iterationCount = 'infinite',
  ...props
}) => ({
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
  to: { transform: 'scale3d(1, 1, 1)', opacity: 1 },
  duration,
  iterationCount,
  ...props,
});

export const jello = ({
  duration = '1s',
  iterationCount = 'infinite',
  ...props
}) => ({
  from: { transform: 'none' },
  '11.1%': { transform: 'skewX(-12.5deg) skewY(-12.5deg)' },
  '22.2%': { transform: 'skewX(6.25deg) skewY(6.25deg)' },
  '33.3%': { transform: 'skewX(-3.125deg) skewY(-3.125deg)' },
  '44.4%': { transform: 'skewX(1.5625deg) skewY(1.5625deg)' },
  '55.5%': { transform: 'skewX(-0.78125deg) skewY(-0.78125deg)' },
  '66.6%': { transform: 'skewX(0.390625deg) skewY(0.390625deg)' },
  '77.7%': { transform: 'skewX(-0.1953125deg) skewY(-0.1953125deg)' },
  '88.8%': { transform: 'skewX(0.09765625deg) skewY(0.09765625deg)' },
  to: { transform: 'none' },
  duration,
  iterationCount,
  ...props,
});

export const fadeInDown = ({
  duration = '1s',
  timingFunction = 'ease-out',
  ...props
}) => ({
  from: {
    opacity: 0,
    transform: 'translateY(-100%)',
  },
  to: {
    opacity: 1,
    transform: 'translateY(0)',
  },
  duration,
  timingFunction,
  ...props,
});

export const fadeInUp = ({
  duration = '1s',
  timingFunction = 'ease-out',
  ...props
}) => ({
  from: {
    opacity: 0,
    transform: 'translateY(100%)',
  },
  to: {
    opacity: 1,
    transform: 'translateY(0)',
  },
  duration,
  timingFunction,
  ...props,
});

export const bounceIn = ({
  duration = '0.75s',
  timingFunction = 'ease-in',
  ...props
}) => ({
  from: {
    opacity: 0,
    transform: 'scale(0.3)',
  },
  '50%': {
    opacity: 1,
    transform: 'scale(1.05)',
  },
  '70%': {
    transform: 'scale(0.9)',
  },
  to: {
    transform: 'scale(1)',
  },
  duration,
  timingFunction,
  ...props,
});

export const bounceOut = ({
  duration = '0.75s',
  timingFunction = 'ease-out',
  ...props
}) => ({
  from: {
    transform: 'scale(1)',
  },
  '20%': {
    transform: 'scale(0.9)',
  },
  '50%, 55%': {
    opacity: 1,
    transform: 'scale(1.1)',
  },
  to: {
    opacity: 0,
    transform: 'scale(0.3)',
  },
  duration,
  timingFunction,
  ...props,
});

export const slideOutLeft = ({
  duration = '0.5s',
  timingFunction = 'ease-in',
  ...props
}) => ({
  from: {
    transform: 'translateX(0)',
  },
  to: {
    transform: 'translateX(-100%)',
  },
  duration,
  timingFunction,
  ...props,
});

export const slideOutRight = ({
  duration = '0.5s',
  timingFunction = 'ease-in',
  ...props
}) => ({
  from: {
    transform: 'translateX(0)',
  },
  to: {
    transform: 'translateX(100%)',
  },
  duration,
  timingFunction,
  ...props,
});

export const zoomInDown = ({
  duration = '1s',
  timingFunction = 'ease-out',
  ...props
}) => ({
  from: {
    opacity: 0,
    transform: 'scale(0.1) translateY(-1000px)',
  },
  '60%': {
    opacity: 1,
    transform: 'scale(0.475) translateY(60px)',
  },
  to: {
    transform: 'scale(1) translateY(0)',
  },
  duration,
  timingFunction,
  ...props,
});

export const zoomOutUp = ({
  duration = '1s',
  timingFunction = 'ease-in',
  ...props
}) => ({
  from: {
    opacity: 1,
    transform: 'scale(1) translateY(0)',
  },
  '40%': {
    opacity: 1,
    transform: 'scale(0.475) translateY(-60px)',
  },
  to: {
    opacity: 0,
    transform: 'scale(0.1) translateY(-1000px)',
  },
  duration,
  timingFunction,
  ...props,
});

export const backInDown = ({
  duration = '1s',
  timingFunction = 'ease-in',
  ...props
}) => ({
  from: {
    opacity: 0.7,
    transform: 'translateY(-2000px) scaleY(2.5) scaleX(0.2)',
  },
  to: {
    opacity: 1,
    transform: 'translateY(0) scaleY(1) scaleX(1)',
  },
  duration,
  timingFunction,
  ...props,
});

export const backOutUp = ({
  duration = '1s',
  timingFunction = 'ease-in',
  ...props
}) => ({
  from: {
    opacity: 1,
    transform: 'translateY(0)',
  },
  '80%': {
    opacity: 0.7,
    transform: 'translateY(-20px)',
  },
  to: {
    opacity: 0,
    transform: 'translateY(-2000px)',
  },
  duration,
  timingFunction,
  ...props,
});

export const shimmer = ({
  duration = '2s',
  timingFunction = 'linear',
  iterationCount = 'infinite',
  ...props
}) => ({
  from: { transform: 'translateX(-100%)' },
  '50%': { transform: 'translateX(100%)' },
  to: { transform: 'translateX(100%)' },
  duration,
  timingFunction,
  iterationCount,
  ...props,
});

export const progress = ({
  duration = '2s',
  timingFunction = 'linear',
  direction = 'forwards',
  prop = 'width',
  from = '0%',
  to = '100%',
  ...props
}) => ({
  from: { [prop]: from },
  to: { [prop]: to },
  duration,
  timingFunction,
  direction,
  ...props,
});

export const typewriter = ({
  duration = '10s',
  steps = 10,
  iterationCount = 1,
  width = 0,
  ...props
}) => ({
  from: { width: '0px' },
  to: { width: `${width}px` },
  timingFunction: `steps(${steps})`,
  duration,
  iterationCount,
  ...props,
});

export const blinkCursor = ({
  duration = '0.75s',
  timingFunction = 'step-end',
  iterationCount = 'infinite',
  color = 'black',
  ...props
}) => ({
  from: { color: color },
  to: { color: color },
  '0%': { color: color },
  '50%': { color: 'transparent' },
  '100%': { color: color },
  duration,
  timingFunction,
  iterationCount,
  ...props,
});
