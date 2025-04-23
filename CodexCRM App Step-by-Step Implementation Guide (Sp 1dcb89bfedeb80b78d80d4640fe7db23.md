# CodexCRM App: Step-by-Step Implementation Guide (Sprint 1 Focus)

---

This guide provides detailed instructions for setting up the `codexcrmapp` monorepo, configuring authentication and database access, implementing the first feature (Clients), and adding basic tests. Follow these steps sequentially.

**Phase 0: Prerequisites & Initial Setup**

Make sure you have the necessary tools installed and your current code is saved.

1. **Check System Tools:**
    - **Goal:** Ensure your development machine has Node.js, pnpm, and the Supabase CLI installed.
    - **Action:** Open your terminal and run the following commands to check versions. If any are missing, install them.
        
        ```bash
        node -v
        pnpm -v   # If missing: npm install -g pnpm
        supabase -v # If missing: npm install -g supabase
        
        ```
        
    - **Log in to Supabase CLI:** Ensure you're authenticated with Supabase.
        
        ```bash
        supabase login
        
        ```
        
2. **Commit Current Code:**
    - **Goal:** Save the current state of your project before making major structural changes.
    - **Action:** Navigate *inside* your existing project folder (likely `shadcn-supabase-app`) and commit.
        
        ```bash
        # Make sure you are inside the shadcn-supabase-app directory
        git add .
        git commit -m "chore: pre-monorepo refactor commit"
        
        ```
        
3. **Navigate to Repository Root:**
    - **Goal:** Position your terminal in the parent directory (`codexcrmapp`) to perform actions *on* the project folder.
    - **Action:** Move one level up from your project folder.
        
        ```bash
        cd ..
        # Your terminal should now be in the 'codexcrmapp' directory,
        # which contains the 'shadcn-supabase-app' folder.
        
        ```
        

---

**Phase 1: Monorepo Structure & Configuration**

Establish the core multi-package workspace structure.

1. **Initialize Monorepo Directory Structure:**
    - **Goal:** Create the standard `apps` and `packages` directories and move your existing Next.js app into `apps/web`. Also, set up the initial directories for shared packages.
    - **Action:** Run these commands from the `codexcrmapp` root directory:
        
        ```bash
        # Create top-level folders
        mkdir apps packages
        
        # Move and rename your existing Next.js app
        mv shadcn-supabase-app apps/web
        
        # Create standard package directories
        mkdir -p packages/server packages/db packages/jobs packages/ui
        
        ```
        
2. **Relocate Root-Level Configuration:**
    - **Goal:** Ensure configuration specific to Supabase CLI and GitHub Actions resides at the repository root, not within the `apps/web` package.
    - **Action:** Check if `supabase` or `.github` directories exist within `apps/web`. If so, move them to the `codexcrmapp` root. Run these from the root:
        
        ```bash
        # Check if apps/web/supabase exists, if yes, move it:
        [ -d apps/web/supabase ] && mv apps/web/supabase .
        
        # Check if apps/web/.github exists, if yes, move it:
        [ -d apps/web/.github ] && mv apps/web/.github .
        
        ```
        
        - `[ -d path ]` checks if a directory exists. `&&` runs the next command only if the check is true. `.` refers to the current directory (the root).
3. **Define pnpm Workspace:**
    - **Goal:** Tell pnpm which directories contain the packages belonging to the monorepo workspace.
    - **Action:** Create a file named `pnpm-workspace.yaml` in the `codexcrmapp` root directory with the following content:
        
        ```yaml
        # pnpm-workspace.yaml
        packages:
          - 'apps/*'
          - 'packages/*'
        
        ```
        
4. **Initialize Individual Packages:**
    - **Goal:** Create a `package.json` file in each of the new directories within `packages/` so pnpm recognizes them as distinct packages.
    - **Action:** Run the following commands from the `codexcrmapp` root directory. The `y` flag accepts default settings for `pnpm init`.
        
        ```bash
        cd packages/server && pnpm init -y && cd ../..
        cd packages/db && pnpm init -y && cd ../..
        cd packages/jobs && pnpm init -y && cd ../..
        cd packages/ui && pnpm init -y && cd ../..
        
        ```
        
        - *(Review the generated `package.json` files later to adjust names (e.g., `@codexcrm/server`), entry points (`main`, `types`), etc., as needed.)*
5. **Understand Folder Responsibilities & Secrets:**
    - **Goal:** Internalize the purpose of each new directory and where sensitive information (API keys) should be managed.
    - **Context:**
        - `apps/web`: Next.js UI. **Secrets:** Only *public* keys (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`). Loaded via `.env*` files prefixed with `NEXT_PUBLIC_` or Vercel public env vars.
        - `packages/server`: tRPC backend logic. **Secrets:** *Server-side only* keys (`SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`). Loaded via non-prefixed env vars (NEVER expose these to the client).
        - `packages/db`: Drizzle schema, migrations, DB types. **Secrets:** Generally none, except maybe `DATABASE_URL` in `.env` for local Drizzle Kit commands.
        - `packages/jobs`: Supabase Edge Functions. **Secrets:** Server-side keys, managed via Edge Function secrets or env vars.
        - `supabase/`: Supabase CLI config, SQL migrations. **Secrets:** None directly in files. CLI uses login tokens or env vars like `SUPABASE_ACCESS_TOKEN`.
    - **Action:** Create a `.gitignore` file at the `codexcrmapp` root (if one doesn't exist) and ensure it includes lines like:
        
        ```
        # Environment variables
        .env
        .env.*
        !.env.example
        
        # Node
        node_modules/
        dist/
        .next/
        out/
        
        # IDE / OS files
        .DS_Store
        *.code-workspace
        .vscode/
        
        ```
        
6. **Configure TypeScript Path Aliases:**
    - **Goal:** Enable convenient and type-safe imports between monorepo packages (e.g., `import { db } from '@codexcrm/db'`).
    - **Action:**
        1. Create/edit the **root** `tsconfig.json` (`codexcrmapp/tsconfig.json`) with base settings and path aliases:
            
            ```json
            // codexcrmapp/tsconfig.json
            {
              "compilerOptions": {
                "target": "es2017",
                "lib": ["dom", "dom.iterable", "esnext"],
                "allowJs": true,
                "skipLibCheck": true,
                "strict": true,
                "forceConsistentCasingInFileNames": true,
                "noEmit": true, // Root tsconfig usually doesn't emit
                "esModuleInterop": true,
                "module": "esnext",
                "moduleResolution": "bundler",
                "resolveJsonModule": true,
                "isolatedModules": true,
                "jsx": "preserve",
                "incremental": true,
                // Path Aliases
                "baseUrl": ".",
                "paths": {
                  // Adjust '/src/' part if your packages don't use a 'src' subfolder
                  "@codexcrm/server/*": ["packages/server/src/*"],
                  "@codexcrm/db/*": ["packages/db/src/*"],
                  "@codexcrm/jobs/*": ["packages/jobs/*"], // May not have src/
                  "@codexcrm/ui/*": ["packages/ui/src/*"],
                  "@codexcrm/web/*": ["apps/web/*"] // Alias for the app itself
                }
              },
              "include": [], // Keep minimal; packages manage their own files
              "exclude": ["node_modules", "dist"]
            }
            
            ```
            
        2. Modify the **app's** tsconfig (`apps/web/tsconfig.json`) to extend the root config and keep its app-specific settings:
            
            ```json
            // apps/web/tsconfig.json
            {
              // Extend the root configuration
              "extends": "../../tsconfig.json",
              "compilerOptions": {
                // App-specific options override or add to the base
                "baseUrl": ".", // Keep if using "@/*" alias below
                "paths": {
                   // Keep app-internal aliases like src -> @/*
                  "@/*": ["./src/*"] // Adjust if you don't use a src folder in apps/web
                },
                "lib": ["dom", "dom.iterable", "esnext"],
                "allowJs": true,
                "skipLibCheck": true,
                "noEmit": true, // Next.js handles emitting
                "module": "esnext", // Ensure compatibility with Next.js
                // ... other Next.js specific options like plugins
                "plugins": [{ "name": "next" }]
              },
              // Include files specific to the Next.js app
              "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", "src/**/*.ts", "src/**/*.tsx"], // Be specific
              "exclude": ["node_modules"]
            }
            
            ```
            
7. **Install Dependencies & Link Workspace:**
    - **Goal:** Install all dependencies listed in the `package.json` files across the workspace (`apps/web`, `packages/*`) and link the local packages together according to the `pnpm-workspace.yaml` definition.
    - **Action:** Run the following command from the `codexcrmapp` root directory:
        
        ```bash
        pnpm install
        
        ```
        
        - This command reads all `package.json` files, downloads necessary dependencies into a shared root `node_modules` folder, and creates symlinks so that imports like `@codexcrm/db` correctly resolve to your local `packages/db` code.
8. **Update Import Paths (Iterative Task):**
    - **Goal:** Fix broken imports within `apps/web` (and potentially other packages later) that previously used relative paths to access code now located in one of the `packages/*` directories.
    - **Action:** This requires code analysis.
        1. **Identify Shared Code:** Look through `apps/web` (especially `lib/`, `utils/`, `components/` if they contain non-UI logic) for code that should be shared (e.g., Supabase client setup, core data types, utility functions).
        2. **Move Files:** Move these identified files to the appropriate package directory (e.g., DB client setup to `packages/db/src`, shared types perhaps to `packages/db/src` or `packages/server/src`, utility functions to `packages/ui/src` or a new `packages/utils`). Remember to create `src` subdirectories if needed and defined in your `tsconfig.json` paths.
        3. **Update Imports:** Go through the files in `apps/web` (and any files you moved) and update `import` statements. Replace relative paths (`../../lib/db`) with the new workspace aliases (`@codexcrm/db`).
        4. **AI Assistance Tip:** Use an AI code assistant (like GitHub Copilot Workspace, Cursor) with a prompt similar to this:
            
            > "I have restructured my project into a pnpm monorepo. Files previously in apps/web/lib/supabase are now in packages/db/src/supabase, and shared types from apps/web/types are in packages/db/src/types. My root tsconfig.json defines path aliases like @codexcrm/db/* pointing to packages/db/src/*. Please scan the apps/web directory and update all relative import paths that should now use these @codexcrm/* aliases."
            > 
    - **Note:** This can be time-consuming. Focus on fixing imports related to the features you're implementing first (like Supabase clients for auth). You might need to revisit this as you move more code. Run `pnpm tsc --noEmit` (possibly via `turbo run typecheck`) frequently to catch type errors caused by incorrect paths.
9. **(Optional but Recommended) Implement Shared ESLint Config:**
    - **Goal:** Ensure consistent code style and quality across all packages.
    - **Action:**
        1. Create the shared config package:
            
            ```bash
            # Run from codexcrmapp root
            mkdir packages/eslint-config-custom
            cd packages/eslint-config-custom
            pnpm init -y
            # Create config file (e.g., index.js or eslint.config.js)
            touch index.js
            # Add base rules (copy/adapt from apps/web's old config)
            # Example content for index.js (CommonJS format):
            # module.exports = { extends: ['eslint:recommended', ...], rules: {...} };
            cd ../..
            
            ```
            
        2. Add as dev dependency to workspaces:
            
            ```bash
            pnpm --filter @codexcrm/web add -D eslint @codexcrm/eslint-config-custom
            pnpm --filter @codexcrm/server add -D eslint @codexcrm/eslint-config-custom
            # ... repeat for db, jobs, ui if linting them
            
            ```
            
        3. Configure individual package ESLint files (e.g., `apps/web/eslint.config.js`) to extend the shared config:
            
            ```jsx
            // Example: apps/web/eslint.config.js
            module.exports = {
              root: true,
              extends: ['@codexcrm/eslint-config-custom', 'next/core-web-vitals'],
              // Add web-specific overrides here
            };
            
            ```
            
        4. Add `lint` scripts to relevant `package.json` files (e.g., `"lint": "eslint . --ext .ts,.tsx"`).

---

**Phase 2: Database Setup & Access**

Configure the database schema using Supabase CLI and set up data access patterns.

1. **Initialize Supabase CLI & First Migration:**
    - **Goal:** Set up Supabase CLI to manage the database schema via version-controlled SQL files. Create the first migration file from your existing schema definition.
    - **Action:** Run from the `codexcrmapp` root:
        
        ```bash
        # Initialize CLI for the project (if not done during structure setup)
        # This creates/updates the supabase/ directory
        supabase init
        
        # Ensure migrations directory exists
        mkdir -p supabase/migrations
        
        # Copy your schema SQL file (replace timestamp and filename)
        # Make sure 'Relational-Data-Model.sql' exists at the root or provide correct path
        cp Relational-Data-Model.sql supabase/migrations/20240521103000_initial_schema.sql
        
        # (Optional but recommended) Start local Supabase services if testing locally
        supabase start
        
        # Apply migration to local shadow DB for validation
        supabase db push
        
        ```
        
        - **Important:** The `YYYYMMDDHHMMSS` timestamp prefix in the migration filename is crucial for ordering. Use a current timestamp.
        - `supabase db push` validates the SQL against a temporary "shadow" database. If you ran `supabase start`, it likely also applies it to your main local development DB.
2. **Enable RLS and Apply Owner Policies:**
    - **Goal:** Secure data tables so users can only access their own records.
    - **Action:**
        1. **Verify `user_id` Column:** Ensure every table storing user-specific data (`clients`, `services`, `sessions`, etc.) has a `user_id UUID` column, ideally linked via foreign key to `auth.users(id)`. Add this in your `initial_schema.sql` migration file if missing. Rerun `supabase db reset` (if local) and `supabase db push` after editing the migration file.
        2. **Configure in Supabase Dashboard:** Go to your project dashboard at [app.supabase.io](https://app.supabase.io/).
        3. Navigate to `Authentication` -> `Policies`.
        4. For **each** relevant table (e.g., `clients`, `services`, etc.):
            - Click the table name.
            - Toggle **"Enable Row Level Security (RLS)"** ON.
            - Click **"New Policy"**.
            - Use the **templates** ("Get started quickly") or create manually:
                - **Read Access:** Policy for `SELECT`, `USING expression: auth.uid() = user_id`, Target roles: `authenticated`.
                - **Insert Access:** Policy for `INSERT`, `WITH CHECK expression: auth.uid() = user_id`, Target roles: `authenticated`.
                - **Update Access:** Policy for `UPDATE`, `USING expression: auth.uid() = user_id`, `WITH CHECK expression: auth.uid() = user_id`, Target roles: `authenticated`.
                - **Delete Access:** Policy for `DELETE`, `USING expression: auth.uid() = user_id`, Target roles: `authenticated`.
            - Save each policy. Repeat for all user-data tables.
3. **Generate Supabase TypeScript Types:**
    - **Goal:** Create TypeScript definitions from your database schema for use in backend and frontend code, enabling type safety.
    - **Action:** Run from the `codexcrmapp` root:
        
        ```bash
        # Ensure local Supabase is running (supabase start) if generating from local
        supabase gen types typescript --local > packages/db/src/database.types.ts
        
        # OR generate from your linked remote project:
        # supabase link --project-ref <your-project-ref> # If not linked
        # supabase gen types typescript --linked > packages/db/src/database.types.ts
        
        ```
        
        - This creates the `database.types.ts` file inside `packages/db/src/`. You'll import from this file later (e.g., `import type { Database } from '@codexcrm/db/database.types';`). Make sure the `src` directory exists (`mkdir -p packages/db/src`).

---

**Phase 3: API Layer (tRPC Backend)**

Build the backend API endpoints using tRPC.

1. **Setup tRPC Core (`packages/server`):**
    - **Goal:** Establish the tRPC router foundation, context creation, and reusable procedures (especially for authentication checks).
    - **Action:**
        1. Install tRPC dependencies:
            
            ```bash
            # Run from codexcrmapp root
            pnpm --filter @codexcrm/server add @trpc/server zod
            pnpm --filter @codexcrm/web add @trpc/client @trpc/server @trpc/react-query @trpc/next superjson # Add zod if web needs it too
            
            ```
            
        2. Create `packages/server/src/trpc.ts`:
            
            ```tsx
            // packages/server/src/trpc.ts
            import { initTRPC, TRPCError } from '@trpc/server';
            import superjson from 'superjson'; // Optional: for richer data types
            import type { createContext } from './context'; // We'll create this next
            
            const t = initTRPC.context<typeof createContext>().create({
              transformer: superjson, // Optional
              errorFormatter({ shape }) {
                return shape;
              },
            });
            
            // Base router and procedure helpers
            export const router = t.router;
            export const publicProcedure = t.procedure;
            
            // Middleware to check for authenticated user
            const isAuthenticated = t.middleware(async ({ ctx, next }) => {
              if (!ctx.user) { // Check for user object from context
                throw new TRPCError({ code: 'UNAUTHORIZED' });
              }
              return next({
                ctx: {
                  // Infers the `user` as non-nullable
                  user: ctx.user,
                  session: ctx.session, // Pass session along too if needed
                  supabaseAdmin: ctx.supabaseAdmin, // Pass admin client
                },
              });
            });
            
            // Protected procedure helper
            export const protectedProcedure = t.procedure.use(isAuthenticated);
            
            ```
            
        3. Create `packages/server/src/supabaseAdmin.ts` (Example):
            
            ```tsx
            // packages/server/src/supabaseAdmin.ts
            import { createClient } from '@supabase/supabase-js';
            import * as dotenv from 'dotenv';
            
            dotenv.config({ path: '../../.env' }); // Load from root .env
            
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
            
            if (!supabaseUrl || !supabaseServiceRoleKey) {
              throw new Error('Supabase URL or Service Role Key is missing in environment variables.');
            }
            
            // Create a single supabase admin client for use in server-side logic
            export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
              auth: {
                // Important for admin client
                autoRefreshToken: false,
                persistSession: false,
              },
            });
            
            ```
            
        4. Create `packages/server/src/context.ts`:
            
            ```tsx
            // packages/server/src/context.ts
            import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
            import { createServerClient } from '@supabase/ssr';
            import { type User, type Session } from '@supabase/supabase-js';
            import { supabaseAdmin } from './supabaseAdmin'; // Import the admin client
            
            // Define the shape of the context object
            interface Context {
              user: User | null;
              session: Session | null;
              supabaseAdmin: typeof supabaseAdmin; // Include the admin client type
            }
            
            export async function createContext({
              req,
              resHeaders,
            }: FetchCreateContextFnOptions): Promise<Context> {
              // Create a Supabase client for the current request using cookies
              // Note: This assumes using the Fetch adapter. Adjust if using NextRouteHandler adapter context.
              const supabase = createServerClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                {
                  cookies: {
                    // A way to parse cookies from the request headers
                    get(key) {
                        const cookieHeader = req.headers.get('cookie');
                        if (!cookieHeader) return undefined;
                        const cookies = require('cookie').parse(cookieHeader);
                        return cookies[key];
                    },
                  },
                }
              );
            
              const { data: { user } } = await supabase.auth.getUser();
              const { data: { session } } = await supabase.auth.getSession();
            
              return {
                user,
                session,
                supabaseAdmin, // Provide the admin client in context
              };
            }
            
            ```
            
2. **Implement First tRPC Router (`clientRouter`):**
    - **Goal:** Create the API endpoints for listing and creating clients.
    - **Action:**
        1. Create `packages/server/src/routers/client.ts`:
            
            ```tsx
            // packages/server/src/routers/client.ts
            import { z } from 'zod';
            import { router, protectedProcedure } from '../trpc';
            import { supabaseAdmin } from '../supabaseAdmin'; // Use admin client for now
            import type { Database } from '@codexcrm/db/database.types'; // Import generated types
            import { TRPCError } from '@trpc/server';
            
            // Define convenient type alias using generated types
            type Client = Database['public']['Tables']['clients']['Row'];
            // Define Zod schema for input validation (adjust fields as needed)
            const clientInputSchema = z.object({
                first_name: z.string().min(1),
                last_name: z.string().min(1),
                email: z.string().email(),
                // Add other fields from your 'clients' table schema here
            });
            
            export const clientRouter = router({
              list: protectedProcedure.query(async ({ ctx }): Promise<Client[]> => {
                // ctx.user is guaranteed non-null due to protectedProcedure
                const { data, error } = await ctx.supabaseAdmin // Use admin client from context
                  .from('clients')
                  .select('*')
                  .eq('user_id', ctx.user.id); // Filter by the authenticated user's ID
            
                if (error) {
                  console.error("Error fetching clients:", error);
                  throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch clients' });
                }
                return data || [];
              }),
            
              create: protectedProcedure
                .input(clientInputSchema) // Validate input against the Zod schema
                .mutation(async ({ input, ctx }): Promise<Client> => {
                  const { data, error } = await ctx.supabaseAdmin
                    .from('clients')
                    .insert({
                      ...input, // Spread validated input fields
                      user_id: ctx.user.id, // Set owner ID from context
                    })
                    .select() // Select the newly created row
                    .single(); // Expect only one row back
            
                  if (error) {
                    console.error("Error creating client:", error);
                    // Provide more specific error messages if possible (e.g., duplicate email)
                    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create client' });
                  }
                   if (!data) {
                       throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Client creation failed unexpectedly.' });
                   }
                  return data;
                }),
            
                // Add update/delete procedures later...
            });
            
            ```
            
        2. Create/Update the main app router `packages/server/src/root.ts`:
            
            ```tsx
            // packages/server/src/root.ts
            import { clientRouter } from './routers/client';
            // import other routers later...
            import { router } from './trpc';
            
            export const appRouter = router({
              client: clientRouter,
              // service: serviceRouter, // Add later
            });
            
            // Export type definition of API
            export type AppRouter = typeof appRouter;
            
            ```
            

---

**Phase 4: Frontend Integration (`apps/web`)**

Connect the Next.js UI to the tRPC backend and implement authentication flow.

1. **Install Frontend Dependencies (including `@supabase/ssr`):**
    - **Goal:** Ensure the Next.js app has the necessary libraries for tRPC client, React Query, and server-side session management.
    - **Action:** Run from the `codexcrmapp` root:
        
        ```bash
        # Ensure these were added in step 16, add ssr now
        pnpm --filter @codexcrm/web add @supabase/ssr @supabase/supabase-js @tanstack/react-query react-query
        
        ```
        
2. **Setup tRPC Client & React Query Provider:**
    - **Goal:** Configure the tRPC client for the frontend and wrap the app in providers for tRPC and React Query.
    - **Action:**
        1. Create `apps/web/src/lib/trpc/client.ts`:
            
            ```tsx
            // apps/web/src/lib/trpc/client.ts
            import { createTRPCReact } from '@trpc/react-query';
            // Adjust path based on your actual root router export location
            import type { AppRouter } from '@codexcrm/server/src/root';
            
            export const api = createTRPCReact<AppRouter>();
            
            ```
            
        2. Create `apps/web/src/providers/TrpcProvider.tsx`:
            
            ```tsx
            // apps/web/src/providers/TrpcProvider.tsx
            'use client'; // Needs to be a Client Component
            
            import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
            import { httpBatchLink } from '@trpc/client';
            import React, { useState } from 'react';
            import { api } from '@/lib/trpc/client'; // Use the alias
            import superjson from 'superjson'; // Ensure this matches backend transformer
            
            // Function to get base URL (works client-side)
            function getBaseUrl() {
              if (typeof window !== 'undefined') return ''; // Browser should use relative path
              if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // Vercel
              return `http://localhost:${process.env.PORT ?? 3000}`; // Assume localhost
            }
            
            export function TrpcProvider({ children }: { children: React.ReactNode }) {
              const [queryClient] = useState(() => new QueryClient());
              const [trpcClient] = useState(() =>
                api.createClient({
                  transformer: superjson, // Use the same transformer as backend
                  links: [
                    httpBatchLink({
                      url: `${getBaseUrl()}/api/trpc`, // Construct the full URL
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
            
            ```
            
        3. Wrap your root layout (`apps/web/app/layout.tsx`) with the provider:
            
            ```tsx
            // apps/web/app/layout.tsx
            import { TrpcProvider } from '@/providers/TrpcProvider'; // Adjust import path
            import './globals.css'; // Your global styles
            
            export default function RootLayout({
              children,
            }: {
              children: React.ReactNode;
            }) {
              return (
                <html lang="en">
                  <body>
                    <TrpcProvider>{children}</TrpcProvider>
                  </body>
                </html>
              );
            }
            
            ```
            
3. **Implement Authentication Helpers (`apps/web`):**
    - **Goal:** Create server-side helper functions within the Next.js app to check the user's session and redirect if necessary.
    - **Action:** Create `apps/web/src/lib/auth/actions.ts` (or similar path):
        
        ```tsx
        // apps/web/src/lib/auth/actions.ts
        'use server'; // Indicate this runs only on the server
        
        import { createServerClient, type CookieOptions } from '@supabase/ssr';
        import { cookies } from 'next/headers';
        import { redirect } from 'next/navigation';
        import { type User, type Session } from '@supabase/supabase-js';
        
        // Helper function to create a server client for Route Handlers or Server Actions
        export function createSupabaseServerClient() {
            const cookieStore = cookies();
            return createServerClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                {
                    cookies: {
                        get(name: string) {
                            return cookieStore.get(name)?.value;
                        },
                        set(name: string, value: string, options: CookieOptions) {
                            cookieStore.set({ name, value, ...options });
                        },
                        remove(name: string, options: CookieOptions) {
                            cookieStore.delete({ name, ...options });
                        },
                    },
                }
            );
        }
        
        export async function getSession(): Promise<{ session: Session | null; user: User | null }> {
          const supabase = createSupabaseServerClient();
          try {
            const { data: { session }, } = await supabase.auth.getSession();
            const { data: { user }, } = await supabase.auth.getUser();
            return { session, user };
          } catch (error) {
            console.error('Error getting session:', error);
            return { session: null, user: null };
          }
        }
        
        export async function protectPage(): Promise<{ session: Session; user: User }> {
            const { session, user } = await getSession();
        
            if (!session || !user) {
                redirect('/sign-in'); // Or your specific login route
            }
        
            // If we reach here, session and user are guaranteed to be non-null
            return { session, user };
        }
        
        ```
        
4. **Implement Page/Layout Protection:**
    - **Goal:** Secure specific pages or layouts so they are only accessible to logged-in users.
    - **Action:** In any Server Component page or layout that requires authentication:
        
        ```tsx
        // Example: apps/web/app/clients/page.tsx
        import { protectPage } from '@/lib/auth/actions'; // Adjust import path
        // Import client components needed for the page
        import { ClientList } from '@/components/ClientList'; // Example component
        
        export default async function ClientsPage() {
          // This runs first on the server. If no session, it redirects.
          const { user } = await protectPage();
        
          // If code execution reaches here, the user is authenticated.
          // You can use the 'user' object if needed (e.g., pass user.id to components)
        
          console.log(`Rendering clients page for user: ${user.id}`);
        
          return (
            <div>
              <h1>Your Clients</h1>
              {/* Render client components */}
              <ClientList /> {/* This component will fetch data client-side */}
            </div>
          );
        }
        
        ```
        
        - Apply this pattern to other protected routes like `/dashboard`, `/services`, etc., or their parent layouts.
5. **Implement Client Page Data Fetching:**
    - **Goal:** Use the tRPC hook within a Client Component to fetch and display the list of clients.
    - **Action:** Create the Client Component (e.g., `apps/web/src/components/ClientList.tsx`):
        
        ```tsx
        // apps/web/src/components/ClientList.tsx
        'use client'; // Mark as a Client Component
        
        import { api } from '@/lib/trpc/client'; // Import the tRPC api client
        
        export function ClientList() {
          // Use the 'list' procedure from the 'client' router
          const clientsQuery = api.client.list.useQuery();
        
          if (clientsQuery.isLoading) {
            return <div>Loading clients...</div>;
          }
        
          if (clientsQuery.error) {
            // Displaying the actual error message can be helpful during development
            return <div>Error loading clients: {clientsQuery.error.message}</div>;
          }
        
          if (!clientsQuery.data || clientsQuery.data.length === 0) {
            return <div>You haven't added any clients yet.</div>;
          }
        
          // Render the data
          return (
            <ul>
              {clientsQuery.data.map((client) => (
                // Make sure your client object has these properties!
                <li key={client.id}>
                  {client.first_name} {client.last_name} - {client.email}
                </li>
              ))}
            </ul>
          );
        }
        
        ```
        
        - Ensure this `<ClientList />` component is used within the protected `ClientsPage` Server Component (as shown in Step 21).
6. **Setup tRPC API Route Handler (`apps/web`):**
    - **Goal:** Create the Next.js API route that receives frontend tRPC requests and routes them to the backend `appRouter`.
    - **Action:** Create the file `apps/web/app/api/trpc/[trpc]/route.ts`:
        
        ```tsx
        // apps/web/app/api/trpc/[trpc]/route.ts
        import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
        import { type NextRequest } from 'next/server';
        
        import { appRouter } from '@codexcrm/server/src/root'; // Import the root router
        import { createContext } from '@codexcrm/server/src/context'; // Import context creator
        
        const handler = (req: NextRequest) =>
          fetchRequestHandler({
            endpoint: '/api/trpc',
            req,
            router: appRouter,
            createContext: () => createContext({ req, resHeaders: new Headers() }), // Pass request to context
            onError:
              process.env.NODE_ENV === 'development'
                ? ({ path, error }) => {
                    console.error(
                      `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`,
                      error, // Log the full error in development
                    );
                  }
                : undefined,
          });
        
        export { handler as GET, handler as POST };
        
        ```
        

---

**Phase 5: Testing**

Add initial tests to verify core functionality.

1. **Add Initial Unit Test (Vitest):**
    - **Goal:** Create a simple backend unit test.
    - **Action:**
        1. Install Vitest: `pnpm add -D vitest @vitest/ui` (run from root).
        2. Configure `vitest.config.ts` (e.g., in `packages/server` or root).
        3. Add test script to `packages/server/package.json`: `"test": "vitest run"`.
        4. Create test file (e.g., `packages/server/src/supabaseAdmin.test.ts`):
            
            ```tsx
            // packages/server/src/supabaseAdmin.test.ts
            import { describe, it, expect, vi } from 'vitest';
            
            // Mock env vars *before* importing the module that uses them
            vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '<http://test-url.com>');
            vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'test-service-key');
            
            // Mock the actual 'createClient' function from Supabase library
            vi.mock('@supabase/supabase-js', () => ({
              createClient: vi.fn().mockReturnValue({ /* mock client methods if needed */ }),
            }));
            
            // Import the module *after* mocks/stubs are set up
            const { supabaseAdmin } = await import('./supabaseAdmin');
            
            describe('Supabase Admin Client', () => {
              it('should attempt to create a client without throwing during module load', () => {
                // The test primarily checks if the import and setup worked
                expect(supabaseAdmin).toBeDefined();
                // You can also check if createClient was called (due to the mock)
                const { createClient } = await import('@supabase/supabase-js');
                expect(createClient).toHaveBeenCalledWith(
                   '<http://test-url.com>',
                   'test-service-key',
                   expect.any(Object) // Check options if necessary
                );
              });
            });
            
            ```
            
        5. Run from root: `pnpm --filter @codexcrm/server test`.
2. **Add Initial E2E Test (Playwright):**
    - **Goal:** Verify the user sign-in flow and that the clients page loads data.
    - **Action:**
        1. Install Playwright: `pnpm add -D @playwright/test && npx playwright install` (run from root).
        2. Configure `playwright.config.ts` at the root (set `baseURL`, `webServer` command like `pnpm --filter @codexcrm/web dev`).
        3. Add script to root `package.json`: `"test:e2e": "playwright test"`.
        4. Create `e2e/auth.spec.ts`:
            
            ```tsx
            // e2e/auth.spec.ts
            import { test, expect } from '@playwright/test';
            
            test('should allow user to sign in and view clients page', async ({ page }) => {
              // Sign In
              await page.goto('/sign-in');
              await page.locator('input[name="email"]').fill('test@example.com'); // Use valid test user
              await page.locator('input[name="password"]').fill('password123');   // Use valid password
              await page.locator('button[type="submit"]').click();
            
              // Wait for navigation to a protected route (e.g., clients page)
              await expect(page).toHaveURL('/clients', { timeout: 10000 }); // Adjust URL if needed
            
              // Verify clients page content loads
              // Adjust locator based on your ClientList component's output
              // Option 1: Check for the list container
              // await expect(page.locator('ul')).toBeVisible();
              // Option 2: Check for text indicative of loading/data/empty state
               await expect(page.locator('body')).toContainText(/Loading clients|haven't added any clients|test@example.com/i, { timeout: 15000 }); // Wait longer for data fetch
            });
            
            ```
            
        5. Run tests (make sure dev server is running): `pnpm test:e2e` (from root).

---

**Phase 6: Optional & Next Steps**

These items can be tackled after the core structure is working or in later sprints.

1. **(Optional/Later) Add Turborepo:**
    - Run `npx turbo init` and configure `turbo.json`.
2. **(Optional/Later) Integrate Drizzle ORM:**
    - Follow steps for installing Drizzle, introspecting the DB, setting up the client, and refactoring tRPC routers (details in previous responses / `TODO.md`).
3. **(Optional/Later) Zero-Downtime Migrations:**
    - Implement the `CREATE OR REPLACE VIEW` strategy if high availability during deployments becomes critical.
4. **(Optional/Later) Background Tasks:**
    - Set up Supabase Edge Functions (`packages/jobs` or `supabase/functions`) for asynchronous work triggered by DB events, schedules, or webhooks.

---

This detailed, sequential guide should provide a clearer path for implementing the initial phase of your application. Remember to commit your changes frequently after completing each significant step. Good luck!

Excellent! Progress! The "No projects matched" error is gone, which means `pnpm` now recognizes `apps/web` correctly thanks to its `package.json`.

Now we're seeing **build errors**, which is actually the next expected step after major restructuring. These errors tell us exactly where the code needs fixing. They are all `Module not found` errors, meaning the `import` paths in those files are pointing to locations that no longer exist or are incorrect in the new monorepo structure.

Let's break down the errors and fix them:

**Error 1: `./app/sign-in/page.tsx` -> `Module not found: Can't resolve '@/lib/supabase/client'`**

- **Problem:** The `sign-in` page is trying to import something using the alias `@/lib/supabase/client`. In our new structure, Supabase client setup (especially shared setup or types) should ideally live in `packages/db` or potentially `packages/server`. The old `lib/` directory structure within `apps/web` might not exist anymore or the client file was moved.
- **Solution:**
    1. **Locate Supabase Client:** Find where you actually placed your Supabase client creation logic. Based on the plan, it might be intended for `packages/db/src/supabaseClient.ts` or similar. You might also have separate client/server setups.
    2. **Update Import Path:** Open `apps/web/app/sign-in/page.tsx`. Find the line `import ... from '@/lib/supabase/client'`. Change the path to correctly point to the *new* location using the monorepo alias.
        - If client setup is in `packages/db/src/supabaseClient.ts`: `import { supabase } from '@codexcrm/db/supabaseClient';` (Adjust `supabaseClient` and the exported name `supabase` if needed).
        - If you still have a client-specific setup *within* `apps/web` (e.g., for use in Client Components, maybe `apps/web/src/lib/supabase/client.ts`), ensure that path is correct relative to the `baseUrl` in `apps/web/tsconfig.json`. The `@/*` alias usually points to `apps/web/src/*`. So, check if `apps/web/src/lib/supabase/client.ts` exists. If it does, the import *might* be correct, suggesting a `tsconfig.json` path issue or the file is missing. If the file *should* be there according to your copied code, make sure it was copied correctly.

**Error 2 & 3: `./app/api/trpc/route.ts` -> `Module not found: Can't resolve '../../../../packages/server/routers/client'` and `Can't resolve '../../../../packages/server/trpc'`**

- **Problem:** Your tRPC API route handler in `apps/web` is using extremely deep relative paths (`../../../../`) to try and find files inside `packages/server`. This is fragile and incorrect for a monorepo setup with path aliases.
- **Solution:**
    1. **Use Path Aliases:** We set up path aliases specifically to avoid these kinds of relative imports.
    2. **Update Import Paths:** Open `apps/web/app/api/trpc/[trpc]/route.ts`.
        - Change `import { clientRouter } from '../../../../packages/server/routers/client'` (or similar import for the main `appRouter`) to use the alias:
            
            ```tsx
            // Import the main AppRouter
            import { appRouter } from '@codexcrm/server/src/root';
            
            ```
            
        - Change `import { createTRPCContext } from '../../../../packages/server/trpc'` (or similar import for your context function) to use the alias:
            
            ```tsx
            // Import the context creation function
            import { createContext } from '@codexcrm/server/src/context';
            
            ```
            
        - **Verify `tsconfig.json`:** Double-check your **root** `codexcrmapp/tsconfig.json`. Ensure the `paths` entry for `@codexcrm/server/*` points correctly to `packages/server/src/*`.
            
            ```json
            // codexcrmapp/tsconfig.json (snippet)
            "paths": {
              "@codexcrm/server/*": ["packages/server/src/*"], // Make sure 'src' is correct
              // ... other paths
            }
            
            ```
            
        - **Verify Exports:** Make sure `packages/server/src/root.ts` actually exports `appRouter` and `packages/server/src/context.ts` exports `createContext`.

**Action Steps:**

1. Modify the import paths in the three files mentioned (`apps/web/app/sign-in/page.tsx` and `apps/web/app/api/trpc/[trpc]/route.ts`) using the `@codexcrm/*` path aliases or the correct `@/*` alias if the file is within `apps/web/src`.
2. Double-check that the files you are importing (e.g., `packages/server/src/root.ts`, `packages/server/src/context.ts`) actually exist and export the things you are trying to import.
3. After saving the changes, run the build command again from the root: `pnpm --filter @codexcrm/web build`.

Let me know if you encounter new errors or if these fixes work! We'll tackle them one by one.