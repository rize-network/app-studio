// @ts-nocheck
'use strict';

import { parseClass } from './tailwind/parser';
import { analyzeClassAttribute } from './tailwind/expressions';
import { place, responsiveKeys } from './tailwind/modifiers';
import { darkPairs, pairKey } from './tailwind/mappings';
import { compactSpacing, resolveLastWins } from './tailwind/conflicts';
import {
  addOrMergeImport, attributeName, collectBindings, getJSXTag, inspectAppStudioImport,
  findLocalForwarders, proveParentMarker, provePreviousPeer, provenAttributeVariants, targetForTag,
} from './tailwind/elements';
import {
  mediaAttribute, objectAttribute, residualClassAttribute, scalarAttribute,
} from './tailwind/emitter';
import { cleanupConsumed } from './tailwind/cleanup';
import { createFileReport, publishReport, skip, unknown } from './tailwind/report';

// Kept as a public compatibility export for callers which used the prototype's
// exact table. The complete registry now lives under tailwind/mappings.
export { exactMappings as CLASS_TO_PROP } from './tailwind/mappings';

const trueOption = (value: any, fallback = false) => value === undefined ? fallback : value === true || value === 'true';
const conditionKey = (condition: any) => condition?.code || '';

function existingPhysicalProps(existing: Set<string>) {
  const result = new Set(existing);
  const expand: Record<string, string[]> = {
    padding:['paddingTop','paddingRight','paddingBottom','paddingLeft'],
    paddingHorizontal:['paddingLeft','paddingRight'], paddingVertical:['paddingTop','paddingBottom'],
    margin:['marginTop','marginRight','marginBottom','marginLeft'],
    marginHorizontal:['marginLeft','marginRight'], marginVertical:['marginTop','marginBottom'],
    gap:['rowGap','columnGap'],
  };
  for (const name of existing) (expand[name] || []).forEach((prop) => result.add(prop));
  return result;
}

function groupByConditionAndResolve(declarations: any[]) {
  const groups = new Map<string, any[]>();
  for (const declaration of declarations) {
    const key = conditionKey(declaration.condition);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(declaration);
  }
  return compactSpacing([...groups.values()].flatMap((group) => resolveLastWins(combineTransforms(group))));
}

function combineTransforms(declarations: any[]) {
  const transforms = declarations.filter((item) => item.prop === 'transform');
  if (transforms.length < 2) return declarations;
  const latestNone = [...transforms].reverse().find((item) => item.value === 'none');
  const active = latestNone ? transforms.filter((item) => item.order > latestNone.order) : transforms;
  if (!active.length) return declarations.filter((item) => item.prop !== 'transform').concat(latestNone);
  const functions = new Map<string, any>();
  for (const item of active) {
    const name = typeof item.value === 'string' ? item.value.match(/^([A-Za-z0-9]+)/)?.[1] : null;
    if (name) functions.set(name, item);
  }
  const order = ['translateX','translateY','translateZ','rotate','rotateX','rotateY','skewX','skewY','scale','scaleX','scaleY'];
  const values = order.filter((name) => functions.has(name)).map((name) => functions.get(name).value);
  const template = active[active.length - 1];
  const combined = { ...template, value: values.join(' '), order: Math.max(...active.map((item) => item.order)) };
  return declarations.filter((item) => item.prop !== 'transform').concat(combined).sort((a, b) => a.order - b.order);
}

function byProp(declarations: any[]) {
  const result = new Map<string, any[]>();
  for (const declaration of declarations) {
    if (!result.has(declaration.prop)) result.set(declaration.prop, []);
    result.get(declaration.prop).push(declaration);
  }
  return result;
}

function cloneDecls(item: any, order: number) {
  return (item.parsed.decls || []).map((declaration: any) => ({
    ...declaration,
    cssProps: [...declaration.cssProps],
    token: item.raw,
    condition: item.condition,
    order,
  }));
}

function semanticDarkPairs(items: any[], report: any, node: any, darkStrategy: string) {
  const darkItems = items.filter((item) => item.placement.kind === 'dark');
  for (const dark of darkItems) {
    if (dark.parsed.decls?.length !== 1) {
      dark.forceResidual = 'dark-pair-unrecognized';
      continue;
    }
    const darkDecl = dark.parsed.decls[0];
    const light = [...items].reverse().find((candidate) =>
      candidate !== dark && candidate.placement.kind === 'base' && !candidate.forceResidual &&
      conditionKey(candidate.condition) === conditionKey(dark.condition) &&
      candidate.parsed.decls?.length === 1 && candidate.parsed.decls[0].prop === darkDecl.prop
    );
    if (darkStrategy === 'residual') {
      dark.forceResidual = 'dark-pair-unrecognized';
      if (light) light.forceResidual = 'dark-pair-unrecognized';
      continue;
    }
    const key = light ? pairKey(darkDecl.prop, light.parsed.decls[0].value, darkDecl.value) : '';
    if (light && darkPairs[key]) {
      light.parsed = { ...light.parsed, decls: [{ ...light.parsed.decls[0], value: darkPairs[key] }] };
      dark.consumedByPair = true;
    } else {
      dark.forceResidual = 'dark-pair-unrecognized';
      if (light) light.forceResidual = 'dark-pair-unrecognized';
    }
  }
}

