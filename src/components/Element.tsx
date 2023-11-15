import React from 'react'; // Importe React pour créer des composants
import Color from 'color-convert'; // Utilisé pour convertir les couleurs
import styled, { CSSProperties } from 'styled-components'; // Pour créer des composants stylisés
import isPropValid from '@emotion/is-prop-valid';
import { useTheme } from '../providers/Theme'; // Hook personnalisé pour utiliser le thème
import { Shadows, Shadow } from '../utils/shadow'; // Importe des utilitaires pour les ombres
import { isStyleProp } from '../utils/style'; // Fonction pour vérifier si une prop est un style
import { useResponsiveContext } from '../providers/Responsive'; // Hook pour le contexte responsive

// Définit les props pour le composant Element
export interface ElementProps {
  children?: React.ReactNode; // Les enfants du composant
  size?: number; // Taille de l'élément
  on?: Record<string, CSSProperties>; // Styles pour les événements
  media?: Record<string, CSSProperties>; // Styles pour les médias
  paddingHorizontal?: number | string; // Padding horizontal
  marginHorizontal?: number | string; // Margin horizontal
  paddingVertical?: number | string; // Padding vertical
  marginVertical?: number | string; // Margin vertical
  shadow?: boolean | number | Shadow; // Propriété d'ombre
  only?: string[]; // Propriété pour spécifier des médias spécifiques
  css?: CSSProperties; // Styles CSS personnalisés
}

// Liste des propriétés numériques
const NumberProps = [
  'numberOfLines',
  'fontWeight',
  'timeStamp',
  'flex',
  'flexGrow',
  'flexShrink',
  'order',
  'zIndex',
  'aspectRatio',
  'shadowOpacity',
  'shadowRadius',
  'scale',
  'opacity',
  'min',
  'max',
  'now',
];

// Stocke si une propriété est numérique
const NumberPropsStyle: { [key: string]: boolean } = {};
NumberProps.forEach((property) => {
  NumberPropsStyle[property] = true;
});

// Fonction pour définir la taille de l'élément
export const setSize = (
  newSize: string | number,
  styleProps: Record<string, any>
) => {
  styleProps.height = styleProps.width = newSize; // Définit la hauteur et la largeur
};

