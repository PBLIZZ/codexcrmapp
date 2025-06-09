# PRD: Rename `clients` Table and Codebase References to `contacts`

## 1. Introduction/Overview

This document outlines the requirements for refactoring the CodexCRM application to rename the primary entity and database table from `clients` to `contacts`. This change aims to improve code clarity, reduce potential naming conflicts (e.g., with "client-side" terminology or similarly named files), and align the terminology more accurately with the data being stored. The core goal is to enhance developer understanding and maintainability of the codebase.

## 2. Goals

*   Rename the Supabase database table from `clients` to `contacts`.
*   Update all backend code (tRPC routers, Supabase queries, service logic, type definitions) to use `contacts` instead of `clients`.
*   Update all frontend code (components, API calls, type definitions, UI text) to use `contacts` instead of `clients`.
*   Ensure all existing functionality related to the former `clients` entity continues to work seamlessly with the new `contacts` naming.
*   Maintain a clear distinction between `contact` (the entity) and `client` (as in client-side).

## 3. Impact on Users & Developer Experience

*   **End Users:** End users should experience no change in application functionality. UI text referring to "Clients" (e.g., "Manage Clients", "Add New Client") will be updated to "Contacts" (e.g., "Manage Contacts", "Add New Contact") for consistency.
*   **Developers:**
    *   Reduced ambiguity in the codebase regarding the term "client".
    *   Improved consistency in naming conventions.
    *   Easier onboarding for new developers due to more intuitive naming.

## 4. Scope of Changes

*   **Database:**
    *   Generate and apply a SQL migration script to rename the `clients` table to `contacts` in Supabase (e.g., `ALTER TABLE clients RENAME TO contacts;`).
    *   Update any related database objects (views, functions, Row Level Security policies) if they explicitly reference the `clients` table name.
*   **Backend (`packages/server`):**
    *   Rename tRPC routers (e.g., `clientRouter` to `contactRouter`).
    *   Update Zod schemas and type definitions.
    *   Modify Supabase query builder calls.
    *   Update service logic and helper functions.
    *   Rename files and directories if their names are based on "client" (e.g., `client.ts` to `contact.ts`).
*   **Frontend (`apps/web`):**
    *   Update tRPC client calls (e.g., `api.clients.list` to `api.contacts.list`).
    *   Update component props, state, and internal logic.
    *   Rename components, files, and directories if their names are based on "client" (e.g., `ClientForm.tsx` to `ContactForm.tsx`).
    *   Update UI text, labels, and navigation items (e.g., "Clients" page title to "Contacts").
*   **Shared Code/Types (`packages/*`):**
    *   Update any shared type definitions or utility functions.
*   **Documentation & Comments:**
    *   Update inline code comments and any relevant documentation to reflect the new naming.

## 5. Non-Goals (Out of Scope)

*   Changes to the meaning or usage of "client" when referring to client-side rendering, client-server architecture, or Supabase client instances (e.g., `createBrowserClient`, `createServerClient`). These usages should remain unchanged.
*   Introduction of new features or functional changes beyond the renaming.
*   Major architectural refactoring unrelated to the renaming task.

## 6. Data Requirements

*   The existing schema of the `clients` table (columns, types, constraints, relationships) will be preserved in the new `contacts` table. Only the table name changes.
*   All existing data within the `clients` table must be preserved and accessible via the new `contacts` table name after the migration.
*   Row Level Security (RLS) policies for the `clients` table must be correctly migrated/re-applied to the `contacts` table.

## 7. UI/UX Considerations

*   All UI elements previously referring to "Clients" (e.g., page titles, button labels, table headers, form fields, navigation links) should be updated to "Contacts".
*   The user experience should remain consistent, with no disruption to workflows.

## 8. Acceptance Criteria

*   A SQL migration script (e.g., `ALTER TABLE clients RENAME TO contacts;` and any necessary RLS updates) is created and successfully applied to the Supabase database.
*   All instances of `client` (referring to the entity) in the codebase (backend, frontend, shared packages) are replaced with `contact`.
*   File and directory names like `clients.ts`, `clientRouter.ts`, `ClientForm.tsx` are renamed to `contacts.ts`, `contactRouter.ts`, `ContactForm.tsx`, etc., where appropriate.
*   The application builds successfully without any errors related to the renaming.
*   The application runs, and all previously functional features related to "clients" now work correctly as "contacts".
*   **Thorough frontend testing confirms:**
    *   Login and logout functionality remains unaffected.
    *   Photo uploads for contacts work correctly.
    *   Users can successfully create new contacts (formerly "create client").
    *   Users can successfully use the "quick contact" feature.
    *   Users can successfully create new groups (formerly "add group").
    *   Users can successfully use the "quick group" feature.
    *   All tRPC routes that were modified (e.g., those previously part of a `clientRouter`) are tested and functional.
*   Code reviews confirm that "client" is only used for client-side/server-side distinctions and not for the data entity.

## 9. Potential Edge Cases/Risks

*   **Missed References:** Hardcoded strings, comments, or less obvious usages of "client" might be missed. A thorough search strategy will be needed.
*   **RLS Policies:** Ensuring RLS policies are correctly transferred or updated for the new table name `contacts` is critical for data security. This might involve dropping and recreating policies for the new table name.
*   **External Integrations (if any):** If any external systems rely on the `clients` table name, they would need to be updated (though none are explicitly mentioned for this project so far).
*   **Cached Client-Side Schemas/Types:** Ensure any client-side caching or code generation related to tRPC or database schemas is properly updated/invalidated.
