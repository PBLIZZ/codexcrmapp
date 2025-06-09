#!/usr/bin/env node

/**
 * ESLint Auto-fix Script
 *
 * This script runs ESLint with the --fix flag on all TypeScript and JavaScript files
 * to automatically fix issues that can be auto-fixed, such as import ordering.
 */

import { execSync } from 'child_process';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

// Get the directory of the current module
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = resolve(__dirname, '..');

// Define the command to run ESLint with the --fix flag
const command = 'pnpm eslint --fix';

// Define the directories to lint
const directories = [
  'apps/web',
  'packages/server',
  'packages/db',
  'packages/ui',
  'packages/jobs',
];

// Run ESLint with --fix on each directory
console.warn('🔍 Running ESLint auto-fix on all files...');

try {
  for (const dir of directories) {
    const dirPath = resolve(rootDir, dir);
    const fullCommand = `${command} "${dirPath}/**/*.{ts,tsx,js,jsx}"`;

    console.warn(`\n🛠️  Fixing issues in ${dir}...`);
    execSync(fullCommand, { stdio: 'inherit' });
  }

  console.warn('\n✅ ESLint auto-fix completed successfully!');
  console.warn('\nRemaining issues may require manual fixes:');
  console.warn('1. Replace "any" types with proper TypeScript types');
  console.warn('2. Remove or replace console.log statements');
  console.warn('3. Fix unused variables by either using them or removing them');
  console.warn('4. Fix Object.prototype method access issues');
} catch (error) {
  console.error('\n❌ Error running ESLint auto-fix:', error.message);
  process.exit(1);
}
