## Document Information
- **Name**: trpc-v11-react19-next15.mdc
- **Description**: Comprehensive guide for tRPC v11 with React 19 and Next.js 15 integration
- **File Patterns**: `**/*.{ts,tsx}`
- **Always Apply**: true

## Executive Summary

This document provides enterprise-grade implementation patterns for tRPC v11, leveraging the latest features in React 19 and Next.js 15. It covers breaking changes, new features, performance optimizations, and professional development patterns for building type-safe, scalable full-stack applications.

## 1. What's New in tRPC v11

### 1.1 Breaking Changes and Migration

**Key Changes from v10 to v11:**

```typescript
// v10 (OLD) - Deprecated patterns
import { initTRPC } from '@trpc/server'
import { createTRPCNext } from '@trpc/next'

const t = initTRPC.create()
export const router = t.router
export const publicProcedure = t.procedure

// v11 (NEW) - Modern patterns
import { initTRPC } from '@trpc/server'
import { createCallerFactory } from '@trpc/server'
import { createTRPCReact } from '@trpc/react-query'

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

export const createCaller = createCallerFactory(appRouter)
export const router = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(authMiddleware)
```

**Major Changes:**
- **Simplified Router Creation**: Streamlined router instantiation
- **Enhanced Type Safety**: Better TypeScript inference and error handling
- **Improved Middleware System**: More flexible and composable middleware
- **Better React Integration**: Enhanced hooks and streaming support
- **Performance Optimizations**: Reduced bundle size and improved runtime performance

### 1.2 New Features in v11

**Enhanced Subscription Support:**
```typescript
// Advanced subscription patterns with better error handling
import { observable } from '@trpc/server/observable'
import { EventEmitter } from 'events'

const eventEmitter = new EventEmitter()

export const subscriptionRouter = router({
  onPostUpdate: publicProcedure
    .input(z.object({ postId: z.string() }))
    .subscription(({ input }) => {
      return observable<Post>((emit) => {
        const onUpdate = (post: Post) => {
          if (post.id === input.postId) {
            emit.next(post)
          }
        }

        const onError = (error: Error) => {
          emit.error(error)
        }

        eventEmitter.on('postUpdate', onUpdate)
        eventEmitter.on('error', onError)

        return () => {
          eventEmitter.off('postUpdate', onUpdate)
          eventEmitter.off('error', onError)
        }
      })
    }),

  // Real-time chat with typing indicators
  chatMessages: publicProcedure
    .input(z.object({ 
      roomId: z.string(),
      userId: z.string() 
    }))
    .subscription(({ input, ctx }) => {
      return observable<ChatEvent>((emit) => {
        const handleMessage = (event: ChatEvent) => {
          if (event.roomId === input.roomId) {
            emit.next(event)
          }
        }

        // Subscribe to chat events
        ctx.pubsub.subscribe(`chat:${input.roomId}`, handleMessage)
        
        // Send user joined event
        emit.next({
          type: 'user_joined',
          userId: input.userId,
          roomId: input.roomId,
          timestamp: new Date(),
        })

        return () => {
          ctx.pubsub.unsubscribe(`chat:${input.roomId}`, handleMessage)
          
          // Send user left event
          emit.next({
            type: 'user_left',
            userId: input.userId,
            roomId: input.roomId,
            timestamp: new Date(),
          })
        }
      })
    }),
})
```

**Improved Batch Operations:**
```typescript
// Enhanced batching with better performance
export const batchRouter = router({
  // Efficient batch queries
  getPostsByIds: publicProcedure
    .input(z.array(z.string()))
    .query(async ({ input, ctx }) => {
      // Single database query for multiple posts
      const posts = await ctx.db.post.findMany({
        where: { id: { in: input } },
        include: {
          author: true,
          comments: {
            take: 5,
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: { likes: true, comments: true },
          },
        },
      })

      // Return posts in the same order as requested
      return input.map(id => posts.find(post => post.id === id)).filter(Boolean)
    }),

  // Efficient batch mutations with transaction support
  updateMultiplePosts: protectedProcedure
    .input(z.array(z.object({
      id: z.string(),
      title: z.string().optional(),
      content: z.string().optional(),
      published: z.boolean().optional(),
    })))
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.$transaction(
        input.map(post => 
          ctx.db.post.update({
            where: { id: post.id },
            data: {
              title: post.title,
              content: post.content,
              published: post.published,
              updatedAt: new Date(),
            },
          })
        )
      )
    }),
})
```

## 2. React 19 Integration

### 2.1 Server Components with tRPC

