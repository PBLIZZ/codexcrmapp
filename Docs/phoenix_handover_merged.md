# Project Phoenix - Monorepo Stabilization & Refactoring
## Complete Technical Handover Document

**To:** Specialist Software Engineer  
**From:** Lead System Architect  
**Date:** June 3, 2025  
**Subject:** Definitive Blueprint for CodexCRM Monorepo Refactoring & Integration

---

## 1. Executive Summary: The Mission

Welcome to the project. You are joining us at a critical and pivotal moment. We have just completed a foundational architectural overhaul of our backend systems, moving from a tightly-coupled Supabase-centric data layer to a modern, decoupled stack using Prisma for data access and tRPC for the API layer.

The initial refactoring was turbulent and involved several architectural missteps that have now been corrected. Your mission is to execute the final, definitive integration of our Next.js frontend (`apps/web`) with this new, stable backend architecture.

**The end goal** is a fully functional, buildable, and production-ready application where all data flows are type-safe, logical, and adhere to the strict separation of concerns outlined in this document. We are moving from "spaghetti" to a clean, layered architecture.

---

## 2. The Definitive Architecture: Our Unchanging North Star

This is the most important section. The following architectural principles are now **non-negotiable**. Any refactoring that violates these principles is a step backward. This is what we fought through the "mess" to achieve, and this foundation must not be altered.

### `apps/web` (The Framework Host)

**IS FOR:**
- UI rendering, routing, user interaction, handling HTTP requests, and all Next.js-specific logic
- Using Next.js `middleware.ts` with `@supabase/ssr` to manage and persist the user's auth cookie/session across requests
- Hosting the single `api/trpc/[trpc]/route.ts` endpoint, which acts as the gateway between the web world and our business logic
- Using `next/headers` to extract cookies, get the user session, and pass it to the business logic layer

**IS NOT FOR:**
- Containing any direct database queries (`prisma.contact.findMany`) or complex business logic
- It consumes the API; it does not implement it

### `@codexcrm/api` (The Business Logic Layer)

**IS FOR:**
- Housing the entire tRPC `appRouter` and all its procedures - this is the heart of our backend
- Containing ALL business logic: CRUD operations, AI/LLM interactions, complex data transformations, and calls to third-party services
- Receiving a context object containing the prisma client and the user session

**IS NOT FOR:**
- Knowing anything about HTTP, Next.js, requests, responses, or cookies
- It's a pure, testable library of functions

### `@codexcrm/database` (The Data Access Layer)

**IS FOR:**
- Defining the `schema.prisma` and exporting the generated, type-safe PrismaClient instance

**IS NOT FOR:**
- Containing any other logic. Its job is simple and complete. **Do not refactor this package.**

### `@codexcrm/auth` (The Shared Type Utility)

**IS FOR:**
- Exporting shared TypeScript types like `Session` and `User` from `@supabase/supabase-js` for convenience and consistency

**IS NOT FOR:**
- Containing any logic, functions, or client instances. It is a "dead simple" type-only package. **Do not refactor this package.**

### `@codexcrm/config` & `@codexcrm/ui`

These packages are largely stable:
- `@codexcrm/ui` is a standard component library
- `@codexcrm/config` holds shared tooling configurations

---

## 3. Technical Specifications

### 3.1 Key Dependency Versions

- **Next.js:** 15.x (App Router)
- **React:** 19.x
- **tRPC:** 11.x
- **Prisma:** 6.x
- **Supabase:** `@supabase/ssr` for server-side, `@supabase/supabase-js` for client-side auth actions
- **TypeScript:** 5.3+
- **Turborepo:** 2.x

### 3.2 Database Schema & Migration Strategy

- **Single source of truth:** The existing production Supabase database
- **Migration strategy:** Manual/pull-based via Supabase Dashboard or raw SQL migrations
- **Sync process:** After schema changes, run:
  ```bash
  pnpm exec prisma db pull
  pnpm exec prisma generate
  ```

### 3.3 Authentication Flow (Server-Side Request)

