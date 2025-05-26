#!/usr/bin/env node

/**
 * CI Lint Guardrail Script
 * 
 * This script helps manage a gradual approach to fixing ESLint issues by:
 * 1. Tracking files with existing ESLint issues in the legacy-linted directory
 * 2. Ensuring new files and changes to non-legacy files pass ESLint
 * 3. Providing commands to add files to legacy-linted or remove them when fixed
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

// Get the current directory equivalent to __dirname in CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

const LEGACY_DIR = path.join(process.cwd(), 'legacy-linted');

// Ensure legacy-linted directory exists
if (!fs.existsSync(LEGACY_DIR)) {
  fs.mkdirSync(LEGACY_DIR, { recursive: true });
}

// Helper to get all files in a directory recursively
async function getFiles(dir) {
  const subdirs = await readdir(dir);
  const files = await Promise.all(subdirs.map(async (subdir) => {
    const res = path.resolve(dir, subdir);
    return (await stat(res)).isDirectory() ? getFiles(res) : res;
  }));
  return files.flat();
}

// Helper to normalize paths for consistent comparison
function normalizePath(filePath) {
  return path.relative(process.cwd(), filePath).replace(/\\/g, '/');
}

// Get all legacy-linted files
async function getLegacyFiles() {
  try {
    const files = await readdir(LEGACY_DIR);
    return files.filter(file => file.endsWith('.json'))
      .map(file => {
        try {
          return JSON.parse(fs.readFileSync(path.join(LEGACY_DIR, file), 'utf8'));
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

// Add a file to legacy-linted
async function addToLegacy(filePath) {
  const normalizedPath = normalizePath(filePath);
  const packageName = normalizedPath.split('/')[0];
  const legacyFile = path.join(LEGACY_DIR, `${packageName}.json`);
  
  let existingFiles = [];
  try {
    if (fs.existsSync(legacyFile)) {
      existingFiles = JSON.parse(await readFile(legacyFile, 'utf8'));
    }
  } catch (e) {
    console.error(`Error reading ${legacyFile}:`, e);
  }
  
  if (!existingFiles.includes(normalizedPath)) {
    existingFiles.push(normalizedPath);
    await writeFile(legacyFile, JSON.stringify(existingFiles, null, 2));
    console.log(`Added ${normalizedPath} to legacy-linted`);
  } else {
    console.log(`${normalizedPath} is already in legacy-linted`);
  }
}

// Remove a file from legacy-linted
async function removeFromLegacy(filePath) {
  const normalizedPath = normalizePath(filePath);
  const packageName = normalizedPath.split('/')[0];
  const legacyFile = path.join(LEGACY_DIR, `${packageName}.json`);
  
  if (fs.existsSync(legacyFile)) {
    try {
      const existingFiles = JSON.parse(await readFile(legacyFile, 'utf8'));
      const newFiles = existingFiles.filter(file => file !== normalizedPath);
      
      if (existingFiles.length !== newFiles.length) {
        await writeFile(legacyFile, JSON.stringify(newFiles, null, 2));
        console.log(`Removed ${normalizedPath} from legacy-linted`);
      } else {
        console.log(`${normalizedPath} is not in legacy-linted`);
      }
    } catch (e) {
      console.error(`Error updating ${legacyFile}:`, e);
    }
  } else {
    console.log(`No legacy file found for ${packageName}`);
  }
}

// Run ESLint on a file and check if it passes
async function checkFile(filePath) {
  try {
    execSync(`npx eslint ${filePath}`, { stdio: 'pipe' });
    return true;
  } catch (e) {
    return false;
  }
}

// Run ESLint on all files and add failing ones to legacy-linted
async function scanAllFiles() {
  const legacyFiles = await getLegacyFiles();
  
  // Get all TypeScript and JavaScript files
  const appFiles = await getFiles(path.join(process.cwd(), 'apps'));
  const packageFiles = await getFiles(path.join(process.cwd(), 'packages'));
  
  const allFiles = [...appFiles, ...packageFiles]
    .filter(file => /\.(ts|tsx|js|jsx)$/.test(file))
    .map(normalizePath);
  
  console.log(`Found ${allFiles.length} files to scan`);
  
  let failedCount = 0;
  let passedCount = 0;
  
  for (const file of allFiles) {
    // Skip files already in legacy-linted
    if (legacyFiles.includes(file)) {
      console.log(`Skipping legacy file: ${file}`);
      continue;
    }
    
    const passes = await checkFile(file);
    if (!passes) {
      await addToLegacy(file);
      failedCount++;
    } else {
      console.log(`✅ ${file} passes ESLint`);
      passedCount++;
    }
  }
  
  console.log(`\nScan complete:`);
  console.log(`- ${passedCount} files pass ESLint`);
  console.log(`- ${failedCount} files added to legacy-linted`);
  console.log(`- ${legacyFiles.length} files were already in legacy-linted`);
}

// Check if a specific file passes ESLint
async function checkSingleFile(filePath) {
  const normalizedPath = normalizePath(filePath);
  const legacyFiles = await getLegacyFiles();
  
  if (legacyFiles.includes(normalizedPath)) {
    console.log(`${normalizedPath} is in legacy-linted, skipping check`);
    return;
  }
  
  const passes = await checkFile(filePath);
  if (passes) {
    console.log(`✅ ${normalizedPath} passes ESLint`);
  } else {
    console.log(`❌ ${normalizedPath} fails ESLint`);
    console.log('Run with --add to add it to legacy-linted');
  }
}

// Main function to handle command line arguments
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (!command || command === '--help') {
    console.log(`
CI Lint Guardrail Script

Commands:
  --scan                 Scan all files and add failing ones to legacy-linted
  --add <file>           Add a file to legacy-linted
  --remove <file>        Remove a file from legacy-linted
  --check <file>         Check if a file passes ESLint
  --list                 List all files in legacy-linted
  --help                 Show this help message
    `);
    return;
  }
  
  switch (command) {
    case '--scan':
      await scanAllFiles();
      break;
    case '--add':
      if (args[1]) {
        await addToLegacy(args[1]);
      } else {
        console.error('Error: No file specified');
      }
      break;
    case '--remove':
      if (args[1]) {
        await removeFromLegacy(args[1]);
      } else {
        console.error('Error: No file specified');
      }
      break;
    case '--check':
      if (args[1]) {
        await checkSingleFile(args[1]);
      } else {
        console.error('Error: No file specified');
      }
      break;
    case '--list':
      const legacyFiles = await getLegacyFiles();
      console.log('Files in legacy-linted:');
      legacyFiles.forEach(file => console.log(`- ${file}`));
      console.log(`\nTotal: ${legacyFiles.length} files`);
      break;
    default:
      console.error(`Unknown command: ${command}`);
      console.log('Use --help to see available commands');
  }
}

// Self-invoke the main function
main().catch(console.error);
