// animationHelpers.ts
import { styleObjectToCss } from './style';

let keyframesCounter = 0;
const keyframesCache = new Map<string, string>();

export const generateKeyframes = (
  animation: any
): { keyframesName: string; keyframes: string } => {
  const { from, enter, leave } = animation;
  const animationConfigString = JSON.stringify({ from, enter, leave });

  if (keyframesCache.has(animationConfigString)) {
    const keyframesName = keyframesCache.get(animationConfigString)!;
    return { keyframesName, keyframes: '' };
  }

  const keyframesName = `animation-${keyframesCounter++}`;
  keyframesCache.set(animationConfigString, keyframesName);

  const keyframesContent: string[] = [];

  if (from) {
    keyframesContent.push(`from { ${styleObjectToCss(from)} }`);
  }

  if (enter) {
    keyframesContent.push(`to { ${styleObjectToCss(enter)} }`);
  }

  if (leave) {
    keyframesContent.push(`50% { ${styleObjectToCss(enter)} }`);
    keyframesContent.push(`100% { ${styleObjectToCss(leave)} }`);
  }

  const keyframes = `
    @keyframes ${keyframesName} {
      ${keyframesContent.join('\n')}
    }
  `;

  return { keyframesName, keyframes };
};
