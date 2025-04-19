import { router } from '../trpc';
import { clientRouter } from './client';

export const appRouter = router({
  client: clientRouter,
});

export type AppRouter = typeof appRouter;