# **Product Requirements Document (PRD): Project Phoenix**

**Project Name:** Project Phoenix - Application Logic & Data Layer Integration

**Version:** 1.0

**Author:** Senior System Architect

**Date:** July 8, 2025

**Status:** **IN PROGRESS**

---

## **1. Overview & Problem Statement**

### **1.1. Background:**

The "CodexCRM" monorepo has recently undergone a critical architectural refactoring of its backend foundation. The data access layer has been migrated from a direct `supabase-js` client implementation to a robust, type-safe ORM using `Prisma`. The core business logic has been centralized into a framework-agnostic `@codexcrm/api` package.

### **1.2. The Problem:**

The primary front-end application, `apps/web`, was "gutted" during this refactoring and has now been restored from a functional backup. However, this restored application shell is still wired to the old, now-defunct data access patterns. It attempts to call functions and use types that no longer exist, resulting in a completely non-functional, un-buildable application.

### **1.3. The Goal (The "What"):**

The goal of Project Phoenix is to **fully integrate the `apps/web` application shell with the new backend architecture**. This involves systematically refactoring all server-side data fetching and all client-side data mutations to use the new, centralized tRPC/Prisma stack. The primary deliverable is a fully functional, buildable, and deployable web application where all features (contact management, dashboard, etc.) operate correctly on the new foundation.

## **2. Core Principles & Architecture (The "Why")**

Any engineer working on this project must adhere to the following architectural principles:

- **Principle of Single Responsibility:**
  - **`apps/web`:** Responsible for UI, routing, and handling HTTP requests/cookies. **It contains no direct database logic.**
  - **`@codexcrm/api`:** The _only_ place where business logic and database queries reside. It defines the application's capabilities (e.g., "create a contact," "get dashboard metrics").
  - **`@codexcrm/database`:** Provides the `Prisma` client. Nothing more.
  - **`@codexcrm/auth`:** A simple utility for sharing TypeScript `types` only. Contains no logic.

- **Principle of Type-Safe Contracts:** All data flow between the frontend (`apps/web`) and the backend (`@codexcrm/api`) **must** go through the tRPC client. This ensures end-to-end type safety and eliminates an entire class of runtime errors. There will be no direct calls to REST endpoints for our own data.

- **Principle of Server-Side Logic:** All interactions with the database (`Prisma`) and third-party APIs (AI/LLMs) **must** occur within the `@codexcrm/api` package. The frontend is not trusted with secrets or direct data access.

## **3. The Task at Hand: The Implementation Plan**

This is the handover guide. The core task is a **"Search and Replace"** mission across the `apps/web` codebase, replacing old patterns with new ones.

### **3.1. Prerequisite: Verify the Foundation**

Before starting, ensure the backend packages are correctly structured as per our latest architectural decisions.

- `@codexcrm/api` must correctly create and export its `appRouter` and `createContext` function.
- The `apps/web/app/api/trpc/[trpc]/route.ts` file must be correctly set up to handle requests and pass them to the `appRouter`.

### **3.2. The Refactoring Workflow (The "How")**

The engineer will systematically audit and refactor the `apps/web` directory, focusing on any file that fetches or mutates data.

#### **Task A: Server Component Data Fetching**

- **Identify:** Locate all Server Components (any `.tsx` file in the `app` directory that does **not** have a `"use client"` directive) that use `async/await`. These components likely contain old, direct calls to a Supabase client.
- **Old Pattern (to be deleted):**

  ```tsx
  // Example: app/contacts/page.tsx
  import { createServerSupabaseClient } from '@/lib/supabase/server'; // OLD PATTERN

  export default async function ContactsPage() {
    const supabase = createServerSupabaseClient(); // OLD PATTERN
    const { data: contacts } = await supabase.from('contacts').select('*'); // OLD PATTERN

    return <ContactsTable data={contacts} />;
  }
  ```

