import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

// Use dynamic imports to correctly reference the server packages
// This approach works better with monorepo setups where path aliases might not be properly configured
// Import the main AppRouter
import { appRouter } from '@codexcrm/server/src/root';
// Import the context creation function
import { createContext } from '@codexcrm/server/src/context';
/**
 * Next.js App Router Route Handler for tRPC
 */
const handler = async (req: Request) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createContext({ req }),
    onError: 
      process.env.NODE_ENV === 'development'
        ? ({ path, error }: { path: string | undefined; error: Error }) => {
            console.error(`❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`);
          }
        : undefined,
  });
};

export { handler as GET, handler as POST };