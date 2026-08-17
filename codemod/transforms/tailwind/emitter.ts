// @ts-nocheck

export type EmissionDecl = { prop: string; value: any; condition?: { code: string } | null; order: number };

function parseExpression(j: any, code: string): any {
  const program = j(`const __tailwindCodemodValue = ${code};`);
  return program.find(j.VariableDeclarator).nodes()[0].init;
}

function valueNode(j: any, value: any): any {
  if (value?.kind === 'expression') return parseExpression(j, value.code);
  if (typeof value === 'number') return j.numericLiteral(value);
  if (typeof value === 'boolean') return j.booleanLiteral(value);
  if (value === null) return j.nullLiteral();
  return j.stringLiteral(String(value));
}

function stripOuterNegation(code: string): string | null {
  const match = code.match(/^!\((.*)\)$/s);
  return match ? match[1] : null;
}

export function conditionalValue(j: any, declarations: EmissionDecl[]): any {
  const ordered = [...declarations].sort((a, b) => a.order - b.order);
  let fallback: any = j.identifier('undefined');
  const unconditional = ordered.filter((item) => !item.condition);
  const lastUnconditional = unconditional[unconditional.length - 1];
  if (lastUnconditional) fallback = valueNode(j, lastUnconditional.value);
  const conditional = ordered.filter((item) => item.condition && (!lastUnconditional || item.order > lastUnconditional.order));
  if (conditional.length === 2 && !unconditional.length) {
    const firstNegated = stripOuterNegation(conditional[0].condition.code);
    const secondNegated = stripOuterNegation(conditional[1].condition.code);
    if (secondNegated === conditional[0].condition.code) return j.conditionalExpression(parseExpression(j, conditional[0].condition.code), valueNode(j, conditional[0].value), valueNode(j, conditional[1].value));
    if (firstNegated === conditional[1].condition.code) return j.conditionalExpression(parseExpression(j, conditional[1].condition.code), valueNode(j, conditional[1].value), valueNode(j, conditional[0].value));
  }
  for (let index = 0; index < conditional.length; index++) {
    const item = conditional[index];
    fallback = j.conditionalExpression(parseExpression(j, item.condition.code), valueNode(j, item.value), fallback);
  }
  return fallback;
}

export function scalarAttribute(j: any, prop: string, declarations: EmissionDecl[]) {
  if (declarations.length === 1 && !declarations[0].condition) {
    const value = declarations[0].value;
    if (typeof value === 'string') return j.jsxAttribute(j.jsxIdentifier(prop), j.stringLiteral(value));
    return j.jsxAttribute(j.jsxIdentifier(prop), j.jsxExpressionContainer(valueNode(j, value)));
  }
  return j.jsxAttribute(j.jsxIdentifier(prop), j.jsxExpressionContainer(conditionalValue(j, declarations)));
}

function objectProperty(j: any, prop: string, value: any) {
  const key = /^[A-Za-z_$][\w$]*$/.test(prop) ? j.identifier(prop) : j.stringLiteral(prop);
  return j.objectProperty(key, value);
}

export function styleObject(j: any, declarations: EmissionDecl[]) {
  const byProp = new Map<string, EmissionDecl[]>();
  for (const item of declarations) {
    if (!byProp.has(item.prop)) byProp.set(item.prop, []);
    byProp.get(item.prop).push(item);
  }
  const properties: any[] = [];
  for (const [prop, items] of byProp) {
    if (items.some((item) => item.condition)) {
      // Conditional spreads avoid serialising undefined style values.
      for (const item of items) {
        if (!item.condition) { properties.push(objectProperty(j, prop, valueNode(j, item.value))); continue; }
        properties.push(j.spreadElement(j.conditionalExpression(
          parseExpression(j, item.condition.code),
          j.objectExpression([objectProperty(j, prop, valueNode(j, item.value))]),
          j.objectExpression([]),
        )));
      }
    } else properties.push(objectProperty(j, prop, valueNode(j, items[items.length - 1].value)));
  }
  return j.objectExpression(properties);
}

export function objectAttribute(j: any, prop: string, declarations: EmissionDecl[]) {
  return j.jsxAttribute(j.jsxIdentifier(prop), j.jsxExpressionContainer(styleObject(j, declarations)));
}

export function mediaAttribute(j: any, media: Map<string, EmissionDecl[]>) {
  const properties = [...media.entries()].map(([key, declarations]) => objectProperty(j, key, styleObject(j, declarations)));
  return j.jsxAttribute(j.jsxIdentifier('media'), j.jsxExpressionContainer(j.objectExpression(properties)));
}

export function residualClassAttribute(j: any, residual: Array<{ raw: string; condition?: { code: string } | null }>) {
  if (!residual.length) return null;
  if (residual.every((item) => !item.condition)) return j.jsxAttribute(j.jsxIdentifier('className'), j.stringLiteral(residual.map((item) => item.raw).join(' ')));
  const elements = residual.map((item) => item.condition
    ? j.logicalExpression('&&', parseExpression(j, item.condition.code), j.stringLiteral(item.raw))
    : j.stringLiteral(item.raw));
  const array = j.arrayExpression(elements);
  const filtered = j.callExpression(j.memberExpression(array, j.identifier('filter')), [j.identifier('Boolean')]);
  const joined = j.callExpression(j.memberExpression(filtered, j.identifier('join')), [j.stringLiteral(' ')]);
  return j.jsxAttribute(j.jsxIdentifier('className'), j.jsxExpressionContainer(joined));
}