- **New Pattern (to be implemented):**
  - Create a server-side tRPC client helper. This is a critical piece.
  - **`apps/web/lib/trpc/server-client.ts`:**

    ```typescript
    import { appRouter } from '@codexcrm/api/root';
    import { createContext } from '@codexcrm/api/context';

    // This server client allows you to call your API from Server Components
    // without making an HTTP request.
    export const api = appRouter.createCaller(await createContext({} as any)); // We pass a mock request context; the real one is created server-side when needed
    ```

  - Refactor the Server Component to use this new server client.

    ```tsx
    // Example: app/contacts/page.tsx
    import { api } from '@/lib/trpc/server-client'; // NEW PATTERN
    import { ContactsTable } from '@/components/contacts-table'; // UI Component

    export default async function ContactsPage() {
      // Fetch data through the type-safe tRPC API layer
      const contacts = await api.contact.getAll(); // NEW PATTERN

      return <ContactsTable data={contacts} />;
    }
    ```

#### **Task B: Client Component Data Fetching & Mutations**

- **Identify:** Locate all Client Components (`"use client"`) that use `useEffect` to fetch data or `fetch()` to submit forms.
- **Old Pattern (to be deleted):**

  ```tsx
  // Example: components/some-form.tsx
  const handleSubmit = async (data) => {
    await fetch('/api/contacts', { method: 'POST', body: JSON.stringify(data) }); // OLD PATTERN
  };
  ```

- **New Pattern (to be implemented):**
  - Use the client-side tRPC hooks (`@tanstack/react-query`).
  - **`apps/web/lib/trpc/client.ts`:** Ensure the client-side tRPC provider is set up correctly.
  - Refactor the component.

    ```tsx
    // Example: components/some-form.tsx
    'use client';
    import { trpc } from '@/lib/trpc/client'; // NEW PATTERN

    export function SomeForm() {
      const createContactMutation = trpc.contact.create.useMutation(); // NEW PATTERN

      const handleSubmit = (data) => {
        createContactMutation.mutate(data);
      };

      // ...
    }
    ```

#### **Task C: Server Actions**

- **Identify:** Locate any files in `apps/web/actions`. These were likely used for form submissions.
- **Old Pattern (to be deleted):**

  ```typescript
  // Example: actions/contact-actions.ts
  'use server';
  import { createServerSupabaseClient } from '@/lib/supabase/server'; // OLD PATTERN

  export async function createContact(formData: FormData) {
    const supabase = createServerSupabaseClient(); // OLD PATTERN
    // ... logic to create contact ...
  }
  ```

- **New Pattern (to be implemented):**
  - Server Actions will now become thin wrappers around our tRPC API calls. This maintains the principle that all business logic lives in `@codexcrm/api`.

    ```typescript
    // Example: actions/contact-actions.ts
    'use server';
    import { api } from '@/lib/trpc/server-client'; // NEW PATTERN
    import { revalidatePath } from 'next/cache';

    export async function createContact(data: { fullName: string; email: string }) {
      try {
        await api.contact.create(data); // NEW PATTERN
        revalidatePath('/contacts'); // Revalidate the cache to show the new contact
        return { success: true };
      } catch (error) {
        return { success: false, error: 'Failed to create contact.' };
      }
    }
    ```

## **4. Acceptance Criteria**

The project is considered complete when:

1. The `apps/web` application successfully builds via `pnpm exec turbo build` with zero errors.
2. The application can be run locally via `pnpm exec turbo dev`.
3. User authentication (login/logout) is fully functional.
4. All major CRM features are working correctly, including:
   - Viewing the contact list and contact details.
   - Creating, updating, and deleting a contact.
   - Viewing the main dashboard with its data widgets.
5. There are no remaining direct calls to `supabase.from(...)` for database operations within the `apps/web` codebase. All such calls have been replaced by `api.*` or `trpc.*` calls.

This PRD provides the mission brief. The task is clear: refactor `apps/web` to be a pure consumer of the new, centralized `@codexcrm/api` layer, following the patterns outlined above.
