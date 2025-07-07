# Product Requirements Document: Authentication Layer Refactor

## 1. Overview

This document outlines the requirements for refactoring the authentication layer of the CodexCRM monorepo. The objective is to centralize all Supabase session and client management logic into a dedicated `@codexcrm/auth` package. This will decouple the `apps/web` application from the direct implementation of authentication, improve security, and align with our monorepo architecture principles.

## 2. Core Features (The Refactor Epic)

The refactor consists of creating a central auth package and then updating all consumers to use it.

## 3. Technical Architecture

The target architecture is defined in `/Docs/official-documentation/centralising-config.md`. All work must adhere to the principles outlined in that document.

-   **`packages/auth` (The Source of Truth)**: Will be created to export `createServerClient` and `createBrowserClient` functions using `@supabase/ssr`. It will have no other dependencies besides the Supabase libraries. This package is the single, authoritative source for creating Supabase clients.
-   **`apps/web` (The Consumer)**: Will be refactored to import all Supabase client instances from `@codexcrm/auth`.
    -   **`middleware.ts`**: Its primary role is to refresh expired Supabase Auth tokens on every request and manage their storage in cookies. This is the only place where session cookies should be written to.
    -   **Server Components**: For page protection, these components will import `createServerClient` from `@codexcrm/auth` and **must** use `supabase.auth.getUser()` to revalidate the session token against the Supabase server, ensuring maximum security.
    -   **Client Components**: An `AuthProvider` will use `createBrowserClient` and listen to `onAuthStateChange` to provide a synchronized, real-time authentication context to all interactive UI components.
-   **`packages/api` (The API Layer)**: The tRPC context will be updated to import `createServerClient` from `@codexcrm/auth` to securely get the user's identity from the request and pass it to protected procedures.

## 4. Implementation Plan (Task Sequence)

1.  **Phase 1: Foundation - Ensure `@codexcrm/auth` Package**
    -   Task: Ensure the directory structure and `package.json` for `packages/auth`.
    -   Task: Ensure `@supabase/ssr` and `@supabase/supabase-js` as dependencies to `packages/auth`.
    -   Task: Ensure and export `createServerClient` and `createBrowserClient` utilities within `packages/auth/src`.

2.  **Phase 2: Backend Integration**
    -   Task: Ensure the tRPC context in `packages/api` imports and uses `createServerClient` from `@codexcrm/auth` for secure user identity verification.

3.  **Phase 3: Frontend Integration (`apps/web`)**
    -   Task: Ensure `apps/web/middleware.ts` uses the session refresh pattern from the new `@codexcrm/auth` package.
    -   Task: Refactor server components in `apps/web` that perform auth checks to use `createServerClient` from `@codexcrm/auth`, ensuring `getUser()` is used for revalidation.
    -   Task: Ensure any client components or providers in `apps/web` to use `createBrowserClient` from `@codexcrm/auth`.
    -   Task: Ensure the now-redundant `apps/web/lib/supabase` directory is deleted.

4.  **Phase 4: Verification**
    -   Task: Run `pnpm install`, `turbo typecheck`, and `turbo build` to ensure the entire monorepo is stable and error-free.
    -   Task: Manually test the sign-in, sign-out, and protected route access flows to confirm functionality.

## 5. Risks and Mitigations

-   **Risk:** Breaking changes during the refactor could destabilize the application.
    -   **Mitigation:** We will perform the refactor in small, verifiable steps as outlined in the dependency chain. Each phase will be followed by a full type-check and build verification.
-   **Risk:** Circular dependencies are created.
    -   **Mitigation:** The dependency flow is clear: `apps/web` and `packages/api` depend on `packages/auth`. `packages/auth` will have no internal workspace dependencies.

## 6. Appendix

-   This refactor is a purely technical initiative. No new user-facing features will be added.
-   Success is defined as a successful `turbo build` with zero type errors and all logic correctly located in its designated package.