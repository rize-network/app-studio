// Typewriter.stories.tsx

import React, { useState } from 'react';

import type { Meta, StoryFn } from '@storybook/react';

import { Typewriter, Vertical, Horizontal, Text, View } from '../src/index';

export default {
  title: 'Typewriter',
  component: Typewriter,
} as Meta<typeof Typewriter>;

/**
 * A single string types out as one paragraph.
 */
export const Default: StoryFn<typeof Typewriter> = () => (
  <Typewriter
    text="App Studio types this sentence one character at a time."
    fontSize={18}
    color="color-gray-800"
  />
);

/**
 * Pass an array of strings to type several paragraphs sequentially, each
 * rendered as its own block with spacing controlled by `paragraphGap`.
 */
export const Paragraphs: StoryFn<typeof Typewriter> = () => (
  <View maxWidth={560}>
    <Typewriter
      typingSpeed={20}
      pauseTime={700}
      paragraphGap={16}
      fontSize={16}
      lineHeight={1.6}
      color="color-gray-800"
      text={[
        'App Studio lets you compose interfaces with a single, expressive style API — CSS properties are passed directly as props.',
        'The Typewriter component walks through each paragraph in turn, pausing between them so the reader can keep up.',
        'When the final paragraph finishes, the cursor stays blinking and the onComplete callback fires.',
      ]}
    />
  </View>
);

/**
 * Use the pipe character "|" to force line breaks inside a single paragraph.
 */
export const LineBreaks: StoryFn<typeof Typewriter> = () => (
  <Typewriter
    typingSpeed={35}
    fontSize={18}
    lineHeight={1.6}
    color="color-gray-800"
    text="Roses are red,|Violets are blue,|App Studio types|line by line for you."
  />
);

/**
 * Paragraphs may each contain their own internal line breaks.
 */
export const Mixed: StoryFn<typeof Typewriter> = () => (
  <View maxWidth={560}>
    <Typewriter
      typingSpeed={25}
      pauseTime={600}
      paragraphGap={24}
      fontSize={16}
      lineHeight={1.6}
      color="color-gray-800"
      text={[
        'Chapter one|It started with a blank canvas.',
        'Chapter two|Then the words began to appear,|one character at a time.',
      ]}
    />
  </View>
);

/**
 * `loop` restarts the animation after a `loopDelay` pause — handy for hero
 * sections and rotating taglines.
 */
export const Looping: StoryFn<typeof Typewriter> = () => (
  <Typewriter
    loop
    loopDelay={1200}
    typingSpeed={60}
    fontSize={28}
    fontWeight="bold"
    cursorColor="color-blue-500"
    color="color-blue-600"
    text={['Build faster.', 'Ship anywhere.', 'Style with props.']}
  />
);

/**
 * Replay control + onComplete: remount the component with a key to restart it.
 */
export const ReplayAndOnComplete: StoryFn<typeof Typewriter> = () => {
  const [runKey, setRunKey] = useState(0);
  const [done, setDone] = useState(false);

  return (
    <Vertical gap={16} maxWidth={560}>
      <Horizontal gap={12} alignItems="center">
        <View
          as="button"
          onClick={() => {
            setDone(false);
            setRunKey((k) => k + 1);
          }}
          padding="8px 14px"
          backgroundColor="color-blue-500"
          color="white"
          borderRadius={8}
          cursor="pointer"
          border="none"
        >
          Replay
        </View>
        <Text color={done ? 'color-green-600' : 'color-gray-400'}>
          {done ? '✓ completed' : 'typing…'}
        </Text>
      </Horizontal>

      <Typewriter
        key={runKey}
        typingSpeed={18}
        paragraphGap={14}
        fontSize={16}
        lineHeight={1.6}
        color="color-gray-800"
        onComplete={() => setDone(true)}
        text={[
          'This sequence reports when it finishes.',
          'Press “Replay” to remount and run it again from the top.',
        ]}
      />
    </Vertical>
  );
};