**Professional Server Component Patterns:**
```typescript
// app/posts/page.tsx - React 19 Server Component
import { createCaller } from '@/server/api/root'
import { createContext } from '@/server/api/context'
import { PostCard } from '@/components/post-card'
import { Suspense } from 'react'

interface PostsPageProps {
  searchParams: {
    page?: string
    category?: string
    search?: string
  }
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  // Create server-side caller with context
  const ctx = await createContext()
  const caller = createCaller(ctx)

  // Server-side data fetching
  const postsData = await caller.post.getInfinite({
    limit: 12,
    cursor: null,
    filters: {
      category: searchParams.category,
      search: searchParams.search,
    },
  })

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Latest Posts</h1>
      
      <Suspense fallback={<PostsSkeleton />}>
        <PostsGrid posts={postsData.items} />
      </Suspense>
      
      {/* Client-side pagination component */}
      <PostsPagination 
        hasNextPage={postsData.nextCursor !== null}
        initialData={postsData}
      />
    </div>
  )
}

// components/posts-pagination.tsx - Client Component
'use client'

import { api } from '@/trpc/react'
import { Button } from '@/components/ui/button'
import { useInfiniteQuery } from '@tanstack/react-query'

interface PostsPaginationProps {
  hasNextPage: boolean
  initialData: any
}

export function PostsPagination({ hasNextPage, initialData }: PostsPaginationProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage: hasMore,
    isFetchingNextPage,
  } = api.post.getInfinite.useInfiniteQuery(
    { limit: 12 },
    {
      initialData: {
        pages: [initialData],
        pageParams: [null],
      },
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  )

  return (
    <div className="mt-8 flex justify-center">
      {hasMore && (
        <Button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          variant="outline"
        >
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </Button>
      )}
    </div>
  )
}
```

### 2.2 React 19 Concurrent Features

**Advanced Concurrent Patterns:**
```typescript
// hooks/use-optimistic-mutations.ts
import { use, useOptimistic, useTransition } from 'react'
import { api } from '@/trpc/react'

interface Post {
  id: string
  title: string
  content: string
  published: boolean
  likes: number
  optimistic?: boolean
}

export function useOptimisticPosts(initialPosts: Post[]) {
  const [isPending, startTransition] = useTransition()
  const [optimisticPosts, setOptimisticPosts] = useOptimistic(
    initialPosts,
    (state, newPost: Post) => [...state, newPost]
  )

  const utils = api.useUtils()
  const createPost = api.post.create.useMutation({
    onMutate: async (newPost) => {
      // Cancel outgoing refetches
      await utils.post.getAll.cancel()

      // Snapshot previous value
      const previousPosts = utils.post.getAll.getData()

      // Optimistically update
      const optimisticPost: Post = {
        id: `temp-${Date.now()}`,
        ...newPost,
        likes: 0,
        optimistic: true,
      }

      setOptimisticPosts(optimisticPost)

      return { previousPosts }
    },
    onError: (err, newPost, context) => {
      // Rollback on error
      if (context?.previousPosts) {
        utils.post.getAll.setData(undefined, context.previousPosts)
      }
    },
    onSettled: () => {
      // Refetch to ensure consistency
      utils.post.getAll.invalidate()
    },
  })

  const addPost = (post: Omit<Post, 'id' | 'likes'>) => {
    startTransition(() => {
      createPost.mutate(post)
    })
  }

  return {
    posts: optimisticPosts,
    addPost,
    isPending,
    isError: createPost.isError,
    error: createPost.error,
  }
}

// components/post-creator.tsx - Using React 19 form actions
'use client'

import { use, useActionState } from 'react'
import { api } from '@/trpc/react'

interface FormState {
  message?: string
  errors?: Record<string, string[]>
}

export function PostCreator() {
  const utils = api.useUtils()
  
  async function createPostAction(prevState: FormState, formData: FormData): Promise<FormState> {
    try {
      const title = formData.get('title') as string
      const content = formData.get('content') as string

      if (!title || !content) {
        return {
          errors: {
            title: !title ? ['Title is required'] : [],
            content: !content ? ['Content is required'] : [],
          }
        }
      }

      await api.post.create.mutate({
        title,
        content,
        published: false,
      })

      // Invalidate and refetch
      await utils.post.getAll.invalidate()

      return { message: 'Post created successfully!' }
    } catch (error) {
      return {
        message: 'Failed to create post. Please try again.',
        errors: {},
      }
    }
  }

  const [state, formAction, isPending] = useActionState(createPostAction, {})

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          className="mt-1 block w-full rounded-md border-gray-300"
          disabled={isPending}
        />
        {state.errors?.title && (
          <p className="text-red-500 text-sm">{state.errors.title[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          rows={4}
          required
          className="mt-1 block w-full rounded-md border-gray-300"
          disabled={isPending}
        />
        {state.errors?.content && (
          <p className="text-red-500 text-sm">{state.errors.content[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isPending ? 'Creating...' : 'Create Post'}
      </button>

      {state.message && (
        <p className="text-green-500 text-sm">{state.message}</p>
      )}
    </form>
  )
}
```

### 2.3 Streaming and Suspense Integration

