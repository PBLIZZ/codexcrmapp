# Client → Contact Migration Tracker

This file tracks every reference to "client(s)" in the codebase, categorized by context. Check off each reference as it is converted or removed. Use this as the single source of truth for migration progress.

Legend:
- [ ] = Not yet converted
- [x] = Completed
- **A** = Already has a parallel "contact(s)" implementation (duplicated)
- **B** = Needs to be converted/renamed to "contact(s)"

---

## UI (Components, Pages, UI Text)
| Status | Category | File | Line | Snippet |
|--------|----------|------|------|---------|
| [ ] | B | apps/web/components/dashboard/DashboardContent.tsx | 45 | `const { data: contacts, isLoading, error } = api.clients.list.useQuery();` |
| [ ] | B | apps/web/components/dashboard/DashboardContent.tsx | 220 | `/* Recent Clients Tab */` |
| [ ] | B | apps/web/app/groups/ClientGroups.tsx | 123 | `Organize your clients into meaningful groups` |
| [ ] | B | apps/web/app/groups/ClientGroups.tsx | 166 | `{group.contactCount || 0} clients` |
| [ ] | B | apps/web/app/groups/ClientGroups.tsx | 179 | `Click to view all clients in this group` |
| [ ] | B | apps/web/app/groups/ClientGroups.tsx | 195 | `Create a new group to organize your clients` |
| [ ] | B | apps/web/app/groups/ClientGroups.tsx | 222 | `Create a new group to organize your clients` |
| [ ] | B | apps/web/app/groups/README.md | 8 | `premium clients, leads, business contacts` |
| [ ] | B | apps/web/app/contacts/README.md | 49 | `Contacts are stored in the 'clients' database table` |

## Routers (tRPC Routers, API Endpoints)
| Status | Category | File | Line | Snippet |
|--------|----------|------|------|---------|
| [ ] | B | packages/server/src/root.ts | 7 | `clients: clientRouter, // Original client router (keeping for backward compatibility)` |
| [ ] | B | packages/server/src/routers/client.ts | 46 | `// Protected procedure for listing authenticated user's clients` |
| [ ] | B | packages/server/src/routers/client.ts | 89 | `// Protected procedure for creating/updating clients` |
| [ ] | B | packages/server/src/routers/client.ts | 55 | `.from('clients')` (DB table, keep for now) |
| [ ] | B | packages/server/src/routers/client.ts | 61 | `console.error("Error fetching clients (RLS scope):", error);` |
| [ ] | B | packages/server/src/routers/client.ts | 62 | `throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch clients' });` |
| [ ] | B | packages/server/src/routers/client.ts | 74 | `.from('clients')` (DB table, keep for now) |
| [ ] | B | packages/server/src/routers/client.ts | 121 | `.from('clients')` (DB table, keep for now) |
| [ ] | B | packages/server/src/routers/client.ts | 140 | `.from('clients')` (DB table, keep for now) |
| [ ] | B | packages/server/src/routers/client.ts | 183 | `.from('clients')` (DB table, keep for now) |
| [ ] | B | packages/server/src/routers/group.ts | 240 | `.from('clients')` (DB table, keep for now) |
| [ ] | B | packages/server/src/routers/group.ts | 365 | `clients:client_id (*)` (join alias, keep for now) |
| [ ] | B | packages/server/src/routers/group.ts | 378 | `return data?.map((item: { clients: Record<string, unknown> }) => item.clients) || [];` |

## Types & Interfaces
| Status | Category | File | Line | Snippet |
|--------|----------|------|------|---------|
| [ ] | B | packages/db/src/types.ts | 12 | `clients: {` |
| [ ] | B | packages/db/src/types.ts | 91 | `export type Client = Tables<'clients'>` |
| [ ] | B | packages/db/src/index.ts | 6 | `export type Client = Tables<'clients'>;` |
| [ ] | B | packages/db/dist/types.d.ts | 7 | `clients: {` |
| [ ] | B | packages/db/dist/types.d.ts | 77 | `export type Client = Tables<'clients'>;` |
| [ ] | B | packages/db/dist/index.d.ts | 3 | `export type Client = Tables<'clients'>;` |
| [ ] | B | packages/db/src/database.types.ts | 37 | `clients: {` |

