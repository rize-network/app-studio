import {
  ColorPalette,
  ColorSingleton,
  defaultDarkColors,
  defaultDarkPalette,
  defaultLightColors,
  defaultLightPalette,
} from '../utils/colors';

export type ThemeMode = 'light' | 'dark';

export interface Colors {
  main: ColorSingleton;
  palette: ColorPalette;
}

export interface Theme {
  primary?: string;
  secondary?: string;
  success?: string;
  error?: string;
  warning?: string;
  disabled?: string;
  loading?: string;
  [key: string]: string | undefined;
}

export interface ThemeColorConfig {
  light: Colors;
  dark: Colors;
}

export interface ResolveColorOptions {
  colors: ThemeColorConfig;
  theme: Theme;
  themeMode: ThemeMode;
}

const COLOR_PREFIX = 'color-';
const THEME_PREFIX = 'theme-';
const LIGHT_PREFIX = 'light-';
const DARK_PREFIX = 'dark-';
const TRANSPARENT = 'transparent';

export const defaultThemeMain: Theme = {
  primary: 'color-black',
  secondary: 'color-blue',
  success: 'color-green-500',
  error: 'color-red-500',
  warning: 'color-orange-500',
  disabled: 'color-gray-500',
  loading: 'color-dark-500',
};

export const defaultThemeColors: ThemeColorConfig = {
  light: {
    main: defaultLightColors,
    palette: defaultLightPalette,
  },
  dark: {
    main: defaultDarkColors,
    palette: defaultDarkPalette,
  },
};

export function deepMerge<T extends Record<string, any>>(
  target: T,
  source?: Partial<T>
): T {
  if (!source) return target;

  const output: Record<string, any> = { ...target };
  Object.keys(source).forEach((key) => {
    const sourceValue = source[key as keyof T];
    const targetValue = target[key as keyof T];

    if (
      sourceValue &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      output[key] = deepMerge(targetValue, sourceValue as any);
    } else if (sourceValue !== undefined) {
      output[key] = sourceValue;
    }
  });

  return output as T;
}

function applyAlpha(color: string, alpha: number): string {
  const normalized = Math.max(0, Math.min(1000, alpha)) / 1000;

  if (color.startsWith('#')) {
    let hex = color.slice(1);
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map((char) => char + char)
        .join('');
    }
    if (hex.length >= 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${normalized})`;
    }
  }

  if (color.startsWith('rgb')) {
    const rgbMatch = color.match(/rgba?\(([^)]+)\)/);
    if (rgbMatch) {
      const values = rgbMatch[1].split(',').map((value) => value.trim());
      return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${normalized})`;
    }
  }

  return color;
}

export function resolveThemeColor(
  token: string,
  options: ResolveColorOptions,
  depth = 0
): string {
  if (!token || typeof token !== 'string') return String(token);
  if (token === TRANSPARENT) return token;
  if (depth > 25) return token;

  if (token.startsWith(THEME_PREFIX)) {
    const parts = token.substring(THEME_PREFIX.length).split('-');
    const lastPart = parts[parts.length - 1];
    const maybeAlpha = parseInt(lastPart, 10);
    const hasAlpha =
      parts.length >= 2 &&
      !isNaN(maybeAlpha) &&
      maybeAlpha >= 0 &&
      maybeAlpha <= 1000;

    const themeKey = (
      hasAlpha ? parts.slice(0, -1).join('-') : parts.join('-')
    ) as keyof Theme;
    const themeValue = options.theme[themeKey];
    if (typeof themeValue !== 'string') return token;

    const resolved = resolveThemeColor(themeValue, options, depth + 1);
    return hasAlpha ? applyAlpha(resolved, maybeAlpha) : resolved;
  }

  if (token.startsWith(COLOR_PREFIX)) {
    const parts = token.substring(COLOR_PREFIX.length).split('-');
    const colors = options.colors[options.themeMode];

    if (parts.length >= 3) {
      const maybeAlpha = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(maybeAlpha) && maybeAlpha >= 0 && maybeAlpha <= 1000) {
        const colorName = parts[0];
        const shade = Number(parts[1]);
        const value = colors.palette[colorName]?.[shade];
        return typeof value === 'string'
          ? applyAlpha(value, maybeAlpha)
          : token;
      }
    }

    if (parts.length === 2) {
      const value = colors.palette[parts[0]]?.[Number(parts[1])];
      return typeof value === 'string' ? value : token;
    }

    if (parts.length === 1) {
      const value = colors.main[parts[0]];
      return typeof value === 'string' ? value : token;
    }

    return token;
  }

  if (token.startsWith(LIGHT_PREFIX) || token.startsWith(DARK_PREFIX)) {
    const themeMode = token.startsWith(LIGHT_PREFIX) ? 'light' : 'dark';
    const prefix = token.startsWith(LIGHT_PREFIX) ? LIGHT_PREFIX : DARK_PREFIX;
    return resolveThemeColor(
      `${COLOR_PREFIX}${token.substring(prefix.length)}`,
      { ...options, themeMode },
      depth + 1
    );
  }

  return token;
}

export function normalizeHex(color: string): string {
  if (!color || typeof color !== 'string') return String(color);
  if (color === TRANSPARENT) return '#00000000';

  if (color.startsWith('#')) {
    const hex = color.slice(1);
    if (hex.length === 3) {
      return `#${hex
        .split('')
        .map((char) => char + char)
        .join('')}`.toLowerCase();
    }
    return color.toLowerCase();
  }

  const rgbMatch = color.match(/rgba?\(([^)]+)\)/);
  if (!rgbMatch) return color;

  const values = rgbMatch[1].split(',').map((value) => Number(value.trim()));
  if (values.length < 3 || values.some((value) => Number.isNaN(value))) {
    return color;
  }

  const [r, g, b] = values;
  return `#${[r, g, b]
    .map((value) =>
      Math.max(0, Math.min(255, Math.round(value)))
        .toString(16)
        .padStart(2, '0')
    )
    .join('')}`;
}
