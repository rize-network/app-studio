/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
// Element.tsx
import React, { CSSProperties, useMemo } from 'react';
import { useTheme } from '../providers/Theme';
import { useResponsiveContext } from '../providers/Responsive';

import { isStyleProp } from '../utils/style';
import { AnimationProps, excludedKeys, includeKeys } from '../utils/constants';
import { extractUtilityClasses } from '../utils/cssClass';
import { Shadow } from '../utils/shadow';

export interface ElementProps extends CssProps {
  on?: Record<string, CssProps>;
  media?: Record<string, CssProps>;
  only?: string[];
  css?: CSSProperties;
}

export interface CssProps {
  children?: React.ReactNode;
  size?: number | string;
  paddingHorizontal?: number | string;
  marginHorizontal?: number | string;
  paddingVertical?: number | string;
  marginVertical?: number | string;
  shadow?: boolean | number | Shadow;
  style?: CSSProperties;
  animate?: AnimationProps;
  onPress?: () => void;
  as?: keyof JSX.IntrinsicElements;
  [key: string]: any;
}

export const Element: React.FC<ElementProps> = React.memo((props) => {
  const { onPress, ...rest } = props;
  const { getColor } = useTheme();
  const { mediaQueries, devices } = useResponsiveContext();

  // Extraire les classes utilitaires
  const utilityClasses = useMemo(
    () => extractUtilityClasses(rest, getColor, mediaQueries, devices),
    [rest, getColor, mediaQueries, devices]
  );

  // Gérer les événements
  const newProps: any = {};
  if (onPress) {
    newProps.onClick = onPress;
  }

  // Ajouter les classes utilitaires
  if (utilityClasses.length > 0) {
    newProps.className = utilityClasses.join(' ');
  }

  // Ajouter le reste des props qui ne sont pas des styles
  const { style, children, ...otherProps } = rest;
  Object.keys(otherProps).forEach((key) => {
    if ((!excludedKeys.has(key) && !isStyleProp(key)) || includeKeys.has(key)) {
      newProps[key] = otherProps[key];
    }
  });

  // Ajouter les styles inline s'il y en a
  if (style) {
    newProps.style = style;
  }

  // Définir le composant HTML
  const Component = newProps.as || 'div';
  delete newProps.as;

  return <Component {...newProps}>{children}</Component>;
});
