/**
 * Cross-platform link helpers (web implementation).
 *
 * A dependency-free port of the original app-demo `link.ts`, which leaned on
 * React Native's `Linking` and `react-native-email-link`. The native build
 * ships a matching implementation at `src/native/utils/link.ts` with the same
 * signatures, so callers write the same code on web and native.
 */

export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface DirectionOptions {
  // Optional origin. When omitted the maps provider uses the user's location.
  source?: LatLng;
  destination: LatLng;
  // Optional human-readable label for the destination.
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

/**
 * Open a URL (or the first openable URL from a list). On web this opens a new
 * tab. Returns whether a URL was opened.
 */
export const openUrl = async (url: string | string[]): Promise<boolean> => {
  const urls = Array.isArray(url) ? url : [url];
  for (const candidate of urls) {
    if (!candidate) continue;
    try {
      const win =
        typeof window !== 'undefined'
          ? window.open(candidate, '_blank', 'noopener,noreferrer')
          : null;
      // Popup blockers return null; fall back to a same-tab navigation.
      if (!win && typeof window !== 'undefined') {
        window.location.href = candidate;
      }
      return true;
    } catch {
      // try the next candidate
    }
  }
  return false;
};

/** Trigger the platform dialer for a phone number. */
export const callNumber = async (phoneNumber: string): Promise<boolean> => {
  const normalized = String(phoneNumber).replace(/[^+\d]/g, '');
  return openUrl(`tel:${normalized}`);
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
  if (typeof window !== 'undefined') {
    window.location.href = `mailto:${to}${query}`;
    return true;
  }
  return false;
};

/** Open turn-by-turn directions in a maps provider. */
export const openDirection = async (
  options: DirectionOptions
): Promise<boolean> => {
  const { source, destination, label } = options;
  const dest = `${destination.latitude},${destination.longitude}`;
  const origin = source ? `${source.latitude},${source.longitude}` : '';
  const url =
    `https://www.google.com/maps/dir/?api=1&destination=${encode(dest)}` +
    (origin ? `&origin=${encode(origin)}` : '') +
    (label ? `&destination_place_id=${encode(label)}` : '');
  return openUrl(url);
};
