import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import {
  Button,
  Image,
  Input,
  ResponsiveProvider,
  Text,
  ThemeProvider,
  View,
} from '../../../src/native';

const renderNative = (ui: React.ReactElement) =>
  render(ui, { concurrentRoot: false } as any);

describe('native primitives', () => {
  it('renders View, Text, Image, Button and Input primitives', () => {
    const { getByText, getByTestId } = renderNative(
      <ThemeProvider>
        <View testID="container" padding={12}>
          <Text>Native text</Text>
          <Image testID="logo" src="https://example.com/logo.png" alt="Logo" />
          <Button testID="button">Press</Button>
          <Input testID="input" placeholder="Name" />
        </View>
      </ThemeProvider>
    );

    expect(getByTestId('container')).toBeTruthy();
    expect(getByText('Native text')).toBeTruthy();
    expect(getByTestId('logo').props.source).toEqual({
      uri: 'https://example.com/logo.png',
    });
    expect(getByText('Press')).toBeTruthy();
    expect(getByTestId('input').props.placeholder).toBe('Name');
  });

  it('maps onClick to native onPress', () => {
    const onClick = jest.fn();
    const { getByTestId } = renderNative(
      <ThemeProvider>
        <Button testID="button" onClick={onClick}>
          Press
        </Button>
      </ThemeProvider>
    );

    fireEvent.press(getByTestId('button'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('resolves theme and color tokens into native style values', () => {
    const { getByTestId } = renderNative(
      <ThemeProvider theme={{ primary: 'color-blue-500' }}>
        <Text testID="text" color="theme-primary">
          Token
        </Text>
      </ThemeProvider>
    );

    expect(getByTestId('text').props.style.color).toBe('#3b82f6');
  });

  it('expands native style shorthands', () => {
    const { getByTestId } = renderNative(
      <ThemeProvider>
        <View
          testID="box"
          widthHeight={24}
          paddingHorizontal={8}
          marginVertical={4}
        />
      </ThemeProvider>
    );

    expect(getByTestId('box').props.style).toEqual(
      expect.objectContaining({
        width: 24,
        height: 24,
        paddingHorizontal: 8,
        marginVertical: 4,
      })
    );
  });

  it('applies matching media styles from responsive context', () => {
    const { getByTestId } = renderNative(
      <ThemeProvider>
        <ResponsiveProvider>
          <View
            testID="responsive"
            flexDirection="row"
            media={{ mobile: { flexDirection: 'column' } }}
          />
        </ResponsiveProvider>
      </ThemeProvider>
    );

    expect(getByTestId('responsive').props.style.flexDirection).toBe('column');
  });

  it('accepts web-only props without passing them to React Native', () => {
    const { getByTestId } = renderNative(
      <ThemeProvider>
        <View
          testID="box"
          _hover={{ backgroundColor: 'color-red-500' }}
          _before={{ content: '""' }}
          as="section"
          animate={{ from: { opacity: 0 }, to: { opacity: 1 } }}
        />
      </ThemeProvider>
    );

    expect(getByTestId('box').props._hover).toBeUndefined();
    expect(getByTestId('box').props.as).toBeUndefined();
  });
});
