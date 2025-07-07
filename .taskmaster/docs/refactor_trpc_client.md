# Refactor: Move tRPC Client to `packages/trpc`

## 1. Introduction

This document outlines the requirement to refactor the tRPC client configuration file from `apps/web/lib/trpc/client.ts` to the shared `packages/trpc` workspace. This move is essential to align with the project's architectural guidelines, which mandate that all tRPC-related logic and configurations reside within the `packages/trpc` directory.

## 2. Goals

*   **Adhere to Architectural Standards:** Ensure all tRPC client-side configuration is located in `packages/trpc` as per `GEMINI.md` and `PROJECT_STANDARDS.md`.
*   **Improve Modularity:** Centralize tRPC client setup for easier maintenance and reuse across different applications within the monorepo.
*   **Resolve Type Errors:** Address the TypeScript error "The inferred type of 'api' cannot be named without a reference to '@/node_modules/@trpc/react-query/dist/getQueryKey.d-CruH3ncI.mjs'. This is likely not portable. A type annotation is necessary." by ensuring correct imports and type definitions after the move.

## 3. Scope

### In Scope:
*   Creation of the `packages/trpc` directory if it does not exist.
*   Moving `apps/web/lib/trpc/client.ts` to `packages/trpc/src/client.ts`.
*   Updating import paths in `apps/web` that reference the old `client.ts` location.
*   Adding necessary type annotations to resolve the reported TypeScript error.
*   Ensuring the application continues to function correctly after the refactor.

### Out of Scope:
*   Any other tRPC-related refactoring beyond the `client.ts` file.
*   Changes to tRPC server-side procedures or API definitions.

## 4. Technical Details

### Current State:
The tRPC client is currently defined in `apps/web/lib/trpc/client.ts`. This violates the architectural principle of centralizing shared logic in `packages/`.

### Desired State:
The tRPC client will be located at `packages/trpc/src/client.ts`. `apps/web` will import the client from `@codexcrm/trpc`.

### Proposed Changes:
1.  Create `packages/trpc/src` directory.
2.  Move `apps/web/lib/trpc/client.ts` to `packages/trpc/src/client.ts`.
3.  Update `tsconfig.json` in `packages/trpc` to correctly export the client.
4.  Modify `apps/web/lib/trpc/client.ts` to re-export from the new location or remove it if no longer needed.
5.  Update all references to `apps/web/lib/trpc/client.ts` in `apps/web` to `import { api } from '@codexcrm/trpc';`.
6.  Add explicit type annotation to `api` in `packages/trpc/src/client.ts` to resolve the TypeScript error.

## 5. Acceptance Criteria

*   The `client.ts` file is successfully moved to `packages/trpc/src/client.ts`.
*   All imports in `apps/web` are updated and resolve correctly.
*   The original TypeScript error (TS2742) is resolved.
*   The application builds and runs without errors.
*   Linting and type-checking pass successfully.
