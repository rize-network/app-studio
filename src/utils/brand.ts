import {
  ColorPalette,
  ColorSingleton,
  contrastRatio,
  defaultDarkColors,
  defaultDarkPalette,
  defaultLightColors,
  defaultLightPalette,
  nearestColorToken,
} from './colors';

/**
 * A brand look: mode, brand colours, corner radius and font, resolved into the
 * theme slots ThemeProvider takes (see {@link resolveBrandTheme}).
 */
export type BrandMode = 'light' | 'dark' | 'system';
export type BrandRadius = 'none' | 'sm' | 'md' | 'lg';
export type BrandAppearance = 'light' | 'dark';

export interface BrandColors {
  /** #rrggbb */
  primary: string;
  secondary?: string;
  accent?: string;
  /** Page background (the `canvas` slot). */
  background?: string;
  text?: string;
}

export interface Brand {
  /** Defaults to `light`. `system` follows the device appearance, live. */
  mode?: BrandMode;
  colors?: BrandColors;
  /** Corner radius scale; defaults to `md` (the components' own look). */
  radius?: BrandRadius;
  /** One of {@link BRAND_FONT_FAMILIES}; anything else keeps the system stack. */
  font?: string;
}

export interface ResolvedBrandTheme {
  /** Theme slots (primary, secondary, accent, accentSoft, canvas, text, onPrimary) set by the brand. */
  slots: Record<string, string>;
  /** Multiplier for corner radii: none 0, sm 0.5, md 1, lg 1.5. */
  radiusScale: number;
  /** CSS font-family of the brand font with its fallback stack, null for the system stack. */
  fontFamily: string | null;
  /** Google Fonts stylesheet of the brand font, null for the system stack. */
  fontHref: string | null;
}

/** Google families a brand may use, with the weights each one publishes (a missing weight fails the request). */
const FONT_WEIGHTS: Readonly<Record<string, string>> = {
  Inter: '300;400;500;600;700',
  Roboto: '300;400;500;700',
  Poppins: '300;400;500;600;700',
  Lato: '300;400;700',
  Montserrat: '300;400;500;600;700',
  'Open Sans': '300;400;500;600;700',
  Nunito: '300;400;500;600;700',
  'Playfair Display': '400;500;600;700',
  'Source Sans 3': '300;400;500;600;700',
  'Work Sans': '300;400;500;600;700',
};

export const BRAND_FONT_FAMILIES: readonly string[] = Object.keys(FONT_WEIGHTS);

const RADIUS_SCALE: Readonly<Record<BrandRadius, number>> = {
  none: 0,
  sm: 0.5,
  md: 1,
  lg: 1.5,
};

const SANS_STACK =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif";
const SERIF_STACK = "Georgia, 'Times New Roman', serif";

const SERIF_FAMILIES: readonly string[] = ['Playfair Display'];

interface AppearanceColors {
  main: ColorSingleton;
  palette: ColorPalette;
}

const APPEARANCE_COLORS: Readonly<Record<BrandAppearance, AppearanceColors>> = {
  light: { main: defaultLightColors, palette: defaultLightPalette },
  dark: { main: defaultDarkColors, palette: defaultDarkPalette },
};

/** The appearances a brand can show: its mode, or both for `system`. */
export function brandAppearances(mode: BrandMode = 'light'): BrandAppearance[] {
  return mode === 'system' ? ['light', 'dark'] : [mode];
}

/** A base corner radius (px) scaled by a brand radius scale; pills (>= 999) stay pills. */
export function scaleRadius(px: number, scale: number): number {
  return px >= 999 ? px : Math.round(px * scale);
}

/**
 * Resolve a brand into theme slots, radius scale and font. Pure: no DOM, no
 * React Native, the same answer on web and native.
 *
 * - Each colour snaps to the nearest palette token of the reference appearance
 *   (dark for `dark`, light otherwise), so the other appearance of `system`
 *   shows the matching shade instead of a frozen literal.
 * - `onPrimary` (when the brand sets a primary) reads with contrast >= 4.5 in
 *   every appearance shown: one constant ink when one reads everywhere, else
 *   the flipping token that gives the better ink per appearance.
 * - `accentSoft` is the lightest shade of the accent family.
 */
