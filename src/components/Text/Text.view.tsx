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

interface ContentProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  isSub?: boolean;
  isSup?: boolean;
  views?: {
    sup?: ViewProps;
  };
}

interface TruncateTextProps extends React.HTMLAttributes<HTMLDivElement> {
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
}) => (
  <>
    {typeof children === 'string' ? (
      <>
        {isSub && (
          <View
            as="sub"
            fontSize="75%"
            lineHeight="0"
            position="relative"
            bottom="-0.25em"
            {...views?.sup}
          >
            {children}
          </View>
        )}
        {isSup && (
          <View
            as="sup"
            fontSize="75%"
            lineHeight="0"
            position="relative"
            top="-0.5em"
            {...views?.sup}
          >
            {children}
          </View>
        )}
        {!isSub && !isSup && <>{children}</>}
      </>
    ) : (
      children
    )}
  </>
);

// Keep the interface
interface TruncateTextProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  maxLines?: number;
  views?: {
    truncateText?: ViewProps;
  };
}

/**
 * Renders text with truncation after a specified number of lines (JS calculation)
 */
const TruncateText: React.FC<TruncateTextProps> = ({
  text,
  maxLines = 1,
  views,
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

  return (
    <Element as="span"
      ref={containerRef}
      overflow="hidden" // Crucial for final display state
      {...views?.truncateText}
      {...rest} // Spread remaining props
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

  return (
    <Element
      // Apply typography styles according to design guidelines
      fontSize={fontSize}
      lineHeight={lineHeight}
      fontStyle={isItalic ? 'italic' : 'normal'}
      fontWeight={fontWeight}
      letterSpacing="-0.01em"
      textDecoration={
        isStriked ? 'line-through' : isUnderlined ? 'underline' : 'none'
      }
      color={computedColor}
      backgroundColor={effectiveBackgroundColor}
      // Apply layout styles
      {...noLineBreak}
      // Apply heading styles if specified
      {...headingStyles}
      // Apply any custom props
      {...props}
      // Apply custom container styles
      {...views?.container}
    >
      {maxLines && typeof children === 'string' ? (
        <TruncateText text={children} maxLines={maxLines} />
      ) : (
        <TextContent isSub={isSub} isSup={isSup}>
          {children}
        </TextContent>
      )}
    </Element>
  );
};

export default TextView;
