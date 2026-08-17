/**
 * whether in browser env
 */
export const isBrowser = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined';

/**
 * get window.g_initialProps
 */
export const getWindowInitialProps = () =>
  isBrowser() ? (window as any).g_initialProps : undefined;

/**
 * whether SSR success in client
 */
export const isSSR = !isBrowser();

export function isDev() {
  let dev = false;

  if (isBrowser()) {
    dev = !(window.location.hostname.indexOf('localhost') === -1);
  }
  return dev;
}

export function isProd() {
  if (isBrowser()) {
    if (window && window.location && window.location.hostname) {
      return (
        window.location.hostname.includes('localhost') ||
        window.location.hostname.includes('develop')
      );
    }
  }
  return false;
}

export function isMobile() {
  return navigator.userAgent.match(/(iPhone|iPod|Android|ios|iPad)/i);
}
