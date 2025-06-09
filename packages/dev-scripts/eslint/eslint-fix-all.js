#!/usr/bin/env node

/**
 * ESLint Comprehensive Fix Script
 *
 * This script runs ESLint with the --fix flag on all files in the project
 * and generates a report of remaining issues that need manual attention.
 */

import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get the directory of the current module
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = resolve(__dirname, '..');

// Define the command to run ESLint with the --fix flag
const fixCommand = 'pnpm eslint --fix';
const reportCommand = 'pnpm eslint --format json';

// Define the directories to lint
const directories = [
  'apps/web',
  'packages/server',
  'packages/db',
  'packages/ui',
  'packages/jobs',
];

// Create reports directory if it doesn't exist
const reportsDir = resolve(rootDir, 'reports');
if (!existsSync(reportsDir)) {
  mkdirSync(reportsDir, { recursive: true });
}

// Run ESLint with --fix on each directory
console.warn('🔍 Running ESLint auto-fix on all files...');

try {
  // First, try to fix as many issues as possible
  for (const dir of directories) {
    const dirPath = resolve(rootDir, dir);
    const fullCommand = `${fixCommand} "${dirPath}/**/*.{ts,tsx,js,jsx}"`;

    console.warn(`\n🛠️  Fixing issues in ${dir}...`);
    try {
      execSync(fullCommand, { stdio: 'inherit' });
    } catch (_error) {
      console.warn(
        `Some issues in ${dir} could not be auto-fixed. Continuing...`
      );
    }
  }

  // Then, generate a report of remaining issues
  console.warn('\n📊 Generating report of remaining issues...');

  const issuesByType = {
    'no-explicit-any': [],
    'no-console': [],
    'no-unused-vars': [],
    'no-prototype-builtins': [],
    'no-constant-condition': [],
    other: [],
  };

  for (const dir of directories) {
    const dirPath = resolve(rootDir, dir);
    const fullCommand = `${reportCommand} "${dirPath}/**/*.{ts,tsx,js,jsx}"`;

    try {
      const output = execSync(fullCommand, { stdio: 'pipe' }).toString();
      const results = JSON.parse(output);

      for (const result of results) {
        const { filePath, messages } = result;
        const relativePath = filePath.replace(rootDir + '/', '');

        for (const message of messages) {
          const { ruleId, message: msg, line, column, severity } = message;
          const issue = {
            file: relativePath,
            line,
            column,
            message: msg,
            severity: severity === 2 ? 'error' : 'warning',
          };

          if (ruleId?.includes('no-explicit-any')) {
            issuesByType['no-explicit-any'].push(issue);
          } else if (ruleId?.includes('no-console')) {
            issuesByType['no-console'].push(issue);
          } else if (ruleId?.includes('no-unused-vars')) {
            issuesByType['no-unused-vars'].push(issue);
          } else if (ruleId?.includes('no-prototype-builtins')) {
            issuesByType['no-prototype-builtins'].push(issue);
          } else if (ruleId?.includes('no-constant-condition')) {
            issuesByType['no-constant-condition'].push(issue);
          } else {
            issuesByType['other'].push(issue);
          }
        }
      }
    } catch (error) {
      // If there are no files to lint or other issues
      console.warn(`Could not generate report for ${dir}: ${error.message}`);
    }
  }

  // Write the report to a file
  const reportPath = resolve(reportsDir, 'eslint-issues.json');
  writeFileSync(reportPath, JSON.stringify(issuesByType, null, 2));

  // Generate a human-readable summary
  const summaryPath = resolve(reportsDir, 'eslint-summary.md');
  let summary = '# ESLint Issues Summary\n\n';

  for (const [type, issues] of Object.entries(issuesByType)) {
    summary += `## ${type} (${issues.length} issues)\n\n`;

    if (issues.length > 0) {
      summary += '| File | Line | Column | Message | Severity |\n';
      summary += '|------|------|--------|---------|----------|\n';

      for (const issue of issues) {
        summary += `| ${issue.file} | ${issue.line} | ${issue.column} | ${issue.message} | ${issue.severity} |\n`;
      }

      summary += '\n';
    } else {
      summary += 'No issues found.\n\n';
    }
  }

  writeFileSync(summaryPath, summary);

  console.warn(`\n✅ ESLint auto-fix completed! Reports saved to:`);
  console.warn(`  - JSON: ${reportPath}`);
  console.warn(`  - Markdown: ${summaryPath}`);

  // Print a summary of remaining issues
  console.warn('\nRemaining issues summary:');
  for (const [type, issues] of Object.entries(issuesByType)) {
    console.warn(`  - ${type}: ${issues.length} issues`);
  }

  console.warn('\nNext steps:');
  console.warn('1. Review the reports for details on remaining issues');
  console.warn(
    '2. Fix the most critical issues first (errors before warnings)'
  );
  console.warn('3. Run this script again to track your progress');
} catch (error) {
  console.error('\n❌ Error running ESLint auto-fix:', error.message);
  process.exit(1);
}
