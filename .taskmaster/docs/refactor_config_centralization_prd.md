
# PRD: Monorepo Configuration Unification

**Version:** 1.0.0
**Status:** Proposed
**Date:** 2025-07-06
**Author:** Gemini-CLI

---

## 1. Problem Statement

Our monorepo currently suffers from a critical architectural inconsistency. It simultaneously uses two conflicting methods for managing and consuming shared configurations (ESLint, TypeScript, Tailwind CSS, etc.):

1.  **Scoped Packages:** The documented and preferred method, where each config is its own versioned package within the workspace (e.g., `@codexcrm/config-eslint`).
2.  **Central Exports:** A legacy method that relies on a single, monolithic `@codexcrm/config` package and ambiguous TypeScript path aliases (`@codexcrm/config/*`).

This duality has led to a brittle and confusing developer experience, evidenced by:
*   **Inconsistent `tsconfig.json` files:** Different packages extend the base TypeScript config using three different methods (scoped package, path alias, and relative paths).
*   **Misplaced Dependencies:** Dependencies for a specific tool (e.g., `tailwindcss-animate` for Tailwind) are located in consuming packages (`@codexcrm/ui`) instead of with the configuration itself.
*   **Redundant and Ambiguous Configurations:** Files like `pnpm-workspace.yaml` and the root `tsconfig.base.json` contain redundant or conflicting entries to support both systems.

This inconsistency makes the codebase difficult to maintain, onboard new developers to, and increases the likelihood of configuration-related errors.

## 2. Proposed Solution & Goals

### Solution

We will refactor the entire monorepo to **exclusively use the "Scoped Packages" method** for all shared configurations. This involves:
1.  Eliminating the monolithic `@codexcrm/config` package and its corresponding path alias.
2.  Ensuring every shared configuration (TypeScript, Tailwind CSS) is its own distinct package within `packages/config/`.
3.  Standardizing the consumption of these config packages across all apps and packages in the monorepo.

### Goals

*   Achieve a single, consistent, and explicit method for managing all shared configurations.
*   Improve the developer experience by providing clear and predictable import paths.
*   Increase maintainability by correctly isolating tool-specific dependencies within their respective config packages.
*   Align the codebase with the architecture described in `centralising-config.md`.

## 3. Technical Implementation Details

This section details the "As-Is" (current, incorrect state) and the "To-Be" (refactored, correct state) for each affected file.

---

### 3.1. `pnpm-workspace.yaml`

