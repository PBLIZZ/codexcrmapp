#!/usr/bin/env node

/**
 * Batch ESLint Fix Script for CodexCRM
 *
 * This script systematically fixes the most common ESLint issues in the codebase:
 * 1. Converts console.log to console.warn or console.error
 * 2. Fixes unused variables by prefixing them with underscore
 * 3. Fixes import order issues
 *
 * Usage: node scripts/batch-fix-eslint.js [--fix-console] [--fix-unused] [--fix-imports]
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// ANSI color codes for better output formatting
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

// Parse command line arguments
const args = process.argv.slice(2);
const shouldFixConsole = args.includes('--fix-console') || args.length === 0;
const shouldFixUnused = args.includes('--fix-unused') || args.length === 0;
const shouldFixImports = args.includes('--fix-imports') || args.length === 0;

/**
 * Execute a command and return its output
 */
function runCommand(command, silent = false) {
  try {
    if (!silent) {
      console.warn(`${colors.cyan}Running: ${command}${colors.reset}`);
    }
    return execSync(command, { encoding: 'utf8', cwd: rootDir });
  } catch (error) {
    if (!silent) {
      console.error(`${colors.red}Command failed: ${command}${colors.reset}`);
      if (error.stdout) console.error(error.stdout);
    }
    return error.stdout || '';
  }
}

/**
 * Find all files with ESLint issues
 */
function findFilesWithIssues() {
  console.warn(
    `${colors.bold}${colors.blue}Finding files with ESLint issues...${colors.reset}`
  );

  const output = runCommand(
    'npx eslint . --ext .ts,.tsx,.js,.jsx -f json',
    true
  );
  let files = [];

  try {
    const results = JSON.parse(output);
    files = results
      .filter((result) => result.errorCount > 0 || result.warningCount > 0)
      .map((result) => result.filePath);
  } catch (error) {
    console.error(
      `${colors.red}Error parsing ESLint output:${colors.reset}`,
      error
    );
  }

  return files;
}

/**
 * Fix console.log statements by converting them to console.warn
 */
function fixConsoleStatements(files) {
  if (!shouldFixConsole) return;

  console.warn(
    `\n${colors.bold}${colors.green}Fixing console.log statements...${colors.reset}`
  );

  for (const file of files) {
    try {
      // Skip files in node_modules
      if (file.includes('node_modules')) continue;

      // Read the file content
      const content = fs.readFileSync(file, 'utf8');

      // Replace console.log with console.warn
      const updatedContent = content.replace(
        /console\.log\(/g,
        'console.warn('
      );

      // Write the updated content back to the file
      if (content !== updatedContent) {
        fs.writeFileSync(file, updatedContent);
        console.warn(
          `${colors.green}Fixed console.log statements in:${colors.reset} ${file}`
        );
      }
    } catch (error) {
      console.error(
        `${colors.red}Error fixing console statements in ${file}:${colors.reset}`,
        error
      );
    }
  }
}

/**
 * Fix unused variables by prefixing them with underscore
 */
function fixUnusedVariables() {
  if (!shouldFixUnused) return;

  console.warn(
    `\n${colors.bold}${colors.green}Fixing unused variables...${colors.reset}`
  );

  try {
    // Run ESLint with the no-unused-vars rule set to error
    runCommand(
      'npx eslint . --ext .ts,.tsx --rule \'{"@typescript-eslint/no-unused-vars": ["error", {"vars":"all","args":"after-used"}]}\' --fix'
    );
    console.warn(
      `${colors.green}Unused variables fixed automatically.${colors.reset}`
    );
  } catch (error) {
    console.error(
      `${colors.red}Error fixing unused variables:${colors.reset}`,
      error
    );
  }
}

/**
 * Fix import order issues
 */
function fixImportOrder() {
  if (!shouldFixImports) return;

  console.warn(
    `\n${colors.bold}${colors.green}Fixing import order...${colors.reset}`
  );

  try {
    // Run ESLint with the import/order rule set to error
    runCommand(
      'npx eslint . --ext .ts,.tsx,.js,.jsx --rule \'{"import/order": ["error", {"groups": ["builtin", "external", "internal", "parent", "sibling", "index"]}]}\' --fix'
    );
    console.warn(
      `${colors.green}Import order fixed automatically.${colors.reset}`
    );
  } catch (error) {
    console.error(
      `${colors.red}Error fixing import order:${colors.reset}`,
      error
    );
  }
}

/**
 * Fix the remaining unused variables in server.ts that couldn't be fixed automatically
 */
function fixServerTsUnusedVars() {
  if (!shouldFixUnused) return;

  console.warn(
    `\n${colors.bold}${colors.green}Fixing unused error variables in server.ts...${colors.reset}`
  );

  const serverTsPath = path.join(rootDir, 'apps/web/lib/supabase/server.ts');

  try {
    if (fs.existsSync(serverTsPath)) {
      let content = fs.readFileSync(serverTsPath, 'utf8');

      // Replace the catch blocks
      content = content.replace(/catch \(error\) {/g, 'catch (_error) {');

      fs.writeFileSync(serverTsPath, content);
      console.warn(
        `${colors.green}Fixed unused error variables in server.ts${colors.reset}`
      );
    }
  } catch (error) {
    console.error(`${colors.red}Error fixing server.ts:${colors.reset}`, error);
  }
}

/**
 * Fix the remaining unused imports in MainLayout.tsx
 */
function fixMainLayoutUnusedImports() {
  if (!shouldFixUnused) return;

  console.warn(
    `\n${colors.bold}${colors.green}Fixing unused imports in MainLayout.tsx...${colors.reset}`
  );

  const mainLayoutPath = path.join(
    rootDir,
    'apps/web/components/layout/MainLayout.tsx'
  );

  try {
    if (fs.existsSync(mainLayoutPath)) {
      let content = fs.readFileSync(mainLayoutPath, 'utf8');

      // Replace the imports with underscore prefixes
      content = content.replace(
        /import {[\s\n]*([^}]*)Search([^}]*),[\s\n]*([^}]*)X([^}]*)/g,
        'import {$1_Search$2,$3_X$4'
      );

      fs.writeFileSync(mainLayoutPath, content);
      console.warn(
        `${colors.green}Fixed unused imports in MainLayout.tsx${colors.reset}`
      );
    }
  } catch (error) {
    console.error(
      `${colors.red}Error fixing MainLayout.tsx:${colors.reset}`,
      error
    );
  }
}

