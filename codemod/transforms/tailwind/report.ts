// @ts-nocheck
import fs from 'fs';
import path from 'path';
import type { FileReport, TransformOptions } from './types';

export function createFileReport(file: string): FileReport {
  return { file, converted: 0, residual: 0, skipped: [], unknownClasses: {}, approximations: [], conflicts: [] };
}

export function location(node: any) {
  const start = node?.loc?.start;
  return start ? { line: start.line, column: start.column } : null;
}

export function skip(report: FileReport, node: any, reason: string, tokens: string[]) {
  report.skipped.push({ loc: location(node), reason, tokens });
  report.residual += tokens.length;
}

export function unknown(report: FileReport, node: any, token: string) {
  report.unknownClasses[token] = (report.unknownClasses[token] || 0) + 1;
  skip(report, node, 'unknown-class', [token]);
}

export function publishReport(report: FileReport, options: TransformOptions) {
  const collector: any = options.reportCollector;
  if (typeof collector === 'function') collector(report);
  else if (collector?.push) collector.push(report);
  if (options.report === false || options.report === 'false' || !options.reportPath) return;
  const output = path.resolve(String(options.reportPath));
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.appendFileSync(output, `${JSON.stringify(report)}\n`, 'utf8');
}
