/* eslint-disable @typescript-eslint/no-unused-vars */
// animationHelpers.ts
import { styleObjectToCss } from '../utils/style';

let keyframesCounter = 0;
const keyframesCache = new Map<string, string>();

export const generateKeyframes = (
  animation: any
): { keyframesName: string; keyframes: string } => {
  // Exclure les propriétés qui ne font pas partie des keyframes
  const {
    duration,
    timingFunction,
    delay,
    iterationCount,
    direction,
    fillMode,
    playState,
    ...keyframesDef
  } = animation;

  // Générer une clé pour le cache basée sur les keyframes
  const animationConfigString = JSON.stringify(keyframesDef);

  if (keyframesCache.has(animationConfigString)) {
    const keyframesName = keyframesCache.get(animationConfigString)!;
    return { keyframesName, keyframes: '' }; // Les keyframes existent déjà
  }

  const keyframesName = `animation-${keyframesCounter++}`;
  keyframesCache.set(animationConfigString, keyframesName);

  const keyframesContent: string[] = [];

  // Trier les clés pour assurer un ordre cohérent
  const keyframeKeys = Object.keys(keyframesDef).sort((a, b) => {
    const getPercentage = (key: string): number => {
      if (key === 'from') return 0;
      if (key === 'to' || key === 'enter') return 100;
      return parseInt(key.replace('%', ''), 10);
    };
    return getPercentage(a) - getPercentage(b);
  });

  keyframeKeys.forEach((key) => {
    const cssKey = key === 'enter' ? 'to' : key; // Remplacer 'enter' par 'to'
    const styles = keyframesDef[key];
    keyframesContent.push(`${cssKey} { ${styleObjectToCss(styles)} }`);
  });

  const keyframes = `
    @keyframes ${keyframesName} {
      ${keyframesContent.join('\n')}
    }
  `;

  return { keyframesName, keyframes };
};
