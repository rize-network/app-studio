// @ts-nocheck
import { tokenize } from './parser';

export type ExpressionToken = { raw: string; condition: { code: string } | null };
export type ExpressionAnalysis = {
  analyzable: boolean;
  tokens: ExpressionToken[];
  helpers: Set<string>;
  bindings: Set<string>;
};

const helperNames = new Set(['cn','clsx','classnames','classNames','twMerge']);

function expressionCode(j: any, node: any, substitutions: Map<string, any>): string {
  if (node?.type === 'Identifier' && substitutions.has(node.name)) return j(substitutions.get(node.name)).toSource();
  return j(node).toSource();
}

function safeCondition(node: any, substitutions: Map<string, any>): boolean {
  if (!node) return false;
  if (node.type === 'Identifier' && substitutions.has(node.name)) return safeCondition(substitutions.get(node.name), substitutions);
  if (node.type === 'Identifier') return true;
  if (node.type === 'BooleanLiteral' || node.type === 'Literal') return typeof node.value === 'boolean';
  if (node.type === 'MemberExpression' || node.type === 'OptionalMemberExpression') return safeCondition(node.object, substitutions) && (!node.computed || ['Identifier','StringLiteral','Literal','NumericLiteral'].includes(node.property.type));
  if (node.type === 'UnaryExpression' && node.operator === '!') return safeCondition(node.argument, substitutions);
  if ((node.type === 'BinaryExpression' || node.type === 'LogicalExpression') && ['===','!==','==','!=','&&'].includes(node.operator)) return safeCondition(node.left, substitutions) && ['Identifier','MemberExpression','OptionalMemberExpression','StringLiteral','NumericLiteral','BooleanLiteral','Literal','UnaryExpression','BinaryExpression','LogicalExpression'].includes(node.right?.type) && (node.operator === '&&' ? safeCondition(node.right, substitutions) : true);
  return false;
}

function combine(parent: string | null, child: string): string {
  return parent ? `(${parent}) && (${child})` : child;
}

function negate(code: string): string {
  return `!(${code})`;
}

function literalValue(node: any): string | null {
  if ((node?.type === 'StringLiteral' || node?.type === 'Literal') && typeof node.value === 'string') return node.value;
  if (node?.type === 'TemplateLiteral' && node.expressions.length === 0) return node.quasis.map((q: any) => q.value.cooked ?? q.value.raw).join('');
  return null;
}

function constBindings(root: any, j: any) {
  const result = new Map<string, any>();
  const duplicates = new Set<string>();
  root.find(j.VariableDeclaration).filter((path: any) => path.node.kind === 'const').forEach((path: any) => {
    for (const declaration of path.node.declarations) {
      if (declaration.id?.type !== 'Identifier' || !declaration.init) continue;
      if (result.has(declaration.id.name)) duplicates.add(declaration.id.name);
      else result.set(declaration.id.name, declaration.init);
    }
  });
  duplicates.forEach((name) => result.delete(name));
  return result;
}

function pureFunctions(root: any, j: any) {
  const result = new Map<string, { params: any[]; expression: any }>();
  root.find(j.FunctionDeclaration).forEach((path: any) => {
    const body = path.node.body?.body;
    if (path.node.id?.name && body?.length === 1 && body[0].type === 'ReturnStatement' && body[0].argument) result.set(path.node.id.name, { params: path.node.params, expression: body[0].argument });
  });
  root.find(j.VariableDeclarator).forEach((path: any) => {
    const name = path.node.id?.type === 'Identifier' ? path.node.id.name : null;
    const fn = path.node.init;
    if (!name || !fn || !['ArrowFunctionExpression','FunctionExpression'].includes(fn.type)) return;
    const expression = fn.body.type === 'BlockStatement' && fn.body.body.length === 1 && fn.body.body[0].type === 'ReturnStatement' ? fn.body.body[0].argument : fn.body.type !== 'BlockStatement' ? fn.body : null;
    if (expression) result.set(name, { params: fn.params, expression });
  });
  return result;
}

