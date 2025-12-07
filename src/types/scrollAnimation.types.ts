/**
 * Types for CSS scroll-driven view() timeline animations
 * These enable performant animations without JavaScript state
 */

/** Animation range when element enters/exits viewport */
export type ViewAnimationRange =
  | 'entry' // Animate as element enters viewport
  | 'exit' // Animate as element exits viewport
  | 'cover' // Animate while element covers viewport
  | 'contain' // Animate while element is fully contained
  | `entry ${string}` // Custom entry range (e.g., 'entry 0% entry 100%')
  | `exit ${string}` // Custom exit range
  | `cover ${string}` // Custom cover range
  | string; // Any custom range

/** Timing function options */
export type ViewAnimationTimingFunction =
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | string;

/** Fill mode options */
export type ViewAnimationFillMode = 'none' | 'forwards' | 'backwards' | 'both';

/**
 * JSON configuration for view-based scroll animations
 *
 * @example
 * const fadeInConfig: ViewAnimationConfig = {
 *   keyframes: {
 *     from: { opacity: 0 },
 *     to: { opacity: 1 }
 *   },
 *   timing: { duration: '0.5s', timingFunction: 'ease' },
 *   range: 'entry'
 * };
 */
export interface ViewAnimationConfig {
  /** Keyframes: CSS properties at different animation points */
  keyframes: {
    from?: Record<string, string | number>;
    to?: Record<string, string | number>;
    [percentage: string]: Record<string, string | number> | undefined;
  };

  /** Animation timing configuration */
  timing?: {
    duration?: string;
    timingFunction?: ViewAnimationTimingFunction;
    fillMode?: ViewAnimationFillMode;
    delay?: string;
  };

  /** When to animate relative to viewport */
  range?: ViewAnimationRange;

  /** Respect prefers-reduced-motion media query */
  respectReducedMotion?: boolean;
}

/**
 * Options for view animation preset functions
 */
export interface ViewAnimationOptions {
  duration?: string;
  timingFunction?: ViewAnimationTimingFunction;
  range?: ViewAnimationRange;
  delay?: string;
}

/**
 * Options for slide animations
 */
export interface SlideAnimationOptions extends ViewAnimationOptions {
  distance?: string;
}

/**
 * Options for scale animations
 */
export interface ScaleAnimationOptions extends ViewAnimationOptions {
  scale?: number;
}

/**
 * Options for blur animations
 */
export interface BlurAnimationOptions extends ViewAnimationOptions {
  blur?: string;
}

/**
 * Options for rotate animations
 */
export interface RotateAnimationOptions extends ViewAnimationOptions {
  angle?: string;
}
