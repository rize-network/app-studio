import React from 'react';
import { Element } from '../element/Element';

const CssVariablesTest = () => {
  return (
    <Element padding={20}>
      <h1>CSS Variables Test</h1>
      
      {/* Test CSS Variables with direct style prop */}
      <Element 
        style={{
          "--primary-color": "blue",
          "--primary-bg": "lightblue",
          "--spacing": "15px"
        }}
        marginBottom={20}
        padding={20}
        backgroundColor="var(--primary-bg)"
        border="1px solid var(--primary-color)"
      >
        <Element color="var(--primary-color)" padding="var(--spacing)">
          This element uses CSS variables from parent's style prop
        </Element>
      </Element>
      
      {/* Test CSS Variables with css prop */}
      <Element
        css={{
          "--secondary-color": "green",
          "--secondary-bg": "lightgreen",
          "--border-radius": "8px"
        }}
        marginBottom={20}
        padding={20}
        backgroundColor="var(--secondary-bg)"
        borderRadius="var(--border-radius)"
      >
        <Element color="var(--secondary-color)" padding={10}>
          This element uses CSS variables from parent's css prop
        </Element>
      </Element>
    </Element>
  );
};

export default CssVariablesTest;