export function analyzeClassAttribute(attribute: any, root: any, j: any): ExpressionAnalysis {
  const tokens: ExpressionToken[] = [];
  const helpers = new Set<string>();
  const bindings = new Set<string>();
  const constants = constBindings(root, j);
  const functions = pureFunctions(root, j);
  const resolving = new Set<string>();
  let analyzable = true;

  const addLiteral = (value: string, condition: string | null) => {
    tokenize(value).forEach((raw) => tokens.push({ raw, condition: condition ? { code: condition } : null }));
  };

  const visit = (node: any, condition: string | null, substitutions = new Map<string, any>()) => {
    if (!node || !analyzable) { analyzable = false; return; }
    if (node.type === 'Identifier' && substitutions.has(node.name)) return visit(substitutions.get(node.name), condition, substitutions);
    const literal = literalValue(node);
    if (literal !== null) { addLiteral(literal, condition); return; }
    if (node.type === 'NullLiteral' || (node.type === 'Literal' && node.value == null) || (node.type === 'BooleanLiteral' && node.value === false)) return;
    if (node.type === 'Identifier' && constants.has(node.name) && !resolving.has(node.name)) {
      resolving.add(node.name); bindings.add(node.name); visit(constants.get(node.name), condition, substitutions); resolving.delete(node.name); return;
    }
    if (node.type === 'ConditionalExpression' && safeCondition(node.test, substitutions)) {
      const code = expressionCode(j, substitutions.get(node.test?.name) || node.test, substitutions);
      visit(node.consequent, combine(condition, code), substitutions);
      visit(node.alternate, combine(condition, negate(code)), substitutions);
      return;
    }
    if (node.type === 'LogicalExpression' && node.operator === '&&' && safeCondition(node.left, substitutions)) {
      visit(node.right, combine(condition, expressionCode(j, substitutions.get(node.left?.name) || node.left, substitutions)), substitutions);
      return;
    }
    if (node.type === 'ArrayExpression') {
      for (const element of node.elements) {
        if (!element) continue;
        if (element.type === 'SpreadElement') { analyzable = false; return; }
        visit(element, condition, substitutions);
      }
      return;
    }
    if (node.type === 'ObjectExpression') {
      for (const property of node.properties) {
        if (property.type !== 'ObjectProperty' && property.type !== 'Property') { analyzable = false; return; }
        const key = property.computed ? literalValue(property.key) : property.key.name ?? property.key.value;
        if (typeof key !== 'string' || !safeCondition(property.value, substitutions)) { analyzable = false; return; }
        const valueCode = expressionCode(j, substitutions.get(property.value?.name) || property.value, substitutions);
        addLiteral(key, combine(condition, valueCode));
      }
      return;
    }
    if ((node.type === 'MemberExpression' || node.type === 'OptionalMemberExpression') && node.computed && node.object.type === 'Identifier' && constants.has(node.object.name)) {
      const record = constants.get(node.object.name);
      if (record?.type !== 'ObjectExpression' || !safeCondition(node.property, substitutions)) { analyzable = false; return; }
      bindings.add(node.object.name);
      const selector = expressionCode(j, substitutions.get(node.property?.name) || node.property, substitutions);
      for (const property of record.properties) {
        if (!['ObjectProperty','Property'].includes(property.type)) { analyzable = false; return; }
        const key = property.key.name ?? property.key.value;
        const value = literalValue(property.value);
        if (typeof key !== 'string' || value === null) { analyzable = false; return; }
        addLiteral(value, combine(condition, `${selector} === ${JSON.stringify(key)}`));
      }
      return;
    }
    if (node.type === 'CallExpression' && node.callee.type === 'Identifier') {
      const name = node.callee.name;
      if (helperNames.has(name)) {
        helpers.add(name);
        for (const argument of node.arguments) {
          if (argument.type === 'SpreadElement') { analyzable = false; return; }
          visit(argument, condition, substitutions);
        }
        return;
      }
      const fn = functions.get(name);
      if (fn && fn.params.every((param) => param.type === 'Identifier') && node.arguments.every((arg) => arg.type !== 'SpreadElement')) {
        const next = new Map(substitutions);
        fn.params.forEach((param, index) => next.set(param.name, node.arguments[index]));
        bindings.add(name);
        visit(fn.expression, condition, next);
        return;
      }
    }
    analyzable = false;
  };

  const value = attribute?.value;
  if (!value) analyzable = false;
  else if (value.type === 'JSXExpressionContainer') visit(value.expression, null);
  else visit(value, null);
  return { analyzable, tokens, helpers, bindings };
}
