// Button.stories.ts|tsx

import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Text, View, Vertical, useResponsive } from '../src/index';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overText#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Text',
  component: Text,
} as ComponentMeta<typeof Text>;

export const Exemple: ComponentStory<typeof Text> = () => {
  const res = useResponsive();
  const responsive = {
    xs: {
      color: 'red',
    },
    sm: {
      color: 'green',
    },
    md: {
      color: 'blue',
    },
    lg: {
      color: 'yellow',
    },
    xl: {
      color: 'red',
    },
  };

  return (
    <Text widthHeight={100} lineHeight={20} media={responsive}>
      {`${res.screen} - ${res.on('mobile') ? 'Mobile' : 'Not Mobile'}`}
    </Text>
  );
};

export const blend: ComponentStory<typeof Text> = () => {
  return (
    <View>
      <View backgroundColor="black" padding={20}>
        <Text>Visible on Black</Text>
      </View>
      <View backgroundColor="white" padding={20}>
        <Text>Visible on White</Text>
      </View>
      <View backgroundColor="red" padding={20}>
        <Text>Visible on Red</Text>
      </View>
    </View>
  );
};

export const DarkLightMode: ComponentStory<typeof Text> = () => {
  return (
    <View>
      <View padding={20}>
        <Text fontSize={24} marginBottom={10}>
          Light Mode Container
        </Text>
        <View backgroundColor="#ffffff" padding={40}>
          <Text fontSize={30} fontWeight="bold" blend>
            Smart Text (Blend)
          </Text>
          <Text color="color-black" marginTop={10}>
            Standard Text (Black)
          </Text>
        </View>
      </View>

      <View padding={20}>
        <Text fontSize={24} marginBottom={10}>
          Dark Mode Container
        </Text>
        <View backgroundColor="#000000" padding={40}>
          <Text fontSize={30} fontWeight="bold">
            Smart Text (Blend)
          </Text>
          <Text color="color-white" marginTop={10}>
            Standard Text (White)
          </Text>
        </View>
      </View>

      <View padding={20}>
        <Text fontSize={24} marginBottom={10}>
          Mixed/Gradient Container
        </Text>
        <View
          style={{
            background: 'linear-gradient(90deg, #ffffff 0%, #000000 100%)',
          }}
          padding={40}
        >
          <Text fontSize={30} fontWeight="bold">
            Smart Text Across Gradient
          </Text>
        </View>
      </View>
    </View>
  );
};

/**
 * Text Examples - Design System
 *
 * Showcases the Text component following the design guidelines:
 * - Typography: Inter/Geist font, specific sizes/weights
 * - Spacing: 4px grid system
 * - Colors: Neutral palette with semantic colors
 */
