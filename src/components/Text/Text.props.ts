import { TextStyleProps } from '../../types/style';
import { ElementProps } from '../../element/Element';

export interface TextProps
  extends
    Omit<TextStyleProps, keyof ElementProps>,
    Omit<ElementProps, 'maxLines'> {
  children?: React.ReactNode;
  backgroundColor?: string;
  toUpperCase?: boolean;
  /**
   * Background color used to automatically compute a readable text color
   */
  bgColor?: string;
  isItalic?: boolean;
  isStriked?: boolean;
  isUnderlined?: boolean;
  isSub?: boolean;
  isSup?: boolean;
  maxLines?: number;
  /**
   * Shorthand for fontWeight; accepts numeric (100-900) or named weights
   * ("normal", "bold", "semibold", etc.). Convenience alias for the
   * underlying fontWeight CSS property.
   */
  weight?: string | number;
  /**
   * Optional style variant identifier. Free-form string used by component
   * wrappers and design systems to dispatch typography presets.
   */
  variant?: string;
  /**
   * Shorthand for fontSize; accepts numeric or named sizes (e.g. 'sm', 14, '14px').
   */
  size?: string | number;
  /**
   * Shorthand for letterSpacing; accepts numeric or named tracking values.
   */
  spacing?: string | number;
}
export interface ContentProps {
  children?: React.ReactNode;
  isSub?: boolean;
  isSup?: boolean;
}
export interface TruncateTextProps {
  text: string;
  maxLines?: number;
}
