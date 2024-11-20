import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View } from './View';
import { Text } from './Text';
import { typewriter, blinkCursor } from './Animation';

interface TypewriterProps {
  text: string;
  duration?: string;
  cursorDuration?: string;
  cursorTimingFunction?: string;
  color?: string;
  fontSize?: number;
  width?: number;
  cursor: boolean;
  style?: React.CSSProperties;
}

interface LineMetrics {
  text: string;
  width: number;
}

export const Typewriter: React.FC<TypewriterProps> = ({
  text,
  duration = '10s',
  cursorDuration = '0.75s',
  cursorTimingFunction = 'step-end',
  color = 'black',
  cursor = true,
  fontSize = 18,
  width = 100,
  ...props
}) => {
  const [visibleLines, setVisibleLines] = useState<LineMetrics[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  // Calculate milliseconds once
  const durationMs = useMemo(
    () => parseFloat(duration.replace('s', '')) * 1000,
    [duration]
  );

  // Split text into lines with width calculation
  const lines = useMemo(() => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return [];

    context.font = `${fontSize}px sans-serif`;

    const words = text.split(' ');
    const result: LineMetrics[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = context.measureText(testLine);

      if (metrics.width > width && currentLine) {
        const currentMetrics = context.measureText(currentLine);
        result.push({
          text: currentLine,
          width: currentMetrics.width,
        });
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      const finalMetrics = context.measureText(currentLine);
      result.push({
        text: currentLine,
        width: finalMetrics.width,
      });
    }

    return result;
  }, [text, width, fontSize]);

  // Handle animation timing
  useEffect(() => {
    if (!lines.length) return;
    setVisibleLines([]);
    setIsComplete(false);

    const timeoutIds: NodeJS.Timeout[] = [];
    const perLineDuration = durationMs / lines.length;

    lines.forEach((line, index) => {
      const timeoutId = setTimeout(() => {
        setVisibleLines((prev) => {
          const newLines = [...prev, line];
          // Set complete when all lines are visible
          if (newLines.length === lines.length) {
            // Add small delay to ensure the last line's animation is complete
            setTimeout(
              () => setIsComplete(true),
              parseFloat(getLineAnimation(line).duration)
            );
          }
          return newLines;
        });
      }, perLineDuration * index);

      timeoutIds.push(timeoutId);
    });

    return () => {
      timeoutIds.forEach(clearTimeout);
      setIsComplete(false);
    };
  }, [lines, durationMs]);

  // Calculate animation parameters
  const getLineAnimation = useCallback(
    (line: LineMetrics) => {
      const perCharDuration = durationMs / text.length;
      const lineDuration = `${line.text.length * perCharDuration}ms`;

      return {
        duration: lineDuration,
        width: line.width,
      };
    },
    [durationMs, text.length]
  );

  if (!lines.length) return null;

  return (
    <View width={width}>
      {visibleLines.map((line, index) => {
        const animation = getLineAnimation(line);
        const isLastLine = index === visibleLines.length - 1;

        return (
          <View key={`line-${index}`} display="flex" alignItems="center">
            <Text
              display="inline-block"
              overflow="hidden"
              whiteSpace="nowrap"
              animate={typewriter({
                duration: animation.duration,
                steps: line.text.length,
                width: animation.width,
              })}
              {...props}
            >
              {line.text}
            </Text>
            {cursor && isLastLine && !isComplete && (
              <Text
                paddingLeft={4}
                display="inline-block"
                animate={blinkCursor({
                  duration: cursorDuration,
                  timingFunction: cursorTimingFunction,
                  color,
                })}
              >
                |
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
};
