# Next.js Best Practices - Professional Implementation Guide

## Document Information
- **Name**: nextjs-best-practices.mdc
- **Description**: Comprehensive best practices for Next.js applications and routing
- **File Patterns**: `**/*.{ts,tsx}`
- **Always Apply**: true

## Executive Summary

This document establishes enterprise-grade standards for Next.js development, focusing on performance optimization, scalability, and maintainability. These practices ensure consistent code quality across development teams and provide a foundation for Model Context Protocol (MCP) compliance.

## 1. App Router Implementation Strategy

### 1.1 Migration and Adoption Guidelines

**Recommended Approach:**
- Prioritize App Router for all new features and pages
- Implement incremental migration strategy for existing Pages Router applications
- Establish clear routing conventions and file organization standards

**Implementation Standards:**
```typescript
// app/layout.tsx - Root layout implementation
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s | Company Name',
    default: 'Company Name - Professional Solutions'
  },
  description: 'Professional enterprise application',
  keywords: ['enterprise', 'professional', 'solutions'],
  authors: [{ name: 'Development Team' }],
  creator: 'Company Name',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div id="app-root">
          {children}
        </div>
      </body>
    </html>
  )
}
```

### 1.2 Route Organization Standards

**Directory Structure:**
```
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   └── register/
│       └── page.tsx
├── (dashboard)/
│   ├── analytics/
│   │   └── page.tsx
│   └── settings/
│       └── page.tsx
├── api/
│   ├── auth/
│   │   └── route.ts
│   └── users/
│       └── route.ts
├── globals.css
├── layout.tsx
└── page.tsx
```

## 2. Error Boundary Implementation

### 2.1 Production-Ready Error Boundaries

**Global Error Boundary:**
```typescript
// app/error.tsx
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Application Error:', error)
    
    // Send to error tracking service
    if (typeof window !== 'undefined') {
      // Example: Sentry, LogRocket, etc.
      // errorTrackingService.captureException(error)
    }
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <AlertTriangle className="mx-auto h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-muted-foreground mb-6">
          We apologize for the inconvenience. Our team has been notified.
        </p>
        <div className="space-y-2">
          <Button onClick={reset} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Return to Home
          </Button>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm font-medium">
              Error Details (Development Only)
            </summary>
            <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}
```

### 2.2 Component-Level Error Boundaries

**Custom Error Boundary Component:**
```typescript
// components/error-boundary.tsx
'use client'

import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo)
    
    // Log to monitoring service
    console.error('Error Boundary caught an error:', error, errorInfo)
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback
      
      if (FallbackComponent) {
        return <FallbackComponent error={this.state.error} retry={this.retry} />
      }

      return (
        <div className="p-4 border border-destructive rounded-lg">
          <h3 className="font-semibold text-destructive mb-2">Component Error</h3>
          <p className="text-sm text-muted-foreground mb-3">
            This component encountered an error and couldn't render properly.
          </p>
          <button
            onClick={this.retry}
            className="text-sm bg-primary text-primary-foreground px-3 py-1 rounded"
          >
            Retry
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
```

## 3. Performance Optimization Standards

### 3.1 Image Optimization Implementation

**Professional Image Component:**
```typescript
// components/optimized-image.tsx
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  ...props
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      sizes={sizes}
      quality={quality}
      priority={priority}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      className={cn('object-cover', className)}
      {...props}
    />
  )
}
```

### 3.2 Code Splitting and Dynamic Imports

**Strategic Component Loading:**
```typescript
// Dynamic imports for large components
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Lazy load heavy components
const ChartComponent = dynamic(() => import('@/components/charts/chart'), {
  loading: () => <div className="animate-pulse bg-muted h-64 rounded" />,
  ssr: false, // Disable SSR for client-only components
})

const DataVisualization = dynamic(
  () => import('@/components/data-visualization'),
  {
    loading: () => (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    ),
  }
)

// Usage in component
export default function Dashboard() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<div>Loading dashboard...</div>}>
        <ChartComponent />
        <DataVisualization />
      </Suspense>
    </div>
  )
}
```

## 4. Data Fetching Best Practices

### 4.1 Server Components Data Fetching

