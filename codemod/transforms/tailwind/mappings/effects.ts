// @ts-nocheck
import { arbitrary, decl, fraction, px, withNegative } from './shared';

const shadows: Record<string, string> = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)', inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)', none: 'none',
};
const blur: Record<string, number> = { none:0, sm:4, DEFAULT:8, md:12, lg:16, xl:24, '2xl':40, '3xl':64 };
const transition: Record<string, string> = {
  DEFAULT: 'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter 150ms ease',
  none: 'none', all: 'all 150ms ease', colors: 'color, background-color, border-color, text-decoration-color, fill, stroke 150ms ease',
  opacity: 'opacity 150ms ease', shadow: 'box-shadow 150ms ease', transform: 'transform 150ms ease',
};

export const effectsExact: Record<string, any> = {
  transform: [decl('transform', 'none')], 'transform-none': [decl('transform', 'none')],
  'origin-center': [decl('transformOrigin', 'center')], 'origin-top': [decl('transformOrigin', 'top')],
  'origin-top-right': [decl('transformOrigin', 'top right')], 'origin-right': [decl('transformOrigin', 'right')],
  'origin-bottom-right': [decl('transformOrigin', 'bottom right')], 'origin-bottom': [decl('transformOrigin', 'bottom')],
  'origin-bottom-left': [decl('transformOrigin', 'bottom left')], 'origin-left': [decl('transformOrigin', 'left')],
  'origin-top-left': [decl('transformOrigin', 'top left')],
};

export function mapEffects(base: string, negative = false) {
  let match = base.match(/^opacity-(\d+)$/);
  if (match && Number(match[1]) <= 100) return [decl('opacity', Number(match[1]) / 100)];
  match = base.match(/^ring(?:-(0|1|2|4|8))?$/);
  if (match) return [decl('boxShadow', `0 0 0 ${Number(match[1] || 3)}px currentColor`)];
  match = base.match(/^ring-(\[.+\])$/);
  if (match) {
    const width = arbitrary(match[1]);
    if (typeof width === 'number' || (typeof width === 'string' && /^\d+(?:\.\d+)?(?:px|rem|em)$/.test(width))) return [decl('boxShadow', `0 0 0 ${typeof width === 'number' ? `${width}px` : width} currentColor`)];
  }
  if (base === 'ring-inset') return [decl('boxShadow', 'inset 0 0 0 3px currentColor')];
  match = base.match(/^shadow(?:-(.+))?$/);
  if (match) {
    const key = match[1] || 'DEFAULT';
    const value = shadows[key] ?? arbitrary(key);
    return value == null ? null : [decl('boxShadow', value)];
  }
  match = base.match(/^(?:backdrop-)?blur(?:-(.+))?$/);
  if (match) {
    const key = match[1] || 'DEFAULT';
    const value = blur[key] ?? arbitrary(key);
    if (value == null) return null;
    return [decl(base.startsWith('backdrop-') ? 'backdropFilter' : 'filter', `blur(${typeof value === 'number' ? `${value}px` : value})`)];
  }
  match = base.match(/^transition(?:-(.+))?$/);
  if (match) {
    const key = match[1] || 'DEFAULT';
    const value = transition[key] ?? (key.startsWith('[') ? `${arbitrary(key)} 150ms ease` : null);
    return value == null ? null : [decl('transition', value)];
  }
  match = base.match(/^duration-(\d+)$/);
  if (match) return [decl('transitionDuration', `${match[1]}ms`)];
  match = base.match(/^delay-(\d+)$/);
  if (match) return [decl('transitionDelay', `${match[1]}ms`)];
  match = base.match(/^ease-(linear|in|out|in-out)$/);
  if (match) return [decl('transitionTimingFunction', match[1] === 'in' ? 'ease-in' : match[1] === 'out' ? 'ease-out' : match[1] === 'in-out' ? 'ease-in-out' : 'linear')];
  match = base.match(/^animate-(spin|ping|pulse|bounce|fade-in|fade-out)$/);
  if (match) {
    const method: any = { spin:'rotate', ping:'pulse', pulse:'pulse', bounce:'bounce', 'fade-in':'fadeIn', 'fade-out':'fadeOut' };
    return [decl('animate', { kind: 'expression', code: `Animation.${method[match[1]]}()` })];
  }
  match = base.match(/^(scale|rotate|translate-[xy]|skew-[xy])-(.+)$/);
  if (match) {
    const isArbitrary = match[2].startsWith('[');
    let raw: any = arbitrary(match[2]);
    if (raw == null && match[1].startsWith('translate')) raw = fraction(match[2]) ?? px(match[2]);
    if (raw == null) raw = Number(match[2]);
    if (raw == null || (typeof raw === 'number' && !Number.isFinite(raw))) return null;
    const sign = negative ? -1 : 1;
    if (match[1] === 'scale') return [decl('transform', `scale(${isArbitrary ? raw : Number(raw) / 100})`)];
    if (match[1] === 'rotate') return [decl('transform', `rotate(${typeof raw === 'number' ? `${raw * sign}deg` : withNegative(raw, negative)})`)];
    if (match[1].startsWith('translate')) {
      const translated = withNegative(raw, negative);
      return [decl('transform', `${match[1] === 'translate-x' ? 'translateX' : 'translateY'}(${typeof translated === 'number' ? `${translated}px` : translated})`)];
    }
    return [decl('transform', `${match[1] === 'skew-x' ? 'skewX' : 'skewY'}(${typeof raw === 'number' ? `${raw * sign}deg` : withNegative(raw, negative)})`)];
  }
  return null;
}
