Of course. This is a perfect use case for a Product Requirements Document (PRD). It will provide a clear, structured plan that can be easily parsed into actionable tasks.

Here is the PRD in Markdown format.

---

# PRD: Next.js App Modernization and Auth Architecture Refactor

- **Version**: 1.0
- **Status**: Proposed
- **Author**: AI Assistant
- **Date**: June 11, 2025
- **Relevant Teams**: Frontend Engineering, DevOps

---

## 1. Overview & Problem Statement

Our current Next.js application (`apps/web`) is functional but uses a mix of legacy patterns and architectural choices that can be improved for better performance, maintainability, and developer experience. The existing `RootLayout` component handles too many concerns, including client-side authentication logic, which tightly couples the UI shell to state management. Furthermore, the project follows a `src/` directory structure, which is no longer the recommended convention for the Next.js App Router.

This initiative aims to refactor the application to align with modern best practices for Next.js 15, React 19, and monorepo development.

## 2. Goals & Objectives

### Business Goals
- **Improve Developer Velocity**: A cleaner, more modular architecture will allow developers to build and iterate on features faster.
- **Enhance Application Performance**: Aligning with modern Next.js patterns like Partial Prerendering (PPR) will improve initial page load times and user experience.
- **Increase System Stability**: Decoupling concerns and centralizing logic will reduce bugs and make the system easier to debug and maintain.

### Technical Objectives
1.  Refactor the root layout and authentication flow into a robust, scalable architecture.
2.  Decouple client-side logic from server-side rendering concerns.
3.  Eliminate prop-drilling of user authentication state.
4.  Centralize application-wide constants (e.g., route paths).
5.  Migrate from the legacy `src/` directory structure to the modern root-level convention.
6.  Ensure full compatibility with our target stack: React 19, Next 15, tRPC 11, TanStack 5, and a PNPM monorepo.

## 3. Scope

### In-Scope
-   Creation of a new `packages/auth` for shared authentication logic.
-   Creation of a new `packages/config` for shared application constants.
-   Refactoring of `apps/web/layout.tsx` into a pure Server Component.
-   Creation of a new `AppContent.tsx` client component to manage auth state and conditional rendering.
-   Creation of a shared `LoadingSpinner` component in `packages/ui`.
-   Updating `apps/web/providers-client.tsx` to integrate the new `AuthProvider`.
-   Moving all directories and files from `apps/web/src` to the root of `apps/web`.
-   Updating `tsconfig.json`, `tailwind.config.js`, and any other relevant config files to reflect the new file structure.

### Out-of-Scope
-   Changes to the tRPC backend logic in `packages/server`.
-   Changes to the database schema or migrations in `packages/db` (beyond what is already done).
-   Major UI/UX redesigns of existing pages.
-   Implementing new application features.

## 4. Functional & Technical Requirements

### 4.1. Monorepo Structure Enhancement

-   **REQ-1.1**: A new package must be created at `packages/config` to house shared constants.
    -   **REQ-1.1.1**: It must contain a `paths.ts` file exporting `AUTH_PAGES`, `SIGN_IN_PATH`, and `DASHBOARD_PATH`.
-   **REQ-1.2**: A new package must be created at `packages/auth` to handle authentication state.
    -   **REQ-1.2.1**: It must contain a `provider.tsx` file with an `AuthProvider` component and a `useAuth` hook.
    -   **REQ-1.2.2**: `AuthProvider` must fetch the initial user session and listen for `onAuthStateChange` events from Supabase.
    -   **REQ-1.2.3**: `useAuth` hook must leverage the React 19 `use()` hook for consuming context.
-   **REQ-1.3**: The `pnpm-workspace.yaml` file must be updated to recognize the new packages.

### 4.2. Shared UI Component

-   **REQ-2.1**: A `LoadingSpinner.tsx` component shall be created within the `packages/ui` library.
    -   **REQ-2.1.1**: This component will display a centered, animated spinner and serve as the global loading indicator.

### 4.3. Next.js App (`apps/web`) Refactoring

-   **REQ-3.1**: The `apps/web/src` directory must be removed.
    -   **REQ-3.1.1**: All contents of `src/` (e.g., `app`, `components`, `lib`, `hooks`) must be moved to the root of the `apps/web` directory.
    -   **REQ-3.1.2**: The `tsconfig.json` file in `apps/web` must be updated to change the `@/*` path alias from `"./src/*"` to `"./*"`.
    -   **REQ-3.1.3**: The `tailwind.config.js` file in `apps/web` must be updated to remove `src/` from its content paths.
-   **REQ-3.2**: The `RootLayout` (`apps/web/app/layout.tsx`) must be refactored.
    -   **REQ-3.2.1**: It must be a pure Server Component, with the `'use client'` directive removed.
    -   **REQ-3.2.2**: All `useState` and `useEffect` hooks for auth management must be removed from this file.
    -   **REQ-3.2.3**: It will render the static `<html>` and `<body>` shell, global providers, and the new `AppContent` component.
-   **REQ-3.3**: A new client component, `AppContent.tsx`, must be created at `apps/web/components/layout/AppContent.tsx`.
    -   **REQ-3.3.1**: This component must have the `'use client'` directive.
    -   **REQ-3.3.2**: It will use the `useAuth` hook to get the user's authentication state (`user`, `isLoading`).
    -   **REQ-3.3.3**: It will use the `usePathname` and `useRouter` hooks to handle routing logic.
    -   **REQ-3.3.4**: It must render the `LoadingSpinner` while `isLoading` is true or while a redirect is pending.
    -   **REQ-3.3.5**: It must enforce routing rules:
        -   Redirect unauthenticated users from protected pages to the `SIGN_IN_PATH`.
        -   Redirect authenticated users from auth pages to the `DASHBOARD_PATH`.
    -   **REQ-3.3.6**: It must conditionally render the `<MainLayout>` component for authenticated users on protected pages, and the raw `{children}` for all other valid scenarios.
-   **REQ-3.4**: The `ClientProviders` component (`apps/web/app/providers-client.tsx`) must be updated.
    -   **REQ-3.4.1**: It must import and wrap its children with the new `AuthProvider` from `@repo/auth`.
    -   **REQ-3.4.2**: The `AuthProvider` should be the top-level provider, wrapping the `TRPCReactProvider`.

## 5. Success Metrics

-   The `apps/web` directory no longer contains a `src/` folder.
-   The `apps/web/app/layout.tsx` file is a Server Component without any client-side hooks.
-   Authentication state is managed globally via `useAuth` hook, and no `user` prop is passed to `MainLayout`.
-   Unauthenticated users are correctly redirected to the login page when accessing protected routes.
-   A full-page loading spinner is visible during initial auth check and redirects.
-   The application builds successfully and all pages function as they did before the refactor.
-   Lighthouse performance scores for initial page load are maintained or improved.

## 6. Assumptions & Dependencies

-   The engineering team has access to the monorepo and sufficient permissions to create new packages and modify configuration files.
-   The existing Supabase client setup at `apps/web/src/lib/supabase/client.ts` is functional.
-   The target stack versions (Next 15, React 19, etc.) are correctly installed in the monorepo.

---