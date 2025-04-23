import { router } from './trpc';
import { clientRouter } from './routers/client'; // implement later

export const appRouter = router({
  clients: clientRouter, // Renamed from 'client' to avoid collision with built-in methods
});
export type AppRouter = typeof appRouter;