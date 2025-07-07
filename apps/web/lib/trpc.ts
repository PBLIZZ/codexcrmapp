import type { AppRouter } from '@codexcrm/api/src/root';
import { api, API_VERSION } from '@codexcrm/trpc';

export { api, API_VERSION };

// Define Api type locally since importing isn't working
export type Api = typeof api;

// Re-export types for inputs and outputs
export type { RouterInputs, RouterOutputs } from '../app/providers';
export type { AppRouter };
