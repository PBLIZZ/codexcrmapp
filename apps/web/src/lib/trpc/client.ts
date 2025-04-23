import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@codexcrm/server/src/root';

export const api = createTRPCReact<AppRouter>();