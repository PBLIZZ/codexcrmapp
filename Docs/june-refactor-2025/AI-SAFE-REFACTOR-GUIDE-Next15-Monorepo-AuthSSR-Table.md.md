# CodexCRM Monorepo Refactor PRD v2.0

**Version**: 2.0  
**Date**: June 23, 2025  
**Status**: AI-Implementation Ready  
**Tech Stack**: React 19, Next.js 15, tRPC 11, Supabase SSR, TanStack Table v8
**Subtitle**: Surgical Migration Playbook for CodexCRM with AI Implementation Safeguards
**Purpose**: Preserve working OAuth while modernizing to monorepo structure

## Executive Summary

This PRD provides a surgical refactor strategy specifically designed for AI-assisted implementation in a monorepo structure. It includes safeguards against common AI coding mistakes and ensures strict compliance with the latest documentation.

## 1. Monorepo Structure & Dependencies

### 1.1 Current Structure Analysis

```
codexcrm/
├── apps/
│   └── web/                    # Next.js 15 app
├── packages/
│   ├── ui/                     # Shared UI components
│   ├── database/               # Prisma/Supabase types & schemas
│   ├── api/                    # tRPC routers & procedures
│   └── config/                 # Shared configs (ESLint, TS, etc.)
├── turbo.json                  # Turborepo config
├── pnpm-workspace.yaml         # PNPM workspace
└── package.json                # Root package.json
```

### 1.2 Dependency Resolution Strategy

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
# Key: Use workspace protocol for internal deps
# Example: "@codexcrm/ui": "workspace:*"
```

### 1.3 AI Implementation Guardrails

**CRITICAL: Every file MUST include these headers to prevent AI mistakes:**

```typescript
// For Server Components
// @SERVER-COMPONENT - Next.js 15 App Router
// @NO-USE-CLIENT - This file must NOT have 'use client'
// @ASYNC-ALLOWED - Can use async/await at component level

// For Client Components
// @CLIENT-COMPONENT - Requires interactivity
// @USE-CLIENT-REQUIRED - Must have 'use client' directive
// @NO-ASYNC - Cannot be async function

// For API Routes
// @ROUTE-HANDLER - Next.js 15 Route Handler
// @HTTP-METHODS: GET, POST, etc.
// @NO-DEFAULT-EXPORT - Must export named functions
```

## 2. Routing Architecture (Next.js 15 Compliant)

### 2.1 Route Structure with Proper Patterns

```
apps/web/app/
├── (auth)/                     # Route group (no URL impact)
│   ├── login/
│   │   ├── page.tsx           # @SERVER-COMPONENT
│   │   └── _components/       # Private folder (not routed)
│   │       └── login-form.tsx # @CLIENT-COMPONENT
│   └── layout.tsx             # Shared auth layout
│
├── (dashboard)/               # Protected route group
│   ├── layout.tsx            # @SERVER-COMPONENT - Auth check here
│   ├── contacts/
│   │   ├── page.tsx          # @SERVER-COMPONENT - Data fetching
│   │   ├── loading.tsx       # Loading UI
│   │   ├── error.tsx         # Error boundary @CLIENT-COMPONENT
│   │   ├── [contactId]/      # Dynamic route
│   │   │   ├── page.tsx
│   │   │   ├── edit/
│   │   │   │   └── page.tsx
│   │   │   └── @modal/       # Parallel route for modals
│   │   │       └── notes/
│   │   │           └── page.tsx
│   │   └── _components/      # Private client components
│   │       ├── contacts-table.tsx
│   │       └── contact-form.tsx
│   └── default.tsx           # Default for parallel routes
│
├── api/                       # API routes
│   ├── trpc/
│   │   └── [trpc]/
│   │       └── route.ts      # @ROUTE-HANDLER
│   └── auth/
│       └── callback/
│           └── route.ts      # @ROUTE-HANDLER
│
└── layout.tsx                 # Root layout @SERVER-COMPONENT
```

### 2.2 Server Component Data Fetching Pattern

```typescript
// @SERVER-COMPONENT - Next.js 15 App Router
// @NO-USE-CLIENT - This file must NOT have 'use client'
// @ASYNC-ALLOWED - Can use async/await at component level

import { createClient } from '@/lib/supabase/server'
import { ContactsTable } from './_components/contacts-table'
import { Suspense } from 'react'
import { ContactsTableSkeleton } from './_components/contacts-table-skeleton'