**Professional Streaming Patterns:**
```typescript
// components/streaming-data.tsx
import { Suspense, use } from 'react'
import { api } from '@/trpc/react'
import { ErrorBoundary } from 'react-error-boundary'

// Streaming component with error boundaries
export function StreamingPostList({ category }: { category: string }) {
  return (
    <ErrorBoundary
      fallback={<div className="text-red-500">Failed to load posts</div>}
      onError={(error) => console.error('Posts loading error:', error)}
    >
      <Suspense fallback={<PostsLoadingSkeleton />}>
        <PostsContent category={category} />
      </Suspense>
    </ErrorBoundary>
  )
}

function PostsContent({ category }: { category: string }) {
  // React 19 'use' API for data fetching
  const posts = use(
    api.post.getByCategory.query({ category })
  )

  return (
    <div className="grid gap-4">
      {posts.map(post => (
        <Suspense key={post.id} fallback={<PostCardSkeleton />}>
          <PostCard post={post} />
        </Suspense>
      ))}
    </div>
  )
}

// Advanced streaming with parallel data fetching
export function DashboardWithStreaming() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Suspense fallback={<StatCardSkeleton />}>
        <UserStatsCard />
      </Suspense>
      
      <Suspense fallback={<StatCardSkeleton />}>
        <PostStatsCard />
      </Suspense>
      
      <Suspense fallback={<StatCardSkeleton />}>
        <RevenueStatsCard />
      </Suspense>
      
      <div className="col-span-full">
        <Suspense fallback={<ChartSkeleton />}>
          <AnalyticsChart />
        </Suspense>
      </div>
    </div>
  )
}

function UserStatsCard() {
  const stats = use(api.analytics.getUserStats.query())
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold">Users</h3>
      <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
      <p className="text-sm text-gray-500">
        +{stats.growth}% from last month
      </p>
    </div>
  )
}
```

## 3. Next.js 15 Integration

### 3.1 App Router with tRPC

**Professional App Router Setup:**
```typescript
// app/api/trpc/[trpc]/route.ts - Next.js 15 Route Handler
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '@/server/api/root'
import { createContext } from '@/server/api/context'

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext,
    onError:
      process.env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`
            )
          }
        : undefined,
  })

export { handler as GET, handler as POST }

// trpc/server.ts - Server-side utilities
import 'server-only'
import { createCaller } from '@/server/api/root'
import { createContext } from '@/server/api/context'
import { cookies } from 'next/headers'
import { cache } from 'react'

// Cached server-side caller
export const createServerCaller = cache(async () => {
  const context = await createContext()
  return createCaller(context)
})

// Utility for server components
export const serverApi = {
  post: {
    getAll: cache(async () => {
      const caller = await createServerCaller()
      return caller.post.getAll()
    }),
    getById: cache(async (id: string) => {
      const caller = await createServerCaller()
      return caller.post.getById({ id })
    }),
  },
  user: {
    getCurrent: cache(async () => {
      const caller = await createServerCaller()
      return caller.user.getCurrent()
    }),
  },
}

