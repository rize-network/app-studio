import path from 'path';

describe('package exports', () => {
  const pkg = require('../../package.json');

  it('uses the web build as the default package entry', () => {
    expect(pkg.main).toBe('dist/web/index.cjs');
    expect(pkg.module).toBe('dist/web/index.js');
    expect(pkg.typings).toBe('dist/web/index.d.ts');
  });

  it('declares conditional React Native and web root exports', () => {
    expect(pkg.exports['.']['react-native']).toEqual(
      expect.objectContaining({
        types: './dist/native/index.d.ts',
        import: './dist/native/index.js',
        require: './dist/native/index.cjs',
      })
    );
    expect(pkg.exports['.'].browser).toEqual(
      expect.objectContaining({
        types: './dist/web/index.d.ts',
        import: './dist/web/index.js',
        require: './dist/web/index.cjs',
      })
    );
  });

  it('declares explicit web and native subpaths', () => {
    expect(pkg.exports['./web'].import).toBe('./dist/web/index.js');
    expect(pkg.exports['./native'].import).toBe('./dist/native/index.js');
  });

  it('build output paths match the declared package contract', () => {
    const root = path.resolve(__dirname, '../..');
    const webImport = path.resolve(root, pkg.exports['./web'].import);
    const nativeImport = path.resolve(root, pkg.exports['./native'].import);

    expect(webImport.endsWith('/dist/web/index.js')).toBe(true);
    expect(nativeImport.endsWith('/dist/native/index.js')).toBe(true);
  });
});
