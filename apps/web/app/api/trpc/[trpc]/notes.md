Handover Document: Project Phoenix - Monorepo Stabilization & Refactoring
To: Specialist Software Engineer
From: Lead System Architect
Date: June 3, 2025
Subject: Technical Handover and Strategic Plan for the CodexCRM Monorepo

1. Executive Summary: The Mission
   Welcome to the project. You are joining us at a critical and pivotal moment. We have just completed a foundational architectural overhaul of our backend systems, moving from a tightly-coupled Supabase-centric data layer to a modern, decoupled stack using Prisma for data access and tRPC for the API layer.
   The initial refactoring was turbulent and involved several architectural missteps that have now been corrected. Your mission is to execute the final, definitive integration of our Next.js frontend (apps/web) with this new, stable backend architecture.
   The end goal is a fully functional, buildable, and production-ready application where all data flows are type-safe, logical, and adhere to the strict separation of concerns outlined in this document. We are moving from "spaghetti" to a clean, layered architecture.
2. The Definitive Architecture: Our Unchanging North Star
   This is the most important section. The following architectural principles are now non-negotiable. Any refactoring that violates these principles is a step backward. This is what we fought through the "mess" to achieve, and this foundation must not be altered.
   apps/web (The Framework Host):
   IS FOR: UI rendering, routing, user interaction, handling HTTP requests, and all Next.js-specific logic.
   IS FOR: Using Next.js middleware.ts with @supabase/ssr to manage and persist the user's auth cookie/session across requests.
   IS FOR: Hosting the single api/trpc/[trpc]/route.ts endpoint, which acts as the gateway between the web world and our business logic. This file is responsible for using next/headers to extract cookies, get the user session, and pass it to the business logic layer.
   IS NOT FOR: Containing any direct database queries (prisma.contact.findMany) or complex business logic. It consumes the API; it does not implement it.
   @codexcrm/api (The Business Logic Layer):
   IS FOR: Housing the entire tRPC appRouter and all its procedures. This is the heart of our backend.
   IS FOR: Containing ALL business logic. This includes all CRUD operations, AI/LLM interactions, complex data transformations, and calls to third-party services.
   IS FOR: Receiving a context object containing the prisma client and the user session.
   IS NOT FOR: Knowing anything about HTTP, Next.js, requests, responses, or cookies. It's a pure, testable library of functions.
   @codexcrm/database (The Data Access Layer):
   IS FOR: Defining the schema.prisma and exporting the generated, type-safe PrismaClient instance.
   IS NOT FOR: Containing any other logic. Its job is simple and complete. Do not refactor this package.
   @codexcrm/auth (The Shared Type Utility):
   IS FOR: Exporting shared TypeScript types like Session and User from @supabase/supabase-js for convenience and consistency.
   IS NOT FOR: Containing any logic, functions, or client instances. It is a "dead simple" type-only package. Do not refactor this package.
   @codexcrm/trpc: (Note: This package is likely redundant now. Its logic can be merged into @codexcrm/api and @codexcrm/ui to simplify the dependency graph. This is a potential future cleanup task.)
   @codexcrm/config & @codexcrm/ui:
   You are correct, these are largely immune. @codexcrm/ui is a standard component library, and @codexcrm/config holds shared tooling configurations. They are stable.
3. Project History: What We Did Badly & Lessons Learned
   Understanding our missteps is crucial to avoid repeating them:
   Initial Sin - Leaky Abstractions: We initially tried to have shared packages (@codexcrm/api) handle Next.js-specific logic (like reading cookies). This led to a "brittle construction" where the package was not truly framework-agnostic, causing dependency conflicts and confusing build errors (TS2742).
   The "Bucket Shuffle": We moved the session logic from apps/web to @codexcrm/auth, then to @codexcrm/api, and back again. This was a classic symptom of not having a clear architectural boundary.
   The Resolution: We finally landed on the "Clear Divide" architecture outlined above. This is the correct pattern and resolves the core conflict. The key insight was realizing the tRPC context creation must be split into two parts: a framework-aware part in apps/web and a pure, framework-agnostic part in @codexcrm/api.
4. The Task at Hand: The "Working Backwards" Refactoring Mandate
   With the foundational packages now correctly defined, your task is to refactor the entire monorepo to be compliant with this new architecture. The "working backwards" approach is sound: start with the purest packages and move towards the application shell, ensuring each layer is correct before the next.
   Your Mandate, File-by-File:
   Phase 1: Solidify the Backend (@codexcrm/api)
   Objective: Make the API layer a perfect, self-contained implementation of your business logic.
   Workflow:
   context.ts & trpc.ts: Ensure these files match the "Clear Divide" architecture exactly. The context should be simple and receive the session.
   routers/_.ts: Go through every router file.
   Audit: Identify every procedure.
   Refactor: Rewrite every data query to use ctx.prisma. Delete all old supabase-js query logic.
   Secure: Ensure every query that should be user-specific includes a where: { userId: ctx.session.user.id } clause, using the protectedProcedure.
   Test: (Future state) This pure logic is now easily unit-testable.
   Phase 2: Integrate the Frontend (apps/web)
   Objective: Make the Next.js app a pure consumer of the now-perfect API layer.
   Workflow:
   app/api/trpc/[trpc]/route.ts: Ensure this file is the "smart orchestrator" as defined in the "Clear Divide" plan. It's the only place in the entire codebase that should be fetching a session and passing it to the context creator.
   Server Components (app/\*\*/_.tsx):
   Audit: Find every async Server Component.
   Refactor: Create and use the server-client (lib/trpc/server-client.ts) as defined in the PRD. Replace all old data-fetching logic with calls to api.procedure.method().
   Client Components (app/\*_/_.tsx with "use client"):
   Audit: Find every component that uses useEffect for data fetching or handles form submissions with fetch.
   Refactor: Replace this logic with the appropriate tRPC React Query hooks: trpc.procedure.useQuery() for fetching and trpc.procedure.useMutation() for updates/creates/deletes.
   Server Actions (actions/\*.ts):
   Audit: Review all Server Actions.
   Refactor: These should become thin wrappers. Their only job is to call the api server client and then revalidatePath or redirect. All complex business logic must be moved into a corresponding procedure in @codexcrm/api.
   lib/ Directory Cleanup:
   Audit: Go through the entire lib directory.
   Delete: Remove any old Supabase helper files (lib/supabase/server.ts, etc.). The only Supabase-related client logic on the frontend should be for authentication actions like supabase.auth.signInWithPassword().
5. Final Deliverable & Definition of Done
   The project is complete when an engineer can clone the repository, run pnpm install, then pnpm exec turbo build, and receive a successful build with zero errors. Subsequently, pnpm exec turbo dev must launch a fully functional application where all core features are working as intended, powered entirely by the new tRPC/Prisma stack.
   This document provides the full context and a clear, non-negotiable architectural direction. Follow it precisely, and we will successfully complete this critical stabilization effort.
