<!--
Last Updated: 2025-07-05
Version: 3.0.0
Status: Active
-->

# Monorepo Configuration Architecture

This document outlines the centralized configuration strategy for the CodexCRM monorepo. Adhering to this architecture is critical for maintaining consistency, stability, and developer efficiency.

## 1. The Core Principle: Granular Configuration Packages

To ensure maximum clarity and maintainability, we use separate, scoped packages for each tool's configuration. These packages live inside the `packages/config/` directory.

-   `@codexcrm/config-eslint`
-   `@codexcrm/config-typescript`
-   `@codexcrm/config-prettier`
-   *(Other configs like Tailwind and PostCSS are exposed from a general `@codexcrm/config` package)*

**Benefits of this approach:**
-   **Explicit Dependencies:** Each config package declares its own dependencies (e.g., ESLint plugins), keeping the root `package.json` clean.
-   **Maintainability:** Changes to a tool's configuration are isolated to its specific package.
-   **Scalability:** This pattern is easy to understand and manage as the project grows.

### How It Works: `pnpm-workspace.yaml`

The `pnpm-workspace.yaml` file is configured with `packages/config/*` to tell `pnpm` to discover these nested packages and treat them as part of the workspace.

---

## 2. Consuming Configurations

Each application or package in the monorepo consumes these shared configurations in a standardized way.

### TypeScript
An app's `tsconfig.json` extends the appropriate preset from the `@codexcrm/config-typescript` package.

```json
// Example: apps/web/tsconfig.json
{
  "extends": "@codexcrm/config-typescript/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## 2. TypeScript Configuration Hierarchy

Our TypeScript setup is layered to separate concerns. Understanding this hierarchy is key.

1.  **`packages/config/typescript/base.json`**: Defines the strict, non-negotiable compiler rules for the entire project. **All other tsconfig files should ultimately extend this.**
2.  **`tsconfig.base.json` (Root)**: Defines the monorepo-wide **path aliases** (e.g., `@codexcrm/ui/*`). This is the map for the entire project.
3.  **`tsconfig.json` (Root)**: The **development orchestrator**. It uses `"references"` to link all packages together for the IDE and for holistic type-checking (`pnpm typecheck`).
4.  **`tsconfig.build.json` (Root)**: The **build orchestrator**. It uses `"references"` to list only the packages that produce a compiled JavaScript artifact (i.e., it omits `packages/config`).
5.  **`apps/web/tsconfig.json` (Consumer)**: An application's `tsconfig` is minimal. It simply extends the appropriate preset from `@codexcrm/config` and re-declares its own local alias (`@/*`).

### ESLint
An app's `.eslintrc.js` file extends the base configuration from the `@codexcrm/config-eslint` package.

```javascript
// Example: apps/web/.eslintrc.js
/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ["@codexcrm/config-eslint"],
};
```

### Prettier
The root `package.json` tells the Prettier CLI where to find the configuration by referencing the `@codexcrm/config-prettier` package.

```json
// root package.json
{
  "name": "codexcrm-monorepo",
  "prettier": "@codexcrm/config-prettier",
  "devDependencies": {
    "@codexcrm/config-prettier": "workspace:*"
  }
}
```

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