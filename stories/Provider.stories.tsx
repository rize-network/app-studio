// Button.stories.ts|tsx

import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';
import {
  ThemeProvider,
  AnalyticsProvider,
  View,
  Text,
  Button,
} from '../src/index';

export default {
  title: 'Providers',
  component: ThemeProvider, // We can use ThemeProvider as a placeholder for demonstration
} as ComponentMeta<typeof ThemeProvider>;

export const ThemeMode: ComponentStory<typeof ThemeProvider> = () => {
  const [mode, setMode] = React.useState<'light' | 'dark'>('light');

  return (
      <View>
        <Text marginRight={10}>Current Theme Mode: {mode}</Text>
        <View  data-theme={mode}>
          <Button onPress={() => setMode(mode === 'light' ? 'dark' : 'light')}>
            Toggle Theme
          </Button>

          <View width={100} height={100} backgroundColor="color.white" marginTop={20}>
            <Text color="color.black">
              This text is styled using the primary color from the theme.
            </Text>
          </View>

          <View
            width={100}
            height={100}
            backgroundColor="color.black"
            marginTop={20}
          >
            <Text color="color.red">
              This text is styled using the primary color from the theme.
            </Text>
          </View>
        </View>
      </View>
  );
};

export const Analytics: ComponentStory<typeof AnalyticsProvider> = () => {
  const trackEvent = (event: any) => {
    console.log('Track Event:', event);
    // Here you would typically send the event to your analytics service
  };

  return (
    <AnalyticsProvider
      trackEvent={(event) => console.log('Track Event:', event)}
    >
      <View>
        <Text>Analytics Provider Example</Text>
        <Button
          onPress={() =>
            trackEvent({ type: 'button_click', buttonName: 'Example Button' })
          }
        >
          Example Button
        </Button>
        <View marginTop={20}>
          <Text>
            Clicking the button above will log an event to the console. In a
            real application, this would send data to an analytics service.
          </Text>
        </View>
      </View>
    </AnalyticsProvider>
  );
};
