import type { AppRouter } from './types';
import { createTRPCReact } from '@trpc/react-query';

export const api = createTRPCReact<AppRouter>();

// API version for debugging and cache busting
export const API_VERSION = '1.0.0';
