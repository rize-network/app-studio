// @ts-nocheck
import { arbitrary, decl, px } from './shared';

const radii: Record<string, number | string> = {
  none: 0, sm: 2, DEFAULT: 4, md: 6, lg: 8, xl: 12, '2xl': 16, '3xl': 24, full: 9999,
};

export const borderExact: Record<string, any> = {
  border: [decl('borderWidth', 1)], 'border-0': [decl('borderWidth', 0)], 'border-2': [decl('borderWidth', 2)],
  'border-4': [decl('borderWidth', 4)], 'border-8': [decl('borderWidth', 8)],
  'border-solid': [decl('borderStyle', 'solid')], 'border-dashed': [decl('borderStyle', 'dashed')],
  'border-dotted': [decl('borderStyle', 'dotted')], 'border-double': [decl('borderStyle', 'double')],
  'border-hidden': [decl('borderStyle', 'hidden')], 'border-none': [decl('borderStyle', 'none')],
  rounded: [decl('borderRadius', 4)],
  outline: [decl('outlineStyle', 'solid'), decl('outlineWidth', 1)], 'outline-none': [decl('outline', '2px solid transparent'), decl('outlineOffset', 2)],
};

export function mapBorders(base: string) {
  let arbitraryWidth = base.match(/^border-(\[.+\])$/);
  if (arbitraryWidth) {
    const value = arbitrary(arbitraryWidth[1]);
    if (typeof value === 'number' || (typeof value === 'string' && /^-?\d+(?:\.\d+)?(?:px|rem|em)$/.test(value))) return [decl('borderWidth', value)];
  }
  let match = base.match(/^border-([trblxy])(?:-(\d+))?$/);
  if (match) {
    const width = match[2] === undefined ? 1 : Number(match[2]);
    const sides: any = { t:['borderTopWidth'], r:['borderRightWidth'], b:['borderBottomWidth'], l:['borderLeftWidth'], x:['borderLeftWidth','borderRightWidth'], y:['borderTopWidth','borderBottomWidth'] };
    return sides[match[1]].map((prop: string) => decl(prop, width));
  }
  match = base.match(/^rounded(?:-([trbl]|t[lr]|b[lr]))?-(.+)$/);
  if (match) {
    const value = radii[match[2]] ?? arbitrary(match[2]);
    if (value === null || value === undefined) return null;
    const props: any = {
      t:['borderTopLeftRadius','borderTopRightRadius'], r:['borderTopRightRadius','borderBottomRightRadius'],
      b:['borderBottomLeftRadius','borderBottomRightRadius'], l:['borderTopLeftRadius','borderBottomLeftRadius'],
      tl:['borderTopLeftRadius'], tr:['borderTopRightRadius'], bl:['borderBottomLeftRadius'], br:['borderBottomRightRadius'],
    };
    return (props[match[1]] || ['borderRadius']).map((prop: string) => decl(prop, value));
  }
  match = base.match(/^outline-offset-(.+)$/);
  if (match) {
    const value = arbitrary(match[1]) ?? px(match[1]);
    return value === null ? null : [decl('outlineOffset', value)];
  }
  match = base.match(/^outline-(\d+)$/);
  if (match) return [decl('outlineWidth', Number(match[1]))];
  match = base.match(/^divide-([xy])(?:-(\d+))?$/);
  if (match) return [decl(match[1] === 'x' ? 'columnRuleWidth' : 'rowRuleWidth', Number(match[2] || 1))];
  return null;
}
