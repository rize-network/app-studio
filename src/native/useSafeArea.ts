/**
 * useSafeArea (React Native) — reads live device insets from
 * `react-native-safe-area-context` and turns the shared safe-area props into an
 * additive padding/margin style fragment.
 *
 * `react-native-safe-area-context` is an OPTIONAL peer (lazy-required). When it
 * is absent — or no `<SafeAreaProvider>` is mounted — insets resolve to zero and
 * the hook is a no-op, so views keep rendering. Mount `<SafeAreaProvider>` at the
 * app root to get real insets (see docs/NATIVE_SETUP.md).
 *
 * We read insets via `useContext(SafeAreaInsetsContext)` rather than
 * `useSafeAreaInsets()` ON PURPOSE: the latter THROWS when no provider is
 * mounted, and this hook runs on every view. `useContext` returns `null`
 * (→ zero insets) instead, so a missing provider degrades gracefully rather
 * than crashing the app.
 */

import { useContext } from 'react';
import {
  SafeAreaProps,
  buildNativeSafeAreaStyle,
  resolveSafeAreaEdges,
  anyEdgeEnabled,
  hasSafeAreaProps,
} from '../utils/safeArea';

// Lazy-require so a missing peer doesn't throw at import time.
let SafeAreaContext: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  SafeAreaContext = require('react-native-safe-area-context');
} catch {
  SafeAreaContext = null;
}

const InsetsContext = SafeAreaContext?.SafeAreaInsetsContext ?? null;

export const isSafeAreaSupported = !!InsetsContext;

interface EdgeInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

const ZERO_INSETS: EdgeInsets = { top: 0, right: 0, bottom: 0, left: 0 };

/**
 * Compute the safe-area style fragment to merge onto a view's style.
 *
 * @param props      the element props (read for safe-area props)
 * @param baseStyle  the already-flattened style, so existing per-edge padding is
 *                   honoured when adding insets
 * @returns a style fragment (`{ paddingTop, … }`) or `null` when nothing applies
 */
function useSafeAreaSupported(
  props: SafeAreaProps & Record<string, any>,
  baseStyle: Record<string, any>
): Record<string, number> | null {
  // Hooks must run unconditionally — always subscribe to the insets context.
  // Returns `null` when no <SafeAreaProvider> is mounted (no throw).
  const insets =
    (useContext(InsetsContext) as EdgeInsets | null) || ZERO_INSETS;

  if (!hasSafeAreaProps(props)) return null;
  const edges = resolveSafeAreaEdges(props);
  if (!anyEdgeEnabled(edges)) return null;

  return buildNativeSafeAreaStyle(baseStyle, edges, insets, props.safeAreaMode);
}

function useSafeAreaNoop(
  _props: SafeAreaProps & Record<string, any>,
  _baseStyle: Record<string, any>
): Record<string, number> | null {
  return null;
}

export const useSafeArea: (
  props: SafeAreaProps & Record<string, any>,
  baseStyle: Record<string, any>
) => Record<string, number> | null = isSafeAreaSupported
  ? useSafeAreaSupported
  : useSafeAreaNoop;
