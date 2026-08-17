const jscodeshift = require('jscodeshift');
const transform = require('../tailwind-to-app-studio').default;

const j = jscodeshift.withParser('tsx');

function apply(source, options = {}) {
  return transform({ path: 'fixture.tsx', source }, { jscodeshift: j }, options);
}

describe('tailwind-to-app-studio', () => {
  it('converts an exact static className on div and span', () => {
    const output = apply('<div className="flex items-center"><span className="overflow-hidden whitespace-nowrap">ok</span></div>');

    expect(output).toContain('<View display="flex" alignItems="center"');
    expect(output).toContain('<Span');
    expect(output).toContain('overflow="hidden"');
    expect(output).not.toContain('className=');
    expect(output).toContain('import { View, Span } from "app-studio";');
  });

  it('converts nested and self-closing elements safely', () => {
    const output = apply('<div className="relative"><span className="block" /></div>');

    expect(output).toContain('<View position="relative">');
    expect(output).toContain('<Span display="block" />');
    expect(output).toContain('</View>');
  });

  it('merges an existing direct named import without duplicates', () => {
    const output = apply('import { Text, View } from "app-studio";\n<div className="flex" />');

    expect(output).toContain('import { Text, View } from "app-studio";');
    expect(output).not.toContain('View, View');
    expect(output).toContain('<View display="flex" />');
  });

  it.each([
    ['dynamic className', '<div className={classes} />'],
    ['substituted template', '<div className={`flex ${extra}`} />'],
    ['spread', '<div className="flex" {...props} />'],
    ['prop conflict', '<div display="grid" className="flex" />'],
    ['binding conflict', 'const View = Thing;\n<div className="flex" />'],
  ])('safely skips %s', (_name, source) => {
    expect(apply(source)).toBe(source);
  });

  it('converts supported tokens and preserves unknown tokens by default', () => {
    const output = apply('<div className="flex vendor-widget mystery-x" />');

    expect(output).toContain('<View className="vendor-widget mystery-x" display="flex" />');
  });

  it('keeps all-or-nothing behavior in strict mode', () => {
    const source = '<div className="flex vendor-widget" />';

    expect(apply(source, { strict: true })).toBe(source);
  });

  it('maps spacing, sizing, typography, colors, borders, and effects', () => {
    const output = apply('<div className="p-4 -mt-2 w-1/2 text-sm font-bold bg-gray-950 rounded-lg shadow-md opacity-50" />');

    expect(output).toContain('padding={16}');
    expect(output).toContain('marginTop={-8}');
    expect(output).toContain('width="50%"');
    expect(output).toContain('fontSize={14}');
    expect(output).toContain('fontWeight={700}');
    expect(output).toContain('backgroundColor="color-coolGray-900"');
    expect(output).toContain('borderRadius={8}');
    expect(output).toContain('boxShadow=');
    expect(output).toContain('opacity={0.5}');
  });

  it('emits states and bounded responsive ranges', () => {
    const output = apply('<div className="hover:bg-red-500 focus:opacity-50 md:flex" />');

    expect(output).toContain('_hover={{');
    expect(output).toContain('backgroundColor: "color-red-500"');
    expect(output).toContain('_focus={{');
    expect(output).toContain('media={{');
    expect(output).toContain('lg: {');
    expect(output).toContain('xl: {');
  });

  it('keeps an inexpressible responsive-state combination and reports it', () => {
    const reports = [];
    const output = apply('<div className="flex md:hover:bg-red-500" />', { reportCollector: reports });

    expect(output).toContain('className="md:hover:bg-red-500"');
    expect(reports[0].skipped.some((item) => item.reason === 'combined-responsive-state')).toBe(true);
  });

  it('converts cn/clsx conditions and complementary ternaries', () => {
    const output = apply('import clsx from "clsx";\n<div className={clsx("flex", active ? "p-4 bg-blue-500" : "p-2 bg-red-500")} />');

    expect(output).not.toContain('clsx');
    expect(output).toContain('padding={active ? 16 : 8}');
    expect(output).toContain('backgroundColor={active ? "color-blue-500" : "color-red-500"}');
  });

  it('resolves local class constants and record lookups', () => {
    const output = apply('const base = "flex gap-2";\nconst variants: Record<string, string> = { compact: "p-2", roomy: "p-4" };\n<div className={[base, variants[variant]]} />');

    expect(output).not.toContain('const base');
    expect(output).not.toContain('const variants');
    expect(output).toContain('display="flex"');
    expect(output).toContain('gap={8}');
    expect(output).toContain('variant === "compact" ? 8');
  });

  it('converts known dark pairs to semantic theme tokens', () => {
    const output = apply('<div className="bg-white dark:bg-gray-900 text-black dark:text-white" />');

    expect(output).toContain('backgroundColor="theme-surface"');
    expect(output).toContain('color="theme-text"');
    expect(output).not.toContain('dark:');
  });

  it('requires static group and peer markers', () => {
    const proven = apply('<div className="group"><span className="group-hover:text-red-500" /></div>');
    const unproven = apply('<span className="flex group-hover:text-red-500" />');

    expect(proven).toContain('className="group"');
    expect(proven).toContain('_groupHover={{');
    expect(unproven).toContain('className="group-hover:text-red-500"');
    expect(unproven).toContain('display="flex"');
  });

  it('converts attribute variants only when their selector is statically proven', () => {
    const proven = apply('<div aria-checked="true" data-state="open" className="aria-checked:bg-green-500 data-[state=open]:p-4" />');
    const unproven = apply('<div aria-checked={checked} className="flex aria-checked:bg-green-500" />');

    expect(proven).toContain('backgroundColor="color-green-500"');
    expect(proven).toContain('padding={16}');
    expect(unproven).toContain('className="aria-checked:bg-green-500"');
  });

  it('converts props on a same-file component that forwards its props', () => {
    const output = apply('const Card = props => <section {...props} />;\n<Card className="flex p-4" />');

    expect(output).toContain('const Card = props => <View as="section" {...props} />;');
    expect(output).toContain('<Card display="flex" padding={16} />');
  });

  it('maps semantic DOM tags through View as', () => {
    const output = apply('<nav className="flex"><p className="text-center">Hello</p></nav>');

    expect(output).toContain('<View as="nav" display="flex">');
    expect(output).toContain('<View as="p" textAlign="center">');
  });

  it('emits Animation expressions and imports the namespace export', () => {
    const output = apply('<div className="animate-fade-in" />');

    expect(output).toContain('import { View, Animation } from "app-studio";');
    expect(output).toContain('animate={Animation.fadeIn()}');
  });

  it('composes independent Tailwind transform functions', () => {
    const output = apply('<div className="translate-x-1/2 -rotate-6 scale-110" />');

    expect(output).toContain('transform="translateX(50%) rotate(-6deg) scale(1.1)"');
  });

  it('skips a complex or aliased app-studio import', () => {
    const aliased = 'import { View as StudioView } from "app-studio";\n<div className="flex" />';
    const namespace = 'import * as Studio from "app-studio";\n<div className="flex" />';

    expect(apply(aliased)).toBe(aliased);
    expect(apply(namespace)).toBe(namespace);
  });

  it('preserves class names when requested', () => {
    const output = apply('<div className="flex" />', { preserveClassNames: true });

    expect(output).toContain('<View className="flex" display="flex" />');
  });

  it('preserves native event handlers on converted elements', () => {
    const output = apply('<div className="flex" onClick={handleClick} />');

    expect(output).toContain('<View display="flex" onClick={handleClick} />');
  });

  it.each(['style', 'as', 'css', 'on'])(
    'skips elements with the reserved %s prop',
    (prop) => {
      const source = `<div className="flex" ${prop}={value} />`;

      expect(apply(source)).toBe(source);
    }
  );

  it('is idempotent', () => {
    const first = apply('<section className="flex min-w-0 overflow-hidden vendor-hook" />');

    expect(apply(first)).toBe(first);
  });
});
