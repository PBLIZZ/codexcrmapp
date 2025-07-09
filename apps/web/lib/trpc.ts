
import type { AppRouter } from '@codexcrm/server';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

export { api, API_VERSION } from './trpc/client';

// Export types directly
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type { AppRouter };
