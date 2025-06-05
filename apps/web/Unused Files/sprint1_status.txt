# CodexCRM Project Status & AI Guidance (Root Document)

*Last Updated: April 25th, 2025 (End of Day)*

## SYSTEM (AI Instruction)
You are an expert Senior Full-Stack Engineer assisting Peter on the 'CodexCRM' project. Your primary goal is to execute the specific task requested in the prompt, strictly adhering to the established project architecture and fixing errors incrementally. Do NOT perform unsolicited refactoring or add unnecessary complexity. Prioritize stability and correctness. If a significant change is needed, ask for confirmation first.

## DEVELOPER (AI Instruction)
**Project Context:** CodexCRM is a pnpm monorepo (`apps/web`, `packages/server`, `packages/db`, `packages/ui`, `packages/jobs`). Uses Next.js App Router, tRPC v10, Supabase (Auth, DB with RLS **NOW VERIFIED**), TanStack Query v4, Tailwind CSS, Shadcn UI. **Current Focus:** **COMPLETING SPRINT 1 STABILIZATION**. This means implementing Client Delete, stabilizing the full auth flow (sign-in spinner, sign-up, forgot password, account mgmt, Google OAuth), refining the Client data model/form, and ensuring the build remains clean.

**Critical Rules & Architecture:**
1.  **Monorepo Structure:** RESPECT the `apps/*` and `packages/*` structure.
2.  **Path Aliases ARE MANDATORY:**
    *   Cross-Package: ALWAYS use `@codexcrm/*` (e.g., `@codexcrm/server/src/...`). NEVER use relative paths like `../../../packages/server`. (Ref: root `tsconfig.json`).
    *   Intra-App (`apps/web`): ALWAYS use `@/*` (e.g., `@/components/...`). (Ref: `apps/web/tsconfig.json`).
3.  **Type Safety:** Maintain end-to-end type safety. Avoid `any`. Use generated Supabase types (`@codexcrm/db/database.types.ts`).
4.  **tRPC:** API logic in `packages/server/src/routers`. Use `protectedProcedure`. Main router is `appRouter` (`packages/server/src/root.ts`). API handler is `apps/web/app/api/trpc/[trpc]/route.ts`.
5.  **Supabase Clients & RLS:**
    *   **RLS IS ENFORCED AND VERIFIED.** Queries reading user-specific data (like `clients.list`) MUST use the user-scoped client (`ctx.supabaseUser` from tRPC context). Writes (`update`, `delete`) should also use `ctx.supabaseUser` where possible, or `ctx.supabaseAdmin` carefully combined with `user_id` matching and RLS `WITH CHECK` policies.
    *   Server Components/Actions use `@/lib/auth/actions.ts` helpers. Client components use `@/lib/supabase/client` (browser client).
6.  **Fix Current Errors:** Prioritize Client Delete implementation and Auth flow bugs (spinner, missing flows).

---

## Sprint 1 Status: Nearing Completion - Stabilization In Progress

### ✅ Completed Items (Foundation & Recent Fixes)

1.  **Core Architecture Setup (Initial)**
    - Monorepo structure with pnpm workspaces (`apps/web`, `packages/*`).
    - Next.js App Router basic setup in `apps/web`.
    - tRPC v10 integration basics (routers, context, client, API handler).
    - Supabase backend integration basics (clients initialized).
    - Path aliases configured (`@codexcrm/*`, `@/*`) and build errors resolved.
    - Dependency versions stabilized (tRPC v10, TanStack Query v4).
    - Basic UI setup with ShadCN components.
    - Vercel deployment pipeline configured and build succeeds.

2.  **Authentication Flow Improvements (Apr 25th)**
    - Email/Password Login Implemented.
    - Magic Link Authentication Implemented (UI & Logic).
    - Authentication Redirects Fixed (Magic Link/OAuth now use correct callback).

3.  **Client Management Fixes (Apr 25th)**
    - Client Creation Flow Fixed (Works reliably on first submit, UI updates correctly).
    - Client Editing Flow Working (Via `save` procedure).
    - Client Email Validation Enforced (UI Zod schema & label updated to require email).
    - Unused tRPC Test Procedures Removed (`clientRouter.testList`, `clientRouter.testUpsert`).

4.  **Build & Type Safety (Apr 25th)**
    - DB Package Type Errors Resolved (`Cannot find name 'Tables'`).
    - Full project build (`pnpm run build`) completes successfully.

5.  **Row Level Security (RLS) / Multi-Tenancy (Apr 25th)**
    - RLS Policies (SELECT, INSERT, UPDATE, DELETE with `auth.uid() = user_id`) correctly configured in Supabase Dashboard for `clients` table.
    - tRPC `list` procedure updated to use user-scoped client (`ctx.supabaseUser`).
    - **Data isolation between users VERIFIED via testing.**

### 🚧 CURRENT BLOCKERS & IMMEDIATE PRIORITIES

1.  **Implement Client Delete Functionality** ⭐⭐⭐ **CRITICAL**
    - **Issue:** Delete button is missing or non-functional. Client lifecycle isn't complete.
    - **Action:** Create `client.delete` tRPC procedure in `packages/server`. Connect it to the UI button in `ClientsContent.tsx` (or client list view). Ensure database operation respects `user_id`. Implement a confirmation dialog for safety.

2.  **Stabilize & Complete Core Authentication Flow** ⭐⭐ **HIGH PRIORITY**
    - **Issue:** **Sign-in page spinner appears momentarily** (minor UX issue, needs investigation if problematic). Google OAuth started but may be incomplete. **Sign-up, Forgot Password, Account Management flows are missing.** Email confirmation setup (SMTP) needs end-to-end verification.
    *   **Action:** Implement `signUp` flow (test SMTP/email confirmation). Implement `resetPasswordForEmail` flow. Implement basic `/account` page for password change/sign out. Complete and test Google OAuth setup. Investigate spinner if it persists unacceptably long.

3.  **Refine Client Data Model & Form** ⭐ **MEDIUM PRIORITY**
    *   **Issue:** Current `clients` table schema and associated form may be too limited for future AI enrichment. ID types (`bigint` vs `uuid`) need review. Global unique constraint on email was incorrect for multi-tenancy (now implicitly handled by RLS + `user_id`).
    *   **Action:** Define necessary fields for `clients` table (incl. potential `jsonb` fields for enrichment, `profile_image_url`). **Standardize on `id uuid` primary key** (plan migration if needed). Update the Client form (`ClientsContent.tsx`?) and tRPC `save` input schema (Zod) to match the expanded fields. Plan for client detail page (`/clients/[clientId]`).

### ⏳ Remaining Original Sprint 1 Tasks (Lower Priority until above are stable)

-   Add Vitest & Playwright tests.
-   Set up Supabase CLI migrations structure (`supabase init`, copy initial schema, add client details migration).
-   Improve Loading/Error state UX generally.
-   Address technical debt (e.g., `as any`, error boundaries).

---

**Next Steps (Based on Priority):**

1.  **Implement Client Delete** functionality (tRPC procedure & UI connection with confirmation). (CRITICAL)
2.  **Implement missing Auth flows** (Sign-up, Forgot Password, Account page) & Verify Email Conf. (HIGH)
3.  **Complete Google OAuth** setup and testing. (HIGH)
4.  **Investigate Sign-in Page Spinner** (if deemed necessary after other auth flows are in). (MEDIUM/LOW)
5.  **Refine Client Data Model** (DB migration, update form/schemas). (MEDIUM)