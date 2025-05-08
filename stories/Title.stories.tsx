import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { View, Vertical } from '../src/index';
import { Title } from '../../web/src/components/Title/Title';

export default {
  title: 'Components/Title',
  component: Title,
  argTypes: {
    animation: {
      control: {
        type: 'select',
        options: ['none', 'fadeIn', 'slideIn', 'typewriter', 'highlight', 'reveal', 'bounce'],
      },
      defaultValue: 'fadeIn',
    },
    animationDirection: {
      control: {
        type: 'select',
        options: ['left', 'right', 'top', 'bottom'],
      },
      defaultValue: 'left',
    },
    animationDuration: {
      control: 'text',
      defaultValue: '1s',
    },
    animationDelay: {
      control: 'text',
      defaultValue: '0s',
    },
    size: {
      control: {
        type: 'select',
        options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'],
      },
      defaultValue: 'xl',
    },
    highlightStyle: {
      control: {
        type: 'select',
        options: ['background', 'underline', 'gradient', 'outline', 'glow'],
      },
      defaultValue: 'background',
    },
    highlightColor: {
      control: 'color',
      defaultValue: 'theme.primary',
    },
    highlightSecondaryColor: {
      control: 'color',
      defaultValue: 'theme.secondary',
    },
    centered: {
      control: 'boolean',
      defaultValue: false,
    },
  },
} as ComponentMeta<typeof Title>;

const Template: ComponentStory<typeof Title> = (args) => (
  <View padding={20}>
    <Title {...args} />
  </View>
);

export const Default = Template.bind({});
Default.args = {
  children: 'Simple Hero Title',
};

export const WithHighlight = Template.bind({});
WithHighlight.args = {
  children: 'Title with highlighted text',
  highlightText: 'highlighted',
  highlightStyle: 'background',
  highlightColor: 'theme.primary',
};

export const WithAnimation = Template.bind({});
WithAnimation.args = {
  children: 'Animated Title',
  animation: 'fadeIn',
  animationDuration: '1.5s',
};

export const AllAnimations: ComponentStory<typeof Title> = () => (
  <Vertical gap={48} padding={20}>
    <Title animation="fadeIn" animationDuration="1.5s">
      Fade In Animation
    </Title>
    
    <Title animation="slideIn" animationDirection="left" animationDuration="1s">
      Slide In From Left
    </Title>
    
    <Title animation="slideIn" animationDirection="right" animationDuration="1s">
      Slide In From Right
    </Title>
    
    <Title animation="slideIn" animationDirection="top" animationDuration="1s">
      Slide In From Top
    </Title>
    
    <Title animation="slideIn" animationDirection="bottom" animationDuration="1s">
      Slide In From Bottom
    </Title>
    
    <Title animation="typewriter" animationDuration="3s">
      Typewriter Effect Animation
    </Title>
    
    <Title animation="reveal" animationDuration="1.5s">
      Reveal Animation
    </Title>
    
    <Title animation="bounce" animationDuration="1s">
      Bounce Animation
    </Title>
  </Vertical>
);

export const AllHighlightStyles: ComponentStory<typeof Title> = () => (
  <Vertical gap={32} padding={20}>
    <Title 
      highlightText="background" 
      highlightStyle="background"
      highlightColor="theme.primary"
    >
      Text with background highlight
    </Title>
    
    <Title 
      highlightText="underlined" 
      highlightStyle="underline"
      highlightColor="theme.secondary"
    >
      Text with underlined highlight
    </Title>
    
    <Title 
      highlightText="gradient" 
      highlightStyle="gradient" 
      highlightColor="theme.primary" 
      highlightSecondaryColor="theme.secondary"
    >
      Text with gradient highlight
    </Title>
    
    <Title 
      highlightText="outline" 
      highlightStyle="outline"
      highlightColor="theme.primary"
    >
      Text with outline highlight
    </Title>
    
    <Title 
      highlightText="glow" 
      highlightStyle="glow"
      highlightColor="theme.primary"
    >
      Text with glow highlight
    </Title>
  </Vertical>
);