## Utilities & Helpers
| Status | Category | File | Line | Snippet |
|--------|----------|------|------|---------|
| [ ] | B | apps/web/lib/supabase/utils.ts | 15 | `* const { data, error } = await queryTyped('clients')` |
| [ ] | B | apps/web/lib/supabase/utils.ts | 20 | `* const clients: Tables['clients']['Row'][] = data;` |
| [ ] | B | apps/web/lib/supabase/utils.ts | 31 | `* const { data, error } = await queryServerTyped(supabase, 'clients')` |
| [ ] | B | apps/web/lib/supabase/utils.ts | 36 | `* const clients: Tables['clients']['Row'][] = data;` |
| [ ] | B | apps/web/lib/supabase/client.ts | 1 | `// apps/web/lib/supabase/client.ts` |
| [ ] | B | apps/web/lib/supabase/client.ts | 4 | `// Enhanced Supabase client with debugging for authentication` |
| [ ] | B | apps/web/lib/supabase/client.ts | 5 | `const supabaseClient = createBrowserClient(` |
| [ ] | B | apps/web/lib/supabase/client.ts | 19 | `// Export the enhanced client` |
| [ ] | B | apps/web/lib/supabase/client.ts | 20 | `export const supabase = supabaseClient;` |

## Middleware & Config
| Status | Category | File | Line | Snippet |
|--------|----------|------|------|---------|
| [ ] | B | apps/web/middleware.ts | 5 | `const protectedPaths = ['/', '/dashboard', '/clients', '/contacts', '/groups'];` |

## Docs & Miscellaneous
| Status | Category | File | Line | Snippet |
|--------|----------|------|------|---------|
| [ ] | B | README.md | 90 | `clients tRPC router created with a protected list procedure.` |
| [ ] | B | README.md | 91 | `/clients page displays a list of clients for authenticated users.` |
| [ ] | B | README.md | 97 | `Implement full CRUD operations for Clients.` |
| [ ] | B | ESLINT-FIXES.md | 121 | `/packages/server/src/routers/client.ts and contact.ts` |

## Database (Table name 'clients' - keep for now)
| Status | Category | File | Line | Snippet |
|--------|----------|------|------|---------|
| [ ] | B | supabase/migrations/20250524233000_consolidate_client_company_and_avatar_columns.sql | 5 | `WHERE table_name = 'clients' AND column_name = 'company'` |
| [ ] | B | supabase/migrations/20250524233000_consolidate_client_company_and_avatar_columns.sql | 8 | `UPDATE clients` |
| [ ] | B | supabase/migrations/20250524233000_consolidate_client_company_and_avatar_columns.sql | 22 | `UPDATE clients` |
| [ ] | B | supabase/migrations/20250524233000_consolidate_client_company_and_avatar_columns.sql | 33 | `ALTER TABLE clients DROP COLUMN company;` |
| [ ] | B | supabase/migrations/20250524233000_consolidate_client_company_and_avatar_columns.sql | 41 | `ALTER TABLE clients DROP COLUMN avatar_url;` |
| [ ] | B | supabase/migrations/20250524170327_add_client_details_fields.sql | 1 | `-- Migration to update clients table with missing fields` |
| [ ] | B | supabase/migrations/20250524170327_add_client_details_fields.sql | 8 | `WHERE table_name = 'clients' AND column_name = 'company_name'` |
| [ ] | B | supabase/migrations/20250524170327_add_client_details_fields.sql | 9 | `ALTER TABLE clients ADD COLUMN company_name TEXT;` |
| [ ] | B | supabase/migrations/20250524170327_add_client_details_fields.sql | 17 | `WHERE table_name = 'clients' AND column_name = 'job_title'` |
| [ ] | B | supabase/migrations/20250524170327_add_client_details_fields.sql | 18 | `ALTER TABLE clients ADD COLUMN job_title TEXT;` |

