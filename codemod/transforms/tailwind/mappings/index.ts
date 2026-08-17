// @ts-nocheck
import { layoutExact, mapLayout } from './layout';
import { mapSpacing } from './spacing';
import { mapSizing } from './sizing';
import { mapTypography, typographyExact } from './typography';
import { mapColor } from './colors';
import { borderExact, mapBorders } from './borders';
import { effectsExact, mapEffects } from './effects';
import { arbitrary, decl, fraction, px, withNegative } from './shared';

export const exactMappings = Object.freeze({
  ...layoutExact, ...typographyExact, ...borderExact, ...effectsExact,
});

function mapInset(base: string, negative: boolean) {
  const match = base.match(/^(inset|inset-[xy]|top|right|bottom|left|start|end)-(.+)$/);
  if (!match) return null;
  let value: any = match[2] === 'full' ? '100%' : match[2] === 'auto' ? 'auto' : arbitrary(match[2]) ?? fraction(match[2]) ?? px(match[2]);
  if (value == null) return null;
  value = withNegative(value, negative);
  const props: any = {
    inset:['top','right','bottom','left'], 'inset-x':['left','right'], 'inset-y':['top','bottom'],
    top:['top'], right:['right'], bottom:['bottom'], left:['left'], start:['insetInlineStart'], end:['insetInlineEnd'],
  };
  return props[match[1]].map((prop: string) => decl(prop, value));
}

export function mapClass(base: string, negative = false): any {
  if (exactMappings[base]) return exactMappings[base].map((item: any) => ({ ...item }));
  const background: Record<string, any> = {
    'bg-auto': [decl('backgroundSize', 'auto')], 'bg-cover': [decl('backgroundSize', 'cover')],
    'bg-contain': [decl('backgroundSize', 'contain')], 'bg-center': [decl('backgroundPosition', 'center')],
    'bg-top': [decl('backgroundPosition', 'top')], 'bg-right': [decl('backgroundPosition', 'right')],
    'bg-bottom': [decl('backgroundPosition', 'bottom')], 'bg-left': [decl('backgroundPosition', 'left')],
    'bg-repeat': [decl('backgroundRepeat', 'repeat')], 'bg-no-repeat': [decl('backgroundRepeat', 'no-repeat')],
    'bg-repeat-x': [decl('backgroundRepeat', 'repeat-x')], 'bg-repeat-y': [decl('backgroundRepeat', 'repeat-y')],
  };
  if (background[base]) return background[base];
  const image = base.match(/^bg-\[(url\(.+\))\]$/);
  if (image) return [decl('backgroundImage', image[1].replace(/_/g, ' '))];
  const handlers = [
    () => mapSpacing(base, negative), () => mapSizing(base), () => mapTypography(base),
    () => mapBorders(base), () => mapEffects(base, negative), () => mapColor(base),
    () => mapInset(base, negative), () => mapLayout(base),
  ];
  for (const handler of handlers) {
    const result: any = handler();
    if (result) return result;
  }
  return null;
}

export { colorToken, darkPairs, pairKey } from './colors';
