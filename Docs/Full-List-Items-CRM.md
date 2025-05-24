# Full List of Items for CRM

> **DEPRECATED:** This document has been superseded by [Sprint1-Status.md](./Sprint1-Status.md), which contains the most up-to-date information about the project status and remaining tasks for Sprint 1. Please refer to Sprint1-Status.md for current development priorities.

Okay, let's break down these implementation steps for your `codexcrmapp` project. This plan involves significant restructuring towards a more scalable monorepo architecture, integrating robust backend patterns with tRPC, enhancing security with RLS, and setting up a solid foundation with migrations and testing.

I'll follow the order you provided, explaining each item and giving detailed commands and context based on your current repository state (assuming it's a standard Next.js app currently named `shadcn-supabase-app` at the root) and the target monorepo structure.

**Important Preliminaries:**

1. **Terminal:** Ensure you have a terminal open. When I say "your terminal" or "your `codexcrmapp` terminal," I mean the command-line interface pointing to the root directory of your project repository (`codexcrmapp/`).
2. **Git:** Make sure you commit your current changes before starting this major refactor:
    
    ```bash
    # In your current project directory (likely shadcn-supabase-app)
    git add .
    git commit -m "chore: pre-monorepo refactor commit"
    cd .. # Move one level up from shadcn-supabase-app
    # Now you should be in the directory containing shadcn-supabase-app
    
    ```
    
