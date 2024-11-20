// Typewriter.tsx

import React, { CSSProperties, useEffect } from 'react';
import { View } from './View'; // Assurez-vous d'importer correctement votre composant View
import { Text } from './Text'; // Assurez-vous d'importer correctement votre composant Text
import { typewriter, blinkCursor } from './Animation';

interface TypewriterProps {
  text: string;
  duration?: string;
  timingFunction?: string;
  cursorDuration?: string;
  cursorTimingFunction?: string;
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
  const [dimension, setDimension]: any = React.useState<number>({
    width: 0,
    height: 0,
  });
  const hiddenRef = React.useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (hiddenRef.current) {
      const measuredWidth = hiddenRef.current.offsetWidth;
      if (measuredWidth > 0)
        setDimension({
          width: measuredWidth,
          height: hiddenRef.current.offsetHeight,
        });
      console.log('Typewriter render', measuredWidth);
    }
  }, [text]);

  return (
    <View {...props}>
      {/* Texte caché pour mesurer la largeur */}
      <span
        ref={hiddenRef}
        style={{
          visibility: 'hidden',
          position: 'absolute',
          top: 0,
          left: 0,
          width: 100,
        }}
      >
        {text}
      </span>

      {dimension.width > 0 && (
        <View
          display="inline-block"
          overflow="hidden"
          whiteSpace="nowrap"
          height={dimension.height}
          width={dimension.width}
        >
          <Text
            display="inline-block"
            overflow="hidden"
            animate={typewriter({
              duration,
              step: text.length,
              width: dimension.width,
            })}
          >
            {text}
          </Text>
          <Text
            marginLeft={4}
            width={10}
            lineHeight={fontSize}
            height={'100%'}
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
