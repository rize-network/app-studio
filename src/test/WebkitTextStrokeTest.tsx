import React from 'react';
import { Element } from '../element/Element';

const WebkitTextStrokeTest = () => {
  return (
    <Element padding={20}>
      <h1>WebKit Text Stroke Test</h1>

      {/* Test WebKit text stroke property */}
      <Element
        WebkitTextStroke="1px #000000"
        fontSize={36}
        fontWeight="bold"
        color="transparent"
        marginBottom={20}
      >
        This text should have a 1px black stroke
      </Element>

      {/* Test lowercase webkit text stroke property */}
      <Element
        {...({
          webkitTextStroke: '2px #ff0000',
        } as any)}
        fontSize={36}
        fontWeight="bold"
        color="transparent"
        marginBottom={20}
      >
        This text should have a 2px red stroke
      </Element>

      {/* Test with separate width and color properties */}
      <Element
        WebkitTextStrokeWidth="3px"
        WebkitTextStrokeColor="#0000ff"
        fontSize={36}
        fontWeight="bold"
        color="transparent"
        marginBottom={20}
      >
        This text should have a 3px blue stroke
      </Element>

      {/* Test with lowercase separate width and color properties */}
      <Element
        {...({
          webkitTextStrokeWidth: '3px',
          webkitTextStrokeColor: '#00ff00',
        } as any)}
        fontSize={36}
        fontWeight="bold"
        color="transparent"
        marginBottom={20}
      >
        This text should have a 3px green stroke
      </Element>
    </Element>
  );
};

export default WebkitTextStrokeTest;