// Fonction pour appliquer les styles à un composant
export const applyStyle = (props: Record<string, any>): CSSProperties & any => {
  const { getColor } = useTheme(); // Utilise le hook pour obtenir les couleurs du thème
  const { mediaQueries, devices } = useResponsiveContext(); // Utilise le contexte responsive

  // eslint-disable-next-line prefer-const
  let styleProps: Record<string, any> = {}; // Stocke les styles

  // Applique un curseur pointeur si un gestionnaire de clic est présent
  if (props.onClick && styleProps.cursor == undefined) {
    styleProps.cursor = 'pointer';
  }

  // Gère la taille de l'élément
  const size =
    props.height !== undefined &&
    props.width !== undefined &&
    props.height === props.width
      ? props.height
      : props.size
      ? props.size
      : null;

  if (size) {
    setSize(size, styleProps); // Applique la taille
  }

  // Gère le padding et la marge
  if (props.paddingHorizontal) {
    styleProps.paddingLeft = props.paddingHorizontal;
    styleProps.paddingRight = props.paddingHorizontal;
  }

  if (props.marginHorizontal) {
    styleProps.marginLeft = props.marginHorizontal;
    styleProps.marginRight = props.marginHorizontal;
  }

  if (props.paddingVertical) {
    styleProps.paddingTop = props.paddingVertical;
    styleProps.paddingBottom = props.paddingVertical;
  }

  if (props.marginVertical) {
    styleProps.marginTop = props.marginVertical;
    styleProps.marginBottom = props.marginVertical;
  }

  // Applique les ombres si spécifié
  if (props.shadow) {
    if (typeof props.shadow === 'number' || typeof props.shadow === 'boolean') {
      const shadowValue: number =
        typeof props.shadow === 'number' && Shadows[props.shadow] !== undefined
          ? props.shadow
          : 2;

      if (Shadows[shadowValue]) {
        const shadowColor = Color.hex
          .rgb(Shadows[shadowValue].shadowColor)
          .join(',');

        styleProps[
          'boxShadow'
        ] = `${Shadows[shadowValue].shadowOffset.height}px ${Shadows[shadowValue].shadowOffset.width}px ${Shadows[shadowValue].shadowRadius}px rgba(${shadowColor},${Shadows[shadowValue].shadowOpacity})`;
      }
    } else {
      const shadowColor = Color.hex.rgb(props.shadow.shadowColor).join(',');

      styleProps[
        'boxShadow'
      ] = `${props.shadow.shadowOffset.height}px ${props.shadow.shadowOffset.width}px ${props.shadow.shadowRadius}px rgba(${shadowColor},${props.shadow.shadowOpacity})`;
    }
    delete props['shadow'];
  }

  // Gère les styles pour des médias spécifiques
  if (props.only) {
    const { only, ...newProps } = props;
    // eslint-disable-next-line prefer-const
    let onlyProps: any = {
      media: {},
    };

    only.map((o: string) => {
      if (onlyProps.media[o] == undefined) {
        onlyProps.media[o] = {};
      }
    });

    const styleKeys = Object.keys(newProps).filter((key) => isStyleProp(key));
    styleKeys.map((key: string) => {
      only.map((o: string) => {
        props.media[o][key] = newProps[key];
      });
      delete props[key];
    });
    delete props['only'];
  }

  // Gère les styles CSS personnalisés
  if (props.css) {
    const { css } = props;
    props = { ...css, props };
    delete props['css'];
  }

  console.log({ props });

  // Applique les styles
  Object.keys(props).map((property) => {
    console.log({ property });

    if (property !== 'shadow' && property !== 'size') {
      if (isStyleProp(property) || property == 'on' || property == 'media') {
        if (typeof props[property] === 'object') {
          if (property === 'on') {
            for (const event in props[property]) {
              styleProps['&:' + event] = applyStyle(props[property][event]);
            }
          } else if (property === 'media') {
            for (const screenOrDevices in props[property]) {
              if (
                mediaQueries[screenOrDevices] !== undefined &&
                props[property][screenOrDevices] !== undefined
              ) {
                styleProps['@media ' + mediaQueries[screenOrDevices]] =
                  applyStyle(props[property][screenOrDevices]);
              } else if (devices[screenOrDevices] !== undefined) {
                for (const deviceScreen in devices[screenOrDevices]) {
                  if (
                    mediaQueries[devices[screenOrDevices][deviceScreen]] !==
                      undefined &&
                    props[property][screenOrDevices] !== undefined
                  ) {
                    styleProps[
                      '@media ' +
                        mediaQueries[devices[screenOrDevices][deviceScreen]]
                    ] = applyStyle(props[property][screenOrDevices]);
                  }
                }
              }
            }
          } else {
            styleProps[property] = applyStyle(props[property]);
          }
        } else if (
          typeof props[property] === 'number' &&
          NumberPropsStyle[property] === undefined
        ) {
          styleProps[property] = props[property] + 'px';
        } else if (property.toLowerCase().indexOf('color') !== -1) {
          styleProps[property] = getColor(props[property]);
        } else {
          styleProps[property] = props[property];
        }
      }
      console.log(styleProps[property]);
    }
  });

  console.log({ styleProps });

  return styleProps;
};

// Fonction pour filtrer les props qui ne sont pas des styles
export const getProps = (props: Record<string, any>) => {
  return Object.keys(props).reduce(
    (acc, key) => {
      if (!excludedKeys.has(key) && !isStyleProp(key)) {
        acc[key] = props[key];
      }
      return acc;
    },
    {} as { [key: string]: any }
  );
};

// Clés à exclure lors de la création du composant stylisé
const excludedKeys = new Set([
  'on',
  'shadow',
  'only',
  'media',
  'css',
  'paddingHorizontal',
  'paddingVertical',
  'marginHorizontal',
  'marginVertical',
]);

// Crée un composant div stylisé, en excluant certaines props
const ElementComponent = styled.div.withConfig({
  shouldForwardProp: (prop) => isPropValid(prop),
})`
  // Applique les styles dynamiques en utilisant la fonction applyStyle
  ${(props: any) => {
    const css = applyStyle(props);
    console.log({ css, props });
    return css;
  }}
`;

// Classe Element étendant React.PureComponent pour optimiser les performances
export class Element extends React.PureComponent<ElementProps & any> {
  render() {
    // eslint-disable-next-line prefer-const
    let { onPress, ...props }: any = this.props;
    if (onPress) {
      props.onClick = onPress;
    }
    // Rendu du composant avec les props
    return <ElementComponent {...props} />;
  }
}
