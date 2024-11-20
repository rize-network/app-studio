// animations.ts

export const fadeIn = ({ duration = '1s', timingFunction = 'ease' }) => ({
  from: { opacity: 0 },
  to: { opacity: 1 },
  duration,
  timingFunction,
});

export const fadeOut = ({ duration = '1s', timingFunction = 'ease' }) => ({
  from: { opacity: 1 },
  to: { opacity: 0 },
  duration,
  timingFunction,
});

export const slideInLeft = ({
  duration = '0.5s',
  timingFunction = 'ease-out',
}) => ({
  from: { transform: 'translateX(-100%)' },
  to: { transform: 'translateX(0)' },
  duration,
  timingFunction,
});

export const slideInRight = ({
  duration = '0.5s',
  timingFunction = 'ease-out',
}) => ({
  from: { transform: 'translateX(100%)' },
  to: { transform: 'translateX(0)' },
  duration,
  timingFunction,
});

export const slideInDown = ({
  duration = '0.5s',
  timingFunction = 'ease-out',
}) => ({
  from: { transform: 'translateY(-100%)' },
  to: { transform: 'translateY(0)' },
  duration,
  timingFunction,
});

export const slideInUp = ({
  duration = '0.5s',
  timingFunction = 'ease-out',
}) => ({
  from: { transform: 'translateY(100%)' },
  to: { transform: 'translateY(0)' },
  duration,
  timingFunction,
});

export const bounce = ({
  duration = '2s',
  timingFunction = 'ease',
  iterationCount = 'infinite',
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
});

export const rotate = ({
  duration = '1s',
  timingFunction = 'linear',
  iterationCount = 'infinite',
}) => ({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
  duration,
  timingFunction,
  iterationCount,
});

export const pulse = ({
  duration = '1s',
  timingFunction = 'ease-in-out',
  iterationCount = 'infinite',
}) => ({
  from: { transform: 'scale(1)' },
  '50%': { transform: 'scale(1.05)' },
  to: { transform: 'scale(1)' },
  duration,
  timingFunction,
  iterationCount,
});

export const zoomIn = ({ duration = '0.5s', timingFunction = 'ease-out' }) => ({
  from: { transform: 'scale(0)' },
  to: { transform: 'scale(1)' },
  duration,
  timingFunction,
});

export const zoomOut = ({
  duration = '0.5s',
  timingFunction = 'ease-out',
}) => ({
  from: { transform: 'scale(1)' },
  to: { transform: 'scale(0)' },
  duration,
  timingFunction,
});

export const flash = ({ duration = '1s', iterationCount = 'infinite' }) => ({
  from: { opacity: 1 },
  '50%': { opacity: 0 },
  to: { opacity: 1 },
  duration,
  iterationCount,
});

export const shake = ({ duration = '0.5s', iterationCount = 'infinite' }) => ({
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
});

export const swing = ({ duration = '1s', iterationCount = 'infinite' }) => ({
  from: { transform: 'rotate(0deg)' },
  '20%': { transform: 'rotate(15deg)' },
  '40%': { transform: 'rotate(-10deg)' },
  '60%': { transform: 'rotate(5deg)' },
  '80%': { transform: 'rotate(-5deg)' },
  to: { transform: 'rotate(0deg)' },
  duration,
  iterationCount,
});

export const rubberBand = ({
  duration = '1s',
  timingFunction = 'ease-in-out',
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
});

export const wobble = ({ duration = '1s' }) => ({
  from: { transform: 'translateX(0%)' },
  '15%': { transform: 'translateX(-25%) rotate(-5deg)' },
  '30%': { transform: 'translateX(20%) rotate(3deg)' },
  '45%': { transform: 'translateX(-15%) rotate(-3deg)' },
  '60%': { transform: 'translateX(10%) rotate(2deg)' },
  '75%': { transform: 'translateX(-5%) rotate(-1deg)' },
  to: { transform: 'translateX(0%)' },
  duration,
});

export const flip = ({ duration = '1s' }) => ({
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
});

export const heartBeat = ({
  duration = '1.3s',
  iterationCount = 'infinite',
}) => ({
  from: { transform: 'scale(1)' },
  '14%': { transform: 'scale(1.3)' },
  '28%': { transform: 'scale(1)' },
  '42%': { transform: 'scale(1.3)' },
  '70%': { transform: 'scale(1)' },
  to: { transform: 'scale(1)' },
  duration,
  iterationCount,
});

