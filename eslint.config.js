// eslint.config.js
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

export default tseslint.config(
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
  
  // 2. Base Import Rules - Apply to all files
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/no-relative-packages': 'error',
    },
  },

  // 3. Base Configurations
    ...tseslint.configs.recommendedTypeChecked,
  ...tanstackQueryPlugin.configs['flat/recommended'],

  // 4. Main Custom Configuration for TypeScript/React Files
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,

      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

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

  // 4. Next.js Specific Override - UPDATED
  ...compat.config({
    extends: ['next'],
    settings: {
      next: {
        rootDir: 'apps/web/',
      },
    },
  }),

  // 5. Prettier Configuration
      prettier,
);
