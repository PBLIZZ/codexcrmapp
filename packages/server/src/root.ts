import { contactRouter } from './routers/contact';
import { groupRouter } from './routers/group';
import { storageRouter } from './routers/storage';
import { router } from './trpc';

export const appRouter = router({
  contacts: contactRouter, // Contact router (preferred)
  groups: groupRouter, // Groups management router
  storage: storageRouter, // Storage router for file uploads
});
export type AppRouter = typeof appRouter;