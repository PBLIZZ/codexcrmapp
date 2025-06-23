import type { AppRouter } from '@codexcrm/api/src/root';

export { api, API_VERSION } from './trpc/client';

// Re-export as trpc for backward compatibility
export { trpc } from '../app/providers';

// Re-export types for inputs and outputs
export type { RouterInputs, RouterOutputs } from '../app/providers';
export type { AppRouter };
