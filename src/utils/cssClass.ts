// utils/utilityClassManager.ts
import murmur from 'murmurhash-js';

type StyleContext = 'base' | 'pseudo' | 'media';

class UtilityClassManager {
  private styleSheet: CSSStyleSheet | null = null;
  private classCache: Map<string, string> = new Map();
  private maxCacheSize: number;
  private classNameCounter: number = 0;

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
    const hash = this.hashString(key);
    const className = `utl-${hash}`;

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
