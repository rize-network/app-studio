import React, { createContext, useContext } from 'react';
import { palette as defaultPalette } from '../utils/colors'; // Assurez-vous que ce chemin est correct

type ColorConfig = Record<string, any>; // Permet des objets imbriqués
type VariantColorConfig = Record<string, Record<string, string>>;

interface Theme {
  main: ColorConfig;
  components?: Record<string, Record<string, any>>;
}

interface Colors {
  main?: ColorConfig;
  palette?: VariantColorConfig;
}

interface ThemeContextProps {
  getColor: (color: string) => string;
  theme?: Theme;
  colors?: Colors;
}

// Configuration de thème par défaut
export const defaultThemeMain: ColorConfig = {
  primary: 'color.black',
  secondary: 'color.blue',
  success: 'color.green.500',
  error: 'color.red.500',
  warning: 'color.orange.500',
  disabled: 'color.gray.500',
  loading: 'color.dark.500',
};

// Configuration des couleurs par défaut
export const defaultColors: ColorConfig = {
  white: '#FFFFFF',
  black: '#000000',
  red: '#FF0000',
  green: '#00FF00',
  blue: '#0000FF',
  yellow: '#FFFF00',
  cyan: '#00FFFF',
  magenta: '#FF00FF',
  grey: '#808080',
  orange: '#FFA500',
  brown: '#A52A2A',
  purple: '#800080',
  pink: '#FFC0CB',
  lime: '#00FF00',
  teal: '#008080',
  navy: '#000080',
  olive: '#808000',
  maroon: '#800000',
  gold: '#FFD700',
  silver: '#C0C0C0',
  indigo: '#4B0082',
  violet: '#EE82EE',
  beige: '#F5F5DC',
  turquoise: '#40E0D0',
  coral: '#FF7F50',
  chocolate: '#D2691E',
  skyBlue: '#87CEEB',
  plum: '#DDA0DD',
  darkGreen: '#006400',
  salmon: '#FA8072',
};

// Création du contexte de thème avec des valeurs par défaut
export const ThemeContext = createContext<ThemeContextProps>({
  getColor: (name: string): string => name,
  colors: {
    main: defaultColors,
    palette: defaultPalette,
  },
  theme: { main: defaultThemeMain, components: {} },
});

// Hook personnalisé pour utiliser le contexte de thème
export const useTheme = () => useContext(ThemeContext);

// Fonction de fusion profonde simple
const deepMerge = (target: any, source: any): any => {
  if (typeof source !== 'object' || source === null) {
    return target;
  }

  const merged = { ...target };

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const targetValue = target[key];

      if (Array.isArray(sourceValue)) {
        // Remplacer les tableaux
        merged[key] = sourceValue;
      } else if (
        typeof sourceValue === 'object' &&
        sourceValue !== null &&
        !Array.isArray(sourceValue)
      ) {
        // Fusion récursive des objets
        merged[key] = deepMerge(targetValue || {}, sourceValue);
      } else {
        // Remplacer les autres types de valeurs
        merged[key] = sourceValue;
      }
    }
  }

  return merged;
};

// Composant ThemeProvider
export const ThemeProvider = ({
  theme = {
    main: defaultThemeMain,
    components: {},
  },
  colors = {
    main: defaultColors,
    palette: defaultPalette,
  },
  children,
}: {
  theme?: Theme;
  colors?: Colors;
  children: React.ReactNode;
}): React.ReactElement => {
  // Fusion profonde des thèmes par défaut avec ceux fournis
  const mergedTheme = deepMerge(defaultThemeMain, theme);

  // Fusion profonde des couleurs par défaut avec celles fournies
  const mergedColors = deepMerge(
    { main: defaultColors, palette: defaultPalette },
    colors
  );

  /**
   * Fonction pour récupérer une couleur basée sur un chemin en chaîne.
   * Supporte les références imbriquées comme 'theme.button.primary.background'.
   * @param name - Le nom de la couleur à récupérer.
   * @returns La valeur de couleur résolue ou le nom original si non trouvé.
   */
  console.log({ mergedTheme });

  const getColor = (name: string): string => {
    if (name === 'transparent') return name;

    try {
      if (name.startsWith('theme.')) {
        const keys = name.split('.');
        let value: any = mergedTheme;

        for (let i = 1; i < keys.length; i++) {
          value = value[keys[i]];
          if (value === undefined) {
            console.warn(`Couleur "${name}" non trouvée dans le thème.`);
            return name;
          }
        }

        if (typeof value === 'string') {
          return getColor(value); // Résoudre les références imbriquées
        } else {
          console.warn(
            `La couleur "${name}" a résolu à une valeur non-string.`
          );
          return name;
        }
      } else if (name.startsWith('color.')) {
        const keys = name.split('.');

        if (keys.length === 2) {
          // Exemple : "color.white"
          const colorName = keys[1];
          return mergedColors.main[colorName] || name;
        } else if (keys.length === 3) {
          // Exemple : "color.palette.primary.500"
          const [_, paletteName, variant] = keys;
          if (
            mergedColors.palette[paletteName] &&
            mergedColors.palette[paletteName][variant]
          ) {
            return mergedColors.palette[paletteName][variant];
          } else {
            console.warn(`Color ${_} non trouvée`);
          }
        }
        console.warn(
          `Color "${name}" non trouvée dans la palette ou les couleurs principales.`
        );
      }
    } catch (e) {
      console.error('Erreur lors de la récupération de la couleur:', e);
    }

    return name; // Retourner le nom original si non trouvé
  };

  return (
    <ThemeContext.Provider
      value={{
        getColor,
        theme: mergedTheme,
        colors: mergedColors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
