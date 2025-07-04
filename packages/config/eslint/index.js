//packages/config / eslint / index.js
import { FlatCompat } from '@eslint/eslintrc';
import tanstackQueryPlugin from '@tanstack/eslint-plugin-query';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import prettier from "eslint-config-prettier";
import globals from 'globals';
import tseslint from 'typescript-eslint';

// Create compat instance
const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export const codexCrmPreset = tseslint.config(
  // 1. Global Ignores
  {
    ignores: [
      'node_modules/',
      'dist/',
      '**/dist/**',  // Explicitly ignore all dist directories anywhere
      'build/',
      '**/build/**', // Explicitly ignore all build directories anywhere
      '**/.next/**', // Explicitly ignore all Next.js output
      'public/',
      'apps/_web_*/**', // Exclude backup directories
      'Docs/**',      // Exclude documentation directory
      // FIX #1: The globstar `**/` ignores config files in ANY directory, not just the root.
      '**/*.config.{js,ts,mjs,cjs}',
      '**/*.d.ts',
    ],
  },

  // 2. Base Configurations
  ...tseslint.configs.recommendedTypeChecked,
  ...tanstackQueryPlugin.configs['flat/recommended'],

  // 3. Main Custom Configuration for TypeScript/React Files
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: true,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      import: importPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // Import Rules
      'import/no-relative-packages': 'error',
      'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
      // React Rules
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      // TypeScript Rules
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-shadow': 'error',

      'no-shadow': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always'],

    },
  },

  // 4. Prettier - MUST BE LAST
  prettier,
);

// 5. Next.js Specific Config - Exported Separately
// This is site-plan specific and should be applied only by Next.js apps
export const nextjsConfig = compat.config({
  extends: ['next/core-web-vitals'],
});
