import { defineConfig } from 'tsup';

const external = ['react', 'react-dom', 'react-native'];

export default defineConfig([
  {
    entry: {
      'web/index': 'src/web/index.tsx',
      'native/index': 'src/native/index.tsx',
    },
    outDir: 'dist',
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    splitting: false,
    clean: true,
    target: 'es2020',
    external,
    outExtension({ format }) {
      return {
        js: format === 'cjs' ? '.cjs' : '.js',
      };
    },
  },
  {
    entry: {
      'web/app-studio.umd.production.min': 'src/web/index.tsx',
    },
    outDir: 'dist',
    format: ['iife'],
    globalName: 'AppStudio',
    minify: true,
    sourcemap: true,
    splitting: false,
    clean: false,
    target: 'es2020',
    platform: 'browser',
  },
]);
