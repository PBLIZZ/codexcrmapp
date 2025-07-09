// path: apps/web/lib/trpc/client.ts
import { createTRPCReact } from '@trpc/react-query';

// Import the AppRouter *type* from your business logic package
import type { AppRouter } from '@codexcrm/api/root';

export const trpc = createTRPCReact<AppRouter>({});
