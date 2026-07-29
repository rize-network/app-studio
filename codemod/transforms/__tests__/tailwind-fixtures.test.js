const fs = require('fs');
const path = require('path');
const jscodeshift = require('jscodeshift');
const transform = require('../tailwind-to-app-studio').default;

const j = jscodeshift.withParser('tsx');
const fixturesRoot = path.join(__dirname, 'fixtures');
const domains = ['spacing', 'states'];

const fixtures = domains.flatMap((domain) =>
  fs.readdirSync(path.join(fixturesRoot, domain))
    .filter((name) => name.endsWith('.input.tsx'))
    .map((name) => ({ domain, name: name.slice(0, -'.input.tsx'.length) }))
);

describe.each(fixtures)('fixture $domain/$name', ({ domain, name }) => {
  const inputPath = path.join(fixturesRoot, domain, `${name}.input.tsx`);
  const outputPath = path.join(fixturesRoot, domain, `${name}.output.tsx`);
  const input = fs.readFileSync(inputPath, 'utf8');
  const expected = fs.readFileSync(outputPath, 'utf8');

  it('matches the exact output', () => {
    expect(transform({ path: inputPath, source: input }, { jscodeshift: j }, { report: false })).toEqual(expected);
  });

  it('is a structural fixed point', () => {
    expect(transform({ path: outputPath, source: expected }, { jscodeshift: j }, { report: false })).toEqual(expected);
  });
});
