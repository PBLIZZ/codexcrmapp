import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import superjson from 'superjson';

// Import the main AppRouter and context creation function using the correct path aliases
import { appRouter, createContext } from '@codexcrm/server';

export const runtime = 'edge'; // or delete for default Node

export const GET = async (req: Request) => {
  // Add better error handling and debugging for tRPC API route handler
  try {
    return fetchRequestHandler({
      endpoint: '/api/trpc',
      req,
      router: appRouter,
      // Pass the request object to createContext
      createContext: async () => createContext({ req }),
      // Removed transformer property as it's already set in the router's create method
      onError:
        process.env.NODE_ENV === 'development'
          ? ({ path, error }) => {
              console.error(`❌ tRPC failed on ${path}: ${error.message}`);
              console.error(error.stack);
            }
          : undefined,
    });
  } catch (error) {
    console.error('Unhandled error in tRPC API route:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
};

// Use the same handler for POST requests
export const POST = GET;