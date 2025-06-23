# tRPC Optimization Reference Guide

## Introduction

This reference guide outlines the best practices for implementing tRPC in our Next.js application, focusing specifically on the problems and solutions mentioned in the documentation.

## Core Concepts

### tRPC Architecture in Next.js

tRPC provides end-to-end type safety between your client and server without code generation or GraphQL schemas. When combined with Next.js, it offers a powerful stack for building modern web applications.

## Common Anti-Patterns to Avoid

### Overreliance on Client-Side Rendering

```tsx
// AVOID: Overusing "use client" for data fetching
"use client"

function UserDashboard() {
  const { data, isLoading } = trpc.users.getProfile.useQuery();
  
  if (isLoading) return <div>Loading...</div>;
  
  return <div>{data.name}'s Dashboard</div>;
}
```

**Problems with this approach:**
- Slower initial page loads
- Poor SEO performance
- Unnecessary loading states visible to users
- Potential layout shifts as data loads
- Heavy reliance on client-side querying leads to larger JavaScript bundles

## Best Practices

### 1. Balance Server and Client Responsibilities

Instead of fetching all data on the client, consider server-side fetching and passing initial data through props:

```tsx
// In a server component or getServerSideProps/getStaticProps
async function fetchInitialData() {
  const caller = appRouter.createCaller({ /* context */ });
  return await caller.users.getProfile();
}

// In your page
export default async function UserPage() {
  const initialData = await fetchInitialData();
  
  return <UserProfile initialData={initialData} />;
}

// In your client component
"use client"
function UserProfile({ initialData }) {
  const { data } = trpc.users.getProfile.useQuery(undefined, {
    initialData, // React Query will use this and avoid refetching
  });
  
  return <div>{data.name}'s Profile</div>;
}
```

### 2. Utilize Server Components with tRPC

With Next.js App Router, you can create hybrid approaches:

```tsx
// UserProfile.tsx - Server Component
import { ClientProfile } from './ClientProfile';

export default async function UserProfile() {
  // Server-side fetching
  const caller = appRouter.createCaller({ /* context */ });
  const userData = await caller.users.getProfile();
  
  return (
    <div>
      <h1>{userData.name}</h1>
      {/* Pass data to client component for interactive elements */}
      <ClientProfile initialData={userData} />
    </div>
  );
}
```

This approach leverages server components for initial data fetching while maintaining interactive client components where needed.

### 3. Implement Request Batching

Use tRPC's httpBatchLink to combine multiple API calls into a single network request:

```tsx
import { httpBatchLink } from '@trpc/client';

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/api/trpc',
      maxURLLength: 2083, // Limit for some browsers
    }),
  ],
});
```

This significantly reduces network overhead when components make multiple simultaneous queries.

### 4. Optimize Caching with React Query

tRPC uses Tanstack Query (formerly React Query) under the hood. Configure its caching behavior for optimal performance:

```tsx
const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      links: [
        httpBatchLink({
          url: '/api/trpc',
        }),
      ],
      queryClientConfig: {
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            cacheTime: 10 * 60 * 1000, // 10 minutes
          },
        },
      },
    };
  },
});
```

### 5. Implement Efficient Data Fetching Patterns

Avoid over-fetching by implementing pagination, filtering, and selection:

```tsx
// In your router definition
const postRouter = router({
  getPaginatedPosts: publicProcedure
    .input(z.object({ 
      page: z.number().default(1),
      limit: z.number().default(10),
      filter: z.string().optional()
    }))
    .query(async ({ input }) => {
      const { page, limit, filter } = input;
      // Fetch only what's needed with pagination
      const posts = await db.post.findMany({
        where: filter ? { title: { contains: filter } } : undefined,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          title: true,
          summary: true, // Only select needed fields
          // Omit large text fields like content
        }
      });
      
      const total = await db.post.count();
      
      return {
        posts,
        meta: { total, pages: Math.ceil(total / limit) }
      };
    }),
});
```

## Leveraging Suspense

You may prefer handling loading and error states using Suspense and Error Boundaries:

```tsx
// In your page component
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ClientGreeting } from './client-greeting';

export default async function Home() {
  prefetch(trpc.hello.queryOptions());

  return (
    <HydrateClient>
      <div>...</div>
      {/** ... */}
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Suspense fallback={<div>Loading...</div>}>
          <ClientGreeting />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}

// In your client component
"use client"
function ClientGreeting() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.hello.queryOptions());
  return <div>{data.greeting}</div>;
}
```

## Server Components with tRPC Direct Caller

For maximum performance, use the direct caller in server components:

```tsx
// server.tsx
export const caller = appRouter.createCaller(createTRPCContext);

// In your server component
import { caller } from '~/trpc/server';

export default async function UserDetails() {
  // Direct server-side call without network overhead
  const user = await caller.users.getById();
  
  return <div>{user.name}</div>;
}
```

## Alternatives for Complex Applications

While tRPC offers excellent type safety and developer experience, some applications may benefit from alternative approaches:

### Server Actions with Zod Validation

Next.js server actions provide a native solution for server-side functions, which can be combined with Zod for type validation:

```tsx
"use server"
import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email()
});

export async function createUser(formData: FormData) {
  const validatedData = userSchema.parse({
    name: formData.get("name"),
    email: formData.get("email")
  });
  
  // Proceed with database operations
  return await db.user.create({ data: validatedData });
}
```

> "Use server-actions along with zod for validation. Much better than using tRPC."

## Hydration Helpers

You can create helper functions to make hydration more concise:

```tsx
// trpc/server.tsx
export function HydrateClient(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
}

export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
  queryOptions: T,
) {
  const queryClient = getQueryClient();
  if (queryOptions.queryKey[1]?.type === 'infinite') {
    void queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    void queryClient.prefetchQuery(queryOptions);
  }
}
```

## Getting Data in Server Components

If you need to use data both on the server and in client components:

```tsx
// app/page.tsx
import { getQueryClient, HydrateClient, trpc } from '~/trpc/server';

export default async function Home() {
  const queryClient = getQueryClient();
  const greeting = await queryClient.fetchQuery(trpc.hello.queryOptions());
  // Do something with greeting on the server
  
  return (
    <HydrateClient>
      <div>...</div>
      {/** ... */}
      <ClientGreeting />
    </HydrateClient>
  );
}
```

## Conclusion

By following these patterns, you'll build applications that:

- Load quickly with minimal client-side JavaScript
- Leverage server components effectively
- Maintain excellent type safety
- Optimize network performance
- Provide a seamless user experience

Remember that server components should handle as much data fetching as possible, with client components reserved primarily for interactive elements. This approach takes full advantage of Next.js's architecture while maintaining the type safety benefits of tRPC.