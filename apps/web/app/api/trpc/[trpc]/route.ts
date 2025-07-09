// path: apps/web/app/api/trpc/[trpc]/route.ts
// This file is the bridge between the Next.js world and our pure API.

import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

// Import the PURE context creator and the appRouter from our business logic package.
import { appRouter } from '@codexcrm/api/root';
// Import directly from the source file instead of through the package index
import { createInnerTRPCContext } from '@codexcrm/api/src/context';
import { AnyRouter } from '@trpc/server';

/**
 * This is the tRPC request handler.
 * It's responsible for all Next.js-specific logic.
 */
const handler = (req: NextRequest) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter as unknown as AnyRouter,

    /**
     * This is the CONTEXT FACTORY. It runs for every incoming request.
     * It performs the framework-specific task of getting the session and
     * then uses that session to create the pure, framework-agnostic context
     * that our business logic expects.
     */
    createContext: async () => {
      // 1. Create a Supabase client using the Next.js `cookies` helper.
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get: async (name: string) => {
              const cookiesStore = await cookies();
              return cookiesStore.get(name)?.value;
            },
          },
        }
      );

      // 2. Fetch the session.
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // 3. Create the pure "inner" context and return it.
      // This context object (`{ prisma, session }`) is what will be passed
      // to all of your tRPC procedures in `@codexcrm/api`.
      return createInnerTRPCContext(session);
    },
  });
};

export { handler as GET, handler as POST };