function candidateForPath(path: any, root: any, j: any, options: any, report: any, forwarders: Map<string, any>) {
  const element = path.node;
  let tag = getJSXTag(element);
  let localForwarder: any = null;
  if (!tag) {
    const name = element.openingElement?.name?.type === 'JSXIdentifier' ? element.openingElement.name.name : null;
    localForwarder = name ? forwarders.get(name) : null;
    if (localForwarder) tag = name;
  }
  if (!tag) {
    const classAttribute = element.openingElement?.attributes?.find((item: any) => attributeName(item) === 'className');
    if (classAttribute) skip(report, classAttribute, 'third-party-component', []);
    return null;
  }
  const target = localForwarder ? { component: tag, local: true, forwarder: localForwarder } : targetForTag(tag, !falseOption(options.allTags));
  if (!target) return null;

  const attributes = element.openingElement.attributes || [];
  const classAttributes = attributes.filter((item: any) => attributeName(item) === 'className');
  if (classAttributes.length !== 1) return null;
  const classAttribute = classAttributes[0];
  if (attributes.some((item: any) => item.type === 'JSXSpreadAttribute')) {
    skip(report, classAttribute, 'spread-classname-unknown', []);
    return null;
  }
  const existing = new Set(attributes.map(attributeName).filter(Boolean));
  const existingCss = existingPhysicalProps(existing);
  if (['style','as','css','on'].some((name) => existing.has(name))) {
    skip(report, classAttribute, 'jsx-prop-conflict', []);
    return null;
  }

  const analysis = analyzeClassAttribute(classAttribute, root, j);
  if (!analysis.analyzable || !analysis.tokens.length) {
    skip(report, classAttribute, 'unsafe-expression', []);
    return null;
  }
  const context = { group: proveParentMarker(path, 'group'), peer: provePreviousPeer(path), variants: provenAttributeVariants(element) };
  const items = analysis.tokens.map((token: any, index: number) => {
    const parsed = parseClass(token.raw);
    return { ...token, parsed, raw: token.raw, index, placement: place(parsed, context) };
  });

  semanticDarkPairs(items, report, classAttribute, options.darkStrategy || 'tokens');
  const residual: any[] = [];
  const base: any[] = [];
  const states = new Map<string, any[]>();
  const media = new Map<string, any[]>();
  let converted = 0;
  let needsAnimation = false;

  const addResidual = (item: any, reason?: string, count = true) => {
    residual.push({ raw: item.raw, condition: item.condition });
    if (reason && reason !== 'marker') skip(report, classAttribute, reason, [item.raw]);
    else if (count) report.residual++;
  };

  for (const item of items) {
    if (item.raw === 'group' || item.raw === 'peer') { addResidual(item, 'marker', false); continue; }
    if (item.consumedByPair) { converted++; continue; }
    if (item.forceResidual) { addResidual(item, item.forceResidual); continue; }
    if (!item.parsed.decls) { unknown(report, classAttribute, item.raw); residual.push({ raw: item.raw, condition: item.condition }); continue; }
    if (item.parsed.approximation) report.approximations.push({ token: item.raw, reason: item.parsed.approximation });
    if (item.placement.kind === 'residual' || item.placement.kind === 'dark') {
      addResidual(item, item.placement.reason || 'dark-pair-unrecognized');
      continue;
    }
    const declarations = cloneDecls(item, item.index);
    const conflicts = declarations.filter((declaration: any) => existingCss.has(declaration.prop) || declaration.cssProps.some((prop: string) => existingCss.has(prop)));
    if (conflicts.length || (item.placement.kind === 'state' && existing.has(item.placement.prop)) || (item.placement.kind === 'responsive' && existing.has('media'))) {
      addResidual(item, 'jsx-prop-conflict');
      conflicts.forEach((declaration: any) => report.conflicts.push({ token: item.raw, prop: declaration.prop, reason: 'existing JSX prop' }));
      continue;
    }
    if (declarations.some((declaration: any) => declaration.value?.kind === 'expression')) needsAnimation = true;
    if (item.placement.kind === 'base') base.push(...declarations);
    else if (item.placement.kind === 'state') {
      if (!states.has(item.placement.prop)) states.set(item.placement.prop, []);
      states.get(item.placement.prop).push(...declarations);
    } else if (item.placement.kind === 'responsive') {
      const responsive = responsiveKeys(item.placement.bp, options.breakpointStrategy || 'range');
      if (responsive.approximation) report.approximations.push({ token: item.raw, reason: responsive.approximation });
      const rank: any = { sm:1, md:2, lg:3, xl:4, '2xl':5 };
      for (const key of responsive.keys) {
        if (!media.has(key)) media.set(key, []);
        media.get(key).push(...declarations.map((declaration: any) => ({ ...declaration, order: rank[item.placement.bp] * 100000 + item.index })));
      }
    }
    converted++;
  }

  if (trueOption(options.strict) && residual.length) {
    report.skipped.push({ loc: classAttribute.loc?.start || null, reason: 'strict-element-skip', tokens: residual.map((item) => item.raw) });
    return null;
  }
  if (!converted) return null;
  return { path, element, tag, target, classAttribute, existing, analysis, residual, base, states, media, converted, needsAnimation };
}

