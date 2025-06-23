import type { AppRouter } from '@codexcrm/api/src/root';
import { createTRPCReact } from '@trpc/react-query';

// Version 2 - Adding version to force client refresh
export const api = createTRPCReact<AppRouter>();

// Add the current timestamp to ensure fresh client on each load
export const API_VERSION = Date.now();
