import { CSSProperties, HTMLAttributes } from 'react';
import { AnimationProps } from '../utils/constants';
import { Shadow } from '../utils/shadow';
import { ViewStyleProps } from '../types/style';

export interface CssProps extends CSSProperties {
  paddingHorizontal?: number | string;
  marginHorizontal?: number | string;
  paddingVertical?: number | string;
  marginVertical?: number | string;
  animate?: AnimationProps[] | AnimationProps;
  animateIn?: AnimationProps[] | AnimationProps;
  animateOut?: AnimationProps[] | AnimationProps;
  animateOn?: 'View' | 'Mount' | 'Both' | 'Scroll';
  shadow?: boolean | number | Shadow;
  blend?: boolean;

  // Underscore-prefixed event props (alternative to using the 'on' prop)
  _hover?: CSSProperties | string;
  _active?: CSSProperties | string;
  _focus?: CSSProperties | string;
  _visited?: CSSProperties | string;
  _disabled?: CSSProperties | string;
  _enabled?: CSSProperties | string;
  _checked?: CSSProperties | string;
  _unchecked?: CSSProperties | string;
  _invalid?: CSSProperties | string;
  _valid?: CSSProperties | string;
  _required?: CSSProperties | string;
  _optional?: CSSProperties | string;
  _selected?: CSSProperties | string;
  _target?: CSSProperties | string;
  _firstChild?: CSSProperties | string;
  _lastChild?: CSSProperties | string;
  _onlyChild?: CSSProperties | string;
  _firstOfType?: CSSProperties | string;
  _lastOfType?: CSSProperties | string;
  _empty?: CSSProperties | string;
  _focusVisible?: CSSProperties | string;
  _focusWithin?: CSSProperties | string;
  _placeholder?: CSSProperties | string;

  // Group modifiers
  _groupHover?: CSSProperties | string;
  _groupFocus?: CSSProperties | string;
  _groupActive?: CSSProperties | string;
  _groupDisabled?: CSSProperties | string;

  // Peer modifiers
  _peerHover?: CSSProperties | string;
  _peerFocus?: CSSProperties | string;
  _peerActive?: CSSProperties | string;
  _peerDisabled?: CSSProperties | string;
  _peerChecked?: CSSProperties | string;

  // Pseudo-element props
  _before?: CSSProperties;
  _after?: CSSProperties;
  _firstLetter?: CSSProperties;
  _firstLine?: CSSProperties;
  _selection?: CSSProperties;
  _backdrop?: CSSProperties;
  _marker?: CSSProperties;

  // Vendor specific
  WebkitUserDrag?: CSSProperties['userSelect']; // Using userSelect type as approximation or just string
  webkitUserDrag?: CSSProperties['userSelect'];
}

export interface ElementProps
  extends
    CssProps,
    Omit<
      ViewStyleProps,
      keyof HTMLAttributes<HTMLElement> | 'children' | 'style' | 'pointerEvents'
    >,
    Omit<
      HTMLAttributes<HTMLElement>,
      'color' | 'style' | 'content' | 'translate'
    > {
  // Event handling props
  on?: Record<string, CssProps>;
  media?: Record<string, CssProps>;
  only?: string[];
  css?: CSSProperties | any;
  onPress?: any;
  onClick?: any;
  className?: string;
  blend?: boolean;
  type?: string;

  as?: keyof JSX.IntrinsicElements;
  style?: CSSProperties;
  widthHeight?: number | string;
  children?: React.ReactNode;
  before?: React.ReactNode;
  after?: React.ReactNode;

  animateOn?: 'View' | 'Mount' | 'Both' | 'Scroll';

  // Underscore-prefixed event props (alternative to using the 'on' prop)
  _hover?: CssProps | string;
  _active?: CssProps | string;
  _focus?: CssProps | string;
  _visited?: CssProps | string;
  _disabled?: CssProps | string;
  _enabled?: CssProps | string;
  _checked?: CssProps | string;
  _unchecked?: CssProps | string;
  _invalid?: CssProps | string;
  _valid?: CssProps | string;
  _required?: CssProps | string;
  _optional?: CssProps | string;
  _selected?: CssProps | string;
  _target?: CssProps | string;
  _firstChild?: CssProps | string;
  _lastChild?: CssProps | string;
  _onlyChild?: CssProps | string;
  _firstOfType?: CssProps | string;
  _lastOfType?: CssProps | string;
  _empty?: CssProps | string;
  _focusVisible?: CssProps | string;
  _focusWithin?: CssProps | string;
  _placeholder?: CssProps | string;

  // Group modifiers
  _groupHover?: CssProps | string;
  _groupFocus?: CssProps | string;
  _groupActive?: CssProps | string;
  _groupDisabled?: CssProps | string;

  // Peer modifiers
  _peerHover?: CssProps | string;
  _peerFocus?: CssProps | string;
  _peerActive?: CssProps | string;
  _peerDisabled?: CssProps | string;
  _peerChecked?: CssProps | string;

  // Pseudo-element props
  _before?: CssProps;
  _after?: CssProps;
  _firstLetter?: CssProps;
  _firstLine?: CssProps;
  _selection?: CssProps;
  _backdrop?: CssProps;
  _marker?: CssProps;
}
