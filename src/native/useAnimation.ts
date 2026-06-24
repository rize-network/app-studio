/**
 * useAnimation (React Native) — interprets the CSS-shaped `AnimationProps`
 * objects produced by `app-studio`'s `Animation.*` factories (Animation.tsx)
 * and converts them into a Reanimated animated style.
 *
 * Design choices:
 *   - `react-native-reanimated` is an *optional* peer. If it isn't installed
 *     the hook returns a no-op (`{ style: undefined, AnimatedView: undefined }`)
 *     so the rest of the app keeps rendering as a static view.
 *   - We accept the SAME `AnimationProps` shape as the web side (from/to/
 *     duration string/timingFunction/iterationCount/delay/direction/keyframes)
 *     so authoring with `Animation.fadeIn()` works identically on both
 *     platforms.
 *   - Percentage translates (`translateX(-100%)`) are resolved against the
 *     window dimensions — good-enough for slide-in/out at the screen edge,
 *     and avoids needing onLayout.
 *   - Multi-stop keyframes (`{ from, '20%': …, '40%': …, to }`) are unrolled
 *     into a `withSequence` chain.
 */

import { useEffect } from 'react';
import { Dimensions, Pressable } from 'react-native';
import { AnimationProps } from '../utils/constants';

// Lazy-require so a missing peer doesn't throw at import.
let Reanimated: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Reanimated = require('react-native-reanimated');
} catch (e) {
  Reanimated = null;
  // Surface WHY it failed — swallowing this hid the real cause (e.g. a missing
  // worklets babel plugin or an interop mismatch) and made native animation
  // problems undiagnosable.
  // eslint-disable-next-line no-console
  console.warn('[app-studio] react-native-reanimated failed to load:', e);
}

// The animated-component factory lives on `.default` in some builds and at the
// top level in others — tolerate both.
const ReanimatedApi: any =
  Reanimated && Reanimated.default && Reanimated.default.createAnimatedComponent
    ? Reanimated.default
    : Reanimated;

// Treat reanimated as available ONLY if every API we actually use is present.
// A partial/untransformed module (worklets plugin didn't process this prebuilt
// code) would otherwise crash later with "undefined is not a function" inside a
// passive effect — far harder to diagnose than degrading to static here.
const HAS_REANIMATED = !!(
  ReanimatedApi &&
  typeof ReanimatedApi.createAnimatedComponent === 'function' &&
  typeof ReanimatedApi.useSharedValue === 'function' &&
  typeof ReanimatedApi.useAnimatedStyle === 'function' &&
  typeof ReanimatedApi.withTiming === 'function'
);

// Animated Pressable for the case where a host element is both animated AND
// touchable. Created once at module load.
const AnimatedPressable = HAS_REANIMATED
  ? ReanimatedApi.createAnimatedComponent(Pressable)
  : undefined;

// ---------- Parsers -----------------------------------------------------------

const parseDurationMs = (d?: string | number): number => {
  if (typeof d === 'number') return d;
  if (!d) return 300;
  const s = String(d).trim();
  if (s.endsWith('ms')) return parseFloat(s) || 300;
  if (s.endsWith('s')) return (parseFloat(s) || 0.3) * 1000;
  return parseFloat(s) || 300;
};

const easingFor = (timingFunction?: string): any => {
  if (!HAS_REANIMATED) return undefined;
  const { Easing } = ReanimatedApi;
  switch (timingFunction) {
    case 'linear':
      return Easing.linear;
    case 'ease':
      return Easing.bezier(0.25, 0.1, 0.25, 1);
    case 'ease-in':
      return Easing.in(Easing.ease);
    case 'ease-out':
      return Easing.out(Easing.ease);
    case 'ease-in-out':
      return Easing.inOut(Easing.ease);
    default: {
      if (
        typeof timingFunction === 'string' &&
        timingFunction.startsWith('cubic-bezier')
      ) {
        const m = timingFunction.match(
          /cubic-bezier\(\s*([\d.-]+)\s*,\s*([\d.-]+)\s*,\s*([\d.-]+)\s*,\s*([\d.-]+)\s*\)/
        );
        if (m) {
          return Easing.bezier(
            parseFloat(m[1]),
            parseFloat(m[2]),
            parseFloat(m[3]),
            parseFloat(m[4])
          );
        }
      }
      return Easing.bezier(0.25, 0.1, 0.25, 1);
    }
  }
};

