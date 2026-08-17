const normalizeHexColor = (backgroundColor: string) => {
  if (!backgroundColor) {
    return null;
  }

  const trimmed = backgroundColor.trim();
  const withoutHash = trimmed.startsWith('#') ? trimmed.slice(1) : trimmed;

  if (withoutHash.length === 3) {
    if (!/^[0-9a-fA-F]{3}$/.test(withoutHash)) {
      return null;
    }
    return `#${withoutHash
      .split('')
      .map((char) => char + char)
      .join('')}`;
  }

  if (!/^[0-9a-fA-F]{6}$/.test(withoutHash)) {
    return null;
  }

  return `#${withoutHash.toLowerCase()}`;
};

export const getTextColorHex = (backgroundColor: string) => {
  const normalized = normalizeHexColor(backgroundColor);

  if (!normalized) {
    return 'black';
  }

  // Simple luminance calculation to determine text color contrast
  const color = normalized.replace('#', '');
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? 'black' : 'white';
};

export const getTextColor = (backgroundColor: string) =>
  getTextColorHex(backgroundColor);