export function resolveBrandTheme(brand: Brand): ResolvedBrandTheme {
  const mode = brand.mode ?? 'light';
  const reference: BrandAppearance = mode === 'dark' ? 'dark' : 'light';
  const slots: Record<string, string> = {};
  const colors = brand.colors;

  if (colors) {
    const snap = (slot: string, hex: string | undefined): void => {
      const token = hex
        ? nearestColorToken(hex, APPEARANCE_COLORS[reference])
        : null;
      if (token) slots[slot] = token;
    };
    snap('primary', colors.primary);
    snap('secondary', colors.secondary);
    snap('accent', colors.accent);
    snap('canvas', colors.background);
    snap('text', colors.text);
    if (slots.accent) slots.accentSoft = softTint(slots.accent);
    if (slots.primary)
      slots.onPrimary = onColorFor(slots.primary, brandAppearances(mode));
  }

  const weights = brand.font ? FONT_WEIGHTS[brand.font] : undefined;
  const font = weights ? brand.font : undefined;
  return {
    slots,
    radiusScale: RADIUS_SCALE[brand.radius ?? 'md'],
    fontFamily: font
      ? `'${font}', ${SERIF_FAMILIES.includes(font) ? SERIF_STACK : SANS_STACK}`
      : null,
    fontHref: font
      ? `https://fonts.googleapis.com/css2?family=${font.replace(
          / /g,
          '+'
        )}:wght@${weights}&display=swap`
      : null,
  };
}

/** The literal a `color-*` token renders in one appearance (null when unknown). */
function tokenValue(token: string, appearance: BrandAppearance): string | null {
  const { main, palette } = APPEARANCE_COLORS[appearance];
  const [family = '', shade, alpha] = token.replace(/^color-/, '').split('-');
  if (alpha !== undefined) return null;
  const value =
    shade === undefined ? main[family] : palette[family]?.[Number(shade)];
  return typeof value === 'string' ? value : null;
}

const INKS = { white: '#ffffff', black: '#000000' } as const;
type Ink = keyof typeof INKS;

/**
 * Text colour on a primary token, readable in every appearance shown. Returns a
 * constant keyword (`white` / `black`) when one ink reads on every rendering,
 * otherwise the flipping token that yields the better ink per appearance
 * (`color-white` is white in light and black in dark; `color-black` the reverse).
 */
function onColorFor(token: string, appearances: BrandAppearance[]): string {
  const rendered = appearances
    .map((appearance) => ({ appearance, value: tokenValue(token, appearance) }))
    .filter(
      (entry): entry is { appearance: BrandAppearance; value: string } =>
        entry.value !== null
    );
  if (rendered.length === 0) return 'white';
  const ratio = (ink: Ink, value: string) =>
    contrastRatio(INKS[ink], value) ?? 0;
  for (const ink of ['white', 'black'] as const) {
    if (rendered.every(({ value }) => ratio(ink, value) >= 4.5)) return ink;
  }
  const best = (value: string): Ink =>
    ratio('white', value) >= ratio('black', value) ? 'white' : 'black';
  const light = rendered.find((entry) => entry.appearance === 'light');
  const dark = rendered.find((entry) => entry.appearance === 'dark');
  if (!light || !dark || best(light.value) === best(dark.value)) {
    return best((light ?? dark ?? rendered[0]).value);
  }
  return best(light.value) === 'white' ? 'color-white' : 'color-black';
}

/** The lightest shade of a palette token's family (a tint behind accent text). */
function softTint(token: string): string {
  const [family, shade] = token.replace(/^color-/, '').split('-');
  return shade !== undefined && family && !['white', 'black'].includes(family)
    ? `color-${family}-50`
    : 'color-gray-100';
}
