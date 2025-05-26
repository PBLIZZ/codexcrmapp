import { clientRouter } from './routers/client';
import { contactRouter } from './routers/contact';
import { groupRouter } from './routers/group';
import { router } from './trpc';

export const appRouter = router({
  clients: clientRouter, // Original client router (keeping for backward compatibility)
  contacts: contactRouter, // New contact router with updated naming
  groups: groupRouter, // Groups management router
});
export type AppRouter = typeof appRouter;