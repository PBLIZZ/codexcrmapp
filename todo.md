# CodexCRM App - Sprint 1 TODO List

> **DEPRECATED:** This TODO list has been superseded by [Sprint1-Status.md](./Sprint1-Status.md), which contains the most up-to-date information about the project status and remaining tasks for Sprint 1. Please refer to Sprint1-Status.md for current development priorities.

This document outlines the essential tasks for Sprint 1, based on the detailed implementation guide. It focuses on setting up the monorepo structure, core authentication, database integration with RLS, the first API endpoint (clients), and basic testing. Tasks are ordered logically within each section.

> **UPDATE (2025-04-23)**: tRPC integration issues have been fixed. See `tRPC-Integration-Notes.md` for details.

---

## Repository Root & Setup

These tasks establish the foundational structure and tooling for the entire project.

### 1. Initialize Monorepo Structure

*   **Goal:** Transition from a single Next.js app to an organized multi-package monorepo for better scalability and code sharing.
*   **Solution:**
    1.  Ensure you are in the parent directory containing `shadcn-supabase-app`.
    2.  Create `apps` and `packages` directories (`mkdir apps packages`).
    3.  Move the current app: `mv shadcn-supabase-app apps/web`.
    4.  Create package subdirectories: `mkdir -p packages/server packages/db packages/jobs packages/ui`.
    5.  Move `supabase/` and `.github/` directories from `apps/web` (if present) to the repository root (`mv apps/web/supabase .`, `mv apps/web/.github .`).
    6.  Create `pnpm-workspace.yaml` at the root defining `apps/*` and `packages/*`.
    7.  Initialize each package with `pnpm init` (e.g., `cd packages/server && pnpm init`).
    8.  Run `pnpm install` at the root.

### 2. Configure TypeScript Paths

*   **Goal:** Enable easy and type-safe imports between packages in the monorepo (e.g., `@codexcrm/db`).
*   **Solution:**
    1.  Create/edit the root `tsconfig.json`. Set `"baseUrl": "."` and define `"paths"` mapping aliases like `@codexcrm/server/*` to `packages/server/src/*`, `@codexcrm/db/*` to `packages/db/src/*`, etc.
    2.  Ensure `apps/web/tsconfig.json` `extends` the root `tsconfig.json` (`"extends": "../../tsconfig.json"`) and maintains its specific aliases like `@/*`.

### 3. Update Import Paths

*   **Goal:** After restructuring, update all internal project imports to use the new relative paths or the TypeScript path aliases.
*   **Solution:** Manually review files in `apps/web` and move shared logic (types, Supabase clients, utils) to appropriate `packages/*` locations. Update `import` statements accordingly (e.g., `../lib/utils` might become `@codexcrm/ui/utils`). *Tip: Use AI code assistant prompts to help automate this bulk update.*

### 4. Implement Shared ESLint Configuration

*   **Goal:** Enforce consistent code style and quality across all workspaces (`apps/web`, `packages/server`, etc.).
*   **Solution:**
    1.  Create a shared config package (e.g., `packages/eslint-config-custom`).
    2.  Define base ESLint rules in the shared package's config file (e.g., `index.js`).
    3.  Add the shared config as a dev dependency to other packages (`pnpm --filter <package_name> add -D @codexcrm/eslint-config-custom`).
    4.  In each package's ESLint config (e.g., `apps/web/eslint.config.js`), set `root: true` and `extends: ['@codexcrm/eslint-config-custom', ...]`, adding package-specific rules/plugins (like `next/core-web-vitals` for `apps/web`).

### 5. (Optional) Add Turborepo

*   **Goal:** Optimize build, development, and task execution across the monorepo.
*   **Solution:**
    1.  Run `npx turbo init` at the root.
    2.  Configure `turbo.json` pipelines for `build`, `dev`, `lint`, `test` as per the blueprint example, defining dependencies (`dependsOn`) and outputs.
    3.  Update root/package scripts to use `turbo run <task>`.

---

## `supabase/` & Database Infrastructure

Tasks related to Supabase project configuration and schema management via the CLI.

### 6. Initialize Supabase CLI & Migrations

*   **Goal:** Manage the database schema using version-controlled SQL migration files instead of direct UI changes, ensuring consistency and reproducibility.
*   **Solution:**
    1.  Navigate to the repository root.
    2.  Run `supabase init` (if not already done).
    3.  Ensure the `supabase/migrations` directory exists (`mkdir -p supabase/migrations`).
    4.  Copy your initial schema SQL file (e.g., `Relational-Data-Model.sql`) into the migrations directory, renaming it with a timestamp prefix (e.g., `cp Relational-Data-Model.sql supabase/migrations/YYYYMMDDHHMMSS_initial_schema.sql`).
    5.  Push the migration to the local shadow database for validation: `supabase db push`.
    6.  *(Later)* Apply migrations to the linked remote database using `supabase db push --linked` or via CI/CD.

