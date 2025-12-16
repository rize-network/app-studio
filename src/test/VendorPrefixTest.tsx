import React from 'react';
import { Element } from '../element/Element';

const VendorPrefixTest = () => {
  return (
    <Element>
      <h1>Vendor Prefix and CSS Variables Test</h1>

      {/* Test WebKit properties */}
      <Element
        WebkitUserSelect="none"
        WebkitAppearance="none"
        WebkitTextFillColor="red"
        WebkitBoxShadow="0 0 10px rgba(0,0,0,0.5)"
        marginBottom={20}
      >
        This element has WebKit vendor prefixes applied
      </Element>

      {/* Test Mozilla properties */}
      <Element
        MozUserSelect="none"
        MozAppearance="none"
        MozBoxShadow="0 0 10px rgba(0,0,0,0.5)"
        marginBottom={20}
      >
        This element has Mozilla vendor prefixes applied
      </Element>

      {/* Test Microsoft properties */}
      <Element msUserSelect="none" marginBottom={20}>
        This element has Microsoft vendor prefixes applied
      </Element>

      {/* Test CSS Variables */}
      <Element
        style={
          {
            '--custom-color': 'purple',
            '--custom-padding': '15px',
            '--custom-border': '2px solid blue',
          } as React.CSSProperties
        }
        marginBottom={20}
      >
        <Element
          color="var(--custom-color)"
          padding="var(--custom-padding)"
          border="var(--custom-border)"
        >
          This element uses CSS variables
        </Element>
      </Element>

      {/* Test CSS Variables as direct props */}
      <Element
        css={
          {
            '--test-color': 'green',
            '--test-margin': '25px',
          } as any
        }
        marginBottom={20}
      >
        <Element color="var(--test-color)" margin="var(--test-margin)">
          This element uses CSS variables defined as direct props
        </Element>
      </Element>
    </Element>
  );
};

export default VendorPrefixTest;