// Server Component - Can be async
export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Direct database query in server component
  const { data: initialContacts } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<ContactsTableSkeleton />}>
        <ContactsTable
          initialData={initialContacts}
          searchParams={params}
        />
      </Suspense>
    </div>
  )
}
```

## 3. Component Extraction Strategy

### 3.1 Package Structure

```
packages/ui/
├── src/
│   ├── components/
│   │   ├── table/              # TanStack Table components
│   │   │   ├── data-table.tsx
│   │   │   ├── data-table-toolbar.tsx
│   │   │   ├── data-table-pagination.tsx
│   │   │   └── index.ts
│   │   ├── form/               # React Hook Form components
│   │   │   ├── form-field.tsx
│   │   │   ├── form-select.tsx
│   │   │   └── index.ts
│   │   └── ui/                 # shadcn/ui primitives
│   │       ├── button.tsx
│   │       ├── dialog.tsx
│   │       └── index.ts
│   ├── hooks/                  # Shared hooks
│   │   ├── use-debounce.ts
│   │   └── use-media-query.ts
│   └── index.ts               # Main export
├── package.json
└── tsconfig.json
```

### 3.2 Shared Component Example

```typescript
// packages/ui/src/components/table/data-table.tsx
// @CLIENT-COMPONENT - Requires interactivity
// @USE-CLIENT-REQUIRED - Must have 'use client' directive
// @GENERIC-COMPONENT - Type-safe with generics

'use client'

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
  type Table as TanstackTable,
} from '@tanstack/react-table'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  table?: TanstackTable<TData>
}

export function DataTable<TData, TValue>({
  columns,
  data,
  table: externalTable,
}: DataTableProps<TData, TValue>) {
  const internalTable = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const table = externalTable || internalTable

  return (
    <div className="rounded-md border">
      {/* Table implementation */}
    </div>
  )
}
```

## 4. Database & API Layer

### 4.1 Supabase Edge Functions vs tRPC

```typescript
// packages/api/src/context.ts
// @SERVER-ONLY - Cannot be imported in client components

import { createClient } from '@codexcrm/database/server';
import type { User } from '@supabase/supabase-js';

export interface Context {
  supabase: ReturnType<typeof createClient>;
  user: User | null;
}

// packages/api/src/routers/contacts.ts
import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';

export const contactsRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        page: z.number().default(0),
        limit: z.number().default(50),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Implementation
    }),
});
```

### 4.2 Database Package Structure

```typescript
// packages/database/src/types.ts
// Auto-generated from Supabase

export type Database = {
  public: {
    Tables: {
      contacts: {
        Row: {
          id: string;
          user_id: string;
          first_name: string;
          last_name: string;
          // ... rest of schema
        };
        Insert: {
          // Insert types
        };
        Update: {
          // Update types
        };
      };
    };
  };
};

// packages/database/src/client.ts
// @BROWSER-SAFE - Can be used in client components

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

## 5. Authentication Patterns (Latest Supabase SSR)

### 5.1 Server-Side Auth Check

```typescript
// apps/web/app/(dashboard)/layout.tsx
// @SERVER-COMPONENT - Next.js 15 App Router
// @AUTH-GUARD - Protects all child routes

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // CRITICAL: Use getUser() not getSession()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen">
      {/* Layout UI */}
      {children}
    </div>
  )
}
```

### 5.2 Middleware Pattern

```typescript
// apps/web/middleware.ts
// @MIDDLEWARE - Runs on every request
// @EDGE-RUNTIME - Limited API surface

import { updateSession } from '@/lib/supabase/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Update session
  const response = await updateSession(request);

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
```

## 6. State Management & Data Fetching

### 6.1 TanStack Query Configuration

```typescript
// apps/web/app/providers.tsx
// @CLIENT-COMPONENT - Provides context
// @USE-CLIENT-REQUIRED - Must have 'use client' directive

'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

// CRITICAL: Prevent hydration errors
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: reuse client
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(getQueryClient)

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}
```

### 6.2 Server/Client Data Bridge Pattern

