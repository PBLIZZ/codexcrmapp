import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

// Import the main AppRouter and context creation function using the correct path aliases
import { appRouter } from '@codexcrm/server';
import { createContext } from '@codexcrm/server';

export const runtime = 'edge'; // or delete for default Node

export const GET = (req: Request) =>
  fetchRequestHandler({ endpoint: '/api/trpc', req, router: appRouter, createContext });

export const POST = GET;