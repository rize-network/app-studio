const fs = require('fs');
const path = require('path');
const jscodeshift = require('jscodeshift');
const transform = require('../tailwind-to-app-studio').default;

const j = jscodeshift.withParser('tsx');

describe('Tailwind corpus guard', () => {
  it('does not crash and converts at least 95% of the representative corpus', () => {
    const fixture = path.join(__dirname, 'fixtures/corpus/rich.input.tsx');
    const source = fs.readFileSync(fixture, 'utf8');
    const reports = [];
    const output = transform(
      { path: fixture, source },
      { jscodeshift: j },
      { reportCollector: reports, report: false }
    );
    const report = reports[0];
    const rate = report.converted / (report.converted + report.residual);

    expect(output).toContain('from "app-studio"');
    expect(rate).toBeGreaterThanOrEqual(0.95);
    expect(report.skipped.map((item) => item.reason)).toEqual([
      'combined-responsive-state',
      'unknown-class',
    ]);
  });
});
