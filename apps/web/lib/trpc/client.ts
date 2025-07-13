import type { AppRouter } from './root';
import { createTRPCReact } from '@trpc/react-query';

export const api = createTRPCReact<AppRouter>();

// API version for debugging and cache busting
export const API_VERSION = '1.0.0';
