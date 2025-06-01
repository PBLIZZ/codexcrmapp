#!/usr/bin/env node

/**
 * ESLint Cleanup Script for CodexCRM
 * 
 * This script implements a systematic approach to fixing ESLint issues:
 * 1. Take stock of all issues and group them by rule
 * 2. Batch-fix the "easy" rules (no-unused-vars, explicit-function-return-type)
 * 3. Tackle the "no-explicit-any" problem
 * 4. Set up a temporary CI guardrail
 * 5. Automate fixes on each commit
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ANSI color codes for better output formatting
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

/**
 * Execute a command and return its output
 */
function runCommand(command, silent = false) {
  try {
    if (!silent) {
      console.warn(`${colors.cyan}Running: ${command}${colors.reset}`);
    }
    return execSync(command, { encoding: 'utf8' });
  } catch (_error) {
    if (!silent) {
      console.error(`${colors.red}Command failed: ${command}${colors.reset}`);
      console.error(_error.stdout || _error.message);
    }
    return _error.stdout || '';
  }
}

/**
 * Step 1: Take stock of all ESLint issues and group them by rule
 */
function takeStock() {
  console.warn(`\n${colors.bold}${colors.magenta}Step 1: Taking stock of all ESLint issues...${colors.reset}`);
  
  try {
    const _output = runCommand('npx eslint . --ext .ts,.tsx -f table | sort');
    
    // Count occurrences of each rule
    const ruleRegex = /@typescript-eslint\/[\w-]+|no-console|import\/[\w-]+/g;
    const rules = {};
    
    let match;
    while ((match = ruleRegex.exec(_output)) !== null) {
      const rule = match[0];
      rules[rule] = (rules[rule] || 0) + 1;
    }
    
    // Sort rules by occurrence count
    const sortedRules = Object.entries(rules)
      .sort((a, b) => b[1] - a[1])
      .map(([rule, count]) => `${rule}: ${count} occurrences`);
    
    console.warn(`\n${colors.green}Most common ESLint issues:${colors.reset}`);
    sortedRules.forEach(rule => console.warn(`- ${rule}`));
    
    return sortedRules;
  } catch (error) {
    console.error(`${colors.red}Error taking stock of ESLint issues:${colors.reset}`, error);
    return [];
  }
}

/**
 * Step 2a: Batch-fix unused variables and imports
 */
function fixUnusedVars() {
  console.warn(`\n${colors.bold}${colors.magenta}Step 2a: Fixing unused variables and imports...${colors.reset}`);
  
  try {
    const output = runCommand('npx eslint . --ext .ts,.tsx --rule \'{"@typescript-eslint/no-unused-vars": ["error", {"vars":"all","args":"after-used"}]}\' --fix');
    console.warn(`${colors.green}Unused variables and imports fixed automatically.${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}Error fixing unused variables:${colors.reset}`, error);
    return false;
  }
}

/**
 * Step 2b: Run the codemod to add explicit function return types
 */
function addExplicitReturnTypes() {
  console.warn(`\n${colors.bold}${colors.magenta}Step 2b: Adding explicit function return types...${colors.reset}`);
  
  try {
    // Check if the codemod script exists
    const codemodPath = 'node_modules/@typescript-eslint/utils/dist/ast-utils/explicitReturnType.js';
    if (!fs.existsSync(codemodPath)) {
      console.warn(`${colors.yellow}Codemod script not found at ${codemodPath}.${colors.reset}`);
      console.warn(`${colors.yellow}You may need to install @typescript-eslint/utils or check the path.${colors.reset}`);
      return false;
    }
    
    const output = runCommand(`npx tsx ${codemodPath}`);
    console.warn(`${colors.green}Explicit function return types added.${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}Error adding explicit return types:${colors.reset}`, error);
    return false;
  }
}

/**
 * Step 3: Guide for tackling the "no-explicit-any" problem
 */
function tackleExplicitAny() {
  console.warn(`\n${colors.bold}${colors.magenta}Step 3: Tackling the "no-explicit-any" problem...${colors.reset}`);
  
  console.warn(`\n${colors.cyan}You have two good options for handling 'any' types:${colors.reset}`);
  console.warn(`\n${colors.bold}Option 1: Replace any with a real type${colors.reset}`);
  console.warn(`- Effort: Medium`);
  console.warn(`- Upside: 100% type-safety`);
  console.warn(`- How: Define proper interfaces (e.g., GroupSettings) and refactor.`);
  
  console.warn(`\n${colors.bold}Option 2: Use unknown + narrowing${colors.reset}`);
  console.warn(`- Effort: Low`);
  console.warn(`- Upside: Keeps rule green, still type-safe`);
  console.warn(`- How: Change any → unknown and narrow when reading: if ("color" in settings) ….`);
  
  console.warn(`\n${colors.yellow}Do not add // eslint-disable-next-line … unless the code is truly untypable (rare).${colors.reset}`);
  
  // Find files with explicit any
  try {
    console.warn(`\n${colors.cyan}Files with explicit 'any' types:${colors.reset}`);
    const output = runCommand('npx eslint . --ext .ts,.tsx --rule \'{"@typescript-eslint/no-explicit-any": ["error"]}\' -f table | grep -i "no-explicit-any"');
    console.warn(output);
  } catch (error) {
    console.warn(`${colors.yellow}Could not list files with explicit 'any' types.${colors.reset}`);
  }
}