```typescript
// apps/web/app/(dashboard)/contacts/_components/contacts-table.tsx
// @CLIENT-COMPONENT - Interactive table
// @HYDRATION-SAFE - Handles SSR/CSR transition

'use client'

import { api } from '@/lib/trpc/react'
import { DataTable } from '@codexcrm/ui/components/table'

interface ContactsTableProps {
  initialData?: Contact[]
  searchParams?: Record<string, string | string[] | undefined>
}

export function ContactsTable({ initialData = [], searchParams }: ContactsTableProps) {
  // Use initialData for instant loading
  const { data, isLoading } = api.contacts.list.useQuery(
    {
      search: searchParams?.search as string,
      page: Number(searchParams?.page) || 0,
    },
    {
      initialData: { contacts: initialData, total: initialData.length },
      refetchOnMount: false, // Prevent double fetch
    }
  )

  return <DataTable columns={columns} data={data?.contacts || []} />
}
```

## 7. File-by-File Migration Strategy

### 7.1 Migration Order (Dependency-First)

```markdown
## Phase 1: Infrastructure (Day 1)

1. packages/config/\* - ESLint, TypeScript, Prettier configs
2. packages/database/\* - Types and client setup
3. packages/api/src/trpc.ts - Base tRPC setup
4. apps/web/lib/supabase/\* - Auth utilities

## Phase 2: Shared Components (Day 2)

1. packages/ui/src/components/ui/\* - shadcn primitives
2. packages/ui/src/components/form/\* - Form components
3. packages/ui/src/components/table/\* - Table components

## Phase 3: API Layer (Day 3)

1. packages/api/src/context.ts
2. packages/api/src/routers/auth.ts
3. packages/api/src/routers/contacts.ts
4. apps/web/app/api/trpc/[trpc]/route.ts

## Phase 4: App Routes (Day 4-5)

1. apps/web/app/layout.tsx - Root layout
2. apps/web/app/(auth)/layout.tsx
3. apps/web/app/(auth)/login/page.tsx
4. apps/web/app/(dashboard)/layout.tsx
5. apps/web/app/(dashboard)/contacts/page.tsx
```

### 7.2 Validation Checklist per File

```markdown
## Pre-Implementation Validation

- [ ] File has correct header comment (@SERVER-COMPONENT, etc.)
- [ ] Import paths use workspace protocol where applicable
- [ ] No mixing of server/client code
- [ ] Error boundaries in place for client components
- [ ] Loading states for async operations

## Post-Implementation Validation

- [ ] TypeScript: No errors with strict mode
- [ ] ESLint: Zero errors (warnings acceptable)
- [ ] Component renders without hydration errors
- [ ] Data fetching follows patterns (server components or tRPC)
- [ ] Authentication checks in correct location
```

## 8. Common AI Implementation Mistakes & Prevention

### 8.1 Client/Server Component Confusion

**AI Mistake**: Putting 'use client' on everything or using hooks in server components

**Prevention Strategy**:

```typescript
// TEMPLATE for AI: Server Component
// @SERVER-COMPONENT - Next.js 15 App Router
// @NO-USE-CLIENT - This file must NOT have 'use client'
// @NO-HOOKS - Cannot use useState, useEffect, etc.

// TEMPLATE for AI: Client Component
// @CLIENT-COMPONENT - Requires interactivity
// @USE-CLIENT-REQUIRED - Must have 'use client' directive
// @HOOKS-ALLOWED - Can use React hooks
```

### 8.2 Async Component Mistakes

**AI Mistake**: Making client components async or not handling promises in server components

**Prevention Strategy**:

```typescript
// ❌ AI WILL TRY THIS (WRONG)
'use client'
export default async function ClientComponent() { // ERROR!

// ✅ CORRECT PATTERN
export default async function ServerComponent() {
  const data = await fetchData() // Only in server components
  return <ClientComponent data={data} />
}
```

### 8.3 Route Handler Confusion

**AI Mistake**: Using getServerSideProps or API routes incorrectly

**Prevention Strategy**:

```typescript
// apps/web/app/api/example/route.ts
// @ROUTE-HANDLER - Next.js 15 Route Handler
// @NO-DEFAULT-EXPORT - Must use named exports
// @HTTP-METHODS: GET, POST

import { NextRequest, NextResponse } from 'next/server';

// ✅ CORRECT: Named exports for HTTP methods
export async function GET(request: NextRequest) {
  return NextResponse.json({ data: 'example' });
}

// ❌ WRONG: Default export (AI might try this)
// export default function handler() {}
```

### 8.4 Supabase Auth Patterns

**AI Mistake**: Using deprecated getSession() or client-side auth in server components

**Prevention Strategy**:

```typescript
// ✅ CORRECT: Server Component Auth
import { createClient } from '@/lib/supabase/server';

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser(); // NOT getSession()
}

// ✅ CORRECT: Client Component Auth
('use client');
import { createClient } from '@/lib/supabase/client';

export function ClientComponent() {
  const supabase = createClient(); // No await in client
}
```

