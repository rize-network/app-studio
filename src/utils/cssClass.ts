// utils/utilityClassManager.ts
import murmur from 'murmurhash-js';
import { StyleProps } from './style';

type StyleContext = 'base' | 'pseudo' | 'media';

function generatePropertyShorthand(
  styledProps: string[]
): Record<string, string> {
  const propertyShorthand: Record<string, string> = {};
  const usedAbbreviations = new Set<string>();

  function generateAbbreviation(prop: string): string {
    const first = prop[0].toLowerCase();
    const last = prop[prop.length - 1].toLowerCase();
    const upperCase = prop.slice(1, -1).replace(/[a-z]/g, '').toLowerCase();
    let abbr = first + upperCase + last;

    if (abbr.length < 2) {
      abbr = prop.slice(0, 2);
    }

    let i = 0;
    let uniqueAbbr = abbr;
    while (usedAbbreviations.has(uniqueAbbr)) {
      i++;
      uniqueAbbr = abbr + prop.slice(-i, prop.length);
    }

    usedAbbreviations.add(uniqueAbbr);
    return uniqueAbbr;
  }

  for (const prop of styledProps) {
    propertyShorthand[prop] = generateAbbreviation(prop);
  }

  return propertyShorthand;
}

const propertyShorthand = generatePropertyShorthand(StyleProps);

class UtilityClassManager {
  private styleSheet: CSSStyleSheet | null = null;
  private classCache: Map<string, string> = new Map();
  private maxCacheSize: number;

  constructor(maxCacheSize: number = 10000) {
    this.maxCacheSize = maxCacheSize;
    this.initStyleSheet();
  }

  private initStyleSheet() {
    if (typeof document !== 'undefined') {
      let styleTag = document.getElementById(
        'utility-classes'
      ) as HTMLStyleElement;
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'utility-classes';
        document.head.appendChild(styleTag);
      }
      this.styleSheet = styleTag.sheet as CSSStyleSheet;
    }
  }

  private hashString(str: string): string {
    return murmur(str).toString(36);
  }

  /**
   * Génère ou récupère le nom de classe pour une propriété donnée, une valeur et un contexte.
   * @param property La propriété CSS (ex: 'padding', 'color')
   * @param value La valeur de la propriété (ex: '10px', '#fff')
   * @param context Le contexte de la classe ('base', 'pseudo', 'media')
   * @param modifier Le modificateur pour les pseudo-classes ou media queries (ex: 'hover', 'min-width: 600px')
   * @param getColor Fonction pour convertir les couleurs si nécessaire
   * @returns Le nom de classe généré ou existant
   */
  public getClassName(
    property: string,
    value: any,
    context: StyleContext = 'base',
    modifier: string = '',
    getColor: (color: string) => string = (color) => color
  ): string {
    let processedValue = value;

    // Si la propriété est une couleur, la convertir en valeur hexadécimale ou RGB
    if (property.toLowerCase().includes('color')) {
      processedValue = getColor(value);
    }

    let key = `${property}:${processedValue}`;
    if (modifier) {
      key = `${property}:${processedValue}|${modifier}`;
    }

    if (this.classCache.has(key)) {
      return this.classCache.get(key)!;
    }

    // Générer un nom de classe unique
    let shorthand = propertyShorthand[property];
    if (!shorthand) {
      // Si aucune abréviation n'est définie, générer une classe générique
      shorthand = property.replace(/([A-Z])/g, '-$1').toLowerCase();
    }

    // Normaliser la valeur pour le nom de classe (par exemple, supprimer les unités)
    let normalizedValue = processedValue;
    if (typeof processedValue === 'number') {
      normalizedValue = processedValue.toString();
    } else if (typeof processedValue === 'string') {
      normalizedValue = processedValue.replace(
        /px|%|#|\.|\,|\-|\(|\)|em|rem|vh|vw|deg/g,
        ''
      );
    }

    const className = `${shorthand}-${normalizedValue}`;

    // Convertir camelCase en kebab-case
    const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();

    // Construire la règle CSS en fonction du contexte
    let cssRule = '';
    switch (context) {
      case 'base':
        cssRule = `.${className} { ${cssProperty}: ${processedValue}; }`;
        break;
      case 'pseudo':
        cssRule = `.${className}:${modifier} { ${cssProperty}: ${processedValue}; }`;
        break;
      case 'media':
        cssRule = `@media ${modifier} { .${className} { ${cssProperty}: ${processedValue}; } }`;
        break;
      default:
        cssRule = `.${className} { ${cssProperty}: ${processedValue}; }`;
    }

    // Injecter la règle CSS
    if (this.styleSheet) {
      try {
        this.styleSheet.insertRule(cssRule, this.styleSheet.cssRules.length);
      } catch (e) {
        console.error(
          `Erreur lors de l'insertion de la règle CSS: "${cssRule}"`,
          e
        );
      }
    }

    // Ajouter au cache
    if (this.classCache.size >= this.maxCacheSize) {
      // Supprimer la première entrée (FIFO)
      const firstKey = this.classCache.keys().next().value;
      this.classCache.delete(firstKey);
    }
    this.classCache.set(key, className);

    return className;
  }
}

export const utilityClassManager = new UtilityClassManager();
