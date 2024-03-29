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
}

const TRANSFORMER_INQUIRER_CHOICES = [
  {
    name: 'to-app-studio: Transforms styled-components to App Studio View components.',
    value: 'to-app-studio', // This should correspond to a file named "to-app-studio.js" in your "transforms" directory
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
      description: 'Codemods for updating Reflexjs apps.',
      help: `
    Usage
      $ npx app-studio/codemod <transform> <path> <...options>
        transform    Name of the transform
        path         Files or directory to transform. Can be a glob like pages/**.js
    Options
      --force            Bypass Git safety checks and forcibly run codemods
      --dry              Dry run (no changes are made to files)
      --print            Print transformed files to your terminal
      --jscodeshift  (Advanced) Pass options directly to jscodeshift
    `,
    },
    {
      boolean: ['force', 'dry', 'print', 'help'],
      string: ['_'],
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
          `No files found matching ${filesBeforeExpansion.join(' ')}`
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
