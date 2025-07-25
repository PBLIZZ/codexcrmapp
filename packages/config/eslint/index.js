import eslint from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import queryPlugin from '@tanstack/eslint-plugin-query';
import reactPlugin from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import tseslint from 'typescript-eslint';

// Base configuration applied to all files
export const baseConfig = tseslint.config(
  { ignores: ['**/dist/**', '**/.next/**', '**/node_modules/**', '**/prisma/generated/**'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { react: reactPlugin },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off', // Disable since we use TypeScript
      'react/display-name': 'off',
    },
    settings: { react: { version: 'detect' } },
  },
  {
    plugins: { 'react-hooks': hooksPlugin },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  {
    plugins: { '@tanstack/query': queryPlugin },
    rules: {
      '@tanstack/query/exhaustive-deps': 'error',
      '@tanstack/query/stable-query-client': 'error',
    },
  },
  {
    plugins: { 'jsx-a11y': jsxA11yPlugin },
    rules: {
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-proptypes': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'error',
    },
  }
);

// Specific configuration for the Next.js app
export const nextjsConfig = tseslint.config({
  files: ['apps/web/**/*.{ts,tsx}'],
  plugins: { '@next/next': nextPlugin },
  rules: {
    '@next/next/no-html-link-for-pages': ['error', 'apps/web/app'],
    '@next/next/no-img-element': 'warn',
    '@next/next/no-sync-scripts': 'error',
  },
});
