import { Headings, Size, TextWeights } from './Text.type';
import { TextStyleProps } from '../../types/style';
import { ElementProps } from '../../element/Element';


export interface TextProps
  extends Omit<TextStyleProps,   | 'children'
      | 'style'
      | 'onPress'
      | 'pointerEvents'
      | 'onClick'
      | 'accessibilityRole'
      | 'accessibilityState'>, ElementProps {
  children?: React.ReactNode;
  backgroundColor?: string;
  toUpperCase?: boolean;
  /**
   * Background color used to automatically compute a readable text color
   */
  bgColor?: string;
  heading?: Headings;
  isItalic?: boolean;
  isStriked?: boolean;
  isUnderlined?: boolean;
  isSub?: boolean;
  isSup?: boolean;
  maxLines?: number;
  size?: Size;
  weight?: TextWeights;
}
export interface ContentProps {
  children: React.ReactNode | string;
  isSub?: boolean;
  isSup?: boolean;
}
export interface TruncateTextProps {
  text: string;
  maxLines?: number;
}
