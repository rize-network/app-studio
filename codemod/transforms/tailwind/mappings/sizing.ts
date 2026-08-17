// @ts-nocheck
import { arbitrary, decl, fraction, px } from './shared';

const specials: Record<string, any> = {
  auto: 'auto', full: '100%', screen: '100vw', svw: '100svw', lvw: '100lvw', dvw: '100dvw',
  min: 'min-content', max: 'max-content', fit: 'fit-content',
};
const maxWidths: Record<string, any> = {
  none:'none', xs:320, sm:384, md:448, lg:512, xl:576, '2xl':672, '3xl':768,
  '4xl':896, '5xl':1024, '6xl':1152, '7xl':1280, prose:'65ch',
};

function sizeValue(raw: string, axis: 'w' | 'h') {
  if (specials[raw] !== undefined) {
    if (raw === 'screen') return axis === 'w' ? '100vw' : '100vh';
    if (/[sld]vw/.test(raw) && axis === 'h') return raw.replace('vw', 'vh').replace(/^/, '100');
    return specials[raw];
  }
  return arbitrary(raw) ?? fraction(raw) ?? px(raw);
}

export function mapSizing(base: string) {
  let namedMax = base.match(/^max-w-(none|xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|prose)$/);
  if (namedMax) return [decl('maxWidth', maxWidths[namedMax[1]])];
  let screenMax = base.match(/^max-w-screen-(sm|md|lg|xl|2xl)$/);
  if (screenMax) return [decl('maxWidth', ({ sm:640, md:768, lg:1024, xl:1280, '2xl':1536 } as any)[screenMax[1]])];
  if (base === 'flex-1') return [decl('flex', '1 1 0%')];
  if (base === 'flex-auto') return [decl('flex', '1 1 auto')];
  if (base === 'flex-initial') return [decl('flex', '0 1 auto')];
  if (base === 'flex-none') return [decl('flex', 'none')];
  if (base === 'basis-auto') return [decl('flexBasis', 'auto')];
  if (base === 'basis-full') return [decl('flexBasis', '100%')];
  let match = base.match(/^basis-(.+)$/);
  if (match) {
    const value = arbitrary(match[1]) ?? fraction(match[1]) ?? px(match[1]);
    return value === null ? null : [decl('flexBasis', value)];
  }
  match = base.match(/^(min-|max-)?([wh])-(.+)$/);
  if (match) {
    const value = sizeValue(match[3], match[2]);
    if (value === null) return null;
    const prop = `${match[1] || ''}${match[2] === 'w' ? 'width' : 'height'}`
      .replace('min-width', 'minWidth').replace('max-width', 'maxWidth')
      .replace('min-height', 'minHeight').replace('max-height', 'maxHeight');
    return [decl(prop, value)];
  }
  match = base.match(/^size-(.+)$/);
  if (match) {
    const value = sizeValue(match[1], 'w');
    return value === null ? null : [decl('width', value), decl('height', value)];
  }
  match = base.match(/^aspect-(square|video|\[.+\])$/);
  if (match) {
    const value = match[1] === 'square' ? 1 : match[1] === 'video' ? '16 / 9' : arbitrary(match[1]);
    return [decl('aspectRatio', value)];
  }
  return null;
}
