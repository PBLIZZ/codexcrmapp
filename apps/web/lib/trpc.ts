/**
 * This file is a re-export from lib/trpc/client.ts
 * which centralizes all tRPC client setup for better organization
 */

// Re-export the tRPC client from the correct path
export { api, API_VERSION } from './trpc/client';

// Re-export AppRouter type for direct use in components if needed
export type { AppRouter } from './trpc/root';

// Re-export types for inputs and outputs
export type { RouterInputs, RouterOutputs } from '../app/providers';
