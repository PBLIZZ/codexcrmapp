
import type { AppRouter } from '@codexcrm/server/src/root';

export { api, API_VERSION } from './trpc/client';

// Re-export as trpc for backward compatibility
export { trpc } from '../app/Providers';

// Re-export types for inputs and outputs
export type { RouterInputs, RouterOutputs } from '../app/Providers';
export type { AppRouter };
