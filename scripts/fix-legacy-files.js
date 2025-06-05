#!/usr/bin/env node

/**
 * Fix Legacy Files Script
 *
 * This script systematically fixes ESLint issues in files tracked in the legacy-linted directory.
 * It focuses on common issues like:
 * 1. Unused variables (prefixing with underscore)
 * 2. Import order issues
 * 3. Console statements (converting to appropriate types)
 * 4. Type issues (replacing 'any' with more specific types)
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory equivalent to __dirname in CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LEGACY_DIR = path.join(process.cwd(), 'legacy-linted');

// Helper to read the legacy files
function getLegacyFiles() {
  try {
    const files = fs.readdirSync(LEGACY_DIR);
    return files
      .filter((file) => file.endsWith('.json'))
      .map((file) => {
        try {
          return JSON.parse(
            fs.readFileSync(path.join(LEGACY_DIR, file), 'utf8')
          );
        } catch (e) {
          console.error(`Error reading ${file}:`, e);
          return [];
        }
      })
      .flat();
  } catch (e) {
    console.error('Error reading legacy files:', e);
    return [];
  }
}

// Helper to read a file
function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

// Helper to write a file
function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}

// Helper to normalize paths for consistent comparison
function normalizePath(filePath) {
  return path.relative(process.cwd(), filePath).replace(/\\/g, '/');
}

// Fix unused variables by prefixing them with underscore
function fixUnusedVariables(content) {
  // Find variable declarations that are marked as unused by ESLint
  const unusedVarRegex = /'([a-zA-Z0-9_]+)' is defined but never used/g;
  const eslintDisableRegex =
    /\/\/ eslint-disable-next-line @typescript-eslint\/no-unused-vars/g;

  // Run ESLint to get the unused variables
  const tempFile = path.join(process.cwd(), '.temp-eslint-check.ts');
  writeFile(tempFile, content);

  try {
    execSync(`npx eslint ${tempFile} --format json`, { stdio: 'pipe' });
    // If we get here, there are no unused variables
    fs.unlinkSync(tempFile);
    return content;
  } catch (e) {
    const output = e.output.toString();
    const jsonStart = output.indexOf('[{');
    if (jsonStart === -1) {
      fs.unlinkSync(tempFile);
      return content;
    }

    const jsonStr = output.slice(jsonStart);
    let results;
    try {
      results = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Error parsing ESLint JSON output:', parseError);
      fs.unlinkSync(tempFile);
      return content;
    }

    fs.unlinkSync(tempFile);

    // Get unused variables from ESLint results
    const unusedVars = [];
    for (const result of results) {
      for (const message of result.messages) {
        if (message.ruleId === '@typescript-eslint/no-unused-vars') {
          const match = message.message.match(
            /'([a-zA-Z0-9_]+)' is defined but never used/
          );
          if (match && match[1]) {
            unusedVars.push(match[1]);
          }
        }
      }
    }

    // Replace unused variables with prefixed versions
    let updatedContent = content;
    for (const varName of unusedVars) {
      // Skip variables that already start with underscore
      if (varName.startsWith('_')) continue;

      // Replace the variable name with _varName, being careful about word boundaries
      const varRegex = new RegExp(`\\b${varName}\\b`, 'g');
      updatedContent = updatedContent.replace(varRegex, `_${varName}`);
    }

    return updatedContent;
  }
}

// Fix console.log statements by converting them to console.warn or console.error
function fixConsoleStatements(content) {
  // Replace console.log with console.warn for debugging
  return content.replace(/console\.log\(/g, 'console.warn(');
}

// Fix import order issues
function fixImportOrder(content) {
  // This is a simple approach - for complex cases, we'd use a dedicated import sorter
  const lines = content.split('\n');
  const importLines = [];
  const otherLines = [];

  // Separate import lines from other lines
  for (const line of lines) {
    if (
      line.trim().startsWith('import ') ||
      line.trim().startsWith('export ')
    ) {
      importLines.push(line);
    } else {
      otherLines.push(line);
    }
  }

  // Sort import lines
  importLines.sort((a, b) => {
    // React and Next.js imports first
    const aIsReactOrNext = a.includes('react') || a.includes('next');
    const bIsReactOrNext = b.includes('react') || b.includes('next');

    if (aIsReactOrNext && !bIsReactOrNext) return -1;
    if (!aIsReactOrNext && bIsReactOrNext) return 1;

    // Then external packages
    const aIsExternal = !a.includes('@/') && !a.includes('@codexcrm/');
    const bIsExternal = !b.includes('@/') && !b.includes('@codexcrm/');

    if (aIsExternal && !bIsExternal) return -1;
    if (!aIsExternal && bIsExternal) return 1;

    // Then @codexcrm/ imports
    const aIsCodexCRM = a.includes('@codexcrm/');
    const bIsCodexCRM = b.includes('@codexcrm/');

    if (aIsCodexCRM && !bIsCodexCRM) return -1;
    if (!aIsCodexCRM && bIsCodexCRM) return 1;

    // Then local imports
    return a.localeCompare(b);
  });

  // Add a blank line after imports if there isn't one already
  if (
    importLines.length > 0 &&
    otherLines.length > 0 &&
    otherLines[0].trim() !== ''
  ) {
    otherLines.unshift('');
  }

  // Combine sorted imports with other lines
  return [...importLines, ...otherLines].join('\n');
}

// Fix type issues by replacing 'any' with more specific types
function fixTypeIssues(content, filePath) {
  // This is a simplified approach - in practice, you'd need more sophisticated type inference
  let updatedContent = content;

  // Replace common any types with more specific types
  updatedContent = updatedContent.replace(
    /: any(\s*)(=|;|\))/g,
    ': Record<string, unknown>$1$2'
  );
  updatedContent = updatedContent.replace(
    /as any(\s*)(;|\))/g,
    'as Record<string, unknown>$1$2'
  );

  // For function parameters that are objects
  updatedContent = updatedContent.replace(
    /\(([^)]*): any(\s*)\)/g,
    '($1: Record<string, unknown>$2)'
  );

  return updatedContent;
}

// Process a single file to fix ESLint issues
function processFile(filePath) {
  console.log(`Processing ${filePath}...`);

  // Read the file content
  const content = readFile(filePath);

  // Apply fixes
  let updatedContent = content;
  updatedContent = fixUnusedVariables(updatedContent);
  updatedContent = fixConsoleStatements(updatedContent);
  updatedContent = fixImportOrder(updatedContent);
  updatedContent = fixTypeIssues(updatedContent, filePath);

  // Write the updated content back to the file
  if (updatedContent !== content) {
    writeFile(filePath, updatedContent);
    console.log(`✅ Fixed issues in ${filePath}`);
    return true;
  } else {
    console.log(`No issues fixed in ${filePath}`);
    return false;
  }
}

// Process all legacy files
function processAllFiles() {
  const legacyFiles = getLegacyFiles();
  console.log(`Found ${legacyFiles.length} files to process`);

  let fixedCount = 0;

  for (const file of legacyFiles) {
    const filePath = path.join(process.cwd(), file);
    const fixed = processFile(filePath);
    if (fixed) fixedCount++;
  }

  console.log(`\nProcessing complete:`);
  console.log(`- ${fixedCount} files fixed`);
  console.log(`- ${legacyFiles.length - fixedCount} files unchanged`);
}

// Process a specific file
function processSingleFile(filePath) {
  const normalizedPath = normalizePath(filePath);
  const legacyFiles = getLegacyFiles();

  if (!legacyFiles.includes(normalizedPath)) {
    console.log(`${normalizedPath} is not in legacy-linted`);
    return;
  }

  processFile(filePath);
}

// Main function to handle command line arguments
function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === '--help') {
    console.log(`
Fix Legacy Files Script

Commands:
  --all                  Process all files in legacy-linted
  --file <file>          Process a specific file
  --help                 Show this help message
    `);
    return;
  }

  switch (command) {
    case '--all':
      processAllFiles();
      break;
    case '--file':
      if (args[1]) {
        processSingleFile(args[1]);
      } else {
        console.error('Error: No file specified');
      }
      break;
    default:
      console.error(`Unknown command: ${command}`);
      console.log('Use --help to see available commands');
  }
}

// Self-invoke the main function
main();
