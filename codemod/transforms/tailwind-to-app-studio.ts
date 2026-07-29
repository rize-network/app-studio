// @ts-nocheck
'use strict';

const DISPLAY = {
  flex: ['display', 'flex'],
  grid: ['display', 'grid'],
  block: ['display', 'block'],
  inline: ['display', 'inline'],
  'inline-block': ['display', 'inline-block'],
  'inline-flex': ['display', 'inline-flex'],
  hidden: ['display', 'none'],
};

const POSITION = {
  relative: ['position', 'relative'],
  absolute: ['position', 'absolute'],
  fixed: ['position', 'fixed'],
  static: ['position', 'static'],
  sticky: ['position', 'sticky'],
};

const FLEX_DIRECTION = {
  'flex-row': ['flexDirection', 'row'],
  'flex-row-reverse': ['flexDirection', 'row-reverse'],
  'flex-col': ['flexDirection', 'column'],
  'flex-col-reverse': ['flexDirection', 'column-reverse'],
};

const FLEX_WRAP = {
  'flex-wrap': ['flexWrap', 'wrap'],
  'flex-wrap-reverse': ['flexWrap', 'wrap-reverse'],
  'flex-nowrap': ['flexWrap', 'nowrap'],
};

const ALIGN_ITEMS = {
  'items-start': ['alignItems', 'flex-start'],
  'items-end': ['alignItems', 'flex-end'],
  'items-center': ['alignItems', 'center'],
  'items-baseline': ['alignItems', 'baseline'],
  'items-stretch': ['alignItems', 'stretch'],
};

const JUSTIFY_CONTENT = {
  'justify-normal': ['justifyContent', 'normal'],
  'justify-start': ['justifyContent', 'flex-start'],
  'justify-end': ['justifyContent', 'flex-end'],
  'justify-center': ['justifyContent', 'center'],
  'justify-between': ['justifyContent', 'space-between'],
  'justify-around': ['justifyContent', 'space-around'],
  'justify-evenly': ['justifyContent', 'space-evenly'],
};

const GROW_SHRINK = {
  grow: ['flexGrow', 1],
  'grow-0': ['flexGrow', 0],
  shrink: ['flexShrink', 1],
  'shrink-0': ['flexShrink', 0],
};

const DIMENSIONS = {
  'min-w-0': ['minWidth', 0],
  'min-h-0': ['minHeight', 0],
  'h-full': ['height', '100%'],
  'w-full': ['width', '100%'],
  'max-w-full': ['maxWidth', '100%'],
  'max-h-full': ['maxHeight', '100%'],
};

const OVERFLOW = {
  'overflow-auto': ['overflow', 'auto'],
  'overflow-hidden': ['overflow', 'hidden'],
  'overflow-clip': ['overflow', 'clip'],
  'overflow-visible': ['overflow', 'visible'],
  'overflow-scroll': ['overflow', 'scroll'],
  'overflow-x-auto': ['overflowX', 'auto'],
  'overflow-x-hidden': ['overflowX', 'hidden'],
  'overflow-x-clip': ['overflowX', 'clip'],
  'overflow-x-visible': ['overflowX', 'visible'],
  'overflow-x-scroll': ['overflowX', 'scroll'],
  'overflow-y-auto': ['overflowY', 'auto'],
  'overflow-y-hidden': ['overflowY', 'hidden'],
  'overflow-y-clip': ['overflowY', 'clip'],
  'overflow-y-visible': ['overflowY', 'visible'],
  'overflow-y-scroll': ['overflowY', 'scroll'],
};

const TEXT_ALIGN = {
  'text-left': ['textAlign', 'left'],
  'text-center': ['textAlign', 'center'],
  'text-right': ['textAlign', 'right'],
  'text-justify': ['textAlign', 'justify'],
  'text-start': ['textAlign', 'start'],
  'text-end': ['textAlign', 'end'],
};

const WHITE_SPACE = {
  'whitespace-normal': ['whiteSpace', 'normal'],
  'whitespace-nowrap': ['whiteSpace', 'nowrap'],
  'whitespace-pre': ['whiteSpace', 'pre'],
  'whitespace-pre-line': ['whiteSpace', 'pre-line'],
  'whitespace-pre-wrap': ['whiteSpace', 'pre-wrap'],
  'whitespace-break-spaces': ['whiteSpace', 'break-spaces'],
};

const WORD_BREAK = {
  'break-normal': ['wordBreak', 'normal'],
  'break-words': ['overflowWrap', 'break-word'],
  'break-all': ['wordBreak', 'break-all'],
  'break-keep': ['wordBreak', 'keep-all'],
};

const CURSOR = [
  'auto',
  'default',
  'pointer',
  'wait',
  'text',
  'move',
  'help',
  'not-allowed',
  'none',
  'context-menu',
  'progress',
  'crosshair',
  'grab',
  'grabbing',
  'col-resize',
  'row-resize',
  'ew-resize',
  'ns-resize',
  'nesw-resize',
  'nwse-resize',
  'zoom-in',
  'zoom-out',
].reduce((mapping, value) => {
  mapping[`cursor-${value}`] = ['cursor', value];
  return mapping;
}, {});

