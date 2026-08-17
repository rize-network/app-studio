// @ts-nocheck
import { decl } from './shared';

const entries: Record<string, [string, any, string[]?]> = {
  flex: ['display', 'flex'], grid: ['display', 'grid'], block: ['display', 'block'],
  inline: ['display', 'inline'], 'inline-block': ['display', 'inline-block'],
  'inline-flex': ['display', 'inline-flex'], 'inline-grid': ['display', 'inline-grid'],
  hidden: ['display', 'none'], contents: ['display', 'contents'],
  'flow-root': ['display', 'flow-root'], table: ['display', 'table'],
  relative: ['position', 'relative'], absolute: ['position', 'absolute'], fixed: ['position', 'fixed'],
  static: ['position', 'static'], sticky: ['position', 'sticky'],
  'flex-row': ['flexDirection', 'row'], 'flex-row-reverse': ['flexDirection', 'row-reverse'],
  'flex-col': ['flexDirection', 'column'], 'flex-col-reverse': ['flexDirection', 'column-reverse'],
  'flex-wrap': ['flexWrap', 'wrap'], 'flex-wrap-reverse': ['flexWrap', 'wrap-reverse'],
  'flex-nowrap': ['flexWrap', 'nowrap'],
  'items-start': ['alignItems', 'flex-start'], 'items-end': ['alignItems', 'flex-end'],
  'items-center': ['alignItems', 'center'], 'items-baseline': ['alignItems', 'baseline'],
  'items-stretch': ['alignItems', 'stretch'],
  'content-normal': ['alignContent', 'normal'], 'content-center': ['alignContent', 'center'],
  'content-start': ['alignContent', 'flex-start'], 'content-end': ['alignContent', 'flex-end'],
  'content-between': ['alignContent', 'space-between'], 'content-around': ['alignContent', 'space-around'],
  'content-evenly': ['alignContent', 'space-evenly'], 'content-stretch': ['alignContent', 'stretch'],
  'self-auto': ['alignSelf', 'auto'], 'self-start': ['alignSelf', 'flex-start'],
  'self-end': ['alignSelf', 'flex-end'], 'self-center': ['alignSelf', 'center'],
  'self-stretch': ['alignSelf', 'stretch'], 'self-baseline': ['alignSelf', 'baseline'],
  'justify-normal': ['justifyContent', 'normal'], 'justify-start': ['justifyContent', 'flex-start'],
  'justify-end': ['justifyContent', 'flex-end'], 'justify-center': ['justifyContent', 'center'],
  'justify-between': ['justifyContent', 'space-between'], 'justify-around': ['justifyContent', 'space-around'],
  'justify-evenly': ['justifyContent', 'space-evenly'], 'justify-stretch': ['justifyContent', 'stretch'],
  'justify-items-start': ['justifyItems', 'start'], 'justify-items-end': ['justifyItems', 'end'],
  'justify-items-center': ['justifyItems', 'center'], 'justify-items-stretch': ['justifyItems', 'stretch'],
  'justify-self-auto': ['justifySelf', 'auto'], 'justify-self-start': ['justifySelf', 'start'],
  'justify-self-end': ['justifySelf', 'end'], 'justify-self-center': ['justifySelf', 'center'],
  'justify-self-stretch': ['justifySelf', 'stretch'],
  'place-content-center': ['placeContent', 'center'], 'place-content-start': ['placeContent', 'start'],
  'place-content-end': ['placeContent', 'end'], 'place-content-between': ['placeContent', 'space-between'],
  'place-content-around': ['placeContent', 'space-around'], 'place-content-evenly': ['placeContent', 'space-evenly'],
  'place-content-stretch': ['placeContent', 'stretch'],
  'place-items-start': ['placeItems', 'start'], 'place-items-end': ['placeItems', 'end'],
  'place-items-center': ['placeItems', 'center'], 'place-items-stretch': ['placeItems', 'stretch'],
  'place-self-auto': ['placeSelf', 'auto'], 'place-self-start': ['placeSelf', 'start'],
  'place-self-end': ['placeSelf', 'end'], 'place-self-center': ['placeSelf', 'center'], 'place-self-stretch': ['placeSelf', 'stretch'],
  grow: ['flexGrow', 1], 'grow-0': ['flexGrow', 0], shrink: ['flexShrink', 1], 'shrink-0': ['flexShrink', 0],
  'overflow-auto': ['overflow', 'auto'], 'overflow-hidden': ['overflow', 'hidden'],
  'overflow-clip': ['overflow', 'clip'], 'overflow-visible': ['overflow', 'visible'],
  'overflow-scroll': ['overflow', 'scroll'],
  'overflow-x-auto': ['overflowX', 'auto'], 'overflow-x-hidden': ['overflowX', 'hidden'],
  'overflow-x-clip': ['overflowX', 'clip'], 'overflow-x-visible': ['overflowX', 'visible'],
  'overflow-x-scroll': ['overflowX', 'scroll'],
  'overflow-y-auto': ['overflowY', 'auto'], 'overflow-y-hidden': ['overflowY', 'hidden'],
  'overflow-y-clip': ['overflowY', 'clip'], 'overflow-y-visible': ['overflowY', 'visible'],
  'overflow-y-scroll': ['overflowY', 'scroll'],
  'object-contain': ['objectFit', 'contain'], 'object-cover': ['objectFit', 'cover'],
  'object-fill': ['objectFit', 'fill'], 'object-none': ['objectFit', 'none'],
  'object-scale-down': ['objectFit', 'scale-down'],
  isolate: ['isolation', 'isolate'], 'isolation-auto': ['isolation', 'auto'],
  visible: ['visibility', 'visible'], invisible: ['visibility', 'hidden'], collapse: ['visibility', 'collapse'],
  'pointer-events-none': ['pointerEvents', 'none'], 'pointer-events-auto': ['pointerEvents', 'auto'],
  'select-none': ['userSelect', 'none'], 'select-text': ['userSelect', 'text'],
  'select-all': ['userSelect', 'all'], 'select-auto': ['userSelect', 'auto'],
};

