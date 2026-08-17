// @ts-nocheck
import { decl } from './shared';

const palettes: Record<string, string> = {
  gray: 'coolGray', zinc: 'gray', slate: 'slate', neutral: 'trueGray', stone: 'warmGray',
  red: 'red', orange: 'orange', amber: 'amber', yellow: 'yellow', lime: 'lime', green: 'green',
  emerald: 'emerald', teal: 'teal', cyan: 'cyan', sky: 'blue', blue: 'blue', indigo: 'indigo',
  violet: 'violet', purple: 'purple', fuchsia: 'fuchsia', pink: 'pink', rose: 'rose',
};

export function colorToken(raw: string): { value: string; approximation?: string } | null {
  if (raw === 'transparent' || raw === 'current' || raw === 'inherit') {
    return { value: raw === 'current' ? 'currentColor' : raw };
  }
  if (raw === 'white' || raw === 'black') return { value: raw };
  const singletonAlpha = raw.match(/^(white|black)\/(\d+)$/);
  if (singletonAlpha && Number(singletonAlpha[2]) <= 100) {
    const channel = singletonAlpha[1] === 'white' ? 255 : 0;
    return { value: `rgba(${channel}, ${channel}, ${channel}, ${Number(singletonAlpha[2]) / 100})` };
  }
  const arbitrary = raw.match(/^\[(.+)\](?:\/(\d+))?$/);
  if (arbitrary) return { value: arbitrary[1].replace(/_/g, ' ') };
  const match = raw.match(/^([a-z]+)-(\d+)(?:\/(\d+))?$/);
  if (!match || !palettes[match[1]]) return null;
  const shade = match[2] === '950' ? '900' : match[2];
  if (!['50','100','200','300','400','500','600','700','800','900'].includes(shade)) return null;
  const alpha = match[3] ? `-${Math.round(Number(match[3]) * 10)}` : '';
  return {
    value: `color-${palettes[match[1]]}-${shade}${alpha}`,
    approximation: match[2] === '950' ? `${raw}: shade 950 mapped to 900` : undefined,
  };
}

export function mapColor(base: string) {
  const match = base.match(/^(bg|text|border|ring|outline|decoration|divide)-(.+)$/);
  if (!match) return null;
  const token = colorToken(match[2]);
  if (!token) return null;
  const prop: Record<string, string> = {
    bg: 'backgroundColor', text: 'color', border: 'borderColor', ring: 'outlineColor',
    outline: 'outlineColor', decoration: 'textDecorationColor', divide: 'borderColor',
  };
  const result: any = [decl(prop[match[1]], token.value)];
  result.approximation = token.approximation;
  return result;
}

/** Common semantic pairs. The output tokens auto-switch through ThemeProvider. */
export const darkPairs: Record<string, string> = {
  'backgroundColor:white|coolGray-900': 'theme-surface',
  'backgroundColor:white|gray-900': 'theme-surface',
  'backgroundColor:coolGray-50|coolGray-900': 'theme-surface',
  'backgroundColor:gray-50|gray-900': 'theme-surface',
  'backgroundColor:white|black': 'theme-canvas',
  'color:coolGray-900|white': 'theme-text',
  'color:gray-900|white': 'theme-text',
  'color:black|white': 'theme-text',
  'color:coolGray-500|coolGray-400': 'theme-muted',
  'color:gray-500|gray-400': 'theme-muted',
  'borderColor:coolGray-200|coolGray-700': 'theme-border',
  'borderColor:gray-200|gray-700': 'theme-border',
};

export function pairKey(prop: string, light: string, dark: string) {
  const clean = (value: string) => value.replace(/^color-/, '');
  return `${prop}:${clean(light)}|${clean(dark)}`;
}