---

**Instructions:**
- When you convert a reference, change `[ ]` to `[x]`.
- If you find a reference is already handled by a parallel "contact(s)" implementation, mark as **A**.
- If you convert a reference, update the snippet if needed.
- Add new entries as you discover more references.

---

_Last updated: 2025-05-27_


This file tracks every reference to "client(s)" in the codebase. As each reference is converted or removed, check it off. Use this file as the single source of truth for migration progress.

Legend:
- [ ] = Not yet converted
- [x] = Completed
- **A** = Already has a parallel "contact(s)" implementation (duplicated)
- **B** = Needs to be converted/renamed to "contact(s)"

---

| Status | Category | File | Line | Snippet |
|--------|----------|------|------|---------|
| [ ] | B | apps/web/components/dashboard/DashboardContent.tsx | 45 | `const { data: contacts, isLoading, error } = api.clients.list.useQuery();` |
| [ ] | B | apps/web/components/dashboard/DashboardContent.tsx | 220 | `/* Recent Clients Tab */` |
| [ ] | B | apps/web/app/groups/ClientGroups.tsx | 123 | `Organize your clients into meaningful groups` |
| [ ] | B | apps/web/app/groups/ClientGroups.tsx | 166 | `{group.contactCount || 0} clients` |
| [ ] | B | apps/web/app/groups/ClientGroups.tsx | 179 | `Click to view all clients in this group` |
| [ ] | B | apps/web/app/groups/ClientGroups.tsx | 195 | `Create a new group to organize your clients` |
| [ ] | B | apps/web/app/groups/ClientGroups.tsx | 222 | `Create a new group to organize your clients` |
| [ ] | B | packages/server/src/root.ts | 7 | `clients: clientRouter, // Original client router (keeping for backward compatibility)` |
| [ ] | B | packages/server/src/routers/client.ts | 46 | `// Protected procedure for listing authenticated user's clients` |
| [ ] | B | packages/server/src/routers/client.ts | 55 | `.from('clients')` (DB table, keep for now) |
| [ ] | B | packages/server/src/routers/client.ts | 61 | `console.error("Error fetching clients (RLS scope):", error);` |
| [ ] | B | packages/server/src/routers/client.ts | 62 | `throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch clients' });` |
| [ ] | B | packages/server/src/routers/client.ts | 74 | `.from('clients')` (DB table, keep for now) |
| [ ] | B | packages/server/src/routers/client.ts | 89 | `// Protected procedure for creating/updating clients` |
| [ ] | B | packages/server/src/routers/client.ts | 121 | `.from('clients')` (DB table, keep for now) |
| [ ] | B | packages/server/src/routers/client.ts | 140 | `.from('clients')` (DB table, keep for now) |
| [ ] | B | packages/server/src/routers/client.ts | 183 | `.from('clients')` (DB table, keep for now) |
| [ ] | B | packages/server/src/routers/group.ts | 240 | `.from('clients')` (DB table, keep for now) |
| [ ] | B | packages/server/src/routers/group.ts | 365 | `clients:client_id (*)` (join alias, keep for now) |
| [ ] | B | packages/server/src/routers/group.ts | 378 | `return data?.map((item: { clients: Record<string, unknown> }) => item.clients) || [];` |

<!-- Add more entries as the migration proceeds -->

---

**Instructions:**
- When you convert a reference, change `[ ]` to `[x]`.
- If you find a reference is already handled by a parallel "contact(s)" implementation, mark as **A**.
- If you convert a reference, update the snippet if needed.
- Add new entries as you discover more references.

---

_Last updated: 2025-05-27_
