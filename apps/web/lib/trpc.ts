/**
 * This file is a re-export from src/lib/trpc/client.ts
 * which centralizes all tRPC client setup for better organization
 */

// Re-export the tRPC client from the correct path alias
// Re-export AppRouter type from the correct local path
import type { AppRouter } from '@/lib/trpc/root';

export { api } from './trpc/client';

// Re-export types for inputs and outputs
export type { RouterInputs, RouterOutputs } from '../app/providers';
export type { AppRouter };
