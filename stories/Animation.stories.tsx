import React, { useState, useEffect } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { View, Button, Animation } from '../src/index';

// Create a typed map for Animation functions to allow string indexing
const AnimationMap = Animation as Record<string, (...args: any[]) => any>;

export default {
  title: 'Animation/Selectable',
  component: View,
  argTypes: {
    animationName: {
      control: {
        type: 'select',
      },
      options: Object.keys(Animation),
    },
    duration: {
      control: 'text',
      defaultValue: '1s',
    },
    timingFunction: {
      control: 'text',
      defaultValue: 'ease',
    },
    iterationCount: {
      control: 'text',
      defaultValue: '1',
    },
  },
} as ComponentMeta<typeof View>;

const Template: ComponentStory<typeof View> = (args) => {
  const {
    animationName,
    duration,
    timingFunction,
    iterationCount,
    ...rest
  }: any = args;

  // Récupérer la fonction d'animation correspondante
  const animationFunc = AnimationMap[animationName as string];

  // Construire l'objet d'animation en passant les paramètres
  const animate = animationFunc
    ? animationFunc(duration, timingFunction, iterationCount)
    : undefined;

  return (
    <View
      widthHeight={100}
      backgroundColor="color.blue"
      animate={animate ? animate : undefined}
      {...rest}
    />
  );
};

export const SelectableAnimation = Template.bind({});
SelectableAnimation.args = {
  animationName: 'fadeIn',
  duration: '1s',
  timingFunction: 'ease',
  iterationCount: '1',
};

const animationSequence: any = [
  {
    from: { opacity: 0, transform: 'translateY(-100px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    duration: '2s',
    timingFunction: 'ease-in',
  },
  {
    from: { opacity: 1, transform: 'translateY(100px)' },
    to: { opacity: 0, transform: 'translateY(0)' },
    duration: '2s',
    timingFunction: 'ease-out',
  },
];

export const SequencesAnimation: ComponentStory<typeof View> = () => (
  <View>
    <View
      animate={animationSequence}
      backgroundColor={'red'}
      widthHeight={50}
    ></View>
    ;
  </View>
);

export const TranslationAnimation: ComponentStory<typeof View> = () => (
  <View
    widthHeight={100}
    backgroundColor="color.blue"
    animate={Animation.bounce({
      duration: '1s',
      timingFunction: 'ease',
      iterationCount: 'infinite',
    })}
  />
);

export const RotationOnHover: ComponentStory<typeof View> = () => (
  <View>
    <View
      widthHeight={100}
      backgroundColor="color.green"
      on={{
        hover: {
          animate: Animation.rotate({ duration: '1s', timingFunction: 'ease' }),
        },
      }}
    />
  </View>
);

export const ScalingAnimation: ComponentStory<typeof View> = () => {
  const [visible, setVisible] = useState(true);

  return (
    <>
      <Button onPress={() => setVisible(!visible)}>
        {visible ? 'Masquer' : 'Afficher'} le composant
      </Button>
      {visible && (
        <View
          widthHeight={100}
          backgroundColor="color.red"
          animate={{
            from: { transform: 'scale(0)' },
            to: { transform: 'scale(1)' },
            leave: { transform: 'scale(0.5)' },
            duration: '0.5s',
            timingFunction: 'ease-in-out',
          }}
        />
      )}
    </>
  );
};

export const ColorChangeAnimation: ComponentStory<typeof View> = () => (
  <View
    widthHeight={100}
    animate={{
      from: { backgroundColor: 'yellow' },
      to: { backgroundColor: 'purple' },
      duration: '3s',
      timingFunction: 'linear',
    }}
  />
);

export const InfiniteRotation: ComponentStory<typeof View> = () => (
  <View
    widthHeight={100}
    backgroundColor="color.orange"
    animate={{
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(360deg)' },
      duration: '2s',
      timingFunction: 'linear',
      iterationCount: 'infinite',
    }}
  />
);

export const ResponsiveAnimation: ComponentStory<typeof View> = () => (
  <View
    widthHeight={100}
    backgroundColor="color.pink"
    animate={{
      from: { opacity: 0 },
      to: { opacity: 1 },
      duration: '1s',
      timingFunction: 'ease-in',
    }}
    media={{
      mobile: {
        animate: {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0%)' },
          duration: '0.5s',
          timingFunction: 'ease-out',
        },
      },
      desktop: {
        animate: {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0%)' },
          duration: '1s',
          timingFunction: 'ease-out',
        },
      },
    }}
  />
);

