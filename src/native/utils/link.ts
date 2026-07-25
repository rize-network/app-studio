/**
 * Cross-platform link helpers (React Native implementation).
 *
 * Mirrors the web implementation in `src/utils/link.ts` exactly, so consumers
 * import the same `openUrl` / `callNumber` / `sendMail` / `openDirection` on
 * both platforms. Dependency-free: uses RN's built-in `Linking` (no
 * `react-native-email-link`), and builds maps URLs inline.
 */
import { Linking, Platform } from 'react-native';

export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface DirectionOptions {
  source?: LatLng;
  destination: LatLng;
  label?: string;
}

export interface MailOptions {
  to: string;
  subject?: string;
  body?: string;
  cc?: string;
  bcc?: string;
}

const encode = encodeURIComponent;

const tryOpen = async (target: string): Promise<boolean> => {
  try {
    const supported = await Linking.canOpenURL(target);
    if (!supported) return false;
    await Linking.openURL(target);
    return true;
  } catch {
    return false;
  }
};

/** Open the first openable URL from the list (or the single URL). */
export const openUrl = async (url: string | string[]): Promise<boolean> => {
  const urls = Array.isArray(url) ? url : [url];
  for (const candidate of urls) {
    if (!candidate) continue;
    if (await tryOpen(candidate)) return true;
  }
  return false;
};

/** Trigger the platform dialer for a phone number. */
export const callNumber = async (phoneNumber: string): Promise<boolean> => {
  const normalized = String(phoneNumber).replace(/[^+\d]/g, '');
  // Android uses `tel:`, iOS prefers `telprompt:` (shows a confirm dialog).
  const scheme = Platform.OS === 'ios' ? 'telprompt:' : 'tel:';
  return (
    (await tryOpen(`${scheme}${normalized}`)) || tryOpen(`tel:${normalized}`)
  );
};

/** Open the user's mail composer pre-filled with the given fields. */
export const sendMail = async (options: MailOptions): Promise<boolean> => {
  const { to, subject, body, cc, bcc } = options;
  const params: string[] = [];
  if (subject) params.push(`subject=${encode(subject)}`);
  if (body) params.push(`body=${encode(body)}`);
  if (cc) params.push(`cc=${encode(cc)}`);
  if (bcc) params.push(`bcc=${encode(bcc)}`);
  const query = params.length ? `?${params.join('&')}` : '';
  return tryOpen(`mailto:${to}${query}`);
};

/**
 * Open turn-by-turn directions, preferring native maps apps and falling back
 * to the web. Ports the provider order from the original app-demo `link.ts`.
 */
export const openDirection = async (
  options: DirectionOptions
): Promise<boolean> => {
  const { source, destination, label } = options;
  const dest = `${destination.latitude},${destination.longitude}`;
  const origin = source ? `${source.latitude},${source.longitude}` : '';
  const q = label ? encode(label) : encode(dest);

  const googleApp =
    `https://www.google.com/maps/dir/?api=1&destination=${encode(dest)}` +
    (origin ? `&origin=${encode(origin)}` : '');
  const appleMaps =
    `http://maps.apple.com/?daddr=${encode(dest)}&q=${q}` +
    (origin ? `&saddr=${encode(origin)}` : '');

  const candidates =
    Platform.OS === 'ios' ? [googleApp, appleMaps] : [googleApp];
  return openUrl(candidates);
};