// trpc/react.tsx - Client-side setup
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { loggerLink, unstable_httpBatchStreamLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import { useState } from 'react'
import superjson from 'superjson'
import { type AppRouter } from '@/server/api/root'

export const api = createTRPCReact<AppRouter>()

function getBaseUrl() {
  if (typeof window !== 'undefined') return ''
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT ?? 3000}`
}

export function TRPCReactProvider(props: {
  children: React.ReactNode
  cookies: string
}) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000, // 30 seconds
        refetchOnWindowFocus: false,
      },
    },
  }))

  const [trpcClient] = useState(() =>
    api.createClient({
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === 'development' ||
            (op.direction === 'down' && op.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          url: getBaseUrl() + '/api/trpc',
          headers() {
            return {
              cookie: props.cookies,
              'x-trpc-source': 'react',
            }
          },
        }),
      ],
    })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  )
}
```

### 3.2 Enhanced Middleware and Context

**Professional Middleware Implementation:**
```typescript
// server/api/context.ts - Enhanced context with Next.js 15
import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import { type Session } from 'next-auth'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/server/auth'
import { db } from '@/server/db'
import { cache } from 'react'

interface CreateContextOptions {
  session: Session | null
}

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    db,
  }
}

export const createContext = cache(async () => {
  const session = await getServerSession(authOptions)
  
  return createInnerTRPCContext({
    session,
  })
})

export type Context = Awaited<ReturnType<typeof createContext>>

// server/api/trpc.ts - Enhanced tRPC setup
import { initTRPC, TRPCError } from '@trpc/server'
import { type Context } from './context'
import superjson from 'superjson'
import { ZodError } from 'zod'

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

// Rate limiting middleware
const rateLimitMiddleware = t.middleware(async ({ ctx, next, meta }) => {
  const { session } = ctx
  
  if (!session?.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Authentication required',
    })
  }

  // Simple rate limiting (in production, use Redis)
  const key = `rate_limit:${session.user.id}`
  const requests = await ctx.db.rateLimit.findUnique({
    where: { userId: session.user.id },
  })

  if (requests && requests.count > 100) {
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: 'Rate limit exceeded',
    })
  }

  return next({
    ctx: {
      ...ctx,
      session,
    },
  })
})

// Logging middleware
const loggingMiddleware = t.middleware(async ({ path, type, next }) => {
  const start = Date.now()
  const result = await next()
  const durationMs = Date.now() - start

  console.log(`${type.toUpperCase()} ${path} - ${durationMs}ms`)
  
  return result
})

// Caching middleware
const cachingMiddleware = t.middleware(async ({ path, type, input, next, ctx }) => {
  if (type !== 'query') return next()

  const cacheKey = `trpc:${path}:${JSON.stringify(input)}`
  
  // Check cache first (implement with Redis in production)
  const cached = await ctx.db.cache.findUnique({
    where: { key: cacheKey },
  })

  if (cached && cached.expiresAt > new Date()) {
    return JSON.parse(cached.value)
  }

  const result = await next()

  // Cache the result
  await ctx.db.cache.upsert({
    where: { key: cacheKey },
    create: {
      key: cacheKey,
      value: JSON.stringify(result),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    },
    update: {
      value: JSON.stringify(result),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    },
  })

  return result
})

export const router = t.router
export const publicProcedure = t.procedure.use(loggingMiddleware)
export const protectedProcedure = t.procedure
  .use(loggingMiddleware)
  .use(rateLimitMiddleware)
export const cachedProcedure = t.procedure
  .use(loggingMiddleware)
  .use(cachingMiddleware)
```

### 3.3 Advanced Router Patterns

**Professional Router Organization:**
```typescript
// server/api/routers/post.ts - Comprehensive post router
import { z } from 'zod'
import { router, publicProcedure, protectedProcedure, cachedProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'

const createPostSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1).max(10000),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).max(10).optional(),
  published: z.boolean().default(false),
  scheduledAt: z.date().optional(),
})

const updatePostSchema = createPostSchema.partial().extend({
  id: z.string(),
})

export const postRouter = router({
  // Public queries with caching
  getAll: cachedProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(10),
      cursor: z.string().optional(),
      categoryId: z.string().optional(),
      search: z.string().optional(),
      published: z.boolean().optional().default(true),
    }))
    .query(async ({ ctx, input }) => {
      const { limit, cursor, categoryId, search, published } = input

      const posts = await ctx.db.post.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: {
          published,
          categoryId,
          ...(search && {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { content: { contains: search, mode: 'insensitive' } },
            ],
          }),
        },
        include: {
          author: {
            select: { id: true, name: true, image: true },
          },
          category: {
            select: { id: true, name: true, slug: true },
          },
          _count: {
            select: { comments: true, likes: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      })

      let nextCursor: typeof cursor | undefined = undefined
      if (posts.length > limit) {
        const nextItem = posts.pop()
        nextCursor = nextItem!.id
      }

      return {
        items: posts,
        nextCursor,
      }
    }),

  getById: cachedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: { id: input.id },
        include: {
          author: {
            select: { id: true, name: true, image: true, bio: true },
          },
          category: true,
          tags: true,
          comments: {
            include: {
              author: {
                select: { id: true, name: true, image: true },
              },
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
          _count: {
            select: { comments: true, likes: true, views: true },
          },
        },
      })

      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        })
      }

      // Increment view count
      await ctx.db.post.update({
        where: { id: input.id },
        data: { viewCount: { increment: 1 } },
      })

      return post
    }),

  // Protected mutations
  create: protectedProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      const { session } = ctx

      // Check user permissions
      if (!session.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Must be logged in to create posts',
        })
      }

      // Validate category if provided
      if (input.categoryId) {
        const category = await ctx.db.category.findUnique({
          where: { id: input.categoryId },
        })

        if (!category) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid category',
          })
        }
      }

      const post = await ctx.db.post.create({
        data: {
          ...input,
          authorId: session.user.id,
          slug: generateSlug(input.title),
        },
        include: {
          author: {
            select: { id: true, name: true, image: true },
          },
          category: true,
        },
      })

      // Invalidate relevant caches
      await ctx.db.cache.deleteMany({
        where: {
          key: {
            startsWith: 'trpc:post.getAll',
          },
        },
      })

      return post
    }),

  update: protectedProcedure
    .input(updatePostSchema)
    .mutation(async ({ ctx, input }) => {
      const { session } = ctx
      const { id, ...updateData } = input

      const existingPost = await ctx.db.post.findUnique({
        where: { id },
        select: { authorId: true },
      })

      if (!existingPost) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        })
      }

      // Check ownership or admin rights
      if (
        existingPost.authorId !== session.user.id && 
        session.user.role !== 'ADMIN'
      ) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not authorized to update this post',
        })
      }

      const updatedPost = await ctx.db.post.update({
        where: { id },
        data: {
          ...updateData,
          updatedAt: new Date(),
        },
        include: {
          author: {
            select: { id: true, name: true, image: true },
          },
          category: true,
        },
      })

      // Invalidate caches
      await ctx.db.cache.deleteMany({
        where: {
          OR: [
            { key: { startsWith: 'trpc:post.getAll' } },
            { key: { startsWith: `trpc:post.getById:{"id":"${id}"}` } },
          ],
        },
      })

      return updatedPost
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { session } = ctx

      const post = await ctx.db.post.findUnique({
        where: { id: input.id },
        select: { authorId: true },
      })

      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        })
      }

      if (post.authorId !== session.user.id && session.user.role !== 'ADMIN') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not authorized to delete this post',
        })
      }

      await ctx.db.post.delete({
        where: { id: input.id },
      })

      // Invalidate caches
      await ctx.db.cache.deleteMany({
        where: {
          key: {
            startsWith: 'trpc:post.',
          },
        },
      })

      return { success: true }
    }),

  // Real-time subscriptions
  onUpdate: publicProcedure
    .input(z.object({ postId: z.string() }))
    .subscription(({ input }) => {
      return observable<{ type: string; data: any }>((emit) => {
        const interval = setInterval(() => {
          emit.next({
            type: 'heartbeat',
            data: { timestamp: new Date() },
          })
        }, 30000)

        return () => {
          clearInterval(interval)
        }
      })
    }),
})

// Utility functions
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}
```

## 4. Performance Optimizations

### 4.1 Advanced Caching Strategies

**Professional Caching Implementation:**
```typescript
// lib/cache.ts - Redis-based caching for production
import Redis from 'ioredis'
import { unstable_cache } from 'next/cache'

const redis = new Redis(process.env.REDIS_URL!)

interface CacheOptions {
  ttl?: number
  tags?: string[]
  revalidate?: number
}

export class TRPCCache {
  static async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await redis.get(key)
      return cached ? JSON.parse(cached) : null
    } catch {
      return null
    }
  }

  static async set<T>(
    key: string, 
    value: T, 
    options: CacheOptions = {}
  ): Promise<void> {
    try {
      const serialized = JSON.stringify(value)
      
      if (options.ttl) {
        await redis.setex(key, options.ttl, serialized)
      } else {
        await redis.set(key, serialized)
      }

      // Add to tag groups for invalidation
      if (options.tags) {
        for (const tag of options.tags) {
          await redis.sadd(`tag:${tag}`, key)
        }
      }
    } catch (error) {
      console.error('Cache set error:', error)
    }
  }

  static async invalidateByTags(tags: string[]): Promise<void> {
    try {
      for (const tag of tags) {
        const keys = await redis.smembers(`tag:${tag}`)
        if (keys.length > 0) {
          await redis.del(...keys)
          await redis.del(`tag:${tag}`)
        }
      }
    } catch (error) {
      console.error('Cache invalidation error:', error)
    }
  }

  static async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern)
      if (keys.length > 0) {
        await redis.del(...keys)
      }
    } catch (error) {
      console.error('Pattern invalidation error:', error)
    }
  }
}

// Enhanced caching middleware
export const createCachingMiddleware = (defaultTtl = 300) =>
  t.middleware(async ({ path, type, input, next, ctx, meta }) => {
    if (type !== 'query') return next()

    const cacheKey = `trpc:${path}:${JSON.stringify(input)}`
    const cacheTags = meta?.cacheTags as string[] || [path.split('.')[0]]
    const ttl = (meta?.cacheTtl as number) || defaultTtl

    // Try to get from cache
    const cached = await TRPCCache.get(cacheKey)
    if (cached) {
      return cached
    }

    // Execute procedure
    const result = await next()

    // Cache the result
    await TRPCCache.set(cacheKey, result, { ttl, tags: cacheTags })

    return result
  })

// Usage in procedures
export const cachedProcedure = publicProcedure.use(createCachingMiddleware(600))

// Procedure with custom cache settings
export const heavyQueryProcedure = publicProcedure
  .meta({ cacheTtl: 3600, cacheTags: ['posts', 'analytics'] })
  .use(createCachingMiddleware())
```

### 4.2 Database Optimization

**Professional Database Patterns:**
```typescript
// server/api/routers/analytics.ts
import { router, protectedProcedure } from '../trpc'
import { z } from 'zod'

export const analyticsRouter = router({
  getDashboardStats: protectedProcedure
    .meta({ cacheTtl: 300, cacheTags: ['analytics'] })
    .query(async ({ ctx }) => {
      // Optimized parallel queries
      const [
        userStats,
        postStats,
        revenueStats,
        topPosts,
      ] = await Promise.all([
        // User analytics
        ctx.db.user.aggregate({
          _count: true,
          where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
        }),
        
        // Post analytics with efficient grouping
        ctx.db.post.aggregate({
          _count: { id: true },
          _avg: { viewCount: true },
          where: { 
            published: true,
            createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
          },
        }),
        
        // Revenue analytics (if applicable)
        ctx.db.$queryRaw<Array<{ total: number }>>`
          SELECT COALESCE(SUM(amount), 0) as total
          FROM payments
          WHERE status = 'completed'
          AND created_at >= NOW() - INTERVAL '30 days'
        `,
        
        // Top performing posts
        ctx.db.post.findMany({
          take: 5,
          where: { published: true },
          select: {
            id: true,
            title: true,
            viewCount: true,
            _count: { select: { likes: true, comments: true } },
          },
          orderBy: [
            { viewCount: 'desc' },
            { createdAt: 'desc' },
          ],
        }),
      ])

      return {
        users: {
          total: userStats._count,
          growth: 12.5, // Calculate actual growth
        },
        posts: {
          total: postStats._count.id,
          averageViews: Math.round(postStats._avg.viewCount || 0),
        },
        revenue: {
          total: revenueStats[0]?.total || 0,
          growth: 8.3, // Calculate actual growth
        },
        topPosts,
      }
    }),

  getPostAnalytics: protectedProcedure
    .input(z.object({
      postId: z.string(),
      timeRange: z.enum(['7d', '30d', '90d']).default('30d'),
    }))
    .query(async ({ ctx, input }) => {
      const days = input.timeRange === '7d' ? 7 : input.timeRange === '30d' ? 30 : 90
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

      // Efficient analytics query with window functions
      const analytics = await ctx.db.$queryRaw<Array<{
        date: Date
        views: number
        likes: number
        comments: number
      }>>`
        SELECT 
          DATE(created_at) as date,
          COUNT(CASE WHEN event_type = 'view' THEN 1 END) as views,
          COUNT(CASE WHEN event_type = 'like' THEN 1 END) as likes,
          COUNT(CASE WHEN event_type = 'comment' THEN 1 END) as comments
        FROM post_events
        WHERE post_id = ${input.postId}
        AND created_at >= ${startDate}
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `

      return analytics
    }),
})
```

### 4.3 Real-time Features

**Professional WebSocket Integration:**
```typescript
// server/websocket.ts - WebSocket server setup
import { WebSocketServer } from 'ws'
import { applyWSSHandler } from '@trpc/server/adapters/ws'
import { appRouter } from './api/root'
import { createContext } from './api/context'

const wss = new WebSocketServer({ port: 3001 })

const handler = applyWSSHandler({
  wss,
  router: appRouter,
  createContext,
  keepAlive: {
    enabled: true,
    pingMs: 30000,
    pongWaitMs: 5000,
  },
})

wss.on('connection', (ws) => {
  console.log(`➕➕ Connection (${wss.clients.size})`)
  ws.once('close', () => {
    console.log(`➖➖ Connection (${wss.clients.size})`)
  })
})

console.log('✅ WebSocket Server listening on ws://localhost:3001')

process.on('SIGTERM', () => {
  console.log('SIGTERM')
  handler.broadcastReconnectNotification()
  wss.close()
})

// Real-time hooks
// hooks/use-realtime.ts
import { useEffect, useState } from 'react'
import { api } from '@/trpc/react'

export function useRealtimePost(postId: string) {
  const [post, setPost] = useState<any>(null)
  
  // Subscribe to real-time updates
  api.post.onUpdate.useSubscription(
    { postId },
    {
      onData: (data) => {
        if (data.type === 'post_updated') {
          setPost(data.post)
        }
      },
      onError: (error) => {
        console.error('Subscription error:', error)
      },
    }
  )

  // Initial data fetch
  const { data: initialPost } = api.post.getById.useQuery({ id: postId })

  useEffect(() => {
    if (initialPost && !post) {
      setPost(initialPost)
    }
  }, [initialPost, post])

  return post
}

// Real-time chat component
export function RealtimeChat({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [onlineUsers, setOnlineUsers] = useState<User[]>([])

  // Subscribe to chat messages
  api.chat.subscribe.useSubscription(
    { roomId },
    {
      onData: (event) => {
        switch (event.type) {
          case 'message':
            setMessages(prev => [...prev, event.message])
            break
          case 'user_joined':
            setOnlineUsers(prev => [...prev, event.user])
            break
          case 'user_left':
            setOnlineUsers(prev => prev.filter(u => u.id !== event.user.id))
            break
          case 'typing_start':
            // Handle typing indicator
            break
          case 'typing_end':
            // Handle typing indicator
            break
        }
      },
    }
  )

  const sendMessage = api.chat.sendMessage.useMutation()

  return (
    <div className="flex flex-col h-96 border rounded-lg">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map(message => (
          <div key={message.id} className="mb-2">
            <span className="font-medium">{message.author.name}: </span>
            <span>{message.content}</span>
          </div>
        ))}
      </div>
      
      <div className="border-t p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            const content = formData.get('message') as string
            if (content.trim()) {
              sendMessage.mutate({ roomId, content })
              e.currentTarget.reset()
            }
          }}
        >
          <input
            name="message"
            type="text"
            placeholder="Type a message..."
            className="w-full px-3 py-2 border rounded"
          />
        </form>
      </div>
      
      <div className="border-t px-4 py-2 text-sm text-gray-500">
        {onlineUsers.length} users online
      </div>
    </div>
  )
}
```

## 5. Production Deployment

### 5.1 Environment Configuration

**Professional Environment Setup:**
```typescript
// lib/env.ts - Type-safe environment variables
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  
  // Database
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url().optional(),
  
  // Authentication
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url(),
  
  // OAuth providers
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),
  
  // Redis
  REDIS_URL: z.string().url(),
  
  // File uploads
  UPLOADTHING_SECRET: z.string().min(1),
  UPLOADTHING_APP_ID: z.string().min(1),
  
  // External APIs
  OPENAI_API_KEY: z.string().min(1).optional(),
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
  
  // Monitoring
  SENTRY_DSN: z.string().url().optional(),
  AXIOM_TOKEN: z.string().min(1).optional(),
  
  // Feature flags
  ENABLE_ANALYTICS: z.string().transform(val => val === 'true').default('false'),
  ENABLE_SUBSCRIPTIONS: z.string().transform(val => val === 'true').default('false'),
})

const env = envSchema.parse(process.env)

export { env }

// next.config.js - Production configuration
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    ppr: true, // Partial Prerendering
    reactCompiler: true, // React 19 compiler
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    domains: ['uploadthing.com', 'utfs.io'],
  },
  
  // Bundle analyzer
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config) => {
      config.plugins.push(
        new (require('@next/bundle-analyzer'))({
          enabled: true,
          openAnalyzer: false,
        })
      )
      return config
    },
  }),
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

### 5.2 Monitoring and Observability

**Professional Monitoring Setup:**
```typescript
// lib/monitoring.ts
import { TRPCError } from '@trpc/server'

// Error tracking middleware
export const errorTrackingMiddleware = t.middleware(async ({ next, path, type, input }) => {
  try {
    return await next()
  } catch (cause) {
    // Log to monitoring service
    if (process.env.NODE_ENV === 'production') {
      console.error({
        message: 'tRPC Error',
        path,
        type,
        input,
        error: cause instanceof Error ? cause.message : 'Unknown error',
        stack: cause instanceof Error ? cause.stack : undefined,
        timestamp: new Date().toISOString(),
      })
      
      // Send to external monitoring (Sentry, LogRocket, etc.)
      // await monitoring.captureException(cause, { path, type, input })
    }
    
    throw cause
  }
})

// Performance monitoring
export const performanceMiddleware = t.middleware(async ({ next, path, type }) => {
  const start = performance.now()
  const result = await next()
  const duration = performance.now() - start
  
  // Log slow queries
  if (duration > 1000) {
    console.warn(`Slow tRPC call: ${type} ${path} took ${duration.toFixed(2)}ms`)
  }
  
  // Metrics collection
  if (process.env.NODE_ENV === 'production') {
    // await metrics.histogram('trpc_duration', duration, { path, type })
  }
  
  return result
})

// Health check endpoints
// app/api/health/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/server/db'

export async function GET() {
  try {
    // Check database connection
    await db.$queryRaw`SELECT 1`
    
    // Check Redis connection
    // await redis.ping()
    
    // Check external services
    // await fetch('https://api.example.com/health')
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version,
    })
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    )
  }
}
```

## 6. Testing Strategies

### 6.1 Comprehensive Testing

**Professional Testing Implementation:**
```typescript
// __tests__/trpc/post.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createCaller } from '@/server/api/root'
import { createMockContext } from '../helpers/mock-context'

