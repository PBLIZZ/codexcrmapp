/**
 * This file is a re-export from src/lib/trpc/client.ts
 * which centralizes all tRPC client setup for better organization
 */

// Re-export the tRPC client from the correct path alias
// Re-export AppRouter type for direct use in components if needed
import type { AppRouter } from '@codexcrm/server/src/root';

export { api, API_VERSION } from './trpc/client';

// Re-export as trpc for backward compatibility
export { trpc } from '../../app/providers';

// Re-export types for inputs and outputs
export type { RouterInputs, RouterOutputs } from '../../app/providers';
export type { AppRouter };
