/**
 * Main entry point for the @codexcrm/auth package.
 * Exports the AuthProvider component and the useAuth hook.
 * The actual implementation is now located in apps/web/provider.tsx
 * to resolve module path issues and keep client-specific Supabase logic
 * within the web application.
 */
export { AuthProvider, useAuth } from '@/provider';
//# sourceMappingURL=index.d.ts.map