// Read window dimensions at parse time (not a module-load snapshot) so
// percentage translates resolve against the CURRENT screen size — correct after
// rotation / entering split-view, rather than whatever orientation the module
// happened to load in.
const parseTransform = (
  value: string | undefined
): Array<Record<string, number | string>> => {
  if (!value || typeof value !== 'string') return [];
  const win = Dimensions.get('window');
  const out: Array<Record<string, number | string>> = [];
  const re =
    /(translateX|translateY|translate|scaleX|scaleY|scale|rotate|skewX|skewY)\(([^)]+)\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(value)) !== null) {
    const fn = m[1];
    const arg = m[2].trim();
    const resolvePct = (s: string, dim: number) => {
      const v = parseFloat(s);
      if (s.endsWith('%')) return (v / 100) * dim;
      return v;
    };
    switch (fn) {
      case 'translateX':
        out.push({ translateX: resolvePct(arg, win.width) });
        break;
      case 'translateY':
        out.push({ translateY: resolvePct(arg, win.height) });
        break;
      case 'translate': {
        const [x, y = '0'] = arg.split(',').map((p) => p.trim());
        out.push({ translateX: resolvePct(x, win.width) });
        out.push({ translateY: resolvePct(y, win.height) });
        break;
      }
      case 'scale':
        out.push({ scale: parseFloat(arg) });
        break;
      case 'scaleX':
        out.push({ scaleX: parseFloat(arg) });
        break;
      case 'scaleY':
        out.push({ scaleY: parseFloat(arg) });
        break;
      case 'rotate':
        out.push({ rotate: arg });
        break;
      case 'skewX':
        out.push({ skewX: arg });
        break;
      case 'skewY':
        out.push({ skewY: arg });
        break;
    }
  }
  return out;
};

// Reduce a single frame style object (e.g. `from` or a `20%` snapshot) to a
// flat `{opacity, translateX, translateY, scale, scaleX, scaleY, rotate, …}`
// representation. Unknown properties are passed through as-is so consumers can
// animate any RN-style property.
const reduceFrame = (frame: any): Record<string, any> => {
  if (!frame || typeof frame !== 'object') return {};
  const out: Record<string, any> = {};
  for (const key of Object.keys(frame)) {
    if (key === 'transform') {
      const items = parseTransform(frame[key]);
      for (const item of items) Object.assign(out, item);
    } else {
      out[key] = frame[key];
    }
  }
  return out;
};

// Extract keyframes in order. Returns [{stop: 0..1, frame}], at least 2 entries.
const extractKeyframes = (
  anim: AnimationProps
): Array<{ stop: number; frame: Record<string, any> }> => {
  const frames: Array<{ stop: number; frame: Record<string, any> }> = [];
  if (anim.from) frames.push({ stop: 0, frame: reduceFrame(anim.from) });
  for (const key of Object.keys(anim)) {
    const m = key.match(/^(\d+(?:\.\d+)?)\s*%$/);
    if (m) {
      frames.push({
        stop: parseFloat(m[1]) / 100,
        frame: reduceFrame((anim as any)[key]),
      });
    }
  }
  if (anim.to) frames.push({ stop: 1, frame: reduceFrame(anim.to) });
  frames.sort((a, b) => a.stop - b.stop);
  // Ensure at least two stops so animation has a direction.
  if (frames.length === 0) return [];
  if (frames.length === 1) {
    frames.unshift({ stop: 0, frame: frames[0].frame });
  }
  return frames;
};

