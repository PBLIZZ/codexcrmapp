#!/usr/bin/env node

/**
 * Fix Remaining Unused Variables Script for CodexCRM
 *
 * This script fixes the remaining unused variables in specific files
 * by prefixing them with underscores.
 */

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

/**
 * Fix unused variables in a file
 */
function fixUnusedVariablesInFile(filePath, replacements) {
  try {
    console.warn(
      `${colors.cyan}Fixing unused variables in: ${filePath}${colors.reset}`
    );

    if (!fs.existsSync(filePath)) {
      console.warn(
        `${colors.yellow}File not found: ${filePath}${colors.reset}`
      );
      return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    for (const replacement of replacements) {
      const { pattern, replacement: replaceWith } = replacement;

      if (content.includes(pattern)) {
        content = content.replace(pattern, replaceWith);
        modified = true;
        console.warn(
          `${colors.green}Fixed: ${pattern} -> ${replaceWith}${colors.reset}`
        );
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.warn(
        `${colors.green}Successfully updated: ${filePath}${colors.reset}`
      );
      return true;
    } else {
      console.warn(
        `${colors.yellow}No changes needed in: ${filePath}${colors.reset}`
      );
      return false;
    }
  } catch (error) {
    console.error(
      `${colors.red}Error fixing unused variables in ${filePath}:${colors.reset}`,
      error
    );
    return false;
  }
}

// Files and replacements to process
const filesToFix = [
  {
    path: path.join(
      rootDir,
      'apps/web/app/reset-password/ResetPasswordContent.tsx'
    ),
    replacements: [
      {
        pattern: "const accessToken = params.get('access_token');",
        replacement: "const _accessToken = params.get('access_token');",
      },
      {
        pattern: 'const { data, error } = await supabase.auth.updateUser({',
        replacement:
          'const { data: _data, error } = await supabase.auth.updateUser({',
      },
    ],
  },
  {
    path: path.join(rootDir, 'scripts/eslint-cleanup.js'),
    replacements: [
      {
        pattern: "import path from 'fs';",
        replacement: "import _path from 'fs';",
      },
      {
        pattern: 'const output = runCommand(',
        replacement: 'const _output = runCommand(',
      },
      {
        pattern: '} catch (error) {',
        replacement: '} catch (_error) {',
      },
      {
        pattern: 'const rules = Object.entries(',
        replacement: 'const _rules = Object.entries(',
      },
    ],
  },
  {
    path: path.join(rootDir, 'scripts/eslint-fix-all.js'),
    replacements: [
      {
        pattern: 'const dirname = path.dirname(__filename);',
        replacement: 'const _dirname = path.dirname(__filename);',
      },
      {
        pattern: '} catch (error) {',
        replacement: '} catch (_error) {',
      },
    ],
  },
  {
    path: path.join(rootDir, 'scripts/fix-eslint-staged.js'),
    replacements: [
      {
        pattern: '} catch (error) {',
        replacement: '} catch (_error) {',
      },
    ],
  },
];

/**
 * Main function
 */
async function main() {
  console.warn(
    `\n${colors.bold}${colors.green}Fix Remaining Unused Variables Script for CodexCRM${colors.reset}`
  );

  let totalFixed = 0;

  for (const file of filesToFix) {
    const success = fixUnusedVariablesInFile(file.path, file.replacements);
    if (success) totalFixed++;
  }

  console.warn(
    `\n${colors.bold}${colors.green}Fix Remaining Unused Variables Script Complete${colors.reset}`
  );
  console.warn(`Fixed unused variables in ${totalFixed} files.`);
}

main().catch((error) => {
  console.error(
    `${colors.red}Error running fix remaining unused variables script:${colors.reset}`,
    error
  );
});