export const BlinkAnimation: ComponentStory<typeof View> = () => (
  <View
    widthHeight={100}
    backgroundColor="color.black"
    animate={{
      from: { opacity: 0 },
      to: { opacity: 1 },
      duration: '0.5s',
      timingFunction: 'ease-in-out',
      delay: '1s',
      iterationCount: 5,
      direction: 'alternate',
    }}
  />
);

export const ComplexAnimation: ComponentStory<typeof View> = () => (
  <View
    widthHeight={100}
    backgroundColor="color.black"
    animate={{
      from: {
        opacity: 0,
        transform: 'scale(0.5) rotate(0deg)',
      },
      to: {
        opacity: 1,
        transform: 'scale(1) rotate(360deg)',
      },
      duration: '2s',
      timingFunction: 'ease-in-out',
    }}
  />
);

export const CustomTiming: ComponentStory<typeof View> = () => (
  <View
    widthHeight={100}
    backgroundColor="color.black"
    animate={{
      from: { transform: 'translateY(0)' },
      to: { transform: 'translateY(-100px)' },
      duration: '1s',
      timingFunction: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)',
    }}
  />
);

export const ClickAnimation: ComponentStory<typeof View> = () => {
  const [animate, setAnimate] = useState(false);

  return (
    <View
      widthHeight={100}
      backgroundColor="color.cyan"
      onPress={() => setAnimate(!animate)}
      animate={
        animate
          ? {
              from: { transform: 'scale(1)' },
              to: { transform: 'scale(1.5)' },
              duration: '0.3s',
              timingFunction: 'ease-in-out',
              fillMode: 'forwards',
            }
          : {
              from: { transform: 'scale(1.5)' },
              to: { transform: 'scale(1)' },
              duration: '0.3s',
              timingFunction: 'ease-in-out',
              fillMode: 'forwards',
            }
      }
    />
  );
};

export const AnimateInExample: ComponentStory<typeof View> = () => {
  const [visible, setVisible] = useState(false);
  const [render, setRender] = useState(false);

  useEffect(() => {
    if (visible) {
      setRender(true);
    } else {
      const timer = setTimeout(() => {
        setRender(false);
      }, 500); // Match the duration of animateIn
      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <>
      <Button onPress={() => setVisible(!visible)}>
        {visible ? 'Hide' : 'Show'} Component (Animate In)
      </Button>
      {render && (
        <View
          widthHeight={100}
          backgroundColor="color.blue"
          animateIn={{
            from: { opacity: 0, transform: 'translateY(-50px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
            duration: '0.5s',
            timingFunction: 'ease-out',
          }}
        />
      )}
    </>
  );
};

export const AnimateOutExample: ComponentStory<typeof View> = () => {
  const [visible, setVisible] = useState(true);
  const [render, setRender] = useState(true);

  useEffect(() => {
    if (visible) {
      setRender(true);
    } else {
      const timer = setTimeout(() => {
        setRender(false);
      }, 500); // Match the duration of animateOut
      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <>
      <Button onPress={() => setVisible(!visible)}>
        {visible ? 'Hide' : 'Show'} Component (Animate Out)
      </Button>
      {render && (
        <View
          widthHeight={100}
          backgroundColor="color.green"
          animateOut={{
            from: { opacity: 1, transform: 'translateX(0)' },
            to: { opacity: 0, transform: 'translateX(50px)' },
            duration: '0.5s',
            timingFunction: 'ease-in',
          }}
        />
      )}
    </>
  );
};

export const VisibleAnimation: ComponentStory<typeof View> = () => (
  <View
    style={{
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <View
      style={{
        width: '100%',
        height: '110vh',
        backgroundColor: '#f0f0f0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Scroll Down ↓</div>
    </View>
    <View
      widthHeight={200}
      backgroundColor="color.purple"
      style={{ margin: '50px auto' }}
      animateIn={{
        from: { opacity: 0, transform: 'scale(0.5) translateY(100px)' },
        to: { opacity: 1, transform: 'scale(1) translateY(0)' },
        duration: '1s',
        timingFunction: 'ease-out',
      }}
    />
    <View
      style={{ width: '100%', height: '50vh', backgroundColor: '#e0e0e0' }}
    />
  </View>
);
