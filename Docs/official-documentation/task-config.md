Of course. This is the perfect stage to pause and get the foundation 100% right. One hour spent here will save you 20 hours of debugging mysterious build and type errors later.

Based on your file structure, you have all the necessary ingredients, but they're mixed up. We're going to unscramble them into a clean, canonical monorepo structure. This is your "reset" button.

I will lay out the 10 most critical files in the exact order you should review and fix them. Follow this sequence precisely. Each step builds on the last.

---

### The 10-File Monorepo Foundation Reset

#### **File #1: The Absolute Root of the Monorepo**

**File:** `/pnpm-workspace.yaml`

**Purpose:** This file is the single source of truth for PNPM. It tells it which directories are packages in your monorepo.

**Action:** Ensure it looks exactly like this. This correctly includes your `apps` and all your `packages`.

```yaml
# /pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

---

#### **File #2: Defining Global Scripts**

**File:** `/package.json` (The root one)

**Purpose:** Defines scripts you can run from anywhere in the monorepo using Turborepo. Declares `devDependencies` that are shared across the entire project (like `typescript`, `prettier`, `turbo`).

**Action:** Update it to look like this. We're adding `turbo` and defining workspace-wide scripts.

```json
// /package.json
{
  "name": "codexcrm-monorepo",
  "private": true,
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "lint": "turbo lint",
    "format": "prettier --write \"**/*.{ts,tsx,md}\""
  },
  "devDependencies": {
    "@codexcrm/config-eslint": "workspace:*",
    "@codexcrm/config-prettier": "workspace:*",
    "@codexcrm/config-typescript": "workspace:*",
    "eslint": "^9.x", // Use the latest major version
    "prettier": "^3.x",
    "typescript": "^5.x",
    "turbo": "^2.x" // Use the latest Turbo
  },
  "packageManager": "pnpm@9.x.x"
}
```

_(Note: I've renamed your config packages slightly for clarity, e.g., `@codexcrm/config-eslint`. This is a best practice to avoid one giant `@codexcrm/config` package. For now, we'll work with your current structure, but this is the ideal future state)._

---

#### **File #3: The TypeScript Path Foundation**

**File:** `/tsconfig.base.json`

**Purpose:** To define all the TypeScript path aliases for the _entire monorepo_. This file is **only for paths**. No compiler options here.

**Action:** Create or replace this file. Note how we point to the `src` folder for packages with code, but to the root for the `config` package. This is intentional and solves your import problem.

```json
// /tsconfig.base.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      // For code packages, point to the source
      "@codexcrm/api/*": ["./packages/api/src/*"],
      "@codexcrm/auth/*": ["./packages/auth/src/*"],
      "@codexcrm/database/*": ["./packages/database/src/*"],
      "@codexcrm/ui/*": ["./packages/ui/src/*"],
      "@codexcrm/background-jobs/*": ["./packages/background-jobs/src/*"],

      // For the config package, point to its root to access all sub-folders
      "@codexcrm/config/*": ["./packages/config/*"],

      // For the web app itself
      "@/*": ["./apps/web/*"]
    }
  }
}
```

---

#### **File #4: The TypeScript Project Orchestrator**

**File:** `/tsconfig.json` (The root one)

**Purpose:** To tell TypeScript that this is a composite project made up of smaller, referenced projects. This is what enables lightning-fast incremental builds with `tsc`.

**Action:** Create or replace this file. It's very simple.

```json
// /tsconfig.json
{
  "extends": "./tsconfig.base.json",
  "files": [],
  "references": [
    { "path": "./apps/web" },
    { "path": "./packages/api" },
    { "path": "packages/auth" },
    { "path": "packages/config" },
    { "path": "packages/database" },
    { "path": "packages/ui" },
    { "path": "packages/background-jobs" }
  ]
}
```

---

#### **File #5: Making `config` a Real, Usable Package**

**File:** `/packages/config/package.json`

**Purpose:** This is the most critical fix for you. This file defines `@codexcrm/config` as a package and uses the `exports` field to tell Node, Next.js, and TypeScript how to resolve imports like `@codexcrm/config/tailwind` or `@codexcrm/config/paths`.

**Action:** Overwrite your existing `packages/config/package.json`.

```json
// /packages/config/package.json
{
  "name": "@codexcrm/config",
  "version": "1.0.0",
  "private": true,
  "files": ["eslint", "next", "postcss", "prettier", "sentry", "tailwind", "typescript", "src"],
  "exports": {
    "./eslint": "./eslint/index.js",
    "./next": "./next/index.ts",
    "./postcss/app": "./postcss/app.mjs",
    "./postcss/ui": "./postcss/ui.js",
    "./prettier": "./prettier/index.json",
    "./sentry/edge": "./sentry/edge.config.ts",
    "./sentry/server": "./sentry/server.config.ts",
    "./tailwind": "./tailwind/index.js",
    "./typescript/base": "./typescript/base.json",
    "./typescript/nextjs": "./typescript/nextjs.json",
    "./typescript/react-library": "./typescript/react-library.json",
    "./paths": "./src/paths.ts"
  }
}
```

---

#### **File #6: Making `config` a TypeScript-aware Package**

**File:** `/packages/config/tsconfig.json`

**Purpose:** To make this package a formal part of the TypeScript project graph defined in the root `tsconfig.json`.

**Action:** Create this file. It simply extends your shared base config.

```json
// /packages/config/tsconfig.json
{
  "extends": "@codexcrm/config/typescript/base",
  "include": ["**/*.ts", "**/*.js", "**/*.mjs", "src"],
  "exclude": ["node_modules", "dist"]
}
```

---

#### **File #7: Declaring Dependencies for Your Web App**

**File:** `/apps/web/package.json`

**Purpose:** To explicitly tell PNPM and Next.js that `apps/web` depends on your other local packages. This is a step many people miss.

**Action:** Add the `dependencies` section with `"workspace:*"`.

```json
// /apps/web/package.json
{
  "name": "web",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --max-warnings 0"
  },
  "dependencies": {
    // Other dependencies like react, next, etc. are here
    "@codexcrm/api": "workspace:*",
    "@codexcrm/auth": "workspace:*",
    "@codexcrm/config": "workspace:*",
    "@codexcrm/database": "workspace:*",
    "@codexcrm/ui": "workspace:*",

    // ... your other dependencies
    "next": "15.0.0-rc.0",
    "react": "19.0.0-rc",
    "zod": "^4"
  },
  "devDependencies": {
    // devDependencies here
  }
}
```

---

#### **File #8: Simplifying Your Web App's TypeScript Config**

**File:** `/apps/web/tsconfig.json`

**Purpose:** This file should be as simple as possible. It inherits everything from the root and your shared config package.

**Action:** Replace your existing file with this. It only extends the shared config. The paths are inherited from the root `tsconfig.json`.

```json
// /apps/web/tsconfig.json
{
  // It extends the shared Next.js preset you created
  "extends": "@codexcrm/config/typescript/nextjs.json",
  "compilerOptions": {
    // You ONLY need to redefine paths that are RELATIVE to this app
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

#### **File #9: Configuring the Next.js Bundler**

**File:** `/apps/web/next.config.ts`

**Purpose:** To tell Next.js (and Turbopack) which local packages contain source code that needs to be compiled.

**Action:** Replace your existing file. The `transpilePackages` array is the modern, correct way to do this.

```typescript
// /apps/web/next.config.ts
import type { NextConfig } from 'next';

const config: NextConfig = {
  // Any other Next.js config you have...
  reactStrictMode: true,

  // THIS IS THE CRITICAL PART
  // Tell Next.js to compile these packages from source
  transpilePackages: [
    '@codexcrm/api',
    '@codexcrm/auth',
    '@codexcrm/database',
    '@codexcrm/ui',
    '@codexcrm/background-jobs',
  ],
};

export default config;
```

_(Notice: `@codexcrm/config` is NOT in `transpilePackages`. This is because it doesn't contain any React components or front-end code that needs special bundling. It's just config files and plain TS.)_

---

#### **File #10: Using the Centralized Tailwind Config**

**File:** `/apps/web/tailwind.config.js`

**Purpose:** To consume the shared Tailwind preset from your config package.

**Action:** Update your app's Tailwind config to use the preset pattern.

```javascript
// /apps/web/tailwind.config.js

// Now you can import directly thanks to our `exports` map!
const sharedConfig = require('@codexcrm/config/tailwind');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Use the shared config as a preset
  presets: [sharedConfig],

  // Provide the app-specific content paths
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './**/*.{js,ts,jsx,tsx,mdx}',
    // CRITICAL: Also include your shared UI package
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
};
```

### Final Clean-Up Actions

1.  **Run `pnpm install`** from the monorepo root. This will read all the new/updated `package.json` files and correctly create the symlinks in `node_modules`.
2.  **Delete the root `eslint.config.js` and `eslint.d.ts`**. You should have a simple `.eslintrc.js` in your `apps/web` directory that just contains `module.exports = { extends: ["@codexcrm/config/eslint"] };`. The root-level ESLint config can be re-added later if needed, but for now, let's keep it simple and per-package.
3.  **Restart your IDE / TypeScript server.** VS Code needs to re-read all the `tsconfig.json` files to understand the new project structure.

After completing these 10 steps in order, your monorepo will have a rock-solid, professional foundation. All your `@codexcrm/*` imports will resolve correctly for both TypeScript and the Next.js bundler, and your configs will be properly centralized. Now you are truly ready to proceed with the App Router refactor.