### 7. Enable RLS and Apply Owner Policies

*   **Goal:** Secure application data by ensuring users can only access their own data rows within the database tables.
*   **Solution:**
    1.  Ensure all data tables (`clients`, `services`, `sessions`, etc.) have a `user_id UUID` column referencing `auth.users(id)`.
    2.  In the Supabase Dashboard: Navigate to `Authentication` -> `Policies`. For *every* data table:
        *   Toggle "Enable Row Level Security (RLS)".
        *   Create policies (using templates or manually) for SELECT, INSERT, UPDATE, DELETE.
        *   Set `Target roles` to `authenticated`.
        *   Use the expression `auth.uid() = user_id` for both `USING` (read/delete/update check) and `WITH CHECK` (write/update check) conditions.
    3.  *(Later: Consider automating this with an SQL script like `01_rls.sql` within `supabase/migrations`)*.

---

## `packages/db` (Database Access Layer)

Tasks for setting up data types and potentially the ORM.

### 8. Generate Supabase TypeScript Types

*   **Goal:** Provide compile-time type safety when interacting with the database schema from TypeScript code (tRPC, frontend).
*   **Solution:**
    1.  Ensure Supabase local dev environment is running (`supabase start`) or linked to remote.
    2.  Run the command from the root: `supabase gen types typescript --local > packages/db/src/database.types.ts` (or use `--linked` for remote schema).
    3.  Use these generated types (e.g., `import type { Database } from '@codexcrm/db/database.types';`) in server-side code.

### 9. (Optional/Later) Integrate Drizzle ORM

*   **Goal:** Use a type-safe ORM (Drizzle) for more expressive and safe database querying, leveraging the existing schema.
*   **Solution:**
    1.  Install `drizzle-orm`, `drizzle-kit`, and a driver (`pg` or `postgres`) in `packages/db` and relevant consuming packages (`packages/server`).
    2.  Create `packages/db/drizzle.config.ts` pointing to your `DATABASE_URL` (via `.env`) and schema file path.
    3.  Run `pnpm --filter @codexcrm/db run db:introspect` to generate `packages/db/src/schema.ts` from your existing database.
    4.  Set up a Drizzle client instance in `packages/db` (e.g., `packages/db/src/drizzleClient.ts`).
    5.  Refactor backend code (tRPC routers) to use the Drizzle client and query builder (`db.query...`, `db.insert...`).

---

## `packages/server` (API Layer)

Tasks for building the tRPC backend.

### 10. Setup tRPC Core & Context

*   **Goal:** Establish the tRPC router foundation and a context creation function that provides necessary data (like user session) to procedures.
*   **Solution:**
    1.  Install tRPC dependencies (`@trpc/server`, `@trpc/client`, `@trpc/react-query`, `@trpc/next`, `zod`, `superjson`) in `packages/server` and `apps/web`.
    2.  In `packages/server/src/trpc.ts`, define `initTRPC`, create reusable `router`, `publicProcedure`, and `protectedProcedure` helpers. The `protectedProcedure` should use a middleware to check for an authenticated user in the context.
    3.  Implement the `createContext` function (used by the Next.js handler) which uses Supabase server-side helpers (`@supabase/ssr`) to get the session/user and potentially creates an admin Supabase client (`supabaseAdmin`). Inject these into the returned context object (e.g., `{ user, session, supabaseAdmin }`).

### 11. Implement `clientRouter` (CRUD Stub)

*   **Goal:** Create the first set of API endpoints for managing `client` data, following tRPC best practices.
*   **Solution:**
    1.  Create `packages/server/src/routers/client.ts`.
    2.  Import `router`, `protectedProcedure` from `../trpc`, Zod (`z`), generated DB types (`database.types.ts`), and the `supabaseAdmin` client (or Drizzle `db`).
    3.  Define the `clientRouter` using `router({...})`.
    4.  Implement the `list` procedure: a `protectedProcedure.query` that fetches clients matching `ctx.user.id` from the database. Use generated types for the return value.
    5.  Implement the `create` procedure: a `protectedProcedure.input(z.object({...})).mutation` that validates input using Zod, inserts a new client record with the `user_id` from `ctx.user.id`, and returns the created client.
    6.  *(Stub `update` and `delete` procedures for later implementation)*.
    7.  Merge `clientRouter` into the main `appRouter` in `packages/server/src/root.ts`.

### 12. Implement First tRPC Router (`clientRouter`) 

