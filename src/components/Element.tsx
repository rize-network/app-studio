import React from 'react';
import Color from 'color-convert';
import styled, { StyledInterface } from 'styled-components';
import { useTheme } from '../providers/Theme';
import { shadows } from '../utils/shadow';
import { isStyleProp } from '../utils/style';

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

export const setSize = (newSize: string | number, newProps: any) => {
  newProps.height = newProps.width = newSize;
};

export const applyStyle = (props: any) => {
  const { getColor } = useTheme();

  const newProps: any = {};

  if (props.onClick && newProps.cursor == undefined) {
    newProps.cursor = 'pointer';
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
    setSize(size, newProps);
  }

  if (props.paddingHorizontal) {
    newProps.paddingLeft = props.paddingHorizontal;
    newProps.paddingRight = props.paddingHorizontal;
  }

  if (props.marginHorizontal) {
    newProps.marginLeft = props.marginHorizontal;
    newProps.marginRight = props.marginHorizontal;
  }

  if (props.paddingVertical) {
    newProps.paddingTop = props.paddingVertical;
    newProps.paddingBottom = props.paddingVertical;
  }

  if (props.marginVertical) {
    newProps.marginTop = props.marginVertical;
    newProps.marginBottom = props.marginVertical;
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

        newProps[
          'boxShadow'
        ] = `${shadows[shawdowValue].shadowOffset.height}px ${shadows[shawdowValue].shadowOffset.width}px ${shadows[shawdowValue].shadowRadius}px rgba(${shadowColor},${shadows[shawdowValue].shadowOpacity})`;
      }
    } else {
      const shadowColor = Color.hex.rgb(props.shadow.shadowColor).join(',');

      newProps[
        'boxShadow'
      ] = `${props.shadow.shadowOffset.height}px ${props.shadow.shadowOffset.width}px ${props.shadow.shadowRadius}px rgba(${shadowColor},${props.shadow.shadowOpacity})`;
    }
  }

  Object.keys(props).map((property) => {
    if (isStyleProp(property) || property == 'on') {
      if (
        typeof props[property] === 'number' &&
        NumberPropsStyle[property] === undefined
      ) {
        newProps[property] = props[property] + 'px';
      } else if (property.toLowerCase().indexOf('color') !== -1) {
        newProps[property] = getColor(props[property]);
      } else if (typeof props[property] === 'object') {
        if (property === 'on') {
          for (const event in props[property]) {
            newProps['&:' + event] = applyStyle(props[property][event]);
          }
        } else {
          newProps[property] = applyStyle(props[property]);
        }
      } else {
        newProps[property] = props[property];
      }
    }
  });

  return newProps;
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
//   const { breakpointKeys, breakpoints } = useResponsive();
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

export const StyledView = styled.div((props: any) => {
  return applyStyle(props);
});

const elements: any = {
  form: styled.form((props: any) => {
    return applyStyle(props);
  }),
  button: styled.button((props: any) => {
    return applyStyle(props);
  }),
  input: styled.input((props: any) => {
    return applyStyle(props);
  }),
  span: styled.span((props: any) => {
    return applyStyle(props);
  }),
  img: styled.img((props: any) => {
    return applyStyle(props);
  }),
  div: styled.div((props: any) => {
    return applyStyle(props);
  }),
  video: styled.video((props: any) => {
    return applyStyle(props);
  }),
};

export class ViewElement extends React.PureComponent<any> {
  render() {
    const Element = elements[this.props.tag]
      ? elements[this.props.tag]
      : elements.div;

    return (
      <Element
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
