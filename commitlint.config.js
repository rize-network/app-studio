module.exports = {
  //https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional
  extends: ['@commitlint/config-conventional'],
  /**
   * Functions that return true if commitlint should ignore the given message.
   *
   * @param {string} commit - The commit message
   * @return {boolean} `true` if commitlint should ignore message
   */
  rules: {
    'header-max-length': [0, 'always', 150],
    'subject-case': [0, 'always', 'sentence-case'],
  },
  ignores: [
    (commit) =>
      commit.indexOf('Update') === 0 ||
      commit.indexOf('Remove') === 0 ||
      commit.indexOf('Merge') === 0,
  ],
};
