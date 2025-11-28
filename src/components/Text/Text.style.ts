/**
 * Text Styles
 *
 * Defines the styles for the Text component following the design guidelines:
 * - Typography: Inter/Geist font, specific sizes/weights
 * - Spacing: 4px grid system
 * - Colors: Neutral palette with semantic colors
 */

import { ViewProps } from '../View';
import { Headings, Size, TextWeights } from './Text.type';

/**
 * Heading sizes following typography guidelines
 * Matching shadcn/ui typography patterns
 */
export const HeadingSizes: Record<Headings, ViewProps> = {
  h1: {
    fontSize: '36px', // 2.25rem
    lineHeight: '40px', // 2.5rem
    fontWeight: '700', // Bold
    letterSpacing: '-0.02em',
    marginBottom: '24px',
    transition: 'color 0.15s ease',
  },
  h2: {
    fontSize: '30px', // 1.875rem
    lineHeight: '36px', // 2.25rem
    fontWeight: '700', // Bold
    letterSpacing: '-0.02em',
    marginBottom: '20px', // 5 × 4px grid
    transition: 'color 0.15s ease',
  },
  h3: {
    fontSize: '24px', // 1.5rem
    lineHeight: '32px', // 2rem
    fontWeight: '600', // Semi-bold
    letterSpacing: '-0.01em',
    marginBottom: '16px', // 4 × 4px grid
    transition: 'color 0.15s ease',
  },
  h4: {
    fontSize: '20px', // 1.25rem
    lineHeight: '28px', // 1.75rem
    fontWeight: '600', // Semi-bold
    letterSpacing: '-0.01em',
    marginBottom: '16px', // 4 × 4px grid
    transition: 'color 0.15s ease',
  },
  h5: {
    fontSize: '18px', // 1.125rem
    lineHeight: '24px', // 1.5rem
    fontWeight: '600', // Semi-bold
    letterSpacing: '-0.01em',
    marginBottom: '12px', // 3 × 4px grid
    transition: 'color 0.15s ease',
  },
  h6: {
    fontSize: '16px', // 1rem
    lineHeight: '24px', // 1.5rem
    fontWeight: '600', // Semi-bold
    letterSpacing: '-0.01em',
    marginBottom: '8px', // 2 × 4px grid
    transition: 'color 0.15s ease',
  },
};

/**
 * Font sizes following typography guidelines
 */
export const FontSizes: Record<Size, string> = {
  xs: '10px', // Harmonized font size
  sm: '12px', // Harmonized font size
  md: '14px', // Harmonized font size
  lg: '16px', // Harmonized font size
  xl: '20px', // Harmonized font size
};

/**
 * Line heights following typography guidelines
 */
export const LineHeights: Record<Size, string> = {
  xs: '14px', // Adjusted for 10px font
  sm: '16px', // Adjusted for 12px font
  md: '20px', // Adjusted for 14px font
  lg: '22px', // Adjusted for 16px font
  xl: '28px', // Adjusted for 20px font
};

/**
 * Font weights following typography guidelines
 */
export const FontWeights: Record<TextWeights, string> = {
  hairline: '100',
  thin: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
  black: '900',
};
