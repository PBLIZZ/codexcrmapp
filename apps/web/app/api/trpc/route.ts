import { createNextRouteHandler } from '@trpc/server/adapters/next';
import superjson from 'superjson';
import { appRouter } from '../../../../../packages/server/routers';
import { createContext } from '../../../../../packages/server/trpc';

/**
 * Next.js Route Handler for tRPC
 */
export const GET = handler;
export const POST = handler;

const handler = createNextRouteHandler({
  router: appRouter,
  createContext,
  transformer: superjson,
});