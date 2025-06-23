# Dependency Audit Report

Generated: $(date)

## Current vs Required Versions

| Package               | Current | Required | Action  | Risk   |
| --------------------- | ------- | -------- | ------- | ------ |
| react                 | 19.1.0  | ^19.0.2  | Verify  | Low    |
| next                  | 14.0.4  | 15.3.1   | Upgrade | High   |
| @supabase/ssr         | 0.6.1   | ^0.6.1   | Verify  | Low    |
| @tanstack/react-query | 4.32.6  | ^5.7.0   | Upgrade | High   |
| @trpc/client          | 10.44.1 | ^11.0.0  | Upgrade | High   |
| @trpc/server          | 10.44.1 | ^11.0.0  | Upgrade | High   |
| @trpc/react-query     | 10.44.1 | ^11.0.0  | Upgrade | High   |
| zod                   | 3.22.4  | ^4.0.0   | Upgrade | Medium |

## Breaking Changes to Address

### React 19 Changes:

- [x] Already on React 19.1.0, compatible with requirements
- [ ] Adopt `use()` hook for data fetching in dynamic routes (e.g., `contacts/[contactId]/edit/page.tsx`)
- [ ] Implement `useFormStatus` in auth forms (login, signup) for improved loading states
- [ ] Add `useActionState` to contact forms and other mutation-heavy components
- [ ] Integrate `useOptimistic` for contact and client operations (instant UI feedback)
- [ ] Convert class-based error boundaries to React 19 patterns
- [ ] Use `useTransition` in AppSidebarController for non-blocking navigation
- [ ] Ensure proper Suspense boundaries around data-fetching components

### Next.js 15 Changes:

- [ ] Migrate from Next.js 14.0.4 to 15.3.1
- [ ] Update metadata API usage in app/layout.tsx
- [ ] Review server component implementation patterns for App Router compliance
- [ ] Verify route handler implementations in app/api/trpc/[trpc]/route.ts
- [ ] Use route groups for better organization (already partially implemented)
- [ ] Enable turbopack in development mode for faster refresh
- [ ] Update next.config.mjs for Next.js 15 compatibility
- [ ] Remove `ignoreBuildErrors` and `ignoreDuringBuilds` settings (fix underlying issues)
- [ ] Update image component usages for Next.js 15 optimization features

### TanStack Query v5 Changes:

- [ ] Update from v4.32.6 to ^5.7.0 (major version with breaking changes)
- [ ] Convert all `useQuery` calls to object parameter format in client components
- [ ] Update QueryClient provider setup in apps/web/src/providers/TrpcProvider.tsx
- [ ] Rename `cacheTime` to `gcTime` in query options
- [ ] Update loading states: replace `isLoading` with `isPending` in mutations
- [ ] Update `isInitialLoading` with `isPending && isFetching` logic
- [ ] Rename `Hydrate` component to `HydrationBoundary` in any server-side prefetching
- [ ] Review any singleton QueryClient implementation for v5 compatibility
- [ ] Update prefetching logic in server components to match v5 patterns
- [ ] Review query invalidation patterns after mutations for v5 compatibility

### tRPC v11 Changes:

- [ ] Update from v10.44.1 to ^11.0.0 (major version with breaking changes)
- [ ] Replace `createTRPCNext` with `createTRPCReact` in apps/web/src/lib/trpc/client.ts
- [ ] Update server setup in packages/server/src/trpc.ts for v11 patterns
- [ ] Update context typing in packages/server/src/context.ts
- [ ] Review middleware implementation in protected procedures
- [ ] Fix router initialization in packages/server/src/root.ts
- [ ] Update procedure definitions with new v11 patterns
- [ ] Review error handling and formatting (especially for Zod errors)
- [ ] Update fetchRequestHandler usage in app/api/trpc/[trpc]/route.ts
- [ ] Ensure proper integration with the React Server Components architecture

### Supabase SSR Changes:

- [ ] Verify Supabase SSR integration with current 0.6.1 version
- [ ] Use correct client creation patterns:
  - Server-side: Use server client from @/lib/supabase/server.ts
  - Client-side: Use browser client from @/lib/supabase/client.ts
- [ ] Replace any remaining `getSession()` calls with `getUser()`
- [ ] Check middleware implementations for proper cookie handling
- [ ] Ensure tRPC context correctly instantiates Supabase clients

### Zod v4 Changes:

- [ ] Update from v3.22.4 to ^4.0.0
- [ ] Review validation schemas for compatibility with v4 API
- [ ] Update error handling for Zod validation errors in forms
- [ ] Test form validations with new version
- [ ] Update any custom validators or transformations

## Project-Specific Monorepo Pattern Changes:

- [ ] Ensure consistent import paths using `@codexcrm/*` aliases (e.g., import { appRouter } from '@codexcrm/server/src/root')
- [ ] Use `@/*` aliases for intra-app imports within `apps/web`
- [ ] Verify workspace dependencies in package.json files
- [ ] Update any tRPC router mounting points (e.g., rename from 'client' to 'clients')

## Deprecated Packages:

- `@trpc/next`: Replace with `@trpc/react-query` + custom integration
- Any components using class-based error boundaries

## Missing Packages for Refactor:

- [ ] @tanstack/react-table (table implementation)
- [ ] @hookform/resolvers (form validation with Zod v4)
- [ ] @tanstack/query-sync-storage-persister (for query persistence)
- [ ] @tanstack/react-query-devtools (v5 compatible)
- [ ] Additional workspace packages
