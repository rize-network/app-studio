// styleHelpers.ts
import { extraKeys, includeKeys, NumberProps } from './constants';
// Excluded keys imported from constants.ts
// import { excludedKeys } from './constants';

// const nonStyleAttributes = new Set(['length', 'parentRule', 'src']);

// Function to set the size of the element
export const setSize = (
  newSize: string | number,
  styleProps: Record<string, any>
) => {
  styleProps.height = styleProps.width = newSize; // Set height and width
};

// Function to convert style object to CSS string
export const styleObjectToCss = (styleObj: Record<string, any>): string => {
  return Object.entries(styleObj)
    .map(([key, value]) => `${toKebabCase(key)}: ${value};`)
    .join(' ');
};

// Function to convert camelCase to kebab-case
export const toKebabCase = (str: string): string =>
  str.replace(/([A-Z])/g, (match) => '-' + match.toLowerCase());

// // Function to check if a property is a style prop
// export const isStyleProp = (prop: string): boolean => {
//   // Implement your logic to determine if a prop is a style prop
//   // For simplicity, we assume all props not in excludedKeys are style props
//   return !excludedKeys.has(prop);
// };

//const cssExtraProps: Array<keyof CSSProperties> = [

const cssExtraProps = [
  'textJustify',
  'lineClamp',
  'borderBottomLeftRadius',
  'borderBottomRightRadius',
  'borderBottomWidth',
  'borderLeftWidth',
  'borderRadius',
  'borderRightWidth',
  'borderSpacing',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderTopWidth',
  'borderWidth',
  'bottom',
  'columnGap',
  'columnRuleWidth',
  'columnWidth',
  'fontSize',
  'gap',
  'height',
  'left',
  'letterSpacing',
  'lineHeight',
  'margin',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'marginTop',
  'maxHeight',
  'maxWidth',
  'minHeight',
  'minWidth',
  'outlineOffset',
  'outlineWidth',
  'padding',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'perspective',
  'right',
  'rowGap',
  'textIndent',
  'top',
  'width',
  // 'backgroundRepeatX',
  // 'backgroundRepeatY',
  // 'maxZoom',
  // 'minZoom',
  // 'orientation',
  // 'userZoom',
  // 'wrap',
  // 'alwaysBounceHorizontal',
  // 'alwaysBounceVertical',
  // 'automaticallyAdjustContentInsets',
  // 'bounces',
  // 'bouncesZoom',
  // 'canCancelContentTouches',
  // 'centerContent',
  // 'contentLayoutStyle',
  // 'contentInset',
  // 'contentInsetAdjustmentBehavior',
  // 'contentOffset',
  // 'decelerationRate',
  // 'directionalLockEnabled',
  // 'disableIntervalMomentum',
  // 'disableScrollViewPanResponder',
  // 'endFillColor',
  // 'fadingEdgeLength',
  // 'horizontal',
  // 'indicatorStyle',
  // 'invertStickyHeaders',
  // 'keyboardDismissMode',
  // 'keyboardShouldPersistTaps',
  // 'maintainVisibleContentPosition',
  // 'maximumZoomScale',
  // 'minimumZoomScale',
  // 'nestedScrollEnabled',
  // 'onContentSizeChange',
  // 'onMomentumScrollBegin',
  // 'onMomentumScrollEnd',
  // 'onScroll',
  // 'onScrollBeginDrag',
  // 'onScrollEndDrag',
  // 'onScrollToTop',
  // 'overScrollMode',
  // 'pagingEnabled',
  // 'persistentScrollbar',
  // 'pinchGestureEnabled',
  // 'refreshControl',
  // 'removeClippedSubviews',
  // 'scrollBarThumbImage',
  // 'scrollEnabled',
  // 'scrollEventThrottle',
  // 'scrollIndicatorInsets',
  // 'scrollPerfTag',
  // 'scrollToOverflowEnabled',
  // 'scrollsToTop',
  // 'DEPRECATED_sendUpdatedChildFrames',
  // 'showsHorizontalScrollIndicator',
  // 'showsVerticalScrollIndicator',
  // 'snapToAlignment',
  // 'snapToEnd',
  // 'snapToInterval',
  // 'snapToOffsets',
  // 'snapToStart',
  // 'stickyHeaderIndices',
  // 'zoomScale',
  // 'borderBottomEndRadius',
  // 'borderBottomStartRadius',
  // 'borderEndColor',
  // 'borderStartColor',
  // 'borderTopEndRadius',
  // 'borderTopStartRadius',
  // 'elevation',
  // 'shadowColor',
  // 'shadowOffset',
  // 'shadowOpacity',
  // 'shadowRadius',
  // 'borderEndWidth',
  // 'borderStartWidth',
  // 'end',
  // 'marginEnd',
  // 'marginHorizontal',
  // 'marginStart',
  // 'marginVertical',
  // 'paddingEnd',
  // 'paddingHorizontal',
  // 'paddingStart',
  // 'paddingVertical',
  // 'start',
  // 'resizeMode',
  // 'tintColor',
  // 'overlayColor',
  // 'transformMatrix',
  // 'rotation',
  // 'scaleX',
  // 'scaleY',
  // 'translateX',
  // 'translateY',
  // 'rotateX',
  // 'rotateY',
  // 'rotateZ',
  // 'skewX',
  // 'skewY',
  // 'testID',
  // 'decomposedMatrix',
];

// Create a set of all valid CSS properties
export const StyleProps: string[] = [
  ...Object.keys(document.createElement('div').style),
  ...cssExtraProps,
];
// Create a set of all valid CSS properties
export const StyledProps: Set<string> = new Set(StyleProps);

// console.log({
//   props: JSON.stringify(StyleProps.filter((prop) => !cssProperties.has(prop))),
// });

export const isStyleProp = (prop: string): boolean => {
  return (
    (StyledProps.has(prop) || extraKeys.has(prop)) && !includeKeys.has(prop)
  );
};

// Function to process and normalize style properties
export const processStyleProperty = (
  property: string,
  value: any,
  getColor: (color: string) => string
): string | number => {
  if (typeof value === 'number' && !NumberProps.has(property)) {
    return `${value}px`;
  } else if (property.toLowerCase().includes('color')) {
    return getColor(value);
  } else {
    return value;
  }
};