/**
 * Step 4: Set up a temporary CI guardrail
 */
function setupCIGuardrail() {
  console.warn(`\n${colors.bold}${colors.magenta}Step 4: Setting up a temporary CI guardrail...${colors.reset}`);
  
  const eslintConfigPath = 'eslint.config.js';
  if (!fs.existsSync(eslintConfigPath)) {
    console.warn(`${colors.yellow}ESLint config file not found at ${eslintConfigPath}.${colors.reset}`);
    return false;
  }
  
  console.warn(`\n${colors.cyan}To set up a temporary CI guardrail:${colors.reset}`);
  console.warn(`1. Create a 'legacy-linted' directory`);
  console.warn(`2. Move existing files there`);
  console.warn(`3. Create a new 'src' directory`);
  console.warn(`4. Move fixed files back to 'src' as they're cleaned up`);
  
  console.warn(`\n${colors.cyan}Update your ESLint config to ignore the 'legacy-linted' directory:${colors.reset}`);
  console.warn(`
// In eslint.config.js
export default [
  // ... existing config
  {
    ignores: [
      // ... existing ignores
      'legacy-linted/**',
    ],
  },
];
  `);
  
  return true;
}

/**
 * Step 5: Set up automated fixes on each commit
 */
function setupAutomatedFixes() {
  console.warn(`\n${colors.bold}${colors.magenta}Step 5: Setting up automated fixes on each commit...${colors.reset}`);
  
  console.warn(`\n${colors.cyan}To set up automated fixes on each commit:${colors.reset}`);
  console.warn(`1. Install lint-staged and husky:`);
  console.warn(`   pnpm add -D lint-staged husky`);
  
  console.warn(`\n2. Add the following to your package.json:`);
  console.warn(`
{
  "husky": { 
    "hooks": { 
      "pre-commit": "lint-staged" 
    } 
  },
  "lint-staged": {
    "*.{ts,tsx}": "eslint --max-warnings 0 --fix"
  }
}
  `);
  
  console.warn(`\n${colors.green}This will ensure that no new ESLint issues are introduced.${colors.reset}`);
}

/**
 * Step 6: Future-proof with strict TypeScript settings
 */
function futureProofTypeScript() {
  console.warn(`\n${colors.bold}${colors.magenta}Step 6: Future-proofing with strict TypeScript settings...${colors.reset}`);
  
  console.warn(`\n${colors.cyan}Once the baseline is zero, consider turning on these compiler flags for extra safety:${colors.reset}`);
  console.warn(`
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
  `);
  
  console.warn(`\n${colors.yellow}Note: Expect a small second wave of ESLint/TS errors; they're worth fixing.${colors.reset}`);
}

/**
 * Main function to run all steps
 */
async function main() {
  console.warn(`\n${colors.bold}${colors.green}ESLint Cleanup Script for CodexCRM${colors.reset}`);
  console.warn(`This script will help you systematically fix ESLint issues in your codebase.`);
  
  const askQuestion = (question) => {
    return new Promise((resolve) => {
      rl.question(question, (answer) => {
        resolve(answer.toLowerCase().trim());
      });
    });
  };
  
  // Step 1: Take stock
  const rules = takeStock();
  
  // Step 2a: Fix unused vars
  const answer2a = await askQuestion(`\n${colors.yellow}Do you want to automatically fix unused variables and imports? (y/n) ${colors.reset}`);
  if (answer2a === 'y') {
    fixUnusedVars();
  }
  
  // Step 2b: Add explicit return types
  const answer2b = await askQuestion(`\n${colors.yellow}Do you want to add explicit function return types? (y/n) ${colors.reset}`);
  if (answer2b === 'y') {
    addExplicitReturnTypes();
  }
  
  // Step 3: Tackle explicit any
  tackleExplicitAny();
  
  // Step 4: Set up CI guardrail
  const answer4 = await askQuestion(`\n${colors.yellow}Do you want to set up a temporary CI guardrail? (y/n) ${colors.reset}`);
  if (answer4 === 'y') {
    setupCIGuardrail();
  }
  
  // Step 5: Set up automated fixes
  const answer5 = await askQuestion(`\n${colors.yellow}Do you want to set up automated fixes on each commit? (y/n) ${colors.reset}`);
  if (answer5 === 'y') {
    setupAutomatedFixes();
  }
  
  // Step 6: Future-proof TypeScript
  futureProofTypeScript();
  
  console.warn(`\n${colors.bold}${colors.green}ESLint Cleanup Script Complete${colors.reset}`);
  console.warn(`Follow the recommendations above to systematically clean up your codebase.`);
  
  rl.close();
}

main().catch(error => {
  console.error(`${colors.red}Error running ESLint cleanup script:${colors.reset}`, error);
  rl.close();
});
