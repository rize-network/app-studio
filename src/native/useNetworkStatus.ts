/**
 * useNetworkStatus — cross-platform online/offline state (native implementation).
 *
 * Mirrors the web hook in `src/hooks/useNetworkStatus.ts`. Uses the optional
 * peer `@react-native-community/netinfo` when installed (lazy-required, the
 * same graceful pattern app-studio uses for reanimated); when the peer is
 * absent it degrades to "always connected" so apps that don't need network
 * awareness incur no dependency.
 */
import { useEffect, useState } from 'react';

export interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string;
}

const DEFAULT_STATUS: NetworkStatus = {
  isConnected: true,
  isInternetReachable: null,
  type: 'unknown',
};

// Lazy-require NetInfo so the dependency stays optional. Returns null if the
// peer isn't installed.
const getNetInfo = (): any | null => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('@react-native-community/netinfo').default;
  } catch {
    return null;
  }
};

const fromNetInfoState = (state: any): NetworkStatus => ({
  isConnected: !!state?.isConnected,
  isInternetReachable:
    state?.isInternetReachable === undefined ? null : state.isInternetReachable,
  type: state?.type || 'unknown',
});

export const useNetworkStatus = (): NetworkStatus => {
  const [status, setStatus] = useState<NetworkStatus>(DEFAULT_STATUS);

  useEffect(() => {
    const NetInfo = getNetInfo();
    if (!NetInfo) return;
    const unsubscribe = NetInfo.addEventListener((state: any) =>
      setStatus(fromNetInfoState(state))
    );
    // Fetch the current state once on mount.
    NetInfo.fetch?.().then((state: any) => setStatus(fromNetInfoState(state)));
    return () => unsubscribe?.();
  }, []);

  return status;
};