```
Browser → Next.js App (apps/web) → Business Logic (@codexcrm/api)
   |              |                           |
1. GET /contacts  |                           |
   |          2. middleware.ts refreshes       |
   |             cookie via @supabase/ssr      |
   |              |                           |
   |          3. Server Component calls        |
   |             api.contact.getAll()          |
   |              |                           |
   |          4. route.ts creates context      |
   |             with session from cookies     |
   |              |                           |
   |          5. Passes session to ---------> 6. Receives {prisma, session}
   |             createInnerTRPCContext()      |
   |              |                       7. Procedure runs with ctx
   |              |                           |
   |<---- 8. Data returned to component ------+
```

### 3.4 Dependency Graph

```
              +----------------+
              |   apps/web     |
              +----------------+
                   |       |
      +------------+       +-------------+
      | (UI)               | (Logic)     |
      v                    v             v
+-------------+      +-------------+   +-------------+
| @codexcrm/ui|      | @codexcrm/api |   | @codexcrm/auth| (Types only)
+-------------+      +-------------+   +-------------+
                           |
                           v
                     +----------------+
                     | @codexcrm/database |
                     +----------------+
```

---

## 4. Project History: What We Did Badly & Lessons Learned

Understanding our missteps is crucial to avoid repeating them:

### Initial Sin - Leaky Abstractions
We initially tried to have shared packages (`@codexcrm/api`) handle Next.js-specific logic (like reading cookies). This led to a "brittle construction" where the package was not truly framework-agnostic, causing dependency conflicts and confusing build errors (TS2742).

### The "Bucket Shuffle"
We moved the session logic from `apps/web` to `@codexcrm/auth`, then to `@codexcrm/api`, and back again. This was a classic symptom of not having a clear architectural boundary.

### The Resolution
We finally landed on the "Clear Divide" architecture outlined above. This is the correct pattern and resolves the core conflict. The key insight was realizing the tRPC context creation must be split into two parts: a framework-aware part in `apps/web` and a pure, framework-agnostic part in `@codexcrm/api`.

---

## 5. Package Consolidation Plan: Deprecating @codexcrm/trpc

The `@codexcrm/trpc` package is redundant and introduces unnecessary complexity.

**Action Plan:**
1. Move its client-side logic (`createTRPCReact`) into `apps/web/lib/trpc/client.ts`
2. The `AppRouter` type it might have exported is now exported from `@codexcrm/api/root`
3. Once all dependencies are removed, delete the `packages/trpc` directory and remove it from `pnpm-workspace.yaml` and `tsconfig.json` references

---

## 6. The Task at Hand: The "Working Backwards" Refactoring Mandate

With the foundational packages now correctly defined, your task is to refactor the entire monorepo to be compliant with this new architecture. The "working backwards" approach is sound: start with the purest packages and move towards the application shell, ensuring each layer is correct before the next.

### Your Mandate, File-by-File

#### Phase 1: Solidify the Backend (`@codexcrm/api`)

**Objective:** Make the API layer a perfect, self-contained implementation of your business logic.

**Workflow:**
1. **`context.ts` & `trpc.ts`:** Ensure these files match the "Clear Divide" architecture exactly. The context should be simple and receive the session.
2. **`routers/*.ts`:** Go through every router file:
   - **Audit:** Identify every procedure
   - **Refactor:** Rewrite every data query to use `ctx.prisma`. Delete all old supabase-js query logic
   - **Secure:** Ensure every query that should be user-specific includes a `where: { userId: ctx.session.user.id }` clause, using the `protectedProcedure`
   - **Test:** (Future state) This pure logic is now easily unit-testable

#### Phase 2: Integrate the Frontend (`apps/web`)

**Objective:** Make the Next.js app a pure consumer of the now-perfect API layer.

**Workflow:**

1. **`app/api/trpc/[trpc]/route.ts`:** Ensure this file is the "smart orchestrator" as defined in the "Clear Divide" plan. It's the only place in the entire codebase that should be fetching a session and passing it to the context creator.

2. **Server Components (`app/**/*.tsx`):**
   - **Audit:** Find every async Server Component
   - **Refactor:** Create and use the server-client (`lib/trpc/server-client.ts`) as defined in the PRD. Replace all old data-fetching logic with calls to `api.procedure.method()`

