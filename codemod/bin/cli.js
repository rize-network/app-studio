/**
 * Copyright 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
// Based on https://github.com/reactjs/react-codemod/blob/dd8671c9a470a2c342b221ec903c574cf31e9f57/bin/cli.js
// @next/codemod optional-name-of-transform optional/path/to/src [...options]

const globby = require('globby');
const inquirer = require('inquirer');
const meow = require('meow');
const path = require('path');
const execa = require('execa');
const chalk = require('chalk');
const isGitClean = require('is-git-clean');
const fs = require('fs');

const transformerDirectory = path.join(__dirname, '../', 'transforms');
const jscodeshiftExecutable = require.resolve('.bin/jscodeshift');

function checkGitStatus(force) {
  let clean = false;
  let errorMessage = 'Unable to determine if git directory is clean';
  try {
    clean = isGitClean.sync(process.cwd());
    errorMessage = 'Git directory is not clean';
  } catch (err) {
    if (err && err.stderr && err.stderr.indexOf('Not a git repository') >= 0) {
      clean = true;
    }
  }

  if (!clean) {
    if (force) {
      console.log(`WARNING: ${errorMessage}. Forcibly continuing.`);
    } else {
      console.log('Thank you for using app-studio/codemod!');
      console.log(
        chalk.yellow(
          '\nBut before we continue, please stash or commit your git changes.'
        )
      );
      console.log(
        '\nYou may use the --force flag to override this safety check.'
      );
      process.exit(1);
    }
  }
}

function runTransform({ files, flags, transformer }) {
  const transformerPath = path.join(transformerDirectory, `${transformer}.js`);

  let args = [];

  const { dry, print } = flags;

  if (dry) {
    args.push('--dry');
  }
  if (print) {
    args.push('--print');
  }
  if (flags.preserveClassNames) {
    args.push('--preserveClassNames');
  }
  if (transformer === 'tailwind-to-app-studio') {
    if (flags.strict) args.push('--strict');
    if (flags.allTags === false || flags.noAllTags) args.push('--allTags=false');
    if (flags.breakpointStrategy) args.push(`--breakpointStrategy=${flags.breakpointStrategy}`);
    if (flags.darkStrategy) args.push(`--darkStrategy=${flags.darkStrategy}`);
    if (flags.report === false || flags.noReport) {
      args.push('--report=false');
    } else {
      const reportPath = path.resolve(flags.reportPath || './tailwind-codemod-report.json');
      fs.writeFileSync(reportPath, '', 'utf8');
      args.push(`--reportPath=${reportPath}`);
    }
  }

  args.push('--verbose=0');

  args.push('--ignore-pattern=**/node_modules/**');
  args.push('--ignore-pattern=**/.next/**');
  args.push('--ignore-pattern=**/.cache/**');

  args.push('--extensions=tsx,ts,jsx,js,mdx');
  args.push('--parser=tsx');

  args = args.concat(['--transform', transformerPath]);

  if (flags.jscodeshift) {
    args = args.concat(flags.jscodeshift);
  }

  args = args.concat(files);

  console.log(`Executing command: jscodeshift ${args.join(' ')}`);

  const result = execa.sync(jscodeshiftExecutable, args, {
    stdio: 'inherit',
    stripEof: false,
  });

  if (result.error) {
    throw result.error;
  }

  if (
    transformer === 'tailwind-to-app-studio' &&
    flags.report !== false &&
    !flags.noReport
  ) {
    const reportPath = path.resolve(flags.reportPath || './tailwind-codemod-report.json');
    const lines = fs.existsSync(reportPath)
      ? fs.readFileSync(reportPath, 'utf8').split(/\r?\n/).filter(Boolean)
      : [];
    const reports = lines.map((line) => JSON.parse(line));
    const unknown = {};
    const reasons = {};
    const totals = reports.reduce(
      (summary, report) => {
        summary.converted += report.converted || 0;
        summary.residual += report.residual || 0;
        summary.skipped += (report.skipped || []).length;
        Object.entries(report.unknownClasses || {}).forEach(([name, count]) => {
          unknown[name] = (unknown[name] || 0) + count;
        });
        (report.skipped || []).forEach((item) => {
          reasons[item.reason] = (reasons[item.reason] || 0) + 1;
        });
        return summary;
      },
      { files: reports.length, converted: 0, residual: 0, skipped: 0 }
    );
    const aggregate = {
      generatedAt: new Date().toISOString(),
      totals,
      topUnknownClasses: Object.entries(unknown)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([name, count]) => ({ name, count })),
      skipReasons: reasons,
      files: reports,
    };
    fs.writeFileSync(reportPath, `${JSON.stringify(aggregate, null, 2)}\n`, 'utf8');
    console.log(
      `Tailwind summary: ${totals.files} files, ${totals.converted} tokens converted, ` +
        `${totals.residual} residual, ${totals.skipped} skips.`
    );
    console.log(`Report written to ${reportPath}`);
  }
}

const TRANSFORMER_INQUIRER_CHOICES = [
  {
    name: 'to-app-studio: Transforms styled-components to App Studio View components.',
    value: 'to-app-studio', // This should correspond to a file named "to-app-studio.js" in your "transforms" directory
  },
  {
    name: 'tailwind-to-app-studio: Converts Tailwind classes to App Studio props with safe residuals.',
    value: 'tailwind-to-app-studio',
  },
];

function expandFilePathsIfNeeded(filesBeforeExpansion) {
  const shouldExpandFiles = filesBeforeExpansion.some((file) =>
    file.includes('*')
  );
  return shouldExpandFiles
    ? globby.sync(filesBeforeExpansion)
    : filesBeforeExpansion;
}

function run() {
  const cli = meow(
    {
      description: 'Codemods for updating App Studio apps.',
      help: `
    Usage
      $ npx app-studio/codemod <transform> <path> <...options>
        transform    Name of the transform
        path         Files or directory to transform. Can be a glob like pages/**.js
    Options
      --force            Bypass Git safety checks and forcibly run codemods
      --dry              Dry run (no changes are made to files)
      --print            Print transformed files to your terminal
      --preserveClassNames  Keep converted className attributes for contract selectors (tailwind-to-app-studio only)
      --strict           Skip an entire element when any class cannot be converted
      --breakpoint-strategy=range|devices  Responsive mapping strategy (default: range)
      --dark-strategy=tokens|residual      Dark-mode strategy (default: tokens)
      --report-path=<file>  Report destination (default: ./tailwind-codemod-report.json)
      --no-report        Disable the Tailwind migration report
      --no-all-tags      Restrict native tag conversion to div/span/img/button/input/form
      --jscodeshift  (Advanced) Pass options directly to jscodeshift
    `,
    },
    {
      boolean: ['force', 'dry', 'print', 'help', 'preserveClassNames', 'strict', 'report', 'allTags'],
      string: ['_', 'breakpointStrategy', 'darkStrategy', 'reportPath'],
      default: { report: true, allTags: true },
      alias: {
        h: 'help',
      },
    }
  );

  if (!cli.flags.dry) {
    checkGitStatus(cli.flags.force);
  }

  if (
    cli.input[0] &&
    !TRANSFORMER_INQUIRER_CHOICES.find((x) => x.value === cli.input[0])
  ) {
    console.error('Invalid transform choice, pick one of:');
    console.error(
      TRANSFORMER_INQUIRER_CHOICES.map((x) => '- ' + x.value).join('\n')
    );
    process.exit(1);
  }

  inquirer
    .prompt([
      {
        type: 'input',
        name: 'files',
        message: 'On which files or directory should the codemods be applied?',
        when: !cli.input[1],
        default: '.',
        // validate: () =>
        filter: (files) => files.trim(),
      },
      {
        type: 'list',
        name: 'transformer',
        message: 'Which transform would you like to apply?',
        when: !cli.input[0],
        pageSize: TRANSFORMER_INQUIRER_CHOICES.length,
        choices: TRANSFORMER_INQUIRER_CHOICES,
      },
    ])
    .then((answers) => {
      const { files, transformer } = answers;

      const filesBeforeExpansion = cli.input[1] || files;
      const filesExpanded = expandFilePathsIfNeeded([filesBeforeExpansion]);

      const selectedTransformer = cli.input[0] || transformer;

      if (!filesExpanded.length) {
        console.log(
          `No files found matching ${filesBeforeExpansion}`
        );
        return null;
      }

      return runTransform({
        files: filesExpanded,
        flags: cli.flags,
        transformer: selectedTransformer,
      });
    });
}

module.exports = {
  run: run,
  runTransform: runTransform,
  checkGitStatus: checkGitStatus,
  jscodeshiftExecutable: jscodeshiftExecutable,
  transformerDirectory: transformerDirectory,
};
