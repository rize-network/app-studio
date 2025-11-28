/**
 * Text View Component
 *
 * Renders text with various styles and states according to the design guidelines.
 */

import React, { useEffect, useRef, useState } from 'react';

import { TextProps } from './Text.props';
import {
  HeadingSizes,
  FontSizes,
  LineHeights,
  FontWeights,
} from './Text.style';
import { getTextColor } from './Text.utils';
import { View, ViewProps } from '../View';

import { Element } from '../../element/Element';

interface Props extends TextProps {
  views?: {
    container?: ViewProps;
  };
  bgColor?: string;
}

interface ContentProps extends Omit<TextProps, 'translate' | 'rel'> {
  isSub?: boolean;
  isSup?: boolean;
  views?: {
    sup?: ViewProps;
  };
}

interface TruncateTextProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'translate' | 'rel'> {
  text: string;
  maxLines?: number;
  views?: {
    truncateText?: ViewProps;
  };
}

/**
 * Renders text content with support for subscript and superscript
 */
const TextContent: React.FC<ContentProps> = ({
  children,
  isSub,
  isSup,
  views,
  ...props
}) =>
  isSub ? (
    <View
      as="sub"
      {...views?.sup}
      fontSize="75%"
      lineHeight="0"
      position="relative"
      bottom="-0.25em"
    >
      {children}
    </View>
  ) : isSup ? (
    <View
      as="sup"
      {...views?.sup}
      fontSize="75%"
      lineHeight="0"
      position="relative"
      top="-0.5em"
    >
      {children}
    </View>
  ) : (
    <Element {...props}>{children}</Element>
  );

/**
 * Renders text with truncation after a specified number of lines (JS calculation)
 */
const TruncateText: React.FC<TruncateTextProps & TextProps> = ({
  text,
  maxLines = 1,
  views,
  isSub,
  isSup,
  ...rest // Pass down other HTML attributes
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [truncatedText, setTruncatedText] = useState(text);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || !text || maxLines <= 0) {
      setTruncatedText(text ?? '');
      setIsTruncated(false);
      return;
    }

    const { overflow, height, maxHeight, lineHeight } = node.style;

    node.style.overflow = 'visible';
    node.style.height = 'auto';
    node.style.maxHeight = 'none';

    node.innerText = text[0] || 'M';
    let singleLine = node.offsetHeight;
    if (!singleLine) {
      const cs = getComputedStyle(node);
      singleLine =
        cs.lineHeight !== 'normal'
          ? parseFloat(cs.lineHeight)
          : parseFloat(cs.fontSize || '16') * 1.2;
    }

    const limit = singleLine * maxLines;

    node.innerText = text;
    if (node.offsetHeight <= limit) {
      setTruncatedText(text);
      setIsTruncated(false);
      restore(node);
      return;
    }

    let lo = 0;
    let hi = text.length;
    let fit = 0;

    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      node.innerText = text.slice(0, mid);
      if (node.offsetHeight <= limit) {
        fit = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }

    const finalText =
      fit < text.length
        ? text.slice(0, text.length > fit + 3 ? fit - 3 : fit).trimEnd() + '…'
        : text;
    setTruncatedText(finalText);
    setIsTruncated(fit < text.length);
    restore(node);

    function restore(n: HTMLDivElement) {
      n.style.overflow = overflow;
      n.style.height = height;
      n.style.maxHeight = maxHeight;
      n.style.lineHeight = lineHeight;
    }
  }, [text, maxLines]);

  const subSupProps = isSub
    ? {
        as: 'sub' as const,
        fontSize: '75%',
        lineHeight: '0',
        position: 'relative',
        bottom: '-0.25em',
      }
    : isSup
    ? {
        as: 'sup' as const,
        fontSize: '75%',
        lineHeight: '0',
        position: 'relative',
        top: '-0.5em',
      }
    : {};

  return (
    <Element
      as="span"
      ref={containerRef}
      overflow="hidden" // Crucial for final display state
      {...rest} // Spread remaining props
      {...subSupProps}
      {...views?.truncateText}
      // Add title attribute for accessibility/hover to see full text
      title={isTruncated ? text : undefined}
    >
      {/* Render the text from state */}
      {truncatedText}
    </Element>
  );
};

/**
 * Main Text component that renders text with various styles and states
 */
const TextView: React.FC<Props> = ({
  children,
  heading,
  maxLines,
  isItalic = false,
  isUnderlined = false,
  toUpperCase = false,
  isSub = false,
  isSup = false,
  isStriked = false,
  weight = 'normal',
  size = 'md',
  bgColor,
  backgroundColor: backgroundColorProp,
  color,
  views,
  blend,
  ...props
}) => {
  // Apply heading styles if a heading is specified
  const headingStyles = heading ? HeadingSizes[heading] : {};

  // For sub/sup text, use inline display
  const noLineBreak = isSub || isSup ? { display: 'inline' } : {};

  // Get font size, line height, and weight from our design system
  const fontSize = FontSizes[size];
  const lineHeight = LineHeights[size];
  const fontWeight = FontWeights[weight];

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

  children =
    toUpperCase && typeof children === 'string'
      ? children.toUpperCase()
      : children;

  // Common props for both TruncateText and standard Element
  const commonProps = {
    as: 'span' as const,
    fontSize,
    lineHeight,
    fontStyle: isItalic ? 'italic' : 'normal',
    fontWeight,
    textDecoration: isStriked
      ? 'line-through'
      : isUnderlined
      ? 'underline'
      : 'none',
    color: computedColor,
    maxLines,
    blend,
    backgroundColor: effectiveBackgroundColor,
    ...noLineBreak,
    ...headingStyles,
    ...props,
    ...views?.container,
  };

  children =
    toUpperCase && typeof children === 'string'
      ? children.toUpperCase()
      : children;

  return maxLines && typeof children === 'string' ? (
    <TruncateText
      isSub={isSub}
      isSup={isSup}
      {...commonProps}
      text={children as string}
      maxLines={maxLines}
    />
  ) : (
    <TextContent isSub={isSub} isSup={isSup} {...commonProps}>
      {children}
    </TextContent>
  );
};

export default TextView;
