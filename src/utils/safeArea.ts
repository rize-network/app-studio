/**
 * safeArea — shared, platform-agnostic safe-area logic.
 *
 * One prop list + one edge resolver power BOTH builds so a `<View safeAreaTop>`
 * behaves identically on web and React Native:
 *   - web  → `paddingTop: calc(<existing> + env(safe-area-inset-top, 0px))`
 *   - native → existing edge padding + live inset from
 *              `react-native-safe-area-context`
 *
 * Insets are applied ADDITIVELY over the view's existing padding (or margin when
 * `safeAreaMode: 'margin'`), matching `react-native-safe-area-context`'s
 * `SafeAreaView` semantics — content is pushed out of the system UI, it doesn't
 * merely sit at the inset.
 */

export type SafeAreaEdge = 'top' | 'right' | 'bottom' | 'left';
export type SafeAreaMode = 'padding' | 'margin';

/**
 * Safe-area props available on every App Studio view (mixed into `Element`).
 */
export interface SafeAreaProps {
  /** `true`/`'all'` = all four edges; or a single edge / array of edges. */
  safeArea?: boolean | 'all' | SafeAreaEdge | SafeAreaEdge[];
  /** Per-edge opt-in. An explicit boolean wins over `safeArea`/`safeAreaEdges`. */
  safeAreaTop?: boolean;
  safeAreaBottom?: boolean;
  safeAreaLeft?: boolean;
  safeAreaRight?: boolean;
  /** Explicit edge list, merged with `safeArea`. */
  safeAreaEdges?: SafeAreaEdge[];
  /** Force safe area OFF — wins over every other safe-area prop. */
  ignoreSafeArea?: boolean;
  /** Apply the inset as padding (default) or margin. */
  safeAreaMode?: SafeAreaMode;
}

/** Every safe-area prop name — used to strip them from DOM / RN passthrough. */
export const SAFE_AREA_PROP_NAMES: readonly (keyof SafeAreaProps)[] = [
  'safeArea',
  'safeAreaTop',
  'safeAreaBottom',
  'safeAreaLeft',
  'safeAreaRight',
  'safeAreaEdges',
  'ignoreSafeArea',
  'safeAreaMode',
];

export interface ResolvedSafeAreaEdges {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
}

const EDGES: SafeAreaEdge[] = ['top', 'right', 'bottom', 'left'];

const NONE: ResolvedSafeAreaEdges = {
  top: false,
  right: false,
  bottom: false,
  left: false,
};

/** Cheap check so we can skip all safe-area work when no prop is set. */
export function hasSafeAreaProps(props: Record<string, any>): boolean {
  for (let i = 0; i < SAFE_AREA_PROP_NAMES.length; i++) {
    if (props[SAFE_AREA_PROP_NAMES[i]] !== undefined) return true;
  }
  return false;
}

/**
 * Resolve the various safe-area props into a definitive per-edge map.
 * Precedence: `ignoreSafeArea` (off-all) > per-edge booleans > `safeAreaEdges` >
 * `safeArea`.
 */
export function resolveSafeAreaEdges(
  props: SafeAreaProps
): ResolvedSafeAreaEdges {
  if (props.ignoreSafeArea) return { ...NONE };

  const edges: ResolvedSafeAreaEdges = { ...NONE };

  const sa = props.safeArea;
  if (sa === true || sa === 'all') {
    edges.top = edges.right = edges.bottom = edges.left = true;
  } else if (typeof sa === 'string') {
    if (sa in edges) edges[sa as SafeAreaEdge] = true;
  } else if (Array.isArray(sa)) {
    for (const e of sa) if (e in edges) edges[e] = true;
  }

  if (Array.isArray(props.safeAreaEdges)) {
    for (const e of props.safeAreaEdges) if (e in edges) edges[e] = true;
  }

  // Per-edge booleans are the most specific — they can also turn an edge OFF.
  if (props.safeAreaTop !== undefined) edges.top = !!props.safeAreaTop;
  if (props.safeAreaRight !== undefined) edges.right = !!props.safeAreaRight;
  if (props.safeAreaBottom !== undefined) edges.bottom = !!props.safeAreaBottom;
  if (props.safeAreaLeft !== undefined) edges.left = !!props.safeAreaLeft;

  return edges;
}

