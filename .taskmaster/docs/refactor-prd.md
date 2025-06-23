# PRD: Next.js App Modernization and Auth Architecture Refactor

- **Version**: 1.0
- **Status**: Proposed
- **Author**: AI Assistant
- **Date**: June 11, 2025
- **Relevant Teams**: Frontend Engineering, DevOps

---

## 1. Overview & Problem Statement

Our current Next.js application (`apps/web`) is functional but uses a mix of legacy patterns and architectural choices that can be improved for better performance, maintainability, and developer experience. The existing `RootLayout` component handles too many concerns, including client-side authentication logic, which tightly couples the UI shell to state management.

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
5.  Ensure full compatibility with our target stack: React 19, Next 15, tRPC 11, TanStack 5, and a PNPM monorepo.

## 3. Scope

### In-Scope

- `packages/auth` for shared authentication logic.
- `packages/config` for shared application constants.
- Refactoring of `apps/web/layout.tsx` into a pure Server Component.
- `AppContent.tsx` client component to manage auth state and conditional rendering.
- Creation of a shared `LoadingSpinner` component in `packages/ui`.
- Updating `tsconfig.json`, `tailwind.config.js`, and any other relevant config files to reflect the new file structure.

### Out-of-Scope

## 4. Functional & Technical Requirements

### 4.1. Monorepo Structure Enhancement

### 4.2. Shared UI Component

- A `LoadingSpinner.tsx` component shall be created within the `packages/ui` library.
  - This component will display a centered, animated spinner and serve as the global loading indicator.

### 4.3. Next.js App (`apps/web`) Refactoring

- The `tsconfig.json` file in `apps/web` must be updated to change the `@/*` path alias from `"./src/*"` to `"./*"`.
- The `tailwind.config.js` file in `apps/web` must be updated to remove `src/` from its content paths.
- The `RootLayout` (`apps/web/app/layout.tsx`) must be refactored.
  - It must be a pure Server Component, with the `'use client'` directive removed.
  - It will render the static `<html>` and `<body>` shell, global providers, and the `AppContent` component.
  - The `AppContent` component must have the `'use client'` directive.
  - It will use the `useAuth` hook to get the user's authentication state (`user`, `isLoading`).
  - It will use the `usePathname` and `useRouter` hooks to handle routing logic.
  - It must render the `LoadingSpinner` while `isLoading` is true or while a redirect is pending.
  - It must enforce routing rules:
    - Redirect unauthenticated users from protected pages to the `SIGN_IN_PATH`.
    - Redirect authenticated users from auth pages to the `DASHBOARD_PATH`.
  - It must conditionally render the `<MainLayout>` component for authenticated users on protected pages, and the raw `{children}` for all other valid scenarios.

## 5. Success Metrics

## 6. Assumptions & Dependencies
