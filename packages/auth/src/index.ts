/**
 * Main entry point for the @codexcrm/auth package.
 * Exports the AuthProvider component and the useAuth hook.
 * The actual implementation is now located in apps/web/provider.tsx
 * to resolve module path issues and keep client-specific Supabase logic
 * within the web application.
 */

// Re-export from the new location in apps/web
export { AuthProvider, useAuth } from '@/Provider';
// If AuthContext needs to be exported directly for some advanced use cases:
// export { AuthContext } from '@/provider';