// Collect every property name that appears in any keyframe — these are the
// ones we'll animate.
const collectAnimatedKeys = (
  frames: Array<{ stop: number; frame: Record<string, any> }>
): string[] => {
  const set = new Set<string>();
  for (const f of frames) for (const k of Object.keys(f.frame)) set.add(k);
  return Array.from(set);
};

// Initial value for an animated property — taken from the first frame that has
// it, with a sensible default per key.
const initialValueFor = (
  key: string,
  frames: Array<{ stop: number; frame: Record<string, any> }>
) => {
  for (const f of frames) {
    if (f.frame[key] !== undefined) return f.frame[key];
  }
  if (key === 'opacity') return 1;
  if (key === 'scale' || key === 'scaleX' || key === 'scaleY') return 1;
  if (key === 'translateX' || key === 'translateY') return 0;
  if (key === 'rotate' || key === 'skewX' || key === 'skewY') return '0deg';
  return 0;
};

// ---------- No-op fallback ----------------------------------------------------

let warnedMissingReanimated = false;

function useAnimationNoop(animate?: AnimationProps | AnimationProps[]) {
  // Surface the most common native-animation pitfall: an `animate` prop is set
  // but `react-native-reanimated` isn't installed/linked, so motion silently
  // never plays. Warn once in dev.
  if (
    animate &&
    !warnedMissingReanimated &&
    typeof __DEV__ !== 'undefined' &&
    __DEV__
  ) {
    warnedMissingReanimated = true;
    // eslint-disable-next-line no-console
    console.warn(
      '[app-studio] `animate` was set but `react-native-reanimated` is not ' +
        'available, so the view renders static. Install it and add its babel ' +
        "plugin (last in the list) to enable native animations. See app-studio's " +
        'docs/NATIVE_SETUP.md.'
    );
  }
  return {
    style: undefined as any,
    AnimatedView: undefined as any,
    AnimatedPressable: undefined as any,
  };
}

// ---------- Reanimated implementation -----------------------------------------

