# Final Handoff & Context for AI Assistant (O3 High Reasoning)

**Objective**: Your primary mission is to stabilize the CodexCRM application by resolving all current build errors and runtime issues. You will operate as an expert full-stack developer, adhering strictly to the modern technology stack and the architectural decisions outlined below. The immediate goal is to achieve a clean, runnable state before proceeding with new feature development (like the LLM component).

## 1. Core Architectural Principles (Non-Negotiable)

This project has undergone a significant refactoring. The following principles are the foundation of the new architecture and MUST be preserved and respected. Do not revert these changes to fix errors; instead, fix errors within this new paradigm.

**Monorepo Structure**: The project is a PNPM monorepo with apps in `apps/*` and shared logic in `packages/*`. The key packages are `@codexcrm/auth`, `@codexcrm/config`, `@codexcrm/ui`, `@codexcrm/db`, and `@codexcrm/server`.

**Decoupled Layout System**:
- **RootLayout** (`app/layout.tsx`): A pure Server Component for the static HTML shell.
- **AppContent.tsx**: The client-side "brain" that handles auth state, redirects, and loading spinners.
- **MainLayout.tsx**: The structural "skeleton" for authenticated views, responsible only for arranging the header and sidebars.
- **Header.tsx**: The dedicated component for the top navigation bar.

**Context-Based Authentication**: All user data is accessed via the `useAuth()` hook from `@codexcrm/auth`. Prop-drilling the user object is forbidden.

**Modern Stack Compliance**: All new code must be fully compliant with React 19, Next.js 15 (App Router), tRPC v11, and TanStack Query v5.

## 2. The Go-Forward Plan: Your Immediate Focus

**Stabilize the Application**: Your first priority is to fix all build-time and runtime errors to get the app running cleanly.

**Restore Core Functionality**:
- **User Auth Pages**: Ensure the login, sign-up, and password reset pages are fully functional with the new auth system.
- **Contacts CRUD**: Restore the "Contacts" section to its previous state (list, view, create, update, delete).
- **Tasks MVP**: Implement basic CRUD and viewing functionality for the "Tasks" section.

**Defer UI/UX Polish**: Acknowledge and log any UI/UX issues (e.g., sidebar responsiveness, layout spacing) as new tasks in Taskmaster. Do not spend time on visual polish until the core functionality is stable.

**Prepare for LLM Integration**: Once the above is complete, the application will be ready for the next major feature.

## 3. Critical Rules & Conventions to Enforce

To improve clarity and distinguish new components from older files, we are adopting a strict **PascalCase naming convention** for all `.tsx` component files and their containing folders.

✅ **DO**: `apps/web/components/layout/UserNav/UserNav.tsx`  
✅ **DO**: `apps/web/app/contacts/[contactId]/page.tsx`  
❌ **DON'T**: `apps/web/components/layout/nav-user.tsx`  
❌ **DON'T**: `apps/web/components/omni-bot/OmniBot.tsx` (The folder should be `OmniBot`)

As you work, if you touch a component in a kebab-case folder, refactor its folder name to PascalCase. This will help us systematically clean up the codebase.

**Monorepo Packages**: ALWAYS use `@codexcrm/*` aliases for cross-package imports (e.g., `import { useAuth } from '@codexcrm/auth'`). Refer to the root `tsconfig.json`.

**Internal App Imports**: ALWAYS use the `@/*` alias for imports within the `apps/web` project (e.g., `import { Button } from '@codexcrm/ui/components/ui/button'`).

**NEVER** use relative paths like `../../` to cross package or app boundaries.

**Comments & Tasks**: Be meticulous.
- Use `//` comments to explain why a piece of code is complex or non-obvious.
- Use Taskmaster to log new work. If you identify a needed fix or feature that is outside your current task's scope, create a new task for it. Do not leave `// TODO` comments.

**Cleanup**: Aggressively delete unused components, files, or commented-out code. If a file was started and never used, remove it. A clean codebase is a priority.

**Error Handling**: Do not comment out code that causes errors. Identify the root cause and fix it properly according to these rules.

**Component Structure**:
- Default to Server Components. Only use `'use client'` when absolutely necessary for hooks or interactivity.
- Keep Client Components small and push them down the component tree.
- Use named exports for all components (`export function MyComponent...`).
- Use Zod for all data validation (tRPC inputs, form actions).
- Use Server Actions combined with React 19's `useActionState` and `useFormStatus` hooks for all form submissions.

**Be Aware of a Messy File Structure**: The codebase is currently being cleaned up. When looking for a file (e.g., `Header.tsx`), do not assume its location. Search the entire `apps/web` directory. Do not create a new file if a similar one already exists in a different location (e.g., `components/nav-main.tsx` vs. `components/layout/Header.tsx`). Your job is to consolidate and clean up this duplication.

The routing for task-master may be off in some environments. Always specify the output path explicitly to avoid errors: `task-master generate --output=".taskmaster/tasks"`

**Your first action**: Start the development server (`pnpm dev`) and begin systematically resolving the build and runtime errors, adhering strictly to the new architecture and these rules. Prioritize functionality over visual polish.