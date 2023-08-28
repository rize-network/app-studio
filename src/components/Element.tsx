import React from 'react';
import Color from 'color-convert';
import styled, { CSSProperties } from 'styled-components';

import { useTheme } from '../providers/Theme';
import { shadows, Shadow } from '../utils/shadow';
import { isStyleProp } from '../utils/sYyle';
import { useResponsiveContext } from '..';

export interface ElementProps {
  children?: any;
  size?: number;
  on?: Record<string, CSSProperties>;
  media?: Record<string, CSSProperties>;
  paddingHorizontal?: number | string;
  marginHorizontal?: number | string;
  paddingVertical?: number | string;
  marginVertical?: number | string;
  shadow?: boolean | number | Shadow;
}

const NumberPropsStyle: any = {};
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

NumberProps.map((property: string) => {
  NumberPropsStyle[property] = true;
});

export const setSize = (newSize: string | number, styleProps: any) => {
  styleProps.height = styleProps.width = newSize;
};

export const applyStyle = (props: any) => {
  //console.log({ applyStyle: props });

  const { getColor } = useTheme();
  const { mediaQueries, devices } = useResponsiveContext();

  const styleProps: any = {};
  //const otherProps: any = {};

  if (props.onClick && styleProps.cursor == undefined) {
    styleProps.cursor = 'pointer';
  }

  const size =
    props.height !== undefined &&
    props.width !== undefined &&
    props.height === props.width
      ? props.height
      : props.size
      ? props.size
      : null;

  if (size) {
    setSize(size, styleProps);
  }

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

  if (props.shadow) {
    if (typeof props.shadow === 'number' || typeof props.shadow === 'boolean') {
      const shawdowValue: number =
        typeof props.shadow === 'number' && shadows[props.shadow] !== undefined
          ? props.shadow
          : 2;

      if (shadows[shawdowValue]) {
        const shadowColor = Color.hex
          .rgb(shadows[shawdowValue].shadowColor)
          .join(',');

        styleProps[
          'boxShadow'
        ] = `${shadows[shawdowValue].shadowOffset.height}px ${shadows[shawdowValue].shadowOffset.width}px ${shadows[shawdowValue].shadowRadius}px rgba(${shadowColor},${shadows[shawdowValue].shadowOpacity})`;
      }
    } else {
      const shadowColor = Color.hex.rgb(props.shadow.shadowColor).join(',');

      styleProps[
        'boxShadow'
      ] = `${props.shadow.shadowOffset.height}px ${props.shadow.shadowOffset.width}px ${props.shadow.shadowRadius}px rgba(${shadowColor},${props.shadow.shadowOpacity})`;
    }
  }

  Object.keys(props).map((property) => {
    if (isStyleProp(property) || property == 'on' || property == 'media') {
      if (typeof props[property] === 'object') {
        if (property === 'on') {
          for (const event in props[property]) {
            styleProps['&:' + event] = applyStyle(props[property][event]);
          }
        } else if (property === 'media') {
          for (const screenOrDevices in props[property]) {
            //  console.log(screenOrDevices, mediaQueries[screenOrDevices]);
            if (
              mediaQueries[screenOrDevices] !== undefined &&
              props[property][screenOrDevices] !== undefined
            ) {
              styleProps['@media ' + mediaQueries[screenOrDevices]] =
                applyStyle(props[property][screenOrDevices]);
            } else if (devices[screenOrDevices] !== undefined) {
              // console.log(screen, devices[screenOrDevices], 'screen');
              for (const deviceScreen in devices[screenOrDevices]) {
                if (
                  mediaQueries[devices[screenOrDevices][deviceScreen]] !==
                    undefined &&
                  props[property][screenOrDevices] !== undefined
                ) {
                  // console.log(
                  //   screenOrDevices,
                  //   props[property][screenOrDevices]
                  // );
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
    // else {
    //   otherProps[property] = props[property];
    // }
  });

  // console.log({ styleProps });
  //  return { styleProps, otherProps };
  return styleProps;
};

// function convertToCSS(props: any) {
//   return Object.entries(props).reduce((str, [key, val]) => {
//     const casedKey = key.replace(
//       /[A-Z]/g,
//       (match) => `-${match.toLowerCase()}`
//     );
//     return `${str}${casedKey}:${typeof val === 'number' ? val + 'px' : val};\n`;
//   }, '');
// }

// export const getResponsiveMediaQueries = (props: any) => {
//   const { breakpoints, devices } = useResponsiveContext();
//   console.log('mediaQueries', props);

//   const mediaQueries = breakpointKeys
//     .map((size) => {
//       return props && props[size] !== undefined
//         ? `
//     @media ${
//       breakpoints[size].min
//         ? ' (min-width:' +
//           (breakpoints[size].min > 0 ? breakpoints[size].min : 0) +
//           'px)'
//         : ''
//     } ${
//             breakpoints[size].min &&
//             breakpoints[size].max &&
//             breakpoints[size].max >= 0 &&
//             breakpoints[size].max < Infinity
//               ? ' and '
//               : ''
//           } ${
//             breakpoints[size].max &&
//             breakpoints[size].max >= 0 &&
//             breakpoints[size].max < Infinity
//               ? ' (max-width:' + breakpoints[size].max + 'px)'
//               : ''
//           } {
//      ${convertToCSS(props[size])}
//     }`
//         : '';
//     })
//     .join('\n');

//   return mediaQueries;
// };

const dynamicStyle = (props: any) => applyStyle(props);

const ElementComponent = styled.div`
  ${dynamicStyle};
`;

export class Element extends React.PureComponent<any> {
  render() {
    return (
      <ElementComponent
        {...this.props}
        onClick={
          this.props.onPress !== undefined
            ? this.props.onPress
            : this.props.onClick
        }
      />
    );
  }
}
