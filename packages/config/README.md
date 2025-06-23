# Shared Configuration Package

This package contains all shared configuration files for the CodexCRM monorepo.

## Contents
- `typescript/` - TypeScript configurations
- `eslint/` - ESLint configurations
- `prettier/` - Prettier configurations
- `tailwind/` - Tailwind CSS configurations
- `sentry/` - Sentry error tracking configurations
- `postcss/` - PostCSS configurations for different packages
- `next/` - Next.js configuration

## Usage

### TypeScript Base Configuration
```json
// In tsconfig.json
{
  "extends": "@codexcrm/config/typescript/base"
}
```

### TypeScript Next.js Configuration
```json
// In apps/web/tsconfig.json
{
  "extends": "@codexcrm/config/typescript/nextjs"
}
```

### Prettier Configuration
```json
// In .prettierrc.json
"@codexcrm/config/prettier"
```

### ESLint Configuration
```js
// In eslint.config.js
import baseConfig from '@codexcrm/config/eslint';

export default baseConfig;
```

### Tailwind Configuration
```js
// In tailwind.config.js
const baseConfig = require('@codexcrm/config/tailwind');

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  // Override or extend as needed
};
```

### Next.js Configuration
```ts
// In next.config.ts
import nextConfig from '@codexcrm/config/next';

// Use as-is or extend
export default nextConfig;

// Or access individual exports
import { nextConfig, sentryConfig } from '@codexcrm/config/next';
export default withSomeOtherPlugin(nextConfig);
```

### Sentry Configuration
```ts
// In sentry.server.config.ts
import '@codexcrm/config/sentry/server';

// In sentry.edge.config.ts
import '@codexcrm/config/sentry/edge';
```

### PostCSS Configuration
```js
// For Next.js app (in postcss.config.mjs)
import appConfig from '@codexcrm/config/postcss/app';
export default appConfig;

// For UI package (in postcss.config.js)
const uiConfig = require('@codexcrm/config/postcss/ui');
module.exports = uiConfig;
```