function falseOption(value: any) {
  return value === false || value === 'false';
}

function applyCandidate(candidate: any, j: any, options: any) {
  const { element, target } = candidate;
  element.openingElement.name = j.jsxIdentifier(target.component);
  if (element.closingElement) element.closingElement.name = j.jsxIdentifier(target.component);

  const generated: any[] = [];
  if (target.as) generated.push(j.jsxAttribute(j.jsxIdentifier('as'), j.stringLiteral(target.as)));
  const resolvedBase = groupByConditionAndResolve(candidate.base);
  for (const [prop, declarations] of byProp(resolvedBase)) generated.push(scalarAttribute(j, prop, declarations));
  for (const [state, declarations] of candidate.states) generated.push(objectAttribute(j, state, groupByConditionAndResolve(declarations)));
  if (candidate.media.size) {
    const resolvedMedia = new Map<string, any[]>();
    for (const [key, declarations] of candidate.media) resolvedMedia.set(key, groupByConditionAndResolve(declarations));
    generated.push(mediaAttribute(j, resolvedMedia));
  }

  const preserve = trueOption(options.preserveClassNames);
  const residual = preserve ? candidate.classAttribute : residualClassAttribute(j, candidate.residual);
  const attributes: any[] = [];
  for (const attribute of element.openingElement.attributes) {
    if (attribute !== candidate.classAttribute) { attributes.push(attribute); continue; }
    if (residual) attributes.push(residual);
    attributes.push(...generated);
  }
  element.openingElement.attributes = attributes;
}

export default function transform(file: any, api: any, rawOptions: any = {}) {
  const j = api.jscodeshift;
  const root = j(file.source);
  const options = {
    ...rawOptions,
    breakpointStrategy: rawOptions.breakpointStrategy || rawOptions['breakpoint-strategy'] || 'range',
    darkStrategy: rawOptions.darkStrategy || rawOptions['dark-strategy'] || 'tokens',
    reportPath: rawOptions.reportPath || rawOptions['report-path'],
  };
  const report = createFileReport(file.path || '<unknown>');
  const importInfo = inspectAppStudioImport(root, j);
  if (!importInfo.valid) {
    skip(report, root.find(j.Program).nodes()[0], 'import-conflict', []);
    publishReport(report, options);
    return file.source;
  }
  const bindings = collectBindings(root, j);
  const forwarders = findLocalForwarders(root, j);
  const candidates: any[] = [];
  root.find(j.JSXElement).forEach((path: any) => {
    const candidate = candidateForPath(path, root, j, options, report, forwarders);
    if (candidate) candidates.push(candidate);
  });

  const requested = new Set<string>();
  const successful: any[] = [];
  for (const candidate of candidates) {
    const names = [candidate.target.local ? candidate.target.forwarder.target.component : candidate.target.component, ...(candidate.needsAnimation ? ['Animation'] : [])];
    const conflict = names.find((name) => bindings.has(name) && !importInfo.names.has(name));
    if (conflict) {
      skip(report, candidate.classAttribute, 'import-conflict', candidate.analysis.tokens.map((token: any) => token.raw));
      continue;
    }
    names.forEach((name) => requested.add(name));
    successful.push(candidate);
  }
  if (!successful.length) {
    publishReport(report, options);
    return file.source;
  }

  successful.forEach((candidate) => {
    applyCandidate(candidate, j, options);
    report.converted += candidate.converted;
  });
  const convertedForwarders = new Set<any>();
  successful.filter((candidate) => candidate.target.local).forEach((candidate) => {
    const forwarder = candidate.target.forwarder;
    if (convertedForwarders.has(forwarder)) return;
    convertedForwarders.add(forwarder);
    forwarder.element.openingElement.name = j.jsxIdentifier(forwarder.target.component);
    if (forwarder.element.closingElement) forwarder.element.closingElement.name = j.jsxIdentifier(forwarder.target.component);
    if (forwarder.target.as) forwarder.element.openingElement.attributes.unshift(j.jsxAttribute(j.jsxIdentifier('as'), j.stringLiteral(forwarder.target.as)));
  });
  addOrMergeImport(root, j, importInfo, requested);

  if (!trueOption(options.preserveClassNames)) {
    const consumedBindings = new Set<string>();
    const helpers = new Set<string>();
    successful.forEach((candidate) => {
      candidate.analysis.bindings.forEach((name: string) => consumedBindings.add(name));
      candidate.analysis.helpers.forEach((name: string) => helpers.add(name));
    });
    cleanupConsumed(root, j, consumedBindings, helpers);
  }
  publishReport(report, options);
  return root.toSource();
}
