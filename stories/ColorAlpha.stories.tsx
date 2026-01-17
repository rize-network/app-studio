// Color Alpha Parameter Test Stories
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { View, Text, Vertical, Horizontal } from '../src';

export default {
  title: 'Theming/Color Alpha Parameter',
  component: View,
  parameters: {
    docs: {
      description: {
        component:
          'Demonstrates the new 4th parameter alpha feature for colors. Use syntax like `color-{palette}.{shade}.{alpha}` where alpha ranges from 0-1000 (0 = transparent, 1000 = opaque). Examples: `color-black.900.200` produces `rgba(0, 0, 0, 0.2)` for 20% opacity.',
      },
    },
  },
} as ComponentMeta<typeof View>;

// Template for Alpha Transparency Examples
const AlphaTemplate: ComponentStory<typeof View> = () => (
  <Vertical gap={30} padding={20} backgroundColor="color-gray-100">
    <Text fontSize={24} fontWeight="bold">
      Alpha Parameter Examples
    </Text>

    {/* Black with varying alpha */}
    <Vertical gap={10}>
      <Text fontSize={18} fontWeight="600">
        Black with Varying Alpha (color-black.900.XXX)
      </Text>
      <Horizontal gap={10}>
        <View
          width={100}
          height={100}
          backgroundColor="color-black.900-100"
          borderRadius={8}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="color-black" fontSize={12} fontWeight="bold">
            10%
          </Text>
        </View>
        <View
          width={100}
          height={100}
          backgroundColor="color-black.900-300"
          borderRadius={8}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="color-white" fontSize={12} fontWeight="bold">
            30%
          </Text>
        </View>
        <View
          width={100}
          height={100}
          backgroundColor="color-black.900-500"
          borderRadius={8}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="color-white" fontSize={12} fontWeight="bold">
            50%
          </Text>
        </View>
        <View
          width={100}
          height={100}
          backgroundColor="color-black.900-700"
          borderRadius={8}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="color-white" fontSize={12} fontWeight="bold">
            70%
          </Text>
        </View>
        <View
          width={100}
          height={100}
          backgroundColor="color-black.900.1000"
          borderRadius={8}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="color-white" fontSize={12} fontWeight="bold">
            100%
          </Text>
        </View>
      </Horizontal>
    </Vertical>

    {/* Blue with varying alpha */}
    <Vertical gap={10}>
      <Text fontSize={18} fontWeight="600">
        Blue.500 with Varying Alpha (color-blue.500.XXX)
      </Text>
      <Horizontal gap={10}>
        <View
          width={100}
          height={100}
          backgroundColor="color-blue.500-200"
          borderRadius={8}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="color-black" fontSize={12} fontWeight="bold">
            20%
          </Text>
        </View>
        <View
          width={100}
          height={100}
          backgroundColor="color-blue.500-400"
          borderRadius={8}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="color-white" fontSize={12} fontWeight="bold">
            40%
          </Text>
        </View>
        <View
          width={100}
          height={100}
          backgroundColor="color-blue.500-600"
          borderRadius={8}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="color-white" fontSize={12} fontWeight="bold">
            60%
          </Text>
        </View>
        <View
          width={100}
          height={100}
          backgroundColor="color-blue.500-800"
          borderRadius={8}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="color-white" fontSize={12} fontWeight="bold">
            80%
          </Text>
        </View>
        <View
          width={100}
          height={100}
          backgroundColor="color-blue.500.1000"
          borderRadius={8}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="color-white" fontSize={12} fontWeight="bold">
            100%
          </Text>
        </View>
      </Horizontal>
    </Vertical>

    {/* Red with varying alpha */}
    <Vertical gap={10}>
      <Text fontSize={18} fontWeight="600">
        Red.600 with Varying Alpha (color-red.600.XXX)
      </Text>
      <Horizontal gap={10}>
        <View
          width={100}
          height={100}
          backgroundColor="color-red.600-200"
          borderRadius={8}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="color-black" fontSize={12} fontWeight="bold">
            20%
          </Text>
        </View>
        <View
          width={100}
          height={100}
          backgroundColor="color-red.600-400"
          borderRadius={8}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="color-white" fontSize={12} fontWeight="bold">
            40%
          </Text>
        </View>
        <View
          width={100}
          height={100}
          backgroundColor="color-red.600-600"
          borderRadius={8}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="color-white" fontSize={12} fontWeight="bold">
            60%
          </Text>
        </View>
        <View
          width={100}
          height={100}
          backgroundColor="color-red.600-800"
          borderRadius={8}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="color-white" fontSize={12} fontWeight="bold">
            80%
          </Text>
        </View>
      </Horizontal>
    </Vertical>

    {/* Glassmorphism Example */}
    <Vertical gap={10}>
      <Text fontSize={18} fontWeight="600">
        Glassmorphism with Alpha
      </Text>
      <View
        width="100%"
        height={200}
        background="linear-gradient(135deg, color-red.500.200 0%, color-blue.500.1000 100%)"
        borderRadius={12}
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
      >
        <View
          backgroundColor="color-white.900.150"
          padding={30}
          borderRadius={12}
          style={{
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          <Text color="color-white" fontSize={20} fontWeight="bold">
            Glass Card with color-white.900.150
          </Text>
          <Text color="color-white.900-800" fontSize={14}>
            Semi-transparent overlay with backdrop filter
          </Text>
        </View>
      </View>
    </Vertical>
  </Vertical>
);

// Template for New Color Palettes
const NewPalettesTemplate: ComponentStory<typeof View> = () => (
  <Vertical gap={30} padding={20} backgroundColor="color-gray.50">
    <Text fontSize={24} fontWeight="bold">
      New Color Palettes
    </Text>

    {/* Slate */}
    <Vertical gap={10}>
      <Text fontSize={18} fontWeight="600">
        Slate (color-slate.XXX)
      </Text>
      <Horizontal gap={5} style={{ flexWrap: 'wrap' }}>
        {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000].map(
          (shade) => (
            <View
              key={shade}
              width={70}
              height={70}
              backgroundColor={
                shade === 1000 ? `color-slate.900.1000` : `color-slate.${shade}`
              }
              borderRadius={8}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text
                color={shade >= 500 ? 'color-white' : 'color-black'}
                fontSize={11}
                fontWeight="bold"
              >
                {shade}
              </Text>
            </View>
          )
        )}
      </Horizontal>
    </Vertical>

    {/* Zinc */}
    <Vertical gap={10}>
      <Text fontSize={18} fontWeight="600">
        Zinc (color-zinc.XXX)
      </Text>
      <Horizontal gap={5} style={{ flexWrap: 'wrap' }}>
        {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000].map(
          (shade) => (
            <View
              key={shade}
              width={70}
              height={70}
              backgroundColor={
                shade === 1000 ? `color-zinc.900.1000` : `color-zinc.${shade}`
              }
              borderRadius={8}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text
                color={shade >= 500 ? 'color-white' : 'color-black'}
                fontSize={11}
                fontWeight="bold"
              >
                {shade}
              </Text>
            </View>
          )
        )}
      </Horizontal>
    </Vertical>

    {/* Neutral */}
    <Vertical gap={10}>
      <Text fontSize={18} fontWeight="600">
        Neutral (color-neutral.XXX)
      </Text>
      <Horizontal gap={5} style={{ flexWrap: 'wrap' }}>
        {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000].map(
          (shade) => (
            <View
              key={shade}
              width={70}
              height={70}
              backgroundColor={
                shade === 1000
                  ? `color-neutral.900.1000`
                  : `color-neutral.${shade}`
              }
              borderRadius={8}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text
                color={shade >= 500 ? 'color-white' : 'color-black'}
                fontSize={11}
                fontWeight="bold"
              >
                {shade}
              </Text>
            </View>
          )
        )}
      </Horizontal>
    </Vertical>

    {/* Stone */}
    <Vertical gap={10}>
      <Text fontSize={18} fontWeight="600">
        Stone (color-stone.XXX)
      </Text>
      <Horizontal gap={5} style={{ flexWrap: 'wrap' }}>
        {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000].map(
          (shade) => (
            <View
              key={shade}
              width={70}
              height={70}
              backgroundColor={
                shade === 1000 ? `color-stone.900.1000` : `color-stone.${shade}`
              }
              borderRadius={8}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text
                color={shade >= 500 ? 'color-white' : 'color-black'}
                fontSize={11}
                fontWeight="bold"
              >
                {shade}
              </Text>
            </View>
          )
        )}
      </Horizontal>
    </Vertical>

    {/* Example showing all palettes work with alpha */}
    <Vertical gap={10}>
      <Text fontSize={18} fontWeight="600">
        Alpha Parameter Works with New Palettes
      </Text>
      <Horizontal gap={10}>
        <View
          width={150}
          height={100}
          backgroundColor="color-slate.500-300"
          borderRadius={8}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="color-white" fontSize={12} fontWeight="bold">
            slate.500.300
          </Text>
          <Text color="color-white" fontSize={10}>
            (30% opacity)
          </Text>
        </View>
        <View
          width={150}
          height={100}
          backgroundColor="color-zinc.600-500"
          borderRadius={8}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="color-white" fontSize={12} fontWeight="bold">
            zinc.600.500
          </Text>
          <Text color="color-white" fontSize={10}>
            (50% opacity)
          </Text>
        </View>
        <View
          width={150}
          height={100}
          backgroundColor="color-neutral.700-700"
          borderRadius={8}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="color-white" fontSize={12} fontWeight="bold">
            neutral.700.700
          </Text>
          <Text color="color-white" fontSize={10}>
            (70% opacity)
          </Text>
        </View>
      </Horizontal>
    </Vertical>
  </Vertical>
);

// Export Stories
export const AlphaParameter = AlphaTemplate.bind({});
AlphaParameter.storyName = 'Alpha Transparency';

export const NewColorPalettes = NewPalettesTemplate.bind({});
NewColorPalettes.storyName = 'New Palettes (Slate, Zinc, Neutral, Stone)';