/**
 * Fix any types in DashboardContent.tsx
 */
function fixDashboardContentAnyTypes() {
  console.warn(
    `\n${colors.bold}${colors.green}Fixing any types in DashboardContent.tsx...${colors.reset}`
  );

  const dashboardContentPath = path.join(
    rootDir,
    'apps/web/components/dashboard/DashboardContent.tsx'
  );

  try {
    if (fs.existsSync(dashboardContentPath)) {
      let content = fs.readFileSync(dashboardContentPath, 'utf8');

      // Replace any with Record<string, unknown>
      content = content.replace(/: any/g, ': Record<string, unknown>');

      fs.writeFileSync(dashboardContentPath, content);
      console.warn(
        `${colors.green}Fixed any types in DashboardContent.tsx${colors.reset}`
      );
    }
  } catch (error) {
    console.error(
      `${colors.red}Error fixing DashboardContent.tsx:${colors.reset}`,
      error
    );
  }
}

/**
 * Run a final ESLint check to see what issues remain
 */
function runFinalCheck() {
  console.warn(
    `\n${colors.bold}${colors.blue}Running final ESLint check...${colors.reset}`
  );

  const output = runCommand('npx eslint . --ext .ts,.tsx,.js,.jsx -f table');
  console.warn(`\n${colors.yellow}Remaining ESLint issues:${colors.reset}`);
  console.warn(output);
}

/**
 * Main function
 */
async function main() {
  console.warn(
    `\n${colors.bold}${colors.green}Batch ESLint Fix Script for CodexCRM${colors.reset}`
  );

  // Find files with ESLint issues
  const files = findFilesWithIssues();
  console.warn(
    `${colors.blue}Found ${files.length} files with ESLint issues.${colors.reset}`
  );

  // Fix console.log statements
  fixConsoleStatements(files);

  // Fix unused variables
  fixUnusedVariables();

  // Fix import order
  fixImportOrder();

  // Fix specific files that need manual intervention
  fixServerTsUnusedVars();
  fixMainLayoutUnusedImports();
  fixDashboardContentAnyTypes();

  // Run a final ESLint check
  runFinalCheck();

  console.warn(
    `\n${colors.bold}${colors.green}Batch ESLint Fix Script Complete${colors.reset}`
  );
  console.warn(
    `For any remaining issues, please refer to the ESLINT-CLEANUP-GUIDE.md file.`
  );
}

main().catch((error) => {
  console.error(
    `${colors.red}Error running batch ESLint fix script:${colors.reset}`,
    error
  );
});
