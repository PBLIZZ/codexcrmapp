#!/usr/bin/env node

/**
 * ESLint Staged Fix Script
 *
 * This script runs ESLint with the --fix flag on specific categories of issues
 * to gradually improve code quality without attempting to fix everything at once.
 */

import { execSync } from 'child_process';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

// Get the directory of the current module
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = resolve(__dirname, '..');

// Define the base command
const baseCommand = 'pnpm eslint';

// Define the directories to lint
const directories = [
  'apps/web',
  'packages/server',
  'packages/db',
  'packages/ui',
  'packages/jobs',
];

// Define the rule categories to fix
const stages = [
  {
    name: 'Import Order',
    rules: ['import/order'],
    description: 'Fixing import order issues',
  },
  {
    name: 'Unused Variables',
    rules: ['@typescript-eslint/no-unused-vars'],
    description: 'Identifying unused variables (requires manual fixes)',
  },
  {
    name: 'Console Statements',
    rules: ['no-console'],
    description: 'Identifying console statements (requires manual fixes)',
  },
  {
    name: 'Any Types',
    rules: ['@typescript-eslint/no-explicit-any'],
    description: 'Identifying any types (requires manual fixes)',
  },
];

// Run ESLint for each stage
console.warn('🔍 Running ESLint staged fixes...');

try {
  // First run: Fix import order issues (these can be auto-fixed)
  const importOrderStage = stages[0];
  console.warn(`\n🛠️  Stage 1: ${importOrderStage.description}...`);

  for (const dir of directories) {
    const dirPath = resolve(rootDir, dir);
    const fixCommand = `${baseCommand} --fix --rule "${importOrderStage.rules[0]}:warn" "${dirPath}/**/*.{ts,tsx,js,jsx}"`;

    try {
      console.warn(`   Fixing in ${dir}...`);
      execSync(fixCommand, { stdio: 'pipe' });
    } catch (_error) {
      // Continue even if there are errors, as we're just trying to fix what we can
      console.warn(`   Some issues in ${dir} could not be auto-fixed.`);
    }
  }

  // Second run: Generate reports for issues that need manual fixes
  console.warn('\n📊 Generating reports for issues that need manual fixes:');

  for (let i = 1; i < stages.length; i++) {
    const stage = stages[i];
    console.warn(`\n📋 Stage ${i + 1}: ${stage.description}...`);

    // Create a combined rule string
    const ruleString = stage.rules.map((rule) => `"${rule}:warn"`).join(',');

    for (const dir of directories) {
      const dirPath = resolve(rootDir, dir);
      const reportCommand = `${baseCommand} --rule ${ruleString} "${dirPath}/**/*.{ts,tsx,js,jsx}" --format stylish`;

      try {
        console.warn(`\n   Issues in ${dir}:`);
        const output = execSync(reportCommand, { stdio: 'pipe' }).toString();
        if (output.includes('problem')) {
          console.warn(output);
        } else {
          console.warn('   ✅ No issues found!');
        }
      } catch (error) {
        // If there are linting errors, the command will fail but still output the report
        console.warn(error.stdout.toString());
      }
    }
  }

  console.warn('\n✅ ESLint staged fixes completed!');
  console.warn('\nNext steps:');
  console.warn('1. Review the reports above for issues that need manual fixes');
  console.warn(
    '2. Fix the most critical issues first (any types, unused variables)'
  );
  console.warn('3. Run the script again to see your progress');
  console.warn('\nTip: You can run ESLint on a single file with:');
  console.warn('pnpm eslint --fix path/to/file.tsx');
} catch (error) {
  console.error('\n❌ Error running ESLint staged fixes:', error.message);
  process.exit(1);
}