export const rollIn = ({ duration = '1s' }) => ({
  from: {
    opacity: 0,
    transform: 'translateX(-100%) rotate(-120deg)',
  },
  to: {
    opacity: 1,
    transform: 'translateX(0px) rotate(0deg)',
  },
  duration,
});

export const rollOut = ({ duration = '1s' }) => ({
  from: {
    opacity: 1,
    transform: 'translateX(0px) rotate(0deg)',
  },
  to: {
    opacity: 0,
    transform: 'translateX(100%) rotate(120deg)',
  },
  duration,
});

export const lightSpeedIn = ({
  duration = '1s',
  timingFunction = 'ease-out',
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
});

export const lightSpeedOut = ({
  duration = '1s',
  timingFunction = 'ease-in',
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
});

export const hinge = ({ duration = '2s', timingFunction = 'ease-in-out' }) => ({
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
});

export const jackInTheBox = ({ duration = '1s', timingFunction = 'ease' }) => ({
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
});

export const flipInX = ({ duration = '1s', timingFunction = 'ease-in' }) => ({
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
});

export const flipInY = ({ duration = '1s', timingFunction = 'ease-in' }) => ({
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
});

export const headShake = ({
  duration = '1s',
  iterationCount = 'infinite',
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
});

export const tada = ({ duration = '1s', iterationCount = 'infinite' }) => ({
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
});

export const jello = ({ duration = '1s', iterationCount = 'infinite' }) => ({
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
});

export const fadeInDown = ({
  duration = '1s',
  timingFunction = 'ease-out',
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
});

export const fadeInUp = ({ duration = '1s', timingFunction = 'ease-out' }) => ({
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
});

export const bounceIn = ({
  duration = '0.75s',
  timingFunction = 'ease-in',
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
});

export const bounceOut = ({
  duration = '0.75s',
  timingFunction = 'ease-out',
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
});

export const slideOutLeft = ({
  duration = '0.5s',
  timingFunction = 'ease-in',
}) => ({
  from: {
    transform: 'translateX(0)',
  },
  to: {
    transform: 'translateX(-100%)',
  },
  duration,
  timingFunction,
});

export const slideOutRight = ({
  duration = '0.5s',
  timingFunction = 'ease-in',
}) => ({
  from: {
    transform: 'translateX(0)',
  },
  to: {
    transform: 'translateX(100%)',
  },
  duration,
  timingFunction,
});

export const zoomInDown = ({
  duration = '1s',
  timingFunction = 'ease-out',
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
});

export const zoomOutUp = ({ duration = '1s', timingFunction = 'ease-in' }) => ({
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
});

export const backInDown = ({
  duration = '1s',
  timingFunction = 'ease-in',
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
});

export const backOutUp = ({ duration = '1s', timingFunction = 'ease-in' }) => ({
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
});

export const shimmer = ({
  duration = '2s',
  timingFunction = 'linear',
  iterationCount = 'infinite',
}) => ({
  from: { transform: 'translateX(-100%)' },
  '50%': { transform: 'translateX(100%)' },
  to: { transform: 'translateX(100%)' },
  duration,
  timingFunction,
  iterationCount,
});

export const progress = ({
  duration = '2s',
  timingFunction = 'linear',
  direction = 'forwards',
  prop = 'width',
  from = '0%',
  to = '100%',
}) => ({
  from: { [prop]: from },
  to: { [prop]: to },
  duration,
  timingFunction,
  direction,
});

export const typewriter = ({
  duration = '10s',
  steps = 10,
  iterationCount = 1,
  width = 0,
}) => ({
  from: { width: '0px' },
  to: { width: `${width}px` },
  timingFunction: `steps(${steps})`,
  duration,
  iterationCount,
});

export const blinkCursor = ({
  duration = '0.75s',
  timingFunction = 'step-end',
  iterationCount = 'infinite',
  color = 'black',
}) => ({
  from: { color: color },
  to: { color: color },
  '0%': { color: color },
  '50%': { color: 'transparent' },
  '100%': { color: color },
  duration,
  timingFunction,
  iterationCount,
});
