// @ts-nocheck
export type ElementTarget = { component: string; as?: string };

const direct: Record<string, string> = {
  div: 'View', span: 'Span', img: 'Image', button: 'Button', input: 'Input', form: 'Form',
};

const htmlTags = new Set([
  'a','abbr','address','article','aside','audio','b','blockquote','br','caption','cite','code','col','colgroup',
  'dd','del','details','dfn','dialog','dl','dt','em','fieldset','figcaption','figure','footer','h1','h2','h3','h4','h5','h6',
  'header','hr','i','iframe','ins','kbd','label','legend','li','main','mark','menu','meter','nav','ol','optgroup','option',
  'output','p','picture','pre','progress','q','s','samp','section','select','small','source','strong','sub','summary','sup',
  'table','tbody','td','textarea','tfoot','th','thead','time','tr','u','ul','var','video','wbr',
]);

export function targetForTag(tag: string, allTags = true): ElementTarget | null {
  if (direct[tag]) return { component: direct[tag] };
  if (allTags && htmlTags.has(tag)) return { component: 'View', as: tag };
  return null;
}

export function getJSXTag(element: any): string | null {
  const name = element?.openingElement?.name;
  if (!name || name.type !== 'JSXIdentifier') return null;
  if (!/^[a-z]/.test(name.name)) return null;
  if (!element.openingElement.selfClosing) {
    const closing = element.closingElement?.name;
    if (!closing || closing.type !== 'JSXIdentifier' || closing.name !== name.name) return null;
  }
  return name.name;
}

export function attributeName(attribute: any): string | null {
  return attribute?.type === 'JSXAttribute' && attribute.name?.type === 'JSXIdentifier'
    ? attribute.name.name : null;
}

export function staticClassName(attribute: any): string | null {
  const value = attribute?.value;
  if (!value) return null;
  if ((value.type === 'StringLiteral' || value.type === 'Literal') && typeof value.value === 'string') return value.value;
  if (value.type !== 'JSXExpressionContainer') return null;
  const expression = value.expression;
  if ((expression?.type === 'StringLiteral' || expression?.type === 'Literal') && typeof expression.value === 'string') return expression.value;
  if (expression?.type === 'TemplateLiteral' && expression.expressions.length === 0) {
    return expression.quasis.map((part: any) => part.value.cooked ?? part.value.raw).join('');
  }
  return null;
}

export function staticAttributeValue(attribute: any): string | boolean | null {
  if (!attribute || attribute.type !== 'JSXAttribute') return null;
  if (attribute.value == null) return true;
  const value = attribute.value;
  if (value.type === 'StringLiteral' || value.type === 'Literal') return typeof value.value === 'string' || typeof value.value === 'boolean' ? value.value : null;
  if (value.type === 'JSXExpressionContainer' && (value.expression?.type === 'BooleanLiteral' || value.expression?.type === 'StringLiteral' || value.expression?.type === 'Literal')) return value.expression.value;
  return null;
}

export function provenAttributeVariants(element: any): Set<string> {
  const result = new Set<string>();
  for (const attribute of element?.openingElement?.attributes || []) {
    const name = attributeName(attribute);
    const value = staticAttributeValue(attribute);
    if (!name || value === null) continue;
    if (name.startsWith('aria-') && (value === true || value === 'true')) result.add(name);
    if (name.startsWith('aria-') && value !== false && value !== 'false') result.add(`aria-[${name.slice(5)}=${value}]`);
    if (name.startsWith('data-')) result.add(`data-[${name.slice(5)}=${value}]`);
  }
  return result;
}

function returnedJSX(fn: any): any | null {
  if (!fn) return null;
  if (fn.body?.type === 'JSXElement') return fn.body;
  if (fn.body?.type !== 'BlockStatement') return null;
  const returns = fn.body.body.filter((statement: any) => statement.type === 'ReturnStatement' && statement.argument?.type === 'JSXElement');
  return returns.length === 1 ? returns[0].argument : null;
}

/** Local components are safe only when a single props identifier is spread on the returned native root. */
export function findLocalForwarders(root: any, j: any) {
  const result = new Map<string, { element: any; target: ElementTarget }>();
  const inspect = (name: string | null, fn: any) => {
    if (!name || !/^[A-Z]/.test(name) || fn?.params?.length !== 1 || fn.params[0].type !== 'Identifier') return;
    const element = returnedJSX(fn);
    const tag = getJSXTag(element);
    const target = tag ? targetForTag(tag, true) : null;
    if (!element || !target) return;
    const forwards = element.openingElement.attributes.some((attribute: any) => attribute.type === 'JSXSpreadAttribute' && attribute.argument?.type === 'Identifier' && attribute.argument.name === fn.params[0].name);
    if (forwards) result.set(name, { element, target });
  };
  root.find(j.FunctionDeclaration).forEach((path: any) => inspect(path.node.id?.name, path.node));
  root.find(j.VariableDeclarator).forEach((path: any) => {
    if (path.node.id?.type === 'Identifier' && ['ArrowFunctionExpression','FunctionExpression'].includes(path.node.init?.type)) inspect(path.node.id.name, path.node.init);
  });
  return result;
}

