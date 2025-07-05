<!--
Last Updated: 2025-06-15
Version: 2.1.0
Status: Active
-->

# Monorepo Configuration Architecture

This document outlines the centralized configuration strategy for the CodexCRM monorepo. Adhering to this architecture is critical for maintaining consistency, stability, and developer efficiency.

## 1. The Core Principle: `@codexcrm/config`

All shared tooling configurations (TypeScript, ESLint, Prettier, Tailwind CSS, PostCSS) are managed within a single internal package: `packages/config`.

**This is the single source of truth.** We do not create separate packages like `@codexcrm/config-eslint`. Instead, we expose different configuration files from the single `@codexcrm/config` package.

### How It Works: The `exports` Map

The magic happens in `packages/config/package.json` via the `exports` map. This map creates clean, importable paths for each configuration file.

```json
// packages/config/package.json (Simplified)
{
  "name": "@codexcrm/config",
  "exports": {
    "./typescript/base": "./typescript/base.json",
    "./typescript/nextjs": "./typescript/nextjs.json",
    "./eslint": "./eslint/index.js",
    "./tailwind": "./tailwind/tailwind.config.ts"
  }
}
```

This allows any other package in the monorepo to use a simple, readable import path to get the configuration it needs.

---

## 2. TypeScript Configuration Hierarchy

Our TypeScript setup is layered to separate concerns. Understanding this hierarchy is key.

1.  **`packages/config/typescript/base.json`**: Defines the strict, non-negotiable compiler rules for the entire project. **All other tsconfig files should ultimately extend this.**
2.  **`tsconfig.base.json` (Root)**: Defines the monorepo-wide **path aliases** (e.g., `@codexcrm/ui/*`). This is the map for the entire project.
3.  **`tsconfig.json` (Root)**: The **development orchestrator**. It uses `"references"` to link all packages together for the IDE and for holistic type-checking (`pnpm typecheck`).
4.  **`tsconfig.build.json` (Root)**: The **build orchestrator**. It uses `"references"` to list only the packages that produce a compiled JavaScript artifact (i.e., it omits `packages/config`).
5.  **`apps/web/tsconfig.json` (Consumer)**: An application's `tsconfig` is minimal. It simply extends the appropriate preset from `@codexcrm/config` and re-declares its own local alias (`@/*`).

### Example: `apps/web/tsconfig.json`
```json
{
  "extends": "@codexcrm/config/typescript/nextjs",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
  // "include" and "exclude" are also defined here
}
```

---

## 3. Build & Task Orchestration (`turbo.json`)

Turborepo is the high-speed build system for the monorepo, configured via `turbo.json` at the root. It understands the dependencies between packages and caches outputs to avoid re-doing work.

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*", "tsconfig.json"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

-   **`dependsOn: ["^build"]`**: This tells a task (like `lint` or `build`) that it must wait for all of its internal workspace dependencies to finish their own `build` task first.
-   **`outputs`**: This tells Turbo what files and folders to cache after a task completes successfully.

---

## 4. Consuming Configurations

### ESLint
An app's `.eslintrc.js` file should be minimal:
```javascript
/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: [require.resolve('@codexcrm/config/eslint')],
};
```

### Tailwind CSS
An app's `tailwind.config.ts` uses the shared config as a **preset**. This is critical because the `content` paths must be defined locally for CSS purging to work correctly.

```typescript
import type { Config } from 'tailwindcss';
import { tailwindPreset } from '@codexcrm/config/tailwind';

const config: Config = {
  presets: [tailwindPreset],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    // CRITICAL: Also include the shared UI package
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
};
export default config;
```

---

## 5. Monorepo-Aware Application Code

The monorepo structure changes how our application code, especially in `apps/web`, is written.

### `next.config.ts`
The `apps/web/next.config.ts` file has one critical responsibility: telling the Next.js bundler which local packages contain raw source code that needs to be compiled.

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // This is the essential part.
  transpilePackages: [
    '@codexcrm/api',
    '@codexcrm/auth',
    '@codexcrm/ui',
    '@codexcrm/database',
  ],
};

export default nextConfig;
```

### tRPC in Server Components
For initial data loading, Server Components should import and use a server-side tRPC caller. This caller is built using the `appRouter` from our shared `@codexcrm/api` package.

```typescript
// apps/web/lib/trpc/server.ts
import { createCallerFactory } from '@codexcrm/api/trpc';
import { appRouter } from '@codexcrm/api/root';

const createCaller = createCallerFactory(appRouter);
// Context creation logic would be here
export const serverApi = createCaller(await createContext());

// In a Server Component (e.g., app/dashboard/page.tsx)
import { serverApi } from '@/lib/trpc/server';

export default async function Dashboard() {
  const contacts = await serverApi.contact.list(); // Direct, typesafe call
  // ... render contacts
}
```

### tRPC in Client Components
For interactive data (mutations, client-side fetching), we use TanStack Query hooks. The tRPC client in `apps/web` is configured to know about the `appRouter` from `@codexcrm/api`.

```typescript
// In a Client Component: "use client";
import { api } from '@/lib/trpc/client';

function ContactList() {
  const { data, isLoading } = api.contact.list.useQuery();
  // ... render loading state or data
}
```

### Server Actions
Server Actions can also leverage the centralized API layer, ensuring business logic is not duplicated.

```typescript
// app/actions/contact-actions.ts
'use server';
import { serverApi } from '@/lib/trpc/server';
import { revalidatePath } from 'next/cache';

export async function createContact(formData: FormData) {
  const name = formData.get('name') as string;
  // Re-use the same tRPC procedure that the client-side mutation would use
  await serverApi.contact.create({ name });
  revalidatePath('/contacts');
}
```