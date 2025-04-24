# tRPC Integration Summary (CodexCRM)

This document summarizes the final working configuration for tRPC integration within the CodexCRM monorepo project.

## Core Setup & Configuration

1.  **tRPC Version:** v10.43.6
2.  **TanStack Query Version:** v4.36.1 (for compatibility with tRPC v10)
3.  **Monorepo Structure:**
    *   tRPC server logic resides in `packages/server`.
    *   Frontend app consuming tRPC is `apps/web`.
4.  **Path Aliases:**
    *   Cross-package imports **must** use `@codexcrm/*` aliases (e.g., `@codexcrm/server/src/root`). Configured in root `tsconfig.json`.
    *   Intra-app imports in `apps/web` use `@/*` alias. Configured in `apps/web/tsconfig.json`.
5.  **Server Package (`packages/server`):**
    *   `package.json` name: `@codexcrm/server`.
    *   Core files:
        *   `src/trpc.ts`: Initializes tRPC (`initTRPC`), defines base `router`, `publicProcedure`, and `protectedProcedure` (with auth middleware).
        *   `src/context.ts`: Defines `createContext` function using `@supabase/ssr`'s `createServerClient` to handle request-specific context, including user session retrieval and providing the `supabaseAdmin` client.
        *   `src/supabaseAdmin.ts`: Initializes the Supabase admin client using `SUPABASE_SERVICE_ROLE_KEY`.
        *   `src/root.ts`: Defines the main `appRouter` by merging individual routers (like `clientRouter`). Exports `AppRouter` type.
        *   `src/routers/`: Contains individual feature routers (e.g., `client.ts`).
        *   `src/index.ts`: Re-exports key modules (`root`, `context`, `trpc`) for easier importing.
6.  **Router Naming:**
    *   Feature routers are named descriptively (e.g., `clientRouter` for client operations).
    *   In the `appRouter`, routers are mounted under pluralized names (e.g., `clients: clientRouter`) to avoid naming collisions with tRPC client internals.
7.  **Frontend Setup (`apps/web`):**
    *   Dependencies: `@trpc/client`, `@trpc/react-query`, `@trpc/next`, `@tanstack/react-query`, `@supabase/ssr`, `superjson`.
    *   `src/lib/trpc/client.ts`: Creates the tRPC React client (`api = createTRPCReact<AppRouter>()`).
    *   `src/providers/TrpcProvider.tsx`: Client Component (`'use client'`) wrapping the app with `QueryClientProvider` and `api.Provider`. Configures `httpBatchLink` pointing to `/api/trpc` and uses `superjson` transformer.
    *   `app/api/trpc/[trpc]/route.ts`: Next.js App Router route handler using `fetchRequestHandler`. Imports `appRouter` and `createContext` from `@codexcrm/server/src/*`. Handles GET/POST requests.
8.  **Authentication:**
    *   `protectedProcedure` in `packages/server/src/trpc.ts` uses middleware to check `ctx.user`. Throws `UNAUTHORIZED` if no user.
    *   Server Components in `apps/web` use helper functions (like `protectPage` in `src/lib/auth/actions.ts`) leveraging `@supabase/ssr` to check sessions server-side before rendering.
    *   Client Components use tRPC hooks (e.g., `api.clients.list.useQuery()`) which automatically handle auth state changes via the context established in the API route handler.
9.  **Data Fetching (Client Components):**
    *   Use `api.routerName.procedureName.useQuery()` or `useMutation()` hooks.
    *   Example: `const { data, isLoading } = api.clients.list.useQuery();`
    *   Mutations use `onSuccess` callbacks with `utils.clients.list.refetch()` (preferred over `invalidateQueries` due to past type issues).
10. **Build Configuration:**
    *   The `apps/web/next.config.mjs` previously included `typescript: { ignoreBuildErrors: true }` and `eslint: { ignoreDuringBuilds: true }` to bypass temporary issues. These should ideally be removed once all type errors are resolved.

## Key Fixes Applied Previously

*   Corrected import paths to use `@codexcrm/server/src/*`.
*   Added `@codexcrm/server` as a `workspace:*` dependency to `apps/web`.
*   Renamed router mount point from `client` to `clients`.
*   Ensured compatible versions of tRPC (v10) and TanStack Query (v4).

## Next Steps / Considerations

1.  **Implement Remaining CRUD:** Add `update` and `delete` procedures to `clientRouter`.
2.  **Refine Error Handling:** Enhance error reporting/handling in tRPC procedures and frontend components.
3.  **Testing:** Add comprehensive unit/integration tests for tRPC routers and procedures.
4.  **Remove Build Ignores:** Resolve any remaining TypeScript/ESLint errors to remove `ignoreBuildErrors` and `ignoreDuringBuilds` from `next.config.mjs`.
