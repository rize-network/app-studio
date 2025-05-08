import React from 'react';
import { Element } from '../element/Element';

const LowercaseVendorPrefixTest = () => {
  return (
    <Element padding={20}>
      <h1>Lowercase Vendor Prefix Test</h1>
      
      {/* Test lowercase webkit properties */}
      <Element 
        webkitBackgroundClip="text"
        webkitTextFillColor="transparent"
        background="linear-gradient(45deg, #ff0000, #0000ff)"
        fontSize={24}
        fontWeight="bold"
        marginBottom={20}
      >
        This text should have a gradient effect with transparent text fill
      </Element>
      
      {/* Test more lowercase webkit properties */}
      <Element 
        webkitUserSelect="none"
        webkitAppearance="none"
        webkitBoxShadow="0 0 10px rgba(0,0,0,0.5)"
        padding={15}
        backgroundColor="#f5f5f5"
        marginBottom={20}
      >
        This element has lowercase webkit properties applied
      </Element>
      
      {/* Test CSS Variables with lowercase webkit properties */}
      <Element 
        style={{
          "--gradient-colors": "linear-gradient(90deg, purple, orange)"
        }}
        marginBottom={20}
      >
        <Element
          webkitBackgroundClip="text"
          webkitTextFillColor="transparent"
          background="var(--gradient-colors)"
          fontSize={20}
          fontWeight="bold"
        >
          This text uses CSS variables with lowercase webkit properties
        </Element>
      </Element>
    </Element>
  );
};

export default LowercaseVendorPrefixTest;
