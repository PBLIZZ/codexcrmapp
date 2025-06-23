# TanStack Query Advanced Techniques in Next.js App Router

The sources provide a comprehensive overview of implementing and utilizing advanced techniques with TanStack Query within the Next.js App Router, highlighting its benefits for managing complex data fetching scenarios.

## Implementation and Initial Setup

To get started with TanStack Query in a Next.js application using the App Router, the first step is to install the package:

```bash
npm i @tanstack/react-query
```

Next, you need to create a client component, often named **`Providers.tsx`**, to register your **`QueryClientProvider`**. This component uses the **`"use client"`** directive, as queries and mutations can only be performed in client components. Within this **`Providers`** component, you initialize a **`QueryClient`** and wrap your children with **`QueryClientProvider`**.

Finally, this **`Providers`** component is then imported and used in your root **`layout.tsx`** file, typically wrapping the children within the **`<body>`** tags of your HTML structure.

## Basic Usage

### Queries for Fetching Data
TanStack Query uses the **`useQuery`** hook for fetching data. This hook requires a **`queryKey`** (an array to uniquely identify the query) and a **`queryFn`** (an asynchronous function that fetches the data).

### Mutations for Modifying Data
For modifying data, TanStack Query provides the **`useMutation`** hook. This hook takes a **`mutationFn`** (an asynchronous function to update data) and can include an **`onSuccess`** callback for post-mutation actions. Both **`useQuery`** and **`useMutation`** must be used within client components.

## Advanced Techniques

While Next.js Server Components and server actions can handle straightforward data fetching, TanStack Query offers advanced features for more complex scenarios, especially when interactive components and fine-grained cache control are needed.

### 1. Hydration and Prefetching (with Server Components and App Router)

TanStack Query has built-in support to prefetch data on the server and send it along with your server components, which leads to less waiting time and a better user experience. If the server data becomes stale, React Query will automatically refetch it on the client.

There are two main ways to achieve hydration in Next.js:

#### Passing initialData via props
You can fetch data in a server component (e.g., **`app/page.tsx`**) and then pass it as **`initialData`** to your client component (e.g., **`app/to-dos.tsx`**) using **`useQuery`**. This approach is simple but can lead to "prop drilling" issues.

#### Using `<Hydrate />` component
This method avoids prop drilling by creating a singleton **`QueryClient`**. In a server component, you **`prefetchQuery`** data using this client, **`dehydrate`** the client's state, and then pass it to the **`<Hydrate />`** component which wraps your client component. This allows the **`useQuery`** hook in the client component to load data instantly without a loading time because the data is already available from the server. This technique is particularly well-suited for Next.js 15 with Server Components and Streaming, boosting SEO and performance.

### 2. Smart Prefetching

This technique involves loading data before the user explicitly requests it, such as when they hover over an element. By using **`queryClient.prefetchQuery`** on a **`onMouseEnter`** event, you can proactively fetch data, creating a "Netflix-like" instant feel for the user.

### 3. Optimistic Updates for Mutations

For a seamless user experience, optimistic updates allow the UI to update immediately after a user action, even before the server responds. TanStack Query's **`useMutation`** can be configured with **`onMutate`** to instantly update the UI and **`onError`** to roll back the changes if the server request fails, saving the previous state in case a rollback is needed.

### 4. Parallel Loading (useQueries)

Instead of fetching data sequentially, **`useQueries`** allows you to fetch multiple independent pieces of data concurrently, significantly reducing loading times for pages that depend on various data sources.

### 5. Infinite Scrolling (useInfiniteQuery)

For applications with long, scrollable lists of data, **`useInfiniteQuery`** provides a streamlined way to implement infinite scrolling and pagination. It manages fetching subsequent pages of data as the user scrolls, often integrating with libraries like **`react-intersection-observer`** to detect when to fetch the next page.

### 6. Consistent Query Keys

It's recommended to use detailed and consistent **`queryKey`** arrays (e.g., **`['movies', { genre: 'action', year: 2024 }]`**). This helps in better caching, refetching, and invalidation mechanisms.

### 7. Smart Refetching

You can configure **`useQuery`** to refetch data on window focus (e.g., only in production) and set a **`staleTime`** to define how long data is considered fresh before a background refetch is triggered.

### 8. Error Recovery

Implementing an **`ErrorBoundary`** allows you to gracefully handle errors during data fetching and provide a user-friendly fallback UI with options to retry.

## When to Use TanStack Query in Next.js App Router

While Next.js Server Components and its built-in **`fetch`** provide basic data fetching capabilities, TanStack Query becomes highly beneficial for scenarios that require:

- **Complex data fetching** with caching control
- **Mutations** with optimistic updates and rollback
- **Infinite scrolling** or pagination
- **Predictive prefetching** for an instant user experience
- **Parallel data loading**
- **Client-side interactivity** where data needs to be refetched or updated quickly based on user actions
- **Debugging tools** like TanStack Query DevTools to inspect caches and monitor updates, which can save development time

## Best Practices Summary

The sources suggest that for **read-only data**, server components and **`fetch`** might suffice, but for **data that needs to be mutated or changed during user interaction**, TanStack Query is ideal for its state cache capabilities. 

> **General consensus:** Use the best tool for the job - leveraging server components for basic fetching and TanStack Query for more complex, interactive data management.