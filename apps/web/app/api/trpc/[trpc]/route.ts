import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import superjson from 'superjson';

// Import the main AppRouter and context creation function using the correct path aliases
import { appRouter, createContext } from '@codexcrm/server';

export const runtime = 'edge'; // or delete for default Node

export const GET = async (req: Request) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext,
    transformer: superjson,
    onError:
      process.env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            console.error(`❌ tRPC failed on ${path}: ${error}`)
          }
        : undefined,
  });
};

// Use the same handler for POST requests
export const POST = GET;