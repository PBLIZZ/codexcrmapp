import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../../packages/server/routers';
import superjson from 'superjson';
import { httpBatchLink } from '@trpc/client';

/**
 * A set of React Query hooks for tRPC
 */
export const trpc = createTRPCReact<AppRouter>();

/**
 * The tRPC client for use in Providers
 */
export const trpcClient = trpc.createClient({
  transformer: superjson,
  links: [
    httpBatchLink({ url: '/api/trpc' }),
  ],
});