describe('Post Router', () => {
  let caller: ReturnType<typeof createCaller>
  let mockContext: ReturnType<typeof createMockContext>

  beforeEach(() => {
    mockContext = createMockContext()
    caller = createCaller(mockContext)
  })

  describe('getAll', () => {
    it('should return paginated posts', async () => {
      const mockPosts = [
        { id: '1', title: 'Post 1', published: true },
        { id: '2', title: 'Post 2', published: true },
      ]

      mockContext.db.post.findMany.mockResolvedValue(mockPosts)

      const result = await caller.post.getAll({ limit: 10 })

      expect(result.items).toEqual(mockPosts)
      expect(result.nextCursor).toBeUndefined()
      expect(mockContext.db.post.findMany).toHaveBeenCalledWith({
        take: 11,
        cursor: undefined,
        where: { published: true },
        include: expect.any(Object),
        orderBy: { createdAt: 'desc' },
      })
    })

    it('should handle search filtering', async () => {
      await caller.post.getAll({ search: 'test', limit: 10 })

      expect(mockContext.db.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            published: true,
            OR: [
              { title: { contains: 'test', mode: 'insensitive' } },
              { content: { contains: 'test', mode: 'insensitive' } },
            ],
          },
        })
      )
    })
  })

  describe('create', () => {
    it('should create a post for authenticated user', async () => {
      const postData = {
        title: 'New Post',
        content: 'Post content',
        published: false,
      }

      const mockUser = { id: 'user1', role: 'USER' }
      mockContext.session = { user: mockUser }

      const mockCreatedPost = { id: 'post1', ...postData, authorId: 'user1' }
      mockContext.db.post.create.mockResolvedValue(mockCreatedPost)

      const result = await caller.post.create(postData)

      expect(result).toEqual(mockCreatedPost)
      expect(mockContext.db.post.create).toHaveBeenCalledWith({
        data: {
          ...postData,
          authorId: 'user1',
          slug: 'new-post',
        },
        include: expect.any(Object),
      })
    })

    it('should throw error for unauthenticated user', async () => {
      mockContext.session = null

      await expect(
        caller.post.create({
          title: 'New Post',
          content: 'Content',
          published: false,
        })
      ).rejects.toThrow('Must be logged in')
    })
  })
})

