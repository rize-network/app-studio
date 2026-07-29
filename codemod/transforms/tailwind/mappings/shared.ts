// @ts-nocheck
import type { Decl } from '../types';

export const decl = (prop: string, value: any, cssProps: string[] = [prop]): Decl => ({
  prop,
  value,
  cssProps,
});

export const px = (value: string): number | string | null => {
  if (value === 'px') return 1;
  const number = Number(value);
  return Number.isFinite(number) ? number * 4 : null;
};

export const arbitrary = (value: string): string | number | null => {
  const match = value.match(/^\[(.*)\]$/s);
  if (!match) return null;
  const decoded = match[1].replace(/_/g, ' ');
  if (/^-?\d+(?:\.\d+)?px$/.test(decoded)) return Number(decoded.slice(0, -2));
  if (/^-?\d+(?:\.\d+)?$/.test(decoded)) return Number(decoded);
  return decoded;
};

export const withNegative = (value: any, negative: boolean): any => {
  if (!negative) return value;
  if (typeof value === 'number') return -value;
  if (typeof value !== 'string') return value;
  if (/^-/.test(value)) return value.slice(1);
  if (/^\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw)$/.test(value)) return `-${value}`;
  return `calc(${value} * -1)`;
};

export const fraction = (value: string): string | null => {
  const match = value.match(/^(\d+)\/(\d+)$/);
  if (!match || Number(match[2]) === 0) return null;
  return `${(Number(match[1]) / Number(match[2])) * 100}%`;
};

export const css = (...props: string[]) => props;
