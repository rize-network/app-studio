import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../providers/Theme';
import { shadows } from '../utils/shadow';
export const TransformStyleProps = [
  'transform',
  'transformMatrix',
  'rotation',
  'scaleX',
  'scaleY',
  'translateX',
  'translateY',
  // 'perspective',
  // 'rotate',
  // 'rotateX',
  // 'rotateY',
  // 'rotateZ',
  // 'scale',
  // 'skewX',
  // 'skewY',
  'testID',
  'decomposedMatrix',
];

export const ImageStyleProps = [
  'borderTopRightRadius',
  'backfaceVisibility',
  'borderBottomLeftRadius',
  'borderBottomRightRadius',
  'borderColor',
  'borderRadius',
  'borderTopLeftRadius',
  'backgroundColor',
  'borderWidth',
  'opacity',
  'overflow',
  'overflowX',
  'overflowY',
  'resizeMode',
  'tintColor',
  'overlayColor',
];

export const LayoutStyleProps = [
  'alignContent',
  'alignItems',
  'alignSelf',
  'aspectRatio',
  'borderBottomWidth',
  'borderEndWidth',
  'borderLeftWidth',
  'borderRightWidth',
  'borderStartWidth',
  'borderTopWidth',
  'borderWidth',
  'bottom',
  'direction',
  'display',
  'end',
  'flex',
  'flexBasis',
  'flexDirection',
  'flexGrow',
  'flexShrink',
  'flexWrap',
  'height',
  'justifyContent',
  'left',
  'margin',
  'marginBottom',
  'marginEnd',
  'marginHorizontal',
  'marginLeft',
  'marginRight',
  'marginStart',
  'marginTop',
  'marginVertical',
  'maxHeight',
  'maxWidth',
  'minHeight',
  'minWidth',
  'overflow',
  'overflowX',
  'overflowY',
  'padding',
  'paddingBottom',
  'paddingEnd',
  'paddingHorizontal',
  'paddingLeft',
  'paddingRight',
  'paddingStart',
  'paddingTop',
  'paddingVertical',
  'position',
  'right',
  'start',
  'top',
  'width',
  'zIndex',
];

export const ShadowStyleProps = [
  'shadowColor',
  'shadowOffset',
  'shadowOpacity',
  'shadowRadius',
];
export const TextStyleProps = [
  'textShadowOffset',
  'color',
  'fontSize',
  'fontStyle',
  'fontWeight',
  'lineHeight',
  'textAlign',
  'textDecorationLine',
  'textShadowColor',
  'fontFamily',
  'textShadowRadius',
  'includeFontPadding',
  'textAlignVertical',
  'fontVariant',
  'letterSpacing',
  'textDecorationColor',
  'textDecorationStyle',
  'textTransform',
  'writingDirection',
];

export const ViewStyleProps = [
  'borderRightColor',
  'backfaceVisibility',
  'borderBottomColor',
  'borderBottomEndRadius',
  'borderBottomLeftRadius',
  'borderBottomRightRadius',
  'borderBottomStartRadius',
  'borderBottomWidth',
  'borderColor',
  'borderEndColor',
  'borderLeftColor',
  'borderLeftWidth',
  'borderRadius',
  'backgroundColor',
  'borderRightWidth',
  'borderStartColor',
  'borderStyle',
  'borderTopColor',
  'borderTopEndRadius',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderTopStartRadius',
  'borderTopWidth',
  'borderWidth',
  'border',
  'opacity',
  'elevation',
  'size',
];

export const ScrollViewStyleProps = [
  'alwaysBounceHorizontal',
  'alwaysBounceVertical',
  'automaticallyAdjustContentInsets',
  'bounces',
  'bouncesZoom',
  'canCancelContentTouches',
  'centerContent',
  'contentLayoutStyle',
  'contentInset',
  'contentInsetAdjustmentBehavior',
  'contentOffset',
  'decelerationRate',
  'directionalLockEnabled',
  'disableIntervalMomentum',
  'disableScrollViewPanResponder',
  'endFillColor',
  'fadingEdgeLength',
  'horizontal',
  'indicatorStyle',
  'invertStickyHeaders',
  'keyboardDismissMode',
  'keyboardShouldPersistTaps',
  'maintainVisibleContentPosition',
  'maximumZoomScale',
  'minimumZoomScale',
  'nestedScrollEnabled',
  'onContentSizeChange',
  'onMomentumScrollBegin',
  'onMomentumScrollEnd',
  'onScroll',
  'onScrollBeginDrag',
  'onScrollEndDrag',
  'onScrollToTop',
  'overScrollMode',
  'pagingEnabled',
  'persistentScrollbar',
  'pinchGestureEnabled',
  'refreshControl',
  'removeClippedSubviews',
  'scrollBarThumbImage',
  'scrollEnabled',
  'scrollEventThrottle',
  'scrollIndicatorInsets',
  'scrollPerfTag',
  'scrollToOverflowEnabled',
  'scrollsToTop',
  'DEPRECATED_sendUpdatedChildFrames',
  'showsHorizontalScrollIndicator',
  'showsVerticalScrollIndicator',
  'snapToAlignment',
  'snapToEnd',
  'snapToInterval',
  'snapToOffsets',
  'snapToStart',
  'stickyHeaderIndices',
  'zoomScale',
];

