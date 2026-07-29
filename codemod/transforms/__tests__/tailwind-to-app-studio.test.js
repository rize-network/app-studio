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
    ['unknown token', '<div className="flex shadow-lg" />'],
    ['responsive token', '<div className="md:flex" />'],
    ['spread', '<div className="flex" {...props} />'],
    ['prop conflict', '<div display="grid" className="flex" />'],
    ['binding conflict', 'const View = Thing;\n<div className="flex" />'],
  ])('skips %s without partial conversion', (_name, source) => {
    expect(apply(source)).toBe(source);
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

  it.each(['style', 'as', 'css', 'media', 'on'])(
    'skips elements with the reserved %s prop',
    (prop) => {
      const source = `<div className="flex" ${prop}={value} />`;

      expect(apply(source)).toBe(source);
    }
  );

  it('is idempotent', () => {
    const first = apply('<div className="flex min-w-0 overflow-hidden" />');

    expect(apply(first)).toBe(first);
  });
});
