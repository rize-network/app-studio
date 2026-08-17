/**
 * useNetworkStatus — cross-platform online/offline state (web implementation).
 *
 * A dependency-free port of the original app-demo `network.ts` (which used
 * `@react-native-community/netinfo` + Redux dispatch). On web it reads
 * `navigator.onLine` and listens for `online`/`offline` events; the connection
 * `type` is best-effort from the Network Information API when available. The
 * native build provides a matching hook at `src/native/useNetworkStatus.ts`.
 */
import { useEffect, useState } from 'react';

export interface NetworkStatus {
  // Whether the device reports an active network connection.
  isConnected: boolean;
  // Whether the internet is actually reachable. `null` when unknown (web can
  // only report link status, not true reachability).
  isInternetReachable: boolean | null;
  // Best-effort connection type ('wifi', 'cellular', '4g', …) or 'unknown'.
  type: string;
}

const read = (): NetworkStatus => {
  if (typeof navigator === 'undefined') {
    return { isConnected: true, isInternetReachable: null, type: 'unknown' };
  }
  const connection =
    (navigator as any).connection ||
    (navigator as any).mozConnection ||
    (navigator as any).webkitConnection;
  return {
    isConnected: navigator.onLine,
    isInternetReachable: navigator.onLine ? null : false,
    type: connection?.effectiveType || connection?.type || 'unknown',
  };
};

export const useNetworkStatus = (): NetworkStatus => {
  const [status, setStatus] = useState<NetworkStatus>(read);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const update = () => setStatus(read());
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    const connection = (navigator as any).connection;
    connection?.addEventListener?.('change', update);
    // Sync once on mount in case status changed before listeners attached.
    update();
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
      connection?.removeEventListener?.('change', update);
    };
  }, []);

  return status;
};