const POINTER_EVENTS = {
  'pointer-events-none': ['pointerEvents', 'none'],
  'pointer-events-auto': ['pointerEvents', 'auto'],
};

const USER_SELECT = {
  'select-none': ['userSelect', 'none'],
  'select-text': ['userSelect', 'text'],
  'select-all': ['userSelect', 'all'],
  'select-auto': ['userSelect', 'auto'],
};

export const CLASS_TO_PROP = Object.freeze({
  ...DISPLAY,
  ...POSITION,
  ...FLEX_DIRECTION,
  ...FLEX_WRAP,
  ...ALIGN_ITEMS,
  ...JUSTIFY_CONTENT,
  ...GROW_SHRINK,
  ...DIMENSIONS,
  ...OVERFLOW,
  ...TEXT_ALIGN,
  ...WHITE_SPACE,
  ...WORD_BREAK,
  ...CURSOR,
  ...POINTER_EVENTS,
  ...USER_SELECT,
});

function getStaticClassName(attribute) {
  if (!attribute || attribute.type !== 'JSXAttribute') return null;
  const value = attribute.value;
  if (!value) return null;

  if (value.type === 'StringLiteral' || value.type === 'Literal') {
    return typeof value.value === 'string' ? value.value : null;
  }

  if (value.type !== 'JSXExpressionContainer') return null;
  const expression = value.expression;

  if (
    expression &&
    (expression.type === 'StringLiteral' || expression.type === 'Literal')
  ) {
    return typeof expression.value === 'string' ? expression.value : null;
  }

  if (
    expression &&
    expression.type === 'TemplateLiteral' &&
    expression.expressions.length === 0
  ) {
    return expression.quasis.map((quasi) => quasi.value.cooked ?? quasi.value.raw).join('');
  }

  return null;
}

function getSimpleAttributeName(attribute) {
  if (attribute.type !== 'JSXAttribute') return null;
  return attribute.name && attribute.name.type === 'JSXIdentifier'
    ? attribute.name.name
    : null;
}

function isForbiddenAttribute(name) {
  return (
    name === 'style' ||
    name === 'as' ||
    name === 'css' ||
    name === 'media' ||
    name === 'on'
  );
}

function getTagName(element) {
  const openingName = element.openingElement.name;
  if (openingName.type !== 'JSXIdentifier') return null;
  if (openingName.name !== 'div' && openingName.name !== 'span') return null;

  if (element.openingElement.selfClosing) {
    return element.closingElement ? null : openingName.name;
  }

  const closingName = element.closingElement && element.closingElement.name;
  if (!closingName || closingName.type !== 'JSXIdentifier') return null;
  return closingName.name === openingName.name ? openingName.name : null;
}

function analyzeElement(path) {
  const element = path.node;
  const tagName = getTagName(element);
  if (!tagName) return null;

  let classNameAttribute = null;
  const existingAttributeNames = new Set();

  for (const attribute of element.openingElement.attributes) {
    if (attribute.type === 'JSXSpreadAttribute') return null;
    const name = getSimpleAttributeName(attribute);
    if (!name) return null;
    if (name === 'className') {
      if (classNameAttribute) return null;
      classNameAttribute = attribute;
      continue;
    }
    if (isForbiddenAttribute(name)) return null;
    existingAttributeNames.add(name);
  }

  if (!classNameAttribute) return null;
  const className = getStaticClassName(classNameAttribute);
  if (className === null || !className.trim()) return null;

  const generated = [];
  const generatedPropNames = new Set();
  for (const token of className.trim().split(/\s+/)) {
    if (token.includes(':') || !Object.prototype.hasOwnProperty.call(CLASS_TO_PROP, token)) {
      return null;
    }

    const [propName, value] = CLASS_TO_PROP[token];
    if (generatedPropNames.has(propName) || existingAttributeNames.has(propName)) {
      return null;
    }
    generatedPropNames.add(propName);
    generated.push({ propName, value });
  }

  return { element, tagName, classNameAttribute, generated };
}

function addPatternBindings(pattern, bindings) {
  if (!pattern) return;
  switch (pattern.type) {
    case 'Identifier':
      bindings.add(pattern.name);
      break;
    case 'RestElement':
      addPatternBindings(pattern.argument, bindings);
      break;
    case 'AssignmentPattern':
      addPatternBindings(pattern.left, bindings);
      break;
    case 'ArrayPattern':
      pattern.elements.forEach((element) => addPatternBindings(element, bindings));
      break;
    case 'ObjectPattern':
      pattern.properties.forEach((property) => {
        if (property.type === 'RestElement') {
          addPatternBindings(property.argument, bindings);
        } else {
          addPatternBindings(property.value, bindings);
        }
      });
      break;
    case 'TSParameterProperty':
      addPatternBindings(pattern.parameter, bindings);
      break;
    default:
      break;
  }
}

