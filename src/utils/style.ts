// styleHelpers.ts
import { NumberProps } from './constants';
// Excluded keys imported from constants.ts
// import { excludedKeys } from './constants';

export const StyleProps = new Set([
  'alignContent',
  'alignItems',
  'alignSelf',
  'alignmentBaseline',
  'all',
  'animation',
  'animationDelay',
  'animationDirection',
  'animationDuration',
  'animationFillMode',
  'animationIterationCount',
  'animationName',
  'animationPlayState',
  'animationTimingFunction',
  'appearance',
  'backdropFilter',
  'backfaceVisibility',
  'background',
  'backgroundAttachment',
  'backgroundBlendMode',
  'backgroundClip',
  'backgroundColor',
  'backgroundImage',
  'backgroundOrigin',
  'backgroundPosition',
  'backgroundPositionX',
  'backgroundPositionY',
  'backgroundRepeat',
  'backgroundRepeatX',
  'backgroundRepeatY',
  'backgroundSize',
  'baselineShift',
  'blockSize',
  'border',
  'borderBlockEnd',
  'borderBlockEndColor',
  'borderBlockEndStyle',
  'borderBlockEndWidth',
  'borderBlockStart',
  'borderBlockStartColor',
  'borderBlockStartStyle',
  'borderBlockStartWidth',
  'borderBottom',
  'borderBottomColor',
  'borderBottomLeftRadius',
  'borderBottomRightRadius',
  'borderBottomStyle',
  'borderBottomWidth',
  'borderCollapse',
  'borderColor',
  'borderImage',
  'borderImageOutset',
  'borderImageRepeat',
  'borderImageSlice',
  'borderImageSource',
  'borderImageWidth',
  'borderInlineEnd',
  'borderInlineEndColor',
  'borderInlineEndStyle',
  'borderInlineEndWidth',
  'borderInlineStart',
  'borderInlineStartColor',
  'borderInlineStartStyle',
  'borderInlineStartWidth',
  'borderLeft',
  'borderLeftColor',
  'borderLeftStyle',
  'borderLeftWidth',
  'borderRadius',
  'borderRight',
  'borderRightColor',
  'borderRightStyle',
  'borderRightWidth',
  'borderSpacing',
  'borderStyle',
  'borderTop',
  'borderTopColor',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderTopStyle',
  'borderTopWidth',
  'borderWidth',
  'bottom',
  'boxShadow',
  'boxSizing',
  'breakAfter',
  'breakBefore',
  'breakInside',
  'bufferedRendering',
  'captionSide',
  'caretColor',
  'clear',
  'clip',
  'clipPath',
  'clipRule',
  'color',
  'colorInterpolation',
  'colorInterpolationFilters',
  'colorRendering',
  'columnCount',
  'columnFill',
  'columnGap',
  'columnRule',
  'columnRuleColor',
  'columnRuleStyle',
  'columnRuleWidth',
  'columnSpan',
  'columnWidth',
  'columns',
  'contain',
  'content',
  'counterIncrement',
  'counterReset',
  'cursor',
  'cx',
  'cy',
  'd',
  'direction',
  'display',
  'dominantBaseline',
  'emptyCells',
  'fill',
  'fillOpacity',
  'fillRule',
  'filter',
  'flex',
  'flexBasis',
  'flexDirection',
  'flexFlow',
  'flexGrow',
  'flexShrink',
  'flexWrap',
  'float',
  'floodColor',
  'floodOpacity',
  'font',
  'fontDisplay',
  'fontFamily',
  'fontFeatureSettings',
  'fontKerning',
  'fontSize',
  'fontStretch',
  'fontStyle',
  'fontVariant',
  'fontVariantCaps',
  'fontVariantEastAsian',
  'fontVariantLigatures',
  'fontVariantNumeric',
  'fontVariationSettings',
  'fontWeight',
  'gap',
  'grid',
  'gridArea',
  'gridAutoColumns',
  'gridAutoFlow',
  'gridAutoRows',
  'gridColumn',
  'gridColumnEnd',
  'gridColumnGap',
  'gridColumnStart',
  'gridGap',
  'gridRow',
  'gridRowEnd',
  'gridRowGap',
  'gridRowStart',
  'gridTemplate',
  'gridTemplateAreas',
  'gridTemplateColumns',
  'gridTemplateRows',
  'height',
  'hyphens',
  'imageRendering',
  'inlineSize',
  'isolation',
  'justifyContent',
  'justifyItems',
  'justifySelf',
  'left',
  'letterSpacing',
  'lightingColor',
  'lineBreak',
  'lineHeight',
  'listStyle',
  'listStyleImage',
  'listStylePosition',
  'listStyleType',
  'margin',
  'marginBlockEnd',
  'marginBlockStart',
  'marginBottom',
  'marginInlineEnd',
  'marginInlineStart',
  'marginLeft',
  'marginRight',
  'marginTop',
  'marker',
  'markerEnd',
  'markerMid',
  'markerStart',
  'mask',
  'maskType',
  'maxBlockSize',
  'maxHeight',
  'maxInlineSize',
  'maxWidth',
  'maxZoom',
  'minBlockSize',
  'minHeight',
  'minInlineSize',
  'minWidth',
  'minZoom',
  'mixBlendMode',
  'objectFit',
  'objectPosition',
  'offset',
  'offsetDistance',
  'offsetPath',
  'offsetRotate',
  'opacity',
  'order',
  'orientation',
  'orphans',
  'outline',
  'outlineColor',
  'outlineOffset',
  'outlineStyle',
  'outlineWidth',
  'overflow',
  'overflowAnchor',
  'overflowWrap',
  'overflowX',
  'overflowY',
  'overscrollBehavior',
  'overscrollBehaviorBlock',
  'overscrollBehaviorInline',
  'overscrollBehaviorX',
  'overscrollBehaviorY',
  'padding',
  'paddingBlockEnd',
  'paddingBlockStart',
  'paddingBottom',
  'paddingInlineEnd',
  'paddingInlineStart',
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'page',
  'pageBreakAfter',
  'pageBreakBefore',
  'pageBreakInside',
  'paintOrder',
  'perspective',
  'perspectiveOrigin',
  'placeContent',
  'placeItems',
  'placeSelf',
  'pointerEvents',
  'position',
  'quotes',
  'r',
  'resize',
  'right',
  'rowGap',
  'rx',
  'ry',
  'scrollBehavior',
  'scrollMargin',
  'scrollMarginBlock',
  'scrollMarginBlockEnd',
  'scrollMarginBlockStart',
  'scrollMarginBottom',
  'scrollMarginInline',
  'scrollMarginInlineEnd',
  'scrollMarginInlineStart',
  'scrollMarginLeft',
  'scrollMarginRight',
  'scrollMarginTop',
  'scrollPadding',
  'scrollPaddingBlock',
  'scrollPaddingBlockEnd',
  'scrollPaddingBlockStart',
  'scrollPaddingBottom',
  'scrollPaddingInline',
  'scrollPaddingInlineEnd',
  'scrollPaddingInlineStart',
  'scrollPaddingLeft',
  'scrollPaddingRight',
  'scrollPaddingTop',
  'scrollSnapAlign',
  'scrollSnapStop',
  'scrollSnapType',
  'shapeImageThreshold',
  'shapeMargin',
  'shapeOutside',
  'shapeRendering',
  'size',
  'speak',
  'src',
  'stopColor',
  'stopOpacity',
  'stroke',
  'strokeDasharray',
  'strokeDashoffset',
  'strokeLinecap',
  'strokeLinejoin',
  'strokeMiterlimit',
  'strokeOpacity',
  'strokeWidth',
  'tabSize',
  'tableLayout',
  'textAlign',
  'textAlignLast',
  'textAnchor',
  'textCombineUpright',
  'textDecoration',
  'textDecorationColor',
  'textDecorationLine',
  'textDecorationSkipInk',
  'textDecorationStyle',
  'textIndent',
  'textOrientation',
  'textOverflow',
  'textRendering',
  'textShadow',
  'textSizeAdjust',
  'textTransform',
  'textUnderlinePosition',
  'top',
  'touchAction',
  'transform',
  'transformBox',
  'transformOrigin',
  'transformStyle',
  'transition',
  'transitionDelay',
  'transitionDuration',
  'transitionProperty',
  'transitionTimingFunction',
  'unicodeBidi',
  'unicodeRange',
  'userSelect',
  'userZoom',
  'vectorEffect',
  'verticalAlign',
  'visibility',
  'whiteSpace',
  'widows',
  'width',
  'willChange',
  'wordBreak',
  'wordSpacing',
  'wordWrap',
  'writingMode',
  'x',
  'y',
  'zIndex',
  'zoom',
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
  'shadowColor',
  'shadowOffset',
  'shadowOpacity',
  'shadowRadius',
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
  'transform',
  'transformMatrix',
  'rotation',
  'scaleX',
  'scaleY',
  'translateX',
  'translateY',
  'perspective',
  'rotate',
  'rotateX',
  'rotateY',
  'rotateZ',
  'scale',
  'skewX',
  'skewY',
  'testID',
  'decomposedMatrix',
]);

const nonStyleAttributes = new Set(['length', 'parentRule', 'src']);

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

export const isStyleProp = (property: string): boolean => {
  return StyleProps.has(property) || nonStyleAttributes.has(property);
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
