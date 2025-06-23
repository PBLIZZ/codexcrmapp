/**
 * Re-export server-side auth utilities from the shared auth package
 * This keeps the same API but uses the centralized implementation
 */

export { 
  requireAuth, 
  getAuthUser, 
  getUserId, 
  isAuthenticated, 
  getUserEmail,
  createAuthServerClient,
  AuthAPI
} from '@codexcrm/auth';