3. **Client Components (`app/**/*.tsx` with `"use client"`):**
   - **Audit:** Find every component that uses `useEffect` for data fetching or handles form submissions with `fetch`
   - **Refactor:** Replace this logic with the appropriate tRPC React Query hooks: `trpc.procedure.useQuery()` for fetching and `trpc.procedure.useMutation()` for updates/creates/deletes

4. **Server Actions (`actions/*.ts`):**
   - **Audit:** Review all Server Actions
   - **Refactor:** These should become thin wrappers. Their only job is to call the api server client and then `revalidatePath` or `redirect`. All complex business logic must be moved into a corresponding procedure in `@codexcrm/api`

5. **`lib/` Directory Cleanup:**
   - **Audit:** Go through the entire lib directory
   - **Delete:** Remove any old Supabase helper files (`lib/supabase/server.ts`, etc.). The only Supabase-related client logic on the frontend should be for authentication actions like `supabase.auth.signInWithPassword()`

---

## 7. Code Examples: Before & After

### Server Component Refactor

```typescript
// BEFORE
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ContactsTable } from '@/components/contacts-table';

export default async function ContactsPage() {
  const supabase = createServerSupabaseClient();
  const { data: contacts } = await supabase.from('contacts').select('*');
  return <ContactsTable data={contacts} />;
}

// AFTER
import { api } from '@/lib/trpc/server-client';
import { ContactsTable } from '@/components/contacts-table';

export default async function ContactsPage() {
  const contacts = await api.contact.getAll();
  return <ContactsTable data={contacts} />;
}
```

### Server Action Refactor

```typescript
// BEFORE
'use server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function createContact(formData: FormData) {
  const supabase = createServerSupabaseClient();
  const rawFormData = { fullName: formData.get('fullName') };
  await supabase.from('contacts').insert(rawFormData);
}

// AFTER
'use server';
import { api } from '@/lib/trpc/server-client';
import { revalidatePath } from 'next/cache';

export async function createContact(data: { fullName: string; email: string }) {
  try {
    await api.contact.create(data);
    revalidatePath('/contacts');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to create contact.' };
  }
}
```

---

## 8. Risk Management & Operations

### Rollback Strategy
All work must be done on a dedicated git branch (e.g., `feature/project-phoenix`). No work will be merged to main until all acceptance criteria are met. If the refactor fails, the branch is discarded.

### Timeline Estimate
- **Phase 1:** Backend API Refactor (`@codexcrm/api/routers`) - 8-12 hours
- **Phase 2:** Frontend Integration (`apps/web`) - 15-20 hours  
- **Phase 3:** Testing & Cleanup - 5-10 hours
- **Total:** 28-42 hours

### Testing Strategy

#### Unit Tests (vitest)
For complex procedures in `@codexcrm/api`, mocking the Prisma client to test business logic in isolation.

#### E2E Tests (Playwright)
Create/update tests for critical user flows:
- User can log in
- User can view the contacts list
- User can open the "create contact" form, submit it, and see the new contact in the list

### Deployment & Coordination
- No deployment from the feature branch
- Daily async updates with the Lead Architect
- Coordinate via project channel for any blockers

### Quality Gates
A Pull Request to merge the feature branch into main will only be approved if:
- All status checks (linting, build) are passing
- All E2E tests for critical flows are passing
- The Lead Architect has performed a final code review and approved the implementation

---

## 9. Final Deliverable & Definition of Done

The project is complete when an engineer can:

1. Clone the repository
2. Run `pnpm install`
3. Run `pnpm exec turbo build` and receive a successful build with **zero errors**
4. Run `pnpm exec turbo dev` and launch a fully functional application where all core features are working as intended, powered entirely by the new tRPC/Prisma stack

This document provides the full context, the definitive architecture, lessons learned from our mistakes, and a clear, actionable plan with concrete examples. Follow it precisely, and we will successfully complete this critical stabilization effort.

---

*This document supersedes all previous verbal and written communication. The architectural principles are non-negotiable and represent the stable foundation for all future development.*