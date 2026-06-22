/**
 * Text View Component
 *
 * Renders text with various styles and states according to the design guidelines.
 */

import React from 'react';

import { TextProps } from './Text.props';

import { View, ViewProps } from '../View';

import { Element } from '../../element/Element';
import { Typography } from '../../utils/typography';

// Heading presets (h1–h6) mapped to a font-size / weight / unitless line-height
// scale. `lineHeight` is a string so it stays a unitless multiplier — numeric
// fractional line-heights would be turned into pixels.
const HEADING_PRESETS: Record<
  string,
  { fontSize: number; fontWeight: number; lineHeight: string; as: string }
> = {
  h1: { fontSize: 36, fontWeight: 700, lineHeight: '1.2', as: 'h1' },
  h2: { fontSize: 30, fontWeight: 700, lineHeight: '1.25', as: 'h2' },
  h3: { fontSize: 24, fontWeight: 600, lineHeight: '1.3', as: 'h3' },
  h4: { fontSize: 20, fontWeight: 600, lineHeight: '1.35', as: 'h4' },
  h5: { fontSize: 16, fontWeight: 600, lineHeight: '1.4', as: 'h5' },
  h6: { fontSize: 14, fontWeight: 600, lineHeight: '1.4', as: 'h6' },
};

interface Props extends TextProps {
  views?: {
    container?: ViewProps;
    sup?: ViewProps;
  };
  bgColor?: string;
}

/**
 * Main Text component that renders text with various styles and states
 */
const TextView = React.forwardRef<HTMLElement, Props>(
  (
    {
      children,
      maxLines,
      isItalic = false,
      isUnderlined = false,
      toUpperCase = false,
      isSub = false,
      isSup = false,
      isStriked = false,
      heading,
      size,
      weight,
      spacing,
      views,
      style,
      ...props
    },
    ref
  ) => {
    // console.log('props', props, children);
    // For sub/sup text, use inline display
    const noLineBreak = isSub || isSup ? { display: 'inline' } : {};

    // Resolve the typography shorthands (heading / size / weight / spacing) to
    // real style props using the design-system tokens. Explicit fontSize /
    // fontWeight / letterSpacing props still win because `...props` is spread
    // after these in `commonProps`.
    const headingPreset = heading ? HEADING_PRESETS[heading] : undefined;
    const typographyStyles: Record<string, any> = {};
    if (headingPreset) {
      typographyStyles.fontSize = headingPreset.fontSize;
      typographyStyles.fontWeight = headingPreset.fontWeight;
      typographyStyles.lineHeight = headingPreset.lineHeight;
    }
    if (size != null) {
      typographyStyles.fontSize =
        Typography.fontSizes[size as keyof typeof Typography.fontSizes] ?? size;
    }
    if (weight != null) {
      typographyStyles.fontWeight =
        Typography.fontWeights[weight as keyof typeof Typography.fontWeights] ??
        weight;
    }
    if (spacing != null) {
      typographyStyles.letterSpacing =
        Typography.letterSpacings[
          spacing as keyof typeof Typography.letterSpacings
        ] ?? spacing;
    }

    const finalChildren = toUpperCase
      ? React.Children.map(children, (child) =>
          typeof child === 'string' ? child.toUpperCase() : child
        )
      : children;

    const styles: React.CSSProperties = {
      ...(style as React.CSSProperties),
      ...(maxLines
        ? {
            display: '-webkit-box',
            WebkitLineClamp: maxLines,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }
        : {}),
    };

    // Common props
    const commonProps = {
      as: (headingPreset
        ? headingPreset.as
        : isSub
          ? 'sub'
          : isSup
            ? 'sup'
            : 'span') as keyof React.JSX.IntrinsicElements,
      fontStyle: isItalic ? 'italic' : 'normal',
      textDecoration: isStriked
        ? 'line-through'
        : isUnderlined
          ? 'underline'
          : 'none',
      ...typographyStyles,
      style: styles,
      ...noLineBreak,
      ...props,
      ...views?.container,
    };

    if (isSub || isSup) {
      return (
        <View
          {...commonProps}
          ref={ref}
          as={isSub ? 'sub' : 'sup'}
          fontSize="75%"
          lineHeight="0"
          position="relative"
          bottom={isSub ? '-0.25em' : undefined}
          top={isSup ? '-0.5em' : undefined}
          {...views?.sup}
        >
          {finalChildren}
        </View>
      );
    }

    // console.log('commonProps', commonProps, children);

    return (
      <Element {...commonProps} ref={ref}>
        {finalChildren}
      </Element>
    );
  }
);

export default TextView;