### 8.5 Import Path Errors

**AI Mistake**: Incorrect import paths in monorepo

**Prevention Strategy**:

```typescript
// ✅ CORRECT: Workspace imports
import { Button } from '@codexcrm/ui/components/ui';
import { createClient } from '@codexcrm/database/client';

// ❌ WRONG: Relative imports across packages
import { Button } from '../../../packages/ui/src/components/ui/button';
```

## 9. Testing Strategy for AI Implementation

### 9.1 Smoke Tests After Each Phase

```bash
# Run after each major component
pnpm turbo run type-check --filter=web
pnpm turbo run lint --filter=web
pnpm turbo run build --filter=web

# Critical: Test auth flow manually
# 1. Sign up new user
# 2. Confirm email
# 3. Login
# 4. Access protected route
# 5. Logout
```

### 9.2 Component Isolation Testing

```typescript
// Test each component in isolation first
// apps/web/app/test/[component]/page.tsx

import { ContactsTable } from '@/app/(dashboard)/contacts/_components/contacts-table'

export default function TestPage() {
  return (
    <div className="p-8">
      <h1>Component Test: ContactsTable</h1>
      <ContactsTable initialData={mockData} />
    </div>
  )
}
```

## 10. Rollback Points & Recovery

### 10.1 Git Strategy

```bash
# Create a branch for each phase
git checkout -b refactor/phase-1-infrastructure
# Commit frequently with descriptive messages
git add -A && git commit -m "refactor: setup monorepo packages structure"

# Tag stable points
git tag -a stable-auth-working -m "Authentication flow verified"
```

### 10.2 Database Rollback Plan

```sql
-- Before schema changes, create backup
CREATE TABLE contacts_backup AS SELECT * FROM contacts;

-- Rollback procedure
DROP TABLE contacts;
ALTER TABLE contacts_backup RENAME TO contacts;
```

## 11. Implementation Timeline with AI Tools

### Day 1: Infrastructure Setup

**Tool**: Claude 3.7 on Windsurf Cascade

- Set up monorepo structure
- Configure packages
- Create base utilities

### Day 2-3: Component Library

**Tool**: Claude Code Sonnet 4 CLI

- Build reusable components
- Set up Storybook (optional)
- Create component tests

### Day 4-5: Application Routes

**Tool**: Mix of both based on complexity

- Implement auth flow
- Create main routes
- Add error boundaries

### Day 6: Integration & Testing

**Tool**: Manual + AI assistance

- Full system test
- Performance audit
- Bug fixes

## 12. Success Criteria

### Technical Metrics

- [ ] Zero TypeScript errors in strict mode
- [ ] All routes load < 200ms (after initial load)
- [ ] Auth flow works with cookie refresh
- [ ] No hydration errors in console
- [ ] Bundle size < 150KB for initial JS

### Functional Requirements

- [ ] User can sign up, confirm email, login
- [ ] Contacts table loads with proper pagination
- [ ] Create, read, update, delete contacts works
- [ ] Bulk actions functional
- [ ] Notes system operational

## 13. AI Instruction Template

When implementing with AI, use this template for EVERY request:

```
I need you to implement [specific component/feature] following these rules:

1. This is a Next.js 15 App Router project using React 19
2. File location: [exact path]
3. Component type: [SERVER-COMPONENT or CLIENT-COMPONENT]
4. Dependencies: [list workspace packages to import]
5. Must follow pattern from: [reference similar implemented file]

Critical requirements:
- Use proper import paths (@codexcrm/ui, not relative)
- Include header comment with @SERVER-COMPONENT or @CLIENT-COMPONENT
- Follow the exact pattern, no improvisation
- If this is a server component, it can be async
- If this is a client component, it needs 'use client' directive

Please implement the file now.
```

## Conclusion

This PRD is specifically designed for AI-assisted implementation with multiple safeguards:

1. **Clear file headers** prevent client/server confusion
2. **Monorepo structure** is explicitly defined
3. **Import patterns** are standardized
4. **Common mistakes** are pre-identified
5. **Testing checkpoints** catch issues early
6. **Rollback procedures** enable quick recovery

The phased approach allows for validation at each step, preventing cascade failures that often occur with AI-generated code. By following this guide, you should achieve a clean, modern, and maintainable codebase that leverages the best of React 19 and Next.js 15.