// Integration tests with React Testing Library
// __tests__/integration/post-form.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TRPCReactProvider } from '@/trpc/react'
import { PostForm } from '@/components/post-form'
import { createTRPCMsw } from 'msw-trpc'
import { setupServer } from 'msw/node'
import { appRouter } from '@/server/api/root'

const trpcMsw = createTRPCMsw(appRouter)
const server = setupServer()

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('PostForm Integration', () => {
  it('should create a post successfully', async () => {
    const user = userEvent.setup()

    server.use(
      trpcMsw.post.create.mutation(() => {
        return {
          id: 'post1',
          title: 'Test Post',
          content: 'Test content',
          published: false,
        }
      })
    )

    render(
      <TRPCReactProvider cookies="">
        <PostForm />
      </TRPCReactProvider>
    )

    await user.type(screen.getByLabelText(/title/i), 'Test Post')
    await user.type(screen.getByLabelText(/content/i), 'Test content')
    await user.click(screen.getByRole('button', { name: /create/i }))

    await waitFor(() => {
      expect(screen.getByText(/post created successfully/i)).toBeInTheDocument()
    })
  })
})
```

## 7. Migration Guide

### 7.1 Upgrading from v10 to v11

**Step-by-Step Migration:**

```typescript
// 1. Update dependencies
// package.json
{
  "dependencies": {
    "@trpc/server": "^11.0.0",
    "@trpc/client": "^11.0.0",
    "@trpc/react-query": "^11.0.0",
    "@trpc/next": "^11.0.0"
  }
}

