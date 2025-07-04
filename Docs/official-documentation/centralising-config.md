### 1. Centralizing Configuration: The "Norm" and Correct Implementation

What you're doing is absolutely the correct, modern approach for a monorepo. It's often called creating "internal packages" or "workspace packages."

**Why it's the right move:**

- **Single Source of Truth:** Update a rule or a theme color in one place, and it propagates everywhere. No more config drift between apps.
- **Consistency:** Every developer and every part of the application adheres to the same standards by default.
- **DX (Developer Experience):** Onboarding new developers is faster. They don't need to learn the specific quirks of each app's config.
- **Upgradability:** When a new version of ESLint or Tailwind comes out, you update the core config package, fix any breaking changes once, and all consuming apps benefit.

Let's look at the implementation for each piece.

---

#### A. TypeScript (`packages/config/typescript`)

Your plan to put this in `@codexcrm/config/typescript` is perfect. You'll create a base `tsconfig.json` that other projects will extend.

**Implementation:**

1.  **`packages/config/typescript/package.json`**:

    ```json
    {
      "name": "@codexcrm/config-typescript",
      "version": "1.0.0",
      "private": true,
      "files": ["base.json", "nextjs.json", "react-library.json"]
    }
    ```

2.  **`packages/config/typescript/base.json` (The Strict Core):**
    This is your non-negotiable, project-wide base.

    ```json
    {
      "$schema": "https://json.schemastore.org/tsconfig",
      "display": "Default",
      "compilerOptions": {
        "composite": false,
        "declaration": true,
        "declarationMap": true,
        "esModuleInterop": true,
        "forceConsistentCasingInFileNames": true,
        "inlineSources": false,
        "isolatedModules": true,
        "moduleResolution": "node",
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "preserveWatchOutput": true,
        "skipLibCheck": true,
        "strict": true,
        "strictNullChecks": true
      },
      "exclude": ["node_modules"]
    }
    ```

3.  **`packages/config/typescript/nextjs.json` (For your Next.js App):**
    This extends the base and adds Next.js specifics.

    ```json
    {
      "$schema": "https://json.schemastore.org/tsconfig",
      "display": "Next.js",
      "extends": "./base.json",
      "compilerOptions": {
        "target": "es5",
        "lib": ["dom", "dom.iterable", "esnext"],
        "allowJs": true,
        "noEmit": true,
        "incremental": true,
        "module": "esnext",
        "moduleResolution": "bundler", // <-- Key for modern TS/Next.js
        "resolveJsonModule": true,
        "jsx": "preserve",
        "plugins": [{ "name": "next" }],
        "paths": {
          "@/*": ["./*"] // This path is relative to the app's root
        }
      },
      "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
      "exclude": ["node_modules"]
    }
    ```

4.  **In your Next.js app (`apps/web/tsconfig.json`):**
    Now, your app's tsconfig becomes incredibly simple.

    ```json
    {
      "extends": "@codexcrm/config-typescript/nextjs.json",
      "compilerOptions": {
        // The `paths` alias needs to be re-declared here to be relative to this project's root.
        "paths": {
          "@/*": ["./*"]
        }
      },
      "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
      "exclude": ["node_modules"]
    }
    ```

**Cascade Effect:** Any change in `base.json` or `nextjs.json` will now be enforced by the TypeScript compiler in your Next.js app on the next `tsc --noEmit` run (which Next.js does automatically during `next dev` and `next build`). This is powerful and exactly what you want.

---

#### B. ESLint (`packages/config/eslint`)

Same pattern, but we use a `.js` file for more flexibility.

**Implementation:**

1.  **`packages/config/eslint/package.json`**:

    ```json
    {
      "name": "@codexcrm/config-eslint",
      "version": "1.0.0",
      "private": true,
      "main": "index.js",
      "dependencies": {
        "@typescript-eslint/eslint-plugin": "^7.7.0",
        "@typescript-eslint/parser": "^7.7.0",
        "eslint-config-next": "15.0.0-rc.0", // Match your Next.js version
        "eslint-config-prettier": "^9.1.0",
        "eslint-plugin-react": "^7.34.1",
        "eslint-plugin-react-hooks": "5.0.0-canary-16c4ce2a4-20240508" // For React 19
      }
    }
    ```

