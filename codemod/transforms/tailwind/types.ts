// @ts-nocheck

export type Primitive = string | number | boolean | null;

export type ExpressionValue = {
  kind: 'expression';
  /** JavaScript source parsed by the transform before emission. */
  code: string;
};

export type DeclValue = Primitive | ExpressionValue;

export type Decl = {
  prop: string;
  value: DeclValue;
  /** Physical CSS properties affected by the utility (used for last-wins). */
  cssProps: string[];
};

export type Modifier =
  | { kind: 'responsive'; bp: string }
  | { kind: 'state'; name: string }
  | { kind: 'group' | 'peer'; name: string }
  | { kind: 'dark' }
  | { kind: 'aria' | 'data'; raw: string }
  | { kind: 'arbitrary-variant'; raw: string };

export type ParsedClass = {
  raw: string;
  base: string;
  negative: boolean;
  important: boolean;
  modifiers: Modifier[];
  decls: Decl[] | null;
  approximation?: string;
};

export type Condition = {
  code: string;
  negated?: boolean;
};

export type ClassSource = {
  parsed: ParsedClass;
  condition: Condition | null;
  origin?: unknown;
};

export type ReportReason =
  | 'unknown-class'
  | 'unsupported-modifier'
  | 'combined-responsive-state'
  | 'dark-pair-unrecognized'
  | 'group-marker-unproven'
  | 'peer-marker-unproven'
  | 'unsafe-expression'
  | 'third-party-component'
  | 'jsx-prop-conflict'
  | 'conditional-conflict'
  | 'spread-classname-unknown'
  | 'import-conflict'
  | 'strict-element-skip';

export type Skip = {
  loc?: { line: number; column: number } | null;
  reason: ReportReason | string;
  tokens: string[];
};

export type FileReport = {
  file: string;
  converted: number;
  residual: number;
  skipped: Skip[];
  unknownClasses: Record<string, number>;
  approximations: Array<{ token: string; reason: string }>;
  conflicts: Array<{ token: string; prop?: string; reason: string }>;
};

export type TransformOptions = {
  strict?: boolean | string;
  preserveClassNames?: boolean | string;
  allTags?: boolean | string;
  breakpointStrategy?: 'range' | 'devices';
  darkStrategy?: 'tokens' | 'residual';
  reportPath?: string;
  report?: boolean | string;
  reportCollector?: ((report: FileReport) => void) | { push(report: FileReport): void };
};
