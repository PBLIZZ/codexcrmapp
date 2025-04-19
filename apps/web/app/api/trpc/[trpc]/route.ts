import { createNextHandler } from '@trpc/next/app-router';
import { appRouter } from '../../../../../../packages/server/routers';
import { createContext } from '../../../../../../packages/server/trpc';

const handler = createNextHandler({
  router: appRouter,
  createContext,
});

export { handler as GET, handler as POST };
