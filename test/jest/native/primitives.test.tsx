import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import {
  Button,
  Center,
  Grid,
  Horizontal,
  HorizontalResponsive,
  Image,
  Input,
  ResponsiveProvider,
  Text,
  ThemeProvider,
  View,
  Vertical,
  VerticalResponsive,
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

  it.each([1.1, 1.2, 1.3, 1.6, 2.1])(
    'resolves numeric and string lineHeight=%s multipliers against fontSize',
    (lineHeight) => {
      const { getByTestId } = renderNative(
        <ThemeProvider>
          <View>
            <Text testID="numeric" fontSize={20} lineHeight={lineHeight} />
            <Text
              testID="string"
              fontSize={20}
              lineHeight={String(lineHeight)}
            />
          </View>
        </ThemeProvider>
      );

      expect(getByTestId('numeric').props.style.lineHeight).toBe(
        lineHeight * 20
      );
      expect(getByTestId('string').props.style.lineHeight).toBe(
        lineHeight * 20
      );
    }
  );

  it('keeps absolute native line heights and their fractional precision', () => {
    const { getByTestId } = renderNative(
      <ThemeProvider>
        <View>
          <Text testID="bare" lineHeight="20.5" />
          <Text testID="pixels" lineHeight="2px" />
        </View>
      </ThemeProvider>
    );

    expect(getByTestId('bare').props.style.lineHeight).toBe(20.5);
    expect(getByTestId('pixels').props.style.lineHeight).toBe(2);
  });

  it('keeps the native layout primitives semantic', () => {
    const { getByTestId } = renderNative(
      <ThemeProvider>
        <View>
          <Horizontal testID="horizontal" flexDirection="column" />
          <Vertical testID="vertical" flexDirection="row" />
          <Center
            testID="center"
            justifyContent="flex-start"
            alignItems="stretch"
          />
        </View>
      </ThemeProvider>
    );

    expect(getByTestId('horizontal').props.style.flexDirection).toBe('row');
    expect(getByTestId('vertical').props.style.flexDirection).toBe('column');
    expect(getByTestId('center').props.style.justifyContent).toBe('center');
    expect(getByTestId('center').props.style.alignItems).toBe('center');
  });

  it('allows responsive layout variants to change direction on mobile', () => {
    const { getByTestId } = renderNative(
      <ThemeProvider>
        <ResponsiveProvider>
          <View>
            <HorizontalResponsive testID="horizontal-responsive" />
            <VerticalResponsive testID="vertical-responsive" />
          </View>
        </ResponsiveProvider>
      </ThemeProvider>
    );

    expect(getByTestId('horizontal-responsive').props.style.flexDirection).toBe(
      'column'
    );
    expect(getByTestId('vertical-responsive').props.style.flexDirection).toBe(
      'row'
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

  it('lays Grid children out in flex rows by column count', () => {
    const { getByTestId } = renderNative(
      <ThemeProvider>
        <Grid testID="grid" columns={2} gap={8}>
          <View testID="cell-0" />
          <View testID="cell-1" />
          <View testID="cell-2" />
        </Grid>
      </ThemeProvider>
    );

    // Outer container stacks rows vertically...
    expect(getByTestId('grid').props.style.flexDirection).toBe('column');
    // ...and every child renders even when the final row is partial.
    expect(getByTestId('cell-0')).toBeTruthy();
    expect(getByTestId('cell-1')).toBeTruthy();
    expect(getByTestId('cell-2')).toBeTruthy();
  });

  it('accepts a grid-template string for Grid columns', () => {
    const { getByTestId } = renderNative(
      <ThemeProvider>
        <Grid testID="grid" columns="1fr 2fr">
          <View testID="a" />
          <View testID="b" />
        </Grid>
      </ThemeProvider>
    );

    expect(getByTestId('grid')).toBeTruthy();
    expect(getByTestId('a')).toBeTruthy();
    expect(getByTestId('b')).toBeTruthy();
  });
});
