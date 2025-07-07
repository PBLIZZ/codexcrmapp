# CodexCRM - Project Standards & Conventions

**Version:** 1.0
**Last Updated:** [5th July 2025]

## 1. Introduction

This document outlines the official technical standards, architectural principles, and coding conventions for the **CodexCRM** project (`codexcrmapp`). All contributors, including human developers and AI assistants, are required to adhere to these standards to ensure code quality, consistency, and maintainability. This is the single source of truth for "how we build things."

## 2. Core Architectural Principles

1.  **AI-First Design:** The application is architected as an AI-first system. The primary user interaction model is conversational, orchestrated by a central AI engine ("The Heart"). Core CRM features should be designed as "tools" (tRPC procedures) that this AI engine can call.
2.  **Monorepo Structure:** The project uses a **pnpm monorepo** to separate concerns. Adherence to the `apps/*` and `packages/*` structure is mandatory.
3.  **Type Safety is Non-Negotiable:** All code must be strongly typed using TypeScript. End-to-end type safety from the database (via generated types) through the tRPC API to the React frontend is a critical requirement. The `any` type should be avoided at all costs.
4.  **Supabase as the Backend & Single Source of Truth:** All persistent data is stored in the project's Supabase PostgreSQL database. We leverage Supabase for Authentication, Database, Storage, and Edge Functions.
5.  **Security through RLS:** Multi-tenancy and data isolation are enforced at the database level via **Row Level Security (RLS)** policies. All queries accessing user-specific data must respect these policies.

## 3. Technology Stack

Adherence to the established technology stack is required. Do not introduce new core libraries or frameworks without a formal architectural review.

*   **Framework:** Next.js (v15+, App Router)
*   **Language:** TypeScript (v5+)
*   **UI Library:** React (v19+)
*   **API Layer:** tRPC (v11+)
*   **Backend:** Supabase (PostgreSQL, Auth, Storage, Edge Functions)
*   **Database Client:** Direct Supabase client (`@supabase/ssr`) and generated types.
*   **Vector DB:** Supabase `vector` (PGVector) extension.
*   **Frontend State:**
    *   **Server State:** TanStack Query (v5+) integrated with tRPC.
    *   **Client State:** Zustand for global UI state.
*   **Styling:** Tailwind CSS (v4+) & Shadcn UI components.
*   **Forms:** React Hook Form & Zod for validation.
*   **Monorepo Tooling:** pnpm workspaces.
*   **Deployment:** Vercel.

## 4. Coding Conventions & Best Practices

### 4.1. TypeScript
*   **Strict Mode:** `strict: true` must be enabled in all `tsconfig.json` files.
*   **Naming:** Use `PascalCase` for types and interfaces (e.g., `type ContactType = ...`).
*   **Types vs. Interfaces:** Prefer `type` for defining object shapes, function signatures, and unions. Use `interface` primarily when declaration merging is needed (rare in this project).
*   **Avoid `enum`:** Use string literal unions instead (e.g., `type Status = 'pending' | 'completed';`).

### 4.2. React & Next.js
*   **Component Architecture:**
    *   **Favor Server Components:** Use RSCs by default for data fetching and rendering non-interactive UI.
    *   **Isolate Client Components:** Use `'use client'` only where necessary for interactivity (hooks, event handlers). Keep them small and push them down the component tree.
*   **File & Component Naming:**
    *   Component files and function names must be `PascalCase` (e.g., `ContactTable.tsx`, `function ContactTable() {}`).
    *   Directory names for components should be `kebab-case` (e.g., `components/contact-management/`).
*   **Exports:** Prefer **named exports** over default exports for components and utilities (`export function MyComponent...`).
*   **Data Fetching:**
    *   In Server Components, fetch data directly server-side (e.g., via a tRPC server-side helper or a Server Action that calls a tRPC procedure).
    *   In Client Components, use the tRPC hooks provided by `@trpc/react-query` (e.g., `api.contacts.list.useQuery()`).
*   **Loading & Error States:** All asynchronous operations in the UI must handle loading, error, and empty states gracefully. Use skeletons, spinners, and clear error messages.

### 4.3. Backend & tRPC
*   **tRPC Procedures as "Tools":** Each procedure should represent a single, granular, well-defined action (e.g., `contacts.getById`, `contacts.updateTags`, `ai.draftEmail`). This makes them easily usable by the AI engine.
*   **Input Validation:** All tRPC procedures that accept input **must** validate that input using a **Zod schema**.
*   **RLS Enforcement:** Procedures reading user-specific data must use the user-scoped Supabase client (`ctx.supabaseUser`). The admin client (`ctx.supabaseAdmin`) should only be used for specific, trusted server-to-server operations where RLS bypass is explicitly required and safe.

### 4.4. Monorepo & File Structure
*   **Path Aliases:** Path aliases are **mandatory**.
    *   `@codexcrm/*`: For all cross-package imports (e.g., `import { contactRouter } from '@codexcrm/api/routers'`).
    *   `@/*`: For all intra-app imports within `apps/web` (e.g., `import { Button } from '@/components/ui/button'`).
*   **Directory Structure:** Adhere to the appRouter directory structure within `apps/web`.

## 5. Git & Version Control

*   **Branching Strategy:**
    *   `main`: Represents the stable, production-ready branch.
    *   `develop`: Integration branch where features are merged before going to main.
    *   `feat/<feature-name>`: Branches for developing new features.
    *   `fix/<issue-name>`: Branches for bug fixes.
*   **Commit Messages:** Follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. This is essential for automated changelog generation and versioning.
    *   **Example:** `feat(contacts): add delete functionality with confirmation modal`
    *   **Example:** `fix(auth): resolve cookie handling issue in tRPC context`
*   **Pull Requests (PRs):**
    *   All code must be merged into `develop` and then `main` via a Pull Request.
    *   PRs must pass all automated checks (linting, testing, build) in the CI pipeline before being eligible for merge.
    *   PR descriptions should be clear and link to the relevant task(s) in the project management tool.

## 6. Project Management Workflow (Taskmaster AI)

*   **Single Source of Truth:** `tasks.json` managed by the **Taskmaster AI CLI/MCP tools** is the single source of truth for the project backlog and sprint tasks. Do not edit this file manually.
*   **Workflow:** Development follows the process outlined in `DEV_WORKFLOW` rules: `list` -> `next` -> `show` -> `expand` -> implement -> `set-status`.
*   **PRD Generation:** New features will be scoped via a PRD generated by the `mini-prd.md` process before being broken down into tasks.

## 7. Document Maintenance

This `PROJECT_STANDARDS.md` document is a living document. It should be updated via a Pull Request when new standards are established or existing ones are changed. The `SELF_IMPROVE` workflow rules should be followed to identify when updates are needed.