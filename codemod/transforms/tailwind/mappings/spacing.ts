// @ts-nocheck
import { arbitrary, decl, px, withNegative } from './shared';

const physical: Record<string, [string, string[]]> = {
  p: ['padding', ['paddingTop','paddingRight','paddingBottom','paddingLeft']],
  px: ['paddingHorizontal', ['paddingLeft','paddingRight']],
  py: ['paddingVertical', ['paddingTop','paddingBottom']],
  pt: ['paddingTop', ['paddingTop']], pr: ['paddingRight', ['paddingRight']],
  pb: ['paddingBottom', ['paddingBottom']], pl: ['paddingLeft', ['paddingLeft']],
  ps: ['paddingInlineStart', ['paddingInlineStart']], pe: ['paddingInlineEnd', ['paddingInlineEnd']],
  m: ['margin', ['marginTop','marginRight','marginBottom','marginLeft']],
  mx: ['marginHorizontal', ['marginLeft','marginRight']],
  my: ['marginVertical', ['marginTop','marginBottom']],
  mt: ['marginTop', ['marginTop']], mr: ['marginRight', ['marginRight']],
  mb: ['marginBottom', ['marginBottom']], ml: ['marginLeft', ['marginLeft']],
  ms: ['marginInlineStart', ['marginInlineStart']], me: ['marginInlineEnd', ['marginInlineEnd']],
  gap: ['gap', ['rowGap','columnGap']], 'gap-x': ['columnGap', ['columnGap']], 'gap-y': ['rowGap', ['rowGap']],
  'space-x': ['columnGap', ['columnGap']], 'space-y': ['rowGap', ['rowGap']],
};

export function mapSpacing(base: string, negative = false) {
  const match = base.match(/^(space-[xy]|gap-[xy]|gap|p[trblxyse]?|m[trblxyse]?)-(.+)$/);
  if (!match || !physical[match[1]]) return null;
  let value = arbitrary(match[2]);
  if (value === null) value = px(match[2]);
  if (value === null && match[2] === 'auto' && match[1].startsWith('m')) value = 'auto';
  if (value === null) return null;
  value = withNegative(value, negative);
  const [prop, cssProps] = physical[match[1]];
  return [decl(prop, value, cssProps)];
}
