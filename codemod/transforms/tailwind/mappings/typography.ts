// @ts-nocheck
import { arbitrary, decl, px } from './shared';

const textSizes: Record<string, [number, number]> = {
  xs: [12, 1.333], sm: [14, 1.429], base: [16, 1.5], lg: [18, 1.556], xl: [20, 1.4],
  '2xl': [24, 1.333], '3xl': [30, 1.2], '4xl': [36, 1.111], '5xl': [48, 1],
  '6xl': [60, 1], '7xl': [72, 1], '8xl': [96, 1], '9xl': [128, 1],
};
const weights: Record<string, number> = {
  thin: 100, extralight: 200, light: 300, normal: 400, medium: 500,
  semibold: 600, bold: 700, extrabold: 800, black: 900,
};
const leading: Record<string, number> = {
  none: 1, tight: 1.25, snug: 1.375, normal: 1.5, relaxed: 1.625, loose: 2,
};
const tracking: Record<string, string> = {
  tighter: '-0.05em', tight: '-0.025em', normal: '0em', wide: '0.025em', wider: '0.05em', widest: '0.1em',
};

export const typographyExact: Record<string, any> = {
  'text-left': [decl('textAlign', 'left')], 'text-center': [decl('textAlign', 'center')],
  'text-right': [decl('textAlign', 'right')], 'text-justify': [decl('textAlign', 'justify')],
  'text-start': [decl('textAlign', 'start')], 'text-end': [decl('textAlign', 'end')],
  italic: [decl('fontStyle', 'italic')], 'not-italic': [decl('fontStyle', 'normal')],
  underline: [decl('textDecorationLine', 'underline')], overline: [decl('textDecorationLine', 'overline')],
  'line-through': [decl('textDecorationLine', 'line-through')], 'no-underline': [decl('textDecorationLine', 'none')],
  uppercase: [decl('textTransform', 'uppercase')], lowercase: [decl('textTransform', 'lowercase')],
  capitalize: [decl('textTransform', 'capitalize')], 'normal-case': [decl('textTransform', 'none')],
  truncate: [decl('overflow', 'hidden'), decl('textOverflow', 'ellipsis'), decl('whiteSpace', 'nowrap')],
  'text-ellipsis': [decl('textOverflow', 'ellipsis')], 'text-clip': [decl('textOverflow', 'clip')],
  'whitespace-normal': [decl('whiteSpace', 'normal')], 'whitespace-nowrap': [decl('whiteSpace', 'nowrap')],
  'whitespace-pre': [decl('whiteSpace', 'pre')], 'whitespace-pre-line': [decl('whiteSpace', 'pre-line')],
  'whitespace-pre-wrap': [decl('whiteSpace', 'pre-wrap')], 'whitespace-break-spaces': [decl('whiteSpace', 'break-spaces')],
  'break-normal': [decl('overflowWrap', 'normal'), decl('wordBreak', 'normal')],
  'break-words': [decl('overflowWrap', 'break-word')], 'break-all': [decl('wordBreak', 'break-all')],
  'break-keep': [decl('wordBreak', 'keep-all')],
  'antialiased': [decl('WebkitFontSmoothing', 'antialiased'), decl('MozOsxFontSmoothing', 'grayscale')],
  'subpixel-antialiased': [decl('WebkitFontSmoothing', 'auto'), decl('MozOsxFontSmoothing', 'auto')],
};

export function mapTypography(base: string) {
  let match = base.match(/^text-(.+)$/);
  if (match && textSizes[match[1]]) {
    const [fontSize, lineHeight] = textSizes[match[1]];
    return [decl('fontSize', fontSize), decl('lineHeight', lineHeight)];
  }
  match = base.match(/^text-(\[.+\])$/);
  if (match) {
    const value = arbitrary(match[1]);
    if (typeof value === 'number' || (typeof value === 'string' && /^(?:-?\d|calc\(|clamp\(|min\(|max\(|var\().*(?:px|rem|em|vw|vh|%|\))$/.test(value))) return [decl('fontSize', value)];
  }
  match = base.match(/^font-(.+)$/);
  if (match && weights[match[1]]) return [decl('fontWeight', weights[match[1]])];
  if (match && ['sans','serif','mono'].includes(match[1])) {
    const family = match[1] === 'sans' ? 'ui-sans-serif, system-ui, sans-serif' : match[1] === 'serif' ? 'ui-serif, Georgia, serif' : 'ui-monospace, monospace';
    return [decl('fontFamily', family)];
  }
  if (match && match[1].startsWith('[')) return [decl('fontFamily', arbitrary(match[1]))];
  match = base.match(/^leading-(.+)$/);
  if (match) {
    const value = leading[match[1]] ?? arbitrary(match[1]) ?? px(match[1]);
    return value === null ? null : [decl('lineHeight', value)];
  }
  match = base.match(/^tracking-(.+)$/);
  if (match) {
    const value = tracking[match[1]] ?? arbitrary(match[1]);
    return value === null ? null : [decl('letterSpacing', value)];
  }
  match = base.match(/^line-clamp-(\d+)$/);
  if (match) return [decl('lineClamp', Number(match[1]))];
  if (base === 'line-clamp-none') return [decl('lineClamp', 'none')];
  match = base.match(/^decoration-(solid|double|dotted|dashed|wavy)$/);
  if (match) return [decl('textDecorationStyle', match[1])];
  match = base.match(/^decoration-(\d+)$/);
  if (match) return [decl('textDecorationThickness', Number(match[1]))];
  match = base.match(/^underline-offset-(.+)$/);
  if (match) {
    const value = match[1] === 'auto' ? 'auto' : arbitrary(match[1]) ?? px(match[1]);
    return value === null ? null : [decl('textUnderlineOffset', value)];
  }
  return null;
}
