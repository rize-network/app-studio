#!/usr/bin/env node

/**
 * Migration Script: Dot Notation → Dash Notation
 *
 * This script converts color token dot notation to dash notation for performance.
 *
 * Conversions:
 *   theme.primary       → theme-primary
 *   theme.primary.100   → theme-primary-100
 *   color.blue.500      → color-blue-500
 *   color.blue.500.200  → color-blue-500-200
 *   light.blue.500      → light-blue-500
 *   dark.red.200        → dark-red-200
 *
 * Usage:
 *   node scripts/migrate-theme-tokens.js [--dry-run] [--path=src] [--exclude=file1,file2]
 *
 * Options:
 *   --dry-run          Show what would be changed without modifying files
 *   --path             Directory to search (default: current directory)
 *   --exclude          Comma-separated list of files/patterns to exclude
 *   --include-docs     Also process .md/.mdx files (default: skip docs)
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const includeDocs = args.includes('--include-docs');
const pathArg = args.find((a) => a.startsWith('--path='));
const excludeArg = args.find((a) => a.startsWith('--exclude='));
const searchPath = pathArg ? pathArg.split('=')[1] : '.';
const excludePatterns = excludeArg ? excludeArg.split('=')[1].split(',') : [];

// File extensions to process
const EXTENSIONS = includeDocs
  ? ['.js', '.jsx', '.ts', '.tsx', '.md', '.mdx']
  : ['.js', '.jsx', '.ts', '.tsx'];

// Directories to skip
const SKIP_DIRS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  'coverage',
];

// Patterns to match dot notation inside quotes (strings/props)
// Each pattern matches: "prefix.X" or "prefix.X.Y" or "prefix.X.Y.Z" etc.
const PATTERNS = [
  // theme.X or theme.X.Y (e.g., "theme.primary", "theme.primary.100")
  {
    pattern: /(["'`])theme\.([a-zA-Z][a-zA-Z0-9]*(?:\.[a-zA-Z0-9]+)*)\1/g,
    prefix: 'theme',
  },
  // color.X or color.X.Y (e.g., "color.blue", "color.blue.500", "color.blue.500.200")
  {
    pattern: /(["'`])color\.([a-zA-Z][a-zA-Z0-9]*(?:\.[a-zA-Z0-9]+)*)\1/g,
    prefix: 'color',
  },
  // light.X or light.X.Y (e.g., "light.white", "light.blue.500")
  {
    pattern: /(["'`])light\.([a-zA-Z][a-zA-Z0-9]*(?:\.[a-zA-Z0-9]+)*)\1/g,
    prefix: 'light',
  },
  // dark.X or dark.X.Y (e.g., "dark.white", "dark.red.200")
  {
    pattern: /(["'`])dark\.([a-zA-Z][a-zA-Z0-9]*(?:\.[a-zA-Z0-9]+)*)\1/g,
    prefix: 'dark',
  },
];

// Statistics
let filesScanned = 0;
let filesModified = 0;
let totalReplacements = 0;

/**
 * Convert prefix.X.Y to prefix-X-Y, preserving the quote character
 */
function convertToken(prefix) {
  return (_match, quote, tokenPath) => {
    const converted = `${prefix}-${tokenPath.replace(/\./g, '-')}`;
    return `${quote}${converted}${quote}`;
  };
}

/**
 * Check if file should be excluded
 */
function shouldExclude(filePath) {
  const fileName = path.basename(filePath);
  return excludePatterns.some((pattern) => {
    if (pattern.includes('*')) {
      // Simple glob matching
      const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
      return regex.test(fileName) || regex.test(filePath);
    }
    return fileName === pattern || filePath.includes(pattern);
  });
}

/**
 * Process a single file
 */
function processFile(filePath) {
  if (shouldExclude(filePath)) {
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  filesScanned++;

  let fileMatches = [];
  let newContent = content;

  // Apply all patterns
  for (const { pattern, prefix } of PATTERNS) {
    // Reset lastIndex for global regex
    pattern.lastIndex = 0;
    const matches = [...newContent.matchAll(pattern)];
    if (matches.length > 0) {
      fileMatches.push(
        ...matches.map((m) => ({
          original: `${prefix}.${m[2]}`,
          converted: `${prefix}-${m[2].replace(/\./g, '-')}`,
          prefix,
          path: m[2],
        }))
      );
      newContent = newContent.replace(pattern, convertToken(prefix));
    }
  }

  if (fileMatches.length === 0) {
    return;
  }

  if (content !== newContent) {
    filesModified++;
    totalReplacements += fileMatches.length;

    console.log(`\n${dryRun ? '[DRY RUN] ' : ''}${filePath}`);

    // Show what's being changed (deduplicate for cleaner output)
    const uniqueChanges = [...new Map(fileMatches.map((m) => [m.original, m])).values()];
    uniqueChanges.forEach(({ original, converted }) => {
      const count = fileMatches.filter((m) => m.original === original).length;
      const suffix = count > 1 ? ` (${count}x)` : '';
      console.log(`  "${original}" → "${converted}"${suffix}`);
    });

    if (!dryRun) {
      fs.writeFileSync(filePath, newContent, 'utf8');
    }
  }
}

/**
 * Recursively walk directory
 */
function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!SKIP_DIRS.includes(entry.name)) {
        walkDir(fullPath);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (EXTENSIONS.includes(ext)) {
        processFile(fullPath);
      }
    }
  }
}

// Main execution
console.log('Color Token Migration: Dot Notation → Dash Notation');
console.log('====================================================');
console.log(`Search path: ${path.resolve(searchPath)}`);
console.log(`Mode: ${dryRun ? 'DRY RUN (no changes will be made)' : 'LIVE'}`);
console.log('');
console.log('Patterns being converted:');
console.log('  "theme.X"     → "theme-X"');
console.log('  "color.X.Y"   → "color-X-Y"');
console.log('  "light.X.Y"   → "light-X-Y"');
console.log('  "dark.X.Y"    → "dark-X-Y"');
console.log('');

try {
  walkDir(searchPath);
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}

console.log('\n====================================================');
console.log(`Files scanned:  ${filesScanned}`);
console.log(`Files modified: ${filesModified}`);
console.log(`Replacements:   ${totalReplacements}`);

if (dryRun && totalReplacements > 0) {
  console.log('\nRun without --dry-run to apply changes.');
}