**Professional Data Fetching Pattern:**
```typescript
// app/dashboard/page.tsx
import { Suspense } from 'react'
import { notFound } from 'next/navigation'

interface DashboardData {
  analytics: AnalyticsData
  recentActivity: Activity[]
  userProfile: UserProfile
}

async function getDashboardData(): Promise<DashboardData> {
  try {
    const [analytics, activity, profile] = await Promise.all([
      fetch('/api/analytics', { next: { revalidate: 300 } }).then(res => res.json()),
      fetch('/api/activity', { next: { revalidate: 60 } }).then(res => res.json()),
      fetch('/api/profile', { next: { revalidate: 3600 } }).then(res => res.json()),
    ])

    return { analytics, recentActivity: activity, userProfile: profile }
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
    throw new Error('Failed to load dashboard data')
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  if (!data) {
    notFound()
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent data={data} />
      </Suspense>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="animate-pulse bg-muted h-32 rounded-lg" />
      ))}
    </div>
  )
}
```

### 4.2 Client-Side Data Fetching

**SWR Implementation Pattern:**
```typescript
// hooks/use-dashboard-data.ts
import useSWR from 'swr'

interface UseDashboardDataOptions {
  refreshInterval?: number
  revalidateOnFocus?: boolean
}

export function useDashboardData(options: UseDashboardDataOptions = {}) {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/dashboard',
    async (url: string) => {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }
      return response.json()
    },
    {
      refreshInterval: options.refreshInterval ?? 30000, // 30 seconds
      revalidateOnFocus: options.revalidateOnFocus ?? true,
      errorRetryCount: 3,
      errorRetryInterval: 1000,
    }
  )

  return {
    data,
    isLoading,
    isError: error,
    refresh: mutate,
  }
}
```

## 5. Metadata and SEO Implementation

### 5.1 Dynamic Metadata Generation

**Professional Metadata Setup:**
```typescript
// app/blog/[slug]/page.tsx
import { Metadata } from 'next'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested post could not be found.',
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: post.author.name }],
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://yoursite.com/blog/${params.slug}`,
      siteName: 'Your Site Name',
      images: [
        {
          url: post.featuredImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage],
      creator: '@yourhandle',
    },
    robots: {
      index: post.published,
      follow: true,
      googleBot: {
        index: post.published,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}
```

## 6. Configuration Standards

### 6.1 Production-Ready next.config.js

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
    optimizeCss: true,
    webpackBuildWorker: true,
  },

  // Image optimization
  images: {
    domains: ['your-cdn.example.com', 'images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Headers for security and performance
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
        ],
      },
    ]
  },

  // Webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      }
    }

    return config
  },

  // Bundle analyzer (development only)
  ...(process.env.ANALYZE === 'true' && {
    experimental: {
      bundlePagesRouterDependencies: true,
    },
  }),

  // Compression and performance
  compress: true,
  poweredByHeader: false,
  generateEtags: true,

  // Redirects and rewrites
  async redirects() {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
```

## 7. Monitoring and Analytics

### 7.1 Performance Monitoring Setup

```typescript
// lib/monitoring.ts
export function reportWebVitals(metric: any) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vital:', metric)
  }

  // Send to analytics service
  if (typeof window !== 'undefined') {
    // Example: Google Analytics, Vercel Analytics, etc.
    // analytics.track('Web Vital', {
    //   metric_name: metric.name,
    //   metric_value: metric.value,
    //   metric_id: metric.id,
    //   metric_label: metric.label,
    // })
  }
}
```

## 8. Quality Assurance Checklist

### 8.1 Pre-Production Verification

- [ ] App Router implementation complete
- [ ] Error boundaries implemented at page and component levels
- [ ] Image optimization configured and tested
- [ ] Dynamic imports implemented for heavy components
- [ ] Metadata generation working for all routes
- [ ] Performance monitoring configured
- [ ] Security headers implemented
- [ ] Bundle size optimization verified
- [ ] Accessibility standards met
- [ ] SEO optimization complete

### 8.2 Performance Benchmarks

**Target Metrics:**
- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- First Input Delay (FID): < 100ms
- Cumulative Layout Shift (CLS): < 0.1
- Time to Interactive (TTI): < 3.8s

## 9. Maintenance and Updates

### 9.1 Regular Maintenance Tasks

**Monthly:**
- Update Next.js to latest stable version
- Review and update dependencies
- Analyze bundle size and optimize
- Review error logs and fix issues

**Quarterly:**
- Performance audit and optimization
- Security audit and updates
- Code review and refactoring
- Documentation updates

This document serves as the authoritative guide for Next.js development within the organization. All team members are expected to follow these standards to ensure consistent, high-quality code delivery and optimal application performance.