function useAnimationReanimated(animate?: AnimationProps | AnimationProps[]) {
  const {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    withRepeat,
    withSequence,
    cancelAnimation,
  } = ReanimatedApi;
  const AnimatedDefault = ReanimatedApi;

  // Normalise to array form
  const animations: AnimationProps[] = animate
    ? Array.isArray(animate)
      ? animate
      : [animate]
    : [];

  // We only support the first animation in this minimal port — composing
  // multiple animations onto the same view properly needs a dedicated style
  // hook per animation, which leaks hooks-in-loops. Authors can still chain
  // animations with `Animation.fadeIn()` + custom orchestration if needed.
  const first = animations[0];

  // Compute keyframes & animated keys *before* we instantiate shared values so
  // we know how many to create. We deliberately create a FIXED roster of
  // shared values to keep the hooks order stable across renders.
  const frames = first ? extractKeyframes(first) : [];
  const animatedKeys = first ? collectAnimatedKeys(frames) : [];

  // Stable hook calls: always create the same roster of shared values per
  // property name. We cap the roster at a known set of common keys so the
  // ordering is deterministic.
  const ROSTER = [
    'opacity',
    'translateX',
    'translateY',
    'scale',
    'scaleX',
    'scaleY',
    'rotate',
    'skewX',
    'skewY',
    'backgroundColor',
    'color',
    'borderRadius',
    'width',
    'height',
  ] as const;

  // react-doctor-disable-next-line react-doctor/rules-of-hooks
  const sharedRoster: Record<string, any> = {};
  for (const k of ROSTER) {
    // react-doctor-disable-next-line react-doctor/rules-of-hooks
    sharedRoster[k] = useSharedValue(initialValueFor(k, frames));
  }

  // Kick off the animation on mount (and whenever `first` reference changes).
  useEffect(() => {
    if (!first) return;
    const duration = parseDurationMs(first.duration);
    const delay = parseDurationMs(first.delay) || 0;
    const easing = easingFor(first.timingFunction);
    const iterationCount =
      first.iterationCount === 'infinite'
        ? -1
        : typeof first.iterationCount === 'number'
          ? first.iterationCount
          : 1;
    const reverse =
      first.direction === 'alternate' ||
      first.direction === 'alternate-reverse';

    for (const key of animatedKeys) {
      if (!ROSTER.includes(key as any)) continue;
      // Build the per-frame value timeline for this key.
      const stops = frames.map((f) => ({
        stop: f.stop,
        value:
          f.frame[key] !== undefined
            ? f.frame[key]
            : initialValueFor(key, frames),
      }));
      if (stops.length < 2) continue;

      // Per-segment durations proportional to stop gaps. Total = duration.
      const segments: Array<{ to: any; ms: number }> = [];
      for (let i = 1; i < stops.length; i++) {
        const span = stops[i].stop - stops[i - 1].stop || 0.0001;
        segments.push({ to: stops[i].value, ms: span * duration });
      }

      const seqArgs = segments.map((s) =>
        withTiming(s.to, { duration: s.ms, easing })
      );

      const sequence =
        seqArgs.length === 1 ? seqArgs[0] : withSequence(...seqArgs);
      const repeated =
        iterationCount === 1
          ? sequence
          : withRepeat(sequence, iterationCount, reverse);
      const final = delay > 0 ? withDelay(delay, repeated) : repeated;

      // Reset to initial then start.
      sharedRoster[key].value = stops[0].value;
      sharedRoster[key].value = final;
    }

    return () => {
      for (const key of animatedKeys) {
        if (sharedRoster[key]) cancelAnimation(sharedRoster[key]);
      }
    };
    // react-doctor-disable-next-line react-doctor/exhaustive-deps
  }, [first]);

  const style = useAnimatedStyle(() => {
    'worklet';
    if (!first) return {};
    const transform: Array<Record<string, any>> = [];
    if (animatedKeys.includes('translateX'))
      transform.push({ translateX: sharedRoster.translateX.value });
    if (animatedKeys.includes('translateY'))
      transform.push({ translateY: sharedRoster.translateY.value });
    if (animatedKeys.includes('scale'))
      transform.push({ scale: sharedRoster.scale.value });
    if (animatedKeys.includes('scaleX'))
      transform.push({ scaleX: sharedRoster.scaleX.value });
    if (animatedKeys.includes('scaleY'))
      transform.push({ scaleY: sharedRoster.scaleY.value });
    if (animatedKeys.includes('rotate'))
      transform.push({ rotate: sharedRoster.rotate.value });
    if (animatedKeys.includes('skewX'))
      transform.push({ skewX: sharedRoster.skewX.value });
    if (animatedKeys.includes('skewY'))
      transform.push({ skewY: sharedRoster.skewY.value });

    const out: Record<string, any> = {};
    if (animatedKeys.includes('opacity'))
      out.opacity = sharedRoster.opacity.value;
    if (animatedKeys.includes('backgroundColor'))
      out.backgroundColor = sharedRoster.backgroundColor.value;
    if (animatedKeys.includes('color')) out.color = sharedRoster.color.value;
    if (animatedKeys.includes('borderRadius'))
      out.borderRadius = sharedRoster.borderRadius.value;
    if (animatedKeys.includes('width')) out.width = sharedRoster.width.value;
    if (animatedKeys.includes('height')) out.height = sharedRoster.height.value;
    if (transform.length) out.transform = transform;
    return out;
  }, [animatedKeys.join(',')]);

  return {
    style,
    AnimatedView: AnimatedDefault?.View,
    AnimatedPressable,
  };
}

// ---------- Public hook -------------------------------------------------------

export const useAnimation: (animate?: AnimationProps | AnimationProps[]) => {
  style: any;
  AnimatedView: any;
  AnimatedPressable: any;
} = HAS_REANIMATED ? useAnimationReanimated : useAnimationNoop;

// Exported so consumers can check if real animations are available.
export const isAnimationSupported = HAS_REANIMATED;
