import { TextHeadings, TextSize, TextWeights } from './Text.type';
import { TextStyleProps } from '../../types/style';
import { ElementProps } from '../../element/Element';

export interface TextProps
  extends Omit<
      TextStyleProps,
      | 'children'
      | 'style'
      | 'onPress'
      | 'pointerEvents'
      | 'onClick'
      | 'accessibilityRole'
      | 'accessibilityState'
    >,
    Omit<ElementProps, 'maxLines'> {
  children?: React.ReactNode;
  backgroundColor?: string;
  toUpperCase?: boolean;
  /**
   * Background color used to automatically compute a readable text color
   */
  bgColor?: string;
  heading?: TextHeadings;
  isItalic?: boolean;
  isStriked?: boolean;
  isUnderlined?: boolean;
  isSub?: boolean;
  isSup?: boolean;
  maxLines?: number;
  size?: TextSize;
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
