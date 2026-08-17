import { TextProps } from '../Text/Text.props';

export interface TypewriterProps extends Omit<TextProps, 'children'> {
  /**
   * The text to type out. Pass a single string for one paragraph, or an array
   * of strings to type several paragraphs sequentially (one after another).
   */
  text: string | string[];
  /** Milliseconds spent typing each character. Default `50`. */
  typingSpeed?: number;
  /** Milliseconds paused between two paragraphs. Default `600`. */
  pauseTime?: number;
  /**
   * Vertical spacing applied between paragraphs. Accepts a number (px) or any
   * CSS length. Default `8`.
   */
  paragraphGap?: number | string;
  /**
   * Character used to force a line break *inside* a single paragraph.
   * Default `'|'`.
   */
  lineBreakChar?: string;
  /** Restart the animation once the last paragraph finishes. Default `false`. */
  loop?: boolean;
  /** Milliseconds paused before restarting when `loop` is enabled. Default `1500`. */
  loopDelay?: number;
  /** Show the blinking cursor while typing. Default `true`. */
  showCursor?: boolean;
  /** Color of the blinking cursor. Default `'currentColor'`. */
  cursorColor?: string;
  /** Fired once every paragraph has been typed (not called between loops). */
  onComplete?: () => void;
}
