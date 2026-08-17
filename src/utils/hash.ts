/**
 * Simple, fast hash function (djb2) for generating deterministic class names.
 */
export function hash(str: string): string {
  let hash = 5381;
  let i = str.length;

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }

  // Convert to unsigned 32-bit integer and then to base 36 string
  return (hash >>> 0).toString(36);
}
