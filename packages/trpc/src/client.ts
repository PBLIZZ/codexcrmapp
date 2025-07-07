import { createTRPCReact } from '@trpc/react-query';

// Version 2 - Adding version to force client refresh
export const api = createTRPCReact();

/** @file /packages/trpc/src/client.ts */

/** @file /packages/trpc/src/client.ts */

// Add explicit type for the API client
export type Api = typeof api;

// Add the current timestamp to ensure fresh client on each load
export const API_VERSION = Date.now();
