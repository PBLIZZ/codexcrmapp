import { router } from './trpc';
import { clientRouter } from './routers/client'; // implement later

export const appRouter = router({
  client: clientRouter,
});
export type AppRouter = typeof appRouter;