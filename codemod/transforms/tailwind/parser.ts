// @ts-nocheck
import type { Modifier, ParsedClass } from './types';
import { mapClass } from './mappings';

const responsive = new Set(['sm','md','lg','xl','2xl']);
const states: Record<string, string> = {
  hover:'hover', focus:'focus', active:'active', visited:'visited', disabled:'disabled', enabled:'enabled',
  checked:'checked', invalid:'invalid', valid:'valid', required:'required', optional:'optional', selected:'selected',
  target:'target', first:'firstChild', last:'lastChild', only:'onlyChild', 'first-of-type':'firstOfType',
  'last-of-type':'lastOfType', empty:'empty', 'focus-visible':'focusVisible', 'focus-within':'focusWithin',
  placeholder:'placeholder', before:'before', after:'after', selection:'selection', marker:'marker', backdrop:'backdrop',
};

export function splitModifiers(token: string): string[] {
  const result: string[] = [];
  let current = '';
  let square = 0;
  let round = 0;
  let quote = '';
  for (let i = 0; i < token.length; i++) {
    const char = token[i];
    if (quote) {
      current += char;
      if (char === quote && token[i - 1] !== '\\') quote = '';
      continue;
    }
    if (char === '"' || char === "'") quote = char;
    else if (char === '[') square++;
    else if (char === ']') square = Math.max(0, square - 1);
    else if (char === '(') round++;
    else if (char === ')') round = Math.max(0, round - 1);
    if (char === ':' && square === 0 && round === 0) {
      result.push(current);
      current = '';
    } else current += char;
  }
  result.push(current);
  return result;
}

function modifier(raw: string): Modifier {
  if (responsive.has(raw)) return { kind: 'responsive', bp: raw };
  if (states[raw]) return { kind: 'state', name: states[raw] };
  if (raw === 'dark') return { kind: 'dark' };
  let match = raw.match(/^group-(.+)$/);
  if (match && states[match[1]]) return { kind: 'group', name: states[match[1]] };
  match = raw.match(/^peer-(.+)$/);
  if (match && states[match[1]]) return { kind: 'peer', name: states[match[1]] };
  if (/^aria-/.test(raw)) return { kind: 'aria', raw };
  if (/^data-/.test(raw)) return { kind: 'data', raw };
  return { kind: 'arbitrary-variant', raw };
}

export function parseClass(raw: string): ParsedClass {
  const parts = splitModifiers(raw);
  let base = parts.pop() || '';
  let important = false;
  let negative = false;
  if (base.startsWith('!')) { important = true; base = base.slice(1); }
  if (base.startsWith('-')) { negative = true; base = base.slice(1); }
  const decls: any = mapClass(base, negative);
  return {
    raw, base, negative, important, modifiers: parts.map(modifier), decls,
    approximation: decls?.approximation,
  };
}

export function tokenize(value: string): string[] {
  const result: string[] = [];
  let current = '';
  let square = 0;
  let round = 0;
  let quote = '';
  for (let i = 0; i < value.length; i++) {
    const char = value[i];
    if (quote) {
      current += char;
      if (char === quote && value[i - 1] !== '\\') quote = '';
      continue;
    }
    if (char === '"' || char === "'") quote = char;
    else if (char === '[') square++;
    else if (char === ']') square = Math.max(0, square - 1);
    else if (char === '(') round++;
    else if (char === ')') round = Math.max(0, round - 1);
    if (/\s/.test(char) && square === 0 && round === 0) {
      if (current) result.push(current);
      current = '';
    } else current += char;
  }
  if (current) result.push(current);
  return result;
}