export const DesignSystemText = () => (
  <View backgroundColor="white" padding={32}>
    <Vertical gap={32}>
      {/* Headings */}
      <View>
        <Text marginBottom={8} fontWeight="600">
          Typography - Headings
        </Text>
        <Vertical gap={16}>
          <Text heading="h1">Heading 1</Text>
          <Text heading="h2">Heading 2</Text>
          <Text heading="h3">Heading 3</Text>
          <Text heading="h4">Heading 4</Text>
          <Text heading="h5">Heading 5</Text>
          <Text heading="h6">Heading 6</Text>
        </Vertical>
      </View>

      {/* Text Sizes */}
      <View>
        <Text marginBottom={8} fontWeight="600">
          Typography - Text Sizes
        </Text>
        <Vertical gap={8}>
          <Text size="xs">Extra Small (xs) - 10px</Text>
          <Text size="sm">Small (sm) - 12px</Text>
          <Text size="md">Medium (md) - 14px (default)</Text>
          <Text size="lg">Large (lg) - 16px</Text>
          <Text size="xl">Extra Large (xl) - 20px</Text>
        </Vertical>
      </View>

      {/* Font Weights */}
      <View>
        <Text marginBottom={8} fontWeight="600">
          Typography - Font Weights
        </Text>
        <Vertical gap={8}>
          <Text weight="hairline">Hairline (100)</Text>
          <Text weight="thin">Thin (200)</Text>
          <Text weight="light">Light (300)</Text>
          <Text weight="normal">Normal (400) - Default</Text>
          <Text weight="medium">Medium (500)</Text>
          <Text weight="semiBold">Semi Bold (600)</Text>
          <Text weight="bold">Bold (700)</Text>
          <Text weight="extraBold">Extra Bold (800)</Text>
          <Text weight="black">Black (900)</Text>
        </Vertical>
      </View>

      {/* Text Styles */}
      <View>
        <Text marginBottom={8} fontWeight="600">
          Typography - Text Styles
        </Text>
        <Vertical gap={8}>
          <Text isItalic>Italic Text</Text>
          <Text isUnderlined>Underlined Text</Text>
          <Text isStriked>Strikethrough Text</Text>
          <View>
            <Text>Text with </Text>
            <Text isSub>subscript</Text>
            <Text> elements</Text>
          </View>
          <View>
            <Text>Text with </Text>
            <Text isSup>superscript</Text>
            <Text> elements</Text>
          </View>
          <Text maxLines={2}>
            This is a long text that will be truncated after 2 lines. Lorem
            ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod,
            nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam
            nisl nunc quis nisl.
          </Text>
        </Vertical>
      </View>

      {/* Semantic Text */}
      <View>
        <Text marginBottom={8} fontWeight="600">
          Typography - Semantic Text
        </Text>
        <Vertical gap={16}>
          <View padding={16} backgroundColor="color-gray.50" borderRadius="8px">
            <Vertical gap={8}>
              <Text color="color-gray-900" fontWeight="semiBold">
                Primary Text
              </Text>
              <Text color="color-gray-700">Secondary Text</Text>
              <Text color="color-gray-500" size="sm">
                Tertiary Text
              </Text>
              <Text color="color-gray-400" size="xs">
                Disabled Text
              </Text>
            </Vertical>
          </View>

          <View padding={16} backgroundColor="color-blue.50" borderRadius="8px">
            <Vertical gap={8}>
              <Text color="color-blue-900" fontWeight="semiBold">
                Info Heading
              </Text>
              <Text color="color-blue-700">Info Text</Text>
              <Text color="color-blue-500" size="sm">
                Info Details
              </Text>
            </Vertical>
          </View>

          <View
            padding={16}
            backgroundColor="color-green.50"
            borderRadius="8px"
          >
            <Vertical gap={8}>
              <Text color="color-green-900" fontWeight="semiBold">
                Success Heading
              </Text>
              <Text color="color-green-700">Success Text</Text>
              <Text color="color-green-500" size="sm">
                Success Details
              </Text>
            </Vertical>
          </View>

          <View padding={16} backgroundColor="color-red.50" borderRadius="8px">
            <Vertical gap={8}>
              <Text color="color-red-900" fontWeight="semiBold">
                Error Heading
              </Text>
              <Text color="color-red-700">Error Text</Text>
              <Text color="color-red-500" size="sm">
                Error Details
              </Text>
            </Vertical>
          </View>
        </Vertical>
      </View>
    </Vertical>
  </View>
);

export const BlendModes: ComponentStory<typeof Text> = () => {
  return (
    <Vertical gap={20} padding={20} backgroundColor="#888">
      <Text heading="h3" color="white">
        Blend Mode Tests
      </Text>

      {/* Basic Blend */}
      <View backgroundColor="black" padding={20}>
        <Text>Blend on Black (Should be White)</Text>
      </View>
      <View backgroundColor="white" padding={20}>
        <Text>Blend on White (Should be Black)</Text>
      </View>

      {/* Truncated Text with Blend */}
      <View backgroundColor="blue" padding={20} width={200}>
        <Text maxLines={2}>
          Truncated Blend Text on Blue - This should be truncated and visible
        </Text>
      </View>

      {/* Sub/Sup with Blend */}
      <View backgroundColor="darkred" padding={50}>
        <View>
          <Text>Normal </Text>
          <Text isSup>Superscript</Text>
          <Text> and </Text>
          <Text isSub>Subscript</Text>
        </View>
      </View>

      {/* Explicit Colors with Blend */}
      <View backgroundColor="green" padding={20}>
        <Text color="red">
          Blend with explicit Red color (Should be overridden by blend logic?)
        </Text>
      </View>

      {/* Complex Background */}
      <View
        style={{ background: 'linear-gradient(45deg, red, blue)' }}
        padding={20}
      >
        <Text fontSize={24} fontWeight="bold">
          Blend on Gradient
        </Text>
      </View>
    </Vertical>
  );
};
