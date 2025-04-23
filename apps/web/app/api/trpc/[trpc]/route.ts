import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

// Import the main AppRouter and context creation function using the correct path aliases
import { appRouter } from '@codexcrm/server';
import { createContext } from '@codexcrm/server';

export const runtime = 'edge'; // or delete for default Node

export const GET = async (req: Request) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createContext(),
    onError:
      process.env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            console.error(`❌ tRPC failed on ${path}: ${error}`)
          }
        : undefined,
  });
};

export const POST = GET;