*   **Goal:** Create the API endpoints for listing and creating clients.
*   **Solution:**
    1.  Create `packages/server/src/routers/client.ts` with `list` and `upsert` procedures. 
    2.  Add the router to `packages/server/src/root.ts`. 
    3.  Implement input validation using Zod. 
    4.  Use `protectedProcedure` to ensure only authenticated users can access the endpoints. 
    5.  Add public procedures for testing during development. 

---

## `apps/web` (Frontend UI)

Tasks related to the Next.js application, user interface, and data display.

### 12. Implement Page/Layout Protection

*   **Goal:** Ensure only authenticated users can access specific routes (e.g., `/clients`, `/dashboard`).
*   **Solution:**
    1.  Create an auth helper function (e.g., `apps/web/src/lib/auth/actions.ts` or similar) containing `getSession` (using `@supabase/ssr`) and `protectPage` which calls `getSession` and redirects (`next/navigation redirect`) to `/sign-in` if no session exists.
    2.  In Server Components for protected pages (e.g., `apps/web/app/clients/page.tsx`) or layouts (`apps/web/app/dashboard/layout.tsx`), call `await protectPage()` at the beginning of the component function.

### 13. Setup tRPC Client & React Query Provider 

*   **Goal:** Configure the tRPC client for the frontend and wrap the app in providers for tRPC and React Query.
*   **Solution:**
    1.  Create `apps/web/src/lib/trpc/client.ts` to initialize the tRPC client with the correct router type. 
    2.  Create `apps/web/app/providers.tsx` to set up React Query and tRPC providers. 
    3.  Update `apps/web/app/layout.tsx` to wrap the app with these providers. 
    4.  Add the tRPC API route at `apps/web/app/api/trpc/[trpc]/route.ts`. 
    5.  Configure compatible versions of tRPC v10 and TanStack Query v4. 

### 14. Implement Client Page Data Fetching

*   **Goal:** Display the list of clients on the `/clients` page using the tRPC API.
*   **Solution:**
    1.  Create a Client Component (e.g., `apps/web/src/components/ClientList.tsx`).
    2.  Inside this component, use the tRPC hook: `const clientsQuery = api.client.list.useQuery();`.
    3.  Handle loading (`clientsQuery.isLoading`), error (`clientsQuery.error`), and success states, rendering the list of clients from `clientsQuery.data`.
    4.  Use this `<ClientList />` component within the protected server component page (`apps/web/app/clients/page.tsx`).

### 15. Setup tRPC API Route Handler

*   **Goal:** Create the Next.js API route that listens for incoming tRPC requests and forwards them to the `appRouter`.
*   **Solution:**
    1.  Create the file `apps/web/app/api/trpc/[trpc]/route.ts`.
    2.  Import `fetchRequestHandler` from `@trpc/server/adapters/fetch` (or `createNextRouteHandler` if using that adapter).
    3.  Import the `appRouter` from `@codexcrm/server/src/root` and the `createContext` function.
    4.  Export the handler function, configuring it with the router, context, and endpoint path. Ensure GET and POST methods are handled.

---

## Testing

Implement basic tests to ensure core functionality and prevent regressions.

### 16. Add Initial Unit Test (Vitest)

*   **Goal:** Verify a small, isolated piece of backend logic, like the Supabase admin client creation.
*   **Solution:**
    1.  Install `vitest` as a dev dependency (`pnpm add -D vitest`). Configure `vitest.config.ts`.
    2.  Add a `test` script to `package.json` (e.g., in `packages/server`).
    3.  Create a test file (e.g., `packages/server/src/supabaseAdmin.test.ts`).
    4.  Write a test using `describe`, `it`, `expect` that checks if calling the function responsible for creating the Supabase admin client resolves without throwing errors. Use `vi.stubEnv` to mock environment variables if necessary.

### 17. Add Initial E2E Test (Playwright)

*   **Goal:** Simulate a real user flow to verify critical paths like sign-in and viewing core data.
*   **Solution:**
    1.  Install `@playwright/test` (`pnpm add -D @playwright/test`) and browser binaries (`npx playwright install`).
    2.  Configure `playwright.config.ts` (set `baseURL`, potentially `webServer` command to start the dev server).
    3.  Add a `test:e2e` script to the root `package.json`.
    4.  Create an E2E test file (e.g., `e2e/clients.spec.ts`).
    5.  Write a test using `test` and `expect` that:
        *   Navigates to the sign-in page (`page.goto('/sign-in')`).
        *   Fills login credentials (`page.locator(...).fill(...)`) and clicks submit.
        *   Waits for successful navigation to a protected route (`expect(page).toHaveURL(...)`).
        *   Navigates to the clients page (`page.goto('/clients')`).
        *   Asserts that the client table/list container is visible (`expect(page.locator('table')).toBeVisible()`).

---