function collectBindingNames(root, j) {
  const bindings = new Set();

  root.find(j.ImportDeclaration).forEach((path) => {
    path.node.specifiers?.forEach((specifier) => {
      if (specifier.local && specifier.local.type === 'Identifier') {
        bindings.add(specifier.local.name);
      }
    });
  });
  root.find(j.VariableDeclarator).forEach((path) => addPatternBindings(path.node.id, bindings));
  root.find(j.FunctionDeclaration).forEach((path) => {
    bindings.add(path.node.id?.name);
    path.node.params.forEach((param) => addPatternBindings(param, bindings));
  });
  root.find(j.FunctionExpression).forEach((path) => {
    bindings.add(path.node.id?.name);
    path.node.params.forEach((param) => addPatternBindings(param, bindings));
  });
  root.find(j.ArrowFunctionExpression).forEach((path) => {
    path.node.params.forEach((param) => addPatternBindings(param, bindings));
  });
  root.find(j.ClassDeclaration).forEach((path) => bindings.add(path.node.id?.name));
  root.find(j.ClassExpression).forEach((path) => bindings.add(path.node.id?.name));
  root.find(j.CatchClause).forEach((path) => addPatternBindings(path.node.param, bindings));

  bindings.delete(undefined);
  return bindings;
}

function inspectAppStudioImport(root, j) {
  const declarations = root
    .find(j.ImportDeclaration)
    .filter((path) => path.node.source.value === 'app-studio')
    .nodes();

  if (declarations.length > 1) return { valid: false };
  if (declarations.length === 0) return { valid: true, declaration: null, names: new Set() };

  const declaration = declarations[0];
  if (
    declaration.importKind === 'type' ||
    (declaration.assertions && declaration.assertions.length > 0) ||
    (declaration.attributes && declaration.attributes.length > 0) ||
    !declaration.specifiers ||
    declaration.specifiers.length === 0
  ) {
    return { valid: false };
  }

  const names = new Set();
  for (const specifier of declaration.specifiers) {
    if (
      specifier.type !== 'ImportSpecifier' ||
      specifier.importKind === 'type' ||
      !specifier.imported ||
      specifier.imported.type !== 'Identifier' ||
      !specifier.local ||
      specifier.local.type !== 'Identifier' ||
      specifier.imported.name !== specifier.local.name
    ) {
      return { valid: false };
    }
    names.add(specifier.local.name);
  }

  return { valid: true, declaration, names };
}

function jsxAttribute(j, propName, value) {
  const valueNode =
    typeof value === 'number'
      ? j.jsxExpressionContainer(j.numericLiteral(value))
      : j.stringLiteral(value);
  return j.jsxAttribute(j.jsxIdentifier(propName), valueNode);
}

function applyElement(j, candidate, preserveClassNames) {
  const targetName = candidate.tagName === 'div' ? 'View' : 'Span';
  candidate.element.openingElement.name = j.jsxIdentifier(targetName);
  if (candidate.element.closingElement) {
    candidate.element.closingElement.name = j.jsxIdentifier(targetName);
  }

  const generatedAttributes = candidate.generated.map(({ propName, value }) =>
    jsxAttribute(j, propName, value)
  );
  const attributes = [];
  for (const attribute of candidate.element.openingElement.attributes) {
    if (attribute !== candidate.classNameAttribute) {
      attributes.push(attribute);
      continue;
    }
    if (preserveClassNames) attributes.push(attribute);
    attributes.push(...generatedAttributes);
  }
  candidate.element.openingElement.attributes = attributes;
}

function addOrMergeImport(root, j, importInfo, names) {
  if (!names.length) return;
  if (importInfo.declaration) {
    const existingNames = new Set(
      importInfo.declaration.specifiers.map((specifier) => specifier.imported.name)
    );
    names.forEach((name) => {
      if (existingNames.has(name)) return;
      importInfo.declaration.specifiers.push(j.importSpecifier(j.identifier(name)));
      existingNames.add(name);
    });
    return;
  }

  const declaration = j.importDeclaration(
    names.map((name) => j.importSpecifier(j.identifier(name))),
    j.stringLiteral('app-studio')
  );
  const program = root.find(j.Program).nodes()[0];
  program.body.unshift(declaration);
}

export default function transform(file, api, options = {}) {
  const j = api.jscodeshift;
  const root = j(file.source);
  const candidates = [];

  root.find(j.JSXElement).forEach((path) => {
    const candidate = analyzeElement(path);
    if (candidate) candidates.push(candidate);
  });

  if (!candidates.length) return file.source;

  const importInfo = inspectAppStudioImport(root, j);
  if (!importInfo.valid) return file.source;

  const bindings = collectBindingNames(root, j);
  const allowedImportedBindings = importInfo.names;
  if (
    (bindings.has('View') && !allowedImportedBindings.has('View')) ||
    (bindings.has('Span') && !allowedImportedBindings.has('Span'))
  ) {
    return file.source;
  }

  const preserveClassNames =
    options.preserveClassNames === true || options.preserveClassNames === 'true';
  candidates.forEach((candidate) => applyElement(j, candidate, preserveClassNames));

  const names = [];
  if (candidates.some((candidate) => candidate.tagName === 'div')) names.push('View');
  if (candidates.some((candidate) => candidate.tagName === 'span')) names.push('Span');
  addOrMergeImport(root, j, importInfo, names);

  return root.toSource();
}