export function anyEdgeEnabled(edges: ResolvedSafeAreaEdges): boolean {
  return edges.top || edges.right || edges.bottom || edges.left;
}

const PADDING_KEY: Record<SafeAreaEdge, string> = {
  top: 'paddingTop',
  right: 'paddingRight',
  bottom: 'paddingBottom',
  left: 'paddingLeft',
};
const MARGIN_KEY: Record<SafeAreaEdge, string> = {
  top: 'marginTop',
  right: 'marginRight',
  bottom: 'marginBottom',
  left: 'marginLeft',
};
const ENV: Record<SafeAreaEdge, string> = {
  top: 'env(safe-area-inset-top, 0px)',
  right: 'env(safe-area-inset-right, 0px)',
  bottom: 'env(safe-area-inset-bottom, 0px)',
  left: 'env(safe-area-inset-left, 0px)',
};

/** Edges that share an axis with a given edge via the *Horizontal/*Vertical shorthands. */
const AXIS_SHORTHAND: Record<SafeAreaEdge, 'Horizontal' | 'Vertical'> = {
  top: 'Vertical',
  bottom: 'Vertical',
  left: 'Horizontal',
  right: 'Horizontal',
};

function toLength(value: number | string): string {
  return typeof value === 'number' ? `${value}px` : value;
}

/**
 * Find the user's existing length for one edge of a box property, honouring
 * App Studio's shorthands and CSS precedence
 * (`<prop><Edge>` > `<prop><Axis>` > `<prop><X|Y>` > `<prop>`).
 * Returns `undefined` when nothing is set (treated as 0).
 */
function resolveEdgeBase(
  props: Record<string, any>,
  edge: SafeAreaEdge,
  kind: 'padding' | 'margin'
): number | string | undefined {
  const cap = edge.charAt(0).toUpperCase() + edge.slice(1); // Top / Right / …
  const axis = AXIS_SHORTHAND[edge]; // Horizontal | Vertical
  const xy = axis === 'Horizontal' ? 'X' : 'Y';

  const candidates = [
    `${kind}${cap}`, // paddingTop
    `${kind}${axis}`, // paddingVertical (RN) / used as web shorthand too
    `${kind}${xy}`, // paddingY (App Studio alias)
    kind, // padding
  ];

  for (const key of candidates) {
    const v = props[key];
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return undefined;
}

/**
 * WEB: build the safe-area style fragment. Each enabled edge becomes
 * `calc(<existing> + env(safe-area-inset-<edge>, 0px))`, or just the `env()`
 * value when the edge has no existing length.
 */
export function buildWebSafeAreaStyle(
  props: SafeAreaProps & Record<string, any>,
  edges: ResolvedSafeAreaEdges,
  mode: SafeAreaMode = 'padding'
): Record<string, string> {
  const out: Record<string, string> = {};
  const keyMap = mode === 'margin' ? MARGIN_KEY : PADDING_KEY;

  for (const edge of EDGES) {
    if (!edges[edge]) continue;
    const base = resolveEdgeBase(props, edge, mode);
    const env = ENV[edge];
    out[keyMap[edge]] =
      base === undefined ? env : `calc(${toLength(base)} + ${env})`;
  }

  return out;
}

/**
 * NATIVE: build the safe-area style fragment from already-resolved insets.
 * `baseStyle` is the flattened RN style so we can read the effective per-edge
 * base (e.g. `paddingTop ?? paddingVertical ?? padding`). Numeric bases are
 * added to the inset; non-numeric bases (rare on native) fall back to the inset.
 */
export function buildNativeSafeAreaStyle(
  baseStyle: Record<string, any>,
  edges: ResolvedSafeAreaEdges,
  insets: { top: number; right: number; bottom: number; left: number },
  mode: SafeAreaMode = 'padding'
): Record<string, number> {
  const out: Record<string, number> = {};
  const keyMap = mode === 'margin' ? MARGIN_KEY : PADDING_KEY;

  for (const edge of EDGES) {
    if (!edges[edge]) continue;
    const base = resolveEdgeBase(baseStyle, edge, mode);
    const inset = insets[edge] || 0;
    out[keyMap[edge]] = typeof base === 'number' ? base + inset : inset;
  }

  return out;
}
