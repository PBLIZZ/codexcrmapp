import type { AppRouter } from './root';
import { createTRPCReact } from '@trpc/react-query';

export const api = createTRPCReact<AppRouter>();