// 2. Update tRPC setup
// OLD (v10)
import { createTRPCNext } from '@trpc/next'

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      links: [
        httpBatchLink({
          url: '/api/trpc',
        }),
      ],
    }
  },
})

// NEW (v11)
import { createTRPCReact } from '@trpc/react-query'

export const api = createTRPCReact<AppRouter>()

// 3. Update client provider
// OLD (v10)
export function TRPCProvider({ children }: { children: React.ReactNode }) {
  return <trpc.Provider>{children}</trpc.Provider>
}

// NEW (v11)
export function TRPCReactProvider({ children, cookies }: { 
  children: React.ReactNode
  cookies: string 
}) {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        unstable_httpBatchStreamLink({
          url: '/api/trpc',
          headers() {
            return { cookie: cookies }
          },
        }),
      ],
    })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {children}
      </api.Provider>
    </QueryClientProvider>
  )
}

// 4. Update usage patterns
// OLD (v10)
const { data } = trpc.post.getAll.useQuery()
const mutation = trpc.post.create.useMutation()

// NEW (v11) - Same API, different import
const { data } = api.post.getAll.useQuery()
const mutation = api.post.create.useMutation()
```

## 8. Best Practices Summary

### 8.1 Performance Best Practices

1. **Use Batch Requests**: Leverage batching for multiple simultaneous queries
2. **Implement Caching**: Use Redis or similar for production caching
3. **Optimize Database Queries**: Use proper indexing and query optimization
4. **Stream Large Responses**: Use streaming for large data sets
5. **Monitor Performance**: Track query times and optimize slow endpoints

### 8.2 Security Best Practices

1. **Input Validation**: Always validate with Zod schemas
2. **Authentication**: Implement proper auth middleware
3. **Rate Limiting**: Prevent abuse with rate limiting
4. **Error Handling**: Don't expose sensitive information in errors
5. **CORS Configuration**: Properly configure CORS for production

### 8.3 Development Best Practices

1. **Type Safety**: Leverage TypeScript fully
2. **Testing**: Comprehensive unit and integration tests
3. **Documentation**: Document complex procedures
4. **Error Boundaries**: Implement proper error handling
5. **Monitoring**: Set up proper observability

This comprehensive guide provides enterprise-grade patterns for building modern, type-safe, and performant applications with tRPC v11, React 19, and Next.js 15.# tRPC v11 with React 19 & Next.js 15 - Modern Full-Stack Development

