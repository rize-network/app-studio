import { createContext, useContext, useMemo } from 'react';
import { scaleRadius } from '../utils/brand';

/** The brand values a ThemeProvider `brand` publishes beyond colour slots. */
export interface BrandValues {
  /** Corner radius multiplier (none 0, sm 0.5, md 1, lg 1.5). */
  radiusScale: number;
  /** CSS font-family of the brand font (web), null for the system stack (always null on native). */
  fontFamily: string | null;
  /** Google Fonts stylesheet the provider loaded (web), null otherwise. */
  fontHref: string | null;
}

export interface UseBrand extends BrandValues {
  /** A base corner radius (px) scaled by the brand; pills (>= 999) stay pills. */
  scaleRadius: (px: number) => number;
}

export const defaultBrandValues: BrandValues = {
  radiusScale: 1,
  fontFamily: null,
  fontHref: null,
};

export const BrandContext = createContext<BrandValues>(defaultBrandValues);

/** The brand of the nearest ThemeProvider given a `brand` (the base look otherwise). */
export const useBrand = (): UseBrand => {
  const values = useContext(BrandContext);
  return useMemo(
    () => ({
      ...values,
      scaleRadius: (px: number) => scaleRadius(px, values.radiusScale),
    }),
    [values]
  );
};
