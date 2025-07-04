// eslint.config.js
import nextPlugin from '@next/eslint-plugin-next';
import tanstackQueryPlugin from '@tanstack/eslint-plugin-query';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import prettierConfig from 'eslint-config-prettier'; // <-- Import it
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // 1. Global Ignores
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      '**/.next/',
      'public/',
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

  // 4. Next.js Specific Override
  {
    files: ['apps/web/**/*.{ts,tsx}'],
    plugins: {
      '@next/next': nextPlugin,
    },
    // FIX #2: This block tells the Next.js plugin where to find your app directory.
    settings: {
      next: {
        rootDir: 'apps/web/',
      },
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
  // 5. Prettier Configuration
  ...prettierConfig.configs.recommended
);
