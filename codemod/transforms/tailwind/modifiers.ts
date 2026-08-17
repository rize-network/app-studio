// @ts-nocheck
import type { ParsedClass } from './types';

export const STATE_PROPS: Record<string, string> = {
  hover:'_hover', focus:'_focus', active:'_active', visited:'_visited', disabled:'_disabled', enabled:'_enabled',
  checked:'_checked', invalid:'_invalid', valid:'_valid', required:'_required', optional:'_optional', selected:'_selected',
  target:'_target', firstChild:'_firstChild', lastChild:'_lastChild', onlyChild:'_onlyChild', firstOfType:'_firstOfType',
  lastOfType:'_lastOfType', empty:'_empty', focusVisible:'_focusVisible', focusWithin:'_focusWithin', placeholder:'_placeholder',
  before:'_before', after:'_after', selection:'_selection', marker:'_marker', backdrop:'_backdrop',
};

export const GROUP_PROPS: Record<string, string> = { hover:'_groupHover', focus:'_groupFocus', active:'_groupActive', disabled:'_groupDisabled' };
export const PEER_PROPS: Record<string, string> = { hover:'_peerHover', focus:'_peerFocus', active:'_peerActive', disabled:'_peerDisabled', checked:'_peerChecked' };

export type Placement =
  | { kind: 'base' }
  | { kind: 'state'; prop: string }
  | { kind: 'responsive'; bp: string }
  | { kind: 'dark' }
  | { kind: 'residual'; reason: string };

export function place(parsed: ParsedClass, context: { group: boolean; peer: boolean; variants?: Set<string> }): Placement {
  const responsive = parsed.modifiers.filter((item) => item.kind === 'responsive');
  const state = parsed.modifiers.filter((item) => item.kind === 'state' || item.kind === 'group' || item.kind === 'peer');
  const dark = parsed.modifiers.filter((item) => item.kind === 'dark');
  const attributeVariants = parsed.modifiers.filter((item) => item.kind === 'aria' || item.kind === 'data');
  const unsupported = parsed.modifiers.filter((item) => item.kind === 'arbitrary-variant');
  if (unsupported.length || responsive.length > 1 || state.length > 1 || dark.length > 1) return { kind: 'residual', reason: 'unsupported-modifier' };
  if (attributeVariants.length) {
    if (parsed.modifiers.length === 1 && context.variants?.has((attributeVariants[0] as any).raw)) return { kind: 'base' };
    return { kind: 'residual', reason: 'unsupported-modifier' };
  }
  if (responsive.length && state.length) return { kind: 'residual', reason: 'combined-responsive-state' };
  if (dark.length && (responsive.length || state.length)) return { kind: 'residual', reason: 'unsupported-modifier' };
  if (dark.length) return { kind: 'dark' };
  if (responsive.length) return { kind: 'responsive', bp: responsive[0].bp };
  if (state.length) {
    const item: any = state[0];
    if (item.kind === 'state' && STATE_PROPS[item.name]) return { kind: 'state', prop: STATE_PROPS[item.name] };
    if (item.kind === 'group') return context.group && GROUP_PROPS[item.name] ? { kind: 'state', prop: GROUP_PROPS[item.name] } : { kind: 'residual', reason: 'group-marker-unproven' };
    if (item.kind === 'peer') return context.peer && PEER_PROPS[item.name] ? { kind: 'state', prop: PEER_PROPS[item.name] } : { kind: 'residual', reason: 'peer-marker-unproven' };
    return { kind: 'residual', reason: 'unsupported-modifier' };
  }
  return { kind: 'base' };
}

const tailwindMin: Record<string, number> = { sm:640, md:768, lg:1024, xl:1280, '2xl':1536 };
const appBoundaries: Array<[string, number]> = [['sm',340],['md',560],['lg',1080],['xl',1300]];

export function responsiveKeys(bp: string, strategy: string): { keys: string[]; approximation?: string } {
  if (strategy === 'devices') {
    const device = bp === 'sm' ? 'mobile' : bp === 'md' ? 'tablet' : 'desktop';
    return { keys: [device], approximation: `${bp}: Tailwind min-width approximated by App Studio ${device}` };
  }
  const min = tailwindMin[bp];
  let keys = appBoundaries.filter(([, boundary]) => boundary >= min).map(([key]) => key);
  if (!keys.length) keys = ['xl'];
  const exact = appBoundaries.some(([, boundary]) => boundary === min);
  return { keys, approximation: exact ? undefined : `${bp} (${min}px) approximated across bounded App Studio ranges: ${keys.join(', ')}` };
}