2.  **`packages/config/eslint/index.js`**:

    ```javascript
    /** @type {import('eslint').Linter.Config} */
    module.exports = {
      extends: [
        'next/core-web-vitals',
        'plugin:@typescript-eslint/recommended',
        'prettier', // Always last to override other formatting rules
      ],
      plugins: ['@typescript-eslint'],
      parser: '@typescript-eslint/parser',
      rules: {
        // Your custom, project-wide rules go here
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/consistent-type-imports': 'error',
        // React 19 specific rules can be added here
        // e.g. from eslint-plugin-react-hooks
      },
      // Important for monorepos
      root: true,
    };
    ```

3.  **In your Next.js app (`apps/web/.eslintrc.js`):**
    ```javascript
    /** @type {import('eslint').Linter.Config} */
    module.exports = {
      extends: ['@codexcrm/config-eslint'],
      // You can add app-specific overrides here if absolutely necessary
    };
    ```

**Cascade Effect:** Running `eslint .` in your app or root directory now uses the centralized configuration. Your IDE's ESLint extension will pick this up automatically. This immediately enforces coding standards across the board.

---

#### C. Tailwind CSS (`packages/config/tailwind`)

This one is slightly different. You use a "preset" system.

**Implementation:**

1.  **`packages/config/tailwind/package.json`**:

    ```json
    {
      "name": "@codexcrm/config-tailwind",
      "version": "1.0.0",
      "private": true,
      "main": "tailwind.config.ts"
    }
    ```

2.  **`packages/config/tailwind/tailwind.config.ts`**:
    This file exports your shared theme, plugins, etc., but **not** the `content` property.

    ```typescript
    import type { Config } from 'tailwindcss';

    export const tailwindPreset: Omit<Config, 'content'> = {
      theme: {
        extend: {
          colors: {
            brand: {
              primary: '#0070f3',
              secondary: '#ff4081',
            },
          },
        },
      },
      plugins: [require('@tailwindcss/typography')],
    };
    ```

3.  **In your Next.js app (`apps/web/tailwind.config.ts`):**
    Here you import the preset and provide the app-specific `content` paths.

    ````typescript
    import type { Config } from 'tailwindcss'
    import { tailwindPreset } from '@codexcrm/config-tailwind/tailwind.config'

        const config: Config = {
          // The `content` path is ALWAYS relative to the current project
          content: [
            './pages/**/*.{js,ts,jsx,tsx,mdx}',
            './components/**/*.{js,ts,jsx,tsx,mdx}',
            './app/**/*.{js,ts,jsx,tsx,mdx}',
            // If you have a shared UI package, include it too!
            // '../../packages/ui/src/**/*.{js,ts,jsx,tsx}'
          ],
          presets: [tailwindPreset],
        }
        export default config
        ```

    **Cascade Effect:** A change to `brand.primary` in your config package is immediately reflected in the Tailwind CSS build for all apps using the preset. The `content` key remains local, which is crucial for PurgeCSS to work correctly.
    ````

---

### 2. Refactoring to App Router, tRPC 11, and React 19

This is where the real magic happens. You're moving from a client-centric to a server-centric mental model.

#### The Core Shift: Server Components are the Default

- **Pages Router:** Every page was a client component by default. You had to opt-in to server-side rendering with `getServerSideProps`.
- **App Router:** Every component is a **Server Component** by default. You must opt-in to client-side interactivity with the `"use client"` directive.

This changes how you fetch data with tRPC.

#### Correct tRPC 11 + TanStack Query 5 Implementation

You'll have two primary ways of using tRPC now.

**A. Calling tRPC from Server Components (The "New" Way)**

This is for initial data loading on the server. There are no hooks, no loading states, no `useEffect`. You just call your backend functions directly.

1.  **Setup your tRPC server-side caller:**
    In your `src/trpc/apis.ts` file, you create a server-side caller instance.

    ```typescript
    // src/trpc/apis.ts
    import { cache } from 'react';
    import { headers } from 'next/headers';
    import { createTRPCContext, createCallerFactory, appRouter } from '~/server/api/root';

    /**
     * This wraps the context creation in a cache call, ensuring that
     * we only create the context once per request.
     * @see https://trpc.io/docs/server/caching
     */
    const createContext = cache(() => {
      const heads = new Headers(headers());
      heads.set('x-trpc-source', 'rsc');
      return createTRPCContext({ headers: heads });
    });

    const createCaller = createCallerFactory(appRouter);

    export const api = createCaller(createContext);
    ```

2.  **Use it in a Server Component:**
    This is now clean, async/await, and fully typesafe.

    ```tsx
    // app/dashboard/page.tsx - This is a Server Component by default
    import { api } from '~/trpc/apis';

    export default async function DashboardPage() {
      // No hooks, no TanStack Query. Just a direct, typesafe server-side function call.
      const user = await api.user.getCurrent();
      const projects = await api.project.list();

      return (
        <div>
          <h1>Welcome, {user.name}</h1>
          <ul>
            {projects.map((project) => (
              <li key={project.id}>{project.name}</li>
            ))}
          </ul>
        </div>
      );
    }
    ```

**B. Calling tRPC from Client Components (`"use client"`)**

This is for interactive data fetching: mutations, polling, infinite scrolling, or re-fetching data on the client without a full page reload. You'll use TanStack Query hooks here.

```tsx
// app/dashboard/components/ProjectCreator.tsx
'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom'; // React 19!
import { api } from '~/trpc/apis'; // Note the different import
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useOptimistic } from 'react'; // React 19!