export function hasStaticMarker(element: any, marker: string): boolean {
  const attribute = element?.openingElement?.attributes?.find((item: any) => attributeName(item) === 'className');
  const value = staticClassName(attribute);
  return value ? value.trim().split(/\s+/).includes(marker) : false;
}

export function proveParentMarker(path: any, marker: string): boolean {
  let cursor = path.parent;
  while (cursor) {
    if (cursor.node?.type === 'JSXElement' && hasStaticMarker(cursor.node, marker)) return true;
    if (/Function|Program/.test(cursor.node?.type || '')) break;
    cursor = cursor.parent;
  }
  return false;
}

export function provePreviousPeer(path: any): boolean {
  const parentElementPath = path.parent?.node?.type === 'JSXElement' ? path.parent : path.parent?.parent;
  const parent = parentElementPath?.node;
  if (!parent || parent.type !== 'JSXElement') return false;
  for (const child of parent.children || []) {
    if (child === path.node) break;
    if (child?.type === 'JSXElement' && hasStaticMarker(child, 'peer')) return true;
  }
  return false;
}

export function inspectAppStudioImport(root: any, j: any) {
  const declarations = root.find(j.ImportDeclaration)
    .filter((path: any) => path.node.source.value === 'app-studio').nodes();
  if (declarations.length > 1) return { valid: false, names: new Set() };
  if (!declarations.length) return { valid: true, declaration: null, names: new Set() };
  const declaration = declarations[0];
  if (declaration.importKind === 'type' || declaration.assertions?.length || declaration.attributes?.length || !declaration.specifiers?.length) {
    return { valid: false, names: new Set() };
  }
  const names = new Set<string>();
  for (const specifier of declaration.specifiers) {
    if (specifier.type !== 'ImportSpecifier' || specifier.importKind === 'type' || specifier.imported?.type !== 'Identifier' || specifier.local?.type !== 'Identifier' || specifier.imported.name !== specifier.local.name) {
      return { valid: false, names: new Set() };
    }
    names.add(specifier.local.name);
  }
  return { valid: true, declaration, names };
}

function addPatternBindings(pattern: any, bindings: Set<string>) {
  if (!pattern) return;
  if (pattern.type === 'Identifier') bindings.add(pattern.name);
  else if (pattern.type === 'RestElement') addPatternBindings(pattern.argument, bindings);
  else if (pattern.type === 'AssignmentPattern') addPatternBindings(pattern.left, bindings);
  else if (pattern.type === 'TSParameterProperty') addPatternBindings(pattern.parameter, bindings);
  else if (pattern.type === 'ArrayPattern') pattern.elements.forEach((item: any) => addPatternBindings(item, bindings));
  else if (pattern.type === 'ObjectPattern') pattern.properties.forEach((item: any) => addPatternBindings(item.type === 'RestElement' ? item.argument : item.value, bindings));
}

export function collectBindings(root: any, j: any): Set<string> {
  const bindings = new Set<string>();
  root.find(j.ImportDeclaration).forEach((path: any) => path.node.specifiers?.forEach((item: any) => addPatternBindings(item.local, bindings)));
  root.find(j.VariableDeclarator).forEach((path: any) => addPatternBindings(path.node.id, bindings));
  root.find(j.FunctionDeclaration).forEach((path: any) => { addPatternBindings(path.node.id, bindings); path.node.params.forEach((p: any) => addPatternBindings(p, bindings)); });
  root.find(j.FunctionExpression).forEach((path: any) => { addPatternBindings(path.node.id, bindings); path.node.params.forEach((p: any) => addPatternBindings(p, bindings)); });
  root.find(j.ArrowFunctionExpression).forEach((path: any) => path.node.params.forEach((p: any) => addPatternBindings(p, bindings)));
  root.find(j.ClassDeclaration).forEach((path: any) => addPatternBindings(path.node.id, bindings));
  root.find(j.ClassExpression).forEach((path: any) => addPatternBindings(path.node.id, bindings));
  return bindings;
}

export function addOrMergeImport(root: any, j: any, info: any, requested: Set<string>) {
  if (!requested.size) return;
  if (info.declaration) {
    for (const name of requested) {
      if (!info.names.has(name)) info.declaration.specifiers.push(j.importSpecifier(j.identifier(name)));
    }
    return;
  }
  const declaration = j.importDeclaration([...requested].map((name) => j.importSpecifier(j.identifier(name))), j.stringLiteral('app-studio'));
  root.find(j.Program).nodes()[0].body.unshift(declaration);
}
