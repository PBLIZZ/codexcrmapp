/** @file /packages/auth/src/index.ts */

/**
 * @codexcrm/auth
 * 
 * This package provides framework-agnostic auth utilities for Supabase.
 * It only contains client-side auth logic and shared utilities.
 * 
 * For Next.js server-side auth, use the server utilities in apps/web/lib/auth/server.ts
 */

// Export the browser client creator for use in Client Components
export { createBrowserClient } from './client';

// Re-export any shared types or other framework-agnostic utilities
export * from './service';