# CodexCRM Project Status & AI Guidance (Root Document)

*Last Updated: (24th April 2025)*

## SYSTEM (AI Instruction)
You are an expert Senior Full-Stack Engineer assisting Peter on the 'CodexCRM' project. Your primary goal is to execute the specific task requested in the prompt, strictly adhering to the established project architecture and fixing errors incrementally. Do NOT perform unsolicited refactoring or add unnecessary complexity. Prioritize stability and correctness. If a significant change is needed, ask for confirmation first.

## DEVELOPER (AI Instruction)
**Project Context:** CodexCRM is a pnpm monorepo (`apps/web`, `packages/server`, `packages/db`, `packages/ui`, `packages/jobs`). Uses Next.js App Router, tRPC v10, Supabase (Auth, DB with RLS - **NEEDS VERIFICATION**), TanStack Query v4, Tailwind CSS, Shadcn UI. **Current Focus:** **STABILIZING SPRINT 1**. This means fixing RLS/multi-tenancy, completing client CRUD, stabilizing the full auth flow (sign-up, sign-in, forgot password, account mgmt), and ensuring the build is clean.

**Critical Rules & Architecture:**
1.  **Monorepo Structure:** RESPECT the `apps/*` and `packages/*` structure.
2.  **Path Aliases ARE MANDATORY:**
    *   Cross-Package: ALWAYS use `@codexcrm/*` (e.g., `@codexcrm/server/src/...`). NEVER use relative paths like `../../../packages/server`. (Ref: root `tsconfig.json`).
    *   Intra-App (`apps/web`): ALWAYS use `@/*` (e.g., `@/components/...`). (Ref: `apps/web/tsconfig.json`).
3.  **Type Safety:** Maintain end-to-end type safety. Avoid `any`. Use generated Supabase types (`@codexcrm/db/database.types.ts`).
4.  **tRPC:** API logic in `packages/server/src/routers`. Use `protectedProcedure`. Main router is `appRouter` (`packages/server/src/root.ts`). API handler is `apps/web/app/api/trpc/[trpc]/route.ts`.
5.  **Supabase Clients & RLS:**
    *   **RLS MUST BE ENFORCED.** Queries reading user-specific data (like `client.list`) MUST use the user-scoped client (`ctx.supabaseUser` from tRPC context) to respect RLS.
    *   `ctx.supabaseAdmin` should only be used for writes (`insert`, `update`, `delete` where `user_id` is explicitly set/matched) or true admin tasks.
    *   Server Components/Actions use `@/lib/auth/actions.ts` helpers. Client components use `@/lib/supabase/client` (browser client).
6.  **Fix Current Errors:** Prioritize RLS, Client CRUD, and Auth flow bugs.

---

## Sprint 1 Status: In Progress - Stabilization Required

### ✅ Completed Items (Foundation)

1.  **Core Architecture Setup**
    - Monorepo structure with pnpm workspaces (`apps/web`, `packages/*`).
    - Next.js App Router basic setup in `apps/web`.
    - tRPC v10 integration basics (routers, context, client, API handler).
    - Supabase backend integration basics (clients initialized).
    - Path aliases configured (`@codexcrm/*`, `@/*`) and build errors related to them resolved.
    - Dependency versions stabilized (tRPC v10, TanStack Query v4).
    - Basic UI setup with ShadCN components.
    - Vercel deployment pipeline configured (but build may fail due to runtime issues).

### 🚧 CURRENT BLOCKERS & IMMEDIATE PRIORITIES

1.  **Fix Row Level Security (RLS) / Multi-Tenancy** ⭐⭐⭐ **CRITICAL**
    - **Issue:** Evidence suggests users might be seeing data belonging to other users.
    - **Action:** Verify RLS enabled & policies are correct (`auth.uid() = user_id`) in Supabase Dashboard for `clients` table. Audit tRPC `list` procedure to ensure it uses a user-scoped client (`ctx.supabaseUser`) from context, not `ctx.supabaseAdmin`. Update tRPC context if needed. Rigorously test data isolation between users.

2.  **Fix Client CRUD Functionality** ⭐⭐ **HIGH PRIORITY**
    - **Issue:** Adding new clients is not working. Edit/Delete buttons are non-functional.
    - **Action:** Debug the "Add Client" tRPC mutation (`client.upsert`) flow end-to-end (form -> API -> DB). Implement and debug `client.update` and `client.delete` tRPC procedures and connect them to UI buttons. Ensure database operations respect `user_id` for security.

3.  **Stabilize & Complete Core Authentication Flow** ⭐⭐ **HIGH PRIORITY**
    - **Issue:** Current login may be fragile (rate limits hit previously). Sign-up, Forgot Password, Account Management flows are missing. Google OAuth incomplete. Email confirmation needs verification.
    *   **Action:** Once rate limits clear, thoroughly test email/password login. Implement `signUp` flow (check SMTP/email confirmation). Implement `resetPasswordForEmail` flow. Implement basic `/account` page for password change/sign out. Complete and test Google OAuth setup.

4.  **Refine Client Data Model & Form** ⭐ **MEDIUM PRIORITY**
    *   **Issue:** Current `clients` table schema and associated form may be too limited for future AI enrichment. ID types (`bigint` vs `uuid`) need review.
    *   **Action:** Define necessary fields for `clients` table (incl. potential `jsonb` fields for enrichment). Standardize on `id uuid` primary key if not already done. Update the Client form (`ClientsContent.tsx`?) and tRPC `upsert` input schema (Zod) to match.

### ⏳ Remaining Original Sprint 1 Tasks (Lower Priority until above are stable)

-   Implement Delete confirmation dialogs.
-   Add Vitest & Playwright tests.
-   Set up Supabase CLI migrations structure (`supabase init`, copy initial schema).
-   Improve Loading/Error state UX.
-   Address technical debt (e.g., `as any`, error boundaries).

---

**Next Steps:**

1.  **Verify RLS Settings & Policies in Supabase Dashboard.**
2.  **Modify tRPC Context & `clientRouter.list` Procedure** to use `ctx.supabaseUser` for reads.
3.  **Remove `testList` and `testUpsert`** public procedures from `clientRouter`.
4.  **Test data isolation** between two different user accounts rigorously.