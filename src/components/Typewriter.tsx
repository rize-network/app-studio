// Typewriter.tsx

import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { View } from './View'; // Assurez-vous d'importer correctement votre composant View
import { Text } from './Text'; // Assurez-vous d'importer correctement votre composant Text
import { typewriter, blinkCursor } from './Animation';

interface TypewriterProps {
  text: string;
  duration?: string;
  timingFunction?: string;
  cursorDuration?: string;
  cursorTimingFunction?: string;
  color?: string;
  fontSize?: number | string;
}

export const Typewriter: React.FC<TypewriterProps & CSSProperties> = ({
  text,
  duration = '5s',
  cursorDuration = '0.75s',
  cursorTimingFunction = 'step-end',
  color = 'black',
  fontSize = 16,
  ...props
}) => {
  const [dimension, setDimension] = useState<{ width: number; height: number }>(
    {
      width: 0,
      height: 0,
    }
  );
  const hiddenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hiddenRef.current) {
      const measuredWidth = hiddenRef.current.offsetWidth;
      const measuredHeight = hiddenRef.current.offsetHeight;
      if (measuredWidth > 0 && measuredHeight > 0)
        setDimension({
          width: measuredWidth,
          height: measuredHeight,
        });
      console.log('Typewriter render', measuredWidth, measuredHeight);
    }
  }, [text]);

  const steps = text.length;

  return (
    <View {...props} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Texte caché pour mesurer les dimensions */}
      <span
        ref={hiddenRef}
        style={{
          visibility: 'hidden',
          fontSize,
        }}
      >
        {text}
      </span>

      {dimension.width > 0 && (
        <View>
          <Text
            overflow="hidden"
            animate={typewriter({
              duration,
              steps,
              width: 50,
            })}
            fontSize={fontSize}
            color={color}
          >
            {text}
          </Text>
          <Text
            fontSize={fontSize}
            color={color}
            // Position du curseur à la fin du texte
            bottom={0}
            left={0}
            animate={blinkCursor({
              duration: cursorDuration,
              timingFunction: cursorTimingFunction,
              color,
            })}
          >
            |
          </Text>
        </View>
      )}
    </View>
  );
};
