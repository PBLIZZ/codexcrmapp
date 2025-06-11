// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [// Base ESLint recommended rules
js.configs.recommended, // TypeScript configuration
...tseslint.configs.recommended, // Global settings
{
  ignores: ['node_modules/**', 'dist/**', '.next/**', 'legacy-linted/**'],
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    globals: {
      ...globals.browser,
      ...globals.node,
      ...globals.es2021,
    },
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  linterOptions: {
    reportUnusedDisableDirectives: 'warn',
  },
}, // React configuration
{
  files: ['**/*.{js,jsx,ts,tsx}'],
  plugins: {
    react: reactPlugin,
    'react-hooks': reactHooksPlugin,
  },
  rules: {
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}, // Import plugin configuration
{
  files: ['**/*.{js,jsx,ts,tsx}'],
  plugins: {
    import: importPlugin,
  },
  rules: {
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    'import/first': 'error',
    'import/no-duplicates': 'error',
  },
}, // Next.js configuration
{
  files: ['apps/web/**/*.{js,jsx,ts,tsx}'],
  plugins: {
    '@next/next': nextPlugin,
  },
  rules: {
    '@next/next/no-html-link-for-pages': 'error',
    '@next/next/no-img-element': 'warn',
  },
}, // Path alias rules
{
  files: ['apps/web/**/*.{js,jsx,ts,tsx}'],
  rules: {
    'import/no-relative-parent-imports': 'warn', // Encourage using @/* aliases
  },
}, // Specific rules for the monorepo
{
  files: ['**/*.{js,jsx,ts,tsx}'],
  plugins: {
    prettier: prettierPlugin,
  },
  rules: {
    'prettier/prettier': 'error',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': 'off', // TypeScript handles this better
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-explicit-any': 'error',
    'prefer-const': 'warn',
  },
}, // Ignore patterns
{
  ignores: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/.next/**',
    '**/coverage/**',
  ],
}, // Add Prettier config last to override other formatting rules
// and turn off any ESLint rules that might conflict with Prettier.
prettierConfig, ...storybook.configs["flat/recommended"]];