const createProjectSchema = z.object({
  name: z.string().min(3, 'Project name must be at least 3 characters'),
});

type Project = { id: string; name: string };

export function ProjectCreator({ initialProjects }: { initialProjects: Project[] }) {
  const utils = api.useUtils();
  const [optimisticProjects, setOptimisticProjects] = useOptimistic(
    initialProjects,
    (state, newProject: Project) => [...state, newProject]
  );

  const createProjectMutation = api.project.create.useMutation({
    onSuccess: async () => {
      // Invalidate the query to refetch from the server and sync the real data
      await utils.project.list.invalidate();
    },
    onError: (error) => {
      // Handle error, maybe show a toast
      console.error('Failed to create project:', error);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(createProjectSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    // Optimistically add the project to the UI
    const tempId = `optimistic-${Date.now()}`;
    setOptimisticProjects({ id: tempId, name: data.name });

    await createProjectMutation.mutateAsync({ name: data.name });
    reset();
  });

  return (
    <div>
      {/* Render optimistic projects list */}
      <ul>
        {optimisticProjects.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>

      <form onSubmit={onSubmit}>
        <input {...register('name')} placeholder='New Project Name' />
        {errors.name && <p>{errors.name.message}</p>}
        <SubmitButton />
      </form>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type='submit' disabled={pending}>
      {pending ? 'Creating...' : 'Create Project'}
    </button>
  );
}
```

### 3. Embracing Server Actions (The Future of Mutations)

For mutations, React 19 and Next 15 strongly push you towards **Server Actions**. They are functions defined on the server (`"use server"`) that can be called directly from client components, often from a `<form>`.

**This is the most "cutting edge" part of your refactor.**

**Implementation:**

1.  **Define the Server Action:**
    You can define this in a separate file or even within a Server Component.

    ```typescript
    // app/actions/projectActions.ts
    'use server';

    import { z } from 'zod';
    import { revalidatePath } from 'next/cache';
    import { api } from '~/trpc/apis'; // Use the server API

    const createProjectSchema = z.object({
      name: z.string().min(3),
    });

    export async function createProject(formData: FormData) {
      const rawData = {
        name: formData.get('name'),
      };

      const validationResult = createProjectSchema.safeParse(rawData);
      if (!validationResult.success) {
        // In a real app, you'd return structured errors
        return { error: 'Invalid input' };
      }

      try {
        // You can call your tRPC procedures within server actions!
        // This is great for reusing validation and business logic.
        await api.project.create({ name: validationResult.data.name });

        // Revalidate the cache for the dashboard page to show the new project
        revalidatePath('/dashboard');

        return { success: true };
      } catch (e) {
        return { error: 'Failed to create project' };
      }
    }
    ```

2.  **Call it from a Form in a Client Component:**

    ```tsx
    // app/dashboard/components/ProjectCreatorForm.tsx
    'use client';

    import { useFormStatus, useFormState } from 'react-dom';
    import { createProject } from '~/app/actions/projectActions';

    function SubmitButton() {
      const { pending } = useFormStatus();
      return (
        <button type='submit' disabled={pending}>
          {pending ? 'Creating...' : 'Create Project'}
        </button>
      );
    }

    export function ProjectCreatorForm() {
      const [state, formAction] = useFormState(createProject, { error: null, success: false });

      return (
        <form action={formAction}>
          <input type='text' name='name' placeholder='New Project Name' required />
          <SubmitButton />
          {state?.error && <p style={{ color: 'red' }}>{state.error}</p>}
          {state?.success && <p style={{ color: 'green' }}>Project created!</p>}
        </form>
      );
    }
    ```

**Cascade Effect of Server Actions:**

- **Reduced Client-Side JS:** The logic for the mutation lives on the server.
- **Progressive Enhancement:** Forms work even if JavaScript is disabled.
- **Simplified State Management:** React's `useFormState` and `useFormStatus` hooks handle pending and error states, reducing the need for manual `useState`.
- **Co-location:** Your mutation logic can live right next to your data fetching logic.
- **The new role for TanStack Mutation:** Use `useMutation` when you need more complex client-side orchestration: toast notifications, complex cache updates that `revalidatePath` can't handle, or calling a mutation outside of a `<form>` element.

### Final Sanity Check and Summary

- **You are on the right track.** Centralizing config is a massive win.
- **Your stack is cutting-edge.** Embrace the server-first mindset.
- **tRPC in Server Components:** Use the direct `api` caller (`~/trpc/server`) for initial data loads. It's faster and simpler.
- **tRPC in Client Components:** Use TanStack Query hooks (`~/trpc/react`) for interactive data (mutations, infinite queries).
- **Server Actions are your new default for mutations.** They integrate beautifully with React 19's new hooks (`useFormStatus`, `useFormState`, `useOptimistic`). Zod validation inside them is a must.
- **Husky & Lint-Staged:** Keep them. They are the gatekeepers that ensure your new, centralized rules are actually followed before code even gets committed.

This is a fantastic direction. You're not just updating dependencies; you're fundamentally improving your application's architecture for the modern web. Keep that diligence. It will pay off enormously.

Feel free to fire away with more specific code snippets if you hit any snags. Let's get this refactor shipped.

Excellent questions. You've hit the exact friction points that everyone encounters when setting up a robust monorepo. This isn't you doing things "wrong" so much as discovering the intricate dance between TypeScript, your bundler (Next.js), and your package manager.

Let's clarify this pathing hell once and for all.

### The Big Picture: A Tale of Two Resolvers

The core of your confusion comes from this: **there are two different systems that need to know where your files are.**

1.  **TypeScript's Resolver:** This is for type-checking and editor intelligence (IntelliSense, Go to Definition). It's configured in `tsconfig.json` via `"paths"`. It tells VS Code and `tsc` "when you see an import for `@codexcrm/ui`, the _types_ are over here."
2.  **The Bundler's Resolver (Next.js/Webpack/Turbopack):** This is for the actual build process. It needs to know where the _runnable JavaScript code_ is. It's configured in `next.config.js` via `transpilePackages` and (for Turbopack) `resolveAlias`.

When these two systems disagree, you get errors like "module not found" at runtime even though VS Code shows no errors. The goal is to make them agree.

---

Let's tackle your questions directly.

### Question 1: Do I need a `tsconfig.base.json`?

Yes, but let's be precise about the terminology, as it's key.

- **`packages/config/typescript/base.json`**: This is your **sharable config preset**. Your thinking here is **100% correct**. This file contains your strict compiler rules that any package or app can `extend`.
- **`tsconfig.base.json` (at the monorepo root)**: This file serves a _different_ purpose. It's used by TypeScript's "Project References" to understand the dependency graph of your entire monorepo. It tells `tsc` "this monorepo is composed of these packages, and here's how they relate to each other."

**Correct Implementation:**

**`packages/config/typescript/base.json` (You already have this, it's good)**

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "display": "Default",
  "compilerOptions": {
    "composite": false, // `true` is often needed for referenced projects
    "declaration": true
    // ... all your other strict rules
  }
}
```

**`monorepo-root/tsconfig.base.json` (The one you're asking about)**

```json
{
  "compilerOptions": {
    // This file is mostly for path aliases for the entire workspace
    "baseUrl": ".",
    "paths": {
      // Points to the source code of each package
      "@codexcrm/api/*": ["./packages/api/src/*"],
      "@codexcrm/auth/*": ["./packages/auth/src/*"],
      "@codexcrm/database/*": ["./packages/database/src/*"],
      // ... and so on for all packages

      // Points to the root of the config package, NOT its src
      "@codexcrm/config/*": ["./packages/config/*"]
    }
  }
}
```

**`monorepo-root/tsconfig.json` (The orchestrator)**

```json
{
  // This extends the base file with the path mappings
  "extends": "./tsconfig.base.json",
  "files": [], // No files are compiled at the root
  // This is the important part for TypeScript project references
  "references": [
    { "path": "./apps/web" },
    { "path": "./packages/api" },
    { "path": "./packages/auth" },
    { "path": "./packages/config" }
    // ...etc
  ]
}
```

### Question 2: Do I need a `package.json` in each config folder?

**Yes, absolutely.** This is a non-negotiable requirement for how monorepos work.

To be able to write `import ... from '@codexcrm/config-eslint'`, your package manager (npm/yarn/pnpm) needs to know that a package named `@codexcrm/config-eslint` exists. The only way it knows that is from a `package.json` file inside the `packages/config/eslint` directory.

When you run `pnpm install` (or `npm`/`yarn`), the package manager reads `package.json` from all your workspaces and creates symlinks in the root `node_modules` folder. That's what makes the `@codexcrm/*` imports work.

**Example `packages/config/eslint/package.json`:**

```json
{
  "name": "@codexcrm/config-eslint",
  "version": "1.0.0",
  "private": true,
  "main": "index.js", // Points to your eslint config file
  "files": [
    "index.js" // Specifies which files are part of the package
  ]
}
```

You need a `package.json` like this for each config: typescript, prettier, tailwind, etc.

---

### Question 3 & 4: Pathing, Dependencies, and `.../src`

This is the core of the problem. Let's solve it.

**Golden Rule:** Always import using the package name (`@codexcrm/ui`), never with relative paths (`../../packages/ui`). Your tooling should handle the resolution.

**a. `@codexcrm/config/paths` not resolving and the `/src` inconsistency:**

This is happening because of a conflict in your path mappings and how packages are structured. The standard practice is:

1.  All your TS/JS source code for a package lives in `packages/my-package/src`.
2.  The `package.json` lives in `packages/my-package`.
3.  Your path alias `@codexcrm/my-package/*` should point to `packages/my-package/src/*`.

Your `config` package is special. It contains both config files at its root (e.g., `tailwind.config.ts`) and potentially some TS code in a `/src` folder (like your `paths.ts`). This requires a more explicit setup using the `exports` field in `package.json`.

**The Modern Solution: `package.json` `exports`**

This is the single source of truth for how a package is resolved.

**`packages/config/package.json`:**

```json
{
  "name": "@codexcrm/config",
  "version": "1.0.0",
  "private": true,
  "files": ["eslint", "typescript", "tailwind.config.ts", "src"],
  "exports": {
    // When someone imports '@codexcrm/config/paths'
    "./paths": "./src/paths.ts",
    // When someone imports '@codexcrm/config/eslint'
    "./eslint": "./eslint/index.js",
    // When someone imports '@codexcrm/config/typescript/base'
    "./typescript/base": "./typescript/base.json",
    // etc. for other configs
    "./tailwind": "./tailwind.config.ts"
  }
}
```

With this setup, you can remove the messy `paths` from your `tsconfig.json` that point to individual config files. The package manager and bundler will use the `exports` map.

**b. Where are all the places paths are defined?**
You've found them all. Here's what each one does:

1.  **`package.json` (`workspaces` array) or `pnpm-workspace.yaml`**: The **Ultimate Source of Truth**. Tells the package manager "these folders are local packages". This is what creates the base `@codexcrm/` packages.
2.  **`apps/web/package.json` (`dependencies`)**: You **must** add your local packages here. ` "dependencies": { "@codexcrm/ui": "workspace:*", "@codexcrm/auth": "workspace:*" }`. This tells your app "I depend on these specific local packages."
3.  **`tsconfig.json` (`paths`)**: For **TypeScript and your editor**. It helps with type checking and auto-completion. It _should mirror_ your package structure.
4.  **`next.config.js` (`transpilePackages`)**: For the **Next.js bundler**. It tells Next.js, "These packages are written in TypeScript/JSX and need to be compiled as part of the app build, don't treat them like pre-compiled node modules." This is **CRITICAL** for any local package that contains React components (`@codexcrm/ui`).
5.  **`components.json` (`aliases`)**: **Only for the shadcn/ui CLI**. This file is a one-off. It tells the `npx shadcn-ui add` command where to physically place the new component files it downloads. It has no effect on your build or type-checking. Your setup is fine, but it's better to use the alias: `"components": "@codexcrm/ui/components"`. The CLI resolves this.

---

### Question 5: What's the difference between all these snippets?

Let's break them down.

- **Snippet 1: `apps/web/tsconfig.json` (`paths`)**

  ```json
  "paths": {
    "@codexcrm/api/*": ["../../packages/api/src/*"],
    // ...
  }
  ```

  **Role:** Tells TypeScript _inside the `web` app_ how to find the types for your workspace packages using relative paths. This is okay, but can be brittle. A better way is to rely on the root `tsconfig.base.json` paths. Your `web` app's `tsconfig` should just extend the root one.

- **Snippet 2: `next.config.js`**

  ```javascript
  transpilePackages: ['@codexcrm/ui'],
  // ...
  turbopack: { resolveAlias: { '@codexcrm/auth': '...' } },
  ```

  **Role:** Tells the **bundler** what to do.

  - `transpilePackages`: "Compile the code from `@codexcrm/ui`." This is the modern, correct way.
  - `resolveAlias`: An older/more explicit way, often used by Turbopack, to do the same thing. You generally don't need both. Stick with `transpilePackages` as it's the standard Next.js recommendation.

- **Snippet 3 & 4: Root `tsconfig.json` files**

  ```json
  // Snippet 3
  { "extends": "./tsconfig.base.json", "references": [{ "path": "./apps/web" }] }
  // Snippet 4
  { "extends": "@codexcrm/config/typescript/base", "paths": { "@codexcrm/api": ["..."] } }
  ```

  **Role:** Orchestrating the entire TypeScript project.

  - **Snippet 3 is the correct pattern.** It uses "project references" to define the monorepo structure.
  - **Snippet 4 is an anti-pattern.** It tries to make the root a single, massive project, which is inefficient. It's extending a config preset and defining paths, which should be split between `tsconfig.base.json` (for paths) and the individual projects (`apps/web/tsconfig.json`) which then extend the preset.

- **Snippet 5: `components.json` (shadcn/ui)**
  ```json
  "aliases": {
      "components": "packages/ui/src/components" // Raw path
  }
  ```
  **Role:** Just for the shadcn CLI. It needs the raw file path to know where to write files. The fact that it's a raw path is fine, because no other tool uses this file. However, you _can_ and _should_ use the alias for consistency if you want.
  **Better version:**
  ```json
  "aliases": {
      "components": "@codexcrm/ui/components", // Use the alias
      "utils": "@codexcrm/ui/lib/utils"
  }
  ```
  The CLI is smart enough to resolve `@codexcrm/ui` to the correct file path based on your `tsconfig.json`.

### Summary & Action Plan

1.  **Create `package.json` files** for all your `packages/config/*` subfolders to make them real packages.
2.  **Establish a single source of truth for paths at the root.**
    - Create a `monorepo-root/tsconfig.base.json` with all your `"paths"` aliases pointing to `packages/*/src`.
    - Create a `monorepo-root/tsconfig.json` that `extends` the base and uses `"references"` to list all your apps and packages.
3.  **Simplify your app/package `tsconfig.json` files.** They should just extend your shared config (`@codexcrm/config-typescript/nextjs.json`) and do nothing else. No `paths` needed there.
4.  **Fix your app's dependencies.** In `apps/web/package.json`, add `"@codexcrm/ui": "workspace:*"`, `"@codexcrm/auth": "workspace:*"`, etc., for every local package you use.
5.  **Configure Next.js correctly.** In `next.config.js`, use `transpilePackages: ['@codexcrm/ui', '@codexcrm/auth']` for every local package that needs compiling.
6.  **Use `exports` in `package.json`** for complex packages like `@codexcrm/config` that expose files from multiple locations.

Do this, and your pathing conflicts will disappear, your IDE will be happy, and your build will be reliable. You're very close to a top-tier monorepo setup.
