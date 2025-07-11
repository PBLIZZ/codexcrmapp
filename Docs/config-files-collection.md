# CodexCRM Config Files Collection

This document contains all configuration files from the packages/config directory and its subdirectories, organized by directory location.

## Table of Contents

- [/packages/config (Root)](#packagesconfig-root)
- [/packages/config/eslint](#packagesconfigeslint)
- [/packages/config/postcss](#packagesconfigpostcss)
- [/packages/config/prettier](#packagesconfigprettier)
- [/packages/config/sentry](#packagesconfigsentry)
- [/packages/config/tailwind](#packagesconfigtailwind)
- [/packages/config/tsup](#packagesconfigtsup)
- [/packages/config/typescript](#packagesconfigtypescript)

## /packages/config (Root)

### /Users/peterjamesblizzard/projects/app_codexcrmapp/packages/config/package.json

```json
{
  "name": "@codexcrm/config",
  "version": "0.0.1",
  "private": true,
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "packageManager": "pnpm@10.12.4",
  "files": ["dist"],
  "scripts": {
    "build": "tsup && tsc --emitDeclarationOnly",
    "dev": "tsup --watch",
    "clean": "rimraf dist"
  },
  "devDependencies": {
    "@codexcrm/config-tsup": "workspace:*"
  }
}
```

### /Users/peterjamesblizzard/projects/app_codexcrmapp/packages/config/tsconfig.json

```json
{
  "extends": "@codexcrm/config-typescript/base.json",
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### /Users/peterjamesblizzard/projects/app_codexcrmapp/packages/config/tsup.config.js

```javascript
/* @file /packages/config/tsup.config.js */
import { serverPackageConfig } from '@codexcrm/config-tsup';

export default serverPackageConfig({
  entry: ['src/index.ts'],
  tsconfig: 'tsconfig.json',
});
```

## /packages/config/eslint

### /Users/peterjamesblizzard/projects/app_codexcrmapp/packages/config/eslint/package.json

```json
{
  "name": "@codexcrm/config-eslint",
  "version": "1.0.3",
  "private": true,
  "type": "module",
  "main": "index.js",
  "types": "index.d.ts",
  "packageManager": "pnpm@10.12.4",
  "files": ["index.js", "index.d.ts"],
  "dependencies": {
    "@eslint/js": "^9.0.0",
    "@tanstack/eslint-plugin-query": "^5.35.6",
    "typescript-eslint": "^8.0.0",
    "eslint-plugin-react": "^7.34.1",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-import": "^2.29.1",
    "eslint-config-prettier": "^9.1.0",
    "globals": "^15.1.0",
    "@next/eslint-plugin-next": "^15.3.2"
  },
  "devDependencies": {
    "eslint": "^9.0.0"
  }
}
```

### /Users/peterjamesblizzard/projects/app_codexcrmapp/packages/config/eslint/index.js

```javascript
// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import reactPlugin from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';
import queryPlugin from '@tanstack/eslint-plugin-query';
import nextPlugin from '@next/eslint-plugin-next';
import importPlugin from 'eslint-plugin-import';

// Base configuration applied to all files
export const baseConfig = tseslint.config(
  { ignores: ['**/dist/**', '**/.next/**', '**/node_modules/**'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { import: importPlugin },
    rules: {
      'import/no-relative-packages': 'error',
    },
  },
  {
    plugins: { react: reactPlugin },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
    },
    settings: { react: { version: 'detect' } },
  },
  {
    plugins: { 'react-hooks': hooksPlugin },
    rules: hooksPlugin.configs.recommended.rules,
  },
  {
    plugins: { '@tanstack/query': queryPlugin },
    rules: queryPlugin.configs.recommended.rules,
  },
  prettierConfig // Must be last to override other formatting rules
);

// Specific configuration for the Next.js app
export const nextjsConfig = tseslint.config({
  files: ['apps/web/**/*.{ts,tsx}'],
  plugins: { '@next/next': nextPlugin },
  rules: {
    ...nextPlugin.configs.recommended.rules,
    ...nextPlugin.configs['core-web-vitals'].rules,
  },
});
```

## /packages/config/postcss

### /Users/peterjamesblizzard/projects/app_codexcrmapp/packages/config/postcss/package.json

```json
{
  "name": "@codexcrm/config-postcss",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "main": "postcss.config.ts",
  "files": ["postcss.config.ts"],
  "devDependencies": {
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.33",
    "tailwindcss": "^4.1.4"
  }
}
```

### /Users/peterjamesblizzard/projects/app_codexcrmapp/packages/config/postcss/postcss.config.ts

```typescript
/** @file /packages/config/postcss/postcss.config.ts */

export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

## /packages/config/prettier

### /Users/peterjamesblizzard/projects/app_codexcrmapp/packages/config/prettier/index.json

```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "quoteProps": "as-needed",
  "trailingComma": "es5",
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "always",
  "endOfLine": "lf",
  "embeddedLanguageFormatting": "auto",
  "htmlWhitespaceSensitivity": "css",
  "insertPragma": false,
  "singleAttributePerLine": false
}
```

### /Users/peterjamesblizzard/projects/app_codexcrmapp/packages/config/prettier/package.json

```json
{
  "name": "@codexcrm/config-prettier",
  "version": "0.0.1",
  "private": true,
  "packageManager": "pnpm@10.12.4",
  "main": "index.json"
}
```

## /packages/config/sentry

### /Users/peterjamesblizzard/projects/app_codexcrmapp/packages/config/sentry/edge.config.ts

```typescript
/**
 * @SERVER-COMPONENT
 * Sentry Edge Configuration
 */

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://4a2402c4c9acb094e4d89e06dbb315f3@o4509315461218304.ingest.de.sentry.io/4509316087283792',

  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,

  // ...

  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});
```

### /Users/peterjamesblizzard/projects/app_codexcrmapp/packages/config/sentry/server.config.ts

```typescript
/**
 * @SERVER-COMPONENT
 * Sentry Server-side Configuration
 */

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://4a2402c4c9acb094e4d89e06dbb315f3@o4509315461218304.ingest.de.sentry.io/4509316087283792',

  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,

  // ...

  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});
```

## /packages/config/tailwind

### /Users/peterjamesblizzard/projects/app_codexcrmapp/packages/config/tailwind/package.json

```json
{
  "name": "@codexcrm/config-tailwind",
  "version": "0.0.1",
  "private": true,
  "main": "tailwind.config.ts",
  "files": ["tailwind.config.ts"],
  "dependencies": {
    "tailwindcss": "^4.1.4",
    "tailwindcss-animate": "^1.0.7"
  }
}
```

### /Users/peterjamesblizzard/projects/app_codexcrmapp/packages/config/tailwind/tailwind.config.ts

```typescript
// packages/config/tailwind/tailwind.config.ts
import type { Config } from 'tailwindcss';
import type { PluginAPI } from 'tailwindcss/types/config';
import tailwindcssAnimate from 'tailwindcss-animate';

/**
 * This is the shared Tailwind configuration that all apps and packages can import.
 * It provides a consistent base styling theme and component definitions.
 */
export default {
  darkMode: ['class'],
  content: [],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar))',
          foreground: 'hsl(var(--sidebar-foreground))',
          muted: 'hsl(var(--sidebar-muted))',
          'muted-foreground': 'hsl(var(--sidebar-muted-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: 'calc(var(--radius) + 2px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    // This plugin adds the base styles you were trying to create with @apply
    function ({ addBase }: PluginAPI) {
      addBase({
        // This is the correct way to apply global styles.
        // It injects them into the same `@layer base` as your variables.
        '*': {
          // It's generally better to set the border color on components
          // rather than globally on every single element with '*'.
          // But if you must, this is how you'd do it.
          // borderColor: 'hsl(var(--border))',
        },
        body: {
          // This correctly applies the background and foreground colors to the body.
          backgroundColor: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
          // You can add other base body styles here
          '-webkit-font-smoothing': 'antialiased',
          '-moz-osx-font-smoothing': 'grayscale',
        },
      });
    },
  ],
} as Config;
```

## /packages/config/tsup

### /Users/peterjamesblizzard/projects/app_codexcrmapp/packages/config/tsup/package.json

```json
{
  "name": "@codexcrm/config-tsup",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "main": "index.ts",
  "types": "index.ts",
  "packageManager": "pnpm@10.12.4",
  "dependencies": {
    "tsup": "^8.2.3"
  }
}
```

### /Users/peterjamesblizzard/projects/app_codexcrmapp/packages/config/tsup/index.ts

```typescript
/** @file /packages/config/tsup/index.ts */
import { defineConfig, type Options } from 'tsup';

const baseConfig: Options = {
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: false, // DTS generation will be handled by tsc
};

export const serverPackageConfig = defineConfig((options) => ({
  ...baseConfig,
  format: ['esm', 'cjs'],
  ...options,
}));

export const uiPackageConfig = defineConfig((options) => ({
  ...baseConfig,
  format: ['esm'],
  banner: {
    js: '"use client";',
  },
  splitting: true,
  external: ['react', 'react-dom'],
  ...options,
}));

export const defaultConfig = defineConfig(baseConfig);
```

## /packages/config/typescript

### /Users/peterjamesblizzard/projects/app_codexcrmapp/packages/config/typescript/package.json

```json
{
  "name": "@codexcrm/config-typescript",
  "version": "0.0.1",
  "private": true,
  "packageManager": "pnpm@10.12.4",
  "files": ["base.json", "next.json", "react-library.json"]
}
```

### /Users/peterjamesblizzard/projects/app_codexcrmapp/packages/config/typescript/base.json

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleDetection": "force",
    "moduleResolution": "Bundler",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "verbatimModuleSyntax": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "incremental": true,
    "jsx": "react-jsx",
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "inlineSources": false,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "preserveWatchOutput": true
  },
  "exclude": ["node_modules", "dist"]
}
```

### /Users/peterjamesblizzard/projects/app_codexcrmapp/packages/config/typescript/next.json

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "plugins": [
      {
        "name": "next"
      }
    ],
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"]
}
```

### /Users/peterjamesblizzard/projects/app_codexcrmapp/packages/config/typescript/react-library.json

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "lib": ["ES2022", "DOM", "DOM.Iterable"]
  }
}
```
