# TanStack Query in Next.js: A Comprehensive Guide

This comprehensive guide outlines the core concepts, implementation strategies, and advanced techniques for leveraging TanStack Query within Next.js applications, with a particular focus on Server Components and the App Router. It also addresses key considerations for migration to v5 and integration with other tools like tRPC and React Router.

## 1. Introduction to TanStack Query and its Role in Next.js

TanStack Query (formerly React Query) is a powerful library for managing asynchronous state, primarily focused on server-state management. It handles data fetching, caching, synchronization, and updates with a declarative API.

### Server State vs. App State

TanStack Query is designed for **"server state"**, which is data fetched from a remote server (e.g., a list of posts, user profiles). This distinguishes it from traditional state managers like Redux or Zustand, which are better suited for **"app state"** (e.g., UI preferences, multi-step form data that doesn't immediately interact with a server). As one source notes, "it's rare that I need a state manager in the projects I'm working on but I almost always need react query."

### Key Features

TanStack Query provides functionalities like:

- **Queries:** For fetching data (**`useQuery`**)
- **Mutations:** For modifying data on the server (**`useMutation`**)
- **Caching:** Efficiently stores and reuses fetched data to improve performance
- **Invalidation:** Automatically refetches data when it becomes stale
- **Optimistic Updates:** Provides instant UI feedback by updating the UI before the server responds
- **Prefetching:** Loads data in advance to reduce perceived loading times
- **Parallel Queries:** Fetches multiple data points concurrently
- **Infinite Queries:** Manages data for infinite scrolling scenarios

### Benefits in Next.js

TanStack Query is highly beneficial in Next.js applications due to its robust caching and server-rendering capabilities. It helps avoid "request waterfalls" and provides a smooth user experience.

## 2. Initial Setup and Hydration in Next.js

Implementing TanStack Query in a Next.js application requires careful setup, particularly concerning the **`QueryClient`** and **`HydrationBoundary`**.

### QueryClient Instance

It is crucial to create the **`QueryClient`** instance inside your app, typically within a React state or instance ref, rather than at the file's root level. This ensures that "data is not shared between different users and requests," preventing "sensitive data" leaks and performance issues.

#### Example (`app/providers.tsx` for App Router)

```tsx
'use client'
import { isServer, QueryClient, QueryClientProvider } from '@tanstack/react-query'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // Avoid immediate refetching on the client
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (isServer) {
    return makeQueryClient() // Server: always make a new client
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient() // Browser: create if not exists
    return browserQueryClient
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
```

### QueryClientProvider and HydrationBoundary

The application should be wrapped in **`QueryClientProvider`** to make the **`queryClient`** available throughout the component tree. For Server-Side Rendering (SSR) and Server Components, **`HydrationBoundary`** is essential to pass the pre-fetched data from the server to the client.

#### Integrating with layout.tsx (Next.js App Router)

```tsx
// app/layout.tsx
import Providers from './providers'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

### Multiple queryClient instances in SSR

The documentation notes that "there are actually three **`queryClient`**s involved" in SSR. One for the preloading phase (framework loaders), and separate ones for the server rendering process and client rendering process. This ensures consistent data for initial markup.

## 3. Server Components and Advanced Server Rendering

Next.js App Router introduces Server Components, and TanStack Query adapts to this paradigm to enable data fetching directly on the server.

### Prefetching in Server Components

Data can be prefetched directly within Server Components (e.g., **`app/posts/page.tsx`**). The **`QueryClient`** is created, **`prefetchQuery`** is called, and the **`dehydratedState`** is passed as a prop to a client component wrapped in **`HydrationBoundary`**.

#### Example (`app/posts/page.tsx`)

```tsx
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import Posts from './posts' // This Posts component is typically a client component

export default async function PostsPage() {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({ queryKey: ['posts'], queryFn: getPosts })
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Posts />
    </HydrationBoundary>
  )
}
```

### HydrationBoundary with Server Components

Unlike the Next.js Pages Router where boilerplate **`HydrationBoundary`** could sometimes be removed, with Server Components, it is generally "not possible" to get rid of the **`HydrationBoundary`** in every route.

### Multiple HydrationBoundary instances

It's acceptable to use multiple **`HydrationBoundary`** components and create/dehydrate multiple **`queryClient`** instances for prefetching across different Server Components.

### Server-Side Waterfalls

If **`await`** is used for data fetching within a Server Component before rendering other Server Components that also fetch data, it can lead to server-side waterfalls. Next.js parallel routes can automatically flatten these waterfalls.

### Alternative: Single queryClient for Prefetching (with cache())

While creating a new **`queryClient`** for each Server Component is recommended, a single **`queryClient`** can be reused across Server Components using React's **`cache()`** function (scoped per request to prevent data leakage). The downside is that **`dehydrate(getQueryClient())`** serializes "the entire queryClient," including potentially unnecessary queries.

## 4. Key Concepts and Advanced Techniques

TanStack Query offers various advanced patterns for efficient data management.

### staleTime

A crucial **`defaultOption`** to prevent immediate refetching on the client after hydration. Setting **`staleTime: 60 * 1000`** (60 seconds) is a common practice for SSR.

### useQuery vs. useSuspenseQuery

- **`useQuery`:** Data will be immediately available if prefetched. If not prefetched, it fetches on the client.
- **`useSuspenseQuery`:** This hook automatically suspends the component while data is being fetched. In v5, the experimental **`suspense: boolean`** flag has been removed. **`data`** is guaranteed to be defined with **`useSuspenseQuery`**.

### Optimistic Updates

Allows the UI to update immediately in response to a mutation, giving the user instant feedback, then reverting or confirming based on the server's response. TanStack Query v5 simplifies this with leveraging variables from **`useMutation`**.

#### Example (onMutate)

```tsx
onMutate: async (newMovie) => {
  await queryClient.cancelQueries(['movie', newMovie.id]); // Pause outgoing refetches
  const previousMovie = queryClient.getQueryData(['movie', newMovie.id]); // Save current state
  queryClient.setQueryData(['movie', newMovie.id], newMovie); // Update optimistically
  return { previousMovie };
},
onError: (err, newMovie, context) => {
  queryClient.setQueryData(['movie', newMovie.id], context.previousMovie); // Rollback on error
},
```

### Prefetching on Hover

Improve user experience by prefetching data when a user hovers over an element, anticipating their next action.

**Example:** **`onMouseEnter={() => prefetchMovie(movie.id)}`**

### Parallel Loading (useQueries)

Fetch multiple independent queries concurrently to avoid waiting for one request to complete before starting another.

### Infinite Scrolling (useInfiniteQuery)

Designed for fetching data in "pages" and seamlessly loading more data as the user scrolls, providing a smooth infinite scroll experience.

### Serialization and Deserialization

For complex data types or custom transformations, **`serializeData`** and **`deserializeData`** options can be configured in the **`QueryClient`** to handle data transfer between server and client.

### Including Pending Queries in Dehydration

By default, only successful queries are dehydrated. This can be extended to include pending queries by configuring **`shouldDehydrateQuery`** in **`defaultOptions.dehydrate`**. This works because "React can serialize Promises over the wire when you pass them down to Client Components."

## 5. Migration to TanStack Query v5

TanStack Query v5 introduces several breaking changes and new features.

### Single Signature for Hooks

All **`useQuery`** and related hooks now only support an object format for arguments (e.g., **`useQuery({ queryKey, queryFn, ...options })`**). A codemod is available to assist with this migration.

### Renamed Options

- **`cacheTime`** is renamed to **`gcTime`** (Garbage Collection Time) for clarity, as it refers to the time data remains in the cache after a query is no longer in use.
- **`useErrorBoundary`** is renamed to **`throwOnError`**.

### Status Renames

For mutations, **`loading`** is now **`pending`**, and **`isLoading`** is **`isPending`**. A new **`isLoading`** flag for queries is **`isPending && isFetching`**. **`isInitialLoading`** is deprecated.

### Hydrate renamed to HydrationBoundary

This is a breaking change, but a simple rename.

### getQueryData argument

Now accepts **`queryKey`** only.

### queryClient.getQueryDefaults behavior change

Now merges all matching registrations. **`setQueryDefaults`** calls should be ordered from most generic to least generic key.

## 6. Error Handling with tRPC and TanStack Query

tRPC, a popular library for building type-safe APIs, integrates well with TanStack Query.

### Error Structure

tRPC errors are returned to the client with an "error" property containing **`message`**, **`code`**, and **`data`** (including **`httpStatus`** and **`path`**).

### TRPCError

tRPC provides a subclass **`TRPCError`** for throwing structured errors within procedures.

**Example:** 
```typescript
throw new TRPCError({ 
  code: 'INTERNAL_SERVER_ERROR', 
  message: 'An unexpected error occurred, please try again later.' 
});
```

### getHTTPStatusCodeFromError

A helper function (**`@trpc/server/http`**) to extract the HTTP status code from a tRPC error.

### onError Callback

All errors in a tRPC procedure pass through an **`onError`** method, allowing for centralized error handling, logging (e.g., "send to bug reporting" for **`INTERNAL_SERVER_ERROR`**), and context inspection.

## 7. Integration with React Router

TanStack Query can also be used effectively with client-side routing libraries like React Router, particularly for data preloading.

### Loader Functions

React Router's loader functions can be used to prefetch data with TanStack Query's **`fetchQuery`** or **`getQueryData`**. The **`queryClient`** can be passed to these loader functions.

#### Example (React Router loader)

```typescript
export const loader = (queryClient) => async ({ params }) => {
  const query = contactDetailQuery(params.contactId);
  return (
    queryClient.getQueryData(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  );
};
```

### useLoaderData and useQuery

The prefetched data from the loader can be accessed using **`useLoaderData`** in the component, and **`useQuery`** can then consume this data.

## 8. Community and Resources

The TanStack Query community is active, providing numerous resources for learning and support.

### Official Documentation
Comprehensive guides and API references.

### TkDodo's Blog
A highly recommended resource for in-depth articles on various TanStack Query concepts, including "Practical React Query," "React Query Error Handling," and "Type-safe React Query."

### Reddit Communities
**r/nextjs**, **r/reactjs** frequently discuss TanStack Query, its use with App Router, and comparisons with other libraries like SWR.

### Codemods
Available for assisting with breaking changes during migration, especially for the v5 single signature format.

## 9. Conclusion

TanStack Query is a powerful tool for managing server-side data in React applications, especially when combined with Next.js's Server-Side Rendering and Server Components. Its robust caching, prefetching, and hydration capabilities significantly enhance performance and developer experience. Understanding its core concepts, particularly the nuances of **`QueryClient`** instantiation, **`HydrationBoundary`**, and v5 migration changes, is crucial for building high-performance and scalable Next.js applications.