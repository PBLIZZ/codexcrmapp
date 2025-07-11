// path: apps/web/lib/trpc/client.ts

import { createTRPCReact, type CreateTRPCReact } from '@trpc/react-query';

// Import the AppRouter *type* from your business logic package
import type { AppRouter } from '@codexcrm/api/root';

// This is the one-line fix.
// We are explicitly annotating the type of the `trpc` constant.
export const trpc: CreateTRPCReact<AppRouter, unknown> = createTRPCReact<AppRouter>();