3. **Tools:** Ensure you have `node`, `npm`/`pnpm` (we'll use `pnpm` for workspaces), and the Supabase CLI installed and logged in (`supabase login`).

---

**Item 1: Protect pages by wrapping layout components with your SupabaseProvider and checking session in a React Server Component.**

- **Explanation:** This is about securing your application routes. Only logged-in users should access certain pages (like `/clients`, `/dashboard`, etc.). In Next.js App Router, the best place to do this is server-side within Server Components (Layouts or Pages) before rendering sensitive content. We use Supabase's server-side helpers (`@supabase/ssr`) to check the user's session. If no valid session exists, we redirect them to the sign-in page. The `SupabaseProvider` is typically used client-side to make the Supabase client instance available via context, but the primary *protection* happens server-side.
- **Detailed Steps:**
    1. **Install Server-Side Helpers:** If you haven't already, you need `@supabase/ssr` for robust server-side session management in Next.js.
        
        ```bash
        # Navigate into your app folder (before the move)
        cd shadcn-supabase-app
        pnpm add @supabase/ssr @supabase/supabase-js
        # Or if you use npm: npm install @supabase/ssr @supabase/supabase-js
        cd .. # Go back to the parent directory
        
        ```
        
        *(After the monorepo setup, you'll run this in `apps/web`)*
        
    2. **Create Auth Helpers (Example):** You likely have Supabase client setup (`lib/supabase/client.ts`, `lib/supabase/server.ts`). Ensure your server client creation uses `createServerClient` from `@supabase/ssr`. Let's assume you create a helper function `lib/auth.ts` (this path will change after the monorepo move).
        
        ```tsx
        // Example: lib/auth.ts (adjust path and implementation based on your setup)
        import { createServerClient, type CookieOptions } from '@supabase/ssr';
        import { cookies } from 'next/headers';
        import { redirect } from 'next/navigation';
        
        export async function getSession() {
          const cookieStore = cookies();
          const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
              cookies: {
                get(name: string) {
                  return cookieStore.get(name)?.value;
                },
              },
            }
          );
          const { data: { session } } = await supabase.auth.getSession();
          return session;
        }
        
        export async function protectPage() {
          const session = await getSession();
          if (!session) {
            redirect('/sign-in'); // Or your login route
          }
          return session; // Return session if needed on the page
        }
        
        ```
        
    3. **Protect a Page (Server Component):** Open a page file you want to protect, for example, `shadcn-supabase-app/app/clients/page.tsx`. At the top of the component function, call your protection logic.
        
        ```tsx
        // Example: shadcn-supabase-app/app/clients/page.tsx
        import { protectPage } from '@/lib/auth'; // Adjust import path
        
        export default async function ClientsPage() {
          const session = await protectPage(); // Checks session and redirects if null
        
          // If the code reaches here, the user is authenticated.
          // Fetch data or render the page content...
          // You can use the 'session' object if needed (e.g., session.user.id)
        
          return (
            <div>
              <h1>Clients Page (Protected)</h1>
              {/* Your client table or components go here */}
            </div>
          );
        }
        
        ```
        
    4. **Protect Layouts:** You can also apply protection to a layout file (e.g., `app/dashboard/layout.tsx`) to protect all routes under that layout. The principle is the same: check the session server-side at the beginning of the Layout Server Component.
    5. **Supabase Provider (Client Context):** Ensure your root layout (`app/layout.tsx`) correctly sets up the client-side context if components need access to the Supabase client interactively (e.g., for real-time subscriptions or client-side mutations, though tRPC often handles mutations). This typically involves creating a client Supabase client and passing it down. The `@supabase/ssr` package often includes examples for this context provider setup as well. The server-side check above handles the *access control*, while the provider handles *client-side interaction*.
- **Note:** After the monorepo move, these file paths will change (e.g., `apps/web/app/clients/page.tsx`, `apps/web/lib/auth.ts`).

---

**Item 2: Turn on RLS from the Supabase dashboard and paste the “Owner can read/write” policy for every table.**

- **Explanation:** Row Level Security (RLS) is a fundamental PostgreSQL feature that Supabase makes easy to manage. It ensures users can only access data rows they are permitted to see, typically based on their user ID. Enabling RLS and adding policies is crucial for multi-tenant applications like a CRM, where each user (practitioner) should only see *their own* clients, sessions, etc. The "Owner can read/write" policy is a common starting point.
- **Prerequisites:** Your tables (`clients`, `services`, `programs`, `sessions`, etc.) **must** have a column that references the user ID, commonly named `user_id` (type `UUID`) and often set up as a foreign key to `auth.users(id)`.
- **Detailed Steps:**
    1. **Go to Supabase Dashboard:** Open your project in the [Supabase Dashboard](https://app.supabase.io/).
    2. **Navigate to Policies:** In the sidebar, go to `Authentication` -> `Policies`.
    3. **Select a Table:** Find one of your data tables (e.g., `clients`) in the list. If RLS is not enabled, it will say "0 policies".
    4. **Enable RLS:** Click on the table name. Toggle the switch "Enable Row Level Security (RLS)".
    5. **Create Policies:** Click "New Policy". You'll typically create policies for `SELECT`, `INSERT`, `UPDATE`, `DELETE`.
        - **Option A: Use Templates (Easiest):**
            - Click "New Policy" -> "Get started quickly".
            - Select the "Enable read access for authenticated users only" template.
                - **Policy Name:** `Allow authenticated read access` (or `Owner can view`)
                - **Target roles:** `authenticated`
                - **USING expression:** `auth.uid() = user_id` (Assuming your user ID column is `user_id`). Review and Save.
            - Click "New Policy" -> "Get started quickly".
            - Select the "Enable insert access for authenticated users only" template.
                - **Policy Name:** `Allow authenticated insert access` (or `Owner can create`)
                - **Target roles:** `authenticated`
                - **WITH CHECK expression:** `auth.uid() = user_id`. Review and Save.
            - Repeat for UPDATE (`Enable update access based on user ID`) and DELETE (`Enable delete access based on user ID`), ensuring the `USING` (for UPDATE/DELETE) and `WITH CHECK` (for UPDATE) expressions are `auth.uid() = user_id`.
        - **Option B: Create Manually:**
            - Click "New Policy" -> "Create a new policy from scratch".
            - **SELECT Policy:**
                - Policy Name: `Owner can SELECT`
                - Allowed operation: `SELECT`
                - Target roles: `authenticated`
                - USING expression: `auth.uid() = user_id`
            - **INSERT Policy:**
                - Policy Name: `Owner can INSERT`
                - Allowed operation: `INSERT`
                - Target roles: `authenticated`
                - WITH CHECK expression: `auth.uid() = user_id`
            - **UPDATE Policy:**
                - Policy Name: `Owner can UPDATE`
                - Allowed operation: `UPDATE`
                - Target roles: `authenticated`
                - USING expression: `auth.uid() = user_id`
                - WITH CHECK expression: `auth.uid() = user_id`
            - **DELETE Policy:**
                - Policy Name: `Owner can DELETE`
                - Allowed operation: `DELETE`
                - Target roles: `authenticated`
                - USING expression: `auth.uid() = user_id`
    6. **Repeat for All Tables:** Repeat steps 3-5 for **every table** that contains user-specific data (`services`, `sessions`, `programs`, `notes`, etc.).
- **Blueprint Context:** This corresponds to Section 3 of the blueprint ("Database & RLS Workflow"). The blueprint also mentions an SQL script (`01_rls.sql`) to automate this, which is a good practice once you move to CLI-managed migrations.

---

**Item 3: Move to the Monorepo Structure.**

- **Explanation:** This is the major restructuring step. You're converting your single Next.js application into a multi-package workspace managed by pnpm. This improves organization, code sharing (UI, types, server logic), and maintainability, especially as the application grows with background jobs and potentially other apps. We'll optionally add Turborepo later for optimized build/dev workflows.
- **Detailed Steps:**
    1. **Navigate:** Ensure your terminal is in the directory *containing* your `shadcn-supabase-app` folder (let's call this parent directory `codexcrmapp-repo` for clarity, though it might just be `codexcrmapp` if that's your repo name).
        
        ```bash
        # Example: if you are inside shadcn-supabase-app
        cd ..
        # Now you are in codexcrmapp-repo/
        
        ```
        
    2. **Create Core Directories:** Create the new top-level folders.
        
        ```bash
        # In codexcrmapp-repo/
        mkdir apps packages
        
        ```
        
        - `mkdir apps packages` creates two new directories named `apps` and `packages`.
    3. **Rename/Move the App:** Move your current Next.js app into `apps/` and rename it to `web`.
        
        ```bash
        # In codexcrmapp-repo/
        mv shadcn-supabase-app apps/web
        
        ```
        
        - `mv` is the 'move' command. It moves the directory `shadcn-supabase-app` to the new location `apps/web`. This effectively renames it as well.
    4. **Create Package Directories:** Create the subdirectories within `packages`.
        
        ```bash
        # In codexcrmapp-repo/
        mkdir -p packages/server packages/db packages/jobs packages/ui
        # The -p flag ensures parent directories are created if needed,
        # and prevents errors if they already exist.
        
        ```
        
    5. **Move `supabase` Directory:** The `supabase` CLI config and migrations should live at the *root* of the repository. If it's currently inside `apps/web` (formerly `shadcn-supabase-app`), move it up.
        
        ```bash
        # In codexcrmapp-repo/
        # Check if supabase/ exists inside apps/web first
        ls apps/web/supabase
        # If it exists, move it:
        mv apps/web/supabase .
        # The '.' means 'current directory', moving it to codexcrmapp-repo/supabase/
        
        ```
        
    6. **Move `.github` Directory:** Similarly, GitHub Actions workflows should be at the root.
        
        ```bash
        # In codexcrmapp-repo/
        # Check if .github/ exists inside apps/web first
        ls apps/web/.github
        # If it exists, move it:
        mv apps/web/.github .
        
        ```
        
    7. **Initialize pnpm Workspace:** Create a `pnpm-workspace.yaml` file at the root (`codexcrmapp-repo/`) to tell pnpm where your packages are.
        
        ```yaml
        # Create and edit codexcrmapp-repo/pnpm-workspace.yaml
        packages:
          - 'apps/*'
          - 'packages/*'
        
        ```
        
        - This tells pnpm that any directory inside `apps/` or `packages/` should be treated as part of the workspace.
    8. **Initialize Packages:** Each directory in `packages/` needs a `package.json` file to be recognized as a package. Navigate into each and initialize or create a basic one.
        
        ```bash
        # In codexcrmapp-repo/
        cd packages/server
        pnpm init # Follow prompts, maybe use name @codexcrm/server
        cd ../db
        pnpm init # Maybe use name @codexcrm/db
        cd ../jobs
        pnpm init # Maybe use name @codexcrm/jobs
        cd ../ui
        pnpm init # Maybe use name @codexcrm/ui
        cd ../.. # Back to codexcrmapp-repo/
        
        ```
        
        - For now, these `package.json` files can be minimal. You'll add dependencies later. Example `packages/server/package.json`:
            
            ```json
            {
              "name": "@codexcrm/server",
              "version": "0.0.1",
              "private": true,
              "main": "src/index.ts", // Adjust as needed
              "types": "src/index.ts", // Adjust as needed
              "scripts": {
                "test": "echo \\"Error: no test specified\\" && exit 1"
              },
              "keywords": [],
              "author": "",
              "license": "ISC"
            }
            
            ```
            
    9. **Configure TypeScript Paths:** To allow easy imports between packages (e.g., `import { db } from '@codexcrm/db'`), configure TypeScript path aliases in a *root* `tsconfig.json`.
        - Create/edit `codexcrmapp-repo/tsconfig.json`:
            
            ```json
            {
              "compilerOptions": {
                // Base options - can be extended by individual packages
                "target": "es2017",
                "lib": ["dom", "dom.iterable", "esnext"],
                "allowJs": true,
                "skipLibCheck": true,
                "strict": true,
                "forceConsistentCasingInFileNames": true,
                "noEmit": true, // Root tsconfig doesn't emit, packages might override
                "esModuleInterop": true,
                "module": "esnext",
                "moduleResolution": "bundler", // Or "node" depending on setup
                "resolveJsonModule": true,
                "isolatedModules": true,
                "jsx": "preserve",
                "incremental": true,
                // Path Aliases for Monorepo
                "baseUrl": ".",
                "paths": {
                  "@codexcrm/server/*": ["packages/server/src/*"],
                  "@codexcrm/db/*": ["packages/db/src/*"],
                  "@codexcrm/jobs/*": ["packages/jobs/*"], // Adjust src/ if needed
                  "@codexcrm/ui/*": ["packages/ui/src/*"],
                  // Add alias for the web app itself if needed for testing/sharing
                  "@codexcrm/web/*": ["apps/web/*"]
                }
              },
              // IMPORTANT: Include/exclude can be minimal here;
              // specific packages handle their own files via extends.
              "include": [],
              "exclude": ["node_modules"]
            }
            
            ```
            
        - **Update App's tsconfig:** Make sure `apps/web/tsconfig.json` *extends* the root config and potentially removes the `baseUrl` and `paths` if they are now inherited correctly:*You might need to adjust the `baseUrl` and `@/*` path depending on where your `src` folder is (or if you use one) inside `apps/web`.*
            
            ```json
            // Example: apps/web/tsconfig.json
            {
              "extends": "../../tsconfig.json", // Extend from the root
              "compilerOptions": {
                // App-specific overrides
                "baseUrl": ".", // Keep baseUrl if needed for app-internal paths like @/components
                "paths": {
                  "@/*": ["./src/*"] // Keep app-specific alias like src -> @/*
                  // No need to repeat monorepo paths if inherited
                },
                "lib": ["dom", "dom.iterable", "esnext"],
                "allowJs": true,
                "skipLibCheck": true,
                // ... other Next.js specific options
                "plugins": [{ "name": "next" }],
                "noEmit": true // Next handles emitting
              },
              "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
              "exclude": ["node_modules"]
            }
            
            ```
            
    10. **Install Dependencies:** Run pnpm install from the root to link everything.
        
        ```bash
        # In codexcrmapp-repo/
        pnpm install
        
        ```
        
    11. **Update Import Paths (The Hard Part):** This is where things get tricky. You need to go through the code in `apps/web` and potentially move shared logic (like DB clients, utility functions, core types) into the appropriate `packages/*` directories. Then, update all import paths.
        - **Example:** If you had `import { supabase } from '../../lib/supabase/client';` inside `apps/web/src/components/SomeComponent.tsx`, and you moved `client.ts` to `packages/db/src/supabaseClient.ts`, the import might become `import { supabase } from '@codexcrm/db/supabaseClient';`.
        - **AI Assistance Prompt:** This is a perfect task for an AI assistant. You can prompt it like this:
            
            > "I have restructured my Next.js project (shadcn-supabase-app moved to apps/web) into a pnpm monorepo with the following structure: apps/web, packages/server, packages/db, packages/jobs, packages/ui. The root tsconfig.json has path aliases like @codexcrm/db/* pointing to packages/db/src/*. Please scan the codebase within apps/web and update all relative import paths that should now point to shared code in packages/* using the new path aliases. For example, update imports for Supabase clients, database types, shared utility functions, etc. Assume I have moved the relevant files to their corresponding packages (e.g., Supabase client setup to packages/db/src, shared types to packages/db/src or packages/server/src)."
            > 
    12. **Turborepo (Optional but Recommended):** Turborepo speeds up tasks like building, testing, and linting across the monorepo.
        
        ```bash
        # In codexcrmapp-repo/
        npx turbo init
        
        ```
        
        - This creates a `turbo.json` file. Configure pipelines as shown in the blueprint:
            
            ```json
            // codexcrmapp-repo/turbo.json
            {
              "$schema": "<https://turbo.build/schema.json>",
              "globalDependencies": ["**/.env.*local"],
              "pipeline": {
                "build": {
                  // Depends on the build task of workspace dependencies (^)
                  "dependsOn": ["^build"],
                  // Define outputs to cache
                  "outputs": [".next/**", "!.next/cache/**", "dist/**"] // Adjust for packages
                },
                "lint": {}, // Add linting tasks
                "dev": {
                  // Don't cache the dev server
                  "cache": false,
                  "persistent": true
                },
                "test": { // Add testing tasks
                   "dependsOn": ["^build"], // Tests might depend on built code
                   "outputs": ["coverage/**"]
                }
              }
            }
            
            ```
            
        - Update `package.json` scripts in the root and/or workspaces to use `turbo run <task>` (e.g., `turbo run build`, `turbo run dev`).

---

**Item 4: How to migrate without pain**

- **Explanation:** This section in your notes overlaps heavily with the Monorepo setup (Item 3) but focuses on specific sub-tasks.
- **Detailed Steps:**
    - **Rename the current folder:** Done in Item 3, Step 3 (`mv shadcn-supabase-app apps/web`).
    - **Tell Next.js where packages live:** Done in Item 3, Step 9 (Root `tsconfig.json` `baseUrl` and `paths`). This allows Next.js (via TypeScript) to resolve imports like `@codexcrm/server`.
    - **Share types:**
        1. **Identify Shared Types:** Locate your Zod schemas, database types (from `supabase gen types` or Drizzle), or any other reusable types/interfaces.
        2. **Move Them:** Move these type definition files into a suitable shared package. Good candidates are:
            - `packages/db/src/types.ts` (for database-related types)
            - `packages/server/src/types.ts` (for API/tRPC related types or shared Zod schemas)
        3. **Export:** Make sure to export the types from the package's entry point (e.g., `packages/db/src/index.ts` might have `export * from './types';`).
        4. **Update Imports:** In `apps/web` and other packages (`packages/jobs`), update imports to use the workspace path, e.g., `import type { Client } from '@codexcrm/db/types';`.
    - **Turborepo (optional):** Done in Item 3, Step 12 (`npx turbo init` and configure `turbo.json`).

---

**Item 5: Folder Responsibilities & Secrets**

- **Explanation:** This clarifies the purpose of each main directory in the new monorepo structure and, crucially, where sensitive information (API keys, secrets) should be handled.
- **Detailed Steps (Summary):**
    - `apps/web`: The Next.js frontend. **Secrets:** Should only contain *public* keys needed by the client-side browser code. Typically `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. These are exposed in the browser's JavaScript bundles. Use environment variables (e.g., `.env.local`, Vercel environment variables) prefixed with `NEXT_PUBLIC_`.
    - `packages/server`: tRPC backend logic (routers, procedures, context). **Secrets:** Needs *server-side only* secrets like `SUPABASE_SERVICE_ROLE_KEY` (to bypass RLS when needed), `OPENAI_API_KEY`, etc. These secrets must *never* be exposed to the client. This code runs only on the server (in Next.js server components, API routes, or server actions). Load these from environment variables *without* the `NEXT_PUBLIC_` prefix.
    - `packages/db`: Database schema definitions (Drizzle), migration logic, potentially generated types. **Secrets:** Generally, no secrets are stored here. Connection strings might be needed for Drizzle Kit commands, often loaded from `.env` during development.
    - `packages/jobs`: Supabase Edge Functions or other background jobs. **Secrets:** Similar to `packages/server`, these often need server-side secrets like `SUPABASE_SERVICE_ROLE_KEY` or third-party API keys. Handle securely via Edge Function secrets management or environment variables depending on the deployment target.
    - `supabase/`: Supabase CLI configuration and SQL migration files. **Secrets:** No secrets stored here. The CLI uses login tokens or environment variables (`SUPABASE_ACCESS_TOKEN`, `SUPABASE_DB_PASSWORD`) for authentication when interacting with your Supabase project.
    - **Management:** Use `.env` files (added to `.gitignore`) for local development. Use the environment variable settings provided by your hosting platform (e.g., Vercel, Netlify, Supabase for Edge Functions) for deployments.

---

*(Continuing in the next response due to length limits)*

Okay, let's pick up where we left off with the remaining implementation items for your `codexcrmapp`.

---

**Item 6: Auth wrapper: in app/layout.tsx fetch serverSession(); redirect if not present.**

- **Explanation:** This seems slightly contradictory to the preferred method outlined in Item 1 (protecting individual pages/layouts). Checking the session directly in the *root* `app/layout.tsx` would protect *every single page* of your application, including public pages like `/sign-in`, `/sign-up`, or a landing page. This is usually not the desired behavior. The approach described in Item 1 (using `protectPage` or similar logic within specific page/layout server components for protected routes) is generally more flexible and recommended.
- **Clarification:** You should apply authentication checks *only* to the layouts and pages that require a logged-in user, not globally in the root layout unless your *entire* application is behind a login wall.
- **Action:** Stick with the approach from **Item 1**, applying protection logic (like the `protectPage` function example) inside the Server Components of specific protected routes (e.g., `apps/web/app/clients/page.tsx`, `apps/web/app/dashboard/layout.tsx`).

---

**Item 7: Contacts page: use useQuery(['contacts']) hooked to clientRouter.list.**

- **Explanation:** This describes how the frontend (`apps/web`) should fetch data for the contacts page. It leverages tRPC (which provides type-safe API communication) and TanStack Query (React Query) for client-side data fetching, caching, and state management. `api.client.list.useQuery()` is the conventional syntax when using the tRPC React Query integration.
- **Prerequisites:**
    - tRPC setup (client and server) is complete.
    - `clientRouter` with a `list` procedure exists in `packages/server`.
    - TanStack Query provider is set up in `apps/web`.
- **Detailed Steps:** (Assuming tRPC and React Query are set up)
    1. **Ensure tRPC Client Setup:** In `apps/web`, you need a file that initializes the tRPC client with React Query integration. This often looks something like:
        
        ```tsx
        // Example: apps/web/src/lib/trpc/client.ts
        import { createTRPCReact } from '@trpc/react-query';
        import type { AppRouter } from '@codexcrm/server/src/root'; // Adjust path
        
        export const api = createTRPCReact<AppRouter>();
        
        ```
        
        And a provider wrapping your app:
        
        ```tsx
        // Example: apps/web/src/providers/TrpcProvider.tsx (or similar)
        'use client'; // This needs to be a client component
        
        import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
        import { httpBatchLink } from '@trpc/client';
        import React, { useState } from 'react';
        import { api } from '@/lib/trpc/client'; // Adjust path
        import SuperJSON from 'superjson'; // Often used with tRPC
        
        export function TrpcProvider({ children }: { children: React.ReactNode }) {
          const [queryClient] = useState(() => new QueryClient());
          const [trpcClient] = useState(() =>
            api.createClient({
              transformer: SuperJSON, // Use SuperJSON if your router uses it
              links: [
                httpBatchLink({
                  url: '/api/trpc', // Your tRPC API endpoint
                }),
              ],
            })
          );
        
          return (
            <api.Provider client={trpcClient} queryClient={queryClient}>
              <QueryClientProvider client={queryClient}>
                {children}
              </QueryClientProvider>
            </api.Provider>
          );
        }
        
        // Wrap your app's root layout with <TrpcProvider>
        // Example: apps/web/app/layout.tsx
        // import { TrpcProvider } from '@/providers/TrpcProvider';
        // ...
        // export default function RootLayout({ children }: ...) {
        //   return (
        //     <html lang="en">
        //       <body>
        //         <TrpcProvider>{children}</TrpcProvider>
        //       </body>
        //     </html>
        //   );
        // }
        
        ```
        
    2. **Use `useQuery` in the Component:** In your contacts page component (`apps/web/app/clients/page.tsx` or a child client component like `apps/web/src/components/ClientTable.tsx`), use the hook. *Important: Data fetching hooks like `useQuery` must be used in Client Components.* You might fetch initial data server-side (Item 1) and then use `useQuery` for updates, or rely entirely on `useQuery` for client-side fetching.
        
        ```tsx
        // Example: apps/web/src/components/ClientList.tsx
        'use client'; // Required for hooks
        
        import { api } from '@/lib/trpc/client'; // Adjust path
        
        export function ClientList() {
          // The query key ['clients', 'list'] is conventional but can be adjusted.
          // tRPC React Query often infers keys, but explicit keys can be useful.
          // The hook arguments might vary slightly based on your tRPC client setup.
          const clientsQuery = api.client.list.useQuery(); // Use the correct path to your procedure
        
          if (clientsQuery.isLoading) {
            return <div>Loading clients...</div>;
          }
        
          if (clientsQuery.error) {
            return <div>Error loading clients: {clientsQuery.error.message}</div>;
          }
        
          if (!clientsQuery.data || clientsQuery.data.length === 0) {
            return <div>No clients found.</div>;
          }
        
          return (
            <ul>
              {clientsQuery.data.map((client) => (
                <li key={client.id}>
                  {client.first_name} {client.last_name} - {client.email}
                </li>
              ))}
            </ul>
          );
        }
        
        // Then, use <ClientList /> in your apps/web/app/clients/page.tsx
        // Example: apps/web/app/clients/page.tsx
        import { protectPage } from '@/lib/auth';
        import { ClientList } from '@/components/ClientList'; // Adjust path
        
        export default async function ClientsPage() {
          await protectPage(); // Protect the page server-side
        
          // You could pass initial data fetched server-side here if desired,
          // but for this example, we let ClientList fetch client-side.
        
          return (
            <div>
              <h1>Clients</h1>
              <ClientList />
            </div>
          );
        }
        
        ```
        

---

**Item 8: Tests: add one Vitest unit test (expect(createClient()).resolves.not.toThrow()) and one Playwright e2e (contacts.spec.ts loads table).**

- **Explanation:** Introduce basic testing to ensure core functionality works and prevent regressions. A unit test checks a small piece of code in isolation (like Supabase client creation), while an end-to-end (E2E) test simulates a real user interacting with the deployed application (signing in, viewing contacts).
- **Detailed Steps:**
    1. **Setup Vitest (Unit Testing):**
        - Install dev dependencies:
            
            ```bash
            # In codexcrmapp-repo/
            pnpm add -D vitest @vitest/ui # Add to the root usually
            # Or install within a specific package if preferred:
            # cd packages/server && pnpm add -D vitest
            # cd ../..
            
            ```
            
        - Configure `vite.config.ts` or `vitest.config.ts` (usually at the root or in the package being tested).
            
            ```tsx
            // Example: vitest.config.ts at the root or in packages/server
            /// <reference types="vitest" />
            import { defineConfig } from 'vitest/config';
            import tsconfigPaths from 'vite-tsconfig-paths'; // If using path aliases
            
            export default defineConfig({
              plugins: [tsconfigPaths()], // If needed for @codexcrm/* imports
              test: {
                globals: true, // Optional: Use globals like describe, it, expect
                environment: 'node', // For backend tests
                // setupFiles: ['./test/setup.ts'], // Optional setup file
              },
            });
            
            ```
            
        - Add test script to `package.json` (e.g., in `packages/server` or root):
            
            ```json
            "scripts": {
              "test": "vitest run",
              "test:watch": "vitest",
              "test:ui": "vitest --ui"
            }
            
            ```
            
        - **Write Unit Test:** Create a test file (e.g., `packages/server/src/supabaseAdmin.test.ts`):
            
            ```tsx
            // Example: packages/server/src/supabaseAdmin.test.ts
            import { describe, it, expect, vi } from 'vitest';
            // Mock environment variables if needed BEFORE importing the module
            vi.stubEnv('SUPABASE_URL', '<http://localhost:54321>');
            vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'mock-service-key');
            
            // Adjust the import path to where your admin client is created
            import { createClient } from '@supabase/supabase-js'; // Or your specific admin client creation function
            
            // Mock the actual createClient function if it makes external calls you want to avoid
            vi.mock('@supabase/supabase-js', () => ({
              createClient: vi.fn().mockReturnValue({
                // Mock Supabase client methods if needed for other tests
                auth: { admin: {} },
                from: vi.fn(() => ({})),
              }),
            }));
            
            // Hypothetical function that creates the admin client
            // In a real scenario, you'd import your actual function
            const getSupabaseAdminClient = async () => {
                 // Assuming this function internally calls createClient
                 // and might do async setup
                const url = process.env.SUPABASE_URL;
                const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
                if (!url || !key) {
                    throw new Error('Supabase creds missing');
                }
                return createClient(url, key);
            };
            
            describe('Supabase Admin Client', () => {
              it('should be created without throwing an error', async () => {
                 // We test our wrapper function 'getSupabaseAdminClient'
                 await expect(getSupabaseAdminClient()).resolves.not.toThrow();
              });
            });
            
            ```
            
        - **Run Test:** `pnpm test` (from the directory with the script).
    2. **Setup Playwright (E2E Testing):**
        - Install Playwright:
            
            ```bash
            # In codexcrmapp-repo/
            pnpm add -D @playwright/test
            npx playwright install # Installs browser binaries
            
            ```
            
        - Playwright usually sets up a `playwright.config.ts` and a `tests` or `e2e` directory at the root. Configure the `baseURL` in `playwright.config.ts` to your local dev server (e.g., `http://localhost:3000`).
            
            ```tsx
            // Example snippet from playwright.config.ts
            import { defineConfig, devices } from '@playwright/test';
            
            export default defineConfig({
              testDir: './e2e', // Or './tests-e2e'
              /* Run tests in files in parallel */
              fullyParallel: true,
              /* Fail the build on CI if you accidentally left test.only in the source code. */
              forbidOnly: !!process.env.CI,
              /* Retry on CI only */
              retries: process.env.CI ? 2 : 0,
              /* Opt out of parallel tests on CI. */
              workers: process.env.CI ? 1 : undefined,
              /* Reporter to use. See <https://playwright.dev/docs/test-reporters> */
              reporter: 'html',
              /* Shared settings for all the projects below. See <https://playwright.dev/docs/api/class-testoptions>. */
              use: {
                /* Base URL to use in actions like `await page.goto('/')`. */
                baseURL: '<http://localhost:3000>', // Your dev server URL
            
                /* Collect trace when retrying the failed test. See <https://playwright.dev/docs/trace-viewer> */
                trace: 'on-first-retry',
              },
              // ... other config like projects
              webServer: { // Optional: command to start dev server before tests
                command: 'pnpm --filter @codexcrm/web dev', // Command to start the Next.js app
                url: '<http://localhost:3000>',
                reuseExistingServer: !process.env.CI,
                stdout: 'pipe',
                stderr: 'pipe',
              },
            });
            
            ```
            
        - Add test script to root `package.json`:
            
            ```json
            "scripts": {
              "test:e2e": "playwright test"
            }
            
            ```
            
        - **Write E2E Test:** Create `e2e/contacts.spec.ts` (or similar):
            
            ```tsx
            // Example: e2e/contacts.spec.ts
            import { test, expect } from '@playwright/test';
            
            test.describe('Contacts Page', () => {
              test.beforeEach(async ({ page }) => {
                // --- Sign In ---
                // Replace with your actual sign-in flow
                await page.goto('/sign-in'); // Go to sign-in page
                await page.locator('input[name="email"]').fill('testuser@example.com'); // Use test user credentials
                await page.locator('input[name="password"]').fill('password123');
                await page.locator('button[type="submit"]').click();
            
                // Wait for navigation to a protected route or dashboard, confirming login
                await expect(page).toHaveURL(/dashboard|clients/); // Adjust expected URL
                // --- End Sign In ---
            
                // Navigate to the contacts page if not already there
                await page.goto('/clients'); // Assuming '/clients' is the contacts route
                 await expect(page).toHaveURL(/clients/);
              });
            
              test('should load the clients table/list', async ({ page }) => {
                // Wait for the main content of the clients page to be visible
                // Adjust the locator to match your actual table or list container
                const clientTable = page.locator('table'); // Or 'ul', 'div[role="list"]' etc.
                await expect(clientTable).toBeVisible({ timeout: 10000 }); // Wait up to 10s
            
                // Optional: Check for specific text indicating data has loaded
                // (assuming at least one client exists for the test user)
                // This depends heavily on your UI structure
                 await expect(page.locator('tbody tr').first()).toBeVisible(); // Check if first row exists
                 // Or check for text within the table/list:
                 // await expect(clientTable).toContainText('Sample Client Name');
              });
            
               // Add more tests: e.g., test adding a client, deleting, etc.
            });
            
            ```
            
        - **Run Test:** Make sure your dev server is running (`pnpm --filter @codexcrm/web dev`). Then run `pnpm test:e2e` from the root.

---

**Item 9: Automated module moves – when you’re ready for the mono‑repo, Codex CLI can bulk‑update import paths.**

- **Explanation:** This refers to using AI-powered code editing tools (like GitHub Copilot Workspace, Cursor with its "Codex CLI" features, or similar agents) to automate the tedious task of updating `import` statements across your codebase after moving files during the monorepo refactoring.
- **Action:** This isn't a command to run but advice. When you move files from `apps/web/src/lib` to `packages/db/src`, instead of manually finding and replacing all imports, you can use your AI tool. Provide it with context about the file moves and the new monorepo structure (including `tsconfig.json` paths) and ask it to update the imports. (See the example prompt under Item 3, Step 11).

---

**Item 10: Shared ESLint config – move your eslint.config.mjs to packages/ so every workspace inherits the same rules.**

- **Explanation:** To ensure consistent code style and quality across all your packages (`web`, `server`, `db`, etc.), you should have a base ESLint configuration that all packages inherit from.
- **Detailed Steps:**
    1. **Create Base Config Package:** You can create a dedicated package for this or place it within an existing shared package (less common). Let's create one:
        
        ```bash
        # In codexcrmapp-repo/
        mkdir packages/eslint-config-custom
        cd packages/eslint-config-custom
        pnpm init -y # Create package.json
        # Create the config file (e.g., index.js or eslint.config.js)
        touch index.js # Or choose your preferred config format
        cd ../..
        
        ```
        
    2. **Define Base Config:** Edit `packages/eslint-config-custom/index.js` (or your chosen file) with your base rules. You might move rules from your current `apps/web/eslint.config.js` here.
        
        ```jsx
        // Example: packages/eslint-config-custom/index.js
        // Use the module format if your project uses ES Modules for config
        /** @type {import('eslint').Linter.Config} */
        module.exports = {
          env: {
            node: true,
            es2022: true,
            browser: true, // Add browser if needed for UI packages
          },
          extends: [
            'eslint:recommended',
            'plugin:@typescript-eslint/recommended',
            'plugin:react/recommended', // Add React/Next specific if needed
            'plugin:react-hooks/recommended',
            // Add 'prettier' if you use it (usually last)
            'prettier',
          ],
          parser: '@typescript-eslint/parser',
          plugins: ['@typescript-eslint'],
          parserOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
          },
          settings: {
            react: { // Configure React version if using react plugin
              version: 'detect',
            },
          },
          rules: {
            // Your base rules here
            'no-unused-vars': 'off', // Use TS version
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            'react/react-in-jsx-scope': 'off', // Not needed with new JSX transform
            // Add other shared rules
          },
          ignorePatterns: [
            // Ignore files globally
            'node_modules/',
            'dist/',
            '.next/',
            'out/',
            'supabase/functions/_shared/edge-runtime-polyfill.js', // Example Supabase ignore
          ],
        };
        
        ```
        
    3. **Update Workspace `package.json`:** Add the custom config as a dev dependency to the packages that need linting.
        
        ```bash
        # In codexcrmapp-repo/
        # Add to web app
        pnpm --filter @codexcrm/web add -D eslint @codexcrm/eslint-config-custom
        
        # Add to server package
        pnpm --filter @codexcrm/server add -D eslint @codexcrm/eslint-config-custom
        
        # ... repeat for other packages (db, jobs, ui)
        
        ```
        
    4. **Configure Package ESLint:** In each package (`apps/web`, `packages/server`, etc.), create or modify its `eslint.config.js` (or `.eslintrc.js`/`.json`) to *extend* the shared config.
        
        ```jsx
        // Example: apps/web/eslint.config.js (or .eslintrc.js)
        /** @type {import('eslint').Linter.Config} */
        module.exports = {
          root: true, // Important: Prevent ESLint from looking further up
          extends: ['@codexcrm/eslint-config-custom', 'next/core-web-vitals'], // Extend shared config AND Next.js specific rules
          // Add any package-specific overrides or rules here
          rules: {
            // Example override for the web app
          },
        };
        
        // Example: packages/server/eslint.config.js (or .eslintrc.js)
        /** @type {import('eslint').Linter.Config} */
        module.exports = {
          root: true,
          extends: ['@codexcrm/eslint-config-custom'], // Just extend shared config
          // Add rules specific to the server environment if needed
          rules: {},
        };
        
        ```
        
    5. **Update Lint Scripts:** Ensure your lint scripts in `package.json` (root or individual packages) run ESLint correctly. Using Turborepo helps manage this.
        
        ```json
        // Example root package.json script using Turbo
        "scripts": {
          "lint": "turbo run lint",
          // ... other scripts
        }
        
        // Example package package.json script (e.g., apps/web/package.json)
        "scripts": {
          "lint": "eslint . --ext .ts,.tsx,.js,.jsx",
          // ... other scripts
        }
        
        ```
        

---

**Item 11: “Zero‑downtime migrations” – adopt Drizzle’s CREATE OR REPLACE VIEW trick so your Edge Functions never break during deploys.**

- **Explanation:** When you deploy database schema changes (migrations) and application code simultaneously, there's a risk that the new code (e.g., an Edge Function) might try to access a table structure that hasn't been updated yet, or vice-versa, causing errors. The "view trick" involves having your application code query a PostgreSQL `VIEW` instead of the underlying table directly. During a migration, you can update the underlying table and then atomically update the view (`CREATE OR REPLACE VIEW`) to point to the new structure, minimizing downtime or inconsistencies. Drizzle ORM can work seamlessly with views.
- **Conceptual Steps:**
    1. **Define Base Table:** Have your main table, e.g., `clients`.
    2. **Create a View:** Create a view that selects from the base table: `CREATE VIEW clients_view AS SELECT id, name, email, user_id FROM clients;`
    3. **Query the View:** In your application code (tRPC routers, Edge Functions using Drizzle), query `clients_view` instead of `clients`.
    4. **Migration:**
        - Start transaction.
        - Modify the base table (`ALTER TABLE clients ADD COLUMN phone_number TEXT;`).
        - Update the view to include the new column: `CREATE OR REPLACE VIEW clients_view AS SELECT id, name, email, user_id, phone_number FROM clients;`
        - Commit transaction.
    5. **Deploy Code:** Deploy the application code that expects the `phone_number` field from `clients_view`.
- **Drizzle Integration:** Drizzle can generate types based on views just like tables. You point Drizzle Kit introspection to your database, and it will pick up the view structure. Your Drizzle queries would then use `db.select().from(clientsView)...` instead of `db.select().from(clients)...`.
- **Action:** This is an advanced technique. Consider implementing it *after* your core features and migrations are stable. For now, focus on standard migrations (Item 12). When you need higher availability, research Drizzle and PostgreSQL views further.

---

*(Continuing in the next response)*

Okay, let's wrap up the remaining items on your implementation list.

---

**Item 12: Apply the DDL in Supabase / Supabase CLI migrations**

- **Explanation:** Instead of making schema changes directly in the Supabase Dashboard UI (which is fine for initial experimentation), it's best practice to manage your database schema using migration files tracked in version control. The Supabase CLI helps you do this. You write your changes in SQL files, test them locally, and then apply them to your staging/production Supabase projects. This ensures consistency and reproducibility. The provided commands initialize the Supabase CLI for your project, optionally reset your local database, create the necessary migration directory structure, copy your initial schema definition into a migration file, and apply it.
- **Prerequisites:**
    - Supabase CLI installed (`npm install -g supabase`) and logged in (`supabase login`).
    - Docker running (Supabase CLI uses Docker for the local development database).
    - Your initial database schema defined in an SQL file (e.g., `Relational-Data-Model.sql`). Let's assume this file is currently at the root of your `codexcrmapp` repository.
- **Detailed Steps:**
    1. **Initialize Supabase CLI (if not done):** Navigate to your *repository root* (`codexcrmapp/`) in your terminal.
        
        ```bash
        # In codexcrmapp/
        supabase init
        
        ```
        
        - This creates the `supabase` directory (if it doesn't exist from the monorepo move) containing config files. It links your local setup to your Supabase project (you might be prompted to select the project).
    2. **(Optional) Reset Local Database:** If you want to start fresh with your local development database managed by the CLI:
        
        ```bash
        # In codexcrmapp/
        supabase db reset
        
        ```
        
        - **Warning:** This command completely wipes the local Docker database containers associated with this project. Do *not* run this against your live/remote database.
    3. **Create Migrations Directory:** Ensure the standard directory exists.
        
        ```bash
        # In codexcrmapp/
        mkdir -p supabase/migrations
        
        ```
        
        - `mkdir -p` creates the `supabase` directory and the `migrations` subdirectory inside it, without error if they already exist.
    4. **Copy Initial Schema:** Copy your existing schema SQL file into the migrations directory. **Crucially, rename it following the convention `YYYYMMDDHHMMSS_description.sql`**. The timestamp prefix is essential for ordering migrations.
        
        ```bash
        # In codexcrmapp/
        # Replace YYYYMMDDHHMMSS with the current timestamp, e.g., 20240521103000
        # Make sure Relational-Data-Model.sql is at the root or adjust the source path
        cp Relational-Data-Model.sql supabase/migrations/20240521103000_initial_schema.sql
        
        ```
        
        - `cp` copies the file. Choose a descriptive name after the timestamp (`initial_schema`).
    5. **Push to Local Shadow DB:** The Supabase CLI uses a "shadow database" (another local Docker container) to validate migrations before applying them to your actual local or remote databases. This step applies the new migration file to the shadow DB.
        
        ```bash
        # In codexcrmapp/
        supabase db push
        
        ```
        
        - This command reads the migration files in `supabase/migrations`, compares them to the state recorded by the CLI, and applies any new ones to the shadow database. It helps catch errors early. *Note:* In older CLI versions, this command might have directly affected the main local DB. The current workflow emphasizes the shadow DB first. If you just ran `db reset`, this effectively *also* applies it to your main local dev database as it's being rebuilt from migrations.
    6. **Commit Migration (Optional but Recommended):** This command is intended for generating *new* migration files based on changes made *directly* to your local development database (e.g., using Supabase Studio locally). However, since you *started* with a full SQL file, the `db push` step is often sufficient for the *initial* setup. If you were making incremental changes locally, you would use `supabase db diff | supabase migration new <migration_name>` or `supabase db commit -m "description"` to capture those changes into a *new* migration file. For this specific workflow (starting with a complete SQL file), you likely don't need `db commit` right now. The key is that your `20240521103000_initial_schema.sql` file is now the source of truth for this migration.
    7. **Applying to Remote (Staging/Production):**
        - **Manual Push:** To apply migrations to your *live* Supabase project:
            
            ```bash
            # In codexcrmapp/
            # Link your project if needed: supabase link --project-ref <your-project-ref>
            supabase db push --linked # Applies to the linked project database
            
            ```
            
            - **Be careful!** This directly modifies your remote database. Ensure you have backups and have tested thoroughly.
        - **Via CI/CD:** Set up GitHub Actions (as mentioned in the blueprint Section 7) to run `supabase db push --linked` automatically when merging to `main` or deploying. This requires setting `SUPABASE_ACCESS_TOKEN` and `SUPABASE_DB_PASSWORD` (if applicable) as secrets in your GitHub repository.

---

**Item 13: Generate type‑safe client code (optional but nice)**

- **Explanation:** Supabase can generate TypeScript definitions directly from your database schema (tables, views, enums, functions). This allows you to write frontend and backend code that uses accurate types for your data, catching errors at compile time instead of runtime.
- **Detailed Steps:**
    1. **Generate Types:** Run the Supabase CLI command. Specify the output path. A good place is within your shared `db` package or a general `lib` folder in `apps/web` if not using a dedicated `db` package yet. Given the monorepo, `packages/db` is ideal.
        
        ```bash
        # In codexcrmapp/
        # Ensure your local Supabase services are running if generating from local DB:
        supabase start # If not already running
        
        # Generate types from the LOCAL database schema and save to packages/db
        supabase gen types typescript --local > packages/db/src/database.types.ts
        # OR generate types from your LINKED remote project:
        # supabase gen types typescript --linked > packages/db/src/database.types.ts
        
        ```
        
        - `supabase gen types typescript` is the core command.
        - `-local` tells it to inspect the schema of your local development database (requires `supabase start` to be running).
        - `-linked` tells it to inspect the schema of the remote Supabase project linked via `supabase link`.
        - `>` redirects the output (the generated TypeScript code) into the specified file (`packages/db/src/database.types.ts`). You might need to create the `src` directory first (`mkdir -p packages/db/src`).
    2. **Use the Types:** Import the generated types in your code (tRPC routers, server components, client components).
        
        ```tsx
        // Example: packages/server/src/routers/client.ts
        import type { Database } from '@codexcrm/db/database.types'; // Import generated types
        import { z } from 'zod';
        import { router, protectedProcedure } from '../trpc';
        import { supabaseAdmin } from '../supabaseAdmin'; // Assume this exists
        
        // Define type alias for convenience
        type Client = Database['public']['Tables']['clients']['Row'];
        
        export const clientRouter = router({
          list: protectedProcedure.query(async ({ ctx }): Promise<Client[]> => { // Use the Client type
            const { data, error } = await supabaseAdmin
              .from('clients')
              .select('*')
              .eq('user_id', ctx.user.id); // ctx.user.id comes from your tRPC context
        
            if (error) {
              console.error("Error fetching clients:", error);
              throw new Error("Failed to fetch clients");
            }
            // data is now typed as Client[] (or potentially null/undefined based on query)
            return data || [];
          }),
          // ... other procedures
        });
        
        ```
        

---

**Item 14: Wire your new tables into tRPC**

- **Explanation:** Now that you have your database schema set up (and potentially generated types), you need to create API endpoints using tRPC to interact with these tables (CRUD operations: Create, Read, Update, Delete). The example shows a `clientRouter` for the `clients` table. You need to replicate this pattern for `services`, `sessions`, `programs`, etc.
- **Detailed Steps:**
    1. **Locate tRPC Routers:** Your tRPC routers should live in `packages/server/src/routers/`. You'll likely have a root router (`packages/server/src/root.ts`) that merges all sub-routers.
    2. **Create Router Files:** For each major data entity, create a new router file (e.g., `packages/server/src/routers/service.ts`, `packages/server/src/routers/program.ts`, `packages/server/src/routers/session.ts`).
    3. **Implement Procedures:** Define procedures within each router using the patterns from the `clientRouter` example. Use `protectedProcedure` to ensure only authenticated users can access them. Use Zod for input validation. Leverage the `supabaseAdmin` client (or a user-context client if RLS is sufficient) to interact with the database.
        
        ```tsx
        // Example: packages/server/src/routers/service.ts
        import type { Database } from '@codexcrm/db/database.types';
        import { z } from 'zod';
        import { router, protectedProcedure } from '../trpc'; // Adjust import paths
        import { supabaseAdmin } from '../supabaseAdmin'; // Adjust import paths
        import { TRPCError } from '@trpc/server';
        
        type Service = Database['public']['Tables']['services']['Row'];
        // Define Zod schema for creating/updating services (match your DB columns)
        const serviceSchema = z.object({
            id: z.string().uuid().optional(), // Optional for creation
            name: z.string().min(1),
            description: z.string().optional().nullable(),
            duration_minutes: z.number().positive(),
            price: z.number().nonnegative(),
            // user_id is added automatically from context
        });
        
        export const serviceRouter = router({
          list: protectedProcedure.query(async ({ ctx }): Promise<Service[]> => {
            const { data, error } = await supabaseAdmin
              .from('services')
              .select('*')
              .eq('user_id', ctx.user.id)
              .order('name'); // Example ordering
        
            if (error) {
              console.error("Error fetching services:", error);
              throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch services' });
            }
            return data || [];
          }),
        
          create: protectedProcedure
            .input(serviceSchema.omit({ id: true })) // Don't expect ID on create
            .mutation(async ({ input, ctx }): Promise<Service> => {
              const { data, error } = await supabaseAdmin
                .from('services')
                .insert({ ...input, user_id: ctx.user.id })
                .select()
                .single(); // Expecting a single row back
        
              if (error) {
                console.error("Error creating service:", error);
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create service' });
              }
               if (!data) {
                   throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create service - no data returned' });
               }
              return data;
            }),
        
           // TODO: Implement update procedure (using input with optional fields, .update(), .match())
           // TODO: Implement delete procedure (.delete(), .match())
        });
        
        ```
        
    4. **Merge Routers:** In your main app router file (`packages/server/src/root.ts`), import and merge the new routers:
        
        ```tsx
        // Example: packages/server/src/root.ts
        import { clientRouter } from './routers/client';
        import { serviceRouter } from './routers/service';
        // Import other routers... programRouter, sessionRouter etc.
        import { createTRPCRouter } from './trpc';
        
        export const appRouter = createTRPCRouter({
          client: clientRouter,
          service: serviceRouter,
          // program: programRouter,
          // session: sessionRouter,
          // ... merge other routers here
        });
        
        // Export type definition of API
        export type AppRouter = typeof appRouter;
        
        ```
        
    5. **Update tRPC Handler:** Ensure your Next.js API route handler (`apps/web/app/api/trpc/[trpc]/route.ts`) imports and uses the main `appRouter`.

---

**Item 15: Protect pages & routes (Server side / tRPC handler)**

- **Explanation:** This reiterates the protection mechanisms. Server-side protection prevents rendering of pages for unauthenticated users. tRPC protection (`protectedProcedure`) ensures API endpoints can only be called by authenticated users.
- **Action:**
    - **Server Side:** Continue applying the `getSession`/`protectPage` pattern from **Item 1** to necessary pages/layouts in `apps/web`.
    - **tRPC:** Consistently use `protectedProcedure` (which should internally check for `ctx.user` or `ctx.session`) for all tRPC procedures that require authentication, as shown in **Item 14**. Ensure your tRPC `createContext` function correctly extracts the user session using `@supabase/ssr` helpers.

---

**Item 16: Add Vitest unit tests for the routers and a Playwright e2e that covers sign‑in + add‑client flow.**

- **Explanation:** This is an extension of **Item 8**. Now that you're adding more tRPC routers (`serviceRouter`, etc.), you should add corresponding unit tests for their procedures (mocking the database interaction). You should also expand your E2E tests to cover more user flows, such as signing in, navigating to the clients page, *adding* a new client via the UI (which will call your `client.create` tRPC mutation), and verifying the client appears in the list.
- **Action:**
    - **Vitest:** Write tests for `serviceRouter`, `programRouter`, etc., in `packages/server/src/routers/`. Mock `supabaseAdmin` calls to test the logic of each procedure (input validation, correct Supabase method called, error handling).
    - **Playwright:** Create new test files or add tests to `e2e/contacts.spec.ts` (or a new `e2e/clients.spec.ts`) that simulate filling out the "Add Client" form, submitting it, and verifying the success notification or the presence of the new client in the table/list.

---

**Item 17: Stub your first tRPC router (clients) and load it in a protected page.**

- **Explanation:** This was effectively covered by **Item 14** (defining `clientRouter`) and **Item 7** (using `api.client.list.useQuery` on the client-side page). It emphasizes getting the first end-to-end flow working: define the backend API (`clientRouter.list`), protect the frontend page (`ClientsPage`), and connect the two using tRPC's React Query hook.
- **Action:** Ensure you have completed the steps outlined in Item 1 (page protection), Item 14 (defining `clientRouter`), and Item 7 (using `useQuery` in the client component). Verify that you can log in, navigate to `/clients`, and see the client list loaded (or a "loading" state followed by the list/empty state).

---

**Item 18: Drizzle ORM – point Drizzle at your live DB; it will introspect these tables and generate type‑safe models you can share with both Edge Functions and the UI.**

- **Explanation:** While you've used `supabase gen types` (Item 13) for basic TS types, Drizzle ORM offers a more powerful way to interact with your database. Drizzle Kit can "introspect" your existing database schema and generate Drizzle schema files (`packages/db/src/schema.ts`). From these schema files, you can write type-safe queries using Drizzle's query builder. These schema definitions and the ORM can be used across your monorepo (`packages/server`, `packages/jobs`, `apps/web` for server actions).
- **Detailed Steps:**
    1. **Install Drizzle:**
        
        ```bash
        # In codexcrmapp/
        # Install ORM and Kit in the db package
        pnpm --filter @codexcrm/db add drizzle-orm pg # Or postgres if using node-postgres directly
        pnpm --filter @codexcrm/db add -D drizzle-kit
        # Install driver in packages that will query db (server, jobs)
        pnpm --filter @codexcrm/server add drizzle-orm pg
        pnpm --filter @codexcrm/jobs add drizzle-orm pg # Assuming jobs use node-postgres compatible driver
        
        ```
        
    2. **Configure Drizzle Kit:** Create a `drizzle.config.ts` file, likely in `packages/db/`.
        
        ```tsx
        // Example: packages/db/drizzle.config.ts
        import type { Config } from 'drizzle-kit';
        import * as dotenv from 'dotenv';
        
        dotenv.config({ path: '../../.env' }); // Load env vars from root .env
        
        if (!process.env.DATABASE_URL) {
          throw new Error('DATABASE_URL environment variable is required');
        }
        
        export default {
          schema: './src/schema.ts', // Path to your Drizzle schema file (will be generated)
          out: './drizzle', // Output directory for migrations (if using Drizzle migrations)
          dialect: 'postgresql', // Or 'mysql', 'sqlite'
          dbCredentials: {
            url: process.env.DATABASE_URL, // Connection string for introspection/migrations
          },
          // Optionally, specify tables to include/exclude
          // tablesFilter: ["!auth*", "!storage*", "!pg_*"], // Example: exclude internal Supabase tables
        } satisfies Config;
        
        ```
        
        - Make sure you have `DATABASE_URL` in your root `.env` file (pointing to your local or remote Supabase DB connection string - find this in Supabase project settings > Database > Connection string). Add `.env` to your `.gitignore`.
    3. **Add Script to `packages/db/package.json`:**
        
        ```json
        "scripts": {
          "db:generate": "drizzle-kit generate", // Generates SQL migrations based on schema changes
          "db:migrate": "node ./src/migrate.js", // Script to apply migrations (you'll create this)
          "db:introspect": "drizzle-kit introspect" // Introspects existing DB to generate schema.ts
        }
        
        ```
        
    4. **Introspect Database:** Run the introspection command from the `packages/db` directory.
        
        ```bash
        # In codexcrmapp/packages/db
        pnpm run db:introspect
        
        ```
        
        - This connects to your `DATABASE_URL`, examines the tables, and generates `packages/db/src/schema.ts` containing Drizzle schema definitions. Review this generated file. It might need minor adjustments, especially around relations or specific types.
    5. **Setup Drizzle Client:** Create a file to initialize the Drizzle client, likely in `packages/db/src/index.ts` or a dedicated file.
        
        ```tsx
        // Example: packages/db/src/drizzleClient.ts
        import { drizzle } from 'drizzle-orm/postgres-js'; // Or /node-postgres if using pg directly
        import postgres from 'postgres'; // The driver
        import * as schema from './schema'; // Import the generated schema
        import * as dotenv from 'dotenv';
        
        dotenv.config({ path: '../../.env' }); // Adjust path if needed
        
        if (!process.env.DATABASE_URL) {
          throw new Error('DATABASE_URL environment variable is required');
        }
        
        // Create the query client
        const queryClient = postgres(process.env.DATABASE_URL);
        // Create the Drizzle instance
        export const db = drizzle(queryClient, { schema }); // Pass schema for typed queries
        export { schema }; // Also export schema for use elsewhere
        
        ```
        
    6. **Use Drizzle in tRPC/Server:** Update your tRPC routers (or other server-side code) to use Drizzle.
        
        ```tsx
        // Example: packages/server/src/routers/client.ts (using Drizzle)
        import { z } from 'zod';
        import { router, protectedProcedure } from '../trpc';
        import { db, schema } from '@codexcrm/db/drizzleClient'; // Import Drizzle db and schema
        import { eq } from 'drizzle-orm'; // Drizzle operators
        import { TRPCError } from '@trpc/server';
        
        export const clientRouter = router({
          list: protectedProcedure.query(async ({ ctx }) => {
            try {
              const clients = await db.query.clients.findMany({ // Use Drizzle query builder
                where: eq(schema.clients.userId, ctx.user.id), // Type-safe condition
              });
              return clients;
            } catch (error) {
              console.error("Error fetching clients with Drizzle:", error);
              throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch clients' });
            }
          }),
        
          create: protectedProcedure
            .input(z.object({ first_name: z.string(), last_name: z.string(), email: z.string().email() }))
            .mutation(async ({ input, ctx }) => {
              try {
                const [newClient] = await db
                  .insert(schema.clients)
                  .values({ ...input, userId: ctx.user.id }) // userId matches schema field name
                  .returning(); // Get the newly inserted client back
                return newClient;
              } catch (error) {
                console.error("Error creating client with Drizzle:", error);
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create client' });
              }
            }),
        });
        
        ```
        
- **Note:** Drizzle also has its own migration system (`drizzle-kit generate` and a migration script). You can choose to use Drizzle's migrations *instead of* Supabase CLI migrations (`supabase db push`), or use them together (e.g., Supabase CLI for initial setup/RLS, Drizzle for table changes). Using one system consistently is usually simpler. Given the blueprint mentions `supabase/migrations` and `pnpm db:generate ⇒ .sql files inside /supabase/migrations/`, it seems to lean towards Supabase CLI migrations initially, with Drizzle primarily used as the ORM based on introspection.

---

**Item 19: Background tasks – Supabase’s new “Scheduled Functions” (or Trigger.dev) can read rows where status='pending' and user_id=auth.uid() without extra work because RLS still applies.**

- **Explanation:** For tasks that shouldn't block the user interface (like sending welcome emails, enriching contact data, processing uploads), you need background jobs. Supabase Edge Functions (which can be scheduled or triggered by database/storage events) are a good fit. The key point here is that if your function runs using a user's JWT (e.g., triggered by an action they took), the RLS policies you set up earlier will *automatically* apply, ensuring the function only accesses data that specific user is allowed to see. If the function needs broader access (e.g., an admin task or using a service role key), RLS won't apply if you use the `supabaseAdmin` client.
- **Action:**
    1. **Identify Background Tasks:** List the tasks suitable for background execution (e.g., contact enrichment after creation, transcription of uploaded notes).
    2. **Choose Trigger:** Decide how each task is triggered (Database Webhook on insert/update, Storage event, Scheduled timer, direct HTTPS call).
    3. **Develop Edge Function:** Create functions within `packages/jobs/` (or `supabase/functions/` if not using the packages structure for functions). Use Deno/TypeScript.
    4. **Implement Logic:** Write the function logic. Import types/schemas from `packages/db` if needed. Use the Supabase client (either user-context or admin based on needs).
    5. **Deploy Function:** Deploy using the Supabase CLI: `supabase functions deploy <function-name>`.
    6. **Configure Trigger:** Set up the trigger in the Supabase Dashboard (Database -> Webhooks, or Functions -> Select Function -> Schedule/Event Trigger).
    7. **Consider Alternatives:** Explore tools like [Trigger.dev](https://trigger.dev/) if you need more complex workflow orchestration or prefer their developer experience over vanilla Edge Functions.

---

This covers all the items listed. Remember to commit your changes frequently, especially after major steps like the monorepo refactor or adding significant features like Drizzle or tRPC routers. Good luck!