export const BaseStyleProperty: any = {};
LayoutStyleProps.concat(ShadowStyleProps, TransformStyleProps).map(
  (property) => {
    BaseStyleProperty[property] = true;
  }
);

export const ViewStyleProperty: any = BaseStyleProperty;
ViewStyleProps.map((property) => {
  ViewStyleProperty[property] = true;
});

export const ScrollViewStyleProperty: any = ViewStyleProperty;
ScrollViewStyleProps.map((property) => {
  ScrollViewStyleProperty[property] = true;
});

export const ImageStyleProperty: any = ViewStyleProperty;
ImageStyleProps.map((property) => {
  ImageStyleProperty[property] = true;
});

export const TextStyleProperty: any = BaseStyleProperty;
TextStyleProps.map((property) => {
  TextStyleProperty[property] = true;
});

export const allStyleProps: string[] = LayoutStyleProps.concat(
  ShadowStyleProps,
  TransformStyleProps,
  ViewStyleProps,
  ScrollViewStyleProps,
  TextStyleProps,
  ImageStyleProps
);

const WidthWords = ['X', 'Width', 'Horizontal', 'Right', 'Left'];

export const WidthStyleProperty = ['x', 'width', 'right', 'left'].concat(
  allStyleProps.filter((property) => {
    return WidthWords.some((item) => property.indexOf(item) >= 0);
  })
);
export const WidthStyleProps: any = {};
WidthStyleProperty.map((property) => {
  WidthStyleProps[property] = true;
});

const HeightWords = ['Y', 'Height', 'Vertical', 'top', 'bottom'];

export const HeightStyleProperty = ['y', 'height', 'top', 'bottom'].concat(
  allStyleProps.filter((property) => {
    return HeightWords.some((item) => property.indexOf(item) >= 0);
  })
);

export const HeightStyleProps: any = {};
HeightStyleProperty.map((property) => {
  HeightStyleProps[property] = true;
});

export const SizeProps: any = {};
HeightStyleProperty.concat(WidthStyleProperty).map((property) => {
  SizeProps[property] = true;
});

export const StyleProps: any = {};
allStyleProps.map((property) => {
  StyleProps[property] = true;
});

export const setSize = (newSize: string | number, newProps: any) => {
  newProps.height = newProps.width = newSize;
};

export const applyStyle = (props: any) => {
  const { getColor } = useTheme();

  const newProps: any = {};

  if (props.onClick) {
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
    const shawdowValue: number =
      typeof props.shadow === 'number' && shadows[props.shadow] !== undefined
        ? props.shadow
        : 2;

    if (shadows[shawdowValue]) {
      for (const i in shadows[shawdowValue]) {
        newProps[i] = shadows[shawdowValue][i];
      }
    }
  }

  Object.keys(props).map((property) => {
    if (StyleProps[property] !== undefined || property == 'on') {
      if (typeof props[property] === 'number' && property !== 'fontWeight') {
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
    } else {
      newProps[property] = props[property];
    }
  });

  console.log({ props, newProps });
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

export const onlyStyle = (props: any) => {
  const filteredProps: any = {};

  Object.keys(props).map((property) => {
    if (StyleProps[property] !== undefined) {
      filteredProps[property] = props[property];
    }
  });
  return applyStyle(filteredProps);
};

export const StyledView = styled.div((props: any) => {
  return applyStyle(props);
});

export const StyledImage = styled.img((props: any) => {
  return applyStyle(props);
});

export class ViewElement extends React.PureComponent<any> {
  render() {
    let { onClick } = this.props;
    if (this.props.onPress !== undefined) {
      onClick = this.props.onPress;
    }

    //console.log(this.props);
    return <StyledView {...this.props} onClick={onClick} />;
  }
}

export class ImageElement extends React.PureComponent<any> {
  render() {
    let { onClick } = this.props;
    if (this.props.onPress !== undefined) {
      onClick = this.props.onPress;
    }
    return <StyledImage {...this.props} onClick={onClick} />;
  }
}