**As-Is:** Contains a redundant entry for `packages/config/*`.
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'packages/config/*'
```

**To-Be:** The redundant entry is removed. `packages/*` is sufficient.
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

---

### 3.2. Root `tsconfig.base.json`

**As-Is:** Contains the ambiguous `@codexcrm/config/*` path alias.
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@codexcrm/api/*": ["./packages/api/src/*"],
      "@codexcrm/auth/*": ["./packages/auth/src/*"],
      "@codexcrm/database/*": ["./packages/database/src/*"],
      "@codexcrm/ui/*": ["./packages/ui/src/*"],
      "@codexcrm/background-jobs/*": ["./packages/background-jobs/src/*"],

      "@codexcrm/config/*": ["./packages/config/*"],

      "@/*": ["./apps/web/*"]
    }
  }
}
```

**To-Be:** The ambiguous alias is removed. Imports will rely on package names, not path aliases.
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@codexcrm/api/*": ["./packages/api/src/*"],
      "@codexcrm/auth/*": ["./packages/auth/src/*"],
      "@codexcrm/database/*": ["./packages/database/src/*"],
      "@codexcrm/ui/*": ["./packages/ui/src/*"],
      "@codexcrm/background-jobs/*": ["./packages/background-jobs/src/*"],
      "@/*": ["./apps/web/*"]
    }
  }
}
```

---

### 3.3. `packages/config/package.json`

**As-Is:** This file exists and is the root of the "Central Export" method.
```json
{
  "name": "@codexcrm/config",
  "version": "1.0.0",
  "private": true,
  "files": [ "typescript", "prettier", "eslint", "tailwind", "sentry", "src", "postcss", "next" ],
  "exports": {
    ".": "./src/paths.ts",
    "./paths": "./src/paths.ts",
    "./typescript/base": "./typescript/base.json",
    "./typescript/nextjs": "./typescript/nextjs.json",
    "./typescript/react-library": "./typescript/react-library.json",
    "./prettier": "./prettier/index.json",
    "./eslint": "./eslint/index.js",
    "./tailwind": "./tailwind/tailwind.config.ts",
    "./sentry/edge": "./sentry/edge.config.ts",
    "./sentry/server": "./sentry/server.config.ts",
    "./postcss/app": "./postcss/app.mjs",
    "./postcss/ui": "./postcss/ui.js",
    "./next": "./next/index.ts"
  }
}
```

**To-Be:** This file will be **deleted**.

---

### 3.4. `packages/config/tailwind/`

**As-Is:** This directory contains `tailwind.config.ts` but no `package.json`. It is not a standalone package.

**To-Be:** A new `package.json` will be created in this directory, turning it into a proper scoped package.

**New File: `packages/config/tailwind/package.json`**
```json
{
  "name": "@codexcrm/config-tailwind",
  "version": "1.0.0",
  "private": true,
  "main": "tailwind.config.ts",
  "types": "tailwind.config.ts",
  "files": [
    "tailwind.config.ts"
  ],
  "dependencies": {
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "tailwindcss": "^4.1.4"
  }
}
```

---

### 3.5. `packages/ui/package.json`

**As-Is:** Contains a `tailwindcss-animate` dependency that belongs with the Tailwind config.
```json
{
  "name": "@codexcrm/ui",
  // ...
  "devDependencies": {
    // ...
    "tailwindcss-animate": "^1.0.7",
    // ...
  }
}
```

**To-Be:** The `tailwindcss-animate` dependency is removed. The package will now depend on the new `@codexcrm/config-tailwind` package.
```json
{
  "name": "@codexcrm/ui",
  // ...
  "devDependencies": {
    // ...
    "@codexcrm/config-tailwind": "workspace:*",
    // ...
  }
}
```

---

### 3.6. Standardization of `tsconfig.json`

All `tsconfig.json` files within packages will be updated to use the correct, consistent `extends` path.

**Example As-Is (`packages/api/tsconfig.json`):**
```json
{
  "extends": "../config/typescript/base.json",
  "include": ["src"],
  "exclude": ["dist", "node_modules"],
  "compilerOptions": {
    "outDir": "dist"
  }
}
```

**Example To-Be (For ALL packages like `api`, `database`, etc.):**
```json
{
  "extends": "@codexcrm/config-typescript/base.json",
  "include": ["src"],
  "exclude": ["dist", "node_modules"],
  "compilerOptions": {
    "outDir": "dist"
  }
}
```

## 4. Actionable Tasks

This section lists the discrete tasks required to complete the refactor. This is intended for parsing by Taskmaster.

1.  **Task: Refactor `pnpm-workspace.yaml`**
    *   **Description:** Edit the root `pnpm-workspace.yaml` to remove the redundant `'packages/config/*'` entry.
    *   **File:** `pnpm-workspace.yaml`
    *   **Acceptance:** The file only contains `apps/*` and `packages/*`.

2.  **Task: Refactor Root `tsconfig.base.json`**
    *   **Description:** Edit the root `tsconfig.base.json` to remove the `'@codexcrm/config/*'` path alias.
    *   **File:** `tsconfig.base.json`
    *   **Acceptance:** The specified path alias is no longer present in the `paths` object.

3.  **Task: Delete Monolithic Config Package**
    *   **Description:** Delete the `package.json` file from the `packages/config` directory.
    *   **File:** `packages/config/package.json`
    *   **Acceptance:** The file is deleted.

4.  **Task: Create Scoped Tailwind CSS Config Package**
    *   **Description:** Create a new `package.json` file in `packages/config/tailwind` to define the `@codexcrm/config-tailwind` package. This includes adding its specific dependencies.
    *   **File:** `packages/config/tailwind/package.json`
    *   **Acceptance:** The file is created with the correct name, version, and dependencies.

5.  **Task: Relocate Tailwind Dependency**
    *   **Description:** Remove the `tailwindcss-animate` dependency from `packages/ui/package.json` and add a `devDependency` for the new `@codexcrm/config-tailwind` package.
    *   **File:** `packages/ui/package.json`
    *   **Acceptance:** The dependency changes are correctly applied.

6.  **Task: Standardize All `tsconfig.json` Files**
    *   **Description:** Audit and update all `tsconfig.json` files within the `packages/*` directories to ensure they extend from a scoped package (e.g., `@codexcrm/config-typescript/base.json` or `@codexcrm/config-typescript/react-library.json`), not from a relative path or an aliased path.
    *   **Files:** `packages/api/tsconfig.json`, `packages/database/tsconfig.json`, `packages/background-jobs/tsconfig.json`, etc.
    *   **Acceptance:** All package-level `tsconfig.json` files use a consistent, scoped-package `extends` path.

7.  **Task: Update Tailwind Config Consumption**
    *   **Description:** Update `tailwind.config.ts` files in `apps/web` and `packages/ui` to import the preset from the new `@codexcrm/config-tailwind` package.
    *   **Files:** `apps/web/tailwind.config.ts`, `packages/ui/tailwind.config.ts`
    *   **Acceptance:** Imports are updated from `'@codexcrm/config/tailwind'` to `'@codexcrm/config-tailwind'`.

8.  **Task: Final Validation**
    *   **Description:** Run `pnpm install --force` to rebuild the dependency graph and then run `pnpm typecheck` to ensure all TypeScript references resolve correctly.
    *   **Commands:** `pnpm install --force`, `pnpm typecheck`
    *   **Acceptance:** Both commands complete successfully with no errors.