for (const value of ['auto','default','pointer','wait','text','move','help','not-allowed','none','context-menu','progress','crosshair','grab','grabbing','col-resize','row-resize','ew-resize','ns-resize','nesw-resize','nwse-resize','zoom-in','zoom-out']) {
  entries[`cursor-${value}`] = ['cursor', value];
}

export const layoutExact = Object.fromEntries(
  Object.entries(entries).map(([key, [prop, value, cssProps]]) => [key, [decl(prop, value, cssProps)]])
);

export function mapLayout(base: string) {
  let match = base.match(/^grid-cols-(\d+)$/);
  if (match) return [decl('gridTemplateColumns', `repeat(${match[1]}, minmax(0, 1fr))`)];
  match = base.match(/^grid-cols-\[(.+)\]$/);
  if (match) return [decl('gridTemplateColumns', match[1].replace(/_/g, ' '))];
  if (base === 'grid-cols-none') return [decl('gridTemplateColumns', 'none')];
  match = base.match(/^grid-rows-(\d+)$/);
  if (match) return [decl('gridTemplateRows', `repeat(${match[1]}, minmax(0, 1fr))`)];
  match = base.match(/^grid-rows-\[(.+)\]$/);
  if (match) return [decl('gridTemplateRows', match[1].replace(/_/g, ' '))];
  if (base === 'grid-rows-none') return [decl('gridTemplateRows', 'none')];
  match = base.match(/^col-span-(\d+)$/);
  if (match) return [decl('gridColumn', `span ${match[1]} / span ${match[1]}`)];
  if (base === 'col-span-full') return [decl('gridColumn', '1 / -1')];
  match = base.match(/^row-span-(\d+)$/);
  if (match) return [decl('gridRow', `span ${match[1]} / span ${match[1]}`)];
  if (base === 'row-span-full') return [decl('gridRow', '1 / -1')];
  match = base.match(/^(?:z|order)-(-?\d+)$/);
  if (match) return [decl(base.startsWith('z-') ? 'zIndex' : 'order', Number(match[1]))];
  if (base === 'z-auto') return [decl('zIndex', 'auto')];
  if (base === 'order-first') return [decl('order', -9999)];
  if (base === 'order-last') return [decl('order', 9999)];
  if (base === 'order-none') return [decl('order', 0)];
  match = base.match(/^grid-flow-(row|col|dense|row-dense|col-dense)$/);
  if (match) return [decl('gridAutoFlow', match[1].replace('col', 'column').replace('-', ' '))];
  match = base.match(/^auto-(cols|rows)-(auto|min|max|fr)$/);
  if (match) {
    const value: any = { auto:'auto', min:'min-content', max:'max-content', fr:'minmax(0, 1fr)' };
    return [decl(match[1] === 'cols' ? 'gridAutoColumns' : 'gridAutoRows', value[match[2]])];
  }
  return null;
}
