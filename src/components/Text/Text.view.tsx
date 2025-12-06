/**
 * Text View Component
 *
 * Renders text with various styles and states according to the design guidelines.
 */

import React from 'react';

import { TextProps } from './Text.props';

import { getTextColor } from './Text.utils';
import { View, ViewProps } from '../View';

import { Element } from '../../element/Element';

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
const TextView: React.FC<Props> = ({
  children,
  maxLines,
  isItalic = false,
  isUnderlined = false,
  toUpperCase = false,
  isSub = false,
  isSup = false,
  isStriked = false,
  bgColor,
  backgroundColor: backgroundColorProp,
  color,
  views,
  blend,
  style,
  ...props
}) => {
  // For sub/sup text, use inline display
  const noLineBreak = isSub || isSup ? { display: 'inline' } : {};
  //
  if (!color && blend !== false) blend = true;

  const containerBackgroundColor = views?.container?.backgroundColor as
    | string
    | undefined;
  const effectiveBackgroundColor =
    bgColor ?? backgroundColorProp ?? containerBackgroundColor;
  const computedColor =
    color ??
    (effectiveBackgroundColor
      ? getTextColor(effectiveBackgroundColor)
      : undefined);

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
    as: isSub ? 'sub' : isSup ? 'sup' : 'span',
    fontStyle: isItalic ? 'italic' : 'normal',
    textDecoration: isStriked
      ? 'line-through'
      : isUnderlined
      ? 'underline'
      : 'none',
    color: computedColor,
    blend,
    backgroundColor: effectiveBackgroundColor,
    style: styles,
    ...noLineBreak,
    ...props,
    ...views?.container,
  };

  if (isSub || isSup) {
    return (
      <View
        {...commonProps}
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

  return <Element {...commonProps}>{finalChildren}</Element>;
};

export default TextView;
