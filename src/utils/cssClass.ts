// utils/utilityClassManager.ts
import { StyleProps } from './style';

type StyleContext = 'base' | 'pseudo' | 'media';

/**
 * Génère des abréviations pour les propriétés CSS.
 * @param styledProps Tableau des propriétés CSS à abréger.
 * @returns Un objet mappant chaque propriété CSS à son abréviation.
 */
function generatePropertyShorthand(
  styledProps: string[]
): Record<string, string> {
  const propertyShorthand: Record<string, string> = {};
  const usedAbbreviations = new Set<string>();

  /**
   * Génère une abréviation unique pour une propriété CSS donnée.
   * @param prop La propriété CSS à abréger.
   * @returns L'abréviation unique générée.
   */
  function generateAbbreviation(prop: string): string {
    const first = prop[0].toLowerCase();
    const last = prop[prop.length - 1].toLowerCase();
    const middle = prop.slice(1, -1).replace(/[a-z]/g, '').toLowerCase();
    let abbr = first + middle + last;

    if (abbr.length < 2) {
      abbr = prop.slice(0, 2).toLowerCase();
    }

    let i = 0;
    let uniqueAbbr = abbr;
    while (usedAbbreviations.has(uniqueAbbr)) {
      i++;
      uniqueAbbr = abbr + prop.slice(-i, prop.length).toLowerCase();
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

/**
 * Classe de gestion des classes utilitaires CSS.
 * Gère la génération, le cache et l'injection des classes CSS dynamiques.
 */
class UtilityClassManager {
  private styleSheet: CSSStyleSheet | null = null;
  private classCache: Map<string, string> = new Map();
  private maxCacheSize: number;

  /**
   * Initialise le gestionnaire avec une taille de cache maximale.
   * @param maxCacheSize Taille maximale du cache des classes CSS.
   */
  constructor(maxCacheSize: number = 10000) {
    this.maxCacheSize = maxCacheSize;
    this.initStyleSheet();
  }

  /**
   * Initialise la feuille de style dédiée pour les classes utilitaires.
   */
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

  /**
   * Échappe les caractères spéciaux dans le nom de la classe pour qu'ils soient valides en CSS.
   * @param className Le nom de la classe à échapper.
   * @returns Le nom de la classe échappé.
   */
  private escapeClassName(className: string): string {
    return className.replace(/:/g, '\\:');
  }

  /**
   * Injecte une règle CSS dans la feuille de style.
   * @param cssRule La règle CSS à injecter.
   */
  private injectRule(cssRule: string) {
    if (this.styleSheet) {
      try {
        // Empêcher l'insertion de règles en double
        const existingRules = Array.from(this.styleSheet.cssRules).map(
          (rule) => rule.cssText
        );
        if (!existingRules.includes(cssRule)) {
          this.styleSheet.insertRule(cssRule, this.styleSheet.cssRules.length);
        }
      } catch (e) {
        console.error(
          `Erreur lors de l'insertion de la règle CSS: "${cssRule}"`,
          e
        );
      }
    }
  }

  /**
   * Ajoute une entrée au cache des classes.
   * @param key La clé unique pour la classe.
   * @param className Le nom de la classe générée.
   */
  private addToCache(key: string, className: string) {
    if (this.classCache.size >= this.maxCacheSize) {
      // Supprimer la première entrée (FIFO)
      const firstKey = this.classCache.keys().next().value;
      this.classCache.delete(firstKey);
    }
    this.classCache.set(key, className);
  }

  /**
   * Génère ou récupère le nom de classe pour une propriété donnée, une valeur et un contexte.
   * @param property La propriété CSS (ex: 'padding', 'color').
   * @param value La valeur de la propriété (ex: '10px', '#fff').
   * @param context Le contexte de la classe ('base', 'pseudo', 'media').
   * @param modifier Le modificateur pour les pseudo-classes ou media queries (ex: 'hover', 'mobile').
   * @param getColor Fonction pour convertir les couleurs si nécessaire.
   * @param mediaQuery La chaîne de media query associée (utilisée uniquement pour le contexte 'media').
   * @returns Le nom de classe généré ou existant.
   */
  public getClassName(
    property: string,
    value: any,
    context: StyleContext = 'base',
    modifier: string = '',
    getColor: (color: string) => string = (color) => color,
    mediaQuery: string = ''
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

    let className = `${shorthand}-${normalizedValue}`;

    // Préfixer les noms de classe pour les pseudo-classes et media queries
    if (context === 'pseudo' && modifier) {
      className = `${modifier}:${className}`;
    }

    if (context === 'media' && modifier) {
      className = `${modifier}:${className}`;
    }

    // Convertir camelCase en kebab-case
    const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
    let valueForCss = processedValue;

    // Ajouter des unités si nécessaire
    if (typeof valueForCss === 'number') {
      const propertiesWithUnits = [
        'width',
        'height',
        'padding',
        'margin',
        'padding-left',
        'padding-right',
        'padding-top',
        'padding-bottom',
        'margin-left',
        'margin-right',
        'margin-top',
        'margin-bottom',
      ];
      if (propertiesWithUnits.includes(cssProperty)) {
        valueForCss = `${valueForCss}px`;
      }
    }

    // Échapper le nom de classe pour les sélecteurs CSS valides
    const escapedClassName = this.escapeClassName(className);

    // Construire la règle CSS basée sur le contexte
    let cssRule = '';
    switch (context) {
      case 'base':
        cssRule = `.${escapedClassName} { ${cssProperty}: ${valueForCss}; }`;
        break;
      case 'pseudo':
        cssRule = `.${escapedClassName} { ${cssProperty}: ${valueForCss}; }`;
        break;
      case 'media':
        cssRule = `@media ${mediaQuery} { .${escapedClassName} { ${cssProperty}: ${valueForCss}; } }`;
        break;
      default:
        cssRule = `.${escapedClassName} { ${cssProperty}: ${valueForCss}; }`;
    }

    // Injecter la règle CSS
    this.injectRule(cssRule);

    // Ajouter au cache
    this.addToCache(key, className);

    return className;
  }
}

export const utilityClassManager = new UtilityClassManager();
