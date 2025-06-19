# ESLint Configuration in Next.js

This document provides a comprehensive overview of ESLint integration and configuration within Next.js applications, highlighting key functionalities, recommended practices, and customization options.

## 1. Core ESLint Plugin and Bundled Configuration

Next.js offers a dedicated ESLint plugin, `eslint-plugin-next`, which is "already bundled within the base configuration that makes it possible to catch common issues and problems in a Next.js application." This integration aims to streamline development by proactively identifying potential issues.

The `eslint-config-next` configuration, which takes precedence over `next.config.js` settings, includes recommended rule-sets from the following ESLint plugins:

- `eslint-plugin-react`
- `eslint-plugin-react-hooks`
- `eslint-plugin-next`

This comprehensive bundling ensures a robust linting environment from the outset, covering React-specific practices, React Hooks usage, and Next.js-specific optimizations.

## 2. Key Next.js Specific Rules

The `eslint-plugin-next` provides a rich set of rules designed to enforce best practices and prevent common pitfalls specific to Next.js development. These rules cover various aspects, including:

### Performance and Optimization

- **@next/next/google-font-display**: "Enforce font-display behavior with Google Fonts."
- **@next/next/google-font-preconnect**: "Ensure preconnect is used with Google Fonts."
- **@next/next/no-img-element**: "Prevent usage of `<img>` element due to slower LCP and higher bandwidth."
- **@next/next/no-sync-scripts**: "Prevent synchronous scripts."
- **@next/next/no-unwanted-polyfillio**: "Prevent duplicate polyfills from Polyfill.io."

### Component and File Structure

- **@next/next/no-async-client-component**: "Prevent Client Components from being async functions."
- **@next/next/no-before-interactive-script-outside-document**: "Prevent usage of next/script's beforeInteractive strategy outside of pages/_document.js."
- **@next/next/no-css-tags**: "Prevent manual stylesheet tags."
- **@next/next/no-document-import-in-page**: "Prevent importing next/document outside of pages/_document.js."
- **@next/next/no-duplicate-head**: "Prevent duplicate usage of `<Head>` in pages/_document.js."
- **@next/next/no-head-element**: "Prevent usage of `<head>` element."
- **@next/next/no-head-import-in-document**: "Prevent usage of next/head in pages/_document.js."
- **@next/next/no-html-link-for-pages**: "Prevent usage of `<a>` elements to navigate to internal Next.js pages."
- **@next/next/no-page-custom-font**: "Prevent page-only custom fonts."
- **@next/next/no-script-component-in-head**: "Prevent usage of next/script in next/head component."
- **@next/next/no-styled-jsx-in-document**: "Prevent usage of styled-jsx in pages/_document.js."
- **@next/next/no-title-in-document-head**: "Prevent usage of `<title>` with Head component from next/document."

### Script Handling

- **@next/next/inline-script-id**: "Enforce id attribute on next/script components with inline content."
- **@next/next/next-script-for-ga**: "Prefer next/script component when using the inline script for Google Analytics."

### Other

- **@next/next/no-assign-module-variable**: "Prevent assignment to the module variable."
- **@next/next/no-typos**: "Prevent common typos in Next.js's data fetching functions."

## 3. Running and Customizing ESLint

Next.js provides flexible options for running and customizing ESLint:

### Linting Specific Directories/Files

By default, Next.js lints `pages/`, `app/`, `components/`, `lib/`, and `src/`. For production builds, you can specify directories using the `dirs` option in `next.config.js`:

```javascript
// next.config.js
module.exports = {
  eslint: {
    dirs: ['pages', 'utils'], // Only run ESLint on these during production builds
  },
}
```

Similarly, `next lint --dir <directory>` and `--file <file>` flags can be used.

### Monorepo Support

For monorepos where Next.js isn't in the root, `eslint-plugin-next` can be directed to the application's root using the `rootDir` setting in `.eslintrc`:

```javascript
// eslint.config.mjs
settings: {
  next: {
    rootDir: 'packages/my-app/',
  },
}
```

`rootDir` accepts paths, globs, or arrays of both.

### Disabling Cache

To improve performance, ESLint caches processed files in `.next/cache`. To disable it for specific scenarios (e.g., rules dependent on more than a single file), use `next lint --no-cache`.

### Disabling Rules

Individual rules from `react`, `react-hooks`, or `next` plugins can be modified or disabled via the `rules` property in `.eslintrc`:

```javascript
// eslint.config.mjs
rules: {
  'react/no-unescaped-entities': 'off',
  '@next/next/no-page-custom-font': 'off',
}
```

### Core Web Vitals Integration

The `next/core-web-vitals` rule set is enabled when `next lint` is run with the strict option. This configuration "updates eslint-plugin-next to error on a number of rules that are warnings by default if they affect Core Web Vitals," improving performance critical to user experience. New applications created with Create Next App automatically include this entry point.

### TypeScript Support

For TypeScript projects, `create-next-app --typescript` adds TypeScript-specific lint rules with `next/typescript`, based on `plugin:@typescript-eslint/recommended`.

### Prettier Integration

To prevent conflicts between ESLint's formatting rules and Prettier, it's recommended to include `eslint-config-prettier` in your ESLint config. This is achieved by installing `eslint-config-prettier` and adding `'prettier'` to the extends array in your `.eslintrc`.

```javascript
// eslint.config.mjs
extends: ['next', 'prettier'],
```

### Linting Staged Files (lint-staged)

To integrate `next lint` with `lint-staged` for running the linter on staged Git files, a specific configuration needs to be added to `.lintstagedrc.js` to correctly pass the `--file` flag to `next lint`.

## 4. Disabling Linting During Production Builds

While generally not recommended as it allows builds to complete with ESLint errors, linting can be entirely disabled during `next build` by setting `eslint.ignoreDuringBuilds` to `true` in `next.config.js`:

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
}
```

## 5. Migrating Existing ESLint Configurations

When integrating Next.js ESLint into an application with an existing configuration, special considerations apply to avoid conflicts:

### Recommended Plugin Ruleset

If you already have `react`, `react-hooks`, `jsx-a11y`, or `import` plugins installed (either directly or via other configs like `airbnb` or `react-app`), or custom `parserOptions` that differ from Next.js's Babel configuration, it's recommended to:

1. Remove conflicting settings if you prefer Next.js's defaults.
2. Extend directly from the Next.js ESLint plugin (`'plugin:@next/next/recommended'`) instead of `'next'`:

```javascript
module.exports = {
  extends: [
    //...
    'plugin:@next/next/recommended',
  ],
}
```

This eliminates "the risk of collisions or errors that can occur due to importing the same plugin or parser across multiple configurations." The plugin can be installed via npm/yarn/pnpm/bun.

### Additional Configurations

If you use other shareable configurations, ensure `eslint-config-next` is extended last in the `extends` array:

```javascript
// eslint.config.mjs
extends: ['eslint:recommended', 'next'],
```

The `next` configuration "already handles setting default values for the parser, plugins and settings properties." Therefore, manual re-declaration is typically unnecessary unless a different configuration is explicitly desired. It's crucial to "make sure that these properties are not overwritten or modified" by other configurations, or to remove configurations that share behavior with the `next` configuration.

---

In summary, Next.js provides a robust and opinionated ESLint setup that helps developers maintain code quality, adhere to best practices, and optimize application performance, with ample options for customization and integration into existing workflows.

> **Note:** NotebookLM can be inaccurate; please double-check its responses.