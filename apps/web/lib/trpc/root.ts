import { contactRouter } from './routers/contact';
import { storageRouter } from './routers/storage';
import { router } from './trpc';

export const appRouter = router({
  contacts: contactRouter, // Contact router (preferred)
  storage: storageRouter, // Storage router for file uploads
});
export type AppRouter = typeof appRouter;
