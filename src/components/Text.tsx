import React from 'react';

import { TextProps } from './Text/Text.props';
import TextView from './Text/Text.view';
const TextComponent: React.FC<TextProps & any> = (props) => {
  return <TextView {...props} />;
};

/**
 * The Text component is a simple component that renders a text string or paragraphs as a DOM element in the UI. It is a <p> tag by default.
 */
export const Text = TextComponent;
